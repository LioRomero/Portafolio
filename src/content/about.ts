/** Contenido de Sobre mí. Copiado de `Sobre mi Emilio.dc.html`. */

export interface Job {
  dates: string;
  datesEn: string;
  org: string;
  orgEn?: string;
  title: string;
  titleEn: string;
  lede: string;
  ledeEn: string;
  bullets: string[];
  bulletsEn: string[];
  note?: string;
  noteEn?: string;
}

export const JOBS: Job[] = [
  {
    dates: 'Abr 2026 — Actualidad',
    datesEn: 'Apr 2026 — Present',
    org: 'QStrauss Consulting · Code and Theory Network (Stagwell)',
    title: 'Technical Architect',
    titleEn: 'Technical Architect',
    lede: 'Lidero la consultoría técnica sobre implementaciones de Adobe Workfront para clientes enterprise de retail, banca y consumo masivo.',
    ledeEn:
      'I lead the technical consulting on Adobe Workfront implementations for enterprise clients across retail, banking and consumer goods.',
    bullets: [
      'Diagnostico fallas de configuración y de adopción, y diseño la solución que las resuelve — no solo el informe que las describe.',
      'Rediseño flujos de trabajo de cliente para bajar fricción y acortar ciclos de entrega.',
      'Construyo la documentación técnica que le permite al equipo del cliente entender su propia instancia y depender menos de nosotros.',
      'Desarrollo Custom Canvas, la herramienta interna de documentación; lideré su auditoría UX/UI completa y el plan de refactorización por fases.',
      'Integro IA (Claude, Gemini, NotebookLM) en los flujos de documentación y análisis para producir entregables más rápido.',
      'Entrego interfaces, decks de entrenamiento, propuestas comerciales y análisis de riesgo.',
    ],
    bulletsEn: [
      'I diagnose configuration and adoption failures, then design the solution that fixes them — not just the report describing them.',
      'I redesign client workflows to cut friction and shorten delivery cycles.',
      'I build the technical documentation that lets client teams understand their own instance and depend less on us.',
      'I develop Custom Canvas, the internal documentation tool; I led its full UX/UI audit and phased refactoring plan.',
      'I integrate AI (Claude, Gemini, NotebookLM) into documentation and analysis workflows to ship deliverables faster.',
      'I deliver interfaces, training decks, commercial proposals and risk analyses.',
    ],
    note: 'Los nombres de cliente están cubiertos por acuerdos de confidencialidad.',
    noteEn: 'Client names are covered by non-disclosure agreements.',
  },
  {
    dates: 'Jun 2025 — Abr 2026',
    datesEn: 'Jun 2025 — Apr 2026',
    org: 'Ropofy · SaaS B2B (CRM y automatización)',
    orgEn: 'Ropofy · B2B SaaS (CRM and automation)',
    title: 'Jr UX Consultant / UX Designer',
    titleEn: 'Jr UX Consultant / UX Designer',
    lede: 'Dos frentes a la vez: la cartera de clientes y el sitio del producto.',
    ledeEn: 'Two fronts at once: the client portfolio and the product website.',
    bullets: [
      'Lideré la adopción de la plataforma en la cartera de clientes: acompañé implementaciones, resolví incidencias y fui el puente entre cliente y equipo de desarrollo.',
      'Rediseñé el sitio del producto partiendo de necesidades reales de usuario final; acompañó el crecimiento de tráfico y leads en la etapa de estabilización de la compañía.',
      'Diseñé y dicté capacitaciones continuas en automatización de procesos y bots de IA.',
      'Aporté a las estrategias de reactivación de clientes y generación de leads con el equipo comercial.',
    ],
    bulletsEn: [
      'I led platform adoption across the client portfolio: supporting implementations, resolving issues and acting as the bridge between clients and the development team.',
      "I redesigned the product website from real end-user needs; it accompanied traffic and lead growth during the company's stabilization stage.",
      'I designed and delivered ongoing training on process automation and AI bots.',
      'I contributed to client reactivation and lead generation strategy alongside the commercial team.',
    ],
  },
  {
    dates: 'Oct 2024 — Abr 2025',
    datesEn: 'Oct 2024 — Apr 2025',
    org: 'genia · Freelance',
    orgEn: 'genia · Freelance',
    title: 'Diseñador UX/UI',
    titleEn: 'UX/UI Designer',
    lede: 'Sitios accesibles en Webflow y experiencias interactivas donde la narrativa era parte del producto.',
    ledeEn: 'Accessible Webflow sites and interactive experiences where narrative was part of the product.',
    bullets: [
      'Diseñé y construí sitios accesibles en Webflow.',
      'Desarrollé experiencias interactivas y videojuegos aplicando gamificación y narrativa digital.',
    ],
    bulletsEn: [
      'I designed and built accessible websites in Webflow.',
      'I developed interactive experiences and games applying gamification and digital storytelling.',
    ],
  },
  {
    dates: 'Feb 2024 — Ago 2024',
    datesEn: 'Feb 2024 — Aug 2024',
    org: 'ETB · Telecomunicaciones',
    orgEn: 'ETB · Telecommunications',
    title: 'Practicante UX/UI',
    titleEn: 'UX/UI Design Intern',
    lede: 'Plataformas internas usadas por más de 500 personas al mes: el primer lugar donde vi que el problema casi nunca está en la pantalla.',
    ledeEn:
      'Internal platforms used by 500+ people a month: the first place I saw that the problem is rarely on the screen.',
    bullets: [
      'Diseñé e implementé interfaces que mejoraron la eficiencia de navegación en 30% y redujeron el tiempo de interacción.',
      'Participé en el rediseño de plataformas digitales internas con más de 500 usuarios mensuales, mejorando accesibilidad y capacidad de respuesta.',
      'Ejecuté pruebas de usabilidad e incorporé los hallazgos en cada iteración, asegurando compatibilidad entre dispositivos.',
    ],
    bulletsEn: [
      'I designed and implemented interfaces that improved navigation efficiency by 30% and reduced interaction time.',
      'I contributed to the redesign of internal digital platforms with 500+ monthly users, improving accessibility and responsiveness.',
      'I ran usability tests and fed the findings into every iteration, ensuring cross-device compatibility.',
    ],
  },
];

export const ABOUT = {
  es: {
    back: 'Inicio',
    cases: 'Casos',
    kicker: 'Sobre mí',
    role: 'Consultor UX · Diseño de servicios y experiencia',
    hook: 'Vengo del UX/UI y el game design, y me moví a la consultoría porque quería entender cómo ocurre la transformación por dentro de una organización, no solo cómo se ve la interfaz al final.',
    chips: ['Bogotá, Colombia', 'Remoto / Híbrido', 'Inglés C1', 'Adobe Workfront'],
    k1: 'Quién soy',
    who: [
      'Soy diseñador interactivo de la Universidad Jorge Tadeo Lozano. Lo que me mueve es crear experiencias nuevas: entender de verdad qué necesita la persona del otro lado y traducirlo en herramientas que funcionen, se puedan replicar, se puedan automatizar y dejen un impacto medible.',
      'Trabajo con diseño centrado en el usuario tanto en producto digital como en las operaciones internas de una empresa. Investigo, prototipo, valido, y me quedo hasta que la gente lo adopta — la parte que casi nunca aparece en un caso de estudio.',
      'Sé programar lo suficiente para no pedir imposibles: HTML, CSS, algo de C#. Diseño y prototipo en Figma, y me interesa el terreno donde la tecnología todavía no tiene convenciones: AR, VR, videojuegos.',
    ],
    essays: [
      {
        q: '¿Por qué diseño interactivo?',
        a: 'Pude ser un buen economista o dedicarme a las ventas en cualquier parte del mundo. Elegí un camino donde la curiosidad se paga sola. Al descubrir esta carrera entendí que mi objetivo era hacer de la tecnología una herramienta útil, que se integre en la vida diaria de la gente sin volverse un estorbo.',
      },
      {
        q: '¿Hacia dónde apunto?',
        a: 'Siempre he sido de sueños grandes, pero en vez de quedarme en las nubes busco aterrizar cada meta. Mi intención ahora es abrir fronteras nuevas en la experiencia de las personas: crear historias y productos que no sean pasajeros, sino que se queden en la memoria. ¿Hacia dónde voy? Al corazón de la gente, explorando todo lo que la tecnología permita.',
      },
    ],
    k2: 'Trayectoria',
    jobsTitle: 'Cuatro trabajos, una misma pregunta: ¿qué necesita de verdad la persona del otro lado?',
    k3: 'Reconocimientos',
    awards: [
      {
        tag: 'Ganador de categoría · Ago 2024',
        title: 'TechSprint para una Mayor Transparencia Gubernamental — BID, AIR e INL',
        body: 'Con el equipo Trust: una aplicación web en Power BI con inteligencia artificial para digitalizar y verificar documentos de licitación. Ganamos la Distinción en Democratización de Datos en el Demo Day de Washington D.C., y quedamos segundos en la general.',
      },
      {
        tag: 'Top 20 regional · 2025',
        title: "L'Oréal Brandstorm",
        body: 'Semifinales de Colombia, Panamá, Perú y Ecuador con el equipo Apolo: un proyecto para acercar al consumidor masculino al cuidado personal a través de la tecnología.',
      },
    ],
    /* La carrera tuvo énfasis en UX/UI y game design, y hasta ahora solo se
       veía la primera mitad. Va como pieza y no como caso: es trabajo de
       interfaz y dirección de arte, sin la investigación ni la métrica que
       sostienen a Ropofy, QStrauss y el BID. */
    k7: 'La otra mitad: game design',
    game: {
      title: 'Cybernexo',
      lede: 'Un juego móvil que diseñé de punta a punta: la identidad, la entrada, los diálogos y los niveles. Es la pieza donde se ve el énfasis en game design de mi carrera, que en los casos de consultoría no aparece por ningún lado.',
      facts: [
        ['Qué es', 'Un juego de puzzles sobre la placa de circuito de un edificio. Los sistemas de abastecimiento, regulación y control quedaron averiados, y el jugador entra a repararlos.'],
        ['Qué diseñé', 'Identidad y dirección de arte, menú, acceso por huella, los diálogos del personaje y las pantallas de juego.'],
        ['Para qué', 'Está hecho alrededor del festival RealMix 2023: al entrar, el juego te acredita como “Ayudante del RealMix 2023”.'],
      ],
      shots: [
        ['Acceso por huella, menú principal y el diálogo que plantea la avería.', 'Entrada del juego: pantalla de acceso por huella, menú principal y el primer diálogo del personaje'],
        ['Tres niveles. El tablero es la placa de circuito del edificio.', 'Tres pantallas de juego con el tablero de puzzles sobre una placa de circuito'],
      ],
      honest:
        'Lo pongo como pieza y no como caso a propósito: no tengo research ni una métrica de resultado que enseñar, y prefiero decirlo antes que rellenar el formato con humo.',
    },
    k4: 'Habilidades',
    skills: [
      {
        label: 'Plataforma y procesos',
        items: ['Adobe Workfront', 'Consultoría de implementación', 'Diseño de servicios', 'Rediseño y optimización de procesos', 'Documentación técnica y enablement', 'Análisis de riesgos', 'Gestión de stakeholders'],
      },
      {
        label: 'Diseño y producto',
        items: ['UX Research', 'Diseño UX/UI', 'Prototipado', 'Design systems', 'Arquitectura de información', 'Pruebas de usabilidad', 'Accesibilidad (WCAG)', 'Storytelling y gamificación'],
      },
      {
        label: 'Herramientas',
        items: ['Figma', 'Webflow', 'Adobe Creative Suite', 'Power BI', 'HubSpot', 'HTML / CSS / JS', 'Confluence / Jira', 'Google Workspace', 'Microsoft 365', 'Claude, Gemini, NotebookLM'],
      },
    ],
    k5: 'Formación',
    education: [
      { what: 'Diseñador Interactivo, énfasis en UX/UI y Game Design', where: 'Universidad Jorge Tadeo Lozano · 2020 – 2024' },
      { what: 'Bootcamp UX Front-End', where: 'Cymetria · 2024' },
      { what: 'Certificación Adobe Workfront', where: 'En curso' },
    ],
    k6: 'Idiomas',
    langs: [
      { name: 'Español', level: 'Nativo' },
      { name: 'Inglés', level: 'C1' },
      { name: 'Lengua de señas colombiana', level: 'Básico' },
    ],
    ctaTitle: '¿Tienes un problema que todavía nadie sabe enunciar?',
    ctaSub: 'Esa es exactamente la parte que me gusta. Elige el canal que te quede más cómodo — contesto el mismo día.',
    cvEs: 'Descargar CV (español) ↓',
    cvEn: 'Download CV (English) ↓',
  },
  en: {
    back: 'Home',
    cases: 'Cases',
    kicker: 'About me',
    role: 'UX Consultant · Service & Experience Design',
    hook: 'My background is UX/UI and game design, and I moved into consulting because I wanted to understand how transformation happens inside an organization, not just how the interface looks at the end.',
    chips: ['Bogotá, Colombia', 'Remote / Hybrid', 'English C1', 'Adobe Workfront'],
    k1: 'Who I am',
    who: [
      "I'm an interactive designer from Universidad Jorge Tadeo Lozano. What drives me is building new experiences: genuinely understanding what the person on the other side needs, and turning that into tools that work, that can be replicated, that can be automated, and that leave measurable impact.",
      "I apply user-centred design to digital products and to a company's internal operations alike. I research, prototype, validate — and stay until people actually adopt it, the part that rarely makes it into a case study.",
      "I code enough not to ask for the impossible: HTML, CSS, some C#. I design and prototype in Figma, and I'm drawn to the ground where technology has no conventions yet: AR, VR, games.",
    ],
    essays: [
      {
        q: 'Why interactive design?',
        a: "I could have been a decent economist or worked in sales anywhere in the world. I chose a path where curiosity pays for itself. When I found this degree I understood my goal: making technology a useful tool that fits into people's daily lives without getting in the way.",
      },
      {
        q: 'Where am I aiming?',
        a: "I've always dreamt big, but instead of staying in the clouds I try to land every goal. What I want now is to open new frontiers in people's experience: stories and products that aren't fleeting, but stay in memory. Where am I going? To people's hearts, exploring everything technology allows.",
      },
    ],
    k2: 'Track record',
    jobsTitle: 'Four jobs, one question throughout: what does the person on the other side actually need?',
    k3: 'Awards',
    awards: [
      {
        tag: 'Category winner · Aug 2024',
        title: 'TechSprint for Greater Government Transparency — IDB, AIR and INL',
        body: 'With team Trust: a Power BI web application using AI to digitise and verify tender documents. We won the Distinction in Data Democratisation at the Washington D.C. Demo Day, and finished second overall.',
      },
      {
        tag: 'Regional top 20 · 2025',
        title: "L'Oréal Brandstorm",
        body: 'Semifinals for Colombia, Panama, Peru and Ecuador with team Apolo: a project connecting male consumers to personal care through technology.',
      },
    ],
    k7: 'The other half: game design',
    game: {
      title: 'Cybernexo',
      lede: "A mobile game I designed end to end: the identity, the entry screens, the dialogue and the levels. It's the piece where my degree's game-design emphasis shows up — nowhere to be found in the consulting cases.",
      facts: [
        ['What it is', "A puzzle game set on a building's circuit board. Its supply, regulation and control systems have failed, and the player goes in to repair them."],
        ['What I designed', 'Identity and art direction, the menu, fingerprint access, the character dialogue and the gameplay screens.'],
        ['What it was for', 'It was built around the RealMix 2023 festival: on entry, the game credits you as an “Ayudante del RealMix 2023”.'],
      ],
      shots: [
        ['Fingerprint access, main menu and the dialogue that sets up the fault.', 'Game entry: fingerprint access screen, main menu and the character’s first dialogue'],
        ["Three levels. The board is the building's circuit board.", 'Three gameplay screens with the puzzle board laid over a circuit board'],
      ],
      honest:
        "It's here as a piece, not a case, on purpose: I have no research and no outcome metric to show, and I'd rather say so than pad the format.",
    },
    k4: 'Skills',
    skills: [
      {
        label: 'Platform & process',
        items: ['Adobe Workfront', 'Implementation consulting', 'Service design', 'Process redesign and optimization', 'Technical documentation and enablement', 'Risk analysis', 'Stakeholder management'],
      },
      {
        label: 'Design & product',
        items: ['UX research', 'UX/UI design', 'Prototyping', 'Design systems', 'Information architecture', 'Usability testing', 'Accessibility (WCAG)', 'Storytelling and gamification'],
      },
      {
        label: 'Tools',
        items: ['Figma', 'Webflow', 'Adobe Creative Suite', 'Power BI', 'HubSpot', 'HTML / CSS / JS', 'Confluence / Jira', 'Google Workspace', 'Microsoft 365', 'Claude, Gemini, NotebookLM'],
      },
    ],
    k5: 'Education',
    education: [
      { what: 'BA Interactive Design, focus on UX/UI and Game Design', where: 'Universidad Jorge Tadeo Lozano · 2020 – 2024' },
      { what: 'UX Front-End Bootcamp', where: 'Cymetria · 2024' },
      { what: 'Adobe Workfront Certification', where: 'In progress' },
    ],
    k6: 'Languages',
    langs: [
      { name: 'Spanish', level: 'Native' },
      { name: 'English', level: 'C1' },
      { name: 'Colombian Sign Language', level: 'Basic' },
    ],
    ctaTitle: 'Got a problem nobody can quite name yet?',
    ctaSub: "That's exactly the part I enjoy. Pick whichever channel suits you — I reply the same day.",
    cvEs: 'Download CV (Spanish) ↓',
    cvEn: 'Download CV (English) ↓',
  },
} as const;
