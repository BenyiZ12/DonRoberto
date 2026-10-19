/** Diagnóstico: registra todas las peticiones .txt durante la carga de una página. */
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:4173';
const CHROME =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const port = 9700 + Math.floor(Math.random() * 200);
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=' + resolve(process.cwd(), '.chrome-diag'),
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
const seen = [];
ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve: res, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else res(message.result);
  } else if (message.method === 'Network.responseReceived') {
    const { response, type } = message.params;
    if (response.url.includes('.txt') || response.url.includes('__next')) {
      seen.push(`${String(response.status).padEnd(3)} ${type.padEnd(10)} ${response.url.replace(BASE, '')}`);
    }
  }
});
const send = (method, params = {}) => {
  const messageId = ++id;
  return new Promise((res, reject) => {
    pending.set(messageId, { resolve: res, reject });
    ws.send(JSON.stringify({ id: messageId, method, params }));
    setTimeout(() => reject(new Error(`Timeout ${method}`)), 20000);
  });
};

await send('Page.enable');
await send('Network.enable');
await send('Page.navigate', { url: BASE + '/' });
await sleep(4000);

console.log('--- peticiones de payloads durante la carga de / ---');
for (const line of seen) console.log('  ' + line);

ws.close();
try {
  chrome.kill();
} catch {
  /* ya detenido */
}
