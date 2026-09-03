/**
 * El paso a paso de cada caso, como datos y no como imagen.
 *
 * Antes esto vivía en un PNG y en dos SVG dentro del carrusel. Tres problemas:
 * el texto no se podía leer con lector de pantalla ni traducir, una imagen que
 * no carga deja el argumento en blanco, y obligaba a pasar láminas para ver
 * algo que cabe entero en pantalla. Aquí se dibuja con DOM: pesa nada, no se
 * puede romper y se lee igual en los dos idiomas.
 */

export interface Fila {
  /** Etiqueta de la fila; vacía cuando el caso tiene un solo recorrido. */
  readonly etiqueta?: string;
  readonly tono: 'clarity' | 'mind' | 'feel';
  readonly pasos: readonly { readonly t: string; readonly d: string }[];
}

export interface Pasos {
  readonly titulo: string;
  readonly filas: readonly Fila[];
  readonly nota: string;
}

export const PASOS: Record<string, { es: Pasos; en: Pasos }> = {
  ropofy: {
    es: {
      titulo: 'El recorrido de una consulta, antes y después',
      filas: [
        {
          etiqueta: 'Antes',
          tono: 'feel',
          pasos: [
            { t: 'Tres entradas', d: 'WhatsApp, el formulario de la web e Instagram, cada uno por su lado.' },
            { t: 'Ningún dueño', d: 'Nadie sabía cuál consulta ya se había respondido.' },
            { t: 'Sin tiempo acordado', d: 'Responder el martes lo que entró el viernes no rompía ninguna regla.' },
          ],
        },
        {
          etiqueta: 'Después',
          tono: 'clarity',
          pasos: [
            { t: 'Una bandeja', d: 'Los tres canales caen en el mismo sitio.' },
            { t: 'Dueño y estado', d: 'Cada consulta tiene responsable y se ve si ya se atendió.' },
            { t: 'Primera respuesta medida', d: 'La métrica se acordó antes de rediseñar nada.' },
          ],
        },
      ],
      nota: 'Deja de importar por dónde entró la consulta. Importa si ya se respondió.',
    },
    en: {
      titulo: 'The journey of an enquiry, before and after',
      filas: [
        {
          etiqueta: 'Before',
          tono: 'feel',
          pasos: [
            { t: 'Three inlets', d: 'WhatsApp, the web form and Instagram, each on its own.' },
            { t: 'No owner', d: 'Nobody knew which enquiry had already been answered.' },
            { t: 'No agreed time', d: 'Replying on Tuesday to a Friday message broke no rule.' },
          ],
        },
        {
          etiqueta: 'After',
          tono: 'clarity',
          pasos: [
            { t: 'One inbox', d: 'All three channels land in the same place.' },
            { t: 'Owner and status', d: 'Every enquiry has someone responsible and a visible state.' },
            { t: 'First response measured', d: 'The metric was agreed before redesigning anything.' },
          ],
        },
      ],
      nota: 'It stops mattering where the enquiry came in. It matters whether it was answered.',
    },
  },

  qstrauss: {
    es: {
      titulo: 'El ciclo que se rompió',
      filas: [
        {
          etiqueta: 'Antes',
          tono: 'feel',
          pasos: [
            { t: 'Implementación', d: 'La plataforma queda configurada y entregada.' },
            { t: 'Dudas', d: 'Semanas después, las mismas preguntas del mismo equipo.' },
            { t: 'Sesión en vivo', d: 'Se explica otra vez, en una llamada que no queda escrita.' },
            { t: 'Dependencia', d: 'Y el ciclo vuelve a empezar dentro del mismo cliente.' },
          ],
        },
        {
          etiqueta: 'Después',
          tono: 'clarity',
          pasos: [
            { t: 'Implementación', d: 'Igual que antes: configurada y entregada.' },
            { t: 'Material', d: 'La documentación se produce una vez, con la instancia real delante.' },
            { t: 'El equipo resuelve solo', d: 'La respuesta ya está escrita cuando aparece la duda.' },
            { t: 'Autonomía', d: 'Menos horas de aclaración, y el ciclo no se repite.' },
          ],
        },
      ],
      nota: 'El trabajo dejó de medirse en sesiones dictadas y pasó a medirse en cuánto podía avanzar el cliente sin nosotros.',
    },
    en: {
      titulo: 'The cycle that broke',
      filas: [
        {
          etiqueta: 'Before',
          tono: 'feel',
          pasos: [
            { t: 'Rollout', d: 'The platform is configured and handed over.' },
            { t: 'Questions', d: 'Weeks later, the same questions from the same team.' },
            { t: 'Live session', d: 'It gets explained again, on a call that leaves no record.' },
            { t: 'Dependency', d: 'And the cycle starts over inside the same client.' },
          ],
        },
        {
          etiqueta: 'After',
          tono: 'clarity',
          pasos: [
            { t: 'Rollout', d: 'Same as before: configured and handed over.' },
            { t: 'Material', d: 'Documentation is produced once, with the real instance in front of you.' },
            { t: 'The team sorts it out', d: 'The answer is already written when the question appears.' },
            { t: 'Autonomy', d: 'Fewer clarification hours, and the cycle does not repeat.' },
          ],
        },
      ],
      nota: 'The work stopped being measured in sessions delivered and started being measured in how far the client could get without us.',
    },
  },

  bid: {
    es: {
      titulo: 'Del documento publicado a la decisión',
      filas: [
        {
          tono: 'mind',
          pasos: [
            { t: 'Documentos', d: 'Los de la licitación, tal como se publican.' },
            { t: 'Digitalización', d: 'Power BI e inteligencia artificial los vuelven datos comparables.' },
            { t: 'Comparación', d: 'Lo solicitado contra lo ofertado, línea por línea.' },
            { t: 'Inconsistencia', d: 'Precio que no cuadra, dato faltante o producto que no corresponde.' },
            { t: 'Decisión', d: 'La herramienta señala; la firma sigue siendo humana.' },
          ],
        },
      ],
      nota: 'Lo que cambia el trabajo es el cuarto paso: encontrar la inconsistencia era leer los documentos completos, uno por uno.',
    },
    en: {
      titulo: 'From published document to decision',
      filas: [
        {
          tono: 'mind',
          pasos: [
            { t: 'Documents', d: 'The tender ones, exactly as published.' },
            { t: 'Digitisation', d: 'Power BI and AI turn them into comparable data.' },
            { t: 'Comparison', d: 'What was requested against what was offered, line by line.' },
            { t: 'Inconsistency', d: 'A price that does not match, a missing field, a product that is not the one asked for.' },
            { t: 'Decision', d: 'The tool points; the signature stays human.' },
          ],
        },
      ],
      nota: 'The fourth step is what changes the work: finding the inconsistency used to mean reading whole documents, one by one.',
    },
  },
};
