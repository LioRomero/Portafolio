import { useEffect, useRef, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { PUZZLE, PUZZLE_UI, shuffle, seedFor, type PuzzleVariant } from '../content/puzzle';
import { sonar, leerSonido, activarSonido } from '../lib/sonido';
import { leerAvance, guardarAvance } from '../lib/prefs';
import type { Lang } from '../content/ui';

/** Una frase del puzzle de casos: el encargo (0) o el problema real (1). */
export interface FraseCaso {
  texto: string;
  bin: 0 | 1;
  /** De qué caso viene; se revela al acertar. */
  fuente: string;
}

interface Props {
  variant: PuzzleVariant;
  lang: Lang;
  /**
   * Solo en `casos`: las frases reales de los casos y el nombre de las dos
   * columnas. Llegan de la página, desde cases.ts: así no se duplican y la isla
   * no carga el diccionario de casos entero.
   */
  frases?: FraseCaso[];
  columnas?: [string, string];
}

/* El avance de clasificar y emparejar se guarda como máscara de bits: cada
   bit es una frase colocada o una pareja unida. */
const cuenta = (m: number) => {
  let c = 0;
  for (let x = m; x; x >>= 1) c += x & 1;
  return c;
};
const tiene = (m: number, i: number) => ((m >> i) & 1) === 1;

/**
 * Tres puzzles, tres mecánicas: la mecánica es la idea que enseña. Ordenar el
 * método, clasificar lo que pidieron frente a lo que pasaba, emparejar cada
 * trabajo con quién estaba del otro lado.
 *
 * Clases con prefijo `pz-`: los `<style>` de Preact no están encapsulados.
 */
export default function Puzzle(props: Props) {
  const modo = PUZZLE[props.variant].mode;
  if (modo === 'clasificar') return <PuzzleClasificar {...props} />;
  if (modo === 'emparejar') return <PuzzleEmparejar {...props} />;
  return <PuzzleOrden {...props} />;
}

/* ── Marco común ──────────────────────────────────────────────────────────── */

interface MarcoProps {
  variant: PuzzleVariant;
  lang: Lang;
  total: number;
  hechos: number;
  feedback: string;
  tono?: 'wrong' | 'right';
  sacudir?: boolean;
  mostrarReinicio: boolean;
  onReiniciar: () => void;
  children: ComponentChildren;
}

function Marco(p: MarcoProps) {
  const set = PUZZLE[p.variant];
  const c = set[p.lang];
  const ui = PUZZLE_UI[p.lang];
  const [suena, setSuena] = useState(true);
  useEffect(() => {
    setSuena(leerSonido());
  }, []);
  const done = p.hechos >= p.total;

  return (
    <section
      class={p.sacudir ? 'pz-shell pz-shake' : 'pz-shell'}
      data-modo={set.mode}
      style={{ '--accent': set.accent } as Record<string, string>}
      aria-label={c.title}
    >
      <header class="pz-head">
        <span class="pz-badge">{c.badge}</span>
        <span class="pz-kind">{c.kind}</span>
        <span class="pz-spacer" />
        {/* El interruptor de sonido también vive en el panel curioso, pero
            ahí no lo encuentra quien está jugando. Aquí está donde suena. */}
        <button
          type="button"
          class={suena ? 'pz-sonido pz-sonido--on' : 'pz-sonido'}
          aria-pressed={suena}
          onClick={() => {
            const v = !suena;
            setSuena(v);
            activarSonido(v);
            if (v) sonar('elegir');
          }}
        >
          {suena ? ui.sonidoOn : ui.sonidoOff}
        </button>
        {p.mostrarReinicio && (
          <button type="button" class="pz-restart" onClick={p.onReiniciar}>
            {c.restart}
          </button>
        )}
      </header>

      <h3 class="pz-title">{c.title}</h3>
      <p class="pz-rule">{c.rule}</p>

      <div class="pz-progress">
        <div class="pz-pips" aria-hidden="true">
          {Array.from({ length: p.total }, (_, i) => (
            <span class={i < p.hechos ? 'pz-pip pz-pip--on' : 'pz-pip'} />
          ))}
        </div>
        <span class="pz-count tabular">
          {p.hechos} {ui.of} {p.total}
        </span>
        <span class={p.tono ? `pz-feedback pz-feedback--${p.tono}` : 'pz-feedback'} aria-live="polite">
          {done ? '' : p.feedback}
        </span>
      </div>

      {p.children}

      {done && (
        <div class="pz-solved">
          <div class="pz-solved-label">{c.solvedLabel}</div>
          <p class="pz-solved-text">{c.solved}</p>
        </div>
      )}

      {/* El porqué de la mecánica, para quien quiera leerlo antes; al resolver
          se abre solo, porque ahí es cuando se entiende. */}
      <details class="pz-why" open={done || undefined}>
        <summary>{ui.why}</summary>
        <p>{c.why}</p>
      </details>

      <style>{CSS}</style>
    </section>
  );
}

/* ── Fantasma de arrastre (compartido) ────────────────────────────────────── */

/** El nodo que sigue al dedo o al cursor. Se mueve con transform: sin relayout. */
const moverA = (el: HTMLElement | null, x: number, y: number) => {
  if (el) el.style.transform = `translate(${x}px, ${y}px)`;
};

/**
 * Qué destino hay bajo el puntero. Primero pregunta al navegador y, si no
 * responde, compara contra los rectángulos: `elementFromPoint` devuelve null
 * si algo se interpone, y entonces el arrastre se sentiría roto.
 */
function destinoBajo(raiz: HTMLElement | null, attr: string, x: number, y: number): number | null {
  if (!raiz) return null;
  const hit = document.elementFromPoint(x, y)?.closest(`[${attr}]`);
  if (hit && raiz.contains(hit)) {
    const v = Number(hit.getAttribute(attr));
    if (!Number.isNaN(v)) return v;
  }
  for (const nodo of raiz.querySelectorAll<HTMLElement>(`[${attr}]`)) {
    const b = nodo.getBoundingClientRect();
    if (b.width && x >= b.left && x <= b.right && y >= b.top && y <= b.bottom) {
      const v = Number(nodo.getAttribute(attr));
      if (!Number.isNaN(v)) return v;
    }
  }
  return null;
}

/* ── 1 · Ordenar: el método es una secuencia ──────────────────────────────── */

function PuzzleOrden({ variant, lang }: Props) {
  const c = PUZZLE.proceso[lang];
  const ui = PUZZLE_UI[lang].orden;
  const n = c.steps.length;

  const [pz, setPz] = useState(0);
  const [wrong, setWrong] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  /* Arrastre: una capa encima del toque, nunca en lugar de él (WCAG 2.5.7).
     Tocar las fichas en orden sigue siendo el camino principal. */
  const [arrastrando, setArrastrando] = useState<number | null>(null);
  const [sobreHueco, setSobreHueco] = useState<number | null>(null);
  const fantasma = useRef<HTMLDivElement | null>(null);
  const tablero = useRef<HTMLDivElement | null>(null);
  const movido = useRef(false);
  /* Un arrastre que acierta ya resolvió la jugada, pero el navegador dispara su
     `click` justo después sobre la misma ficha. Esta bandera se lo come. */
  const ignorarClick = useRef(false);

  /* Permutación determinista: mismo desorden en cada render y en cada visita. */
  const order = shuffle(n, seedFor(n));
  const done = pz >= n;

  useEffect(() => {
    /* El avance se recupera después del montaje: en el servidor no hay
       sessionStorage, y sembrarlo ahí desajustaría la hidratación. */
    const guardado = leerAvance(variant);
    if (guardado > 0 && guardado <= n) setPz(guardado);
    return () => clearTimeout(timer.current);
  }, []);

  const jugar = (i: number) => {
    if (i === pz) {
      const fin = pz + 1;
      setPz(fin);
      guardarAvance(variant, fin);
      setWrong(false);
      sonar(fin >= n ? 'completo' : 'acierto');
      return;
    }
    /* Reiniciar es la regla: saltarse un paso en un proyecto también cuesta. */
    clearTimeout(timer.current);
    setPz(0);
    guardarAvance(variant, 0);
    setWrong(true);
    sonar('error');
    timer.current = window.setTimeout(() => setWrong(false), 3200);
  };

  const reiniciar = () => {
    clearTimeout(timer.current);
    setPz(0);
    guardarAvance(variant, 0);
    setWrong(false);
  };

  return (
    <Marco
      variant={variant}
      lang={lang}
      total={n}
      hechos={pz}
      feedback={wrong ? ui.wrong : ui.idle}
      tono={wrong ? 'wrong' : undefined}
      sacudir={wrong}
      mostrarReinicio={pz > 0 || wrong}
      onReiniciar={reiniciar}
    >
      <div ref={tablero}>
        <ol class="pz-slots">
          {c.steps.map((label, i) => {
            const filled = i < pz;
            const activo = !filled && i === pz && arrastrando !== null;
            const encima = sobreHueco === i && arrastrando !== null;
            return (
              <li
                data-hueco={i}
                class={
                  'pz-slot' +
                  (filled ? ' pz-slot--filled' : '') +
                  (activo ? ' pz-slot--activo' : '') +
                  (encima ? (i === pz ? ' pz-slot--encima' : ' pz-slot--encima-mal') : '')
                }
              >
                <span class="pz-slot-n tabular">{String(i + 1).padStart(2, '0')}</span>
                <span class="pz-slot-label">{filled ? label : ''}</span>
              </li>
            );
          })}
        </ol>

        {!done && (
          <div class="pz-chips">
            {order.map((i) => {
              const used = i < pz;
              return (
                <button
                  type="button"
                  class={'pz-chip' + (used ? ' pz-chip--used' : '') + (arrastrando === i ? ' pz-chip--viajando' : '')}
                  disabled={used}
                  onClick={() => {
                    if (ignorarClick.current) {
                      ignorarClick.current = false;
                      return;
                    }
                    jugar(i);
                  }}
                  onPointerDown={(ev: PointerEvent) => {
                    if (ev.button !== undefined && ev.button !== 0) return;
                    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
                    movido.current = false;
                    setArrastrando(i);
                    sonar('elegir');
                    moverA(fantasma.current, ev.clientX, ev.clientY);
                  }}
                  onPointerMove={(ev: PointerEvent) => {
                    if (arrastrando === null) return;
                    movido.current = true;
                    moverA(fantasma.current, ev.clientX, ev.clientY);
                    setSobreHueco(destinoBajo(tablero.current, 'data-hueco', ev.clientX, ev.clientY));
                  }}
                  onPointerUp={(ev: PointerEvent) => {
                    if (arrastrando === null) return;
                    const destino = destinoBajo(tablero.current, 'data-hueco', ev.clientX, ev.clientY);
                    setArrastrando(null);
                    setSobreHueco(null);
                    /* Sin desplazamiento fue un toque: el `click` del navegador
                       ya lo resuelve, adelantarse lo contaría dos veces. */
                    if (!movido.current) return;
                    ignorarClick.current = true;
                    /* Soltar fuera de un hueco no penaliza: cancelar no es equivocarse. */
                    if (destino === null) return;
                    jugar(destino === pz ? i : -1);
                  }}
                  onPointerCancel={() => {
                    setArrastrando(null);
                    setSobreHueco(null);
                  }}
                >
                  {c.steps[i]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {arrastrando !== null && (
        <div class="pz-fantasma" ref={fantasma} aria-hidden="true">
          {c.steps[arrastrando]}
        </div>
      )}
    </Marco>
  );
}

/* ── 2 · Clasificar: reencuadrar es separar ───────────────────────────────── */

function PuzzleClasificar({ variant, lang, frases = [], columnas = ['', ''] }: Props) {
  const ui = PUZZLE_UI[lang].clasificar;
  const n = frases.length;
  const clave = `${variant}-clasificar`;

  const [hechas, setHechas] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [mal, setMal] = useState<number | null>(null);
  const [aviso, setAviso] = useState<'idle' | 'picked' | 'wrong' | 'right'>('idle');
  const [arrastrando, setArrastrando] = useState<number | null>(null);
  const [sobre, setSobre] = useState<number | null>(null);
  const tablero = useRef<HTMLDivElement | null>(null);
  const fantasma = useRef<HTMLDivElement | null>(null);
  const inicio = useRef<{ i: number; x: number; y: number } | null>(null);
  const ignorarClick = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const orden = shuffle(n, seedFor(n) + 5);
  const total = cuenta(hechas);
  const done = n > 0 && total >= n;

  useEffect(() => {
    const g = leerAvance(clave);
    if (g > 0 && g < 1 << n) setHechas(g);
    return () => clearTimeout(timer.current);
  }, []);

  const colocar = (i: number, bin: number) => {
    if (tiene(hechas, i)) return;
    setElegida(null);
    if (frases[i]!.bin === bin) {
      const m = hechas | (1 << i);
      setHechas(m);
      guardarAvance(clave, m);
      setMal(null);
      setAviso('right');
      sonar(cuenta(m) >= n ? 'completo' : 'acierto');
      return;
    }
    /* Equivocarse no reinicia: la frase vuelve a la bandeja y se sigue. */
    clearTimeout(timer.current);
    setMal(i);
    setAviso('wrong');
    sonar('error');
    timer.current = window.setTimeout(() => setMal(null), 1400);
  };

  const elegir = (i: number) => {
    if (tiene(hechas, i)) return;
    const v = elegida === i ? null : i;
    setElegida(v);
    setAviso(v === null ? 'idle' : 'picked');
    if (v !== null) sonar('elegir');
  };

  const reiniciar = () => {
    clearTimeout(timer.current);
    setHechas(0);
    guardarAvance(clave, 0);
    setElegida(null);
    setMal(null);
    setAviso('idle');
  };

  const fb = { idle: ui.idle, picked: ui.picked, wrong: ui.wrong, right: ui.right }[aviso];

  return (
    <Marco
      variant={variant}
      lang={lang}
      total={n}
      hechos={total}
      feedback={fb}
      tono={aviso === 'wrong' ? 'wrong' : aviso === 'right' ? 'right' : undefined}
      mostrarReinicio={total > 0}
      onReiniciar={reiniciar}
    >
      <div class="pz-clasif" ref={tablero}>
        {!done && (
          <ul class="pz-bandeja">
            {orden
              .filter((i) => !tiene(hechas, i))
              .map((i) => (
                <li class="pz-frase-item">
                  <button
                    type="button"
                    class={
                      'pz-frase' +
                      (elegida === i ? ' pz-frase--elegida' : '') +
                      (mal === i ? ' pz-frase--mal' : '') +
                      (arrastrando === i ? ' pz-frase--viajando' : '')
                    }
                    aria-pressed={elegida === i}
                    onClick={() => {
                      if (ignorarClick.current) {
                        ignorarClick.current = false;
                        return;
                      }
                      elegir(i);
                    }}
                    onPointerDown={(ev: PointerEvent) => {
                      if (ev.button !== undefined && ev.button !== 0) return;
                      (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
                      inicio.current = { i, x: ev.clientX, y: ev.clientY };
                    }}
                    onPointerMove={(ev: PointerEvent) => {
                      const ini = inicio.current;
                      if (!ini) return;
                      /* Hasta 6 px es un toque tembloroso, no un arrastre. */
                      if (arrastrando === null) {
                        if (Math.hypot(ev.clientX - ini.x, ev.clientY - ini.y) < 6) return;
                        setArrastrando(ini.i);
                        sonar('elegir');
                      }
                      moverA(fantasma.current, ev.clientX, ev.clientY);
                      setSobre(destinoBajo(tablero.current, 'data-bin', ev.clientX, ev.clientY));
                    }}
                    onPointerUp={(ev: PointerEvent) => {
                      const ini = inicio.current;
                      inicio.current = null;
                      if (!ini || arrastrando === null) return;
                      const b = destinoBajo(tablero.current, 'data-bin', ev.clientX, ev.clientY);
                      setArrastrando(null);
                      setSobre(null);
                      ignorarClick.current = true;
                      if (b !== null) colocar(ini.i, b);
                    }}
                    onPointerCancel={() => {
                      inicio.current = null;
                      setArrastrando(null);
                      setSobre(null);
                    }}
                  >
                    {frases[i]!.texto}
                  </button>
                  {/* Los destinos aparecen junto a la frase elegida: en un
                      teléfono las columnas quedan cientos de píxeles más abajo,
                      detrás de las otras frases, y había que ir a buscarlas. */}
                  {elegida === i && (
                    <div class="pz-mandar" role="group" aria-label={ui.donde}>
                      <span class="pz-mandar-label">{ui.donde}</span>
                      {[0, 1].map((b) => (
                        <button type="button" class="pz-mandar-btn" onClick={() => colocar(i, b)}>
                          {columnas[b]}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
          </ul>
        )}

        <div class="pz-cols">
          {[0, 1].map((b) => {
            const dentro = frases.map((f, i) => ({ f, i })).filter(({ f, i }) => f.bin === b && tiene(hechas, i));
            return (
              <div
                data-bin={b}
                class={
                  'pz-col' +
                  (elegida !== null || arrastrando !== null ? ' pz-col--lista' : '') +
                  (sobre === b ? ' pz-col--encima' : '')
                }
              >
                <button
                  type="button"
                  class="pz-col-head"
                  disabled={elegida === null}
                  onClick={() => elegida !== null && colocar(elegida, b)}
                >
                  <span>{columnas[b]}</span>
                  <span class="pz-col-n tabular">{dentro.length}</span>
                </button>
                <ul class="pz-col-lista">
                  {dentro.map(({ f }) => (
                    <li class="pz-colocada">
                      <span class="pz-fuente">{f.fuente}</span>
                      {f.texto}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {arrastrando !== null && (
        <div class="pz-fantasma pz-fantasma--frase" ref={fantasma} aria-hidden="true">
          {frases[arrastrando]!.texto}
        </div>
      )}
    </Marco>
  );
}

/* ── 3 · Emparejar: la trayectoria se entiende en relación ────────────────── */

function PuzzleEmparejar({ variant, lang }: Props) {
  const c = PUZZLE.sobre[lang];
  const ui = PUZZLE_UI[lang].emparejar;
  const pares = c.pairs;
  const n = pares.length;
  const clave = `${variant}-emparejar`;

  const [unidos, setUnidos] = useState(0);
  const [trabajo, setTrabajo] = useState<number | null>(null);
  const [persona, setPersona] = useState<number | null>(null);
  const [mal, setMal] = useState<[number, number] | null>(null);
  const [aviso, setAviso] = useState<'idle' | 'picked' | 'wrong' | 'right'>('idle');
  const timer = useRef<number | undefined>(undefined);

  const ordenPersonas = shuffle(n, seedFor(n) + 2);
  const total = cuenta(unidos);

  useEffect(() => {
    const g = leerAvance(clave);
    if (g > 0 && g < 1 << n) setUnidos(g);
    return () => clearTimeout(timer.current);
  }, []);

  const intentar = (j: number, p: number) => {
    setTrabajo(null);
    setPersona(null);
    if (j === p) {
      const m = unidos | (1 << j);
      setUnidos(m);
      guardarAvance(clave, m);
      setAviso('right');
      sonar(cuenta(m) >= n ? 'completo' : 'acierto');
      return;
    }
    /* Una pareja equivocada se suelta sola; las ya unidas se quedan. */
    clearTimeout(timer.current);
    setMal([j, p]);
    setAviso('wrong');
    sonar('error');
    timer.current = window.setTimeout(() => setMal(null), 1400);
  };

  /* Se puede empezar por cualquiera de los dos lados. */
  const tocar = (lado: 'trabajo' | 'persona', idx: number) => {
    if (tiene(unidos, idx)) return;
    if (lado === 'trabajo' && persona !== null) return intentar(idx, persona);
    if (lado === 'persona' && trabajo !== null) return intentar(trabajo, idx);
    const actual = lado === 'trabajo' ? trabajo : persona;
    const v = actual === idx ? null : idx;
    (lado === 'trabajo' ? setTrabajo : setPersona)(v);
    setAviso(v === null ? 'idle' : 'picked');
    if (v !== null) sonar('elegir');
  };

  const reiniciar = () => {
    clearTimeout(timer.current);
    setUnidos(0);
    guardarAvance(clave, 0);
    setTrabajo(null);
    setPersona(null);
    setMal(null);
    setAviso('idle');
  };

  const fb = { idle: ui.idle, picked: ui.picked, wrong: ui.wrong, right: ui.right }[aviso];

  return (
    <Marco
      variant={variant}
      lang={lang}
      total={n}
      hechos={total}
      feedback={fb}
      tono={aviso === 'wrong' ? 'wrong' : aviso === 'right' ? 'right' : undefined}
      mostrarReinicio={total > 0}
      onReiniciar={reiniciar}
    >
      <div class="pz-pares">
        <div class="pz-lado">
          <div class="pz-lado-label">{ui.lados[0]}</div>
          <ul>
            {pares.map((p, j) => {
              const hecho = tiene(unidos, j);
              return (
                <li>
                  <button
                    type="button"
                    class={
                      'pz-par' +
                      (hecho ? ' pz-par--unido' : '') +
                      (trabajo === j ? ' pz-par--elegido' : '') +
                      (mal?.[0] === j ? ' pz-par--mal' : '')
                    }
                    aria-pressed={trabajo === j}
                    disabled={hecho}
                    onClick={() => tocar('trabajo', j)}
                  >
                    <span class="pz-par-job">{p.job}</span>
                    {hecho && <span class="pz-par-con">{p.person}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div class="pz-lado">
          <div class="pz-lado-label">{ui.lados[1]}</div>
          <ul>
            {ordenPersonas.map((k) => {
              const hecho = tiene(unidos, k);
              return (
                <li>
                  <button
                    type="button"
                    class={
                      'pz-par pz-par--persona' +
                      (hecho ? ' pz-par--unido' : '') +
                      (persona === k ? ' pz-par--elegido' : '') +
                      (mal?.[1] === k ? ' pz-par--mal' : '')
                    }
                    aria-pressed={persona === k}
                    disabled={hecho}
                    onClick={() => tocar('persona', k)}
                  >
                    {/* Una vez unida no desaparece: queda en su sitio con su
                        pareja, para que la columna no salte al resolverse. */}
                    {hecho ? <span class="pz-par-hecho">✓ {pares[k]!.job}</span> : pares[k]!.person}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Marco>
  );
}

/* ── Estilos ──────────────────────────────────────────────────────────────── */

/* Las grillas usan `minmax(min(100%, X), 1fr)`: en un teléfono angosto la
   columna mínima nunca es más ancha que el contenedor, así que nada desborda. */
const CSS = `
  .pz-shell {
    min-width: 0;
    border: var(--border);
    border-radius: var(--r-card-lg);
    padding: 30px 32px;
    background: var(--bg-2);
  }
  .pz-shake { animation: pzShake .5s ease; }
  @keyframes pzShake {
    10%, 90% { transform: translateX(-2px); }
    30%, 70% { transform: translateX(4px); }
    50% { transform: translateX(-5px); }
  }

  .pz-head {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }
  .pz-badge {
    padding: 5px 12px;
    border-radius: var(--r-pill);
    border: 1px solid var(--accent);
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    color: var(--text);
    font-size: var(--fs-label);
    font-weight: var(--fw-medium);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .pz-kind { font-size: 12px; color: var(--dimmer); }
  .pz-spacer { flex: 1; min-width: 12px; }
  .pz-sonido, .pz-restart {
    padding: 6px 12px;
    border-radius: var(--r-pill);
    background: transparent;
    font-size: 12.5px;
    transition: border-color var(--dur-hover) var(--ease-hover), color var(--dur-hover) var(--ease-hover);
  }
  .pz-sonido { border: 1px solid var(--line-strong); color: var(--dimmer); }
  .pz-sonido:hover { border-color: var(--accent); color: var(--text); }
  .pz-sonido--on { border-color: var(--accent); color: var(--text); }
  .pz-restart { border: var(--border); color: var(--dim); }
  .pz-restart:hover { border-color: var(--accent); color: var(--text); }

  .pz-title {
    font-size: var(--fs-h4);
    line-height: var(--lh-h4);
    letter-spacing: var(--ls-h4);
    margin-bottom: 8px;
  }
  .pz-rule {
    font-size: var(--fs-body);
    line-height: var(--lh-body-sm);
    color: var(--dim);
    margin-bottom: 22px;
    max-width: 600px;
  }

  .pz-progress {
    display: flex;
    align-items: center;
    gap: 8px 12px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .pz-pips { display: flex; gap: 6px; }
  .pz-pip {
    width: 22px;
    height: 4px;
    border-radius: var(--r-pill);
    background: var(--line);
    transition: background var(--dur-state) var(--ease-state);
  }
  .pz-pip--on { background: var(--accent); }
  .pz-count { font-size: 12.5px; color: var(--dimmer); }
  .pz-feedback { font-size: 12.5px; color: var(--dimmer); transition: color var(--dur-hover) var(--ease-hover); }
  .pz-feedback--wrong { color: var(--on-feel); }
  .pz-feedback--right { color: var(--text); }

  /* 1 · Ordenar */
  .pz-slots {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 124px), 1fr));
    gap: 9px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .pz-slot {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    min-height: 74px;
    padding: 12px 14px;
    border-radius: 11px;
    border: var(--border-empty);
    background: var(--surface);
    transition: border-color var(--dur-state) var(--ease-state), background var(--dur-state) var(--ease-state);
  }
  .pz-slot--filled {
    border: 1px solid var(--accent);
    background: color-mix(in srgb, var(--accent) 12%, transparent);
  }
  .pz-slot-n { font-size: 10.5px; font-weight: var(--fw-medium); letter-spacing: 0.1em; color: var(--dimmer); }
  .pz-slot--filled .pz-slot-n { color: var(--text); }
  .pz-slot-label { font-size: 13.5px; line-height: 1.25; color: var(--text); overflow-wrap: anywhere; }
  .pz-chips { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 20px; }
  .pz-chip {
    max-width: 100%;
    padding: 10px 16px;
    border-radius: var(--r-control);
    border: 1px solid var(--line-strong);
    background: var(--surface-2);
    color: var(--text);
    font-size: 14px;
    text-align: left;
    touch-action: none;
    cursor: grab;
    user-select: none;
    transition: border-color var(--dur-hover) var(--ease-hover);
  }
  .pz-chip:hover { border-color: var(--accent); }
  .pz-chip:active { cursor: grabbing; }
  .pz-chip--viajando { opacity: 0.35; border-style: dashed; }
  .pz-chip--used { border-color: var(--line); background: var(--bg-2); color: var(--dimmer); cursor: default; }
  .pz-slot--activo {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent) inset;
    animation: pzLatir 1.4s ease-in-out infinite;
  }
  .pz-slot--encima {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    box-shadow: 0 0 24px -4px var(--accent);
    animation: none;
  }
  .pz-slot--encima-mal {
    border-color: var(--feel);
    background: color-mix(in srgb, var(--feel) 12%, transparent);
    animation: none;
  }
  @keyframes pzLatir {
    0%, 100% { box-shadow: 0 0 0 1px var(--accent) inset; }
    50% { box-shadow: 0 0 0 1px var(--accent) inset, 0 0 18px -6px var(--accent); }
  }

  /* La ficha que viaja con el dedo, fuera del flujo y sin capturar eventos
     para no taparse a sí misma bajo elementFromPoint. */
  .pz-fantasma {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 60;
    pointer-events: none;
    transform: translate(-400px, -400px);
    margin: -18px 0 0 -60px;
    padding: 10px 16px;
    border-radius: var(--r-control);
    border: 1px solid var(--accent);
    background: var(--bg-2);
    color: var(--text);
    font-size: 14px;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
  }
  .pz-fantasma--frase { width: min(280px, 80vw); margin: -24px 0 0 -140px; font-size: 13px; line-height: 1.35; }

  /* 2 · Clasificar */
  .pz-bandeja {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr));
    gap: 10px;
    margin: 0 0 16px;
    padding: 0;
    list-style: none;
  }
  .pz-frase-item { display: flex; flex-direction: column; }
  .pz-frase {
    flex: 1;
    width: 100%;
    min-height: 56px;
    padding: 12px 14px;
    border-radius: var(--r-control);
    border: 1px solid var(--line-strong);
    background: var(--surface-2);
    color: var(--text);
    font-size: 14px;
    line-height: 1.4;
    text-align: left;
    touch-action: none;
    cursor: grab;
    user-select: none;
    transition: border-color var(--dur-hover) var(--ease-hover), background var(--dur-hover) var(--ease-hover);
  }
  .pz-frase:hover { border-color: var(--accent); }
  .pz-frase--elegida {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent) inset;
    background: color-mix(in srgb, var(--accent) 12%, var(--surface-2));
  }
  .pz-frase--mal { border-color: var(--feel); animation: pzShake .5s ease; }
  .pz-frase--viajando { opacity: 0.35; border-style: dashed; }
  .pz-mandar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    animation: pzPop var(--dur-enter) ease both;
  }
  .pz-mandar-label { width: 100%; font-size: 12px; color: var(--dimmer); }
  .pz-mandar-btn {
    flex: 1 1 120px;
    min-height: 44px;
    padding: 8px 12px;
    border-radius: var(--r-control);
    border: 1px solid var(--accent);
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    color: var(--text);
    font-size: 13px;
    transition: background var(--dur-hover) var(--ease-hover);
  }
  .pz-mandar-btn:hover { background: color-mix(in srgb, var(--accent) 24%, transparent); }
  .pz-cols {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
    gap: 12px;
  }
  .pz-col {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
    padding: 12px;
    border-radius: var(--r-card);
    border: var(--border-empty);
    background: var(--surface);
    transition: border-color var(--dur-state) var(--ease-state), background var(--dur-state) var(--ease-state);
  }
  .pz-col--encima { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, transparent); }
  .pz-col-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    min-height: 44px;
    padding: 10px 12px;
    border-radius: var(--r-control);
    border: 1px dashed var(--line-strong);
    background: transparent;
    color: var(--dim);
    font-size: var(--fs-label);
    font-weight: var(--fw-medium);
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    text-align: left;
    transition: border-color var(--dur-hover) var(--ease-hover), color var(--dur-hover) var(--ease-hover);
  }
  .pz-col-head:disabled { cursor: default; }
  .pz-col--lista .pz-col-head { border-style: solid; border-color: var(--accent); color: var(--text); }
  .pz-col--lista .pz-col-head:hover { background: color-mix(in srgb, var(--accent) 12%, transparent); }
  .pz-col-n { color: var(--dimmer); }
  .pz-col-lista { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }
  .pz-colocada {
    padding: 10px 12px;
    border-radius: var(--r-control);
    border: 1px solid var(--accent);
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    font-size: 13.5px;
    line-height: 1.4;
    color: var(--text);
    overflow-wrap: anywhere;
    animation: pzPop var(--dur-enter) ease both;
  }
  .pz-fuente {
    display: block;
    margin-bottom: 4px;
    font-size: 10.5px;
    font-weight: var(--fw-medium);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--dim);
  }

  /* 3 · Emparejar */
  .pz-pares {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
    gap: 16px;
  }
  .pz-lado { min-width: 0; }
  .pz-lado ul { display: flex; flex-direction: column; gap: 9px; margin: 0; padding: 0; list-style: none; }
  .pz-lado-label {
    margin-bottom: 10px;
    font-size: var(--fs-label);
    font-weight: var(--fw-medium);
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--dimmer);
  }
  .pz-par {
    display: flex;
    flex-direction: column;
    gap: 6px;
    justify-content: center;
    width: 100%;
    /* Misma altura a los dos lados: las filas quedan parejas aunque un
       trabajo ocupe una línea y su persona dos. */
    min-height: 66px;
    padding: 12px 14px;
    border-radius: var(--r-control);
    border: 1px solid var(--line-strong);
    background: var(--surface-2);
    color: var(--text);
    font-size: 14px;
    line-height: 1.35;
    text-align: left;
    overflow-wrap: anywhere;
    transition: border-color var(--dur-hover) var(--ease-hover), background var(--dur-hover) var(--ease-hover);
  }
  .pz-par:hover:not(:disabled) { border-color: var(--accent); }
  .pz-par-job { font-weight: var(--fw-medium); }
  .pz-par-con { padding-left: 10px; border-left: 2px solid var(--accent); font-size: 13px; color: var(--dim); }
  .pz-par--elegido {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent) inset;
    background: color-mix(in srgb, var(--accent) 12%, var(--surface-2));
  }
  .pz-par--unido { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 7%, transparent); cursor: default; }
  .pz-par--persona.pz-par--unido { color: var(--dim); }
  .pz-par-hecho { font-size: 13px; }
  .pz-par--mal { border-color: var(--feel); animation: pzShake .5s ease; }

  /* Resultado y porqué */
  .pz-solved {
    margin-top: 22px;
    border: 1px solid var(--accent);
    border-radius: var(--r-card);
    padding: 20px 22px;
    background: color-mix(in srgb, var(--accent) 9%, transparent);
    animation: pzPop var(--dur-enter) ease both;
  }
  @keyframes pzPop {
    from { opacity: 0; transform: scale(.97); }
    to { opacity: 1; transform: none; }
  }
  .pz-solved-label {
    font-size: var(--fs-label);
    font-weight: var(--fw-medium);
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--text);
    margin-bottom: 9px;
  }
  .pz-solved-text { font-size: 15.5px; line-height: var(--lh-body-lg); color: var(--text); }
  .pz-why { margin-top: 18px; padding-top: 12px; border-top: var(--border); }
  .pz-why summary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 32px;
    cursor: pointer;
    list-style: none;
    font-size: 13px;
    color: var(--link);
  }
  .pz-why summary::-webkit-details-marker { display: none; }
  .pz-why summary::before { content: '+'; width: 12px; font-size: 15px; line-height: 1; }
  .pz-why[open] summary::before { content: '−'; }
  .pz-why summary:hover { color: var(--link-hover); }
  .pz-why p {
    margin-top: 6px;
    max-width: 640px;
    font-size: var(--fs-body-sm);
    line-height: var(--lh-body-sm);
    color: var(--dim);
  }

  html[data-motion='off'] .pz-shake,
  html[data-motion='off'] .pz-frase--mal,
  html[data-motion='off'] .pz-par--mal,
  html[data-motion='off'] .pz-slot--activo,
  html[data-motion='off'] .pz-solved,
  html[data-motion='off'] .pz-colocada { animation: none; }
  @media (prefers-reduced-motion: reduce) {
    .pz-shake, .pz-frase--mal, .pz-par--mal, .pz-slot--activo, .pz-solved, .pz-colocada { animation: none; }
  }

  /* Teléfono: los siete huecos en dos columnas y más bajos. En una sola
     columna ocupaban ~570 px y las fichas quedaban fuera de pantalla: tocabas
     una y no veías dónde caía. */
  @media (max-width: 480px) {
    .pz-slots { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .pz-slot { min-height: 62px; padding: 10px 12px; }
  }

  @media (max-width: 900px) {
    .pz-shell { padding: 22px 18px; }
    .pz-chip, .pz-sonido, .pz-restart { min-height: 44px; }
    .pz-why summary { min-height: 44px; }
  }
`;
