/**
 * Ajustes del pincel del fondo pintado.
 *
 * Viven aparte de la isla porque se guardan entre visitas y porque el motor de
 * partículas y el panel de controles tienen que compartir exactamente la misma
 * forma de datos.
 */

export type ModoColor = 'ciclo' | 'mind' | 'clarity' | 'feel';

/**
 * `estela` deja manchas de luz que se abren; `ondas` dibuja anillos que se
 * expanden, como una gota al caer sobre agua quieta.
 */
export type TipoPincel = 'estela' | 'ondas';

export interface Pincel {
  tipo: TipoPincel;
  /** Brillo del trazo, 0–1. Por debajo de ~0.3 apenas se intuye. */
  intensidad: number;
  /** Cuánto se abre la partícula al envejecer, 0–1. */
  dispersion: number;
  /** Gravedad: 0 flota en su sitio, 1 escurre hacia abajo como una gota. */
  caida: number;
  /** Vida de cada trazo en segundos. */
  duracion: number;
  /** Radio base del trazo en píxeles. */
  tamano: number;
  modoColor: ModoColor;
}

/**
 * Por defecto la luz es discreta: el fondo acompaña la lectura, no compite con
 * ella. Quien quiera un rastro más presente lo sube desde el panel.
 */
export const PINCEL_DEFECTO: Pincel = {
  tipo: 'estela',
  intensidad: 0.42,
  dispersion: 0.3,
  caida: 0,
  duracion: 4.2,
  tamano: 90,
  modoColor: 'ciclo',
};

/**
 * Gotas sobre agua quieta: cada punto abre un anillo que se expande y se apaga.
 * Sin caída, porque una onda se abre en la superficie, no se descuelga.
 */
export const PINCEL_GOTAS: Pincel = {
  tipo: 'ondas',
  intensidad: 0.62,
  dispersion: 0.55,
  caida: 0,
  duracion: 3.4,
  tamano: 70,
  modoColor: 'clarity',
};

export const LIMITES = {
  intensidad: { min: 0.1, max: 1, step: 0.02 },
  dispersion: { min: 0, max: 1, step: 0.05 },
  caida: { min: 0, max: 1, step: 0.05 },
  duracion: { min: 1, max: 9, step: 0.2 },
  tamano: { min: 30, max: 160, step: 5 },
} as const;

const CLAVE = 'em-pincel';

const acotar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Nunca confía en lo guardado: un valor fuera de rango rompería el lienzo. */
export function normalizar(bruto: Partial<Pincel> | null | undefined): Pincel {
  const p = { ...PINCEL_DEFECTO, ...(bruto ?? {}) };
  const modos: ModoColor[] = ['ciclo', 'mind', 'clarity', 'feel'];
  const tipos: TipoPincel[] = ['estela', 'ondas'];
  return {
    tipo: tipos.includes(p.tipo) ? p.tipo : 'estela',
    intensidad: acotar(Number(p.intensidad) || PINCEL_DEFECTO.intensidad, 0.1, 1),
    dispersion: acotar(Number(p.dispersion) ?? PINCEL_DEFECTO.dispersion, 0, 1),
    caida: acotar(Number(p.caida) ?? PINCEL_DEFECTO.caida, 0, 1),
    duracion: acotar(Number(p.duracion) || PINCEL_DEFECTO.duracion, 1, 9),
    tamano: acotar(Number(p.tamano) || PINCEL_DEFECTO.tamano, 30, 160),
    modoColor: modos.includes(p.modoColor) ? p.modoColor : 'ciclo',
  };
}

export function leerPincel(): Pincel {
  try {
    return normalizar(JSON.parse(localStorage.getItem(CLAVE) || 'null'));
  } catch {
    return { ...PINCEL_DEFECTO };
  }
}

export function guardarPincel(p: Pincel): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(p));
  } catch {
    /* almacenamiento bloqueado: los ajustes valen para esta sesión */
  }
}
