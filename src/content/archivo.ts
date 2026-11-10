/* ==========================================================================
   "Antes de esto" · proyectos del portafolio anterior (Figma, 2020–2024)
   Texto resumido de las páginas originales del prototipo de Figma
   (archivo "Portfolio (Community)"). Las imágenes son recortes de esas mismas
   páginas exportadas: public/assets/archivo/.
   ========================================================================== */
import type { Lang } from './ui';

export interface ProyectoArchivo {
  key: string;
  titulo: string;
  contexto: string;
  rol: string;
  problema: string;
  /** Cómo lo trabajé: fase y qué hice en ella, sacado de las páginas originales. */
  hice: readonly { f: string; t: string }[];
  resultado: string;
  hoy: string;
  imgs: readonly { src: string; alt: string }[];
}

export const ARCHIVO_UI: Record<Lang, {
  kicker: string;
  titulo: string;
  sub: string;
  rol: string;
  problema: string;
  hice: string;
  resultado: string;
  hoy: string;
  abrir: string;
  cerrar: string;
  galeria: string;
  original: string;
  nuevaPestana: string;
}> = {
  es: {
    kicker: 'Antes de esto · 2020–2024',
    titulo: 'De la universidad y la práctica',
    sub: 'Proyectos de mi portafolio anterior. Mismo oficio, otras herramientas: abre cada uno para ver el proceso y lo que sigo usando hoy.',
    rol: 'Mi rol',
    problema: 'El problema',
    hice: 'Cómo lo trabajé',
    resultado: 'Lo que salió',
    hoy: 'Lo que sigo usando hoy',
    abrir: 'Ver el proceso',
    cerrar: 'Cerrar',
    galeria: 'Imágenes del proceso',
    original: 'Ver el portafolio original en Figma ↗',
    nuevaPestana: '(se abre en una pestaña nueva)',
  },
  en: {
    kicker: 'Before this · 2020–2024',
    titulo: 'From university and my internship',
    sub: 'Projects from my previous portfolio. Same craft, different tools: open each one to see the process and what I still use today.',
    rol: 'My role',
    problema: 'The problem',
    hice: 'How I worked',
    resultado: 'What came out of it',
    hoy: 'What I still use today',
    abrir: 'See the process',
    cerrar: 'Close',
    galeria: 'Process images',
    original: 'See the original portfolio in Figma ↗',
    nuevaPestana: '(opens in a new tab)',
  },
};

const img = (n: string) => `/assets/archivo/${n}.webp`;

export const ARCHIVO: Record<Lang, readonly ProyectoArchivo[]> = {
  es: [
    {
      key: 'etb',
      titulo: 'ETB · Extranet de Talento Humano',
      contexto: 'Práctica UX/UI · 2024',
      rol: 'Diseñador UX/UI y community manager, como practicante.',
      problema: 'La página principal de Talento Humano en la red interna hacía difícil llegar a los beneficios y trámites de los empleados.',
      hice: [
        { f: "Planteamiento", t: "Empecé por la marca de ETB y por lo que Talento Humano necesitaba que la página resolviera. Como la plantilla de la intranet casi no se podía tocar a nivel de código, diseñé wireframes simples que ordenaban todo en bloques: tres banners de campaña, accesos directos (Programaciones, Formatos, Compensación) y un menú con los trámites (beneficios, datos personales, día de descanso, formatos)." },
        { f: "Refinamiento", t: "Presenté varias propuestas de distribución y las afiné en rondas de retroalimentación con el equipo de Talento Humano y en pruebas con usuarios reales, hasta que cada beneficio o trámite se encontraba sin confusión." },
        { f: "Mockups e implementación", t: "Con la aprobación del equipo y del desarrollador cerré el diseño con los ajustes de las pruebas y acompañé su implementación en la plantilla interna. La versión final separa la información general de la autogestión." },
        { f: "En paralelo", t: "Participé en las fases de empatía y definición del design thinking para renovar la app Mi ETB, buscando los puntos de dolor de los usuarios." },
      ],
      resultado: 'Rediseño implementado en la intranet: 30% más eficiencia de navegación en plataformas que usan más de 500 personas al mes.',
      hoy: 'Diseñar dentro de restricciones técnicas reales y validar con usuarios antes de implementar: lo mismo que hago en implementaciones enterprise.',
      imgs: [
        { src: img('etb-final'), alt: 'Página principal de Talento Humano rediseñada, con el banner de regreso a clases.' },
        { src: img('etb-p1'), alt: 'Wireframes de la página principal y la página interna de Talento Humano, con la paleta de color.' },
        { src: img('etb-p2'), alt: 'Wireframe de la página interna con banners promocionales y accesos.' },
        { src: img('etb-p3'), alt: 'Mockup final de la página de Talento Humano.' },
      ],
    },
    {
      key: 'job4me',
      titulo: 'Job4Me · Formación y empleo joven',
      contexto: 'Propuesta para una licitación del gobierno, durante la pandemia',
      rol: 'Líder de equipo, diseñador UX/UI y desarrollador de la app.',
      problema: 'El desempleo juvenil subió con la pandemia y las empresas no estaban contratando a la población joven.',
      hice: [
        { f: "Investigación", t: "Con design thinking (empatía, definición e ideación) busqué por qué las empresas no estaban contratando jóvenes: desk research, user personas y clustering de lo que encontramos." },
        { f: "Ideación con in & out", t: "Pasé las ideas por una matriz in & out. Entraron los cursos interactivos con profesores, la simulación de entrevistas en realidad virtual con puntaje y retroalimentación, y los cursos en línea con expertos. Quedaron fuera ideas como robots tutores o un escáner de edificios para ver vacantes." },
        { f: "Prototipo en papel", t: "Bocetos de las pantallas clave para comprobar que la navegación se entendiera en la app y en la web: el estado de la postulación como una línea de tiempo por etapas y la búsqueda de ofertas con filtros." },
        { f: "Fidelidad media en Figma", t: "Después de probar la navegabilidad pasé a Figma: exploré la navegación, empecé el sistema de diseño y armé las interacciones entre pantallas, como el detalle del proceso con la información de la oferta, la del aplicante y la opción de cancelar." },
        { f: "Identidad", t: "Logo y paleta a partir de los hexágonos de un panal: una estética minimalista que comunica trabajo en equipo." },
      ],
      resultado: 'Job4Me, una app web y móvil: capacitación con profesionales, certificación, progreso visible para las empresas y estado del proceso de selección para el usuario.',
      hoy: 'El clustering de entonces es el mismo affinity mapping con el que reencuadré el encargo de Ropofy.',
      imgs: [
        { src: img('job4me-final'), alt: 'Home de la web de Job4Me: “Fortalece tu perfil y encuentra el trabajo que buscas”.' },
        { src: img('job4me-p1'), alt: 'Matriz in & out con las ideas que entraban y salían del alcance.' },
        { src: img('job4me-p2'), alt: 'Prototipo en papel de la pantalla de estado del proceso.' },
        { src: img('job4me-p3'), alt: 'Prototipo de fidelidad media de la pantalla de estado del proceso.' },
        { src: img('job4me-p4'), alt: 'Identidad de marca de Job4Me: logo, variantes y paleta.' },
      ],
    },
    {
      key: 'cybernexo',
      titulo: 'Cybernexo · Videojuego de realidad aumentada accesible',
      contexto: 'Para Realmix, evento transmedia de IDARTES en el Planetario de Bogotá',
      rol: 'Líder de equipo, diseñador UX/UI y UX researcher.',
      problema: 'Mantener la inmersión del público durante toda la experiencia, incluida la fila, y que fuera accesible para personas con discapacidad auditiva.',
      hice: [
        { f: "Investigación", t: "Investigué el evento e hice scouting del Planetario para anticipar las frustraciones del público, entre ellas los tiempos muertos en la fila. Mapeé a los actores en tres anillos (equipo núcleo, involucrados e informados) y armé user personas con y sin discapacidad auditiva." },
        { f: "Concepto", t: "Como Realmix es un evento de realidades mixtas, propuse un videojuego móvil de realidad aumentada con una historia y rompecabezas." },
        { f: "Prototipo en papel", t: "Probé niveles y narrativa con prototipos en papel en sesiones con usuarios, para verificar que fueran atractivos y accesibles para personas con discapacidad auditiva. Esas pruebas redefinieron cómo funcionaban la app y sus mecánicas." },
        { f: "Wireframes y recorrido", t: "Con el prototipo aprobado, diseñé los wireframes y planifiqué el recorrido: la app guía hacia la zona central y a la vez invita a explorar el resto del Planetario. Ajusté la dificultad de los rompecabezas para equilibrar la experiencia." },
        { f: "Narrativa", t: "Diseñé los personajes y la historia, y conecté cada parte del recorrido con ella. Usé IA para bocetar personajes y un montaje preliminar de los escenarios, que después modeló un diseñador 3D." },
        { f: "Mockups", t: "Con las mecánicas y la historia aprobadas por usuarios y por IDARTES, mostré cómo se vería la app y cómo se accede a cada minijuego y fase de la narrativa." },
      ],
      resultado: 'Una app móvil de realidad aumentada con historia y rompecabezas, aprobada por los usuarios y por IDARTES, que aprovecha los tiempos muertos en la fila e invita a recorrer el planetario.',
      hoy: 'Pensar la accesibilidad desde la investigación y no al final: hoy es un criterio en todo lo que diseño.',
      imgs: [
        { src: img('cybernexo-final'), alt: 'Mockups de las pantallas del videojuego Cybernexo.' },
        { src: img('cybernexo-p1'), alt: 'Mapa de actores del proyecto: core team, involucrados e informados.' },
        { src: img('cybernexo-p2'), alt: 'Bocetos y sesiones de prueba con prototipos en papel.' },
        { src: img('cybernexo-p3'), alt: 'Wireframe de la pantalla de personajes.' },
        { src: img('cybernexo-p4'), alt: 'Pantalla de inicio del videojuego, con los botones Jugar y Salir.' },
      ],
    },
    {
      key: 'otra-ciudad',
      titulo: 'Otra ciudad, el mismo yo',
      contexto: 'Proyecto transmedia con la JEP (Jurisdicción Especial para la Paz)',
      rol: 'Líder de un equipo de tres, diseñador UX/UI y UX researcher.',
      problema: 'Concientizar sobre el conflicto armado y el desplazamiento forzado a través del encuentro cultural de las comunidades afrodescendientes del Chocó al llegar a Bogotá, con un tono que enganchara sin restarle seriedad.',
      hice: [
        { f: "Investigación", t: "Entrevistas, encuestas, mapas de acción, moodboards y desk research sobre la población afrodescendiente desplazada, en particular la que llega del Chocó a Bogotá." },
        { f: "Un medio para cada cosa", t: "Decidí qué contaba cada formato: el fotocómic como aventura central, la web en WordPress con una zona de dibujo, un video 360 de cocina tradicional, gráficos con datos del desplazamiento, un diccionario rolo construido con los usuarios y, en Instagram, posts, reels con cantos típicos e historias que comparan el hablar del Chocó con el de Bogotá." },
        { f: "Parrilla de contenido", t: "Armé la semana día por día, con una temática para cada uno (cambio de paisaje, lenguaje regional, gastronomía del Pacífico, medicina tradicional, música, resiliencia) y qué medio se activaba en cada fecha." },
        { f: "Producción y montaje", t: "Scouting de zonas y entrevistas en restaurantes con personas del Chocó. Creamos un personaje que contaba en Instagram su llegada a Bogotá y publicamos pistas antes del lanzamiento para tener audiencia el día de la experiencia." },
      ],
      resultado: 'Una experiencia en vivo de alrededor de una semana con fotocómic, zona de dibujo, web y contenidos en Instagram.',
      hoy: 'Entrevistar donde pasan las cosas y elegir el canal según la persona: lo mismo que hice al revisar las conversaciones canal por canal en Ropofy.',
      imgs: [
        { src: img('otra-ciudad-final'), alt: 'Página web del proyecto, sección Dibuja, con una fotografía de la costa del Pacífico.' },
        { src: img('otra-ciudad-p1'), alt: 'Mapa de los productos del proyecto: diccionario, fotocómic, web, video 360 y redes.' },
        { src: img('otra-ciudad-p2'), alt: 'Parrilla de contenido por día, temática y medio.' },
        { src: img('otra-ciudad-p3'), alt: 'Perfil de Instagram del personaje del proyecto.' },
      ],
    },
  ],
  en: [
    {
      key: 'etb',
      titulo: 'ETB · HR Extranet',
      contexto: 'UX/UI internship · 2024',
      rol: 'UX/UI designer and community manager, as an intern.',
      problema: 'The HR home page on the company intranet made it hard for employees to reach their benefits and requests.',
      hice: [
        { f: "Framing", t: "I started with ETB’s brand and with what the HR team needed the page to solve. Since the intranet template could barely be changed at code level, I designed simple wireframes that organised everything into blocks: three campaign banners, shortcuts (Schedules, Forms, Compensation) and a menu with the requests (benefits, personal data, day off, forms)." },
        { f: "Refinement", t: "I presented several layout proposals and refined them in feedback rounds with the HR team and in tests with real users, until every benefit or request could be found without confusion." },
        { f: "Mockups and implementation", t: "With the team’s and the developer’s approval, I closed the design with the adjustments from testing and supported its implementation on the internal template. The final version separates general information from self-service." },
        { f: "In parallel", t: "I took part in the empathy and definition phases of the design thinking process to renew the Mi ETB app, looking for users’ pain points." },
      ],
      resultado: 'Redesign implemented on the intranet: 30% better navigation efficiency on platforms used by 500+ people a month.',
      hoy: 'Designing within real technical constraints and validating with users before implementation: the same thing I do in enterprise implementations.',
      imgs: [
        { src: img('etb-final'), alt: 'Redesigned HR home page, with the back-to-school banner.' },
        { src: img('etb-p1'), alt: 'Wireframes of the HR home and inner page, with the colour palette.' },
        { src: img('etb-p2'), alt: 'Wireframe of the inner page with promotional banners and shortcuts.' },
        { src: img('etb-p3'), alt: 'Final mockup of the HR page.' },
      ],
    },
    {
      key: 'job4me',
      titulo: 'Job4Me · Youth training and employment',
      contexto: 'Proposal for a government tender, during the pandemic',
      rol: 'Team lead, UX/UI designer and app developer.',
      problema: 'Youth unemployment rose with the pandemic, and companies weren’t hiring young people.',
      hice: [
        { f: "Research", t: "Using design thinking (empathy, definition and ideation), I looked into why companies weren’t hiring young people: desk research, user personas and clustering of what we found." },
        { f: "In & out ideation", t: "I ran the ideas through an in & out matrix. In: interactive courses with teachers, virtual reality job interview simulations with a score and feedback, and online courses with experts. Out: ideas like tutor robots or a building scanner to spot vacancies." },
        { f: "Paper prototype", t: "Sketches of the key screens to check that navigation made sense in the app and on the web: the application status as a stage-by-stage timeline and job search with filters." },
        { f: "Mid-fidelity in Figma", t: "After testing navigability I moved to Figma: I explored the navigation, started the design system and built the interactions between screens, such as the process detail with the job information, the applicant information and the option to cancel." },
        { f: "Identity", t: "Logo and palette based on honeycomb hexagons: a minimalist look that communicates teamwork." },
      ],
      resultado: 'Job4Me, a web and mobile app: training with professionals, certification, progress companies can see, and the status of the hiring process for the user.',
      hoy: 'That clustering is the same affinity mapping I used to reframe the Ropofy brief.',
      imgs: [
        { src: img('job4me-final'), alt: 'Job4Me web home: “Strengthen your profile and find the job you’re looking for”.' },
        { src: img('job4me-p1'), alt: 'In & out matrix with the ideas inside and outside the scope.' },
        { src: img('job4me-p2'), alt: 'Paper prototype of the process status screen.' },
        { src: img('job4me-p3'), alt: 'Mid-fidelity prototype of the process status screen.' },
        { src: img('job4me-p4'), alt: 'Job4Me brand identity: logo, variants and palette.' },
      ],
    },
    {
      key: 'cybernexo',
      titulo: 'Cybernexo · Accessible augmented reality game',
      contexto: 'For Realmix, IDARTES’ transmedia event at the Bogotá Planetarium',
      rol: 'Team lead, UX/UI designer and UX researcher.',
      problema: 'Keep the audience immersed throughout the experience, queue included, and make it accessible for people with hearing impairments.',
      hice: [
        { f: "Research", t: "I researched the event and scouted the Planetarium to anticipate the audience’s frustrations, including the dead time in the queue. I mapped stakeholders in three rings (core team, involved and informed) and built user personas with and without hearing impairments." },
        { f: "Concept", t: "Since Realmix is a mixed-reality event, I proposed an augmented reality mobile game with a story and puzzles." },
        { f: "Paper prototype", t: "I tested levels and narrative with paper prototypes in user sessions, to check they were engaging and accessible for people with hearing impairments. Those tests redefined how the app and its mechanics worked." },
        { f: "Wireframes and route", t: "With the prototype approved, I designed the wireframes and planned the route: the app guides people to the central area while inviting them to explore the rest of the Planetarium. I adjusted the puzzles’ difficulty to balance the experience." },
        { f: "Narrative", t: "I designed the characters and the story, and connected each part of the route to it. I used AI to sketch characters and a rough layout of the scenes, later modelled by a 3D designer." },
        { f: "Mockups", t: "With the mechanics and story approved by users and by IDARTES, I showed how the app would look and how to reach each mini-game and narrative stage." },
      ],
      resultado: 'An augmented reality mobile app with a story and puzzles, approved by users and by IDARTES, that makes use of the dead time in the queue and invites people to explore the planetarium.',
      hoy: 'Thinking about accessibility from the research stage, not at the end: it’s now a criterion in everything I design.',
      imgs: [
        { src: img('cybernexo-final'), alt: 'Mockups of the Cybernexo game screens.' },
        { src: img('cybernexo-p1'), alt: 'Stakeholder map: core team, involved and informed.' },
        { src: img('cybernexo-p2'), alt: 'Sketches and testing sessions with paper prototypes.' },
        { src: img('cybernexo-p3'), alt: 'Wireframe of the characters screen.' },
        { src: img('cybernexo-p4'), alt: 'Game start screen, with the Play and Exit buttons.' },
      ],
    },
    {
      key: 'otra-ciudad',
      titulo: 'Another city, the same me',
      contexto: 'Transmedia project with the JEP (Special Jurisdiction for Peace)',
      rol: 'Lead of a team of three, UX/UI designer and UX researcher.',
      problema: 'Raise awareness of the armed conflict and forced displacement through the cultural encounter of Afro-Colombian communities from Chocó arriving in Bogotá, with a tone that engaged people without making light of it.',
      hice: [
        { f: "Research", t: "Interviews, surveys, action maps, moodboards and desk research on displaced Afro-Colombian people, especially those arriving in Bogotá from Chocó." },
        { f: "One medium for each thing", t: "I decided what each format would tell: the photo comic as the central adventure, a WordPress site with a drawing area, a 360 video of traditional cooking, charts with displacement data, a Bogotá slang dictionary built with users and, on Instagram, posts, reels with traditional songs and stories comparing how people speak in Chocó and in Bogotá." },
        { f: "Content calendar", t: "I planned the week day by day, with a theme for each (change of landscape, regional language, Pacific cuisine, traditional medicine, music, resilience) and which medium went live on each date." },
        { f: "Production and set-up", t: "Scouting and interviews in restaurants with people from Chocó. We created a character who told the story of his arrival in Bogotá on Instagram and posted teasers before launch so there would be an audience on the day." },
      ],
      resultado: 'A live experience of about a week with a photo comic, a drawing area, a website and Instagram content.',
      hoy: 'Interviewing where things happen and choosing the channel for the person: the same thing I did when I reviewed conversations channel by channel at Ropofy.',
      imgs: [
        { src: img('otra-ciudad-final'), alt: 'Project website, Draw section, with a photo of the Pacific coast.' },
        { src: img('otra-ciudad-p1'), alt: 'Map of the project’s products: dictionary, photo comic, website, 360 video and social media.' },
        { src: img('otra-ciudad-p2'), alt: 'Content calendar by day, theme and medium.' },
        { src: img('otra-ciudad-p3'), alt: 'Instagram profile of the project’s character.' },
      ],
    },
  ],
};
