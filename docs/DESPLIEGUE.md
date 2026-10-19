# Guía de despliegue y configuración del dominio

El sitio se compila a **HTML estático** (carpeta `out/`). Se puede publicar en
cualquier hosting sin Node, sin base de datos y sin mantenimiento de servidor.

---

## 1. Preparar el build

```bash
npm ci
npm run build
```

Resultado: la carpeta `out/` con el sitio completo.

Antes de publicar, definí el dominio definitivo. Create `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://www.tudominio.com
```

y volvé a compilar:

```bash
npm run build
```

> La variable se **incorpora durante el build**. Si cambiás el dominio después,
> hay que volver a compilar: no basta con editar el archivo.

### Verificación previa a publicar

```bash
npm run check          # typecheck + lint + build
npm run serve          # http://localhost:4173
npm run audit          # comprueba desbordes, errores de consola, h1, alt, enlaces
npm run test:ui        # pruebas funcionales del formulario, menú y acordeón
```

> `npm run build` ejecuta `postbuild` al final: crea los archivos de payload
> RSC que el enrutador del navegador pide con otro nombre. Si se sube la
> carpeta `out/` a mano, hay que hacerlo **después** del build, nunca antes.

### Si se sube la carpeta `out/` por FTP

Como el `postbuild` ya corre dentro de `npm run build`, la carpeta `out/` que
se sube ya está corregida. Si en algún momento se copia una carpeta `out/`
vieja, volver a ejecutar:

```bash
node scripts/fix-rsc-payloads.mjs
```

---

## 2. Opciones de hosting

### Netlify (recomendado para quien no administra)

1. Crear cuenta en netlify.com y conectar el repositorio.
2. Build command: `npm run build`.
3. Publish directory: `out`.
4. Variable de entorno: `NEXT_PUBLIC_SITE_URL`.
5. Deploy. Netlify sirve `out/` y además genera los redireccionamientos.

### Vercel

1. Importar el proyecto.
2. Framework preset: **Next.js** (deja los valores por defecto; detecta
   `output: 'export'`).
3. Variable de entorno: `NEXT_PUBLIC_SITE_URL`.
4. Deploy.

### Cloudflare Pages

1. Conectar el repositorio.
2. Build command: `npm run build`; output directory: `out`.
3. Variable de entorno: `NEXT_PUBLIC_SITE_URL`.

### cPanel / hosting compartido

1. `npm run build` en el equipo.
2. Subir **el contenido de `out/`** (no la carpeta) por FTP a `public_html/`.
3. Crear `public_html/.htaccess` con el contenido de la sección 4.
4. El hosting tiene que tener una versión de PHP o Node que no afecte: el
   sitio es HTML puro, así que funciona en cualquier Apache.

---

## 3. Dominio y DNS

1. Registrar el dominio (o usar uno existente) en un registrador.
2. Apuntar los registros DNS al hosting:

   | Tipo | Nombre | Valor |
   | --- | --- | --- |
   | A | `@` | IP del hosting |
   | CNAME | `www` | dominio principal |

3. **HTTPS:** hay que activarlo sí o sí.
   - Netlify, Vercel y Cloudflare Pages gestionan el certificado
     automáticamente.
   - En cPanel, usar **Let's Encrypt** (icono «SSL/TLS Status») y activar el
     forzamiento a HTTPS.
   - Sin HTTPS, WhatsApp, Google y los navegadores penalizan el sitio, y los
  navegadores muestran avisos de seguridad.

4. Definir `www` o **apex** como versión principal. El sitio funciona con
   ambos; lo importante es que **no haya dos versiones indexables**. Definir
   una redirección 301 de una a la otra en el hosting.

---

## 4. Redirecciones y reglas del servidor

El sitio usa URLs limpias sin barra final (`/habitaciones`, no
`/habitaciones/`). En Apache (`.htaccess`):

```apache
# Fuerza HTTPS
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteCond %{HTTP:X-Forwarded-Proto} !https
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# Redirige la versión con www a la principal (elegir una)
RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Pretty URLs: /habitaciones → /habitaciones.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !\.html$
RewriteRule ^(.*)$ $1.html [L]

# Página 404 propia
ErrorDocument 404 /404.html
```

En Netlify, se puede usar un archivo `public/_redirects`:

```
/*    /404.html   404
```

En Cloudflare Pages, en **Settings → Pages → Redirects**.

---

## 5. Comprobaciones después de publicar

| Qué | Cómo |
| --- | --- |
| El sitio carga | Abrir `https://www.tudominio.com` |
| El certificado funciona | `https://www.tudominio.com` sin aviso del navegador |
| El sitemap es correcto | `https://www.tudominio.com/sitemap.xml` (URLs con el dominio real) |
| El robots.txt es correcto | `https://www.tudominio.com/robots.txt` |
| Las páginas existen | `/habitaciones`, `/cafeteria`, `/ubicacion`, `/contacto`, `/preguntas-frecuentes` |
| La 404 funciona | Una ruta inexistente muestra la página de error propia |
| Los enlaces de WhatsApp | Tocar un botón: debe abrir WhatsApp con el mensaje escrito |
| Los enlaces de teléfono | En un móvil, debe abrir el teclado con el número |
| El mapa | «Abrir en Google Maps» debe llevar a Don Roberto, no a otro lugar |
| La imagen social | Pegar el enlace en el depurador de Facebook o en Slack: debe verse la imagen con la marca |
| Lighthouse | En Chrome, pestaña Lighthouse, modo Móvil |

---

## 6. Google Business Profile (importante para SEO local)

El perfil de Google es, para un negocio local, la fuente de la que salen la
mayoría de las visitas de Google Maps y de las búsquedas locales.

1. Verificar que el nombre, la dirección, el teléfono y los **horarios** del
   perfil sean **idénticos** a los del sitio. Google penaliza la información
   inconsistente.
2. Subir **las mismas fotografías** que se usan en el sitio.
3. Configurar el enlace del perfil hacia `https://www.tudominio.com`.
4. Pedir reseñas a los huéspedes. El sitio **no publica reseñas** por su cuenta
   (no hay reseñas propias verificadas), pero sí puede recibir las que el
   negocio publique en Google.

---

## 7. Analítica opcional

Si el propietario autoriza usar Google Analytics:

1. Crear la propiedad GA4 y copiar el **ID de medición** (`G-XXXXXXXXXX`).
2. En `src/app/layout.tsx`, dentro de `<head>`, añadir el script de gtag
   (ver el bloque de ejemplo en `docs/MANTENIMIENTO.md`).
3. Reconstruir y republicar.

Mientras tanto, `src/lib/analytics.ts` ya registra los eventos en
`window.dataLayer` y en un evento DOM, de modo que se puede conectar Google
Tag Manager en cualquier momento sin tocar los componentes.

---

## 8. Lista de control antes de publicar

- [ ] `NEXT_PUBLIC_SITE_URL` definido y el sitio reconstruido con él.
- [ ] Datos de `docs/PENDIENTES-DE-CONFIRMAR.md` confirmados con el negocio.
- [ ] Fotografías reales subidas y activadas.
- [ ] Teléfono, dirección y horarios coinciden con Google Business y con
      Facebook.
- [ ] Probado el flujo completo de consulta por WhatsApp desde un teléfono.
- [ ] `npm run check` sin errores.
- [ ] `node scripts/audit.mjs` sin observaciones.
- [ ] HTTPS activo y forzado.
- [ ] `sitemap.xml` y `robots.txt` publicados con el dominio correcto.
- [ ] 404 propia funcionando.
