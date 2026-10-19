/**
 * Configuración de Next.js para Don Roberto - Hotel y Cafetería.
 *
 * Se usa `output: 'export'` para generar un sitio 100% estático: cada ruta
 * se compila a un HTML real con sus metadatos, su JSON-LD y su contenido.
 * Eso es clave para el SEO local (title/description/canonical por página,
 * sitemap.xml, robots.txt) y permite publicar en cualquier hosting barato
 * (Netlify, Vercel, Cloudflare Pages, cPanel) sin Node en producción.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: false,
  // Sin optimizador de imágenes en export estático: las fotos reales se
  // entregarían ya optimizadas (WebP/AVIF) desde /public.
  // Cuando se suban las fotos reales, cambia a `images: { unoptimized: false }`
  // y despliega en un host con Node (o usa un loader externo).
  images: {
    unoptimized: true,
  },
  // Compresión y cabeceras se configuran en el host (ver docs/DESPLIEGUE.md).
  productionBrowserSourceMaps: false,
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  },
};

export default nextConfig;
