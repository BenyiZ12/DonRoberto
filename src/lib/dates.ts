/**
 * ============================================================================
 *  FECHAS — helpers sin dependencias externas
 * ============================================================================
 *
 *  Todo se trabaja con fechas locales (yyyy-mm-dd) para evitar desfases de
 *  zona horaria: `new Date().toISOString()` puede devolver el día anterior
 *  en países con UTC-.
 * ============================================================================
 */

const MONTHS_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const WEEKDAYS_ES = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];

/** Convierte `Date` a `yyyy-mm-dd` usando la zona horaria local. */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Fecha de hoy en formato `yyyy-mm-dd`. */
export function todayIso(): string {
  return toIsoDate(new Date());
}

/** Suma `days` días a una fecha ISO. */
export function addDays(iso: string, days: number): string {
  const date = parseIso(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/** Convierte `yyyy-mm-dd` a `Date` local (medianoche). */
export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map((part) => Number(part));
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

/** `true` si la cadena es una fecha ISO válida y real (no 31/02). */
export function isValidIsoDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const date = parseIso(iso);
  return toIsoDate(date) === iso;
}

/** Formato corto: 12/11/2026 */
export function formatShort(iso: string): string {
  if (!isValidIsoDate(iso)) return iso;
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** Formato largo: 12 de noviembre de 2026 */
export function formatLong(iso: string): string {
  if (!isValidIsoDate(iso)) return iso;
  const date = parseIso(iso);
  const day = date.getDate();
  const month = MONTHS_ES[date.getMonth()] ?? '';
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

/** Formato largo con día de la semana: jueves 12 de noviembre de 2026 */
export function formatLongWithWeekday(iso: string): string {
  if (!isValidIsoDate(iso)) return iso;
  const date = parseIso(iso);
  const weekday = WEEKDAYS_ES[date.getDay()] ?? '';
  return `${weekday} ${formatLong(iso)}`;
}

/** Número de noches entre dos fechas ISO. */
export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!isValidIsoDate(checkIn) || !isValidIsoDate(checkOut)) return 0;
  const ms = parseIso(checkOut).getTime() - parseIso(checkIn).getTime();
  return Math.round(ms / 86_400_000);
}

/** Etiqueta legible para las noches: "3 noches" / "1 noche". */
export function formatNights(count: number): string {
  return count === 1 ? '1 noche' : `${count} noches`;
}

export interface StayValidation {
  valid: boolean;
  errors: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    name?: string;
  };
  nights: number;
}

/**
 * Valida una solicitud de estancia.
 * - La entrada no puede estar en el pasado.
 * - La salida debe ser posterior a la entrada.
 * - El número de huéspedes se mantiene en un rango razonable.
 */
export function validateStay(input: {
  checkIn: string;
  checkOut: string;
  guests: number;
  name?: string;
}): StayValidation {
  const errors: StayValidation['errors'] = {};
  const today = todayIso();

  if (!input.checkIn) {
    errors.checkIn = 'Indicá la fecha de entrada.';
  } else if (!isValidIsoDate(input.checkIn)) {
    errors.checkIn = 'La fecha de entrada no es válida.';
  } else if (input.checkIn < today) {
    errors.checkIn = 'La fecha de entrada no puede ser anterior a hoy.';
  }

  if (!input.checkOut) {
    errors.checkOut = 'Indicá la fecha de salida.';
  } else if (!isValidIsoDate(input.checkOut)) {
    errors.checkOut = 'La fecha de salida no es válida.';
  } else if (errors.checkIn === undefined && input.checkOut <= input.checkIn) {
    errors.checkOut = 'La fecha de salida debe ser posterior a la de entrada.';
  }

  if (!Number.isFinite(input.guests) || input.guests < 1) {
    errors.guests = 'Indicá al menos un huésped.';
  } else if (input.guests > 12) {
    errors.guests = 'Para más de 12 huéspedes, escribinos directamente por WhatsApp.';
  }

  if (input.name && input.name.trim().length > 60) {
    errors.name = 'El nombre es demasiado largo (máximo 60 caracteres).';
  }

  const nights =
    !errors.checkIn && !errors.checkOut ? nightsBetween(input.checkIn, input.checkOut) : 0;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    nights,
  };
}
