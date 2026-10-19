/**
 * ============================================================================
 *  MENÚ DE LA CAFETERÍA
 * ============================================================================
 *
 *  Estructura lista para cargar el menú real sin tocar la página. Cada
 *  categoría tiene un grupo de platos con nombre, descripción y precio.
 *
 *  REGLAS
 *  ------
 *  - Si `price` es `null`, la interfaz muestra «Consultar» y nunca inventa
 *    una cifra.
 *  - Si `available` es `false`, el plato se marca como agotado, no se oculta.
 *  - `tags` es opcional: sirve para marcar opciones (vegetariano, sin
 *    gluten, para llevar...) SOLO cuando el personal lo confirme.
 *
 *  MIENTRAS LA LISTA ESTÉ VACÍA, la página de cafetería muestra un mensaje
 *  elegante que indica que el menú vigente se consulta directamente con el
 *  establecimiento, con acceso a WhatsApp y a la ubicación.
 * ============================================================================
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Precio en colones. `null` = se consulta. */
  price: number | null;
  /** Nota visible junto al precio, p. ej. "con arroz y frijoles". */
  note: string | null;
  /** Etiquetas opcionales confirmadas por el negocio. */
  tags: string[];
  /** `false` marca el plato como agotado. */
  available: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  description: string;
  items: MenuItem[];
}

/**
 * Categorías del menú real.
 * Vacía a propósito: el propietario la completa con la carta vigente.
 */
export const menuCategories: MenuCategory[] = [];

/** `true` cuando ya hay un menú publicado. */
export const menuPublished = menuCategories.some((c) => c.items.length > 0);
