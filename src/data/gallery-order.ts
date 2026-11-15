/**
 * Orden y tamaño de las galerías.
 *
 * Lo usan: `src/pages/galeria/index.astro` (el índice) y
 * `src/pages/galeria/[slug].astro` (el enlace "siguiente galería"), para que
 * las dos páginas cuenten el archivo igual.
 *
 * El orden no es alfabético a propósito: primero la galería del Dr. Goiz y las
 * entrevistas (el origen del método y su difusión) y después los países.
 * Para cambiar qué va primero, editá `FEATURED_ORDER`.
 */
import type { CollectionEntry } from "astro:content";

const FEATURED_ORDER = ["fotogoiz", "fotoentrevista"];

export type GalleryEntry = CollectionEntry<"galleries">;

function rank(id: string): number {
  const index = FEATURED_ORDER.indexOf(id);
  return index === -1 ? FEATURED_ORDER.length : index;
}

export function sortGalleries(galleries: GalleryEntry[]): GalleryEntry[] {
  return [...galleries].sort(
    (a, b) => rank(a.id) - rank(b.id) || a.data.title.localeCompare(b.data.title, "es"),
  );
}

/** Álbumes e imágenes de una galería, para no contar a mano en cada página. */
export function gallerySize(gallery: GalleryEntry): { albums: number; photos: number } {
  return {
    albums: gallery.data.galleries.length,
    photos: gallery.data.galleries.reduce((total, album) => total + album.images.length, 0),
  };
}

/** Texto de la derecha del índice: "5 álbumes · 75 fotos". */
export function gallerySizeLabel(gallery: GalleryEntry): string {
  const { albums, photos } = gallerySize(gallery);
  const albumLabel = albums === 1 ? "1 álbum" : `${albums} álbumes`;
  const photoLabel = photos === 1 ? "1 foto" : `${photos} fotos`;
  return `${albumLabel} · ${photoLabel}`;
}
