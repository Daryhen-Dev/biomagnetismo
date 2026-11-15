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
      blocks.push({ kind: "raw", html: html.slice(cursor, start) });
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
    blocks.push({ kind: "raw", html: html.slice(cursor) });
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
