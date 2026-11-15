# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pacientes que buscan terapia de biomagnetismo y necesitan decidir, con confianza, si el
tratamiento es serio y cómo contactar. Llegan por búsqueda orgánica o recomendación, y en
buena parte desde Ecuador y el resto de Latinoamérica. El sitio les habla primero a ellos.

Audiencia secundaria: personas que llegan buscando la formación histórica del método. El
sitio la trata como archivo fotográfico, no como oferta.

## Product Purpose

Presentar el Centro de Biomagnetismo Médico, a su director Francisco Mena Flores y al método
del par biomagnético, y llevar al paciente a iniciar contacto por WhatsApp. El éxito es que
una persona entienda qué es el método y escriba.

## Positioning

El par biomagnético: un sistema terapéutico con autor y fecha verificables — descubierto por
el Dr. Isaac Goiz Durán el 10 de octubre de 1988 — y un director acreditado Doctor Honoris
Causa en Ciencias de la Salud. Un centro genérico no puede copiar ni el método ni la
credencial.

## Operating Context

Atención con cita previa en una única sede: Pineda N11-121 y Guatemala, Quito, Ecuador.
Lunes a viernes de 09:30 a 13:30 y de 14:30 a 18:00; sábados de 09:30 a 13:00.

Canales reales: WhatsApp +593 99 883 9196 (principal, Ecuador), +56 9 7477 7455 y
+56 9 8295 7690; correo centrodrgoiz@gmail.com y mena.francisco2014@gmail.com; formulario web
como vía secundaria.

## Capabilities and Constraints

Sitio estático en Astro 7 con pnpm. Secciones: institucional, el método, preguntas,
testimonios, entrevistas, colaboradores, galerías por país y contacto.

Restricción central: **el contenido es médico**. Los textos se portaron literales desde
WordPress y no se reescriben, resumen ni "mejoran" sin una decisión editorial explícita. No
se inventan claims terapéuticos, credenciales, sedes, precios ni oferta de cursos.

Los cursos existen únicamente como archivo fotográfico histórico: no hay página de cursos ni
inscripción, y no debe aparecer una.

## Brand Commitments

- Nombre: Centro de Biomagnetismo Médico, abreviado Biomagnetismo.
- Director: Francisco Mena Flores (Gustavo Francisco Mena Flores en los documentos).
- Credencial real y verificable: Doctor Honoris Causa en Ciencias de la Salud, otorgado por
  SISDET en Panamá.
- Términos que se conservan textualmente: par biomagnético, biomagnetismo médico, pH,
  Dr. Isaac Goiz Durán.
- Voz: sobria y directa. Nada de promesas de curación ni lenguaje new age.
- Dirección visual confirmada por el usuario: índigo profundo con acento cobre, construida
  sobre la metáfora del campo magnético y los pares.

## Evidence on Hand

- `src/content/pages/` — 10 páginas con el texto original de WordPress, marcadas con `wpId`.
- `src/content/galleries/` — 29 álbumes y 254 fotos reales de cursos, pacientes, entrevistas y
  reconocimientos (2019–2026).
- `src/assets/media/` — 287 imágenes optimizadas a WebP, sin metadatos EXIF.
- Testimonios reales con nombre y foto: el responsable del sitio confirma que cuentan con
  permiso para publicarse.
- Reconocimientos y diplomas disponibles como imagen (Doctor Honoris Causa).

Ausencias que no se deben rellenar: no hay precios, no hay oferta de cursos vigente, no hay
equipo médico además del director, no hay estadísticas clínicas ni resultados medidos.

## Product Principles

1. La confianza se gana con evidencia verificable —credenciales, reconocimientos, fotos
   reales— antes que con adjetivos.
2. Un objetivo por pantalla: entender el método o contactar. Nunca los dos compitiendo.
3. El contenido se hereda, no se reescribe. Cambiar un texto es una decisión editorial.
4. Contactar no puede costar más de un toque: WhatsApp siempre a un tap.
5. Mobile first: se compone para 390 px y después escala.

## Accessibility & Inclusion

Mobile first, requisito explícito del responsable. 245 de las 254 fotos de galería llevan
texto alternativo generado y marcado `altPending`: revisarlos es obligatorio antes de
publicar. El público incluye personas mayores, así que el tamaño de texto y el contraste van
por encima del mínimo legible.
