/** Los cuatro puzzles. Los tres primeros vienen de `Puzzle.dc.html`; el del
 *  blueprint se sumó al reposicionar el portafolio hacia service design. */

export type PuzzleVariant = 'proceso' | 'casos' | 'blueprint' | 'sobre';

export const PUZZLE = {
  proceso: {
    accent: '#8B7BF0',
    es: {
      badge: 'Puzzle 1 de 4',
      kind: 'Interactivo · 30 segundos',
      restart: 'Empezar de nuevo',
      title: 'Ordena mi proceso',
      rule: 'Toca los siete pasos en el orden en que trabajo, del negocio a la métrica. Si te equivocas, se reinicia y vuelves a intentarlo.',
      steps: [
        'Entender el negocio',
        'Entrevistar usuarios',
        'Buscar patrones',
        'Enunciar el problema',
        'Diseñar el sistema',
        'Prototipar',
        'Medir',
      ],
      solvedLabel: 'Ese es el orden',
      solved:
        'El cuarto paso es el que casi nadie hace: enunciar el problema antes de dibujar nada. Y el quinto es el que separa a quien investiga de quien además diseña el sistema que resuelve lo encontrado.',
    },
    en: {
      badge: 'Puzzle 1 of 4',
      kind: 'Interactive · 30 seconds',
      restart: 'Start over',
      title: 'Put my process in order',
      rule: 'Tap the seven steps in the order I work, from business to metric. Get one wrong and it resets so you can try again.',
      steps: [
        'Understand the business',
        'Interview users',
        'Find patterns',
        'State the problem',
        'Design the system',
        'Prototype',
        'Measure',
      ],
      solvedLabel: "That's the order",
      solved:
        'The fourth is the one almost nobody does: state the problem before drawing anything. And the fifth is what separates someone who researches from someone who also designs the system that fixes what they found.',
    },
  },
  casos: {
    accent: '#22D3EE',
    es: {
      badge: 'Puzzle 2 de 4',
      kind: 'Interactivo · 20 segundos',
      restart: 'Empezar de nuevo',
      title: '¿En qué orden llega un caso?',
      rule: 'Todo proyecto empieza con un encargo y termina en una métrica. Toca las cinco etapas en orden.',
      steps: [
        'Llega el encargo',
        'Aparece el problema real',
        'Las preguntas incómodas',
        'La decisión',
        'El resultado medido',
      ],
      solvedLabel: 'Exacto',
      solved:
        'El encargo casi nunca es el problema. Por eso cada caso de este portafolio empieza separando esas dos cosas.',
    },
    en: {
      badge: 'Puzzle 2 of 4',
      kind: 'Interactive · 20 seconds',
      restart: 'Start over',
      title: 'What order does a case arrive in?',
      rule: 'Every project starts as a brief and ends in a metric. Tap the five stages in order.',
      steps: [
        'The brief arrives',
        'The real problem surfaces',
        'The uncomfortable questions',
        'The decision',
        'The measured result',
      ],
      solvedLabel: 'Exactly',
      solved:
        "The brief is almost never the problem. That's why every case here starts by separating those two things.",
    },
  },
  /**
   * El blueprint es EL artefacto del diseño de servicios, y hasta ahora el
   * portafolio hablaba de el sin dejar tocarlo. Se ordena de arriba hacia
   * abajo, que es como se dibuja: lo que el usuario ve primero, lo que lo
   * sostiene despues.
   */
  blueprint: {
    accent: '#22D3EE',
    es: {
      badge: 'Puzzle 3 de 4',
      kind: 'Interactivo · 25 segundos',
      restart: 'Empezar de nuevo',
      title: 'Arma un blueprint de servicio',
      rule: 'Un blueprint se lee de arriba hacia abajo: primero lo que el usuario vive, después lo que lo sostiene. Toca las cinco capas en ese orden.',
      steps: [
        'Evidencia física',
        'Acciones del usuario',
        'Lo que el usuario ve',
        'Lo que pasa detrás',
        'Procesos de soporte',
      ],
      solvedLabel: 'Ese es el mapa',
      solved:
        'La línea que separa la tercera capa de la cuarta se llama línea de visibilidad. Casi todos los problemas que me contratan a resolver viven debajo de ella, aunque se sientan arriba.',
    },
    en: {
      badge: 'Puzzle 3 of 4',
      kind: 'Interactive · 25 seconds',
      restart: 'Start over',
      title: 'Build a service blueprint',
      rule: 'A blueprint reads top to bottom: first what the user lives through, then what holds it up. Tap the five layers in that order.',
      steps: [
        'Physical evidence',
        'User actions',
        'What the user sees',
        'What happens backstage',
        'Support processes',
      ],
      solvedLabel: "That's the map",
      solved:
        'The line between the third and fourth layers is called the line of visibility. Almost every problem I get hired to fix lives below it, even though it is felt above.',
    },
  },
  sobre: {
    accent: '#F0466B',
    es: {
      badge: 'Puzzle 4 de 4',
      kind: 'Interactivo · 20 segundos',
      restart: 'Empezar de nuevo',
      title: 'Mi trayectoria, en orden',
      rule: 'Cuatro trabajos, cuatro escalas distintas del mismo oficio. Tócalos del más antiguo al más reciente.',
      steps: [
        'ETB · practicante',
        'genia · freelance',
        'Ropofy · consultor jr',
        'QStrauss · technical architect',
      ],
      solvedLabel: 'Ese es el camino',
      solved:
        'De pantallas internas a arquitectura de plataforma. Lo que no cambió en ninguno: preguntar qué necesita la persona del otro lado antes de proponer nada.',
    },
    en: {
      badge: 'Puzzle 4 of 4',
      kind: 'Interactive · 20 seconds',
      restart: 'Start over',
      title: 'My track record, in order',
      rule: 'Four jobs, four different scales of the same craft. Tap them from earliest to most recent.',
      steps: [
        'ETB · intern',
        'genia · freelance',
        'Ropofy · jr consultant',
        'QStrauss · technical architect',
      ],
      solvedLabel: "That's the path",
      solved:
        'From internal screens to platform architecture. What never changed: asking what the person on the other side needs before proposing anything.',
    },
  },
} as const;

export const PUZZLE_UI = {
  es: {
    feedbackDefault: 'Toca el siguiente paso',
    feedbackWrong: 'Ese no va ahí — vuelve a empezar',
    of: 'de',
  },
  en: {
    feedbackDefault: 'Tap the next step',
    feedbackWrong: "That one doesn't go there — start again",
    of: 'of',
  },
} as const;

/**
 * Permutación determinista: misma semilla, mismo desorden en servidor y cliente.
 * Aleatorizar en render provocaría una hidratación inconsistente.
 */
export function shuffle(n: number, seed: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  let s = seed;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2147483648;
    const j = s % (i + 1);
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

export const seedFor = (n: number): number => n * 7919 + 13;
