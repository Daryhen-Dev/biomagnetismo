/**
 * Cuerpo de una página de contenido, listo para renderizar por bloques.
 *
 * Por qué existe: Astro solo permite sustituir elementos del Markdown
 * (`components={{ p: … }}`) cuando el contenido es MDX. Las páginas acá son
 * `.md`, así que la sustitución no se aplica. Este archivo renderiza el cuerpo
 * a HTML con la API de contenedor de Astro —la misma que se usa para generar
 * feeds— y lo divide en bloques de primer nivel para que la plantilla pueda
 * tratarlos por separado (una pregunta no se lee como una respuesta).
 *
 * Lo usan: `src/components/EntryBody.astro`.
 *
 * Las expresiones regulares solo separan bloques de primer nivel: en el HTML
 * de Markdown los párrafos y los h1 nunca están anidados dentro de otro
 * elemento, así que no hacen falta árboles ni dependencias nuevas.
 */
import { experimental_AstroContainer as AstroContainer } from "astro/container";

/** El componente `Content` que devuelve `render()` de `astro:content`. */
type ContentComponent = Parameters<AstroContainer["renderToString"]>[0];

export type ContentBlock =
  | { kind: "heading"; level: number; originalLevel: number; id?: string; inner: string }
  | { kind: "paragraph"; inner: string }
  | { kind: "raw"; html: string };

let container: Promise<AstroContainer> | undefined;

/** Renderiza el cuerpo de una entrada a HTML, con las imágenes ya optimizadas. */
export async function renderEntryHtml(Content: ContentComponent): Promise<string> {
  container ??= AstroContainer.create();
  const html = await (await container).renderToString(Content);
  return unwrapImageParagraphs(repairSplitLinks(html));
}

/**
 * Vuelve a unir los enlaces que el port dejó partidos por líneas en blanco.
 *
 * En `home.md` el enlace a la página del doctor quedó así:
 * `[`, línea en blanco, `Francisco Mena`, línea en blanco, `](/francisco-mena/)`.
 * Markdown no admite líneas en blanco dentro de un enlace, así que se renderiza
 * como tres párrafos con corchetes y paréntesis visibles. Este paso lo une de
 * nuevo sin tocar el `.md` (el contenido es de solo lectura para el diseño).
 */
export function repairSplitLinks(html: string): string {
  return html.replace(
    /<p>\s*\[\s*<\/p>\s*<p>([\s\S]*?)<\/p>\s*<p>\s*\]\(([^)\s]+)\)\s*<\/p>/g,
    (_match, text: string, href: string) => `<p><a href="${href}">${text.trim()}</a></p>`,
  );
}

/**
 * Saca del párrafo las imágenes que quedaron solas dentro de un `<p>`.
 *
 * El Markdown con sangría en las líneas hace que una imagen suelta termine
 * envuelta en un párrafo. Eso rompe las reglas de las variantes por página, que
 * necesitan que la imagen sea hija directa del contenedor (por ejemplo la
 * grilla de documentos de la página del doctor). La imagen es la misma; solo
 * cambia quién es su padre.
 */
export function unwrapImageParagraphs(html: string): string {
  return html.replace(/<p>\s*(<img[^>]*>)\s*<\/p>/g, "$1");
}

/**
 * Divide el HTML en bloques. Los párrafos y los h1 se identifican; todo lo
 * demás (imágenes, listas, subtítulos, citas) pasa tal cual.
 */
export function toBlocks(html: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const pattern = /<(h[1-6])([^>]*)>([\s\S]*?)<\/h[1-6]>|<p>([\s\S]*?)<\/p>/g;
  let cursor = 0;

  for (const match of html.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > cursor) {
      const between = html.slice(cursor, start);
      // El espacio en blanco entre bloques no es un bloque: si se guarda, cuenta
      // como hijo del cuerpo y rompe cualquier regla que cuente piezas.
      if (between.trim()) blocks.push({ kind: "raw", html: between });
    }

    if (match[1]) {
      blocks.push({
        kind: "heading",
        level: Number(match[1].slice(1)),
        originalLevel: Number(match[1].slice(1)),
        id: /id="([^"]+)"/.exec(match[2] ?? "")?.[1],
        inner: match[3] ?? "",
      });
    } else {
      blocks.push({ kind: "paragraph", inner: match[4] ?? "" });
    }

    cursor = start + match[0].length;
  }

  if (cursor < html.length) {
    const tail = html.slice(cursor);
    if (tail.trim()) blocks.push({ kind: "raw", html: tail });
  }

  return blocks;
}

/**
 * Ajusta los niveles de encabezado para que el esquema del documento no salte
 * niveles (h1 → h3 sin pasar por h2). Es un requisito de accesibilidad: los
 * lectores de pantalla navegan por esa jerarquía.
 *
 * Reglas: el `<h1>` del Markdown es el título que la página ya muestra arriba,
 * así que pasa a `h2`; cada nivel nuevo se recorta como máximo a un paso más
 * profundo que el anterior, y los encabezados del mismo nivel del Markdown
 * conservan el mismo nivel asignado.
 */
export function normalizeHeadingLevels(blocks: ContentBlock[]): ContentBlock[] {
  const assigned = new Map<number, number>();
  let previous = 1; // el título de la página ya ocupa el h1

  return blocks.map((block) => {
    if (block.kind !== "heading") return block;

    const mapped = assigned.get(block.level) ?? (block.level === 1 ? 2 : block.level);
    const level = Math.min(mapped, previous + 1);
    assigned.set(block.level, level);

    previous = level;
    return { ...block, level };
  });
}

/* ---------------------------------------------------------------------------
   Agrupado: el cuerpo deja de ser una pila de párrafos y se vuelve una lista
   de grupos con nombre. Cada grupo es una unidad que la plantilla puede
   componer (dos columnas, una ficha, un relato) y que el índice de la página
   puede enlazar. Sin agrupar, un texto largo solo puede ser una columna.
   ------------------------------------------------------------------------- */

/** Entrada del índice "En esta página" de la barra lateral. */
export type OutlineItem = { id: string; label: string };

/** Un grupo del cuerpo: su etiqueta (visible en el índice) y sus bloques. */
export type ContentGroup = {
  id: string;
  label: string;
  blocks: ContentBlock[];
};

export type GroupedBody = {
  /** Bloques anteriores al primer grupo: entrada, imagen, cita de definición. */
  lead: ContentBlock[];
  groups: ContentGroup[];
};

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  laquo: "«",
  raquo: "»",
  ldquo: "“",
  rdquo: "”",
  hellip: "…",
  ndash: "–",
  mdash: "—",
};

/** Texto plano de un fragmento de HTML: sin etiquetas, sin entidades, sin
 *  espacios repetidos. Se usa para las etiquetas del índice y para detectar
 *  párrafos que son preguntas. */
export function plainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (entity, code: string) => {
      if (code.startsWith("#")) {
        const point =
          code[1] === "x" || code[1] === "X"
            ? Number.parseInt(code.slice(2), 16)
            : Number.parseInt(code.slice(1), 10);
        return Number.isFinite(point) ? String.fromCodePoint(point) : "";
      }
      return NAMED_ENTITIES[code.toLowerCase()] ?? entity;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function isImageOnly(block: ContentBlock): boolean {
  return block.kind === "raw" && /^\s*(?:<img[^>]*>\s*)+$/.test(block.html);
}

/**
 * Separa el final del cuerpo cuando son solo imágenes.
 *
 * En la página del doctor los reconocimientos cierran con catorce documentos
 * seguidos: dentro del texto corrido se ven chicos, así que la plantilla los
 * compone aparte, como muro. El corte es por forma (una cola de imágenes), no
 * por el nombre de la página.
 */
export function splitTrailingImages(blocks: ContentBlock[]): {
  body: ContentBlock[];
  wall: string[];
} {
  let start = blocks.length;
  while (start > 0 && isImageOnly(blocks[start - 1])) start -= 1;

  // Un mismo bloque de HTML puede traer varias imágenes seguidas (el port de
  // WordPress las dejó juntas): el muro trabaja con una imagen por celda.
  const wall = blocks
    .slice(start)
    .flatMap((block) => (block as { html: string }).html.match(/<img[^>]*>/g) ?? []);

  return { body: blocks.slice(0, start), wall };
}

/**
 * Modo de agrupado por página.
 *
 * - `preguntas`: cada párrafo que abre con "¿" encabeza su respuesta.
 * - `relatos`: el primer párrafo es la entrada; cada uno de los siguientes, un
 *   testimonio.
 * - `encabezados`: cada título del contenido encabeza su sección (conceptos del
 *   método, cursos del doctor, entrevistas, servicios). El nivel que abre grupo
 *   lo fija `BODY_TREATMENTS` (`h3` en el método, `h2` en el resto).
 * - `personas`: cada retrato encabeza su ficha (colaboradores).
 * - `ninguno`: el cuerpo queda tal cual.
 */
export type GroupMode = "preguntas" | "encabezados" | "personas" | "relatos" | "ninguno";

/** Nivel de título que abre un grupo nuevo cuando el modo es por encabezados.
 *  En el método los conceptos son `h3` (el `h2` es el título de la sección, que
 *  va a la entrada); en el resto de las páginas, `h2`. */
const HEADING_GROUP_LEVEL = 2;

/**
 * Agrupa los bloques del cuerpo según el modo de la página.
 *
 * El primer bloque que cumple la regla abre un grupo; lo anterior es la
 * entrada (`lead`), que la plantilla compone a medida de lectura. Un grupo que
 * solo tiene su título —"El método se sustenta en los siguientes conceptos:"—
 * se conserva: el título es contenido; el índice lo descarta.
 */
export function groupBlocks(
  blocks: ContentBlock[],
  mode: GroupMode,
  headingLevel: number = HEADING_GROUP_LEVEL,
): GroupedBody {
  if (mode === "ninguno") return { lead: blocks, groups: [] };

  const lead: ContentBlock[] = [];
  const groups: ContentGroup[] = [];
  const used = new Set<string>();

  const uniqueId = (base: string): string => {
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    return id;
  };

  const blockLabel = (block: ContentBlock | undefined): string => {
    if (!block) return "";
    return block.kind === "heading" || block.kind === "paragraph" ? plainText(block.inner) : "";
  };

  // En los relatos, el primer párrafo (debajo del título) es la entrada de la
  // página; del segundo en adelante, cada uno es un testimonio publicado.
  let paragraphs = 0;

  const startsGroup = (block: ContentBlock): boolean => {
    if (mode === "preguntas") {
      return block.kind === "paragraph" && /^\s*¿/.test(block.inner);
    }
    if (mode === "relatos") {
      if (block.kind !== "paragraph") return false;
      paragraphs += 1;
      return paragraphs > 1;
    }
    if (mode === "personas") return isImageOnly(block);
    return block.kind === "heading" && block.level === headingLevel;
  };

  for (const [index, block] of blocks.entries()) {
    if (startsGroup(block)) {
      let id: string;
      let label: string;

      if (mode === "preguntas") {
        id = `pregunta-${groups.length + 1}`;
        label = blockLabel(block);
      } else if (mode === "personas") {
        // El retrato abre la ficha, pero el nombre está en el párrafo que sigue.
        id = `persona-${groups.length + 1}`;
        label = blockLabel(blocks[index + 1]);
      } else {
        id = (block as { id?: string }).id ?? `seccion-${groups.length + 1}`;
        label = blockLabel(block);
      }

      groups.push({ id: uniqueId(id), label, blocks: [block] });
      continue;
    }

    const current = groups[groups.length - 1];
    if (current) current.blocks.push(block);
    else lead.push(block);
  }

  return { lead, groups };
}

/**
 * Tratamiento del cuerpo según la variante de página (ver
 * `src/data/page-meta.ts`). Vive acá y no en la plantilla porque lo consultan
 * dos consumidores que tienen que coincidir: `EntryBody.astro` para renderizar
 * y `[...slug].astro` para armar el índice con los mismos ids.
 */
export type BodyVariant =
  | "home"
  | "preguntas"
  | "metodo"
  | "documentos"
  | "testimonios"
  | "entrevistas"
  | "colaboradores"
  | "ninguno";

export type BlockMode = "plain" | "preguntas" | "metodo";

export type BodyTreatment = {
  /** Cómo se lee cada bloque. */
  mode: BlockMode;
  /** Dónde empieza un grupo. */
  group: GroupMode;
  /** Nivel exacto de título que abre grupo cuando `group` es "encabezados". */
  level?: number;
  /**
   * La entrada de la página (título + una línea) se compone en dos columnas
   * alineadas con los grupos de abajo. Solo donde la entrada es una línea de
   * orientación; en los relatos la entrada es texto y va debajo del título.
   */
  splitLead?: boolean;
  /**
   * El cuerpo se compone en dos columnas sobre el ancho completo (pantalla
   * ancha). Las páginas que sí usan columnas no llevan barra lateral de índice:
   * 1440 px no alcanzan para barra + dos columnas de lectura legible (62–72
   * caracteres). Ahí la propia lista ya es el índice.
   */
  columns?: boolean;
};

export const BODY_TREATMENTS: Record<BodyVariant, BodyTreatment> = {
  // La portada ya tiene su propia composición por bandas: su contenido heredado
  // se lee como una ficha seguida, sin grupos ni índice.
  home: { mode: "plain", group: "ninguno" },
  preguntas: { mode: "preguntas", group: "preguntas", columns: true, splitLead: true },
  // Los conceptos del método son `h3` (el `h2` es el título de la sección).
  metodo: { mode: "metodo", group: "encabezados", level: 3, columns: true },
  documentos: { mode: "plain", group: "encabezados" },
  entrevistas: { mode: "plain", group: "encabezados", columns: true },
  colaboradores: { mode: "plain", group: "personas", columns: true, splitLead: true },
  testimonios: { mode: "plain", group: "relatos", columns: true },
  ninguno: { mode: "plain", group: "encabezados", columns: true },
};

/** El índice de la página: solo los grupos que son un destino útil. */
export function buildOutline(groups: ContentGroup[]): OutlineItem[] {
  return groups
    .filter((group) => {
      const label = group.label;
      return /[a-záéíóúüñ]/i.test(label) && !label.endsWith(":");
    })
    .map((group) => ({ id: group.id, label: group.label }));
}

/**
 * Índice de la página a partir de los bloques del cuerpo.
 *
 * Devuelve exactamente los ids que `EntryBody.astro` va a pintar, porque los
 * dos leen el mismo `BODY_TREATMENTS`.
 */
export function outlineFor(blocks: ContentBlock[], variant: BodyVariant): OutlineItem[] {
  const treatment = BODY_TREATMENTS[variant];
  return buildOutline(groupBlocks(blocks, treatment.group, treatment.level).groups);
}
