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
| `--fs-h1` | 32 px | 48 px | Título de página |
| `--fs-display` | 38 px | 64 px | Portada: "El par biomagnético" |

Interlineado: 1,05 en display, 1,16 en títulos, 1,62 en texto corrido. Tracking negativo
solo en display y títulos, entre −0,03 y −0,02 em (nunca por debajo de −0,04). El cuerpo
nunca baja de 17 px: es el mínimo de este sistema, no el del navegador.

---

## 4. Espacio y composición

| Token | Valor | Qué hace |
| --- | --- | --- |
| `--gutter` | 20 px → 40 px | Margen lateral único del sitio (`.shell`) |
| `--shell` | 68 rem | Ancho máximo del contenido |
| `--measure` | 34 rem | Ancho de lectura (~68 caracteres) |
| `--space-section` | 56 px → 104 px | Aire entre secciones |
| `--space-block` | 28 px → 44 px | Aire entre bloques dentro de una sección |

Reglas:

- Una sección siempre es una **banda** con su superficie declarada (`.band--night`,
  `.band--paper`, …). No hay superficies mezcladas a mitad de bloque.
- Más aire arriba de un título que abajo: el título se pega a lo que introduce.
- Breakpoints **solo como adición**: `48rem` (768 px), `60rem` (960 px, entra la
  navegación horizontal) y `64rem` (1024 px, grillas más densas). Ningún breakpoint
  "arregla" algo que ya se rompió en 390 px.
- Objetivos táctiles: 44 px mínimo, 48 px en botones. Verificado con medición de
  `getBoundingClientRect()` sobre los enlaces y botones visibles a 390 px (0 casos por
  debajo de 44 px).

---

## 5. Movimiento

Una sola curva (`--ease-out: cubic-bezier(.16,1,.3,1)`), un solo tiempo largo
(~1 s) y nada más:

1. **El campo se dibuja** al cargar la portada: las cinco líneas del par se trazan en
   cascada (90 ms entre cada una) y los dos polos aparecen al final. Es la única animación
   coreografiada del sitio.
2. Todo lo demás es respuesta a una acción: hover de botón y enlace, apertura del menú
   móvil (desliza 8 px y funde), cambio de color de enlace.

El estado base de cada elemento es **visible**: la animación del campo parte de una
figura ya dibujada y vuelve a ella (`animation-fill-mode: backwards`), así que si el
movimiento no corre, la figura se ve igual. Con `prefers-reduced-motion: reduce` no se
anima nada.

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
| `GalleryGrid.astro` | Grilla de fotos de un álbum, con `<Image>` (WebP, `srcset`, carga diferida) y proporción real de cada foto | Páginas de galería |
| `PageCta.astro` | Cierre de página: una pregunta, un botón de WhatsApp, un enlace secundario | Portada y páginas institucionales |
| `SiteHeader.astro` | Marca, navegación horizontal (escritorio) y menú `<details>` (móvil, sin hover) | `BaseLayout` |
| `SiteFooter.astro` | Mapa del sitio, dirección, horario, correos y WhatsApp | `BaseLayout` |
| `EntryBody.astro` | Cuerpo de un `.md` renderizado por bloques, con el tratamiento de su página | Portada y páginas institucionales |
| `QuestionParagraph.astro` | Párrafo que, si empieza con "¿", se vuelve subtítulo | Página de preguntas |
| `QuoteParagraph.astro` | Párrafo entre comillas que se vuelve cita | Página del método |
| `ContentHeading.astro` | El `<h1>` heredado convertido en `<h2>` | Vía `EntryBody` |

Reglas de componentes:

- **Botones**: radio 3 px, alto 48 px, Archivo 600, sin sombra. Primario cobre con texto
  índigo; secundario contorno; "quieto" es un enlace subrayado. Nunca dos acciones
  primarias en la misma pantalla.
- **Nada de tarjetas**: los listados son filas regladas (galerías, canales, álbumes). No
  hay contenedores con borde + sombra + radio; la jerarquía la hacen la regla y el aire.
- **Iconos**: uno solo, la burbuja de mensaje, dibujada en SVG dentro de
  `WhatsAppAction`. No hay emojis ni glifos Unicode haciendo de icono.
- **Elevación**: solo el panel del menú móvil tiene sombra (desplazada, con blur). Nada
  más flota.

---

## 8. Tratamiento por página

La plantilla institucional (`src/pages/[...slug].astro`) es una sola, pero cada página
declara su variante en `src/data/page-meta.ts` y las reglas viven en `.prose--*` dentro de
`global.css`:

| Página | Variante | Qué cambia |
| --- | --- | --- |
| `/par-biomagnetico/` | `prose--metodo` | Los párrafos que abren con comillas se vuelven citas en Spectral; cada concepto (`Magnetismo`, `pH`, `Entropía`…) se separa con regla |
| `/preguntas/` | `prose--preguntas` | Los párrafos que empiezan con "¿" se vuelven subtítulos: la página se barre de un vistazo |
| `/francisco-mena/` | `prose--documentos` | Los reconocimientos cierran como muro de documentos en 2–3 columnas, sin recorte |
| `/testimonios/` | `prose--testimonios` | La introducción va en texto corrido; cada relato se separa con la regla del par y se compone en Spectral |
| `/entrevistas/` | `prose--entrevistas` | Cada entrevista es una ficha con regla superior |
| `/colaboradores/` | `prose--colaboradores` | Retrato de 11 rem + nombre en Spectral + datos en 15 px |
| `/servicios/` | sin variante | Texto corrido + aviso de que el original está en *lorem ipsum* |
| Portada | `prose--home` | El contenido heredado de `home.md` se lee como ficha del centro |
| `/galeria/` | — | Índice de filas con portada, álbumes y fotos |
| `/galeria/<archivo>/` | — | Texto de archivo + índice de álbumes + álbumes con grilla tipo columna |
| `/contactos/` | — | Canales reales, horario, aviso del formulario pendiente |

Pendientes conocidos, visibles en las páginas cuando corresponde:

- `servicios.md` sigue siendo texto de relleno del sitio anterior: la página lo dice.
- Testimonios perdió los videos en la migración: la página lo dice.
- 245 de las 254 fotos de galería tienen texto alternativo generado (`altPending`): hay
  que revisarlo en los JSON antes de publicar.

---

## 9. Accesibilidad y móvil

- Composición base a **390 px**; los breakpoints agregan columnas, nunca reparan.
- Sin scroll horizontal a 390 px en las 21 rutas (verificado midiendo `scrollWidth`
  contra el ancho del viewport en cada ruta).
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

Resultado de la última corrida: **1 hallazgo** en 21 rutas — `straggler` en
`/par-biomagnetico/`: el último renglón de la cita de entropía queda en una sola palabra
("videntes."). Es texto heredado literal; corregirlo es una decisión editorial sobre el
contenido, no de diseño, y no se toca en esta etapa.

Dos notas sobre cómo se mide:

- Escanear los `.astro` y `.css` en `src/` da **0 hallazgos**, pero el propio detector
  avisa que ahí corre solo con expresiones regulares: es un piso, no un certificado.
- Escanear `dist/` como archivos sueltos infla el resultado (64) porque no resuelve el
  layout con la hoja de estilos enlazada. La medición confiable es sobre el sitio
  construido y servido: las 21 rutas, con navegador real.
