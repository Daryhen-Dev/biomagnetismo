/**
 * Identidad del sitio y navegación.
 *
 * Lo usan: `src/layouts/BaseLayout.astro`, `src/components/SiteHeader.astro`
 * y `src/components/SiteFooter.astro`.
 *
 * Si agregás una página nueva, sumala acá: `navGroups` alimenta el menú del
 * móvil y `footerNav` el pie. Lo que no esté en estos arrays no se puede
 * encontrar navegando, solo por URL directa.
 */
export const siteName = "Centro de Biomagnetismo Médico";
export const siteShortName = "Biomagnetismo Médico";
export const siteTagline = "Par biomagnético · Quito, Ecuador";
export const siteDescription =
  "Centro de Biomagnetismo Médico en Quito. Método del par biomagnético del Dr. Isaac Goiz Durán, dirigido por el Dr. HC Francisco Mena Flores. Atención con cita previa.";
export const siteLocale = "es_EC";

export type NavItem = { label: string; href: string };

/** Navegación visible en escritorio, al lado de la marca. */
export const primaryNav: NavItem[] = [
  { label: "El método", href: "/par-biomagnetico/" },
  { label: "El doctor", href: "/francisco-mena/" },
  { label: "Preguntas", href: "/preguntas/" },
  { label: "Galería", href: "/galeria/" },
  { label: "Contactos", href: "/contactos/" },
];

/** Navegación completa, agrupada. Se muestra en el menú del móvil. */
export const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "El método",
    items: [
      { label: "Qué es el par biomagnético", href: "/par-biomagnetico/" },
      { label: "Servicios", href: "/servicios/" },
      { label: "Preguntas frecuentes", href: "/preguntas/" },
    ],
  },
  {
    title: "El centro",
    items: [
      { label: "El doctor Francisco Mena", href: "/francisco-mena/" },
      { label: "Colaboradores", href: "/colaboradores/" },
      { label: "Contactos", href: "/contactos/" },
    ],
  },
  {
    title: "Pruebas y archivo",
    items: [
      { label: "Testimonios", href: "/testimonios/" },
      { label: "Entrevistas", href: "/entrevistas/" },
      { label: "Galería", href: "/galeria/" },
    ],
  },
];

/** Mapa del sitio en el pie: todas las páginas publicadas. */
export const footerNav: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "El par biomagnético", href: "/par-biomagnetico/" },
  { label: "El doctor", href: "/francisco-mena/" },
  { label: "Servicios", href: "/servicios/" },
  { label: "Preguntas", href: "/preguntas/" },
  { label: "Testimonios", href: "/testimonios/" },
  { label: "Entrevistas", href: "/entrevistas/" },
  { label: "Galería", href: "/galeria/" },
  { label: "Colaboradores", href: "/colaboradores/" },
  { label: "Contactos", href: "/contactos/" },
];

/**
 * Marca el enlace activo comparando la ruta actual con la del enlace, con y
 * sin barra final. Devuelve `undefined` cuando no coincide, así el atributo
 * `aria-current` no se imprime en el resto de los enlaces.
 */
export function currentLink(pathname: string, href: string): "page" | undefined {
  const normalize = (path: string) => path.replace(/\/+$/, "") || "/";
  return normalize(pathname) === normalize(href) ? "page" : undefined;
}
