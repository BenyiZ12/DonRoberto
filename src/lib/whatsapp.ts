import { contact } from '@/data/business';
import { formatShort } from './dates';

/**
 * ============================================================================
 *  WHATSAPP — construcción de mensajes
 * ============================================================================
 *
 *  No hay backend: el sitio arma un texto en español y abre el enlace
 *  oficial de WhatsApp con ese texto ya escrito. El usuario decide si lo
 *  envía. De esta forma nunca se promete disponibilidad ni se almacena
 *  información personal.
 *
 *  Reglas:
 *  - El número va en formato internacional, solo dígitos, sin «+», espacios
 *    ni guiones: https://wa.me/NUMERO
 *  - El mensaje se codifica con encodeURIComponent.
 * ============================================================================
 */

const WHATSAPP_BASE = 'https://wa.me';

export function whatsappUrl(message: string, number: string = contact.whatsappNumber): string {
  return `${WHATSAPP_BASE}/${number}?text=${encodeURIComponent(message)}`;
}

export interface StayInquiry {
  /** Nombre del huésped. Opcional. */
  name?: string;
  /** Fecha de entrada en formato ISO (yyyy-mm-dd). */
  checkIn: string;
  /** Fecha de salida en formato ISO (yyyy-mm-dd). */
  checkOut: string;
  /** Número de huéspedes. */
  guests: number;
  /** Tipo de habitación de interés, si ya está definido. */
  roomType?: string | null;
}

/**
 * Mensaje de consulta de habitación. Sigue de cerca el guion pedido por el
 * cliente y omite los campos opcionales que el usuario no completó.
 */
export function buildStayMessage(inquiry: StayInquiry): string {
  const lines: string[] = [];

  lines.push(
    'Hola, Don Roberto. Me gustaría consultar disponibilidad para una estancia del ' +
      `${formatShort(inquiry.checkIn)} al ${formatShort(inquiry.checkOut)}, para ${inquiry.guests} ${
        inquiry.guests === 1 ? 'persona' : 'personas'
      }.`,
  );

  if (inquiry.roomType) {
    lines.push(`Tipo de habitación de interés: ${inquiry.roomType}.`);
  }

  if (inquiry.name && inquiry.name.trim().length > 0) {
    lines.push(`A nombre de: ${inquiry.name.trim()}.`);
  }

  lines.push('¿Podrían facilitarme las opciones disponibles y sus tarifas?');

  return lines.join('\n');
}

/** Mensaje para consultar un tipo de habitación concreto. */
export function buildRoomMessage(roomName: string): string {
  return (
    `Hola, Don Roberto. Me interesa la habitación «${roomName}». ` +
    '¿Podrían facilitarme la disponibilidad y las tarifas?'
  );
}

/** Mensaje para consultar el menú de la cafetería. */
export function buildMenuMessage(): string {
  return (
    'Hola, Don Roberto. Quisiera consultar el menú de la cafetería y los precios vigentes. ' +
    '¿Me lo pueden enviar por favor?'
  );
}

/** Mensaje genérico para consultas que no son de habitación. */
export function buildGeneralMessage(topic?: string): string {
  const base = 'Hola, Don Roberto. Quisiera consultar información';
  return topic ? `${base} sobre ${topic}. ¿Me pueden orientar?` : `${base}. ¿Me pueden orientar?`;
}
