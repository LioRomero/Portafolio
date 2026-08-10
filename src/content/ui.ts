/**
 * Cadenas compartidas por la barra superior y los controles globales.
 * Textos copiados literalmente de los archivos de referencia.
 */

export type Lang = 'es' | 'en';

export const UI = {
  es: {
    navCases: 'Casos',
    navMethod: 'Método',
    navAbout: 'Sobre mí',
    navHome: 'Inicio',
    modeQuick: 'Al grano',
    modeExplore: 'Explorar',
    modeTitle:
      'Al grano deja solo el trabajo: problema, decisión, resultado. Explorar añade los puzzles, las notas escondidas, la luz y el sonido. No se pierde información en ninguno.',
    tutorialTitle: 'Cómo se lee este portafolio',
    langTitle:
      'Cambia todo el contenido del portafolio entre español e inglés — no solo los menús. Los casos, las citas y las notas están escritos en los dos idiomas.',
    langBtn: 'EN',
    curious: 'Modo curioso',
    curiousTitle: 'Modo curioso — notas escondidas y ajustes de la página',
    letsTalk: 'Hablemos',
    close: 'Cerrar',
    on: 'Activado',
    off: 'Desactivado',
    /**
     * Añadido al portar: el panel de referencia solo ofrecía "Limpiar el fondo
     * pintado". El README pide que cada interacción ambiental pueda apagarse,
     * así que el fondo necesita su propio interruptor además del botón de limpiar.
     */
    paintBg: 'Fondo pintado',
    /** Contador de la letra chica que revela la linterna. */
    finePrint: 'Letra chica encontrada',
    finePrintHint: 'Enciende la linterna y pasa el cursor por el texto.',
    finePrintDone: 'Esa es toda la letra chica. No hay más — como debería ser.',
    /** Etiqueta del bloque siempre visible en móvil, donde no hay linterna. */
    finePrintLabel: 'Letra chica',
    closePlayer: 'Cerrar el reproductor',
    skipToContent: 'Saltar al contenido',
    role: 'Consultoría UX · Investigación · Diseño de servicios',
    location: 'Bogotá · Remoto global',
  },
  en: {
    navCases: 'Cases',
    navMethod: 'Method',
    navAbout: 'About',
    navHome: 'Home',
    modeQuick: 'Quick read',
    modeExplore: 'Explore',
    modeTitle:
      "Quick read keeps only the work: problem, decision, result. Explore adds the puzzles, hidden notes, light and sound. Neither one loses information.",
    tutorialTitle: 'How to read this portfolio',
    langTitle:
      "Switches all the portfolio's content between Spanish and English — not just the menus. The cases, quotes and notes are written in both languages.",
    langBtn: 'ES',
    curious: 'Curious mode',
    curiousTitle: 'Curious mode — hidden notes and page settings',
    letsTalk: "Let's talk",
    close: 'Close',
    on: 'On',
    off: 'Off',
    paintBg: 'Painted background',
    finePrint: 'Fine print found',
    finePrintHint: 'Switch the flashlight on and sweep the cursor over the text.',
    finePrintDone: "That's all the fine print. There isn't any more — as it should be.",
    finePrintLabel: 'Fine print',
    closePlayer: 'Close the player',
    skipToContent: 'Skip to content',
    role: 'UX consulting · Research · Service design',
    location: 'Bogotá · Remote worldwide',
  },
} as const;

/**
 * Hojas de vida en PDF, en `public/uploads/`.
 *
 * Si alguna se pone en `null` su enlace desaparece del contacto, en vez de
 * quedar como texto en color de enlace que no lleva a ninguna parte.
 * Para actualizarlas basta con reemplazar el archivo conservando el nombre.
 */
export const CV_PDFS: { es: string | null; en: string | null } = {
  es: '/uploads/cv-emilio-romero-es.pdf',
  en: '/uploads/cv-emilio-romero-en.pdf',
};

/** Rutas equivalentes en cada idioma, para el conmutador de la barra. */
export const ROUTES = {
  es: { home: '/', cases: '/casos', about: '/sobre-mi' },
  en: { home: '/en/', cases: '/en/cases', about: '/en/about' },
} as const;

export type PageKey = keyof (typeof ROUTES)['es'];
