/**
 * Servidor estático mínimo para previsualizar el build exportado.
 *
 * `next start` no funciona con `output: 'export'`, así que este script sirve
 * la carpeta `out/` como lo haría un hosting estático real (con soporte de
 * `index.html`, `404.html` y archivos con caché).
 *
 * Uso: npm run serve  (por defecto en http://localhost:4173)
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.cwd(), 'out');
const port = Number(process.env.PORT ?? 4173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const safe = normalize(clean).replace(/^(\.\.[/\\])+/, '');
  const target = join(root, safe);

  if (!target.startsWith(root)) return null;

  if (existsSync(target) && statSync(target).isFile()) return target;

  const indexFile = join(target, 'index.html');
  if (existsSync(indexFile) && statSync(indexFile).isFile()) return indexFile;

  const htmlFile = `${target}.html`;
  if (existsSync(htmlFile) && statSync(htmlFile).isFile()) return htmlFile;

  return null;
}

const server = createServer((request, response) => {
  const file = resolveFile(request.url ?? '/');

  if (!file) {
    const notFound = join(root, '404.html');
    if (existsSync(notFound)) {
      response.writeHead(404, { 'Content-Type': MIME['.html'] });
      createReadStream(notFound).pipe(response);
      return;
    }
    response.writeHead(404, { 'Content-Type': MIME['.txt'] });
    response.end('404 — ejecuta "npm run build" primero.');
    return;
  }

  const type = MIME[extname(file).toLowerCase()] ?? 'application/octet-stream';
  const isHashed = /[\\/]_next[\\/]static[\\/]/.test(file);
  response.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': isHashed ? 'public, max-age=31536000, immutable' : 'public, max-age=0',
  });
  createReadStream(file).pipe(response);
});

server.listen(port, () => {
  console.log(`Sitio exportado disponible en http://localhost:${port}`);
  console.log('Presiona Ctrl+C para detenerlo.');
});
