/**
 * ============================================================================
 *  PREGUNTAS FRECUENTES
 * ============================================================================
 *
 *  Las respuestas usan únicamente información verificada. Cuando algo no está
 *  confirmado, la respuesta indica cómo consultarlo con el establecimiento
 *  en lugar de inventarlo.
 * ============================================================================
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  /** Enlace interno opcional al final de la respuesta. */
  link?: { href: string; label: string };
}

export const faqs: FaqItem[] = [
  {
    id: 'disponibilidad',
    question: '¿Cómo consulto la disponibilidad de habitaciones?',
    answer:
      'Desde esta misma página podés completar el formulario de consulta: indicás las fechas de entrada y salida, cuántos huéspedes son y, si ya lo tenés claro, el tipo de habitación que te interesa. El sitio prepara el mensaje y abre WhatsApp con la consulta ya escrita. También podés llamar directamente al teléfono del hotel.',
    link: { href: '/habitaciones#consulta', label: 'Ir al formulario de consulta' },
  },
  {
    id: 'incluye',
    question: '¿Qué incluye una habitación?',
    answer:
      'Las habitaciones cuentan con baño privado, Wi-Fi sin costo y TV por cable. El aire acondicionado y el resto de amenidades dependen de la habitación asignada, por eso te lo confirmamos con detalle cuando respondemos tu consulta. Si necesitás algo específico, decínoslo en el mensaje.',
  },
  {
    id: 'precios',
    question: '¿Cómo consulto los precios?',
    answer:
      'Las tarifas dependen de la fecha, del tipo de habitación y del número de huéspedes. No las publicamos en el sitio para no mostrarte un valor que cambió. Escribinos por WhatsApp o llamanos con tus fechas y te respondemos con las opciones disponibles y sus tarifas vigentes.',
  },
  {
    id: 'ubicacion',
    question: '¿Dónde se encuentra el establecimiento?',
    answer:
      'Estamos en el Barrio La Cooperativa, en San Isidro de El General, Pérez Zeledón: 150 metros al sur de la Escuela Rafael Ángel Calderón Guardia, a pocos pasos del centro. Desde la página de ubicación podés abrir el mapa y las indicaciones para llegar.',
    link: { href: '/ubicacion', label: 'Ver ubicación y cómo llegar' },
  },
  {
    id: 'menu',
    question: '¿Cómo consulto el menú de la cafetería?',
    answer:
      'La carta y los precios vigentes los confirma el equipo en el momento, por eso no los publicamos aquí. Podés consultarlos por WhatsApp, pasar por el local durante el horario de atención o verlos en nuestra página de Facebook.',
    link: { href: '/cafeteria', label: 'Ver horarios de la cafetería' },
  },
  {
    id: 'checkin',
    question: '¿Cuáles son los horarios de entrada y salida?',
    answer:
      'El horario de check-in y check-out todavía no está publicado, y varía según la ocupación. Se te indica al confirmar la reserva: escribinos por WhatsApp con tus fechas y te respondemos con la hora exacta de llegada y de salida.',
  },
  {
    id: 'parqueo',
    question: '¿Hay dónde estacionar y hay Wi-Fi?',
    answer:
      'Sí. El hotel cuenta con estacionamiento para huéspedes que llegan en vehículo y con Wi-Fi sin costo en las habitaciones y en las áreas comunes, incluida la cafetería.',
  },
  {
    id: 'estadia',
    question: '¿A quién atiende Don Roberto?',
    answer:
      'Don Roberto es un proyecto familiar que comenzó en 2009 y que es atendido y administrado directamente por sus propietarios. Por eso el trato es cercano y personalizado: escribinos y te responde alguien del equipo.',
  },
];
