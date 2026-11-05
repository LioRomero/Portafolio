/**
 * Perfiles del portafolio.
 *
 * Un solo sitio y dos maneras de presentarlo: `ba` (UX Strategist & Business
 * Analyst) vive en la raíz y `ux` (UX Designer) bajo /ux/. Aquí va SOLO lo
 * que cambia entre perfiles —posicionamiento, énfasis y la hoja de vida que se
 * descarga—. Lo compartido (Sobre mí, la trayectoria) existe una sola vez, en
 * su archivo de siempre. La home y los casos de /ux/ tienen diseño y texto
 * propios (HOME_UX en home.ts y CASES_UX en cases.ts).
 *
 * Los datos con estructura (títulos y viñetas de la trayectoria, formación) no
 * se copian: el perfil declara solo la diferencia y lo demás se lee de about.ts.
 *
 * Cada perfil se genera como páginas estáticas propias, no se pinta con JS: las
 * vistas previas de LinkedIn o WhatsApp no ejecutan scripts, así que el título
 * y la og de /ux/ tienen que estar ya escritos en el HTML.
 */
import { HOME } from './home';
import { ROUTES, type Lang, type PageKey } from './ui';
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
  /**
   * Empresa, entrada y viñetas de la trayectoria cuando el perfil las cuenta
   * distinto (las de /ux/ salen de su propia hoja de vida). `lede: null`
   * quita la entrada en vez de heredar la de about.ts.
   */
  jobDetails?: Partial<Record<JobId, { org?: string; lede?: string | null; bullets?: readonly string[] }>>;
  /** Formación, si cambia respecto de about.ts. */
  education?: readonly Education[];
  /** Textos del contacto compartido que cambian en este perfil (el tiempo de respuesta). */
  contacto?: { sobreMiSub: string; whatsapp: string };
}

interface ProfileDef {
  /**
   * Cargo para buscadores: va en los datos estructurados (JSON-LD), no en la
   * página. En la raíz conserva "Business Analyst" sin mostrarlo.
   */
  puesto: string;
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
    puesto: 'UX Strategist & Business Analyst',
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
         competir con ella. "Business Analyst" no se muestra: vive en el
         <title> y en `puesto`, para buscadores. */
      heroKicker: 'UX Strategist · Research aplicado a decisiones de negocio — Bogotá · Remoto global',
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
      aboutRole: 'UX Strategist · Research aplicado a decisiones de negocio',
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
      heroKicker: 'UX Strategist · Research applied to business decisions — Bogotá · Remote worldwide',
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
      aboutRole: 'UX Strategist · Research applied to business decisions',
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

  /* ── UX Designer · /ux/ ── Textos de la hoja de vida de UX (noviembre 2026)
     y de la Home v3. Su home y sus casos tienen diseño propio (HOME_UX y
     CASES_UX); aquí queda lo que comparte con Sobre mí y los metadatos. */
  ux: {
    puesto: 'UX Designer',
    ogImage: '/og-ux.jpg',
    noindex: true,
    cv: {
      es: '/uploads/cv-emilio-romero-ux-es.pdf',
      en: '/uploads/cv-emilio-romero-ux-en.pdf',
    },
    es: {
      homeTitle: 'Emilio Romero — UX Designer en Bogotá',
      heroKicker: 'UX Designer · Investigación, estrategia y consultoría · Bogotá, remoto',
      homeDescription:
        'Soy Emilio. Investigo a las personas y los procesos, y lo convierto en requerimientos y decisiones de producto. Casi siempre ahí está el problema del negocio, y también la solución que la gente sí usa.',
      homeSkills: [
        'UX/UI',
        'Diseño de interacción',
        'Entrevistas y síntesis',
        'Pruebas de usabilidad',
        'Journey maps',
        'Service blueprints',
        'Levantamiento de requerimientos',
        'Mapeo de procesos',
        'Figma',
        'Adobe Workfront',
      ],
      aboutRole: 'UX Designer · Investigación, estrategia y consultoría',
      aboutHook:
        'Consultor UX con formación en Diseño Interactivo y experiencia en plataformas internas, SaaS B2B y herramientas enterprise. Investigo antes de diseñar: entrevisto a los usuarios, reviso cómo trabajan de verdad y encuentro dónde se rompe la experiencia; después diseño los flujos, las interfaces y la documentación que lo resuelven. Para mí una emoción es un dato de negocio: cuando alguien se cansa, no entiende o prefiere llamar, ahí suele estar el problema, y también la oportunidad.',
      aboutDescription:
        'UX Designer con formación en Diseño Interactivo y experiencia en plataformas internas, SaaS B2B y herramientas enterprise.',
      aboutChips: ['UX/UI', 'Investigación', 'Pruebas de usabilidad', 'Journey maps', 'Service blueprints', 'Mapeo de procesos', 'Bogotá · Remoto', 'Inglés C1'],
      /* Las cuatro líneas de "Habilidades e idiomas" de la hoja de vida. */
      aboutSkills: [
        {
          label: 'Diseño',
          items: ['UX/UI', 'Diseño de interacción', 'Prototipado', 'Design systems', 'Arquitectura de información', 'Responsive', 'Accesibilidad (WCAG)'],
        },
        {
          label: 'Investigación',
          items: ['Entrevistas y síntesis', 'Pruebas de usabilidad', 'A/B testing', 'Journey maps', 'Service blueprints'],
        },
        {
          label: 'Consultoría y estrategia',
          items: ['Levantamiento de requerimientos', 'Mapeo de procesos', 'Gestión de stakeholders', 'Estrategia de adopción', 'QA de flujos', 'Metodologías ágiles'],
        },
        {
          label: 'Herramientas',
          items: ['Figma', 'Webflow', 'Adobe Creative Suite', 'Adobe Workfront y Fusion', 'HTML / CSS / JS', 'Power BI', 'HubSpot', 'Jira / Confluence', 'Google Workspace', 'Microsoft 365'],
        },
      ],
      jobTitles: { qstrauss: 'Technical Architect', ropofy: 'Jr UX Consultant / UX Designer', genia: 'UX/UI Designer', etb: 'Practicante UX/UI' },
      jobDetails: {
        qstrauss: {
          org: 'QStrauss Consulting · Implementaciones enterprise de Adobe Workfront',
          lede: null,
          bullets: [
            'Levanté requerimientos de negocio y funcionales con clientes enterprise de retail, banca y consumo masivo, y los traduje en flujos, configuración e interfaces de Adobe Workfront.',
            'Diagnostiqué implementaciones que no funcionaban: mapeé el proceso real contra el configurado, entrevisté a equipos y stakeholders y prioricé las decisiones de proceso.',
            'Diseñé una estrategia de adopción por rol, con documentación y capacitaciones, que se adoptó con un cliente en una implementación de unos 6 meses de punta a punta.',
            'Probé las implementaciones de punta a punta con desarrollo, incluidas automatizaciones de Workfront Fusion, revisando bugs antes de llegar al cliente.',
          ],
        },
        ropofy: {
          org: 'Ropofy · SaaS B2B de CRM y automatización',
          lede: null,
          bullets: [
            'Investigué por qué se perdían ventas (6 entrevistas a compradores y 3 meses de conversaciones revisadas por canal) y reencuadré el encargo: la caída estaba en el tiempo de respuesta, no en el checkout.',
            'Rediseñé el sitio alrededor del contacto y diseñé la bandeja única para WhatsApp, web e Instagram; descarté un chatbot porque el problema era de organización, no de volumen.',
            'Lideré la adopción de la plataforma en la cartera de clientes, con estrategias de uso de la herramienta y del funnel de ventas de punta a punta y capacitaciones en automatización y bots de IA.',
            'Hice pruebas con usuarios y A/B testing de los flujos de automatización con IA junto a desarrollo, revisando los bugs de los flujos.',
          ],
        },
        genia: {
          org: 'genia · Agencia digital (freelance)',
          lede: null,
          bullets: ['Diseñé y construí sitios web accesibles en Webflow, y experiencias interactivas y videojuegos con gamificación y narrativa digital.'],
        },
        etb: {
          org: 'ETB · Telecomunicaciones',
          lede: null,
          bullets: [
            'Rediseñé plataformas digitales internas usadas por más de 500 usuarios al mes, con una mejora del 30% en la eficiencia de navegación.',
            'Ejecuté pruebas de usabilidad y prioricé los hallazgos en las iteraciones de diseño, asegurando compatibilidad entre dispositivos.',
          ],
        },
      },
      education: [
        { what: 'Diseñador Interactivo, énfasis en UX/UI y Game Design', where: 'Universidad Jorge Tadeo Lozano · 2020 – 2024' },
        { what: 'Bootcamp UX Front-End', where: 'Cymetria · 2024' },
        { what: 'McKinsey.org Forward', where: 'Programa en curso · 2026' },
        { what: 'Bachillerato', where: 'Gimnasio Moderno · Bogotá' },
      ],
      contacto: {
        sobreMiSub: 'Esa es exactamente la parte que me gusta. Elige el canal que te quede más cómodo — respondo en máximo 24 horas hábiles.',
        whatsapp: 'Escríbeme directo. Respondo en máximo 24 horas hábiles — después de Ropofy no puedo permitirme lo contrario.',
      },
    },
    en: {
      homeTitle: 'Emilio Romero — UX Designer in Bogotá',
      heroKicker: 'UX Designer · Research, strategy and consulting · Bogotá, remote',
      homeDescription:
        "I'm Emilio. I research people and processes, and turn what I find into requirements and product decisions. That's almost always where the business problem is, and also the solution people actually use.",
      homeSkills: [
        'UX/UI',
        'Interaction design',
        'Interviews and synthesis',
        'Usability testing',
        'Journey maps',
        'Service blueprints',
        'Requirements gathering',
        'Process mapping',
        'Figma',
        'Adobe Workfront',
      ],
      aboutRole: 'UX Designer · Research, strategy and consulting',
      aboutHook:
        "UX consultant with a background in Interactive Design and experience across internal platforms, B2B SaaS and enterprise tools. I research before I design: I interview users, look at how they actually work and find where the experience breaks; then I design the workflows, interfaces and documentation that fix it. To me an emotion is a business signal: when someone gets tired, doesn't understand, or would rather call, that's usually where the problem is, and the opportunity too.",
      aboutDescription:
        'UX Designer with a background in Interactive Design and experience across internal platforms, B2B SaaS and enterprise tools.',
      aboutChips: ['UX/UI', 'Research', 'Usability testing', 'Journey maps', 'Service blueprints', 'Process mapping', 'Bogotá · Remote', 'English C1'],
      aboutSkills: [
        {
          label: 'Design',
          items: ['UX/UI', 'Interaction design', 'Prototyping', 'Design systems', 'Information architecture', 'Responsive', 'Accessibility (WCAG)'],
        },
        {
          label: 'Research',
          items: ['Interviews and synthesis', 'Usability testing', 'A/B testing', 'Journey maps', 'Service blueprints'],
        },
        {
          label: 'Consulting & strategy',
          items: ['Requirements gathering', 'Process mapping', 'Stakeholder management', 'Adoption strategy', 'Flow QA', 'Agile'],
        },
        {
          label: 'Tools',
          items: ['Figma', 'Webflow', 'Adobe Creative Suite', 'Adobe Workfront & Fusion', 'HTML / CSS / JS', 'Power BI', 'HubSpot', 'Jira / Confluence', 'Google Workspace', 'Microsoft 365'],
        },
      ],
      jobTitles: { qstrauss: 'Technical Architect', ropofy: 'Jr UX Consultant / UX Designer', genia: 'UX/UI Designer', etb: 'UX/UI Intern' },
      jobDetails: {
        qstrauss: {
          org: 'QStrauss Consulting · Enterprise Adobe Workfront implementations',
          lede: null,
          bullets: [
            'Gathered business and functional requirements with enterprise clients in retail, banking and consumer goods, and translated them into Adobe Workfront workflows, configuration and interfaces.',
            "Diagnosed implementations that weren't working: mapped the real process against the configured one, interviewed teams and stakeholders, and prioritized process decisions.",
            'Designed a role-based adoption strategy, with documentation and training, adopted by one client in an end-to-end implementation of about 6 months.',
            'Tested implementations end to end with development, including Workfront Fusion automations, reviewing bugs before they reached the client.',
          ],
        },
        ropofy: {
          org: 'Ropofy · B2B SaaS, CRM and automation',
          lede: null,
          bullets: [
            'Researched why sales were being lost (6 interviews with recent buyers and 3 months of conversations reviewed by channel) and reframed the brief: the drop-off was in response time, not at checkout.',
            'Redesigned the site around contact and designed a single inbox for WhatsApp, web and Instagram; discarded a chatbot because the problem was organizational, not volume.',
            'Led platform adoption across the client portfolio, with strategies for using the tool and for the end-to-end sales funnel, plus training on automation and AI bots.',
            'Ran user tests and A/B tests on the AI automation flows with development, reviewing bugs in the flows.',
          ],
        },
        genia: {
          org: 'genia · Digital agency (freelance)',
          lede: null,
          bullets: ['Designed and built accessible websites in Webflow, plus interactive experiences and games using gamification and digital storytelling.'],
        },
        etb: {
          org: 'ETB · Telecommunications',
          lede: null,
          bullets: [
            'Redesigned internal digital platforms used by 500+ monthly users, improving navigation efficiency by 30%.',
            'Ran usability tests and prioritized findings into design iterations, ensuring cross-device compatibility.',
          ],
        },
      },
      education: [
        { what: 'BA Interactive Design, UX/UI and Game Design', where: 'Universidad Jorge Tadeo Lozano · 2020 – 2024' },
        { what: 'UX Front-End Bootcamp', where: 'Cymetria · 2024' },
        { what: 'McKinsey.org Forward', where: 'In progress · 2026' },
        { what: 'High School Diploma', where: 'Gimnasio Moderno · Bogotá' },
      ],
      contacto: {
        sobreMiSub: "That's exactly the part I enjoy. Pick whichever channel suits you — I reply within 24 business hours.",
        whatsapp: "Message me directly. I reply within 24 business hours — after Ropofy I can't afford to do otherwise.",
      },
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
