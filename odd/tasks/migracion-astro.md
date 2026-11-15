# Migración centrodoctorgoiz.cl — WordPress → Astro

Reconstruir localmente el sitio WordPress desde el backup de Hostinger y migrarlo a un
sitio Astro estático, rediseñado con Impeccable, desplegable en Vercel o Netlify.
El sitio original ya no está en línea: la suscripción de hosting fue cancelada.

## Specs

**S1 — Migración completa a Astro.** El sitio WordPress completo se migra a Astro.
> "quiero migrar todo a astro"

**S2 — Primero, el sitio local funcionando.** Antes de migrar nada, el WordPress original
debe correr localmente desde el backup, con su contenido y sus imágenes.
> "vamos primero con levantar el sitio web local"
> "lo que voy hacer es correrlo local y partimos de ahí"

**S3 — Alcance del contenido: las páginas institucionales, consolidadas en español.**
> "Solo institucional", "El blog", "Cursos y eventos"
> "Consolidar a español + redirects"
> "Sin sección de blog"

Se portan las páginas institucionales en español. Las 5 páginas en inglés (`about-us`, `services`,
`contact-us`, `testimonial`, `customer-cabinet`) **no se portan**: se consolidan sobre sus equivalentes
en español y se cubren con redirects 301. El sitio nuevo **no tiene sección de blog**; las 2 entradas
de 2020 (`/saludo/`, `/foto1/`) se redirigen al inicio. Los CPTs de cursos y eventos no existen en la
base actual (ver E7), así que no hay nada que portar por ese lado.

**S4 — La fuente es la copia local entregada por el usuario.**
> "en la carpeta te descargue todo los archivos de hostinger y la base de datos"
> "Tengo copia local de todo"

Fuente concreta: `u428001751.20261113102107.tar.gz` (archivos) y
`u428001751_database.20261113102107.sql.gz` (base de datos), en la raíz del proyecto.

**S5 — Rediseño visual con Impeccable, no un port 1:1.**
> "Rediseño con Impeccable"
> "toca instalar tambien https://impeccable-style.translate.goog/..."

El diseño nuevo se construye con Impeccable. La identidad y los tokens quedan documentados
en `DESIGN.md`, el público y los objetivos en `PRODUCT.md`.

**S6 — Destino de despliegue.** Vercel o Netlify (se decide en el cierre).
> "Vercel o Netlify"

**S7 — Trazabilidad del código y de las páginas.** Cualquier persona que abra el proyecto debe entender
cómo está estructurado y saber por dónde empezar para cambiar algo.
> "debes tener presente la trazabilidad en astro para cuando yo vea el codigo o las paginas yo pueda
> entenderlo como esta estructurado y si tengo que cambiar algo saber por donde empezar"

Consecuencias: estructura de carpetas explícita, un mapa de "dónde toco qué" en `README.md`, nombres
de archivo iguales a las URLs, comentarios que expliquen el porqué y no el qué, y frontmatter
autoexplicativo (`wpId` como procedencia).

**S8 — Toda pregunta al usuario llega con opciones y una recomendada.**
> "siempre que me preguntes algo debes darme las opciones con tu opcion recomendada siempre"

Aplica a cualquier decisión: opciones enumeradas, cada una con su consecuencia, y una marcada como
recomendada con el motivo. Los consentimientos del proveedor de review conservan su formato propio.

**S9 — Mobile first, sin excepciones.** El sitio se ve bien primero en móvil y después escala a desktop.
> "todo va hacer movil first es decir siempre debe verse bien desde un movil y despues a desktop"

Consecuencias: el diseño se compone desde el viewport angosto, los breakpoints son adiciones y no
correcciones, y la verificación visual en T18 incluye capturas a 390 px antes que a 1440 px.

## Tasks

| ID | Tarea | Specs | Ruta | Commit |
| --- | --- | --- | --- | --- |
| T1 | Extraer el backup de archivos a `source/`, excluyendo symlinks absolutos muertos y backups anidados | S4 | inline | — |
| T2 | Definir el stack local: Docker Compose con MariaDB 11.8 + WordPress (core del backup) + wp-cli | S2 | inline | — |
| T3 | Importar el dump SQL y escribir un `wp-config.php` local | S2 | inline | — |
| T4 | Sanear el sitio local: desactivar Wordfence y LiteSpeed Cache, reemplazar URLs del dominio por localhost | S2 | inline | — |
| T5 | Verificar que el home y las páginas internas cargan en `localhost:8080` | S2 | inline | — |
| T6 | Inventario con wp-cli: páginas, entradas, CPTs, medios, menús y mapa de URLs para redirects | S1,S3 | inline | — |
| T7 | Scaffold Astro 5 + TypeScript + content collections | S1 | inline | — |
| T8 | Convertir el contenido WordPress a Markdown/MDX en las collections (21 páginas) | S1,S3 | por confirmar | — |
| T9 | Descargar y optimizar las imágenes originales desde `wp-content/uploads` | S1,S3 | por confirmar | — |
| T10 | Impeccable: `context` + generar `PRODUCT.md` y `DESIGN.md` | S5 | inline | hecho |
| T11 | Direcciones visuales con Impeccable y elección del usuario | S5 | inline | hecho |
| T12 | Layout base y home | S5 | worker | hecho |
| T13 | Páginas institucionales (el doctor, terapias, contacto, galerías por país) | S3,S5 | worker | hecho |
| T14 | ~~Blog: listado, paginación y detalle~~ — descartado por L6 | S3 | — | — |
| T15 | ~~Cursos y eventos~~ — no existen como CPT en la base actual (E7) | S3 | — | — |
| T16 | Formulario de contacto: redefine el destino y el aviso de privacidad (datos de salud) | S3 | por confirmar | — |
| T17 | Redirects 301 de las páginas inglesas y las entradas, sitemap y robots | S1,S3,S6 | inline | — |
| T18 | QA de paridad de copy contra el original + detector de Impeccable en 0 findings | S1,S5 | inline | — |
| T19 | Despliegue en Vercel o Netlify y corte de DNS | S6 | por confirmar | — |

## Log

**L1** (pedido original, textual):
> tengo un sitio web hecho en wordpress y quiero migrar todo a astro, mi pregunta puedes solo clonar las cosas desde la pagina web o quieres que levante un wordpress local y copiar las cosas? https://centrodoctorgoiz.cl/ ? despues de que me contestes trazamos un plan para implementar, toca instalar tambien https://impeccable-style.translate.goog/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc

**L2** (decisión: extraer desde el wp-admin en vivo, sin WordPress local):
> podemos usar un cambio, puedes entrar a mi wordpress desde ego y copiar todo lo que necesites para recrear todo para evitarme levantar un wordpress local.

**Evidencia E1** — el sitio no está accesible, así que L2 no era ejecutable:
- DNS: SERVFAIL (status 2) para `A` y `NS` en Google DoH y Cloudflare DoH.
- NIC Chile: dominio vigente hasta 2030-06-06, nameservers `artemis`/`hermes.dns-parking.com`.
- El IP que devuelve el resolver local responde HTTP con 403 de LiteSpeed (`platform: hostinger`) y
  rompe el handshake TLS con alert 80 (`internal_error`) para cualquier SNI, incluido `example.com`.
- Control desde la misma máquina: `astro.build` y `google.com` completan TLS 1.3 correctamente.
- Wayback Machine: último snapshot con HTTP 200 el 2026-07-16.

**L3** (causa confirmada por el usuario):
> al parecer me bajaro mi sitio por cancelar mi suscripcion asi que lo que voy hacer es correrlo local y partimos de ahí

**L4** (entrega del material y prioridad):
> en la carpeta te descargue todo los archivos de hostinger y la base de datos, vamos primero con levantar el sitio web local

**Corrección de alcance C1** — L1 y el relevamiento inicial suponían "solo páginas fijas". El índice del
archivo y el dump muestran lo contrario: hay blog con categorías y archivos por fecha, autores, y URLs de
custom post types (`/department/`, `/Evento/`, `/customer-cabinet/`). S3 se ajustó a institucional + blog +
cursos y eventos, y T6 debe resolver si esos CPTs siguen vivos en la base actual o son URLs de eras previas.

**Evidencia E2** — stack detectado en el dump (63 tablas, prefijo `wp_`, MariaDB 11.8.9): WordPress 7.1.4,
tema **Kadence** activo (Astra legacy), bloques **Spectra/UAGB**, **SureRank** SEO (las tablas `wp_yoast_*`
son de una era anterior), Smart Slider 3, Modula Gallery, WPForms Lite, LiteSpeed Cache, Wordfence,
Google Site Kit, Action Scheduler. Elementor sigue instalado pero **inactivo** (`wp_e_events` es legado).
Sin WooCommerce ni Amelia.

**Evidencia E5** — arranque local: `http://localhost:8080/` respondía 301 a `https://localhost:8080/` con
`X-Redirect-By: WordPress`. Causa: el plugin **`hostinger`** (Hostinger Tools) fuerza HTTPS. Se desactivaron
para uso local: `hostinger`, `wordfence`, `litespeed-cache`, `ssl-insecure-content-fixer`, `google-site-kit`,
`all-in-one-wp-migration`, `astra-sites`, y el mu-plugin `hostinger-auto-updates.php`.
Se respaldó el `.htaccess` original y se dejó uno mínimo de WordPress.

**Evidencia E6** — el hero de la home quedaba en blanco: Spectra hornea la URL absoluta del fondo en CSS
**generado en disco** (`wp-content/uploads/uag-plugin/assets/*/uag-css-*.css`), no en la base de datos, así que
`wp search-replace` no la alcanza. Corregido en los 4 archivos afectados, con copias `.bak`.

**Evidencia E7** — inventario real tras importar (el "solo páginas fijas" original era más acertado de lo que
sugería el índice del archivo):

| Tipo | Cantidad |
| --- | --- |
| Páginas publicadas | 26 |
| Entradas publicadas | 2 (`/saludo/` y `/foto1/`, ambas de 2020) |
| Adjuntos (imágenes) | 643 |
| Revisiones | 1700 |
| Menús | 5 (primario con 20 ítems, secundario con 5) |
| Custom post types | **0** |

Página fija del inicio: `home` (ID 20). Permalinks: `/%postname%/`. **No existen CPTs de cursos, eventos
ni departamentos**: `/department/`, `/Evento/` y `/customer-cabinet/` son URLs de eras anteriores del sitio.
Hay páginas duplicadas entre una versión en inglés y la actual en español: `about-us`, `services`,
`contact-us`, `testimonial` frente a `francisco-mena`, `servicios`, `contactos`, `testimonios`.

**Evidencia E3** — el tar incluye un backup anidado con un symlink absoluto a `/home/u428001751/...`,
que hace fallar `tar` con exit 2. T1 lo excluye junto con `.famulus/` y un `.tar.gz` de 2025 anidado.

**Herramientas E4** — Impeccable ya está instalado en `.agents/skills/impeccable` (v4.8.0, binario
`windows-x64` propio); no requiere `npx impeccable install`. Los hooks automáticos por `PostToolUse`
no existen en Pi: el detector se invoca explícitamente. Docker 28.3.2 y Compose v2.38 disponibles.

**L5** (duplicados en inglés):
> Consolidar a español + redirects

**L6** (blog):
> Sin sección de blog

Efecto sobre el alcance: de 26 páginas quedan **21** para portar, más los redirects de las 5 inglesas y de
las 2 entradas. T14 y T15 quedan descartadas y se abre el trabajo de consolidación dentro de T17.

**L7** (requisitos permanentes añadidos antes de construir las páginas):
> ya que vas a implementar todo debes tener presente la trazabilidad en astro para cuando yo vea el codigo o las paginas yo pueda entenderlo como esta estructurado y si tengo que cambiar algo saber por donde empezar. Tambien siempre que me preguntes algo debes darme las opciones con tu opcion recomendada siempre. Otra cosa es que todo va hacer movil first es decir siempre debe verse bien desde un movil y despues a desktop.

Se registran como S7 (trazabilidad), S8 (opciones con recomendación) y S9 (mobile first).

**Evidencia E8** — port de contenido ejecutado (T8-T9): 10 páginas en `src/content/pages/`, 11 archivos de
galería con 29 álbumes Modula y 254 imágenes, 287 WebP en `src/assets/media/` (30,1 MB → 19,9 MB, EXIF/ICC/XMP
eliminado por privacidad), y `src/data/redirects.json` con los 7 redirects 301. `pnpm run check` y `pnpm run
build` pasan. Las 89 imágenes de 11 galerías huérfanas (que ninguna página embebe) quedaron fuera a propósito.
`galeria.md` conserva una referencia a un placeholder de Elementor que la fase de diseño debe reemplazar.

**Evidencia E9** — identidad y plantillas construidas (T10-T13). Dirección elegida por el usuario: "Campo
magnético: índigo + cobre", con pacientes como primer destinatario. Se escribió `PRODUCT.md` (schema 1) y
`DESIGN.md`, y `.impeccable/config.json` registra `buildPath: code` según la elección del usuario.

Resultado verificado por el padre, no solo reportado por el worker:
- `pnpm run build`: **21 rutas** (1 home, 7 institucionales, 1 contacto, 1 hub de galería, 11 galerías), `dist` 33 MB.
- Capturas reales a 390 px y 1440 px: home, contacto, galería y preguntas. Sin scroll horizontal en ninguna ruta
  (scrollWidth = 390), sin imágenes rota, h1 correcto por página.
- Detector de Impeccable sobre plantillas y estilos: `[]`, cero hallazgos.
- Objetivos táctiles: los únicos elementos por debajo de 44 px son enlaces de texto en prosa y migas de pan,
  exentos por WCAG 2.5.8. Los CTA principales (cita, WhatsApp, menú) cumplen.
- Datos reales en toda la superficie: dirección de Quito, horarios, dos correos y los tres WhatsApp con
  +593 99 883 9196 como principal. Sin formulario falso: la página declara el formulario como pendiente (T16).

Deuda conocida y registrada:
- 245 de 254 fotos llevan texto alternativo generado (`altPending`): revisión obligatoria antes de publicar.
- Un hallazgo del detector sobre la URL `/par-biomagnetico/` ("straggler"): es la última línea de una cita textual
  del contenido heredado. Corregirlo exige editar copy médico, no CSS.
- Las portadas de álbum salen de la primera imagen real de la galería; en `fotochile` es la bandera del país.
- Los cuerpos Markdown se renderizan con `experimental_AstroContainer` (receta documentada para RSS) para poder
  normalizar encabezados y citas heredadas. Punto único de riesgo: `src/data/content-html.ts`.

**Evidencia E10** — incidente de verificación: los servidores estáticos que dejó el worker ocupaban los puertos
4399-4403 y una instancia en 4321 respondía con un sitio ajeno ("Where nature wrote its own rules"). Se mataron
por PID y la verificación se repitió contra `astro preview` en 127.0.0.1:4600, que devolvió el título correcto.
Sin esa limpieza, las capturas habrían validado el sitio equivocado.
