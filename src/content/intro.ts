/** Textos de las dos pantallas de carga. Copiados de `Intro.dc.html`. */

export type IntroVariant = 'home' | 'casos' | 'sobre';

export const INTRO = {
  home: {
    es: {
      kicker: 'Bogotá · Remoto global',
      lineA: 'Antes de la pantalla,',
      lineB: 'hay alguien pensando.',
      words: ['Escucho.', 'Diseño.', 'Mido.'],
      close:
        'Este portafolio se puede leer en diez minutos o explorar durante media hora. Tú eliges cuál.',
      skip: 'Saltar intro',
    },
    en: {
      kicker: 'Bogotá · Remote worldwide',
      lineA: 'Before the screen,',
      lineB: "there's someone thinking.",
      words: ['I listen.', 'I design.', 'I measure.'],
      close:
        'You can read this portfolio in ten minutes or explore it for half an hour. Your call.',
      skip: 'Skip intro',
    },
  },
  casos: {
    es: {
      kicker: 'Entrando al proyecto',
      lineA: 'Tres casos, tres problemas que nadie sabía enunciar.',
      hue: '#22D3EE',
      skip: 'Saltar',
    },
    en: {
      kicker: 'Entering the project',
      lineA: 'Three cases, three problems nobody could name.',
      hue: '#22D3EE',
      skip: 'Skip',
    },
  },
  sobre: {
    es: {
      kicker: 'Entrando',
      lineA: 'La persona detrás de los casos.',
      hue: '#F0466B',
      skip: 'Saltar',
    },
    en: {
      kicker: 'Entering',
      lineA: 'The person behind the cases.',
      hue: '#F0466B',
      skip: 'Skip',
    },
  },
} as const;

/** Los tres acentos, en el orden en que entran las palabras de la intro larga. */
export const BEAT_HUES = ['#22D3EE', '#8B7BF0', '#F0466B'] as const;
