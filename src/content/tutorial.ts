/** Los seis pasos del tutorial, en ambos idiomas. Copiados de `Tutorial.dc.html`. */

export interface TutorialStep {
  icon: string;
  title: string;
  body: string;
  why: string;
}

export const TUTORIAL = {
  es: {
    label: 'Cómo se lee este portafolio',
    close: 'Cerrar',
    whyLabel: 'Por qué está aquí',
    prev: 'Atrás',
    next: 'Siguiente',
    done: 'Entendido, a explorar',
    skip: 'Saltar el tour',
    steps: [
      {
        icon: '◑',
        title: 'Primero: elige cómo quieres leerme',
        body: 'Arriba hay dos modos. Al grano deja solo lo que un reclutador necesita: problema, decisión, resultado. Explorar añade la capa lúdica — puzzles, notas escondidas, sonido y luz.',
        why: 'No todo el mundo llega con el mismo tiempo. Obligarte a jugar para entender mi trabajo sería mal diseño: en Al grano no se pierde ni un dato.',
      },
      {
        icon: '◦',
        title: 'Los puntos que laten son notas mías',
        body: 'Cada punto violeta abre una nota corta: por qué tomé una decisión, una manía de trabajo, algo que normalmente solo sale en una entrevista. Hay ocho repartidas.',
        why: 'Un portafolio muestra resultados. Estas notas muestran criterio — que es lo que en realidad estás evaluando cuando lees a un diseñador.',
      },
      {
        icon: '⁘',
        title: 'Tres puzzles, tres mecánicas, y un archivador',
        body: 'Cada puzzle juega distinto porque enseña algo distinto: en la home ordenas mi proceso, en Casos separas lo que pidió el cliente del problema real, y en Sobre mí unes cada trabajo con quién estaba del otro lado. Cada uno explica por qué está hecho así. Y en Casos hay un archivador de servicio en 3D que se abre capa por capa.',
        why: 'Vengo del game design, y ahí la regla es simple: la mecánica es el mensaje. Ordenar, clasificar y emparejar no son adorno: son tres formas de pensar que uso en el trabajo.',
      },
      {
        icon: '◫',
        title: 'En los casos: enséñame el porqué',
        body: 'Cada caso trae dos interruptores. Modo investigador (tecla R) descubre mis notas de diseño sobre las pantallas. Y hay un botón honesto (tecla X) que apaga esos insights y deja solo el “antes y después” — que es como se ve la mayoría de los portafolios.',
        why: 'Una pantalla bonita no prueba criterio. Prefiero enseñarte la decisión y su razón, y hasta cómo se ve el mismo trabajo cuando le quitas el porqué. Si eso no convence, la pantalla tampoco lo iba a hacer.',
      },
      {
        icon: '◉',
        title: 'La linterna y la playlist',
        body: 'La linterna apaga la página salvo un círculo alrededor del cursor, y revela la letra chica de este portafolio: dos fragmentos que están en el texto sin que los veas. La playlist es la que suena de verdad mientras trabajo.',
        why: 'La linterna es literal: en todo proyecto hay letra chica que nadie mira hasta que la alumbras. La música es el contexto emocional — diseñar tiene una temperatura, y prefiero mostrarla a describirla.',
      },
      {
        icon: '◍',
        title: 'El fondo se pinta contigo',
        body: 'Tu cursor deja rastros de luz que viven unos segundos y se apagan solos. Late a 55 pulsaciones por minuto y va cambiando de color entre las tres emociones: violeta cuando pienso, cian cuando aclaro, coral cuando algo se siente. El trazo es configurable desde el panel: estela o gotas de agua, intensidad, caída, tamaño y color.',
        why: 'Es el argumento de todo el portafolio hecho interacción: quien está del otro lado deja huella, aunque no la vea. Se borra rápido para que nunca estorbe la lectura.',
      },
      {
        icon: '⊞',
        title: 'Todo se maneja desde un panel',
        body: 'Abajo a la derecha está el Modo curioso (o pulsa ?). Ahí viven todos los interruptores de esta capa, tu progreso de notas, el botón de empezar de nuevo y el sonido de los juegos — que viene encendido y se apaga desde ahí. Atajos: F linterna, P playlist, M movimiento, ? el panel; y en los casos, R investigador y X radiografía.',
        why: 'Nada de esto debería estorbar. Un solo lugar para encender, apagar y medir: la página es tuya, no un espectáculo que no puedes bajar.',
      },
      {
        icon: '✎',
        title: 'Y al final, déjame algo',
        body: 'Cada página termina con un canvas abierto: eliges con qué te quedaste — claridad, duda, sugerencia — y escribes. Puedes enviármelo por correo con un clic.',
        why: 'Es la única investigación que puedo hacer sobre mi propio trabajo. Si diseño escuchando, sería incoherente publicar esto sin un lugar donde escucharte.',
      },
    ] as TutorialStep[],
  },
  en: {
    label: 'How to read this portfolio',
    close: 'Close',
    whyLabel: "Why it's here",
    prev: 'Back',
    next: 'Next',
    done: "Got it, let's explore",
    skip: 'Skip the tour',
    steps: [
      {
        icon: '◑',
        title: 'First: choose how you want to read me',
        body: 'There are two modes up top. Quick read keeps only what a recruiter needs: problem, decision, result. Explore adds the playful layer — puzzles, hidden notes, sound and light.',
        why: 'Not everyone arrives with the same time. Forcing you to play in order to understand my work would be bad design: Quick read loses no information.',
      },
      {
        icon: '◦',
        title: 'The pulsing dots are notes from me',
        body: 'Each violet dot opens a short note: why I made a decision, a working habit, something that normally only comes up in an interview. There are eight of them.',
        why: "A portfolio shows results. These notes show judgement — which is what you're actually assessing when you read a designer.",
      },
      {
        icon: '⁘',
        title: 'Three puzzles, three mechanics, and a cabinet',
        body: "Each puzzle plays differently because it teaches something different: on the home page you order my process, on Cases you separate what the client asked for from the real problem, and on About you match each job with who was on the other side. Each one explains why it's built that way. And on Cases there's a 3D service cabinet you open layer by layer.",
        why: "I come from game design, where the rule is simple: the mechanic is the message. Ordering, sorting and matching aren't decoration — they're three ways of thinking I use at work.",
      },
      {
        icon: '◫',
        title: 'On the cases: show me the why',
        body: 'Each case carries two switches. Researcher mode (press R) reveals my design notes over the screens. And there’s an honest button (press X) that switches those insights off and leaves only the “before and after” — which is how most portfolios look.',
        why: "A pretty screen doesn't prove judgement. I'd rather show you the decision and its reason, and even what the same work looks like once you strip the why out. If that doesn't convince you, the screen wasn't going to either.",
      },
      {
        icon: '◉',
        title: 'The flashlight and the playlist',
        body: "The flashlight dims the page except for a circle around your cursor, revealing this portfolio's fine print: two fragments sitting in the text without you seeing them. The playlist is the one I actually work to.",
        why: "The flashlight is literal: every project has fine print nobody looks at until you shine a light on it. The music is emotional context — design has a temperature, and I'd rather show it than describe it.",
      },
      {
        icon: '◍',
        title: 'The background paints with you',
        body: 'Your cursor leaves light trails that live for a few seconds and fade on their own. They beat at 55 per minute and drift through the three emotions: violet when I think, cyan when I clarify, coral when something is felt. The stroke is adjustable from the panel: light trail or water drops, intensity, fall, size and colour.',
        why: "It's the whole argument of this portfolio turned into interaction: the person on the other side leaves a mark, even when they can't see it. It fades fast so it never gets in the way of reading.",
      },
      {
        icon: '⊞',
        title: 'Everything runs from one panel',
        body: 'Bottom right is Curious mode (or press ?). That’s where every switch in this layer lives, along with your note progress, the start-over button and the game sound — which comes on and turns off right there. Shortcuts: F flashlight, P playlist, M motion, ? the panel; and on the cases, R researcher and X x-ray.',
        why: "None of this should get in the way. One place to switch things on, off and measure them: the page is yours, not a show you can't turn down.",
      },
      {
        icon: '✎',
        title: 'And at the end, leave me something',
        body: 'Every page ends with an open canvas: pick what you took away — clarity, doubt, a suggestion — and write. One click emails it to me.',
        why: "It's the only research I can run on my own work. If I design by listening, publishing this without a place to hear you would be incoherent.",
      },
    ] as TutorialStep[],
  },
} as const;
