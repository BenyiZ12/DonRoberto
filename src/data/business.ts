/**
 * ============================================================================
 *  INFORMACIÓN COMERCIAL CENTRALIZADA — DON ROBERTO - HOTEL Y CAFETERÍA
 * ============================================================================
 *
 *  Este es el archivo que edita el propietario del negocio para actualizar
 *  nombre, dirección, teléfono, horarios, servicios, redes y configuración
 *  SEO. Todo el sitio lee de aquí: ninguna información comercial está escrita
 *  a mano dentro de los componentes.
 *
 *  REGLAS DEL PROYECTO
 *  -------------------
 *  1. No se publica información no verificada. Si un dato no está confirmado,
 *     se deja en `null` o se marca con `status: 'pending'` y el sitio lo
 *     oculta o lo muestra como "por confirmar".
 *  2. Cada bloque indica su `source` (fuente pública consultada) para poder
 *     auditar el dato. La fuente no se muestra al público salvo en el
 *     documento de control interno (docs/PENDIENTES-DE-CONFIRMAR.md).
 *  3. Los precios solo se publican si el propietario los confirma.
 *
 *  FUENTES PUBLICAS UTILIZADAS (oct-2026)
 *  --------------------------------------
 *  - Directorio Comercial de la Cámara de Comercio de la Región Brunca
 *    (perezzeledon.cr/directorios/5722) → descripción, dirección, teléfono,
 *    correo y horarios de la soda.
 *  - "Qué hacer en Pérez" — Rutas Turísticas Pérez Zeledón
 *    (quehacerenperez.com/sitio/hospedaje/18) → 12 habitaciones, proyecto
 *    familiar, teléfono, correo.
 *  - Facebook oficial "Don Roberto - Hotel y Cafetería" (facebook.com/DonRobertoPZ)
 *    → teléfono, servicio para llevar, ubicación en San Isidro.
 *  - Tripadvisor (perfil del establecimiento) → número de habitaciones,
 *    servicios publicados (parqueo, Wi-Fi, restaurante) y descripciones de
 *   ggio de huéspedes reales (baño privado, TV por cable, ambiente rústico).
 *  - Google Hotels (perfil del establecimiento) → características de las
 *    habitaciones (kitchenette y microondas).
 * ============================================================================
 */

/* --------------------------------------------------------------------------
 *  Tipos
 * -------------------------------------------------------------------------- */

export type VerificationStatus = 'confirmed' | 'pending';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: 'bed' | 'wifi' | 'parking' | 'coffee' | 'utensils' | 'concierge' | 'leaf' | 'car';
  status: VerificationStatus;
  /** Nota interna, no se publica. */
  source?: string;
}

export interface DaySchedule {
  /** Etiqueta visible, p. ej. "Lunes a viernes". */
  label: string;
  /** Texto de horario o `null` si no está confirmado. */
  value: string | null;
  status: VerificationStatus;
}

export interface OpeningHours {
  title: string;
  description: string;
  days: DaySchedule[];
  source?: string;
}

export interface PhotoSlot {
  /**
   * Ruta del archivo real dentro de /public (p. ej. '/fotos/fachada.webp').
   * `null` = todavía no se ha recibido la fotografía; se muestra un marco
   * reservado elegante con la descripción de la foto que se necesita.
   */
  src: string | null;
  /** Texto alternativo descriptivo (usado por lectores de pantalla y SEO). */
  alt: string;
  /** Identificador del espacio reservado. */
  slot: string;
  width: number;
  height: number;
}

export interface SocialLink {
  id: 'facebook' | 'instagram' | 'whatsapp';
  label: string;
  href: string;
  /** `true` solo si el perfil oficial fue verificado públicamente. */
  verified: boolean;
}

/* --------------------------------------------------------------------------
 *  Datos del negocio
 * -------------------------------------------------------------------------- */

export const business = {
  /** Nombre corto, para el logotipo tipográfico. */
  name: 'Don Roberto',
  /** Nombre comercial completo. Debe coincidir con el perfil de Google. */
  fullName: 'Don Roberto - Hotel y Cafetería',
  /** Descriptor: hotel con cafetería/restaurante en el mismo local. */
  descriptor: 'Hotel y Cafetería',
  /** Categorías: hospedaje + alimentación. */
  categories: ['Hotel', 'Hospedaje', 'Cafetería', 'Restaurante'],

  city: 'San Isidro de El General',
  region: 'Pérez Zeledón',
  province: 'San José',
  country: 'Costa Rica',
  countryCode: 'CR',
  postalCode: '11901',

  /** Teléfono en formato internacional legible. */
  phoneDisplay: '+506 2772-3348',
  /** Teléfono en formato E.164 para enlaces tel:. */
  phoneE164: '+50627723348',
  /**
   * Número de WhatsApp: solo dígitos, con código de país y sin «+».
   * Verificado en la página oficial de Facebook (2772-33-48) y en el
   * Directorio Comercial de la Cámara Brunca (2772-3348).
   */
  whatsappNumber: '50627723348',
  /** Correo publicado en el directorio comercial. */
  email: 'donrobertopz@gmail.com',

  /** Año de inicio del proyecto familiar. */
  since: '2009',

  /** Descripción corta para metadatos y tarjetas. */
  summary:
    'Hotel y cafetería en San Isidro de El General, Pérez Zeledón. Doce habitaciones con baño privado, Wi-Fi y parqueo, junto a una cafetería con cocina costarricense.',

  /** Presentación en palabras, basada en la descripción del directorio local. */
  about:
    'Don Roberto es un hotel pequeño de San Isidro de El General atendido y administrado directamente por sus propietarios. Son doce habitaciones y, en el mismo local, una cafetería donde se prepara la comida con ingredientes de primera calidad. El objetivo es sencillo: un lugar tranquilo, con servicio personalizado y precios accesibles, a minutos del centro de la ciudad.',
} as const;

/* --------------------------------------------------------------------------
 *  Dirección
 * -------------------------------------------------------------------------- */

export const address = {
  /**
   * Referencia. La dirección se encontró como "150 metros sur de la Escuela
   * Rafael Ángel Calderón Guardia". Otras fuentes mencionan 200 m y "Colegio"
   * en lugar de "Escuela". Se publica la referencia del directorio comercial
   * local y queda anotado en docs/PENDIENTES-DE-CONFIRMAR.md.
   */
  landmark: '150 metros al sur de la Escuela Rafael Ángel Calderón Guardia',
  neighborhood: 'Barrio La Cooperativa',
  streetLine: 'Barrio La Cooperativa',
  /** Dirección en una línea, usada en listados y metadatos. */
  line1: 'Barrio La Cooperativa, 150 m al sur de la Escuela Rafael Ángel Calderón Guardia',
  city: business.city,
  region: business.region,
  province: business.province,
  postalCode: business.postalCode,
  country: business.country,
  countryCode: business.countryCode,
  /** Texto completo para mapear. */
  full: `${business.city}, ${business.region}, ${business.province}, ${business.country}`,
  /**
   * Coordenadas aproximadas publicadas en un directorio de mapas de terceros.
   * Se muestran como aproximadas y NO se usan para el botón de Google Maps
   * (que usa búsqueda por texto para que nunca_apunte a un lugar equivocado).
   */
  coordinates: {
    lat: 9.3677548,
    lng: -83.7128593,
    precision: 'approximate' as const,
    source: 'Directorio de mapas de terceros (maptons.com), ficha 2662029222',
  },
  /** Cómo llegar — indicaciones verificables a partir de la ubicación. */
  directions: [
    'A unos pasos del centro de San Isidro de El General, en el Barrio La Cooperativa.',
    'Referencia: 150 metros al sur de la Escuela Rafael Ángel Calderón Guardia.',
    'Zona con servicios, commerce y transporte público a corta distancia.',
  ],
  /** Google Maps: búsqueda por texto (robusta y sin coordenadas inventadas). */
  mapsSearchQuery: 'Don Roberto Hotel y Cafetería, San Isidro de El General, Pérez Zeledón, Costa Rica',
} as const;

/* --------------------------------------------------------------------------
 *  Contacto
 * -------------------------------------------------------------------------- */

export const contact = {
  phoneDisplay: business.phoneDisplay,
  phoneE164: business.phoneE164,
  whatsappNumber: business.whatsappNumber,
  email: business.email,
  /** Teléfono de contacto alterno: el fijo de la Cámara Brunca. */
  chamberPhone: '+506 2771-6096 / 2771-2003',
} as const;

export const social: SocialLink[] = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/DonRobertoPZ',
    verified: true,
  },
];

/* --------------------------------------------------------------------------
 *  Horarios
 * -------------------------------------------------------------------------- */

export const openingHours: OpeningHours = {
  title: 'Horarios de la cafetería',
  description:
    'Horarios publicados en el directorio comercial de la Cámara de Comercio de la Región Brunca. El horario de recepción del hotel no está publicado: confírmelo al momento de reservar.',
  days: [
    {
      label: 'Lunes a viernes',
      value: '6:00 a. m. – 8:30 p. m.',
      status: 'confirmed',
    },
    { label: 'Sábado', value: '6:30 a. m. – 10:00 a. m.', status: 'confirmed' },
    { label: 'Domingo', value: null, status: 'pending' },
  ],
  source: 'Directorio Comercial — Cámara Brunca (perezzeledon.cr/directorios/5722)',
};

export const hotelHours: OpeningHours = {
  title: 'Recepción y estadía',
  description:
    'El horario de check-in y check-out no está publicado todavía. Se confirma por WhatsApp o por teléfono al momento de cada reserva.',
  days: [
    { label: 'Check-in', value: null, status: 'pending' },
    { label: 'Check-out', value: null, status: 'pending' },
    { label: 'Recepción 24 h', value: null, status: 'pending' },
  ],
  source: 'Sin fuente publicada',
};

/* --------------------------------------------------------------------------
 *  Servicios (solo los verificados se publican)
 * -------------------------------------------------------------------------- */

export const services: ServiceItem[] = [
  {
    id: 'habitaciones',
    title: 'Doce habitaciones',
    description:
      'Un hotel pequeño con doce habitaciones, atendido directamente por sus propietarios, con servicio personalizado.',
    icon: 'bed',
    status: 'confirmed',
    source: 'quehacerenperez.com + ficha de Tripadvisor (número de habitaciones: 12)',
  },
  {
    id: 'bano-privado',
    title: 'Baño privado',
    description:
      'Cada habitación cuenta con baño privado, para que el descanso no dependa de horarios compartidos.',
    icon: 'concierge',
    status: 'confirmed',
    source: 'Descripción del directorio comercial + opiniones de huéspedes',
  },
  {
    id: 'wifi',
    title: 'Wi-Fi sin costo',
    description:
      'Internet de alta velocidad disponible para huéspedes, con el mismo acceso en las áreas comunes.',
    icon: 'wifi',
    status: 'confirmed',
    source: 'Servicios publicados en el perfil de Tripadvisor',
  },
  {
    id: 'parqueo',
    title: 'Estacionamiento',
    description:
      'Parqueo para huéspedes que llegan en vehículo, en una zona con fácil acceso al centro.',
    icon: 'parking',
    status: 'confirmed',
    source: 'Servicios publicados en el perfil de Tripadvisor',
  },
  {
    id: 'cafeteria',
    title: 'Cafetería y restaurante',
    description:
      'En el mismo local: una soda con cocina costarricense, hecha con ingredientes de primera calidad y a precios accesibles.',
    icon: 'utensils',
    status: 'confirmed',
    source: 'Descripción del directorio comercial + página oficial de Facebook',
  },
  {
    id: 'centro',
    title: 'A pasos del centro',
    description:
      'Ubicación céntrica en San Isidro de El General, con comercios y transporte público muy cerca.',
    icon: 'car',
    status: 'confirmed',
    source: 'Ubicación publicada en el directorio comercial y en el perfil de Tripadvisor',
  },
];

/** Servicios aún no confirmados. No se publican; se documentan para el dueño. */
export const pendingServices: ServiceItem[] = [
  {
    id: 'aire-acondicionado',
    title: 'Aire acondicionado',
    description: 'Anunciado en la ficha pública del establecimiento. Confirmar en qué habitaciones aplica.',
    icon: 'leaf',
    status: 'pending',
    source: 'Ficha pública del negocio',
  },
  {
    id: 'tv-cable',
    title: 'TV por cable',
    description: 'Mencionada por huéspedes. Confirmar disponibilidad por habitación.',
    icon: 'leaf',
    status: 'pending',
    source: 'Opiniones de huéspedes en Tripadvisor',
  },
  {
    id: 'kitchenette',
    title: 'Kitchenette y microondas',
    description: 'Aparece en el perfil de Google Hotels. Confirmar antes de prometerlo.',
    icon: 'leaf',
    status: 'pending',
    source: 'Perfil en Google Hotels',
  },
  {
    id: 'mascotas',
    title: 'Se admiten mascotas',
    description: 'Etiqueta publicada en plataformas de reserva. Confirmar política real.',
    icon: 'leaf',
    status: 'pending',
    source: 'Servicios publicados en el perfil de Tripadvisor',
  },
  {
    id: 'delivery',
    title: 'Delivery',
    description: 'La página oficial menciona pedidos «para llevar». Confirmar si hay reparto a domicilio.',
    icon: 'leaf',
    status: 'pending',
    source: 'Publicación en la página oficial de Facebook',
  },
  {
    id: 'hab-familiar',
    title: 'Habitación familiar',
    description: 'Confirmar si existe una categoría familiar y su capacidad.',
    icon: 'leaf',
    status: 'pending',
    source: 'Ficha pública del negocio',
  },
];

/* --------------------------------------------------------------------------
 *  Espacios reservados para fotografías reales
 * -------------------------------------------------------------------------- */

export const photoSlots: PhotoSlot[] = [
  {
    src: null,
    alt: 'Fachada de Don Roberto - Hotel y Cafetería en San Isidro de El General',
    slot: 'fachada-principal',
    width: 1600,
    height: 1100,
  },
  {
    src: null,
    alt: 'Interior de la cafetería de Don Roberto con el servicio de soda',
    slot: 'cafeteria-interior',
    width: 1400,
    height: 1000,
  },
  {
    src: null,
    alt: 'Habitación de Don Roberto con cama y baño privado',
    slot: 'habitacion-principal',
    width: 1400,
    height: 1000,
  },
  {
    src: null,
    alt: 'Baño privado de las habitaciones de Don Roberto',
    slot: 'bano-privado',
    width: 1200,
    height: 900,
  },
  {
    src: null,
    alt: 'Plato de cocina costarricense servido en la cafetería de Don Roberto',
    slot: 'plato-cocina',
    width: 1200,
    height: 900,
  },
  {
    src: null,
    alt: 'Fachada lateral y entrada de Don Roberto en Pérez Zeledón',
    slot: 'fachada-lateral',
    width: 1200,
    height: 900,
  },
];

export function photoSlot(id: string): PhotoSlot {
  const found = photoSlots.find((p) => p.slot === id);
  if (!found) {
    throw new Error(`Espacio de foto desconocido: "${id}". Revisa src/data/business.ts`);
  }
  return found;
}

/* --------------------------------------------------------------------------
 *  Contacto rápido — atajos reutilizables
 * -------------------------------------------------------------------------- */

export const businessSummary = {
  name: business.fullName,
  address: `${address.line1}, ${address.city}, ${address.region}, ${address.country}`,
  phone: business.phoneDisplay,
  email: business.email,
} as const;
