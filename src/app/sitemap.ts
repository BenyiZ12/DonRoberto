import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

export const dynamic = 'force-static';

/**
 * Sitemap XML.
 *
 * Solo se genera con URLs absolutas, por eso necesita el dominio definitivo.
 * Mientras `NEXT_PUBLIC_SITE_URL` esté vacío, el sitemap se publica vacío
 * en lugar de inventar un dominio (ver docs/DESPLIEGUE.md).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  if (!base) return [];

  const lastModified = new Date();

  const routes: {
    path: string;
    priority: number;
    changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  }[] = [
    { path: '/', priority: 1, changeFrequency: 'monthly' },
    { path: '/habitaciones', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/cafeteria', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/contacto', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/ubicacion', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/preguntas-frecuentes', priority: 0.6, changeFrequency: 'monthly' },
  ];

  return routes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
