/**
 * Comprueba la navegación entre páginas dentro de la SPA (sin recargar) y
 * registra las peticiones que fallan.
 * Uso: node scripts/test-navigation.mjs
 */
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:4173';
const CHROME =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, passed, detail = '') => {
  results.push(passed);
  console.log(`${passed ? 'OK  ' : 'FALLA'} ${name}${detail ? `  → ${detail}` : ''}`);
};

const port = 9600 + Math.floor(Math.random() * 300);
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=' + resolve(process.cwd(), '.chrome-nav'),
    'about:blank',
  ],
  { stdio: 'ignore' },
);
process.on('exit', () => {
  try {
    chrome.kill();
  } catch {
    /* ya detenido */
  }
});

for (let i = 0; i < 40; i += 1) {
  try {
    await fetch(`http://127.0.0.1:${port}/json/version`);
    break;
  } catch {
    await sleep(250);
  }
}

const target = await (
  await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })
).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener('open', res);
  ws.addEventListener('error', rej);
});

let id = 0;
const pending = new Map();
const failures = [];
const requests = [];
ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve: res, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else res(message.result);
  } else if (message.method === 'Network.responseReceived') {
    const { response, type } = message.params;
    requests.push({ url: response.url, status: response.status, type });
    if (response.status >= 400) failures.push({ url: response.url, status: response.status });
  }
});
const send = (method, params = {}) => {
  const messageId = ++id;
  return new Promise((res, reject) => {
    pending.set(messageId, { resolve: res, reject });
    ws.send(JSON.stringify({ id: messageId, method, params }));
    setTimeout(() => {
      if (pending.has(messageId)) {
        pending.delete(messageId);
        reject(new Error(`Timeout en ${method}`));
      }
    }, 20000);
  });
};
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return result.result.value;
};

await send('Page.enable');
await send('Runtime.enable');
await send('Network.enable');

// Marca el inicio para detectar una recarga completa.
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: 'window.__navMarker = Math.random();',
});

await send('Page.navigate', { url: BASE + '/' });
await sleep(2000);

const before = await evaluate('window.__navMarker');

// Navegación con clic en el enlace de navegación del encabezado.
const after = await evaluate(`(async () => {
  const link = [...document.querySelectorAll('header a[href="/habitaciones"]')][0];
  if (!link) return { error: 'no se encontró el enlace' };
  link.click();
  await new Promise((r) => setTimeout(r, 2500));
  return {
    ruta: location.pathname,
    marcador: window.__navMarker,
    titulo: document.title,
    h1: document.querySelector('h1') ? document.querySelector('h1').innerText : null,
  };
})()`);

check(
  'La navegación interna llega a la página correcta',
  after.ruta === '/habitaciones' && (after.h1 ?? '').includes('Doce habitaciones'),
  JSON.stringify(after),
);
check(
  'La navegación es sin recarga completa (SPA)',
  after.marcador === before,
  `antes=${before} después=${after.marcador}`,
);
check(
  'El título del documento se actualiza al navegar',
  typeof after.titulo === 'string' && after.titulo.includes('Habitaciones'),
  after.titulo,
);

const rscFailures = failures.filter((f) => f.url.includes('__next') || f.url.includes('.txt'));
check(
  'No hay peticiones fallidas de payloads RSC',
  rscFailures.length === 0,
  rscFailures.map((f) => `${f.status} ${f.url.replace(BASE, '')}`).join(' | '),
);

ws.close();
try {
  chrome.kill();
} catch {
  /* ya detenido */
}

const failed = results.filter((r) => !r).length;
console.log(`\n${results.length} pruebas · ${failed} fallidas.`);
if (failed > 0) process.exit(1);
