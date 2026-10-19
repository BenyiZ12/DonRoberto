# Datos pendientes de confirmar con el propietario

**Antes de publicar** hay que confirmar los puntos de esta lista. Todo lo que
aparece acá está deliberadamente **sin publicar** o **marcado como pendiente** en
el sitio: nunca se dio por cierto algo sin respaldo.

Legendario de estado:

- 🟡 **Pendiente** — no se publica; se muestra «Por confirmar» o un mensaje que
  indica cómo consultarlo.
- 🟢 **Verificado** — ya se publica; conviene una confirmación final para
  dejarlo cerrado en el expediente.

---

## 1. Datos ya verificados en fuentes públicas 🟢

Estos datos se tomaron del Directorio Comercial de la Cámara de Comercio de la
Región Brunca, del portal «Qué hacer en Pérez Zeledón», de la página oficial de
Facebook y del perfil del establecimiento en Tripadvisor y Google Hotels.

| Dato | Valor publicado | Fuente |
| --- | --- | --- |
| Nombre comercial | Don Roberto - Hotel y Cafetería | Todas las fuentes coinciden |
| Dirección | Barrio La Cooperativa, 150 m al sur de la Escuela Rafael Ángel Calderón Guardia, San Isidro de El General, Pérez Zeledón | Cámara Brunca + Tripadvisor |
| Teléfono | +506 2772-3348 | Cámara Brunca, Facebook, Tripadvisor |
| Correo | donrobertopz@gmail.com | Cámara Brunca, «Qué hacer en Pérez» |
| Facebook | facebook.com/DonRobertoPZ | Página oficial |
| Número de habitaciones | 12 | Tripadvisor + «Qué hacer en Pérez» |
| Año de inicio | 2009, proyecto familiar atendido por los propietarios | «Qué hacer en Pérez» + perfil de Tripadvisor |
| Baño privado, TV por cable | En todas las habitaciones | Descripción del directorio + opiniones de huéspedes |
| Wi-Fi sin costo, estacionamiento, restaurante | Servicios del establecimiento | Perfil de Tripadvisor |
| Horarios de la cafetería | L–V 6:00 a. m. – 8:30 p. m.; Sáb 6:30 a. m. – 10:00 a. m. | Cámara Brunca |

---

## 2. Lo que hay que confirmar 🟡

### 2.1 Dirección (prioridad alta)

- **Distancia y punto de referencia.** El directorio local dice «150 metros sur de
  la Escuela Rafael Ángel Calderón Guardia»; la página de Facebook menciona
  «200 m»; otra fuente dice «75 sur de Cable Tica». **El sitio publica la
  versión del directorio comercial (150 m).** Hay que confirmar cuál es la
  correcta y si el local es el mismo que el de «Barrio La Cooperativa».
- **Nombre del punto de referencia.** «Escuela» o «Colegio» Rafael Ángel
  Calderón Guardia.
- **Número de puerta y código postal.** El código 11901 aparece en el perfil de
  Tripadvisor; conviene confirmarlo.
- **Coordenadas.** El sitio las publica como *aproximadas* y el botón de Google
  Maps usa búsqueda por texto (nunca una coordenada inventada). Conviene
  confirmar el pin exacto y fijar la foto de perfil de Google Business.

### 2.2 Horarios

- **Recepción del hotel / check-in / check-out.** No está publicado en ninguna
  fuente. El sitio lo muestra como «Por confirmar» y lo pide al reservar.
- **Horario de la cafetería el domingo.** El directorio solo publica lunes a
  viernes y sábado. Hay que confirmar si domingo abre, y con qué horario.
- **Horario de la cafetería en días festivos.** Sin dato.
- **Horario real de la soda.** Hay discrepancias entre directorios (otro portal
  indica 6:00 a. m. – 8:00 p. m. y la página de Facebook muestra horarios
  distintos según el día). El sitio publica el del directorio comercial.

### 2.3 Habitaciones (prioridad alta)

Ningún tipo de habitación está publicado: el sitio lo explica de forma
explícita y deriva a WhatsApp. Falta:

- [ ] Cuántos **tipos** de habitación hay (individual, doble, familiar…) y qué
      nombre usa el negocio para cada uno.
- [ ] **Capacidad máxima** de cada tipo.
- [ ] **Tipo de camas** y cantidad por habitación.
- [ ] **Número de habitaciones** de cada tipo (el total de 12 sí está verificado).
- [ ] **Amenidades por habitación**: ¿todas tienen aire acondicionado? ¿todas
      tienen kitchenette y microondas? ¿el TV por cable es en todas o solo en
      algunas? (El aire acondicionado aparece en la ficha pública; la
      kitchenette y el microondas, en el perfil de Google Hotels. Ninguna de las
      dos está confirmada por el negocio.)
- [ ] **Tarifas** por noche y por tipo, y qué incluyen (desayuno, impuestos,
      servicio).
- [ ] **Condiciones**: mínimo de noches, hora de check-in y check-out, política
      de cancelación, depósito, formas de pago.
- [ ] Si admiten **mascotas** (aparece como etiqueta en plataformas de reserva,
      pero no está confirmado por el negocio).
- [ ] Si ofrecen **habitación familiar** (la ficha pública lo sugiere).
- [ ] Si hay **servicio de la soda** para huéspedes y si tiene costo aparte.

### 2.4 Cafetería

- [ ] **Carta vigente**: categorías, platos, descripción y precios. El sitio
      muestra un mensaje elegante que deriva a WhatsApp; no se publica ningún
      plato ni precio.
- [ ] Si hay **opciones para vegetarianos, sin gluten o sin dairy** (y cuáles).
- [ ] Si hay **delivery** a domicilio (la página de Facebook menciona pedidos
      «para llevar», no reparto).
- [ ] Si hacen **desayuno Buffett** o algún servicio de desayuno formal.
- [ ] Si aceptan **reservas de mesa** y de qué tamaño.
- [ ] Marcas de café que sirven y de dónde es el grano.

### 2.5 Negocio y contacto

- [ ] **Número de WhatsApp.** Se usa el mismo teléfono fijo publicado
      (+506 2772-3348) porque aparece en la página oficial de Facebook con
      formato de celular (2772-33-48). Si tienen un móvil distinto, hay que
      cambiar `whatsappNumber` en `src/data/business.ts`.
- [ ] Si tienen un **número de teléfono fijo** propio adicional (el que se
      publica en el directorio de la Cámara Brunca, +506 2771-6096, es de la
      Cámara, no del hotel).
- [ ] **Instagram** u otra red oficial: no se encontró perfil verificado, por
      eso el sitio solo enlaza Facebook.
- [ ] **Correo de contacto**: se publica el Gmail del directorio. Si quieren
      usar uno con su propio dominio, cambiarlo.
- [ ] Si reciben **reservas por correo** y quién las responde.
- [ ] **Persona o personas de contacto** (para el pie de página, si quieren
      poner un nombre).

### 2.6 Publicación

- [ ] **Dominio definitivo** (`NEXT_PUBLIC_SITE_URL`).
- [ ] **Perfil de Google Business**: ¿está verificado? Conviene que la
      dirección, el teléfono y los horarios coincidan exactamente con los del
      sitio, porque Google usa esos datos para el paquete local.
- [ ] Si tienen **Google Analytics** y quién autoriza activarlo.
- [ ] Si existe alguna **reseña o premio** real que quieran destacar. En este
      sitio no se publica ninguna valoración: no hay datos propios que lo
      respalden.

---

## 3. Decisiones de diseño tomadas por falta de datos 🟡

Cada vez que faltaba un dato, el sitio **no lo inventó**. Se optó por:

| Falta | Qué hace el sitio en su lugar |
| --- | --- |
| Tipos de habitación | Explica que se están preparando y deriva a WhatsApp |
| Precios | No se publica ningún precio; «Tarifa por confirmar» |
| Carta de la cafetería | Mensaje elegante con acceso directo a WhatsApp y a la ubicación |
| Horarios de check-in/check-out | «Por confirmar» y se piden al reservar |
| Horario del domingo | No aparece en la lista de horarios |
| Correcciones/reseñas | No se publica ninguna valoración |
| Fotografías reales | Marcos reservados que indican exactamente qué foto va en cada uno |
| Instagram | No se enlaza (no hay perfil verificado) |

---

## 4. Datos que NUNCA se deben agregar sin confirmación

- Estrellas, puntuaciones o número de reseñas.
- «Mejor hotel de Pérez Zeledón», «el mejor café de la zona», «100 % de
  satisfacción» o cualquier afirmación superlativa.
- Certificaciones, premios o sellos.
- Promociones, descuentos o paquetes.
- Características que no se hayan confirmado para **todas** las habitaciones.
