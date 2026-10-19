/**
 * Corrección de las rutas de los payloads RSC en la exportación estática.
 *
 * En `next build` (export estático) Next.js escribe el payload de cada
 * segmento de ruta en un subdirectorio:
 *
 *     out/habitaciones/__next.habitaciones/__PAGE__.txt
 *
 * pero el enrutador del navegador pide ese mismo archivo como nombre plano:
 *
 *     /habitaciones/__next.habitaciones.__PAGE__.txt
 *
 * El resultado es un 404 en cada pre-carga de ruta: la navegación sigue
 * funcionando (el cliente cae en el payload general de la ruta), pero el
 * navegador registra errores y se desperdicia una petición.
 *
 * Este script crea, junto al directorio, una copia plana del payload para
 * cada combinación segmento/archivo, de modo que la URL que pide el
 * navegador exista de verdad. Es una copia byte a byte, así que el contenido
 * es exactamente el que Next.js generó.
 *
 * Se ejecuta automáticamente con `npm run postbuild`.
 */
import { copyFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const outDir = resolve(process.cwd(), 'out');

if (!existsSync(outDir)) {
  console.log('No existe la carpeta out/. Se omite la corrección de payloads.');
  process.exit(0);
}

let created = 0;

/**
 * Recorre un directorio y, si encuentra subdirectorios de segmentos
 * (`__next.<ruta>`), genera la copia plana de cada archivo que contengan.
 */
function processDirectory(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const subdirectory = join(directory, entry.name);

    if (entry.name.startsWith('__next.')) {
      for (const file of readdirSync(subdirectory)) {
        if (!file.endsWith('.txt')) continue;
        const flatName = `${entry.name}.${file}`;
        const flatPath = join(directory, flatName);
        if (existsSync(flatPath)) continue;
        copyFileSync(join(subdirectory, file), flatPath);
        created += 1;
      }
    }

    processDirectory(subdirectory);
  }
}

processDirectory(outDir);

console.log(
  created > 0
    ? `Payloads RSC aplanados: ${created} archivo(s) generado(s) para evitar 404 en la pre-carga de rutas.`
    : 'Payloads RSC: no hizo falta crear archivos adicionales.',
);
