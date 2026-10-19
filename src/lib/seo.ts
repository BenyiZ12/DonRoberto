import { business } from '@/data/business';
import { site } from '@/data/site';

/**
 * Construcción de los metadatos de Open Graph y Twitter.
 *
 * En Next.js el objeto `metadata` de una página **reemplaza** por completo el
 * de su layout (no se fusiona en profundidad). Por eso cada página tiene que
 * volver a declarar las imágenes: este helper lo hace para todas, y evita
 * que alguna se quede sin la imagen social por olvido.
 */
export function buildOpenGraph({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  /** Ruta con barra inicial, p. ej. '/habitaciones'. */
  path: string;
}) {
  const url = site.url ? `${site.url}${path}` : undefined;

  return {
    type: 'website' as const,
    locale: site.locale,
    siteName: business.fullName,
    title,
    description,
    url,
    images: site.url
      ? [
          {
            url: `${site.url}/og-image.png`,
            width: 1200,
            height: 630,
            alt: `${business.fullName} en San Isidro de El General, Pérez Zeledón`,
          },
        ]
      : [],
  };
}

export function buildTwitter({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return {
    card: 'summary_large_image' as const,
    title,
    description,
    images: site.url ? [`${site.url}/og-image.png`] : [],
  };
}
