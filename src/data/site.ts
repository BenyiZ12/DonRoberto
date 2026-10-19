import { business } from './business';

/**
 * ============================================================================
 *  CONFIGURACIÓN GENERAL DEL SITIO (SEO + comportamiento)
 * ============================================================================
 *
 *  - `site.url`: dominio definitivo. Está vacío a propósito porque todavía
 *    no se ha confirmado. Al definirlo, se puede dejar en `.env.local`:
 *        NEXT_PUBLIC_SITE_URL=https://www.donroberto.example
 *    (reemplazar por el dominio real). Con la variable vacía, el sitio no
 *    publica URL canónica ni sitemap con dominio inventado.
 *
 *  - `showDemoContent`: activa los datos de ejemplo (habitaciones y menú).
 *    En desarrollo está siempre activo para poder revisar el diseño completo.
 *    En producción solo se activa si el propietario lo pide de forma explícita.
 * ============================================================================
 */

const envUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
const isDemoForced = process.env.NEXT_PUBLIC_SHOW_DEMO === 'true';

export const site = {
  /** Dominio definitivo. Cadena vacía = todavía sin confirmar. */
  url: envUrl.trim().replace(/\/$/, ''),
  /** Configuración regional: español de Costa Rica. */
  locale: 'es_CR',
  lang: 'es',
  /** Título por defecto cuando una página no define el suyo. */
  defaultTitle: `${business.fullName} en Pérez Zeledón`,
  defaultDescription:
    'Hotel y cafetería en San Isidro de El General, Pérez Zeledón. Doce habitaciones con baño privado, Wi-Fi y parqueo, junto a una cafetería con cocina costarricense. Consultá disponibilidad por WhatsApp.',
  /** Plantilla de títulos: «Página | Negocio». */
  titleTemplate: `%s | ${business.fullName}`,
  themeColor: '#243D32',
  /** Color de fondo de la barra del navegador en móvil. */
  themeColorLight: '#F7F3EA',
  /**
   * Muestra los datos de ejemplo (habitaciones y menú) marcados como
   * "EJEMPLO". Nunca activo por defecto en un build de producción.
   */
  showDemoContent: isDemoForced || process.env.NODE_ENV === 'development',
  /** Rutas del sitio, en orden de navegación principal. */
  mainNav: [
    { href: '/', label: 'Inicio' },
    { href: '/habitaciones', label: 'Habitaciones' },
    { href: '/cafeteria', label: 'Cafetería' },
    { href: '/ubicacion', label: 'Ubicación' },
    { href: '/contacto', label: 'Contacto' },
  ],
  secondaryNav: [{ href: '/preguntas-frecuentes', label: 'Preguntas frecuentes' }],
} as const;

/** `true` si ya hay un dominio confirmado (habilita canonical + sitemap). */
export const hasSiteUrl = site.url.length > 0;
