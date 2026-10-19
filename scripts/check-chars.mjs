/**
 * Revisa que no queden caracteres fuera del rango esperado (por ejemplo,
 * caracteres CJK o emoji que se colaron al escribir textos en español).
 * Uso: node scripts/check-chars.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const ROOTS = ['src', 'scripts', 'docs', 'README.md', 'package.json'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.md', '.json']);
const ALLOWED = /[–—‘’“”…·°•→▸✔✕×¿¡«»©₡↳├─│└┌┐┘⬅🟡🟢]/u;

function walk(target) {
  const stats = statSync(target);
  if (stats.isFile()) {
    check(target);
    return;
  }
  for (const entry of readdirSync(target)) {
    const full = join(target, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!EXTS.has(extname(entry))) continue;
    if (entry === 'check-chars.mjs') continue;
    check(full);
  }
}

function check(file) {
  const content = readFileSync(file, 'utf8');
  content.split('\n').forEach((line, index) => {
    for (const char of line) {
      const code = char.codePointAt(0) ?? 0;
      if (code < 128) continue;
      if (ALLOWED.test(char)) continue;
      if (code >= 0xc0 && code <= 0xff) continue; // Latín-1: áéíóúüñÁÉÍÓÚÑ y signos ¿¡«»
      console.log(
        `${file}:${index + 1}  U+${code.toString(16).toUpperCase().padStart(4, '0')}  «${char}»  ${line.trim().slice(0, 90)}`,
      );
    }
  });
}

for (const root of ROOTS) {
  try {
    walk(root);
  } catch {
    // La carpeta puede no existir todavía.
  }
}
console.log('Revisión de caracteres completada.');
