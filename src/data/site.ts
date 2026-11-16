/**
 * Identidad del sitio y navegación.
 *
 * Lo usan: `src/layouts/BaseLayout.astro`, `src/components/SiteHeader.astro`
 * y `src/components/SiteFooter.astro`.
 *
 * Si agregás una página nueva, sumala acá: `navGroups` alimenta el menú del
 * móvil y el mismo menú alimenta el pie. Lo que no esté en estos arrays no se puede
 * encontrar navegando, solo por URL directa.
 */
export const siteName = "Centro de Biomagnetismo Médico";
export const siteShortName = "Biomagnetismo Médico";
export const siteTagline = "Par biomagnético · Quito, Ecuador";
export const siteDescription =
  "Centro de Biomagnetismo Médico en Quito. Método del par biomagnético del Dr. Isaac Goiz Durán, dirigido por el Dr. HC Francisco Mena Flores.";
export const siteLocale = "es_EC";

/**
 * Cloudflare Web Analytics.
 *
 * Mide visitas sin cookies, sin huellas del navegador y sin guardar datos
 * personales: por eso no necesita banner de consentimiento y es lo adecuado
 * para un sitio con contenido de salud.
 *
 * El token lo asigna Cloudflare (Web Analytics → Manage site). Si se deja vacío,
 * el script no se emite y el sitio queda sin métricas, sin romperse.
 *
 * Ojo: si algún día se activa la inyección automática de Cloudflare para esta
 * zona, hay que vaciar este token o las visitas se contarían dos veces.
 */
export const cloudflareBeaconToken = "33fe2ebd12ee427593b5f6bb21e7b4a4";

export type NavItem = { label: string; href: string };

/** Navegación visible en escritorio, al lado de la marca. */
export const primaryNav: NavItem[] = [
  { label: "El método", href: "/par-biomagnetico/" },
  { label: "El doctor", href: "/francisco-mena/" },
  { label: "Preguntas", href: "/preguntas/" },
  { label: "Galería", href: "/galeria/" },
  { label: "Contactos", href: "/contactos/" },
];

/** Navegación completa, agrupada. Alimenta el menú del móvil y el pie. */
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


/**
 * Marca el enlace activo comparando la ruta actual con la del enlace, con y
 * sin barra final. Devuelve `undefined` cuando no coincide, así el atributo
 * `aria-current` no se imprime en el resto de los enlaces.
 */
export function currentLink(pathname: string, href: string): "page" | undefined {
  const normalize = (path: string) => path.replace(/\/+$/, "") || "/";
  return normalize(pathname) === normalize(href) ? "page" : undefined;
}
