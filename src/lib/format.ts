/**
 * ============================================================================
 *  FORMATO
 * ============================================================================
 */

/** Colones costarricenses: ₡3.500 */
export function formatCRC(amount: number): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Número de huéspedes con plural correcto: 1 huésped / 2 huéspedes */
export function formatGuests(count: number): string {
  return `${count} ${count === 1 ? 'huésped' : 'huéspedes'}`;
}

/** Une una lista de textos con comas: "a, b y c" */
export function formatList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}
