# Sitio web — Don Roberto · Hotel y Cafetería

Sitio web profesional para **Don Roberto - Hotel y Cafetería**, en San Isidro de El
General, Pérez Zeledón (Costa Rica).

El sitio cumple dos objetivos comerciales: conseguir **solicitudes de reserva de
habitaciones** y dar visibilidad a la **cafetería** (carta, horarios y ubicación).
No hay pagos en línea, ni disponibilidad automática, ni confirmaciones automáticas.

---

## 1. Puesta en marcha

Requisitos: **Node.js 20.9 o superior** (probado con Node 24) y npm 10 o superior.

```bash
npm install          # instala dependencias
npm run dev          # servidor de desarrollo → http://localhost:3000
```

Otros comandos:

| Comando            | Qué hace                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| `npm run dev`      | Servidor de desarrollo con recarga en caliente.                          |
| `npm run build`    | Compila el sitio **estático** en la carpeta `out/`.                      |
| `npm run serve`    | Sirve `out/` como lo haría un hosting real → http://localhost:4173.     |
| `npm run lint`     | ESLint (formato plano) sobre `src/` y `scripts/`.                         |
| `npm run typecheck`| Comprobación de TypeScript sin emitir archivos.                          |
| `npm run audit`    | Auditoría automática en Chrome headless (18 comprobaciones).              |
| `npm run test:ui`  | Pruebas funcionales de formulario, menú, acordeón y galería.              |
| `npm run check`    | `typecheck` + `lint` + `build` (todo lo que debe pasar antes de publicar). |

> `npm run build` ejecuta antes `prebuild` (genera `public/og-image.png`, la
> imagen que se ve al compartir el sitio) y después `postbuild`
> (`scripts/fix-rsc-payloads.mjs`, que crea los archivos de payload que el
> enrutador del navegador pide y que Next.js no exporta con el nombre
> esperado). **No hay que ejecutar el `postbuild` a mano.**

### Variables de entorno

Copia `.env.example` a `.env.local` y ajústalo. La única variable necesaria para
publicar es el dominio:

```bash
NEXT_PUBLIC_SITE_URL=https://www.tudominio.com
```

Sin esa variable el sitio **funciona igual**, pero no publica URL canónica, no
genera el `sitemap.xml` con URLs absolutas y las etiquetas para redes sociales
quedan sin imagen. Nunca se inventa un dominio: está vacío a propósito hasta que
el propietario lo confirme.

---

## 2. Por qué Next.js y no un SPA con Vite

El brief pedía React + TypeScript + Vite, y lo habría cumplido. Se eligió
**Next.js 15/16 con App Router y exportación estática** (`output: 'export'`)
por una razón técnica concreta: **cada ruta se compila a un HTML real** con su
propio `<title>`, su metadescripción, su etiqueta canónica y su JSON-LD.

Para un negocio local que necesita posicionar en búsquedas como *“hotel en Pérez
Zeledón”* o *“cafetería en San Isidro de El General”*, eso es una diferencia
relevante: el HTML que ve Google no depende de que se ejecute JavaScript.

Ventajas concretas de esta elección:

- **SEO local**: metadatos por página, `sitemap.xml` y `robots.txt` generados en
  el build, y datos estructurados `Hotel` + `CafeOrCoffeeShop` + `FAQPage`.
- **Rendimiento**: las fuentes se descargan y se sirven **autoalojadas** desde el
  propio dominio (sin peticiones a Google Fonts en tiempo de ejecución), con
  `preload` y `font-display: swap`.
- **Despliegue**: la salida es 100 % estática. Se publica en Netlify, Vercel,
  Cloudflare Pages, GitHub Pages o un cPanel compartido, **sin Node en el
  servidor** y sin coste de hosting.
- **Sin servidor**: no hay base de datos, ni API, ni que mantener encendido.

La contrapartida es un `node_modules` más pesado y un build más lento que un
Vite puro. Para este proyecto compensa.

---

## 3. Estructura del proyecto

```
Don Roberto/
├── docs/                       Documentación operativa (ver más abajo)
├── public/
│   ├── icon.svg                Favicon (marca de arco)
│   └── og-image.png            Imagen social (se regenera en el build)
├── scripts/
│   ├── generate-og.mjs         Genera la imagen social
│   ├── fix-rsc-payloads.mjs    Aplana los payloads RSC que Next.js no exporta bien
│   ├── serve.mjs               Servidor estático para previsualizar `out/`
│   ├── audit.mjs               Auditoría automática con Chrome headless
│   ├── test-interactions.mjs   Pruebas funcionales de la interfaz
│   ├── test-navigation.mjs     Pruebas de navegación entre páginas
│   ├── check-html.mjs          Comprobación del HTML exportado
│   ├── check-jsonld.mjs        Volcado de los datos estructurados
│   ├── check-chars.mjs         Detecta caracteres corruptos en el código
│   ├── shot.mjs                Captura de pantalla de una URL
│   └── diag-payloads.mjs       Diagnóstico de las peticiones de payload
└── src/
    ├── app/                    Rutas (una carpeta por página)
    │   ├── layout.tsx          Encabezado, pie, fuentes, metadatos, JSON-LD
    │   ├── page.tsx            Portada
    │   ├── habitaciones/       /habitaciones
    │   ├── cafeteria/          /cafeteria
    │   ├── ubicacion/          /ubicacion
    │   ├── contacto/           /contacto
    │   ├── preguntas-frecuentes/  /preguntas-frecuentes
    │   ├── not-found.tsx       Página 404
    │   ├── sitemap.ts          sitemap.xml
    │   ├── robots.ts           robots.txt
    │   └── globals.css         Sistema de diseño (tokens, tipografía, layout)
    ├── components/
    │   ├── booking/            Formulario de consulta por WhatsApp
    │   ├── layout/             Encabezado, pie, logo, botón flotante
    │   ├── sections/           Bloques de página (hero, secciones, galería…)
    │   ├── seo/                Componente de JSON-LD
    │   └── ui/                 Botón, acordeón, foto reservada, insignia…
    ├── data/                   ⬅ INFORMACIÓN COMERCIAL (editar aquí)
    │   ├── business.ts         Negocio, dirección, contacto, horarios, servicios
    │   ├── rooms.ts            Tipos de habitación (estructura lista)
    │   ├── rooms.demo.ts       Ejemplo de habitaciones (solo desarrollo)
    │   ├── menu.ts             Menú de la cafetería (estructura lista)
    │   ├── menu.demo.ts        Ejemplo de menú (solo desarrollo)
    │   ├── faq.ts              Preguntas frecuentes
    │   └── site.ts             Configuración SEO y banderas del sitio
    └── lib/
        ├── whatsapp.ts         Construcción de mensajes y enlaces wa.me
        ├── dates.ts            Validación y formato de fechas
        ├── format.ts           Formato de moneda y listas
        ├── analytics.ts        Analítica opcional (sin terceros por defecto)
        └── schema.ts           Generadores de datos estructurados
```

---

## 4. Dónde se edita la información del negocio

**Todo lo comercial está en `src/data/`.** Ningún componente escribe el nombre
del negocio, el teléfono, la dirección o los horarios por su cuenta.

| Archivo | Qué contiene |
| --- | --- |
| `src/data/business.ts` | Nombre, dirección, teléfono, correo, redes, horarios, servicios, fotos pendientes |
| `src/data/rooms.ts` | Tipos de habitación (vacío hasta que se confirmen) |
| `src/data/menu.ts` | Categorías y platos de la cafetería (vacío hasta que se confirme) |
| `src/data/faq.ts` | Preguntas y respuestas |
| `src/data/site.ts` | Título por defecto, metadescripción, navegación, banderas |

### Publicar los tipos de habitación

1. Abrí `src/data/rooms.ts` y completá el array `rooms`:

```ts
export const rooms: Room[] = [
  {
    slug: 'habitacion-doble',
    name: 'Habitación doble',
    status: 'confirmed',
    tagline: 'Dos camas, baño privado y ventana al centro',
    description: 'Descripción real de la habitación…',
    capacity: 3,                 // null si aún no está confirmado
    bedType: 'Dos camas matrimoniales',
    amenities: ['Baño privado', 'Wi-Fi sin costo', 'TV por cable'],
    price: 28000,                // null = se muestra «Tarifa por confirmar»
    priceNote: 'por noche, desayuno incluido',
    conditions: ['Ingreso desde las 2:00 p. m.'],
    photos: [ ... ],
    inquiryLabel: 'Consultar esta habitación',
  },
];
```

2. Subí las fotos a `public/fotos/` y asigná su `src` en el `PhotoSlot`
   correspondiente (o creá nuevos en `photoSlots`, dentro de `business.ts`).
3. La página se actualiza sola: si hay habitaciones confirmadas, se muestran
   con su galería, ficha, precio y botón de consulta por WhatsApp.

### Publicar el menú

1. Abrí `src/data/menu.ts` y completá `menuCategories`.
2. Cada plato con `price: null` se muestra como **«Consultar»**: nunca se
   inventa un precio.
3. Si un plato se agotó, poné `available: false` y aparece marcado como tal.

### Añadir fotos reales

`src/data/business.ts` → `photoSlots`. Cada espacio reservado tiene un `slot`
(un identificador) y un `alt` descriptivo. Cuando llegue la foto:

```ts
{
  src: '/fotos/fachada-principal.webp',   // antes: null
  alt: 'Fachada de Don Roberto - Hotel y Cafetería en San Isidro de El General',
  slot: 'fachada-principal',
  width: 1600,
  height: 1100,
}
```

El componente `PhotoSlot` cambia solo del marco reservado a la fotografía real.
En `docs/FOTOGRAFIAS-NECESARIAS.md` está la lista exacta de lo que hay que pedir.

---

## 5. Cómo funciona la consulta por WhatsApp

No hay backend. El formulario de `src/components/booking/StayInquiryForm.tsx`:

1. Valida en el navegador: la entrada no puede estar en el pasado, la salida
   debe ser **posterior** a la entrada y el número de huéspedes debe ser coherente.
2. Arma un mensaje en español con los datos:

   > Hola, Don Roberto. Me gustaría consultar disponibilidad para una estancia del
   > 19/10/2026 al 20/10/2026, para 2 personas. Tipo de habitación de interés:
   > Habitación doble. A nombre de: Ana. ¿Podrían facilitarme las opciones
   > disponibles y sus tarifas?

3. Abre `https://wa.me/50627723348?text=…` en una pestaña nueva.
4. Muestra el mensaje prepared en pantalla, con botones para **abrir WhatsApp**
   otra vez o **copiar el texto** si el navegador bloqueó la ventana emergente.

El sitio **nunca** afirma que una habitación esté disponible ni envía datos a
ningún servidor: el usuario decide enviar el mensaje.

---

## 6. Analítica (opcional, desactivada por defecto)

No se carga ningún script de seguimiento. `src/lib/analytics.ts` registra los
eventos y los entrega de forma neutra: si existe `window.dataLayer` los envía
allí; además dispara un evento DOM `donroberto:analytics`.

Eventos disponibles: `consulta_habitacion_enviada`, `clic_whatsapp`,
`clic_llamada`, `clic_mapa`, `visita_habitaciones`, `visita_menu`,
`envio_formulario`, `clic_navegacion`.

Para activar Google Analytics 4 hay que **añadir el ID de medición que deliver
el propietario** (ver `docs/MANTENIMIENTO.md`). No se ha incluido ningún
identificador de ejemplo: se pidió expresamente no inventarlos.

---

## 7. Comprobaciones ejecutadas

| Comprobación | Resultado |
| --- | --- |
| `npm run typecheck` | Sin errores |
| `npm run lint` (ESLint 10, flat config) | Sin errores ni advertencias |
| `npm run build` (Next 16.4.2, export estático) | 11 rutas generadas sin errores |
| `npm run serve` + `npm run audit` (Chrome headless) | 18 comprobaciones (6 rutas × 3 tamaños) sin observaciones |
| `npm run test:ui` | 12 pruebas funcionales: todas correctas |
| Navegación entre páginas (SPA) | 4 pruebas: ruta correcta, sin recarga completa, título actualizado, sin 404 |
| Desbordamiento horizontal | Ninguno en 390 px, 768 px ni 1440 px |
| Errores de consola | Ninguno (incluidos los payloads RSC de la pre-carga de rutas) |
| `<h1>` único por página | 6/6 correctas |
| Imágenes sin `alt` | 0 |
| JSON-LD | Presente en las 6 páginas (FAQ añade `FAQPage`) |
| Enlaces de WhatsApp / teléfono / mapa | Presentes y con destino correcto |
| `robots.txt` y `sitemap.xml` | Se generan (el sitemap con URLs absolutas cuando hay dominio) |
| Con `NEXT_PUBLIC_SITE_URL` definido | Canonical, `og:image` y sitemap con el dominio correcto en las 6 páginas |
| Caracteres corruptos en el código | Ninguno (`node scripts/check-chars.mjs`) |

---

## 8. Documentación

- [`docs/PENDIENTES-DE-CONFIRMAR.md`](docs/PENDIENTES-DE-CONFIRMAR.md) — qué datos
  hay que verificar con el propietario **antes de publicar**.
- [`docs/FOTOGRAFIAS-NECESARIAS.md`](docs/FOTOGRAFIAS-NECESARIAS.md) — lista exacta
  de las fotografías que hay que solicitar.
- [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md) — publicación y configuración del
  dominio, paso a paso.
- [`docs/MANTENIMIENTO.md`](docs/MANTENIMIENTO.md) — mantenimiento, mejoras
  futuras y cómo actualizar el contenido.
