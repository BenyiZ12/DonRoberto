/**
 * Genera la imagen social del sitio (Open Graph / Twitter card).
 *
 * Se ejecuta antes del build (`npm run prebuild`) y escribe
 * `public/og-image.png`. Al ser un archivo estático, las etiquetas
 * `og:image` pueden apuntar al dominio definitivo sin depender de
 * `metadataBase` y sin dejar URLs de localhost en el HTML publicado.
 *
 * Usa `createElement` en lugar de JSX para que Node pueda ejecutarlo
 * directamente, sin paso de compilación adicional.
 *
 * Uso: node scripts/generate-og.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement as h } from 'react';

const here = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(here, '..', 'public', 'og-image.png');

const { ImageResponse } = await import('next/og.js');

const style = (extra) => ({ display: 'flex', ...extra });

const element = h(
  'div',
  {
    style: style({
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#243D32',
      padding: '72px 80px',
    }),
  },
  h(
    'div',
    { style: style({ alignItems: 'center', gap: 24 }) },
    h('div', {
      style: style({
        width: 56,
        height: 68,
        border: '4px solid #C9B183',
        borderBottom: 'none',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
      }),
    }),
    h(
      'div',
      { style: style({ flexDirection: 'column' }) },
      h(
        'span',
        { style: style({ fontSize: 40, color: '#F7F3EA', letterSpacing: -0.5 }) },
        'Don Roberto',
      ),
      h(
        'span',
        {
          style: style({
            fontSize: 18,
            color: '#C9B183',
            letterSpacing: 4,
            marginTop: 6,
          }),
        },
        'HOTEL Y CAFETERÍA',
      ),
    ),
  ),
  h(
    'div',
    { style: style({ flexDirection: 'column', gap: 20 }) },
    h(
      'span',
      {
        style: style({
          fontSize: 62,
          lineHeight: 1.1,
          color: '#F7F3EA',
          letterSpacing: -1.5,
          maxWidth: 900,
        }),
      },
      'Hospedaje y cafetería en el centro de San Isidro de El General',
    ),
    h(
      'span',
      { style: style({ fontSize: 26, color: 'rgba(247,243,234,0.72)' }) },
      'Pérez Zeledón, Costa Rica',
    ),
  ),
  h(
    'div',
    {
      style: style({
        alignItems: 'center',
        gap: 16,
        borderTop: '1px solid rgba(247,243,234,0.22)',
        paddingTop: 24,
      }),
    },
    h('span', { style: style({ fontSize: 22, color: '#F7F3EA' }) }, '+506 2772-3348'),
    h('span', { style: style({ fontSize: 22, color: 'rgba(247,243,234,0.5)' }) }, '·'),
    h('span', { style: style({ fontSize: 22, color: '#C9B183' }) }, 'Consultá por WhatsApp'),
  ),
);

const response = new ImageResponse(element, { width: 1200, height: 630 });
const buffer = Buffer.from(await response.arrayBuffer());

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, buffer);

console.log(
  `Imagen social generada: public/og-image.png (${Math.round(buffer.length / 1024)} KB)`,
);
