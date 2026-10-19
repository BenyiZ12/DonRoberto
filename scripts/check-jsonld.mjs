// Muestra los bloques JSON-LD del HTML exportado.
import { readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'out/index.html';
const html = readFileSync(file, 'utf8');

const re = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
let match;
let i = 0;
while ((match = re.exec(html)) !== null) {
  i += 1;
  console.log(`--- bloque ${i} ---`);
  try {
    const parsed = JSON.parse(match[1].replace(/\\u003c/g, '<'));
    console.log(JSON.stringify(parsed, null, 2).slice(0, 2600));
  } catch (error) {
    console.log('JSON inválido:', error.message, match[1].slice(0, 400));
  }
}
