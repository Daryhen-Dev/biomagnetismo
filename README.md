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
pnpm build      # genera dist/
pnpm check      # tipos y errores de Astro
```

> Este proyecto usa **pnpm**, no npm. `package.json` fija la versión con
> `packageManager`, así que corepack la respeta automáticamente.

---

## Dónde tocar qué

Esta es la tabla que hay que mirar primero. Cada fila responde "quiero cambiar X,
¿por dónde empiezo?".

| Quiero cambiar… | Voy a… |
| --- | --- |
| El texto de una página | `src/content/pages/<slug>.md` — el nombre del archivo es la URL |
| El título o la descripción SEO de una página | El frontmatter de ese mismo `.md` |
| Las fotos de un país o evento | El `.json` de esa galería en `src/content/galleries/` |
| El orden de las imágenes | El array `images` de ese `.json` |
| Los colores, tipografías y espaciados | `src/styles/global.css` (bloque `@theme`) y `DESIGN.md` |
| El encabezado, pie y estructura común | `src/layouts/BaseLayout.astro` |
| Cómo se ve una página en particular | `src/pages/[...slug].astro` o la ruta específica |
| Los redirects de URLs viejas | `src/data/redirects.json` |
| Qué URLs existen | `src/pages/` — cada archivo es una ruta |

**Regla de oro:** una página es un archivo `.md` con el mismo nombre que su URL.
`sitio.cl/preguntas/` ← `src/content/pages/preguntas.md`. No hay base de datos ni
CMS: lo que está en el repositorio es lo que se publica.

---

## Estructura

```
src/
├── content/pages/        10 páginas institucionales en Markdown (una por URL)
├── content/galleries/    11 galerías (30 galerías Modula, 254 fotos)
├── content.config.ts     Esquema: qué campos admite cada tipo de contenido
├── data/redirects.json   301 de las URLs del WordPress viejo
├── assets/media/         Fotos optimizadas a WebP, por año/mes
├── layouts/BaseLayout    <head>, SEO, estructura de documento
├── pages/                Rutas. [...slug].astro sirve las páginas
└── styles/global.css     Tailwind 4 + tokens de diseño en @theme
```

### Convenciones

- **Mobile first.** Todo se compone primero para 390 px y después escala. Los
  breakpoints son adiciones (`md:`, `lg:`), nunca correcciones de un layout que
  ya se rompió en móvil.
- **Trazabilidad.** Los nombres de archivo son las URLs. Los comentarios
  explican el *porqué*, no el *qué*. El frontmatter lleva `wpId` para poder
  rastrear cada página hasta su origen en WordPress.
- **El contenido es literal.** Es información médica: los textos se portaron
  sin reescribir, resumir ni "mejorar". Si un texto debe cambiar, es una decisión
  editorial explícita.
- **Las imágenes no llevan metadatos.** El pipeline de migración eliminó
  EXIF/ICC/XMP: son fotos de pacientes y documentos, no pueden viajar con GPS ni
  datos de cámara.

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

## Estado

El plan completo, las decisiones y la evidencia de cada paso están en
[`odd/tasks/migracion-astro.md`](odd/tasks/migracion-astro.md). Ese archivo es la
bitácora: si algo no se entiende del código, la respuesta suele estar ahí.
