# Fotografías necesarias

Las fotografías son el factor de conversión más importante de un hotel. Este
sitio se construyó **sin** fotografías reales: en su lugar hay **marcos
reservados** que indican exactamente qué imagen va en cada lugar. No se usaron
fotos de otros hoteles ni imágenes de banco, porque presentar una foto
ajena como si fuera de Don Roberto es la forma más rápida de perder la
confianza de un huésped.

## Dónde van y cómo se activan

Cada marco corresponde a una entrada de `photoSlots` en
`src/data/business.ts`. Para activar una foto:

1. Guardá el archivo en `public/fotos/` (WebP o JPEG, 1600 px de ancho como
   máximo para las grandes, 1200 px para las secundarias).
2. En `src/data/business.ts`, poné `src` con la ruta pública y ajustá
   `width`/`height` a las dimensiones reales:

```ts
{
  src: '/fotos/fachada-principal.webp',
  alt: 'Fachada de Don Roberto - Hotel y Cafetería en San Isidro de El General',
  slot: 'fachada-principal',
  width: 1600,
  height: 1100,
}
```

El componente `PhotoSlot` (y la galería de habitaciones) cambian de marco a
fotografía automáticamente. No hay que tocar ningún otro archivo.

---

## Lista maestra

### Prioridad 1 — imprescindible para publicar

| # | Identificador | Qué photographiar | Dónde se usa | Encuadre |
| --- | --- | --- | --- | --- |
| 1 | `facheda-principal` | La fachada del local desde la calle, con el letrero de Don Roberto visible | Portada (hero) y sección del hotel | Vertical (4:5), con luz natural de mañana |
| 2 | `habitacion-principal` | Una habitación representative, con la cama hecha | Portada (habitaciones) y bloque de hotel | Horizontal (7:5) o 4:3 |
| 3 | `cafeteria-interior` | El interior de la cafetería: barra, mesas, el ambiente | Portada (cafetería) | Horizontal (7:5) |
| 4 | `plato-cocina` | Un plato de la cocina, de los que más se piden | Portada (cafetería) | Cuadrado (1:1), fondo neutro |

### Prioridad 2 — completan las fichas

| # | Identificador | Qué photographiar | Dónde se usa | Encuadre |
| --- | --- | --- | --- | --- |
| 5 | `bano-privado` | El baño de una habitación: ducha, lavamanos, espejo | Galería de cada tipo de habitación | Horizontal (4:3) |
| 6 | `fachada-lateral` | El acceso lateral o el local esquinero, con el parqueo | Sección de ubicación | Horizontal (4:3) |
| 7 | `habitacion-detalle` | Detalle de la habitación: lámpara, mesa, ventana | Galería de habitaciones | Horizontal (4:3) |
| 8 | `recepcion` | La recepción del hotel | Habitaciones | Horizontal (4:3) |
| 9 | `parqueo` | El estacionamiento visto desde la entrada | Ubicación | Horizontal (4:3) |
| 10 | `entorno` | El entorno: la calle, la acera, el vecindario | Ubicación | Horizontal (7:5) |

### Prioridad 3 — contenido de la cafetería

| # | Identificador | Qué photographiar | Dónde se usa | Encuadre |
| --- | --- | --- | --- | --- |
| 11 | `desayuno` | El desayuno servido | Cafetería | Horizontal (7:5) |
| 12 | `cafe` | El café, con vapor o la textura de la taza | Cafetería | Cuadrado (1:1) |
| 13 | `comida-casera` | Un segundo plato de la carta | Cafetería | Cuadrado (1:1) |
| 14 | `barista` / `cocinero` | El equipo preparando o sirviendo | Cafetería | Horizontal (4:3) |

### Prioridad 4 — confianza y contexto

| # | Identificador | Qué photographiar | Dónde se usa | Encuadre |
| --- | --- | --- | --- | --- |
| 15 | `fachada-noche` | La fachada iluminada de noche | Portada (variante) | Vertical (4:5) |
| 16 | `habitacion-doble` | La habitación doble completa, con las camas hechas | Ficha de habitación doble | Horizontal (7:5) |
| 17 | `habitacion-familiar` | La habitación familiar, con el espacio para todos | Ficha de habitación familiar | Horizontal (7:5) |
| 18 | `area-comun` | Sala o sala de estar, si existe | Habitaciones | Horizontal (7:5) |

---

## Reglas de fotografía

- **Teléfono o cámara reciente.** Con buena luz y en horizontal; el sitio
  ya se encarga de los recortes.
- **Luz natural.** Las fotos con flash directo se ven cheap y echan para atrás.
  Lo ideal es disparar entre las 8 y las 10 de la mañana, con las cortinas
  abiertas.
- **Endereza las verticales.** Un edificio inclinado o torcido transmite
  descuido.
- **Nada de filtros.** Ni Instagram, ni saturación, ni HDR exagerado. El sitio
  ya aplica su propia paleta.
- **Nada de personas identificables** sin permiso, salvo que sean los
  propietarios y lo autoricen por escrito.
- **Permisos:** si aparece una persona en la foto, que firme una autorización
  de uso comercial. Guardarla en la carpeta del proyecto.

## Formato y peso

| Uso | Ancho máximo | Formato recomendado | Peso máximo |
| --- | --- | --- | --- |
| Portada / hero | 1600 px | WebP | 200 KB |
| Secciones | 1400 px | WebP | 150 KB |
| Galería / tarjetas | 1200 px | WebP | 120 KB |

Si el archivo pesa más, se puede convertir con [squoosh.app](https://squoosh.app)
o con `cwebp`. Todas las fotos deben tener `width` y `height` correctos en el
código para que el sitio no salte al cargar (CLS) y para que los lectores de
pantalla tengan un tamaño reservado.

## Después de subirlas

1. `npm run build` y `npm run serve`.
2. Revisar `/`, `/habitaciones`, `/cafeteria` y `/ubicacion`.
3. Comprobar que los textos alternativos (`alt`) describen lo que se ve, no
   repetir «habitación de Don Roberto» en todas.
