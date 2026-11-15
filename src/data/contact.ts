/**
 * Datos de contacto reales del centro. Una sola fuente para el pie, la página
 * de contacto y los botones de WhatsApp.
 *
 * Lo usan: `src/components/WhatsAppAction.astro`, `ContactDetails.astro`,
 * `src/layouts/BaseLayout.astro` (pie), `src/pages/contactos.astro`.
 *
 * Si cambia un teléfono, un correo o el horario, se cambia ACÁ y se actualiza
 * solo en todo el sitio. No inventar canales: todo lo que no esté verificado
 * en este archivo no debe aparecer publicado.
 */
import { mediaImage } from "./gallery-media";

export type WhatsAppChannel = {
  /** Cómo se muestra el número. */
  label: string;
  /** Número en formato internacional sin signos, para el enlace wa.me. */
  e164: string;
  /** De dónde es y para qué sirve. */
  role: string;
};

export const contact = {
  centre: "Centro de Biomagnetismo Médico",
  address: {
    street: "Pineda N11-121 y Guatemala",
    city: "Quito",
    country: "Ecuador",
    get mapsUrl() {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        "Pineda N11-121 y Guatemala, Quito, Ecuador",
      )}`;
    },
  },
  hours: [
    { days: "Lunes a viernes", times: "09H30 a 13H30 · 14H30 a 18H00" },
    { days: "Sábados", times: "09H30 a 13H00" },
  ],
  /** Condición real de la atención, no un eslogan. */
  visitNote: "Atención con cita previa",
  emails: ["centrodrgoiz@gmail.com", "mena.francisco2014@gmail.com"],
  whatsapps: [
    {
      label: "+593 99 883 9196",
      e164: "593998839196",
      role: "Ecuador · canal principal",
    },
    {
      label: "+56 9 7477 7455",
      e164: "56974777455",
      role: "Chile",
    },
    {
      label: "+56 9 8295 7690",
      e164: "56982957690",
      role: "Chile",
    },
  ] satisfies WhatsAppChannel[],
} as const;

/** El canal que se usa para todos los botones principales. */
export const primaryWhatsApp = contact.whatsapps[0];

/**
 * Mensajes precargados. El texto dice de dónde viene la persona, así quien
 * responde sabe qué está leyendo antes de contestar.
 */
export const whatsappMessages = {
  cita: "Hola, escribo desde el sitio web del Centro de Biomagnetismo Médico. Quisiera pedir una cita.",
  consulta:
    "Hola, escribo desde el sitio web del Centro de Biomagnetismo Médico. Tengo una consulta sobre la atención.",
  metodo:
    "Hola, escribo desde el sitio web del Centro de Biomagnetismo Médico. Tengo una pregunta sobre el método del par biomagnético.",
  doctor:
    "Hola, escribo desde el sitio web del Centro de Biomagnetismo Médico. Quisiera saber más sobre la trayectoria del Dr. Francisco Mena.",
  testimonio:
    "Hola, escribo desde el sitio web del Centro de Biomagnetismo Médico. Quisiera contar mi experiencia.",
  entrevista:
    "Hola, escribo desde el sitio web del Centro de Biomagnetismo Médico. Quisiera consultar por una entrevista o una actividad de difusión.",
  colaboradores:
    "Hola, escribo desde el sitio web del Centro de Biomagnetismo Médico. Quisiera contactar a un colaborador del centro.",
  servicio:
    "Hola, escribo desde el sitio web del Centro de Biomagnetismo Médico. Quisiera consultar por una terapia.",
} as const;

export type WhatsAppMessageKey = keyof typeof whatsappMessages;

/** Enlace wa.me con el mensaje ya escrito. */
export function whatsappUrl(
  channel: WhatsAppChannel = primaryWhatsApp,
  message: string = whatsappMessages.consulta,
): string {
  return `https://wa.me/${channel.e164}?text=${encodeURIComponent(message)}`;
}

/**
 * Destino del formulario de contacto (Formspree).
 *
 * Vacío = **el formulario no se publica**. Mientras esté vacío, `/contactos/`
 * muestra solo WhatsApp y correo, más el aviso de que el formulario está
 * pendiente. Un formulario sin destino que reciba los mensajes no se publica:
 * descartarlos en silencio es peor que no tener formulario.
 *
 * Para activarlo, pegar acá la URL del endpoint, exactamente con esta forma:
 *
 *   "https://formspree.io/f/<id>"
 *
 * El `<id>` lo da Formspree al crear el formulario. Después, reconstruir el
 * sitio (`pnpm build` o `pnpm serve`). No inventar un endpoint: si no existe el
 * formulario en Formspree, el valor queda en `""`.
 */
export const formEndpoint = "";

/**
 * Derivado de `formEndpoint`: hay formulario solo cuando hay un endpoint
 * cargado. Lo usan `ContactForm.astro` (para no renderizarse) y
 * `src/pages/contactos.astro` (para no mostrar el aviso de "formulario
 * pendiente" cuando ya hay uno).
 */
export const contactFormEnabled = formEndpoint.trim().length > 0;

/**
 * Retrato del director. Lo usan la portada, la placa de credenciales y la
 * imagen de Open Graph del layout.
 */
export const directorPortrait = mediaImage(
  "/src/assets/media/2020/09/FotoFranciscoMena.webp",
);
