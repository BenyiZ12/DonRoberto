import type { PhotoSlot } from './business';
import type { Room } from './rooms';

/**
 * ============================================================================
 *  DATOS DE EJEMPLO (SOLO VISUALIZACIÓN DE DISEÑO)
 * ============================================================================
 *
 *  Este archivo NUNCA se usa en producción salvo que se active explícitamente
 *  con NEXT_PUBLIC_SHOW_DEMO=true. Todas las entradas se marcan con
 *  status: 'demo' y la interfaz muestra un distintivo "EJEMPLO" para que
 *  jamás puedan confundirse con información real del hotel.
 *
 *  Nombres, capacidades y servicios son genéricos a propósito: no describen
 *  habitaciones que Don Roberto no haya confirmado.
 * ============================================================================
 */

const demoPhotos: PhotoSlot[] = [
  {
    src: null,
    alt: 'Habitación tipo estándar de Don Roberto — fotografía pendiente',
    slot: 'habitacion-principal',
    width: 1400,
    height: 1000,
  },
  {
    src: null,
    alt: 'Baño privado de las habitaciones de Don Roberto — fotografía pendiente',
    slot: 'bano-privado',
    width: 1200,
    height: 900,
  },
  {
    src: null,
    alt: 'Detalle de la habitación de Don Roberto — fotografía pendiente',
    slot: 'habitacion-detalle',
    width: 1200,
    height: 900,
  },
];

export const demoRooms: Room[] = [
  {
    slug: 'habitacion-ejemplo-1',
    name: 'Tipo de habitación (ejemplo)',
    status: 'demo',
    tagline: 'Nombre real por confirmar',
    description:
      'Texto de ejemplo para mostrar el diseño de la ficha. Cuando el propietario confirme los datos reales, este bloque se reemplaza automáticamente por la información oficial de cada habitación.',
    capacity: null,
    bedType: null,
    amenities: ['Baño privado', 'Wi-Fi sin costo'],
    price: null,
    priceNote: null,
    conditions: ['Condiciones por confirmar con el establecimiento'],
    photos: demoPhotos,
    inquiryLabel: 'Consultar este tipo de habitación',
  },
  {
    slug: 'habitacion-ejemplo-2',
    name: 'Segundo tipo (ejemplo)',
    status: 'demo',
    tagline: 'Nombre real por confirmar',
    description:
      'Segundo bloque de ejemplo para revisar la composición editorial de la página de habitaciones, la galería y las llamadas a la acción.',
    capacity: null,
    bedType: null,
    amenities: ['Baño privado', 'Wi-Fi sin costo', 'Estacionamiento'],
    price: null,
    priceNote: null,
    conditions: ['Condiciones por confirmar con el establecimiento'],
    photos: demoPhotos,
    inquiryLabel: 'Consultar este tipo de habitación',
  },
  {
    slug: 'habitacion-ejemplo-3',
    name: 'Tercer tipo (ejemplo)',
    status: 'demo',
    tagline: 'Nombre real por confirmar',
    description:
      'Tercer bloque de ejemplo. Sirve para comprobar cómo se comporta la página con más opciones publicadas.',
    capacity: null,
    bedType: null,
    amenities: ['Baño privado', 'Wi-Fi sin costo'],
    price: null,
    priceNote: null,
    conditions: ['Condiciones por confirmar con el establecimiento'],
    photos: demoPhotos,
    inquiryLabel: 'Consultar este tipo de habitación',
  },
];
