import type { MenuCategory } from './menu';

/**
 * Datos de ejemplo del menú, SOLO para revisar el diseño en desarrollo
 * (NEXT_PUBLIC_SHOW_DEMO=true o `npm run dev`).
 *
 * No se inventan platos reales: los nombres son marcadores de posición
 * genéricos y todos los precios son `null` (se muestran como «Consultar»).
 * En producción este archivo no se usa.
 */
export const demoMenuCategories: MenuCategory[] = [
  {
    id: 'ejemplo-1',
    title: 'Categoría de ejemplo',
    description: 'Descripción de la categoría, por confirmar con el negocio.',
    items: [
      {
        id: 'ejemplo-1-1',
        name: 'Nombre del plato (ejemplo)',
        description: 'Descripción del plato, por confirmar.',
        price: null,
        note: 'Ingredientes por confirmar',
        tags: [],
        available: true,
      },
      {
        id: 'ejemplo-1-2',
        name: 'Segundo plato (ejemplo)',
        description: 'Descripción del plato, por confirmar.',
        price: null,
        note: null,
        tags: [],
        available: true,
      },
    ],
  },
  {
    id: 'ejemplo-2',
    title: 'Otra categoría (ejemplo)',
    description: 'Descripción de la categoría, por confirmar con el negocio.',
    items: [
      {
        id: 'ejemplo-2-1',
        name: 'Plato de esta categoría (ejemplo)',
        description: 'Descripción del plato, por confirmar.',
        price: null,
        note: null,
        tags: [],
        available: true,
      },
    ],
  },
];
