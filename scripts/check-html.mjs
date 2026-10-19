// Verificación del HTML exportado (uso: node scripts/check-html.mjs <archivo>)
import { readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'out/index.html';
const html = readFileSync(file, 'utf8');

const pick = (re) => {
  const m = html.match(re);
  return m ? m[0] : '(none)';
};

console.log('FILE      :', file);
console.log('TITLE     :', pick(/<title>[^<]*<\/title>/));
console.log('DESC      :', pick(/<meta name="description" content="[^"]{0,140}/));
console.log('OG IMAGE  :', pick(/<meta property="og:image"[^>]*>/));
console.log('CANONICAL :', pick(/<link rel="canonical"[^>]*>/));
console.log('JSON-LD   :', (html.match(/application\/ld\+json/g) ?? []).length, 'bloques');
console.log('ACCENTS   :', html.includes('Cafetería') ? 'UTF-8 correcto' : 'ROTO');
console.log('H1 COUNT  :', (html.match(/<h1[ >]/g) ?? []).length);
console.log('H2 COUNT  :', (html.match(/<h2[ >]/g) ?? []).length);
console.log('IMG ALT   :', (html.match(/<img[^>]*>/g) ?? []).filter((i) => !/alt="/.test(i)).length, 'imágenes sin alt');
const routes = [...html.matchAll(/href="\/(habitaciones|cafeteria|ubicacion|contacto|preguntas-frecuentes)/g)].map(
  (m) => m[1],
);
console.log('ENLACES   :', [...new Set(routes)].join(', '));
console.log('WA LINKS  :', (html.match(/https:\/\/wa\.me\//g) ?? []).length);
console.log('TEL LINKS :', (html.match(/tel:\+/g) ?? []).length);
console.log('MAPS LINKS:', (html.match(/google\.com\/maps/g) ?? []).length);
