import type { Lang } from './ui';

/**
 * "Cómo uso la IA": dónde la IA aceleró el trabajo y qué decidí yo.
 * Solo hechos confirmados por Emilio; nada de métricas inventadas.
 */
export type UsoIa = {
  key: string;
  donde: string;
  herramientas: string;
  ia: string;
  yo: string;
};

export const IA_UI: Record<
  Lang,
  { kicker: string; titulo: string; sub: string; laIa: string; yoDecidi: string; principio: string }
> = {
  es: {
    kicker: 'IA aplicada al trabajo',
    titulo: 'Cómo uso la IA',
    sub: 'La uso para avanzar más rápido en lo repetitivo y en lo que se puede automatizar. Las decisiones y la validación con personas siguen siendo mías.',
    laIa: 'Lo que hizo la IA',
    yoDecidi: 'Lo que hice yo',
    principio: 'La IA acelera; lo que se publica lo decido y lo verifico yo.',
  },
  en: {
    kicker: 'AI applied to the work',
    titulo: 'How I use AI',
    sub: 'I use it to move faster on repetitive work and on what can be automated. Decisions and validation with people are still mine.',
    laIa: 'What AI did',
    yoDecidi: 'What I did',
    principio: 'AI speeds things up; what gets published, I decide and verify.',
  },
};

export const USOS_IA: Record<Lang, readonly UsoIa[]> = {
  es: [
    {
      key: 'portafolio',
      donde: 'Este portafolio',
      herramientas: 'Claude Design · Claude Code',
      ia: 'Pasó el diseño a código: construyó el sitio en Astro, las interacciones de cada caso y las pruebas en escritorio y celular.',
      yo: 'Definí la estructura, qué contar en cada caso y qué no publicar por confidencialidad, y revisé cada texto para que no dijera nada que no hice.',
    },
    {
      key: 'documentacion',
      donde: 'Investigación y documentación',
      herramientas: 'Claude · NotebookLM · Gemini',
      ia: 'Organiza notas, resume documentos largos y arma primeros borradores de documentación y análisis.',
      yo: 'Valido con el equipo y con los usuarios. La IA no reemplaza la entrevista ni la prueba.',
    },
    {
      key: 'ropofy',
      donde: 'Ropofy · producto con IA',
      herramientas: 'Flujos de automatización y bots de IA de la plataforma',
      ia: 'La plataforma ofrecía flujos de automatización y bots de IA que los clientes configuraban para su proceso de ventas.',
      yo: 'Probé esos flujos con usuarios y A/B testing, revisé los bugs con desarrollo, capacité a los clientes y descarté un chatbot donde el problema era de organización, no de volumen.',
    },
    {
      key: 'bid',
      donde: 'TechSprint BID · datos públicos',
      herramientas: 'Power BI con IA',
      ia: 'Leía los documentos de licitación y los convertía en datos comparables, para que la herramienta señalara lo que no cuadraba.',
      yo: 'Definí el usuario y el problema. La herramienta detectó inconsistencias en 311 de 622 contratos.',
    },
    {
      key: 'cybernexo',
      donde: 'Cybernexo · exploración visual',
      herramientas: 'IA generativa de imágenes',
      ia: 'Generó bocetos de personajes y un montaje preliminar de los escenarios.',
      yo: 'Diseñé la historia y los personajes, y un diseñador 3D modeló la versión final.',
    },
  ],
  en: [
    {
      key: 'portafolio',
      donde: 'This portfolio',
      herramientas: 'Claude Design · Claude Code',
      ia: 'Turned the design into code: built the site in Astro, each case’s interactions and the desktop and mobile checks.',
      yo: 'I defined the structure, what to tell in each case and what not to publish for confidentiality, and reviewed every text so it says nothing I didn’t do.',
    },
    {
      key: 'documentacion',
      donde: 'Research and documentation',
      herramientas: 'Claude · NotebookLM · Gemini',
      ia: 'Organizes notes, summarizes long documents and drafts first versions of documentation and analysis.',
      yo: 'I validate with the team and with users. AI doesn’t replace the interview or the test.',
    },
    {
      key: 'ropofy',
      donde: 'Ropofy · an AI product',
      herramientas: 'The platform’s automation flows and AI bots',
      ia: 'The platform offered automation flows and AI bots that clients set up for their sales process.',
      yo: 'I tested those flows with users and A/B testing, reviewed bugs with development, trained clients, and discarded a chatbot where the problem was organizational, not volume.',
    },
    {
      key: 'bid',
      donde: 'IDB TechSprint · public data',
      herramientas: 'Power BI with AI',
      ia: 'Read the tender documents and turned them into comparable data, so the tool could flag what didn’t match.',
      yo: 'I defined the user and the problem. The tool flagged inconsistencies in 311 of 622 contracts.',
    },
    {
      key: 'cybernexo',
      donde: 'Cybernexo · visual exploration',
      herramientas: 'Generative image AI',
      ia: 'Generated character sketches and a rough layout of the scenes.',
      yo: 'I designed the story and the characters, and a 3D designer modelled the final version.',
    },
  ],
};
