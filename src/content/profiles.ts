/**
 * Perfiles del portafolio.
 *
 * Un solo sitio y dos maneras de presentarlo: `ba` (UX Strategist & Business
 * Analyst) vive en la raíz y `ux` (UX Consultant) bajo /ux/. Aquí va SOLO lo
 * que cambia entre perfiles —posicionamiento, énfasis y la hoja de vida que se
 * descarga—. Los casos, el diseño y todo texto compartido existen una sola vez,
 * en su archivo de siempre.
 *
 * Los datos con estructura (títulos de la trayectoria, rol en los chips de un
 * caso, formación) no se copian: el perfil declara solo la diferencia y lo
 * demás se lee de about.ts y cases.ts.
 *
 * Cada perfil se genera como páginas estáticas propias, no se pinta con JS: las
 * vistas previas de LinkedIn o WhatsApp no ejecutan scripts, así que el título
 * y la og de /ux/ tienen que estar ya escritos en el HTML.
 */
import { HOME } from './home';
import { ROUTES, type Lang, type PageKey } from './ui';
import type { CaseKey } from './cases';
import type { JobId } from './about';

export type Profile = 'ba' | 'ux';

/** Carpeta de cada perfil, sin el prefijo de despliegue. */
const PREFIX: Record<Profile, string> = { ba: '', ux: '/ux' };

/**
 * Rutas de un perfil en un idioma. Todo enlace interno sale de aquí, así que
 * una página de /ux/ no puede enlazar por accidente a la versión BA.
 */
export const rutas = (profile: Profile, lang: Lang): Record<PageKey, string> => {
  const r = ROUTES[lang];
  const p = PREFIX[profile];
  return { home: p + r.home, cases: p + r.cases, about: p + r.about };
};

interface SkillGroup {
  label: string;
  items: readonly string[];
}

interface Education {
  what: string;
  where: string;
}

interface ProfileText {
  /** `<title>` de la home. */
  homeTitle: string;
  /** Línea de posicionamiento sobre el titular del hero. */
  heroKicker: string;
  /** meta description y og:description de la home. */
  homeDescription: string;
  /** Chips del resumen "Sobre mí" en la home. */
  homeSkills: readonly string[];
  /** Línea de rol bajo el nombre, en Sobre mí. */
  aboutRole: string;
  /** Párrafo de entrada de Sobre mí. */
  aboutHook: string;
  /** meta description de Sobre mí; si falta, se usa el párrafo de entrada. */
  aboutDescription?: string;
  /** Chips de la cabecera de Sobre mí. */
  aboutChips: readonly string[];
  /** Taxonomía de habilidades de Sobre mí, en el orden de la hoja de vida. */
  aboutSkills: readonly SkillGroup[];
  /** Títulos de la trayectoria que cambian respecto de about.ts. */
  jobTitles?: Partial<Record<JobId, string>>;
  /** Rol del chip de un caso, si cambia respecto de cases.ts. */
  caseRoles?: Partial<Record<CaseKey, string>>;
  /** Formación, si cambia respecto de about.ts. */
  education?: readonly Education[];
}

interface ProfileDef {
  /** Imagen de vista previa al compartir el enlace. */
  ogImage: string;
  /** `/ux/` no debe competir con la versión principal en buscadores. */
  noindex: boolean;
  /**
   * Hojas de vida en PDF, en `public/uploads/`. Si alguna se pone en `null` su
   * enlace desaparece del contacto, en vez de quedar como un enlace muerto.
   */
  cv: { es: string | null; en: string | null };
  es: ProfileText;
  en: ProfileText;
}

export const PROFILES: Record<Profile, ProfileDef> = {
  /* ── UX Strategist & Business Analyst · raíz ── */
  ba: {
    ogImage: '/og.jpg',
    noindex: false,
    cv: {
      es: '/uploads/cv-emilio-romero-es.pdf',
      en: '/uploads/cv-emilio-romero-en.pdf',
    },
    es: {
      homeTitle: 'Emilio Romero — UX Strategist & Business Analyst en Bogotá',
      /* Encima del titular: quien llega desde LinkedIn tiene que saber qué eres
         antes de leer la frase. Va en el estilo discreto del kicker para no
         competir con ella. */
      heroKicker: 'UX Strategist & Business Analyst · Research aplicado a decisiones de negocio — Bogotá · Remoto global',
      homeDescription: HOME.es.heroSub,
      homeSkills: [
        'Análisis de negocio',
        'Levantamiento de requerimientos',
        'Mapeo de procesos',
        'Gestión de stakeholders',
        'Definición de KPIs',
        'Priorización',
        'UX research',
        'Entrevistas y síntesis',
        'Journey maps',
        'Usability testing',
        'Estrategia de producto',
        'Figma',
        'Power BI',
        'Adobe Workfront',
      ],
      aboutRole: 'UX Strategist & Business Analyst · Research aplicado a decisiones de negocio',
      aboutHook: 'Investigo para entender el negocio y a su gente, y diseño el sistema que resuelve lo que encuentro. No creo que una cosa se pueda hacer bien sin la otra.',
      aboutChips: ['Análisis de negocio', 'Levantamiento de requerimientos', 'Mapeo de procesos', 'Definición de KPIs', 'Gestión de stakeholders', 'UX Research', 'Bogotá · Remoto', 'Inglés C1'],
      aboutSkills: [
        {
          label: 'Análisis de negocio',
          items: ['Levantamiento de requerimientos', 'Mapeo y rediseño de procesos', 'Casos de uso', 'Gestión de stakeholders', 'Definición de KPIs y métricas', 'Priorización (impacto vs esfuerzo)', 'Diseño de modelos operativos'],
        },
        {
          label: 'Estrategia de experiencia',
          items: ['UX research', 'Entrevistas y síntesis de hallazgos', 'Journey y service blueprints', 'Pruebas de usabilidad', 'Arquitectura de información', 'Diseño UX/UI', 'Prototipado', 'Estrategia de producto', 'Design systems', 'Accesibilidad (WCAG)', 'Storytelling y gamificación'],
        },
        {
          label: 'Entrega',
          items: ['Documentación funcional', 'Documentación como producto', 'Consultoría de implementación', 'Análisis de riesgos', 'Capacitación y habilitación', 'Metodologías ágiles'],
        },
        {
          label: 'Herramientas',
          items: ['Figma', 'Webflow', 'Adobe Workfront', 'Adobe Creative Suite', 'Power BI', 'HubSpot', 'HTML / CSS / JS', 'Confluence / Jira', 'Google Workspace', 'Microsoft 365', 'Claude, Gemini, NotebookLM'],
        },
      ],
    },
    en: {
      homeTitle: 'Emilio Romero — UX Strategist & Business Analyst in Bogotá',
      heroKicker: 'UX Strategist & Business Analyst · Research applied to business decisions — Bogotá · Remote worldwide',
      homeDescription: HOME.en.heroSub,
      homeSkills: [
        'Business analysis',
        'Requirements gathering',
        'Process mapping',
        'Stakeholder management',
        'KPI definition',
        'Prioritization',
        'UX research',
        'Interviews and synthesis',
        'Journey maps',
        'Usability testing',
        'Product strategy',
        'Figma',
        'Power BI',
        'Adobe Workfront',
      ],
      aboutRole: 'UX Strategist & Business Analyst · Research applied to business decisions',
      aboutHook: 'I research to understand the business and the people in it, and I design the system that solves what I find. I don’t think either half can be done well without the other.',
      aboutChips: ['Business analysis', 'Requirements gathering', 'Process mapping', 'KPI definition', 'Stakeholder management', 'UX research', 'Bogotá · Remote', 'English C1'],
      aboutSkills: [
        {
          label: 'Business analysis',
          items: ['Requirements gathering', 'Process mapping and redesign', 'Use cases', 'Stakeholder management', 'KPI and metric definition', 'Prioritization (impact vs effort)', 'Operating model design'],
        },
        {
          label: 'Experience strategy',
          items: ['UX research', 'Interviews and synthesis', 'Journey and service blueprints', 'Usability testing', 'Information architecture', 'UX/UI design', 'Prototyping', 'Product strategy', 'Design systems', 'Accessibility (WCAG)', 'Storytelling and gamification'],
        },
        {
          label: 'Delivery',
          items: ['Functional documentation', 'Documentation as a product', 'Implementation consulting', 'Risk analysis', 'Training and enablement', 'Agile methodologies'],
        },
        {
          label: 'Tools',
          items: ['Figma', 'Webflow', 'Adobe Workfront', 'Adobe Creative Suite', 'Power BI', 'HubSpot', 'HTML / CSS / JS', 'Confluence / Jira', 'Google Workspace', 'Microsoft 365', 'Claude, Gemini, NotebookLM'],
        },
      ],
    },
  },

  /* ── UX Consultant · /ux/ ── Textos de la hoja de vida de UX (HV/CV UX). */
  ux: {
    ogImage: '/og-ux.jpg',
    noindex: true,
    cv: {
      es: '/uploads/cv-emilio-romero-ux-es.pdf',
      en: '/uploads/cv-emilio-romero-ux-en.pdf',
    },
    es: {
      homeTitle: 'Emilio Romero — UX Consultant en Bogotá',
      heroKicker:
        'UX Consultant · Research y diseño de experiencia para plataformas y operaciones internas — Bogotá · Remoto global',
      homeDescription:
        'Consultor UX con formación en Diseño Interactivo y experiencia en plataformas internas, SaaS B2B y herramientas enterprise.',
      homeSkills: [
        'UX research',
        'Entrevistas y síntesis',
        'Pruebas de usabilidad',
        'Journey maps',
        'Service blueprints',
        'Arquitectura de información',
        'Diseño UX/UI',
        'Prototipado',
        'Design systems',
        'Accesibilidad (WCAG)',
        'Mapeo de procesos',
        'Gestión de stakeholders',
        'Figma',
        'Webflow',
        'Power BI',
        'Adobe Workfront',
      ],
      aboutRole: 'UX Consultant · Research y diseño de experiencia para plataformas y operaciones internas',
      aboutHook:
        'Consultor UX con formación en Diseño Interactivo y experiencia en plataformas internas, SaaS B2B y herramientas enterprise. Investigo antes de diseñar: entrevisto a los usuarios, reviso cómo trabajan de verdad y encuentro dónde se rompe la experiencia; después diseño los flujos, las interfaces y la documentación que lo resuelven. Para mí una emoción es un dato de negocio: cuando alguien se cansa, no entiende o prefiere llamar, ahí suele estar el problema, y también la oportunidad.',
      aboutDescription:
        'Consultor UX con formación en Diseño Interactivo y experiencia en plataformas internas, SaaS B2B y herramientas enterprise.',
      aboutChips: ['UX research', 'Entrevistas y síntesis', 'Pruebas de usabilidad', 'Journey maps', 'Service blueprints', 'Arquitectura de información', 'Bogotá · Remoto', 'Inglés C1'],
      aboutSkills: [
        {
          label: 'Investigación',
          items: ['UX research', 'Entrevistas y síntesis', 'Pruebas de usabilidad', 'Journey maps', 'Service blueprints', 'Arquitectura de información'],
        },
        {
          label: 'Diseño',
          items: ['Diseño UX/UI', 'Wireframing y prototipado', 'Design systems', 'Accesibilidad (WCAG)', 'Gamificación', 'Storytelling'],
        },
        {
          label: 'Consultoría',
          items: ['Mapeo de procesos', 'Levantamiento de requerimientos', 'Gestión de stakeholders', 'Estrategia de adopción y capacitación'],
        },
        {
          label: 'Herramientas',
          items: ['Figma', 'Webflow', 'Adobe Workfront', 'Power BI', 'HubSpot', 'HTML / CSS / JS', 'Adobe Creative Suite', 'Confluence / Jira', 'Google Workspace', 'Microsoft 365', 'Claude, Gemini, NotebookLM'],
        },
      ],
      jobTitles: { qstrauss: 'Technical Architect', ropofy: 'Consultor UX / Diseñador UX', etb: 'Practicante UX/UI' },
      caseRoles: { ropofy: 'Consultor UX / Diseñador UX', qstrauss: 'Technical Architect' },
      education: [
        { what: 'Diseñador Interactivo, énfasis en UX/UI y Game Design', where: 'Universidad Jorge Tadeo Lozano · 2020 – 2024' },
        { what: 'Concept artist y copywriter', where: 'Grupo de investigación NTS, UJTL · 2020 – 2023' },
        { what: 'Bootcamp Front End UX', where: 'Cymetria · 2024' },
        { what: 'Bachillerato', where: 'Gimnasio Moderno · Bogotá' },
      ],
    },
    en: {
      homeTitle: 'Emilio Romero — UX Consultant in Bogotá',
      heroKicker:
        'UX Consultant · Research and experience design for platforms and internal operations — Bogotá · Remote worldwide',
      homeDescription:
        'UX consultant with a background in Interactive Design and experience across internal platforms, B2B SaaS and enterprise tools.',
      homeSkills: [
        'UX research',
        'Interviews & synthesis',
        'Usability testing',
        'Journey maps',
        'Service blueprints',
        'Information architecture',
        'UX/UI design',
        'Prototyping',
        'Design systems',
        'Accessibility (WCAG)',
        'Process mapping',
        'Stakeholder management',
        'Figma',
        'Webflow',
        'Power BI',
        'Adobe Workfront',
      ],
      aboutRole: 'UX Consultant · Research and experience design for platforms and internal operations',
      aboutHook:
        "UX consultant with a background in Interactive Design and experience across internal platforms, B2B SaaS and enterprise tools. I research before I design: I interview users, look at how they actually work and find where the experience breaks; then I design the workflows, interfaces and documentation that fix it. To me an emotion is a business signal: when someone gets tired, doesn't understand, or would rather call, that's usually where the problem is, and the opportunity too.",
      aboutDescription:
        'UX consultant with a background in Interactive Design and experience across internal platforms, B2B SaaS and enterprise tools.',
      aboutChips: ['UX research', 'Interviews & synthesis', 'Usability testing', 'Journey maps', 'Service blueprints', 'Information architecture', 'Bogotá · Remote', 'English C1'],
      aboutSkills: [
        {
          label: 'Research',
          items: ['UX research', 'Interviews and synthesis', 'Usability testing', 'Journey maps', 'Service blueprints', 'Information architecture'],
        },
        {
          label: 'Design',
          items: ['UX/UI design', 'Wireframing and prototyping', 'Design systems', 'Accessibility (WCAG)', 'Gamification', 'Storytelling'],
        },
        {
          label: 'Consulting',
          items: ['Process mapping', 'Requirements gathering', 'Stakeholder management', 'Adoption and training strategy'],
        },
        {
          label: 'Tools',
          items: ['Figma', 'Webflow', 'Adobe Workfront', 'Power BI', 'HubSpot', 'HTML / CSS / JS', 'Adobe Creative Suite', 'Confluence / Jira', 'Google Workspace', 'Microsoft 365', 'Claude, Gemini, NotebookLM'],
        },
      ],
      jobTitles: { qstrauss: 'Technical Architect', ropofy: 'UX Consultant / UX Designer', etb: 'UX/UI Design Intern' },
      caseRoles: { ropofy: 'UX Consultant / UX Designer', qstrauss: 'Technical Architect' },
      education: [
        { what: 'Interactive Designer, UX/UI and Game Design emphasis', where: 'Universidad Jorge Tadeo Lozano · 2020 – 2024' },
        { what: 'Concept artist and copywriter', where: 'NTS research group, UJTL · 2020 – 2023' },
        { what: 'Front End UX Bootcamp', where: 'Cymetria · 2024' },
        { what: 'High School Diploma', where: 'Gimnasio Moderno · Bogotá' },
      ],
    },
  },
};

/** Todo lo que un componente necesita saber de su perfil, en un idioma. */
export const perfil = (profile: Profile, lang: Lang) => ({
  ...PROFILES[profile][lang],
  ogImage: PROFILES[profile].ogImage,
  noindex: PROFILES[profile].noindex,
  cv: PROFILES[profile].cv,
  rutas: rutas(profile, lang),
});

/** Los chips de un caso con el rol del perfil en su lugar (el segundo chip). */
export function chipsConRol(
  chips: ReadonlyArray<readonly [string, string]>,
  rol?: string
): ReadonlyArray<readonly [string, string]> {
  return rol ? chips.map((c, i) => (i === 1 ? ([rol, c[1]] as const) : c)) : chips;
}
