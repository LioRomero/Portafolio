/**
 * Notas escondidas. Cada punto es una isla propia y el contador vive en el panel
 * curioso, así que el estado se comparte con localStorage + un evento, igual que
 * las preferencias — sin gestor de estado global.
 */

export const FINDS_KEY = 'em-found';
export const FINDS_EVENT = 'em:finds';
export const TOTAL_FINDS = 8;

export function getFinds(): number[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(FINDS_KEY) || '[]');
    return Array.isArray(parsed) ? (parsed as number[]) : [];
  } catch {
    return [];
  }
}

function save(found: number[]): void {
  try {
    localStorage.setItem(FINDS_KEY, JSON.stringify(found));
  } catch {
    /* almacenamiento bloqueado: el contador no persiste, nada más */
  }
  document.dispatchEvent(new CustomEvent<number[]>(FINDS_EVENT, { detail: found }));
}

/** Alterna una nota. Devuelve la lista resultante. */
export function toggleFind(i: number): number[] {
  const found = getFinds();
  const next = found.includes(i) ? found.filter((x) => x !== i) : found.concat([i]);
  save(next);
  return next;
}

export function resetFinds(): number[] {
  save([]);
  return [];
}

export function onFindsChange(handler: (found: number[]) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<number[]>).detail);
  document.addEventListener(FINDS_EVENT, listener);
  return () => document.removeEventListener(FINDS_EVENT, listener);
}
