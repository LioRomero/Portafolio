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
        title: 'Tres puzzles, uno por página',
        body: 'Ordena mi proceso, el recorrido de un caso y mi trayectoria. Se resuelven en menos de un minuto y al terminar cuentan algo que no está escrito en ningún otro lado.',
        why: 'Vengo del game design. Ordenar algo con las manos se recuerda mejor que leerlo — y me deja mostrar cómo pienso en vez de solo afirmarlo.',
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
        body: 'Tu cursor deja rastros de luz que se borran en medio segundo. El color cambia según la sección: violeta donde pienso, coral en los casos, cian en el método. Late a 55 pulsaciones por minuto.',
        why: 'Es el argumento de todo el portafolio hecho interacción: quien está del otro lado deja huella, aunque no la vea. Se borra rápido para que nunca estorbe la lectura.',
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
        title: 'Three puzzles, one per page',
        body: "Order my process, the arc of a case, and my track record. Each takes under a minute and ends with something that isn't written anywhere else.",
        why: 'I come from game design. Ordering something with your hands sticks better than reading it — and it lets me show how I think instead of just claiming it.',
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
        body: 'Your cursor leaves light trails that fade in half a second. The colour shifts by section: violet where I think, coral in the cases, cyan in the method. It beats at 55 per minute.',
        why: "It's the whole argument of this portfolio turned into interaction: the person on the other side leaves a mark, even when they can't see it. It fades fast so it never gets in the way of reading.",
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
