/**
 * Resolución de las imágenes del contenido.
 *
 * Las galerías (`src/content/galleries/*.json`) guardan la ruta de proyecto de
 * cada foto, por ejemplo `/src/assets/media/2020/11/Chile.webp`. Astro no puede
 * pasar una ruta de texto a `<Image>`: necesita el objeto que devuelve el
 * importador de assets. Este archivo construye ese puente una sola vez.
 *
 * - Lo usan: `src/pages/galeria/index.astro`, `src/pages/galeria/[slug].astro`,
 *   `src/pages/index.astro` y `src/layouts/BaseLayout.astro` (imagen de Open Graph).
 * - Si agregás fotos a `src/assets/media/`, no hay que registrar nada: el glob
 *   las toma. Si una ruta del JSON apunta a un archivo que no existe, el build
 *   falla con un mensaje que dice cuál es.
 */
const media = import.meta.glob<ImageMetadata>("/src/assets/media/**/*.webp", {
  eager: true,
  import: "default",
});

/** Devuelve la imagen, o falla el build nombrando la ruta que falta. */
export function mediaImage(projectPath: string): ImageMetadata {
  const image = media[projectPath];
  if (!image) {
    throw new Error(
      `No se encontró la imagen "${projectPath}" en src/assets/media. ` +
        `Revisá la ruta en el JSON de la galería o corré de nuevo el pipeline de optimización.`,
    );
  }
  return image;
}

/** Como `mediaImage`, pero devuelve `undefined` en vez de fallar. */
export function mediaImageOrUndefined(projectPath: string): ImageMetadata | undefined {
  return media[projectPath];
}
