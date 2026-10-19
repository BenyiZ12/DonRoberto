/** Captura una pantalla concreta del sitio. */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const url = process.argv[2];
const output = process.argv[3];
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const full = process.argv[6] === 'full';

const CHROME =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const port = 9500 + Math.floor(Math.random() * 400);
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=' + resolve(process.cwd(), '.chrome-shot'),
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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
if (!ready) process.exit(1);

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
ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve: res, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else res(message.result);
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
    }, 30000);
  });
};

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: width < 700,
});
await send('Page.navigate', { url });
await sleep(2500);

const clip = full
  ? await (async () => {
      const metrics = await send('Page.getLayoutMetrics');
      return {
        x: 0,
        y: 0,
        width,
        height: Math.min(Math.ceil(metrics.cssContentSize.height), 9000),
        scale: 1,
      };
    })()
  : undefined;

const shot = await send('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: full,
  ...(clip ? { clip } : {}),
});

mkdirSync(resolve(output, '..'), { recursive: true });
writeFileSync(output, Buffer.from(shot.data, 'base64'));
console.log(`Captura guardada: ${output}`);
ws.close();
try {
  chrome.kill();
} catch {
  /* ya detenido */
}
