/**
 * Los tres puzzles del modo Explorar.
 *
 * Cada uno usa una mecánica distinta, y no por variar: la mecánica es la idea
 * que enseña. Ordenar para el método (es una secuencia), clasificar para los
 * casos (reencuadrar es separar lo que piden de lo que pasa) y emparejar para
 * la trayectoria (se entiende en relación, no en fechas). Cada puzzle explica
 * por qué está hecho así en `why`.
 *
 * El del blueprint no está aquí: se arma dentro de la escena 3D, en
 * `Blueprint3D.tsx`.
 */

export type PuzzleVariant = 'proceso' | 'casos' | 'sobre';
export type PuzzleMode = 'orden' | 'clasificar' | 'emparejar';

interface PuzzleText {
  badge: string;
  /** Mecánica y duración: se ve antes de jugar, para que la diferencia se note. */
  kind: string;
  restart: string;
  title: string;
  rule: string;
  solvedLabel: string;
  solved: string;
  /** Por qué el puzzle tiene esta mecánica. Se abre al resolverlo. */
  why: string;
}

interface Orden extends PuzzleText {
  steps: readonly string[];
}

/** Las frases de `casos` llegan de cases.ts por props; aquí no se duplican. */
type Clasificar = PuzzleText;

interface Emparejar extends PuzzleText {
  /** Cada trabajo con quién estaba del otro lado. En pantalla se desordenan. */
  pairs: readonly { job: string; person: string }[];
}

export const PUZZLE = {
  proceso: {
    accent: '#8B7BF0',
    mode: 'orden' as const,
    es: {
      badge: 'Puzzle 1 de 3',
      kind: 'Ordenar · 30 segundos',
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
      why: 'Es un puzzle de ordenar porque mi método es un orden. Y un error te devuelve al principio a propósito: en un proyecto, diseñar antes de enunciar el problema también te devuelve al principio, solo que sale más caro.',
    } satisfies Orden,
    en: {
      badge: 'Puzzle 1 of 3',
      kind: 'Ordering · 30 seconds',
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
      why: "It's an ordering puzzle because my method is an order. And a mistake sends you back to the start on purpose: in a project, designing before stating the problem sends you back too, only it costs more.",
    } satisfies Orden,
  },
  casos: {
    accent: '#22D3EE',
    mode: 'clasificar' as const,
    es: {
      badge: 'Puzzle 2 de 3',
      kind: 'Clasificar · 30 segundos',
      restart: 'Empezar de nuevo',
      title: '¿Qué pidieron y qué pasaba?',
      rule: 'Seis frases de los tres casos. Cada una es lo que el cliente pidió o el problema que había de verdad. Toca una y elige dónde va.',
      solvedLabel: 'Exacto',
      solved:
        'El encargo casi nunca es el problema. Por eso cada caso de este portafolio empieza separando esas dos cosas.',
      why: 'Es de clasificar y no de ordenar porque lo primero que hago en un caso no es seguir pasos: es separar lo que me piden de lo que de verdad está pasando. Las seis frases son reales, de los tres casos. Equivocarse no reinicia nada: reencuadrar es criterio, y el criterio se afina probando.',
    } satisfies Clasificar,
    en: {
      badge: 'Puzzle 2 of 3',
      kind: 'Sorting · 30 seconds',
      restart: 'Start over',
      title: 'What was asked, and what was going on?',
      rule: 'Six lines from the three cases. Each one is either what the client asked for or the problem that was really there. Tap one and choose where it goes.',
      solvedLabel: 'Exactly',
      solved:
        "The brief is almost never the problem. That's why every case here starts by separating those two things.",
      why: "It's a sorting puzzle, not an ordering one, because the first thing I do on a case isn't following steps: it's separating what I'm asked for from what's actually going on. All six lines are real, from the three cases. A mistake doesn't reset anything: reframing is judgement, and judgement sharpens by trying.",
    } satisfies Clasificar,
  },
  sobre: {
    accent: '#F0466B',
    mode: 'emparejar' as const,
    es: {
      badge: 'Puzzle 3 de 3',
      kind: 'Emparejar · 20 segundos',
      restart: 'Empezar de nuevo',
      title: 'Quién estaba del otro lado',
      rule: 'Cuatro trabajos, cuatro personas distintas del otro lado. Toca un trabajo y luego a quién tenía que entender.',
      pairs: [
        { job: 'ETB · 2024', person: 'Más de 500 personas al mes usando plataformas internas' },
        { job: 'genia · 2024–2025', person: 'Quien entraba a un sitio y terminaba jugando' },
        { job: 'Ropofy · 2025–2026', person: 'El cliente que escribía por tres canales y esperaba respuesta' },
        { job: 'QStrauss · 2026–hoy', person: 'El equipo del cliente que se queda con la plataforma' },
      ],
      solvedLabel: 'Ese es el camino',
      solved:
        'De pantallas internas a arquitectura de plataforma. Lo que no cambió en ninguno: preguntar qué necesita la persona del otro lado antes de proponer nada.',
      why: 'Es de emparejar porque mi trayectoria no se entiende en orden —las fechas ya están arriba—, sino en relación: en cada trabajo cambió quién estaba del otro lado, y eso cambió el trabajo. Cuatro escalas distintas, la misma pregunta.',
    } satisfies Emparejar,
    en: {
      badge: 'Puzzle 3 of 3',
      kind: 'Matching · 20 seconds',
      restart: 'Start over',
      title: 'Who was on the other side',
      rule: 'Four jobs, four different people on the other side. Tap a job, then the person I had to understand.',
      pairs: [
        { job: 'ETB · 2024', person: '500+ people a month using internal platforms' },
        { job: 'genia · 2024–2025', person: 'Whoever landed on a site and ended up playing' },
        { job: 'Ropofy · 2025–2026', person: 'The customer writing on three channels, waiting for a reply' },
        { job: 'QStrauss · 2026–now', person: "The client's team that keeps the platform" },
      ],
      solvedLabel: "That's the path",
      solved:
        'From internal screens to platform architecture. What never changed: asking what the person on the other side needs before proposing anything.',
      why: "It's a matching puzzle because my track record doesn't read in order — the dates are right above — but in relation: in each job the person on the other side changed, and that changed the work. Four different scales, the same question.",
    } satisfies Emparejar,
  },
} as const;

export const PUZZLE_UI = {
  es: {
    of: 'de',
    sonidoOn: 'Silenciar',
    sonidoOff: 'Activar sonido',
    why: '¿Por qué este puzzle es así?',
    orden: {
      idle: 'Toca el siguiente paso',
      wrong: 'Ese no va ahí — vuelve a empezar',
    },
    clasificar: {
      idle: 'Toca una frase para empezar',
      picked: 'Ahora elige dónde va',
      donde: '¿Dónde va?',
      wrong: 'Esa no va ahí: vuelve a la bandeja',
      right: 'Bien separada',
    },
    emparejar: {
      idle: 'Toca un trabajo y luego a quién tenía del otro lado',
      picked: 'Ahora toca la otra mitad',
      wrong: 'No era esa persona — prueba otra',
      right: 'Pareja encontrada',
      lados: ['Trabajo', 'Del otro lado'],
    },
  },
  en: {
    of: 'of',
    sonidoOn: 'Mute',
    sonidoOff: 'Sound on',
    why: 'Why is this puzzle built this way?',
    orden: {
      idle: 'Tap the next step',
      wrong: "That one doesn't go there — start again",
    },
    clasificar: {
      idle: 'Tap a line to start',
      picked: 'Now choose where it goes',
      donde: 'Where does it go?',
      wrong: 'Not that one: back to the tray',
      right: 'Well sorted',
    },
    emparejar: {
      idle: 'Tap a job, then who was on the other side',
      picked: 'Now tap the other half',
      wrong: 'Not that person — try another',
      right: 'Pair found',
      lados: ['Job', 'On the other side'],
    },
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
