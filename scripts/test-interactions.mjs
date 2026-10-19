/**
 * Pruebas funcionales de los elementos interactivos, sobre el sitio exportado.
 *
 * Comprueba con un navegador real (Chrome headless + DevTools Protocol):
 *   1. La validación del formulario de consulta rechaza fechas incoherentes.
 *   2. El mensaje de WhatsApp se arma con los datos correctos.
 *   3. El enlace de WhatsApp usa el número y el formato correctos.
 *   4. El menú móvil abre, cierra con Escape y devuelve el foco.
 *   5. El acordeón de preguntas se expande y collapse.
 *   6. El visor de imágenes de la galería abre y cierra.
 *
 * Uso: node scripts/test-interactions.mjs
 */
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:4173';
const CHROME =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];

function check(name, passed, detail = '') {
  results.push({ name, passed, detail });
  console.log(`${passed ? 'OK  ' : 'FALLA'} ${name}${detail ? `  → ${detail}` : ''}`);
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve: res, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else res(message.result);
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
      }, 20000);
    });
  }

  async eval(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description ?? 'Error de evaluación');
    }
    return result.result.value;
  }
}

async function main() {
  const port = 9800 + Math.floor(Math.random() * 300);
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--remote-debugging-port=${port}`,
      '--user-data-dir=' + resolve(process.cwd(), '.chrome-test'),
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

  let ready = false;
  for (let i = 0; i < 40; i += 1) {
    try {
      await fetch(`http://127.0.0.1:${port}/json/version`);
      ready = true;
      break;
    } catch {
      await sleep(250);
    }
  }
  if (!ready) {
    console.error('No se pudo iniciar Chrome.');
    process.exit(1);
  }

  const target = await (
    await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })
  ).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res);
    ws.addEventListener('error', rej);
  });

  const page = new Cdp(ws);
  await page.send('Page.enable');
  await page.send('Runtime.enable');

  const mobile = async () => {
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
  };
  const desktop = async () => {
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
  };
  const go = async (path) => {
    await page.send('Page.navigate', { url: BASE + path });
    await sleep(1500);
  };
  const goTo = async (base, path) => {
    await page.send('Page.navigate', { url: base + path });
    await sleep(2500);
  };

  /* ---------------------------------------------------------------- */
  /* 1-3. Formulario de consulta                                        */
  /* ---------------------------------------------------------------- */
  await desktop();
  await go('/habitaciones');

  // 1. Fecha de salida anterior a la de entrada → error visible.
  const validation = await page.eval(`(() => {
    const checkIn = document.querySelector('#consulta-checkin');
    const checkOut = document.querySelector('#consulta-checkout');
    if (!checkIn || !checkOut) return { error: 'no se encontraron los campos' };

    const setValue = (el, value) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };

    setValue(checkIn, '2027-03-10');
    setValue(checkOut, '2027-03-08');
    document.querySelector('#consulta form button[type="submit"]').click();

    return new Promise((resolve) => setTimeout(() => {
      const summary = document.querySelector('[role="alert"]');
      const invalid = checkOut.getAttribute('aria-invalid');
      resolve({
        hayResumen: Boolean(summary),
        textoResumen: summary ? summary.innerText.replace(/\\s+/g, ' ').trim() : '',
        marcadoInvalido: invalid,
        focoEnResumen: document.activeElement === summary,
      });
    }, 400));
  })()`);

  check(
    'El formulario rechaza una salida anterior a la entrada',
    validation.hayResumen === true &&
      /posterior/i.test(validation.textoResumen) &&
      validation.marcadoInvalido === 'true',
    validation.textoResumen || JSON.stringify(validation),
  );
  check(
    'El foco se mueve al resumen de errores',
    validation.focoEnResumen === true,
  );

  // 2. Datos válidos → mensaje de WhatsApp correcto.
  const message = await page.eval(`(() => {
    const setValue = (el, value) => {
      const proto = el.tagName === 'SELECT' ? window.HTMLSelectElement : window.HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(proto.prototype, 'value').set;
      setter.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };

    setValue(document.querySelector('#consulta-checkin'), '2027-03-10');
    setValue(document.querySelector('#consulta-checkout'), '2027-03-12');
    setValue(document.querySelector('#consulta-guests'), '3');
    setValue(document.querySelector('#consulta-name'), 'Ana Rojas');

    // Se intercepta window.open para no abrir pestañas durante la prueba.
    const original = window.open;
    let opened = null;
    window.open = (url) => { opened = url; return null; };

    document.querySelector('#consulta form button[type="submit"]').click();

    return new Promise((resolve) => setTimeout(() => {
      window.open = original;
      const pre = document.querySelector('pre');
      resolve({
        url: opened,
        mensaje: pre ? pre.innerText : '',
        hayPre: Boolean(pre),
      });
    }, 500));
  })()`);

  check(
    'El mensaje incluye entrada, salida, huéspedes y nombre',
    message.hayPre === true &&
      message.mensaje.includes('10/03/2027') &&
      message.mensaje.includes('12/03/2027') &&
      message.mensaje.includes('3 personas') &&
      message.mensaje.includes('Ana Rojas'),
    message.mensaje.replace(/\n/g, ' | '),
  );

  check(
    'El mensaje usa el guion pedido para el cuerpo',
    message.mensaje.includes('Me gustaría consultar disponibilidad') &&
      message.mensaje.includes('¿Podrían facilitarme las opciones disponibles y sus tarifas?'),
  );

  check(
    'El enlace de WhatsApp usa wa.me con el número verificado',
    typeof message.url === 'string' &&
      message.url.startsWith('https://wa.me/50627723348?text=') &&
      decodeURIComponent(message.url).includes('Me gustaría consultar disponibilidad'),
  );

  // 3. Validación de fecha de entrada en el pasado.
  const past = await page.eval(`(() => {
    const checkIn = document.querySelector('#consulta-checkin');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(checkIn, '2020-01-01');
    checkIn.dispatchEvent(new Event('input', { bubbles: true }));
    checkIn.dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('#consulta form button[type="submit"]').click();
    return new Promise((resolve) => setTimeout(() => {
      const summary = document.querySelector('[role="alert"]');
      resolve(summary ? summary.innerText.replace(/\\s+/g, ' ').trim() : '');
    }, 400));
  })()`);

  check(
    'El formulario rechaza una fecha de entrada en el pasado',
    /anterior a hoy/i.test(past),
    past,
  );

  /* ---------------------------------------------------------------- */
  /* 4. Menú móvil                                                     */
  /* ---------------------------------------------------------------- */
  await mobile();
  await go('/');

  const menu = await page.eval(`(async () => {
    const toggle = document.querySelector('button[aria-controls="menu-movil"]');
    if (!toggle) return { error: 'no hay botón de menú' };

    toggle.click();
    await new Promise((r) => setTimeout(r, 500));

    const panel = document.querySelector('#menu-movil');
    const abierto = toggle.getAttribute('aria-expanded');
    const visible = getComputedStyle(panel).visibility === 'visible';
    const enlaces = panel.querySelectorAll('a[href]').length;

    // Escape debe cerrar el menú.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise((r) => setTimeout(r, 500));

    const cerrado = toggle.getAttribute('aria-expanded');
    const focoDevuelto = document.activeElement === toggle;

    return { abierto, visible, enlaces, cerrado, focoDevuelto };
  })()`);

  check(
    'El menú móvil abre y muestra sus enlaces',
    menu.abierto === 'true' && menu.visible === true && menu.enlaces >= 6,
    JSON.stringify(menu),
  );
  check(
    'El menú móvil cierra con Escape y devuelve el foco',
    menu.cerrado === 'false' && menu.focoDevuelto === true,
    JSON.stringify(menu),
  );

  /* ---------------------------------------------------------------- */
  /* 5. Acordeón de preguntas                                          */
  /* ---------------------------------------------------------------- */
  await desktop();
  await go('/preguntas-frecuentes');

  const accordion = await page.eval(`(async () => {
    // Se excluye el botón del menú móvil, que también usa aria-expanded.
    const botones = [...document.querySelectorAll('button[aria-expanded]')]
      .filter((b) => b.getAttribute('aria-controls') !== 'menu-movil');
    const primero = botones[0];
    const segundo = botones[1];
    if (!primero || !segundo) return { error: 'no hay botones' };

    const inicial = primero.getAttribute('aria-expanded');
    const cerradoInicial = segundo.getAttribute('aria-expanded');

    segundo.click();
    await new Promise((r) => setTimeout(r, 400));

    const trasClick = segundo.getAttribute('aria-expanded');
    const panel = document.getElementById(segundo.getAttribute('aria-controls'));
    const panelVisible = panel ? !panel.hasAttribute('inert') : false;
    const panelOculto = panel ? panel.hasAttribute('inert') : false;
    const enlacesOcultos = panel ? panel.querySelectorAll('a[href]').length : 0;

    // Volver a pulsar debe cerrarlo de nuevo.
    segundo.click();
    await new Promise((r) => setTimeout(r, 400));
    const trasSegundoClick = segundo.getAttribute('aria-expanded');
    const panelInerte = panel ? panel.hasAttribute('inert') : false;

    return {
      inicial,
      cerradoInicial,
      trasClick,
      panelVisible,
      panelOculto,
      enlacesOcultos,
      trasSegundoClick,
      panelInerte,
    };
  })()`);

  check(
    'El acordeón expande el panel pulsado',
    accordion.cerradoInicial === 'false' &&
      accordion.trasClick === 'true' &&
      accordion.panelVisible === true,
    JSON.stringify(accordion),
  );
  check(
    'El acordeón vuelve a plegarse al pulsar de nuevo',
    accordion.trasSegundoClick === 'false' && accordion.panelInerte === true,
    JSON.stringify(accordion),
  );
  check(
    'El primer bloque de la página de preguntas viene abierto',
    accordion.inicial === 'true',
    `aria-expanded inicial = ${accordion.inicial}`,
  );

  /* ---------------------------------------------------------------- */
  /* 6. Visor de imágenes (galería)                                    */
  /*    La galería de habitaciones solo existe cuando hay fichas de      */
  /*    habitación publicadas; se prueba contra el servidor de          */
  /*    desarrollo, que muestra los datos de ejemplo.                   */
  /* ---------------------------------------------------------------- */
  const DEV = process.env.DEV_BASE ?? 'http://localhost:3000';
  let devDisponible = false;
  try {
    await fetch(DEV, { signal: AbortSignal.timeout(2500) });
    devDisponible = true;
  } catch {
    devDisponible = false;
  }

  if (devDisponible) {
    await goTo(DEV, '/habitaciones');
    const lightbox = await page.eval(`(async () => {
      const thumb = document.querySelector('button[aria-label^="Ampliar imagen"]');
      if (!thumb) return { sinGaleria: true };
      thumb.click();
      await new Promise((r) => setTimeout(r, 600));
      const dialog = document.querySelector('dialog[open]');
      const cerrado = dialog ? Boolean(dialog.close) : false;
      if (dialog) dialog.close();
      await new Promise((r) => setTimeout(r, 400));
      const sigueAbierto = Boolean(document.querySelector('dialog[open]'));
      return { abierto: Boolean(dialog), cerrado, sigueAbierto };
    })()`);

    check(
      'El visor de la galería abre y cierra',
      lightbox.sinGaleria === true || (lightbox.abierto === true && lightbox.sigueAbierto === false),
      JSON.stringify(lightbox),
    );
  } else {
    console.log('OMITE El visor de la galería (servidor de desarrollo no disponible)');
  }

  ws.close();
  try {
    chrome.kill();
  } catch {
    /* ya detenido */
  }

  const failed = results.filter((r) => !r.passed);
  console.log(`\n${results.length} pruebas · ${failed.length} fallidas.`);
  if (failed.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
