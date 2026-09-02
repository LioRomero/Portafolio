/**
 * Sonido de interfaz, sintetizado en el momento.
 *
 * No hay archivos de audio: cada tono se genera con osciladores del Web Audio
 * API, así que la capa entera pesa alrededor de un kilobyte y no descarga
 * nada. Un `.mp3` corto por evento habría costado más que todo el JavaScript
 * de los puzzles.
 *
 * Va apagado por defecto, y no solo por cortesía: el navegador bloquea el
 * audio hasta que hay un gesto del usuario, así que el contexto se crea en el
 * primer clic y no antes. Quien no lo encienda nunca oye nada.
 */

const CLAVE = 'em-sound';

let ctx: AudioContext | null = null;
let encendido = false;

/** Lee la preferencia guardada. En SSR no hay `window`, así que devuelve false. */
export const sonidoActivo = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(CLAVE) === '1';
  } catch {
    return false;
  }
};

export const activarSonido = (valor: boolean): void => {
  encendido = valor;
  try {
    window.localStorage.setItem(CLAVE, valor ? '1' : '0');
  } catch {
    /* modo privado: la preferencia dura lo que la pestaña */
  }
  window.dispatchEvent(new CustomEvent('em:sonido', { detail: valor }));
};

/** Sincroniza el estado interno al montar una isla. */
export const leerSonido = (): boolean => {
  encendido = sonidoActivo();
  return encendido;
};

type Voz = { f: number; a: number; dur: number; tipo?: OscillatorType; retraso?: number };

/**
 * Cada evento tiene su gesto melódico: subir cuando algo encaja, caer cuando
 * no, y un arpegio corto al terminar. Las duraciones son cortas a propósito;
 * un sonido de interfaz que se nota es un sonido que molesta a la tercera vez.
 */
const VOCES: Record<string, Voz[]> = {
  elegir: [{ f: 520, a: 0.05, dur: 0.05 }],
  acierto: [
    { f: 660, a: 0.06, dur: 0.07 },
    { f: 880, a: 0.05, dur: 0.09, retraso: 0.06 },
  ],
  error: [
    { f: 200, a: 0.07, dur: 0.16, tipo: 'triangle' },
    { f: 150, a: 0.06, dur: 0.2, tipo: 'triangle', retraso: 0.08 },
  ],
  completo: [
    { f: 523, a: 0.06, dur: 0.12 },
    { f: 659, a: 0.06, dur: 0.12, retraso: 0.09 },
    { f: 784, a: 0.07, dur: 0.26, retraso: 0.18 },
  ],
};

export type Evento = keyof typeof VOCES;

export function sonar(evento: Evento): void {
  if (!encendido || typeof window === 'undefined') return;
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx ??= new Ctor();
    if (ctx.state === 'suspended') void ctx.resume();

    const ahora = ctx.currentTime;
    for (const v of VOCES[evento] ?? []) {
      const t = ahora + (v.retraso ?? 0);
      const osc = ctx.createOscillator();
      const gan = ctx.createGain();
      osc.type = v.tipo ?? 'sine';
      osc.frequency.setValueAtTime(v.f, t);
      /* Ataque y caída suaves: un gain que salta de 0 a 1 suena a chasquido. */
      gan.gain.setValueAtTime(0.0001, t);
      gan.gain.exponentialRampToValueAtTime(v.a, t + 0.012);
      gan.gain.exponentialRampToValueAtTime(0.0001, t + v.dur);
      osc.connect(gan).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + v.dur + 0.02);
    }
  } catch {
    /* si el navegador no deja sonar, el juego sigue funcionando igual */
  }
}
