/**
 * Auditoría visual y técnica del sitio exportado.
 *
 * Levanta Chrome en modo headless con el protocolo DevTools y, para cada ruta
 * y cada tamaño de pantalla, comprueba:
 *   - desbordamiento horizontal (scrollWidth > innerWidth)
 *   - errores de consola y excepciones no capturadas
 *   - presencia de <h1>, title y metadescripción
 *   - número de imágenes sin atributo alt
 *
 * Además guarda una captura de pantalla de cada combinación.
 *
 * Uso: node scripts/audit.mjs [--shots]
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:4173';
const CHROME =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SHOT_DIR = resolve(process.cwd(), '..', 'shots');
const WANT_SHOTS = process.argv.includes('--shots');

const ROUTES = ['/', '/habitaciones', '/cafeteria', '/ubicacion', '/contacto', '/preguntas-frecuentes'];
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, method = 'GET') {
  const response = await fetch(url, { method });
  return response.json();
}

class CdpSession {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve: res, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else res(message.result);
      } else if (message.method) {
        this.events.push(message);
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, reject) => {
      this.pending.set(id, { resolve: res, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`Timeout en ${method}`));
        }
      }, 30000);
    });
  }

  drain() {
    const events = this.events;
    this.events = [];
    return events;
  }
}

async function main() {
  if (WANT_SHOTS) mkdirSync(SHOT_DIR, { recursive: true });

  const port = 9222 + Math.floor(Math.random() * 500);
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--disable-dev-shm-usage',
      `--remote-debugging-port=${port}`,
      '--user-data-dir=' + resolve(process.cwd(), '.chrome-audit'),
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  const cleanup = () => {
    try {
      chrome.kill();
    } catch {
      // ya estaba detenido
    }
  };
  process.on('exit', cleanup);

  // Espera a que el puerto de depuración responda.
  let version = null;
  for (let i = 0; i < 40; i += 1) {
    try {
      version = await getJson(`http://127.0.0.1:${port}/json/version`);
      break;
    } catch {
      await sleep(250);
    }
  }
  if (!version) {
    console.error('No se pudo iniciar Chrome.');
    cleanup();
    process.exit(1);
  }

  // Chrome requiere PUT para abrir una pestaña nueva.
  const target = await getJson(`http://127.0.0.1:${port}/json/new?about:blank`, 'PUT');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res);
    ws.addEventListener('error', rej);
  });

  const session = new CdpSession(ws);
  await session.send('Page.enable');
  await session.send('Runtime.enable');
  await session.send('Log.enable');
  await session.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });

  const results = [];

  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      await session.send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.width < 700,
      });

      await session.send('Page.navigate', { url: BASE + route });
      await sleep(1400);

      session.drain();

      const evaluation = await session.send('Runtime.evaluate', {
        expression: `(() => {
          const doc = document.documentElement;
          const overflowing = [...document.querySelectorAll('body *')]
            .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1.5)
            .slice(0, 6)
            .map((el) => el.tagName.toLowerCase() + '.' + (typeof el.className === 'string' ? el.className.split(' ').filter(Boolean).join('.') : ''));
          return {
            title: document.title,
            description: (document.querySelector('meta[name="description"]') || {}).content || '',
            h1: document.querySelectorAll('h1').length,
            h1Text: (document.querySelector('h1') || {}).innerText || '',
            scrollWidth: doc.scrollWidth,
            innerWidth: window.innerWidth,
            overflow: doc.scrollWidth > window.innerWidth + 1,
            overflowing,
            imagesWithoutAlt: [...document.querySelectorAll('img')].filter((i) => !i.alt).length,
            images: document.querySelectorAll('img').length,
            waLinks: document.querySelectorAll('a[href*="wa.me"]').length,
            telLinks: document.querySelectorAll('a[href^="tel:"]').length,
            jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
            title: document.title.length,
          };
        })()`,
        returnByValue: true,
      });

      const events = session.drain();
      const consoleErrors = events
        .filter(
          (e) =>
            (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') ||
            e.method === 'Runtime.exceptionThrown' ||
            (e.method === 'Log.entryAdded' && e.params.entry.level === 'error'),
        )
        .map((e) => {
          if (e.method === 'Runtime.exceptionThrown') {
            return `EXCEPCIÓN: ${e.params.exceptionDetails.text} ${
              e.params.exceptionDetails.exception?.description ?? ''
            }`;
          }
          if (e.method === 'Log.entryAdded') {
            return `LOG: ${e.params.entry.text} (${e.params.entry.url ?? ''})`;
          }
          return `CONSOLA: ${e.params.args.map((a) => a.value ?? a.description ?? '').join(' ')}`;
        });

      const data = evaluation.result.value;

      if (WANT_SHOTS) {
        const metrics = await session.send('Page.getLayoutMetrics');
        const height = Math.min(Math.ceil(metrics.cssContentSize.height), 8000);
        const shot = await session.send('Page.captureScreenshot', {
          format: 'png',
          captureBeyondViewport: true,
          clip: { x: 0, y: 0, width: viewport.width, height, scale: 1 },
        });
        const name = `${route === '/' ? 'inicio' : route.replace(/\//g, '')}-${viewport.name}.png`;
        writeFileSync(resolve(SHOT_DIR, name), Buffer.from(shot.data, 'base64'));
      }

      results.push({ route, viewport: viewport.name, ...data, consoleErrors });
    }
  }

  ws.close();
  cleanup();

  // --- Informe ---
  let problems = 0;
  for (const r of results) {
    const issues = [];
    if (r.overflow) issues.push(`DESBORDA (${r.scrollWidth} > ${r.innerWidth})`);
    if (r.h1 !== 1) issues.push(`H1 = ${r.h1}`);
    if (!r.description) issues.push('SIN metadescripción');
    if (r.imagesWithoutAlt > 0) issues.push(`${r.imagesWithoutAlt} img sin alt`);
    if (r.consoleErrors.length > 0) issues.push(`${r.consoleErrors.length} errores de consola`);
    if (r.waLinks === 0) issues.push('sin enlaces de WhatsApp');

    if (issues.length > 0) problems += 1;

    console.log(
      `${issues.length === 0 ? 'OK  ' : 'WARN'} ${r.route.padEnd(24)} ${r.viewport.padEnd(8)} ` +
        `${String(r.scrollWidth).padStart(5)}px  h1=${r.h1}  wa=${r.waLinks}  tel=${r.telLinks}  ` +
        `ld+json=${r.jsonLd}  ${issues.join(' | ')}`,
    );
    for (const error of r.consoleErrors) console.log(`       ↳ ${error}`);
    if (r.overflow && r.overflowing.length > 0) {
      console.log(`       ↳ desbordan: ${r.overflowing.join(' , ')}`);
    }
  }

  console.log(`\n${results.length} comprobaciones · ${problems} con observaciones.`);
  console.log(`Capturas: ${SHOT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
