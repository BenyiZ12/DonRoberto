# Mantenimiento y mejoras futuras

Guía para quien se haga cargo del sitio después de la entrega.

---

## 1. Rutina mensual (15 minutos)

1. **Revisar que el negocio sigue igual.** Horarios, teléfono, dirección. Un
   cambio de horario en el local y no en el sitio es la forma más rápida de
   perder una reserva.
2. **Revisar el formulario de consulta** desde un teléfono: que el mensaje
   siga abriéndose en WhatsApp con los datos correctos.
3. **Mirar el perfil de Google** y responder las reseñas que lleguen. El sitio
   no las muestra, pero sí pueden llegar al negocio.
4. **Actualizar las fotos** si cambiaron la fachada, las habitaciones o la
   carta.

## 2. Rutina trimestral

- Actualizar las dependencias: `npm outdated` y, si hace falta,
  `npm update` seguido de `npm run check`.
- Volver a pasar la auditoría: `node scripts/audit.mjs`.
- Revisar los datos pendientes de `docs/PENDIENTES-DE-CONFIRMAR.md`: lo que
  faltaba confirmar y ya se confirmó, se publica; lo que se descartó, se
  elimina del código.

---

## 3. Cómo cambiar cada cosa

| Quiero cambiar… | Dónde |
| --- | --- |
| Nombre, dirección, teléfono, correo | `src/data/business.ts` |
| Horarios de la cafetería | `src/data/business.ts` → `openingHours` |
| Horarios de recepción y check-in | `src/data/business.ts` → `hotelHours` |
| Servicios que se publican | `src/data/business.ts` → `services` (solo los `status: 'confirmed'`) |
| Texto de la dirección | `src/data/business.ts` → `address.landmark`, `address.directions` |
| Tipos de habitación y tarifas | `src/data/rooms.ts` → `rooms` |
| Carta de la cafetería | `src/data/menu.ts` → `menuCategories` |
| Preguntas frecuentes | `src/data/faq.ts` |
| Título y metadescripción por defecto | `src/data/site.ts` |
| Colores y tipografía | `src/app/globals.css` (bloque `:root`) |
| Textos de las páginas | Cada `src/app/<ruta>/page.tsx` |
| Mensajes de WhatsApp | `src/lib/whatsapp.ts` |

Todos los textos de la interfaz están en español de Costa Rica, con «vos» y
trato cercano, pero profesional. Mantener ese tono en los cambios.

---

## 4. Datos estructurados

`src/lib/schema.ts` genera el JSON-LD. Reglas que no hay que romper:

- **No agregar `aggregateRating`, `review` ni `priceRange`** sin datos
  verificados. Google penaliza los datos estructurados que no coinciden con la
  página, y un `aggregateRating` inventado puede generar una acción manual
  contra el sitio.
- `numberOfRooms: 12` está confirmado; si el número de habitaciones cambia,
  hay que actualizarlo.
- Los horarios del JSON-LD se generan a partir de `openingHours`; si cambian,
  se actualiza solo.

Para ver lo que se publica:

```bash
node scripts/check-jsonld.mjs out/index.html
```

---

## 5. Activar Google Analytics (cuando el propietario lo autorice)

1. Crear la propiedad en analytics.google.com y copiar el ID (`G-XXXXXXX`).
2. En `src/app/layout.tsx`, dentro de `<head>`, añadir:

```tsx
{process.env.NEXT_PUBLIC_GA_ID ? (
  <>
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
      }}
    />
  </>
) : null}
```

3. Definir `NEXT_PUBLIC_GA_ID` en `.env.local` y reconstruir.

Los eventos que ya emite el sitio (`consulta_habitacion_enviada`,
`clic_whatsapp`, `clic_llamada`, `clic_mapa`, `visita_habitaciones`,
`visita_menu`, `envio_formulario`, `clic_navegacion`) llegan directamente a
`window.dataLayer`, así que no hay que tocar los componentes.

**Privacidad:** el sitio no envía datos personales. Los eventos llevan la
página, el tipo de habitación y el número de huéspedes, nada más. Si se activa
GA4, hay que revisar el consentimiento de cookies según la normativa
costarricense y la política del negocio.

---

## 6. Mejoras futuras recommendations

Ordenadas por relación entre impacto y esfuerzo.

### Alta prioridad

1. **Repertorio de habitaciones con fotos y tarifas.** Es lo único que falta
   para que la página de habitaciones convierta por completo. Depende de que el
   negocio confirme los datos (ver `docs/PENDIENTES-DE-CONFIRMAR.md`).
2. **Carta de la cafetería publicada.** La página ya tiene el diseño listo; solo
   falta cargar los datos en `src/data/menu.ts`.
3. **Formulario de contacto por correo con servicio real.** Hoy el sitio no
   envía nada por correo a propósito. Si el negocio contrata un servicio de
   formularios (Formspree, Netlify Forms, Google Apps Script), se puede
   conectar sin tocar el diseño.
4. **Confirmación de disponibilidad en línea.** Solo tiene sentido con un
   sistema de reservas real (calendario conectado al PMS o a un motor de
   reservas). Hoy el sitio deja claro que la disponibilidad la confirma el
   equipo, y eso hay que mantenerlo mientras no exista la integración.

### Media prioridad

5. **Galería de fotos de la cafetería** con las imágenes reales y un visor
   ampliado (el componente `Gallery` ya está listo y probado).
6. **Formulario corto en la cafetería** para pedidos para llevar, con mensaje
   de WhatsApp prellenado con el número de pedido.
7. **Testimonios reales**, si el negocio decide publicar los que tiene en
   Google. Habría que mostrarlos con la fecha y sin convertirlos en datos
   estructurados de valoración inventada.
8. **Mapa real embebido** (Google Maps Embed API) en vez del esquema vectorial
   actual, una vez confirmado el pin exacto.
9. **Página de habitaciones por tipo** (`/habitaciones/doble`) cuando haya más
   de tres tipos, para posicionar mejor en búsquedas específicas.

### Baja prioridad

10. **Modo claro/oscuro.** La paleta ya funciona en ambos, pero el modo
    automático obligaría a revisar todas las superficies.
11. **Internacionalización** (inglés para el turismo foreign). El sitio tiene
    `lang="es-CR"` y `locale="es_CR"`; añadir un segundo idioma duplicaría
    rutas.
12. **Blog decipes o recomendaciones locales**, si el negocio quiere posicionar
    como referente del cantón. Sería la mejor forma de conseguir enlaces
    naturales, pero exige contenido sostenido.

---

## 7. Riesgos y cuidados

| Riesgo | Cómo se mitiga |
| --- | --- |
| Publicar un dato falso (precios, horarios, fotos) | Todo lo no verificado está oculto o marcado como pendiente. Revisar la lista antes de publicar |
| Que el número de WhatsApp cambie | `whatsappNumber` está en un solo lugar (`src/data/business.ts`) |
| Que el dominio cambie | `NEXT_PUBLIC_SITE_URL` + reconstruir |
| Que se rompa el SEO al rediseñar | Cada ruta tiene su propio HTML, título, descripción y JSON-LD; comprobar con `scripts/audit.mjs` |
| Que el sitio quede desactualizado | La edición está centralizada en `src/data/`; revisar mensualmente |
| Perder el aviso de los datos pendientes | `docs/PENDIENTES-DE-CONFIRMAR.md` es el expediente; tick cada ítem confirmado |

---

## 8. Comandos útiles

```bash
npm run dev         # desarrollo con recarga en caliente
npm run build       # compila a out/
npm run serve       # previsualiza out/ en el puerto 4173
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run check       # las tres cosas seguidas

npm run audit       # auditoría con Chrome headless (18 comprobaciones)
npm run audit:shots # la auditoría anterior + capturas de pantalla
npm run test:ui     # pruebas funcionales del formulario, menú, acordeón y galería
node scripts/test-navigation.mjs   # pruebas de navegación entre páginas
node scripts/check-html.mjs out/index.html
node scripts/check-jsonld.mjs out/index.html
node scripts/check-chars.mjs
node scripts/shot.mjs "http://localhost:4173/" "captura.png" 1440 900 full
```

> Las pruebas de interfaz necesitan `npm run serve` (y `npm run dev` para la
> prueba de la galería, que solo existe cuando hay fichas de habitación
> publicadas o datos de ejemplo activos).
