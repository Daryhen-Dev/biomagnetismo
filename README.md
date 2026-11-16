# Centro de Biomagnetismo Médico — sitio Astro

Sitio estático en Astro 7 que reemplaza el WordPress de `centrodoctorgoiz.cl`.
El WordPress original ya no está en línea (se canceló el hosting), así que el
contenido se reconstruyó localmente a partir del backup completo y después se
portó a este proyecto.

---

## Levantar el sitio

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm serve      # build + vista previa en http://127.0.0.1:4600
pnpm build      # genera dist/
pnpm check      # tipos y errores de Astro
```

`pnpm serve` construye el sitio y lo sirve en `127.0.0.1:4600`: es la forma de
ver exactamente lo que se publica (no el dev server) y de probar el formulario
y los redirects.

> Este proyecto usa **pnpm**, no npm. `package.json` fija la versión con
> `packageManager`, así que corepack la respeta automáticamente.

---

## Dónde tocar qué

Esta es la tabla que hay que mirar primero. Cada fila responde "quiero cambiar X,
¿por dónde empiezo?".

| Quiero cambiar… | Voy a… |
| --- | --- |
| El texto de una página | `src/content/pages/<slug>.md` — el nombre del archivo es la URL |
| La entrada y la descripción para buscadores de una página | `src/data/page-meta.ts` (el `.md` no trae descripción) |
| Las fotos de un país o evento | El `.json` de esa galería en `src/content/galleries/` |
| El orden de las imágenes | El array `images` de ese `.json` |
| Qué galería aparece primero en el índice | `FEATURED_ORDER` en `src/data/gallery-order.ts` |
| Los colores, tipografías y espaciados | `src/styles/global.css` (bloque `@theme` y `:root`) y `DESIGN.md` |
| El encabezado, pie y estructura común | `src/layouts/BaseLayout.astro` (+ `SiteHeader.astro` / `SiteFooter.astro`) |
| El menú y el mapa del sitio | `navGroups`, `primaryNav` y `footerNav` en `src/data/site.ts` |
| Un teléfono, correo, dirección u horario | `src/data/contact.ts` — se actualiza en el pie, en contacto y en todos los botones |
| El mensaje que llega precargado al WhatsApp | `whatsappMessages` en `src/data/contact.ts` |
| Activar o desactivar el formulario de contacto | `formEndpoint` en `src/data/contact.ts` — vacío (`""`) lo oculta |
| Los campos y el envío del formulario | `src/components/ContactForm.astro` |
| El aviso de privacidad de la página de contacto | `src/components/PrivacyNotice.astro` |
| Cómo se ve una página en particular | `src/pages/[...slug].astro` + su variante en `src/data/page-meta.ts` |
| Cómo se ve el texto corrido de las páginas | Bloque `.prose` y variantes `.prose--*` en `src/styles/global.css` |
| Los redirects de URLs viejas | `src/data/redirects.json` (genera `public/_redirects` para Netlify y Cloudflare Pages, y `vercel.json` para Vercel) |
| Qué URLs existen | `src/pages/` — cada archivo es una ruta |

**Regla de oro:** una página es un archivo `.md` con el mismo nombre que su URL.
`sitio.cl/preguntas/` ← `src/content/pages/preguntas.md`. No hay base de datos ni
CMS: lo que está en el repositorio es lo que se publica.

---

## Estructura

```
src/
├── content/pages/        10 páginas institucionales en Markdown (una por URL)
├── content/galleries/    11 galerías (29 álbumes, 254 fotos)
├── content.config.ts     Esquema: qué campos admite cada tipo de contenido
├── assets/media/         Fotos optimizadas a WebP, por año/mes
├── data/                 Datos del sitio, todos en TypeScript legible:
│   ├── site.ts           Nombre, navegación y mapa del sitio
│   ├── contact.ts        Teléfonos, correos, dirección, horario, mensajes de WhatsApp y endpoint del formulario
│   ├── page-meta.ts      Entrada y descripción SEO de cada página institucional
│   ├── gallery-order.ts  Orden del archivo y conteo de álbumes/fotos
│   ├── gallery-media.ts  Puente entre las rutas del JSON y `astro:assets`
│   ├── gallery-intro.ts  Intérprete del Markdown guardado dentro del JSON de galerías
│   ├── content-html.ts   Render por bloques del cuerpo de cada `.md`
│   └── redirects.json    301 de las URLs del WordPress viejo
├── layouts/BaseLayout    <head>, SEO, datos estructurados, header y footer
├── components/           Piezas de interfaz (ver tabla más abajo)
├── pages/                Rutas — cada archivo es una URL:
│   ├── index.astro       Portada
│   ├── [...slug].astro   Las 7 páginas institucionales
│   ├── contactos.astro   Contacto: canales, formulario opcional y aviso de privacidad
│   └── galeria/          Índice de galerías + una página por galería
└── styles/
    ├── global.css        Todo el sistema visual: tokens, bandas, botones, texto, grillas
    └── fonts/            Spectral y Archivo autohospedadas (woff2, subconjunto latin)
```

---

## Sistema visual: de qué está hecha cada página

`DESIGN.md` explica el porqué; acá está el mapa para tocar. Todas las reglas viven en
`src/styles/global.css`, en el mismo orden que esta tabla.

| Token / regla | Qué controla | Páginas donde se nota |
| --- | --- | --- |
| `--color-night-*` | Los índigos: suelo del sitio, bandas de portada, cierres y pie | Todas |
| `--color-paper-*` y `--color-ink-*` | El papel de lectura y el color del texto | Método, preguntas, doctor, testimonios, entrevistas, colaboradores, servicios, galerías |
| `--color-copper-*` | El acento: polos del par, reglas, enlaces y botón principal | Todas |
| `--font-display` / `--font-sans` | Spectral (títulos) y Archivo (texto y controles) | Todas |
| `--fs-*` | La escala tipográfica: 17 px de cuerpo en móvil, 19 px en escritorio | Todas |
| `--space-section`, `--gutter`, `--shell`, `--measure` | Aire vertical, márgenes, ancho máximo y ancho de lectura | Todas |
| `--ease-out` + bloque de movimiento | El dibujo del campo al cargar la portada | Portada |
| `.band--night` / `.band--paper` | La alternancia entre «el campo» y «el documento» | Todas |
| `.prose--*` | El tratamiento del texto según la página | Ver `DESIGN.md`, sección 8 |

### Componentes y dónde se usan

| Componente | Qué hace | Aparece en |
| --- | --- | --- |
| `SiteHeader.astro` | Marca, navegación de escritorio y menú `<details>` en móvil | Todas |
| `SiteFooter.astro` | Mapa del sitio y contacto real | Todas |
| `WhatsAppAction.astro` | Botón `wa.me` con mensaje precargado y número visible | Barra superior, portada, cierres, contacto |
| `PageCta.astro` | Cierre de página con una sola acción | Portada y páginas institucionales |
| `SectionHeading.astro` | Título de sección con entrada opcional | Portada, galería, contacto |
| `ContactForm.astro` | Formulario de contacto (Formspree). No se renderiza hasta que haya endpoint | Contacto |
| `PrivacyNotice.astro` | Aviso de privacidad en lenguaje llano: qué se recoge, quién lo recibe, cómo pedir borrado | Contacto |
| `PairField.astro` | Dos polos y el campo entre ellos (SVG) | Portada |
| `FieldRule.astro` | El par reducido a regla divisoria | Galerías |
| `CredentialPlate.astro` | Retrato y títulos verificables del director | Portada |
| `GalleryGrid.astro` | Hoja de contactos de un álbum: 2/3/4 columnas, celda cuadrada con marco y número de archivo | Las 11 galerías |
| `EntryBody.astro` | Cuerpo del `.md` agrupado (entrada + grupos) con el tratamiento de su página | Portada y páginas institucionales |
| `ContentBlocks.astro` | Los bloques de contenido uno por uno (pregunta, cita, rótulo) | Vía `EntryBody` |
| `SiteMotion.astro` | El script del movimiento: revelado al entrar, barra compacta, dibujo del par | Todas |
| `ContentHeading.astro` | Encabezado heredado con el nivel corregido | Vía `ContentBlocks` |
| `QuestionParagraph.astro` | Párrafo que empieza con «¿» se vuelve subtítulo | Preguntas |
| `QuoteParagraph.astro` | Párrafo entre comillas se vuelve cita | Par biomagnético |

Cada archivo de `src/components/` abre con un comentario que dice qué renderiza, qué
contenido lee y qué tocar para cambiarlo. Lo mismo vale para las cuatro plantillas de
`src/pages/` y para `src/layouts/BaseLayout.astro`.

### Convenciones

- **Mobile first.** Todo se compone primero para 390 px y después escala. Los
  breakpoints son adiciones (`48rem`, `60rem`, `64rem`, `80rem`), nunca correcciones
  de un layout que ya se rompió en móvil.
- **Dos anchos.** `--shell` (1248 px) es lo que ocupa la composición y `--measure`
  (608 px) el ancho de una línea de texto. El texto no se estira para llenar la
  pantalla: la página se llena con barra lateral, placas y columnas (ver `DESIGN.md §4`).
- **Una clase, una pieza.** El diseño no se arma con utilidades sueltas en el HTML:
  cada pieza tiene su regla con nombre en `src/styles/global.css` (`.band`,
  `.btn`, `.prose`, `.gallery-grid`…), así el sistema se cambia en un lugar.
- **Trazabilidad.** Los nombres de archivo son las URLs. Cada plantilla y cada
  componente abre con un comentario que dice qué renderiza, de dónde lee y qué
  tocar. El frontmatter lleva `wpId` para rastrear cada página hasta su origen en
  WordPress.
- **El contenido es literal.** Es información médica: los textos se portaron
  sin reescribir, resumir ni "mejorar". Si un texto debe cambiar, es una decisión
  editorial explícita. La presentación sí se diseña; el texto no.
- **Las imágenes no llevan metadatos.** El pipeline de migración eliminó
  EXIF/ICC/XMP: son fotos de pacientes y documentos, no pueden viajar con GPS ni
  datos de cámara.

---

## Formulario de contacto (Formspree)

La página `/contactos/` muestra WhatsApp y correo siempre. El formulario es
**opcional y apagado por defecto**: solo aparece cuando `formEndpoint` en
`src/data/contact.ts` tiene un destino real. Un formulario sin destino que
reciba los mensajes descarta datos de pacientes en silencio, así que no se
publica hasta que exista el canal.

### Cómo activarlo

1. Crear el formulario en [formspree.io](https://formspree.io) con el correo del
   centro (`centrodrgoiz@gmail.com`) como destinatario.
2. Copiar la URL del endpoint que da Formspree. Tiene esta forma:
   `https://formspree.io/f/<id>`.
3. Pegarla en `formEndpoint`, en `src/data/contact.ts`. No inventar el valor: si
   no existe el formulario, queda `""` y la página sigue como está.
4. Reconstruir: `pnpm build` (o `pnpm serve` para verlo en `127.0.0.1:4600`).
5. Probar un envío real y confirmar que llega a la bandeja del centro y que
   vuelve a `/contactos/#gracias` con el mensaje de confirmación.

Para volver atrás, se deja `formEndpoint = ""` y se reconstruye: el formulario
desaparece y vuelve el aviso de “formulario pendiente”.

### Cómo funciona (sin JavaScript)

- `POST` directo a Formspree. No hay JS propio: si el JS no corre, el formulario
  sigue enviando.
- Éxito: Formspree redirige a `/contactos/#gracias` (campo `_next`), donde el
  aviso se muestra solo con CSS (`:target`). La URL se arma con `site` en
  `astro.config.mjs`; si cambia el dominio, se cambia ahí.
- Error: la validación del navegador marca el campo (`required`, `type="email"`)
  y, si el servicio falla, al lado del botón quedan WhatsApp y el correo.
- Campos: nombres, apellidos, teléfono, correo y mensaje. El correo y el mensaje
  son obligatorios. Hay un campo trampa para robots (`_gotcha`) y un `_subject`
  que nombra el sitio en la bandeja del centro.

### Aviso de privacidad

El aviso (`src/components/PrivacyNotice.astro`) se muestra **siempre**, con o sin
formulario, porque también cubre WhatsApp y correo. Dice qué datos se recogen y
para qué, que Formspree procesa el formulario y que el destinatario es el correo
del centro, y advierte explícitamente que no se manden diagnósticos ni resultados
de exámenes por el formulario: para lo clínico, WhatsApp.

A propósito **no** cita leyes (la aplicación de las normas de datos de Chile y
Ecuador depende de la situación del responsable del sitio), no afirma ninguna
certificación de cumplimiento y no inventa un plazo de retención. El propio
texto avisa que debe revisarlo el asesor legal del centro antes de publicarlo.
Si esa revisión cambia el texto, se cambia en ese componente.

---

## El WordPress local (solo para consultar el original)

El sitio original corre en Docker para poder comparar contenido y estructura
mientras se construye el nuevo. **No hace falta para trabajar en el sitio Astro.**

```bash
docker compose up -d      # WordPress en http://localhost:8080
docker compose down       # apagar
```

- `source/` es la extracción del backup de Hostinger. Es **descartable**: el
  archivo `.tar.gz` de la raíz es la fuente de verdad. No editar `source/` a mano.
- El WP local tiene los plugins de producción desactivados (Wordfence, LiteSpeed,
  Hostinger Tools) porque rompían el acceso por HTTPS y el caché.
- `schema` y contenido se extraen con `scripts/`: `extract-pages.mjs`,
  `extract-galleries.php`, `extract-gallery-map.php` y `port-content.mjs`.

---

## Despliegue en Cloudflare Pages

Decidido: **Cloudflare Pages**. La guía completa —valores exactos del panel, DNS
para `centrodoctorgoiz.cl` y checklist de verificación— está en
[`docs/DEPLOY-CLOUDFLARE.md`](docs/DEPLOY-CLOUDFLARE.md).

Lo que hay que configurar en el panel:

| Campo | Valor |
| --- | --- |
| Build command | `pnpm run build` |
| Build output directory | `dist` |
| Node | `24` (en `.nvmrc`; Astro 7 exige ≥ 22.23.4) |

Archivos que el build emite para el hosting, ninguno se edita a mano:

- `public/_redirects` — 29 reglas (24 exactas + 5 comodines), generadas por
  `scripts/emit-redirects.mjs` desde `src/data/redirects.json`.
- `public/_headers` — caché inmutable para `/_astro/` y cabeceras de seguridad.
- `public/robots.txt` y el sitemap que genera `@astrojs/sitemap`.

`vercel.json` se sigue generando desde el mismo JSON por si alguna vez se cambia
de hosting: el formato de `_redirects` lo comparten Netlify y Cloudflare Pages.

---

## Estado

Construido: la identidad visual y las 21 rutas (portada, 7 páginas institucionales,
contacto, índice de galerías y 11 galerías). `pnpm run check` y `pnpm run build` pasan;
el build genera 21 páginas estáticas en unos 5 segundos.

Pendientes conocidos, visibles en el sitio cuando corresponde:

- **Formulario de contacto**: implementado y **apagado** (`formEndpoint` vacío en
  `src/data/contact.ts`). Mientras no haya endpoint de Formspree, `/contactos/`
  muestra WhatsApp y correo y declara el formulario como pendiente. Activarlo está
  documentado arriba, en «Formulario de contacto (Formspree)».
- **Aviso de privacidad**: publicado y visible en `/contactos/`, pero pendiente de
  revisión por el asesor legal del centro antes de salir a producción. No cita leyes
  ni certificaciones, y no fija plazos de retención.
- **Alt de las galerías**: las 254 fotos tienen texto alternativo escrito a partir de
  la imagen y `altPending: false`. El alt describe lo visible (cuántas personas, qué
  hacen, qué lugar y qué objetos importan) sin inventar nombres, fechas ni diagnósticos.
  Queda pendiente una revisión humana de la lista de abajo antes de publicar.
- **Alt que conviene revisar a ojo**: los alts que dependen de leer texto pequeño o de
  interpretar un documento: recortes de prensa y diapositivas de curso (`fotogoiz`,
  `fotobolivia`), la página de libro de `fotoalemania`, el certificado de
  `fotobolivia` (curso Toledo), la captura de pantalla de `fotochile` (curso no
  videntes) y la placa grabada de `fotogoiz` (inauguración).
- **`servicios.md`**: el texto del sitio original es *lorem ipsum*. La página lo dice;
  reescribirlo es una decisión editorial.
- **Videos de testimonios**: no se conservaron en la migración. La página lo dice.
- **Galerías huérfanas**: 89 fotos de 11 galerías Modula que ninguna página embebía
  quedaron fuera del port (ver E8 en el plan).

El plan completo, las decisiones y la evidencia de cada paso están en
[`odd/tasks/migracion-astro.md`](odd/tasks/migracion-astro.md). Ese archivo es la
bitácora: si algo no se entiende del código, la respuesta suele estar ahí. Las
decisiones visuales están en [`DESIGN.md`](DESIGN.md).
