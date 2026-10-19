/**
 * ============================================================================
 *  ANALÍTICA OPCIONAL
 * ============================================================================
 *
 *  El sitio NO carga ningún script de seguimiento por defecto. Esta capa
 *  registra los eventos que interesan al negocio (clics de reserva, WhatsApp,
 *  llamadas, vistas de habitaciones y del menú) y los entrega de forma
 *  neutra:
 *
 *    1. Si existe `window.dataLayer` (por ejemplo, con Google Tag Manager o
 *       gtag ya instalados por el propietario), el evento se envía allí.
 *    2. Si no, se dispara un evento DOM `donroberto:analytics` que cualquier
 *       integración propia puede escuchar.
 *
 *  CÓMO ACTIVAR GOOGLE ANALYTICS 4
 *  ------------------------------
 *  1. El propietario crea la propiedad GA4 y obtiene el ID (G-XXXXXXX).
 *  2. Añade el script de gtag en `src/app/layout.tsx` (ver el bloque
 *     comentado `<!-- ANALYTICS -->`) o en el panel de tu proveedor de
 *     etiquetas.
 *  3. Los eventos de este archivo ya usan nombres compatibles con las
 *     recomendaciones de GA4.
 *
 *  PRIVACIDAD: solo se envían identificadores de evento y, cuando aplica, el
 *  tipo de habitación o la página visitada. Nunca se envía nombre, teléfono,
 *  correo ni fechas de estadía.
 * ============================================================================
 */

export type AnalyticsEventName =
  | 'consulta_habitacion_enviada'
  | 'clic_whatsapp'
  | 'clic_llamada'
  | 'clic_mapa'
  | 'visita_habitaciones'
  | 'visita_menu'
  | 'envio_formulario'
  | 'clic_navegacion';

export interface AnalyticsParams {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: AnalyticsEventName, params: AnalyticsParams = {}): void {
  if (typeof window === 'undefined') return;

  const payload = { event: name, ...params };

  try {
    window.dataLayer?.push(payload);
  } catch {
    // dataLayer no disponible: se ignora silenciosamente.
  }

  try {
    window.dispatchEvent(new CustomEvent('donroberto:analytics', { detail: payload }));
  } catch {
    // Navegadores muy antiguos sin CustomEvent: se ignora.
  }
}
