import type { PhotoSlot } from './business';

/**
 * ============================================================================
 *  TIPOS DE HABITACIÓN
 * ============================================================================
 *
 *  Estructura lista para que el propietario describa cada tipo de habitación
 *  sin tocar componentes. Nada aquí se inventa: la lista de producción está
 *  vacía a propósito y la página muestra un estado elegante de "información
 *  en preparación" con acceso directo a WhatsApp.
 *
 *  CÓMO ACTIVAR LOS DATOS REALES
 *  ------------------------------
 *  1. Rellenar el array `rooms` de este archivo con una entrada por tipo de
 *     habitación real.
 *  2. Poner `price` con el valor confirmado (o `null` si aún no hay tarifa) y
 *     usar `priceNote` para aclaraciones ("por noche, desayuno incluido").
 *  3. Cambiar `status` a 'confirmed'.
 *  4. Subir las fotos a /public/fotos y asignar su `src` en el `PhotoSlot`.
 *
 *  La lista de demostración (`src/data/rooms.demo.ts`) se usa solo en modo
 *  desarrollo o con NEXT_PUBLIC_SHOW_DEMO=true, y siempre se marca como
 *  "EJEMPLO" en pantalla.
 * ============================================================================
 */

export type RoomStatus = 'confirmed' | 'demo';

export interface Room {
  slug: string;
  name: string;
  status: RoomStatus;
  /** Frase corta, se muestra bajo el nombre. */
  tagline: string;
  description: string;
  /** Capacidad máxima de huéspedes. `null` si no está confirmada. */
  capacity: number | null;
  /** Descripción de las camas. `null` si no está confirmada. */
  bedType: string | null;
  /** Servicios incluidos en la habitación. */
  amenities: string[];
  /** Tarifa por noche en colones. `null` = no se publica precio. */
  price: number | null;
  /** Aclaración visible junto al precio (base, cargas, desayuno...). */
  priceNote: string | null;
  /** Condiciones relevantes: check-in, mínimo de noches, mascotas. */
  conditions: string[];
  photos: PhotoSlot[];
  /** Etiqueta para el botón de consulta. */
  inquiryLabel: string;
}

/**
 * Lista de habitaciones confirmadas.
 * Vacía a propósito: el propietario la completa con los datos reales.
 */
export const rooms: Room[] = [];

/** `true` cuando ya hay al menos un tipo de habitación confirmado. */
export const roomsPublished = rooms.length > 0;
