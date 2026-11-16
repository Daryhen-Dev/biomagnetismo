/**
 * Metadatos y tratamiento de cada página institucional.
 *
 * Por qué existe: los `.md` de `src/content/pages/` guardan el texto del sitio
 * original y su procedencia, pero no traen descripción para buscadores ni la
 * entrada visible de la página. Esos textos son decisión de diseño, no
 * contenido heredado, así que viven acá, en un solo lugar revisable.
 *
 * Lo usa: `src/pages/[...slug].astro`.
 * Si agregás una página nueva en `src/content/pages/`, agregá su entrada acá o
 * el build va a fallar a propósito: ninguna página se publica sin descripción.
 *
 * Reglas de redacción:
 * - La descripción dice qué hay en la página, sin prometer resultados.
 * - El lede no repite el título: agrega contexto.
 * - `notice` solo se usa para decir la verdad sobre el propio sitio (un texto
 *   que quedó pendiente, un video que no se conservó).
 */
import type { WhatsAppMessageKey } from "./contact";

export type PageVariant =
  | "documentos"
  | "preguntas"
  | "metodo"
  | "testimonios"
  | "entrevistas"
  | "colaboradores"
  | "ninguno";

export type PageTreatment = {
  /** Nombre de la sección, para la miga de pan. */
  sectionLabel: string;
  /** Entrada visible debajo del título. */
  lede: string;
  /** Descripción para buscadores y redes. */
  description: string;
  /** Clase de variante que ajusta el texto corrido en `src/styles/global.css`. */
  variant: PageVariant;
  cta: { title: string; body: string; message: WhatsAppMessageKey };
  notice?: { title: string; body: string };
  /** Muestra el retrato del director en la portada de la página. */
  portrait?: boolean;
};

export const pageMeta: Record<string, PageTreatment> = {
  "par-biomagnetico": {
    sectionLabel: "El método",
    lede: "El método del Dr. Isaac Goiz Durán en sus propios términos: el par, el pH y los conceptos en que se sustenta.",
    description:
      "Qué es el par biomagnético: dos cargas de polaridad opuesta, la alteración del pH y los conceptos que sostienen el método del Dr. Isaac Goiz Durán.",
    variant: "metodo",
    cta: {
      title: "¿Te quedó una duda sobre el método?",
      body: "Escribinos por WhatsApp y te respondemos en horario de atención.",
      message: "metodo",
    },
  },
  "francisco-mena": {
    sectionLabel: "El centro",
    lede: "Títulos, obras, cursos y reconocimientos del director, tal como los publicó el propio centro.",
    description:
      "Trayectoria del Dr. HC Francisco Mena Flores: doctorados honoris causa, obras publicadas, cursos, representaciones y reconocimientos.",
    variant: "documentos",
    portrait: true,
    cta: {
      title: "¿Necesita consultar por una cita?",
      body: "La atención es con cita previa, en Quito.",
      message: "doctor",
    },
  },
  servicios: {
    sectionLabel: "El método",
    lede: "Las terapias que ofrece el centro, presenciales y a distancia.",
    description:
      "Terapias del Centro de Biomagnetismo Médico: atención presencial, atención a distancia y constelaciones familiares.",
    variant: "ninguno",
    cta: {
      title: "¿Necesita coordinar una terapia?",
      body: "Escribinos por WhatsApp y coordinamos día y horario.",
      message: "servicio",
    },
    notice: {
      title: "El texto de esta página quedó pendiente en el sitio original",
      body: "La descripción de cada terapia está escrita con texto de relleno (lorem ipsum) desde el sitio anterior. Se conserva sin reescribir hasta que el centro defina el texto definitivo de cada servicio.",
    },
  },
  preguntas: {
    sectionLabel: "El método",
    lede: "Las respuestas que el centro publica a las preguntas más frecuentes sobre biomagnetismo.",
    description:
      "Preguntas frecuentes sobre biomagnetismo médico: qué es, qué es el pH, en qué consiste el tratamiento y si tiene riesgos.",
    variant: "preguntas",
    cta: {
      title: "¿Tenés otra pregunta?",
      body: "Las que no están acá las respondemos por WhatsApp, en horario de atención.",
      message: "metodo",
    },
  },
  testimonios: {
    sectionLabel: "Pruebas y archivo",
    lede: "Relatos publicados por el centro. Se conservan tal como estaban escritos.",
    description:
      "Testimonios de pacientes y de personas capacitadas en biomagnetismo, publicados por el Centro de Biomagnetismo Médico.",
    variant: "testimonios",
    cta: {
      title: "¿Desea compartir su experiencia?",
      body: "Escribinos por WhatsApp y coordinamos la publicación.",
      message: "testimonio",
    },
    notice: {
      title: "Los videos no se conservaron",
      body: "Esta página tenía videos con los testimonios. En la migración se conservaron los textos y no los videos; los relatos se mantienen tal como estaban publicados.",
    },
  },
  entrevistas: {
    sectionLabel: "Pruebas y archivo",
    lede: "Apariciones del Dr. HC Francisco Mena en televisión, radio, universidades y congresos.",
    description:
      "Entrevistas y apariciones del Dr. HC Francisco Mena en medios de Chile, Bolivia y en congresos de biomagnetismo médico.",
    variant: "entrevistas",
    cta: {
      title: "¿Necesitás una entrevista o una actividad?",
      body: "Escribinos por WhatsApp con el medio o la institución y el tema.",
      message: "entrevista",
    },
  },
  colaboradores: {
    sectionLabel: "El centro",
    lede: "Quiénes acompañan al director en el centro, con sus datos de contacto publicados.",
    description:
      "Colaboradores y terapeutas del Centro de Biomagnetismo Médico en Ecuador, Chile, Estados Unidos y Alemania.",
    variant: "colaboradores",
    cta: {
      title: "¿Desea contactar a un colaborador?",
      body: "Escribinos por WhatsApp y te orientamos hacia la persona o la sede que necesitás.",
      message: "colaboradores",
    },
  },
};
