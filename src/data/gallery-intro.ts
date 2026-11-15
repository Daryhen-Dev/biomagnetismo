/**
 * Parser del texto de introducción de las galerías.
 *
 * El campo `intro` de `src/content/galleries/*.json` es Markdown guardado
 * dentro de JSON, no el cuerpo de un `.md`, así que Astro no lo renderiza solo.
 * En vez de añadir una dependencia de Markdown, este archivo convierte el
 * subconjunto que el contenido realmente usa: encabezados (`#` a `#####`),
 * negritas (`**…**`), imágenes (`![alt](ruta "título")`) y párrafos.
 *
 * Lo usa: `src/pages/galeria/[slug].astro`.
 * Si el pipeline de contenido empieza a emitir otro Markdown (listas, enlaces,
 * cursivas), ampliá `parseGalleryIntro` y agregá el caso en la plantilla.
 */
export type GalleryInline = { text: string; strong: boolean };

export type GalleryIntroBlock =
  | { kind: "heading"; level: number; inline: GalleryInline[] }
  | { kind: "paragraph"; strong: boolean; inline: GalleryInline[] }
  | { kind: "image"; src: string; alt: string };

const IMAGE_BLOCK = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)$/;
const HEADING_BLOCK = /^(#{1,6})\s+(.*)$/;

/** Parte `**negrita**` en tramos, sin conservar los asteriscos. */
function parseInline(text: string): GalleryInline[] {
  const spans: GalleryInline[] = [];
  const parts = text.split("**");
  parts.forEach((part, index) => {
    const value = part.trim();
    if (!value) return;
    spans.push({ text: value, strong: index % 2 === 1 });
  });
  return spans;
}

export function parseGalleryIntro(markdown: string): GalleryIntroBlock[] {
  const blocks: GalleryIntroBlock[] = [];

  for (const rawBlock of markdown.replace(/\r\n/g, "\n").split(/\n{2,}/)) {
    // Un bloque puede venir partido en varias líneas (el contenido original
    // corta algunas frases); se unen con un espacio antes de interpretarlo.
    const block = rawBlock
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" ");
    if (!block) continue;

    const image = IMAGE_BLOCK.exec(block);
    if (image) {
      blocks.push({ kind: "image", alt: image[1], src: image[2] });
      continue;
    }

    const heading = HEADING_BLOCK.exec(block);
    if (heading) {
      blocks.push({
        kind: "heading",
        level: heading[1].length,
        inline: parseInline(heading[2]),
      });
      continue;
    }

    const strong = /^\*\*[\s\S]+\*\*$/.test(block);
    const text = strong ? block.slice(2, -2) : block;
    blocks.push({ kind: "paragraph", strong, inline: parseInline(text) });
  }

  return blocks;
}
