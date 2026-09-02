/**
 * Estado compartido que vive por encima de las páginas.
 *
 * Cuatro valores persisten en localStorage. No hace falta un gestor de estado:
 * getters/setters + un CustomEvent bastan, y el módulo pesa unos cientos de bytes.
 */

export type Lang = 'es' | 'en';
export type Mode = 'explorar' | 'grano';

export interface Note {
  id: string;
  mood: 'claridad' | 'curiosidad' | 'duda' | 'inspiracion' | 'sugerencia';
  text: string;
  name?: string;
  at: number;
}

export const KEYS = {
  lang: 'em-lang',
  mode: 'em-mode',
  tutorialSeen: 'em-tutorial-seen',
  notes: 'em-canvas-notes',
} as const;

export const DEFAULTS = {
  lang: 'es' as Lang,
  /**
   * Arranca en "grano": un reclutador con diez minutos ve el portafolio completo
   * sin capa lúdica y la activa si quiere. Ningún dato vive solo en "explorar".
   */
  mode: 'grano' as Mode,
} as const;

/**
 * La intro se reproduce una vez por sesión, no en cada carga de página.
 * sessionStorage, no localStorage: en una visita nueva vuelve a verse.
 */
export const INTRO_SESSION_KEY = 'em-intro-seen';

export function isIntroSeen(page: string): boolean {
  try {
    return sessionStorage.getItem(`${INTRO_SESSION_KEY}:${page}`) === '1';
  } catch {
    return false;
  }
}

export function markIntroSeen(page: string): void {
  try {
    sessionStorage.setItem(`${INTRO_SESSION_KEY}:${page}`, '1');
  } catch {
    /* almacenamiento bloqueado: la intro se repetirá, sin más consecuencias */
  }
}

/** Máximo de notas del canvas; las más recientes primero. */
export const MAX_NOTES = 40;

export const PREFS_EVENT = 'em:prefs';

export interface PrefsChange<K extends keyof typeof KEYS = keyof typeof KEYS> {
  key: K;
  value: unknown;
}

const canStore = (): boolean => {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    // Safari en modo privado y iframes con almacenamiento bloqueado.
    return false;
  }
};

const read = (key: string): string | null => {
  if (!canStore()) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string | null): void => {
  if (!canStore()) return;
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* cuota llena o almacenamiento bloqueado: el sitio sigue funcionando */
  }
};

const emit = (key: keyof typeof KEYS, value: unknown): void => {
  if (typeof document === 'undefined') return;
  document.dispatchEvent(
    new CustomEvent<PrefsChange>(PREFS_EVENT, { detail: { key, value } })
  );
};

/* --- Idioma --------------------------------------------------------------- */

export function getLang(): Lang {
  const v = read(KEYS.lang);
  return v === 'es' || v === 'en' ? v : DEFAULTS.lang;
}

export function setLang(lang: Lang): void {
  write(KEYS.lang, lang);
  if (typeof document !== 'undefined') document.documentElement.lang = lang;
  emit('lang', lang);
}

/* --- Modo de lectura ------------------------------------------------------ */

export function getMode(): Mode {
  const v = read(KEYS.mode);
  return v === 'explorar' || v === 'grano' ? v : DEFAULTS.mode;
}

export function setMode(mode: Mode): void {
  write(KEYS.mode, mode);
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.mode = mode;
  }
  emit('mode', mode);
}

/* --- Tutorial ------------------------------------------------------------- */

export function isTutorialSeen(): boolean {
  return read(KEYS.tutorialSeen) === '1';
}

export function markTutorialSeen(): void {
  write(KEYS.tutorialSeen, '1');
  emit('tutorialSeen', true);
}

/* --- Notas del canvas (solo en el navegador de quien escribe) -------------- */

export function getNotes(): Note[] {
  const raw = read(KEYS.notes);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Note[]) : [];
  } catch {
    return [];
  }
}

export function setNotes(notes: Note[]): Note[] {
  const trimmed = notes.slice(0, MAX_NOTES);
  write(KEYS.notes, JSON.stringify(trimmed));
  emit('notes', trimmed);
  return trimmed;
}

export function addNote(note: Note): Note[] {
  return setNotes([note, ...getNotes()]);
}

export function removeNote(id: string): Note[] {
  return setNotes(getNotes().filter((n) => n.id !== id));
}

export function clearNotes(): Note[] {
  return setNotes([]);
}

/* --- Suscripción ---------------------------------------------------------- */

export function onPrefsChange(handler: (change: PrefsChange) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<PrefsChange>).detail);
  document.addEventListener(PREFS_EVENT, listener);
  return () => document.removeEventListener(PREFS_EVENT, listener);
}

/**
 * Progreso de los juegos, guardado por sesión del navegador.
 *
 * `sessionStorage` es justo la memoria que hace falta: sobrevive a un refresco
 * —perder el avance por recargar sin querer es una crueldad— y se borra al
 * cerrar el navegador, así que quien vuelve otro día se encuentra los juegos
 * y las animaciones como la primera vez.
 */
export function leerAvance(clave: string): number {
  try {
    const v = Number(sessionStorage.getItem('em-avance:' + clave));
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch {
    return 0;
  }
}

export function guardarAvance(clave: string, valor: number): void {
  try {
    if (valor > 0) sessionStorage.setItem('em-avance:' + clave, String(valor));
    else sessionStorage.removeItem('em-avance:' + clave);
  } catch {
    /* almacenamiento bloqueado: el avance dura lo que la pestaña */
  }
}
