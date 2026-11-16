# Diseño — Centro de Biomagnetismo Médico

Este documento es el registro durable del sistema visual. `PRODUCT.md` dice qué es el
producto y a quién le habla; acá está cómo se ve y por qué. Si cambiás un token, un
componente o una regla de página, actualizá este archivo: el código y este texto tienen
que contar lo mismo.

- Implementación de los tokens y de cada pieza: `src/styles/global.css`
- Componentes: `src/components/`
- Contenido: `src/content/` (no se reescribe; ver PRODUCT.md)

---

## 1. La dirección: el campo magnético

El diferencial del producto no es "terapias alternativas": es el **par biomagnético**,
dos cargas de polaridad opuesta y el campo que se lee entre ellas. La identidad se
construye sobre esa figura, no sobre una metáfora de bienestar.

- **Índigo profundo** como suelo dominante (el campo, el cuerpo, lo que se mide).
- **Cobre** como único acento (el instrumento, la carga, el punto de contacto).
- **Fotografía documental grande** y sin retoque decorativo: cursos reales, pacientes
  reales, diplomas reales. La prueba está en el archivo, no en el adjetivo.
- **Autoridad clínica sobria**: tipografía con oficio, reglas finas, cifras verdaderas.

Lo que esta dirección **no** hace, por decisión de producto: nada de degradados
brillantes, halos, partículas, símbolos místicos, promesas de curación ni imágenes que
sugieran resultados garantizados. El método se explica; no se promete.

### Escena de uso (por qué oscuro y por qué papel)

Un paciente —muchas veces una persona mayor— abre el sitio en el teléfono, en su casa,
muchas veces de noche, con poca luz ambiental, después de una recomendación. Por eso:

- Las **portadas, los cierres y el pie** son índigo profundo: el marco del sitio es un
  instrumento, no una hoja de revista.
- El **texto largo** (método, preguntas, trayectoria, testimonios) va sobre papel
  mineral frío, donde se lee durante varios minutos sin fatiga.
- La alternancia índigo / papel es estructural: separa "el campo" de "el documento".

El claro no es el tema por defecto y lo oscuro no es "modo oscuro": son dos superficies
con dos trabajos distintos.

---

## 2. Color

Estrategia: **committed**. El índigo ocupa entre un tercio y la mitad de cada página; el
cobre nunca aparece en superficies grandes, solo en polos, reglas, enlaces y el botón
principal.

### Índigo (el campo)

| Token | Hex | Uso |
| --- | --- | --- |
| `--color-night-950` | `#090e19` | Suelo del documento, barra superior, pie |
| `--color-night-900` | `#0e1524` | Bandas oscuras de sección |
| `--color-night-800` | `#151d30` | Banda de cierre (CTA), avisos sobre oscuro |
| `--color-night-700` | `#222c44` | Bordes internos sobre oscuro |
| `--color-night-600` | `#35415c` | Scrollbar, detalles |
| `--color-night-300` | `#b4bbcb` | Texto secundario sobre índigo (9:1) |
| `--color-night-100` | `#e8e6e0` | Texto principal sobre índigo (14,6:1) |

### Papel (el documento)

| Token | Hex | Uso |
| --- | --- | --- |
| `--color-paper-50` | `#f4f3ee` | Placas elevadas, celdas de avisos |
| `--color-paper-100` | `#e8e7e1` | Suelo de lectura larga |
| `--color-paper-200` | `#d6d5ce` | Bordes, fondo de imágenes mientras cargan |
| `--color-ink-900` | `#12182a` | Texto principal sobre papel (14:1) |
| `--color-ink-600` | `#454d63` | Texto secundario (6,5:1) |
| `--color-ink-500` | `#575e72` | Metadatos (5:1) |

### Cobre (el instrumento)

| Token | Hex | Uso |
| --- | --- | --- |
| `--color-copper-300` | `#e2a574` | Enlaces y acentos sobre índigo (8,6:1) |
| `--color-copper-400` | `#d08b52` | Hover del botón principal |
| `--color-copper-500` | `#bd7440` | Polos del par, reglas, botón principal |
| `--color-copper-700` | `#8a4720` | Enlaces y rótulos sobre papel (5,6:1) |

Reglas duras: texto de cuerpo ≥ 4,5:1 y texto grande ≥ 3:1 **medidos**, no estimados. El
texto secundario se tiñe del color de su superficie (azulado sobre índigo, azul tinta
sobre papel); nunca se usa gris neutro. El cobre no se usa como texto de cuerpo.

---

## 3. Tipografía

Dos familias, autohospedadas desde `src/styles/fonts/` (subconjunto latin, `.woff2`,
precargadas en el `<head>`). No se enlaza Google Fonts: el sitio no depende de un tercero
para mostrar su propio texto.

- **Spectral** (400/500/600) — títulos, citas, nombres, cifras de archivo. Serif de
  pantalla, con contraste fino y aire de publicación científica; sostiene autoridad sin
  ponerse ornamental.
- **Archivo** (variable 400–600) — texto corrido, navegación, botones, rótulos. Grotesca
  de ojo grande y aperturas abiertas: funciona a 390 px con luz mala.

Ninguna de las dos es la tipografía por defecto del rubro; se eligieron por cómo se leen
en el teléfono, no por asociación ("médico → serif").

### Escala (mobile first, crece con `clamp()`)

| Token | 390 px | Escritorio | Uso |
| --- | --- | --- | --- |
| `--fs-meta` | 14 px | 14 px | Legal, metadatos del pie |
| `--fs-small` | 15 px | 15 px | Datos de contacto, rótulos, pies de foto |
| `--fs-body` | 17 px | 19 px | Texto corrido (medida 65–70 caracteres) |
| `--fs-lede` | 19 px | 23 px | Entradas de página y de sección |
| `--fs-h3` | 20 px | 24 px | Subtítulos, preguntas, testimonios |
| `--fs-h2` | 26 px | 38 px | Títulos de sección |
| `--fs-h1` | 32 px | 56 px | Título de página (que a 1024 px sube a `--fs-display`) |
| `--fs-display` | 38 px | 64 px | Portada: "El par biomagnético" |

Interlineado: 1,05 en display, 1,16 en títulos, 1,62 en texto corrido. Tracking negativo
solo en display y títulos, entre −0,03 y −0,02 em (nunca por debajo de −0,04). El cuerpo
nunca baja de 17 px: es el mínimo de este sistema, no el del navegador.

---

## 4. Espacio y composición

| Token | Valor | Qué hace |
| --- | --- | --- |
| `--gutter` | 20 px → 40 px | Margen lateral único del sitio (bandas y barra) |
| `--shell` | 78 rem (1248 px) | Ancho que ocupa la composición |
| `--measure` | 38 rem (608 px) | Ancho de una línea de lectura (~70 caracteres) |
| `--rail` / `--rail-narrow` | 19 rem / 15 rem | Barra lateral del artículo (≥1280 px / ≥1024 px) |
| `--header-h` | 4 rem | Alto de la barra superior, para el `top` del pegajoso |
| `--space-section` | 52 px → 88 px | Aire entre secciones |
| `--space-block` | 28 px → 44 px | Aire entre bloques dentro de una sección |

Reglas:

- Una sección siempre es una **banda** con su superficie declarada (`.band--night`,
  `.band--paper`, …). No hay superficies mezcladas a mitad de bloque.
- Más aire arriba de un título que abajo: el título se pega a lo que introduce.
- Breakpoints **solo como adición**: `48rem` (768 px), `60rem` (960 px, entra la
  navegación horizontal), `64rem` (1024 px, aparece la barra lateral) y `80rem`
  (1280 px, el cuerpo se compone en dos columnas). Ningún breakpoint "arregla" algo
  que ya se rompió en 390 px.
- Objetivos táctiles: 44 px mínimo, 48 px en botones. Verificado con medición de
  `getBoundingClientRect()` sobre los enlaces y botones visibles a 390 px (0 casos por
  debajo de 44 px).

### Dos anchos distintos, a propósito

El error que este sistema corrige: usar el ancho de lectura como ancho de página. Dejaba
una columna de 544 px sobre una pantalla de 1440 (38 % del ancho) con 900 px de margen
muerto, y párrafos de 55–62 caracteres que igual se leían bien pero parecían una cinta
tirada en el piso.

Ahora son dos decisiones separadas:

| Ancho | Valor | Para qué |
| --- | --- | --- |
| Envoltorio (`.shell`) | 1248 px | Lo que ocupa la composición: barra, portada, bandas, grillas |
| Lectura (`--measure`) | 608 px | Una línea de texto corrido: 62–72 caracteres |
| Margen del cuerpo | lo que sobra | Placas grandes, citas y grupos anchos (`grid-column: 1 / -1`) |

En escritorio el texto **no se estira**: la página se llena con estructura (barra
lateral, placas, muros, columnas), no con renglones largos. Medido en el sitio
construido a 1440 px: el cuerpo ocupa 1248 px, la prosa 608 px y el párrafo de muestra
mide 63–69 caracteres por línea.

### Composición del artículo (≥1024 px)

- **Portada de página**: el título ocupa la columna ancha a 64 px y la entrada la
  columna angosta, alineadas por la base. En móvil es una sola columna.
- **Cuerpo**: `.prose` es una grilla de dos pistas —lectura y margen—. Todo cae en la
  pista de lectura salvo lo que pide el ancho completo: imágenes sueltas, la cita de
  definición y los grupos en columnas.
- **Barra lateral** (`.article__rail`, solo en las páginas de lectura larga, hoy la
  trayectoria del doctor): índice de la página, pegajoso bajo la barra. Se oculta en
  móvil: la propia lista ya es índice.
- **Páginas de lista** (preguntas, método, entrevistas, servicios, colaboradores,
  testimonios): el cuerpo va en dos columnas (`columns: 2`, `break-inside: avoid` por
  grupo) sobre el ancho completo, sin barra lateral. A 1440 px cada columna mide 596 px
  y rinde 63–69 caracteres. Barra + dos columnas legibles no caben en 1440: por eso las
  páginas que usan columnas no llevan barra.
- **Muro de documentos**: los diplomas que cierran la trayectoria salen del texto
  corrido y forman una banda propia de 2 / 3 / 4 columnas con su altura real, sin
  recorte (`.doc-wall`).

En 390 px todo es una sola columna. Las columnas, la barra lateral y las grillas anchas
son adiciones, nunca reparaciones.

### Ninguna pista sin oficio

La regla que ordena todo lo anterior: **ninguna banda deja más de ~200 px de ancho
esructuralmente vacío a 1440 px**. Cuando una grilla abre dos o tres pistas y solo la
primera tiene contenido, la pista que sobra no es aire: es un hueco que se lee como un
error de maquetación ("como si existieran dos columnas y solo se hubiera ocupado una").
Cada pista recibe una de dos cosas: contenido que ya existe —una foto de la página, el
título de la sección, una cuenta real, la miga de pan— o desaparece porque la pieza se
compone de otro modo.

Cómo se verifica: cualquier contenedor de 700 px o más debe tener sus hijos de bloque
(en flujo, no `inline`) con su borde derecho a menos de 220 px del borde derecho del
contenedor. La medición se hace sobre el sitio construido y servido, con el estado
asentado (revelados disparados e imágenes cargadas). Resultado de la última pasada:
**0 infractores en las 21 rutas a 1440 px y a 1024 px**.

Las composiciones que resuelven los casos medidos:

| Dónde | Antes | Ahora |
| --- | --- | --- |
| Portada, ficha heredada de `home.md` | una columna de 608 px con 640 px de aire y dos afiches a tamaños distintos | dos columnas de flujo (`columns: 2`): texto a la izquierda, afiches y retrato a la derecha |
| Entrada de página con título y línea (testimonios, preguntas, colaboradores) | título en la primera pista, la segunda vacía | `.prose__lead--split`: título y línea, una pieza por columna |
| `/par-biomagnetico/` | retrato de 280 px como sello arriba del texto; la cita sola en 736 px | `.prose__lead--portrait`: el retrato con su pie en la pista angosta, título y cita en la ancha |
| `/francisco-mena/` | 286 px muertos entre la lectura y el borde del cuerpo | el título de cada sección se muda al margen como rótulo de referencia |
| `/contactos/` | el aviso de privacidad solo, con 672 px de aire al lado | el aviso del formulario pendiente ocupa la otra columna de `.contact-followup` |
| `/galeria/` | la entrada de la galería sin grilla: el lede solo a la izquierda | la misma portada de dos pistas que el resto de las páginas (`page-intro__grid`) |
| Álbum de una o dos fotos | hoja de contactos con dos o tres pistas vacías | `.album--few`: las fotos conservan su tamaño y el rótulo del álbum ocupa las pistas que sobran |
| Cierre del archivo de una galería | una lista de 736 px con 512 px de aire | `.album-index--split`: los dos destinos en dos columnas, cada uno con su cuenta |
| Miga de pan en todas las páginas | el `nav` estirado al envoltorio, ~1000 px de aire | `width: fit-content`: la miga mide lo que mide su texto y el título carga la banda |
| Pie de la placa documental | lugar a la izquierda, enlace al archivo pegado al texto | `justify-content: space-between`: la línea cruza la placa, de extremo a extremo |

Ninguna de estas piezas se resuelve achicando el contenido: el ancho de lectura sigue en
608 px y el párrafo entre 62 y 72 caracteres. Lo que cambia es quién ocupa el resto.

### Regla de imagen: la placa

Una sola vez, en todo el sitio. Toda foto —retrato, diploma, archivo, celda de
galería— va sobre una **placa**:

| Parte | Valor | Token |
| --- | --- | --- |
| Línea de 1 px | tinta al 16 % sobre papel; hueso al 16 % sobre índigo | `--rule-paper` / `--rule-night` |
| Radio | 3 px | `--radius-frame` |
| Sombra | desplazada y difusa: `0 1px 2px` + `0 16px 34px -24px` | `--frame-shadow` / `--frame-shadow-night` |
| Fondo | papel 200 mientras carga; índigo 800 sobre oscuro | — |

Se aplica con `.frame` cuando la imagen tiene contenedor propio (placa documental,
portada, celda de galería, retrato de credencial, muro de documentos) y por selector
cuando la imagen viene del Markdown sin contenedor (`.prose img`,
`.gallery-row__cover`, `.archive-intro__image`). Las dos formas están declaradas juntas
en un solo bloque de `global.css`.

Reglas asociadas:

- **La proporción la fija el marco, no la foto.** Las celdas de galería son cuadradas
  (`aspect-ratio: 1`) y la portada del álbum es 4:3. Así la grilla no salta al cargar y
  dos fotos de proporciones distintas no dejan huecos. La foto se recorta con
  `object-fit: cover`; el original —sin recorte— se abre en una pestaña nueva desde el
  mismo enlace.
- **El pie no mueve la grilla.** El número de archivo (`01 / 21`) tiene renglón
  reservado (`min-height`) y cifras tabulares.
- **Portada distinta del resto.** La carátula del álbum va en la portada de la página,
  más grande, con pie en Spectral y una regla de cobre encima; las fotos de la grilla
  van con el marco común y su número. Así una página de galería se lee como portada +
  fotografías, no como un muro uniforme.
- **Hover y foco, sin salto.** La imagen escala 4–5 % dentro de un marco que recorta
  (`overflow: hidden`) y el borde cambia a cobre. El foco de teclado usa el anillo del
  sistema.

---

## 5. Movimiento

El movimiento no decora: avisa que la página llegó, que la sección cambió de
superficie, que lo que se ve es el archivo y no una lámina. Es sobrio a propósito —
esto es un centro médico, no un juego.

Cuatro reglas duras:

1. **Solo `transform`, `opacity`, `stroke-dashoffset` y color.** Nada que mueva el
   layout: sin animar alto, ancho, `top` ni márgenes. CLS medido en el sitio
   construido: 0.
2. **Nada se repite en bucle.** Ningún `animation-iteration-count` infinito.
3. **Nada retrasa la lectura.** El script arma el revelado solo para lo que está por
   debajo de la primera pantalla; lo que ya se ve nunca se oculta.
4. **Todo termina en su estado final con `prefers-reduced-motion: reduce`.** Con la
   preferencia activa el script no arma nada, y el CSS deja por escrito el mismo
   estado por si la preferencia cambia con la página abierta.

### Inventario

| # | Conducta | Disparador | Qué se mueve | Sin movimiento |
| --- | --- | --- | --- | --- |
| 1 | **Revelado de bloque** (`.reveal-pending` → `.is-in`) | `IntersectionObserver`, al entrar en el viewport | `opacity` 0 → 1 y `translateY(14px)` → 0, 640 ms, curva `--ease-out`; lo que entra junto se escalona 70 ms (techo de 5 pasos) | Todo visible desde el primer pintado: el script no arma nada |
| 2 | **Regla del par que se traza** (`data-reveal="rule"`) | igual que 1 | `scaleX(0)` → 1 desde el extremo izquierdo, 640 ms | Regla completa |
| 3 | **El par se dibuja** (`.pair-field--armed.is-drawn`) | al cargar si está a la vista; si no, al entrar | `stroke-dashoffset` 1 → 0, 900 ms, con 70 ms de separación entre las cinco líneas y los polos al final (420 ms) | Figura ya dibujada |
| 4 | **Barra superior compacta** (`.site-header.is-scrolled`) | `scrollY > 12` | fondo índigo 950 → 900, borde a cobre 38 %, sombra desplazada, marca un 14 % más baja; 260 ms. El alto no cambia: animar el alto de una barra pegajosa mueve toda la página | La barra queda en su estado normal; el estado compacto es el adicional |
| 5 | **Subrayado que crece** | `hover` / `focus-visible` | `background-size` 0 → 100 % (o 1 px → 2 px), 320 ms | Subrayado ya presente (los enlaces de prosa mantienen el suyo) |
| 6 | **Presión del botón** (`.btn:active`) | `:active` | `translateY(1px)`, 120 ms | Nada |
| 7 | **Panel del menú móvil** (`panel-in`) | abrir el `<details>` | `opacity` 0 → 1 y `translateY(-8px)` → 0, 280 ms | Aparece abierto |
| 8 | **Placa de imagen** (`.frame img`) | `hover` / `focus-visible` sobre la imagen enlazada | `transform: scale(1.04)` (1.05 en la celda de galería), 420 ms, recortado por el marco; el borde pasa a cobre | Imagen quieta |

Cifras medidas en el CSS construido: **1 `@keyframes`** (`panel-in`), **1 declaración
`animation`**, **24 declaraciones `transition`** sobre 8 propiedades (`transform`,
`opacity`, `background-color`, `background-size`, `color`, `border-color`,
`text-decoration-color`, `stroke-dashoffset`).

Conductas disparadas por el scroll: **3** (revelado, regla del par, barra superior) más
el dibujo del par, que corre al entrar o al cargar.

Verificado en el navegador: en `/preguntas/` a 1440 px se arman 5 de 9 bloques (los 4
restantes están sobre el pliegue y no se ocultan), los 5 se revelan al recorrer la
página y ninguno queda invisible (`opacity: 1`, `transform: none`). Con la preferencia
de movimiento reducido: 0 bloques armados, 0 transiciones activas y 0 animaciones
activas.

---

## 6. Superficies del navegador

Las partes que no dibujamos también pertenecen al sistema:

- **Selección**: fondo cobre 500, texto índigo 950.
- **Foco**: anillo de 2 px con 3 px de separación; cobre 300 sobre índigo, cobre 500
  sobre papel. Visible con teclado en todos los controles, incluido el menú `<details>`.
- **Cursor de texto**: cobre.
- **Scrollbar**: fina, pulgar índigo 600 sobre transparente.
- **Subrayados**: 1 px, separación 0,22 em; en enlaces de acento el subrayado es cobre al
  45 % y pasa a 100 % en hover.

---

## 7. Componentes

Todos viven en `src/components/`. Cada archivo abre con un comentario que dice qué
renderiza, quién lo usa y qué tocar para cambiarlo.

| Componente | Qué es | Dónde se usa |
| --- | --- | --- |
| `PairField.astro` | La figura del par: dos polos de cobre y el campo entre ellos (SVG geométrico, sin ilustración figurativa) | Portada |
| `FieldRule.astro` | El mismo motivo como regla divisoria: una línea de 1 px con un polo de cobre en cada extremo | Galerías, cierres |
| `WhatsAppAction.astro` | Botón/enlace `wa.me` con mensaje precargado, número real visible y burbuja dibujada. Variantes: `copper`, `outline`, `paper`; modo `compact` (44×44) | Barra superior, portada, cierres, página de contacto |
| `SectionHeading.astro` | Título de sección + entrada opcional. Sin etiqueta encima | Portada, galería, contacto |
| `CredentialPlate.astro` | Retrato + títulos verificables del director | Portada |
| `GalleryGrid.astro` | Hoja de contactos de un álbum: 2 / 3 / 4 columnas, celda cuadrada con marco, número de archivo reservado y enlace al original | Páginas de galería |
| `PageCta.astro` | Cierre de página: una pregunta, un botón de WhatsApp, un enlace secundario | Portada y páginas institucionales |
| `SiteHeader.astro` | Marca, navegación horizontal (escritorio) y menú `<details>` (móvil, sin hover) | `BaseLayout` |
| `SiteFooter.astro` | Mapa del sitio, dirección, horario, correos y WhatsApp | `BaseLayout` |
| `EntryBody.astro` | Cuerpo de un `.md` agrupado: entrada + grupos (preguntas, conceptos, secciones, personas) con `id` para el índice | Portada y páginas institucionales |
| `ContentBlocks.astro` | Los bloques de contenido uno por uno, con el tratamiento de su página (pregunta, cita, rótulo) | Vía `EntryBody` |
| `SiteMotion.astro` | El script del movimiento: revelado al entrar, barra compacta y dibujo del par | `BaseLayout` |
| `QuestionParagraph.astro` | Párrafo que, si empieza con "¿", se vuelve subtítulo | Página de preguntas |
| `QuoteParagraph.astro` | Párrafo entre comillas que se vuelve cita | Página del método |
| `ContentHeading.astro` | El `<h1>` heredado convertido en `<h2>` | Vía `EntryBody` |

Reglas de componentes:

- **Botones**: radio 3 px, alto 48 px, Archivo 600, sin sombra. Primario cobre con texto
  índigo; secundario contorno; "quieto" es un enlace subrayado. Nunca dos acciones
  primarias en la misma pantalla.
- **Nada de tarjetas**: los listados son filas regladas (galerías, canales, álbumes). No
  hay contenedores de texto con borde + sombra + radio; la jerarquía la hacen la regla y
  el aire. La única excepción es la **foto**, que va sobre una placa (§4): la sombra
  pertenece a la imagen, nunca a una caja de texto.
- **Iconos**: uno solo, la burbuja de mensaje, dibujada en SVG dentro de
  `WhatsAppAction`. No hay emojis ni glifos Unicode haciendo de icono.
- **Elevación**: solo dos cosas tienen sombra desplazada con blur: el panel del menú
  móvil y la placa de imagen. Nada más flota.

---

## 8. Tratamiento por página

La plantilla institucional (`src/pages/[...slug].astro`) es una sola, pero cada página
declara su variante en `src/data/page-meta.ts` y las reglas viven en `.prose--*` dentro de
`global.css`:

| Página | Variante | Qué cambia |
| --- | --- | --- |
| `/par-biomagnetico/` | `prose--metodo` | La entrada compone el retrato del Dr. Goiz Durán con su pie en la pista angosta y el título con la cita de definición en la ancha (`.prose__lead--portrait`); los párrafos que abren con comillas se vuelven citas en Spectral; cada concepto (`Magnetismo`, `pH`, `Entropía`…) es un grupo con su regla y la lista se compone en dos columnas |
| `/preguntas/` | `prose--preguntas` | La entrada compone título y línea en dos columnas; cada párrafo que empieza con "¿" abre un grupo con su respuesta; en pantalla ancha van en dos columnas |
| `/francisco-mena/` | `prose--documentos` | Barra lateral con el índice de secciones; desde 1280 px el título de cada sección se va al margen derecho como rótulo de referencia, así el cuerpo no deja una pista vacía; los reconocimientos salen del texto y cierran como muro de documentos en banda propia (2–4 columnas), sin recorte |
| `/testimonios/` | `prose--testimonios` | La entrada compone el título y la presentación en dos columnas; cada relato es un grupo con la regla del par, en Spectral, a dos columnas |
| `/entrevistas/` | `prose--entrevistas` | Cada entrevista es una ficha con regla superior |
| `/colaboradores/` | `prose--colaboradores` | Retrato flotado a 8 rem + nombre en Spectral + datos en 15 px; a dos columnas en pantalla ancha |
| `/servicios/` | sin variante | Texto corrido + aviso de que el original está en *lorem ipsum* |
| Portada | `prose--home` | El contenido heredado de `home.md` se lee como ficha del centro, en dos columnas de flujo (el retrato y los afiches caen en la segunda) |
| `/contactos/` | — | Canales reales en dos columnas; la banda de cierre compone el aviso del formulario pendiente y el de privacidad, uno por columna |
| `/galeria/` | — | Portada de dos pistas (título y cuenta del archivo) e índice de filas con portada, álbumes y fotos |
| `/galeria/<archivo>/` | — | Portada del álbum (4:3, con pie) + notas de archivo + índice de álbumes + álbumes con hoja de contactos; un álbum de una o dos fotos compone su rótulo al lado de las fotos (`.album--few`); el cierre lleva los dos destinos en dos columnas con su cuenta |
| `/contactos/` | — | Canales reales, horario, aviso del formulario pendiente |

Pendientes conocidos, visibles en las páginas cuando corresponde:

- `servicios.md` sigue siendo texto de relleno del sitio anterior: la página lo dice.
- Testimonios perdió los videos en la migración: la página lo dice.
- 245 de las 254 fotos de galería tienen texto alternativo generado (`altPending`): hay
  que revisarlo en los JSON antes de publicar.

---

## 9. Accesibilidad y móvil

- Composición base a **390 px**; los breakpoints agregan columnas, nunca reparan.
- Sin scroll horizontal en las 21 rutas a 390, 768, 1024 y 1440 px (verificado midiendo
  `documentElement.scrollWidth` contra el ancho del viewport en cada combinación: 84 de
  84 iguales al viewport, última pasada incluida).
- El índice lateral del artículo está oculto en móvil (`display: none` por debajo de
  1024 px): la propia lista ya orienta y no se duplica.
- El foco de teclado llega a las imágenes de galería porque cada foto es un enlace al
  original, con el texto alternativo como nombre accesible.
- El movimiento respeta `prefers-reduced-motion: reduce` sin excepciones (§5).
- Enlace "Saltar al contenido" como primera parada del teclado.
- Navegación sin hover: el menú móvil es un `<details>` nativo, se cierra con Escape y
  al elegir una página; la navegación de escritorio es una fila de enlaces.
- Texto base de 17 px (19 px en escritorio) e interlineado 1,62: por encima del mínimo
  legible, porque el público incluye pacientes mayores.
- Contraste medido en todos los pares de texto (ver tablas de color).
- El html semántico no se pierde: `main`, `nav` con `aria-label`, `aria-current` en la
  página activa, `address` para la dirección, `time`/datos en tabular cuando corresponde.
- Jerarquía de encabezados: un solo `h1` por página; el `h1` del contenido heredado se
  convierte en `h2` (`EntryBody` + `ContentHeading`).

---

## 10. Cómo se verifica

```bash
pnpm run check     # tipos y errores de Astro
pnpm run build     # 21 rutas estáticas
```

El detector de Impeccable se corre sobre las plantillas cambiadas:

```bash
C:/Users/Daryhen/.agents/skills/impeccable/scripts/impeccable.cmd detect --json src/pages src/layouts src/components src/styles
```

Resultado de la última corrida: **0 hallazgos** sobre `src/`. Una corrida anterior había
marcado un `straggler` en `/par-biomagnetico/` (el último renglón de la cita de entropía
quedaba en una sola palabra, "videntes."); al componer el cuerpo en dos columnas el
renglón ya no queda solo. El texto heredado no se tocó.

Cómo se mide:

- Escanear los `.astro` y `.css` en `src/` da **0 hallazgos**, pero el propio detector
  avisa que ahí corre solo con expresiones regulares: es un piso, no un certificado.
- Escanear `dist/` como archivos sueltos infla el resultado porque no resuelve el layout
  con la hoja de estilos enlazada. La medición confiable es sobre el sitio construido y
  servido: las 21 rutas, con navegador real.

### Medición de composición (sitio construido, servidor local)

Ancho del viewport, ancho que ocupa el contenido, caracteres del párrafo de muestra y
desborde horizontal:

| Página | Viewport | Envoltorio | Párrafo | Línea | Desborde |
| --- | --- | --- | --- | --- | --- |
| Portada | 1440 | 1248 | 2 columnas de 596 | 64 car. | no |
| Portada | 390 | 350 | 350 px | 43 car. | no |
| `/preguntas/` | 1440 | 1248 | 596 px | 69 car. | no |
| `/preguntas/` | 390 | 350 | 350 px | 43 car. | no |
| `/testimonios/` | 1440 | 1248 | entrada en 2 pistas de 596 | 69 car. | no |
| `/francisco-mena/` | 1440 | 894 (con barra) | 608 px + rótulo de 245 | 69 car. | no |
| `/servicios/` | 1440 | 1248 | 596 px | 63 car. | no |
| `/servicios/` | 390 | 350 | 350 px | 44 car. | no |
| `/galeria/fotochile/` | 1440 | 1248 | 4 celdas de 297 px | — (nota de archivo: 36 car.) | no |
| `/galeria/fotochile/` | 390 | 350 | 2 celdas de 169 px | — (nota de archivo: 36 car.) | no |

Antes de esta pasada, `/preguntas/` a 1440 px rendía un párrafo de 544 px (38 % del
viewport) con 62 caracteres por línea y 900 px de margen muerto a la derecha.

### Detector de pistas vacías (sitio construido, servidor local)

La regla de §4 medida sobre el resultado, no sobre la intención: todo contenedor de
700 px o más debe tener sus hijos de bloque con el borde derecho a menos de 220 px del
borde derecho del contenedor. Se corre en las 21 rutas con el estado asentado
(revelados disparados, imágenes cargadas) y se cuentan los infractores:

| Viewport | Rutas | Infractores |
| --- | --- | --- |
| 1440 | 21 | 0 |
| 1024 | 21 | 0 |
| 768 | 21 | 0 |
| 390 | 21 | 0 (ningún contenedor llega a 700 px) |

Antes de la pasada: **82 infractores** entre 1440 y 1024 px (pistas de 512–1002 px
vacías en la portada, el método, testimonios, contactos, la galería y la trayectoria
del doctor, más las hojas de contacto de un solo álbum y el cierre del archivo).

También medido en el navegador: CLS 0 en las cinco rutas de referencia, 0 imágenes sin
`width`/`height`, 0 errores de consola, y el alto de la barra superior constante (65 px)
mientras se desplaza.

### Movimiento (§5), medido en el sitio construido

- Sin preferencia de movimiento: **421 bloques `[data-reveal]`** en las 21 rutas; en 20
de ellas hay bloques armados bajo el pliegue, todos se revelan al recorrer la página y
**0 quedan ocultos** (`opacity` 1, sin `transform`).
- Con `prefers-reduced-motion: reduce`: **0 bloques armados** y **0 elementos ocultos**
en las 21 rutas, antes y después de recorrer la página; los polos del par quedan
dibujados y ninguna animación o transición corre.
