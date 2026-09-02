import { useEffect, useRef, useState } from 'preact/hooks';
import { PUZZLE, PUZZLE_UI, shuffle, seedFor, type PuzzleVariant } from '../content/puzzle';
import { sonar, leerSonido } from '../lib/sonido';
import { leerAvance, guardarAvance } from '../lib/prefs';
import type { Lang } from '../content/ui';

interface Props {
  variant: PuzzleVariant;
  lang: Lang;
}

/** Clases con prefijo `pz-`: los `<style>` de Preact no están encapsulados. */
export default function Puzzle({ variant, lang }: Props) {
  const set = PUZZLE[variant];
  const c = set[lang];
  const ui = PUZZLE_UI[lang];
  const accent = set.accent;
  const n = c.steps.length;

  const [pz, setPz] = useState(0);
  const [wrong, setWrong] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  /* Arrastre. Es una capa encima del toque, nunca en lugar de el: la WCAG
     2.5.7 exige que todo lo que se arrastra se pueda hacer sin arrastrar, y
     tocar las fichas en orden sigue siendo el camino principal. */
  const [arrastrando, setArrastrando] = useState<number | null>(null);
  const [sobreHueco, setSobreHueco] = useState<number | null>(null);
  const fantasma = useRef<HTMLDivElement | null>(null);
  const shell = useRef<HTMLElement | null>(null);
  const movido = useRef(false);
  /* Un arrastre que acierta ya resolvio la jugada, pero el navegador dispara
     su `click` justo despues sobre la misma ficha. Esta bandera se lo come. */
  const ignorarClick = useRef(false);

  /* Permutación determinista: mismo desorden en cada render y en cada visita. */
  const order = shuffle(n, seedFor(n));
  const done = pz >= n;

  useEffect(() => {
    leerSonido();
    /* El avance se recupera despues del montaje y no en el useState inicial:
       en el render del servidor no hay sessionStorage, y sembrarlo ahi
       desajustaria la hidratacion. */
    const guardado = leerAvance(variant);
    if (guardado > 0 && guardado <= n) setPz(guardado);
    return () => clearTimeout(timer.current);
  }, []);

  const click = (i: number) => {
    if (i === pz) {
      const fin = pz + 1;
      setPz(fin);
      guardarAvance(variant, fin);
      setWrong(false);
      sonar(fin >= n ? 'completo' : 'acierto');
      return;
    }
    clearTimeout(timer.current);
    setPz(0);
    guardarAvance(variant, 0);
    setWrong(true);
    sonar('error');
    timer.current = window.setTimeout(() => setWrong(false), 1600);
  };

  const restart = () => {
    clearTimeout(timer.current);
    setPz(0);
    guardarAvance(variant, 0);
    setWrong(false);
  };

  /* El fantasma es un nodo suelto que sigue al dedo o al cursor. Se mueve con
     transform para no forzar relayout en cada pointermove. */
  const moverFantasma = (x: number, y: number) => {
    if (fantasma.current) fantasma.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  /**
   * Que hueco hay bajo el puntero. Primero pregunta al navegador, y si no
   * responde compara contra los rectangulos de los huecos. La segunda via no
   * es paranoia: `elementFromPoint` devuelve null si algo se interpone o si la
   * pestaña esta en segundo plano, y entonces el arrastre se sentiria roto.
   */
  const huecoBajo = (x: number, y: number): number | null => {
    const raiz = shell.current;
    if (!raiz) return null;

    const el = document.elementFromPoint(x, y);
    const hueco = el?.closest('[data-hueco]');
    if (hueco && raiz.contains(hueco)) {
      const idx = Number((hueco as HTMLElement).dataset.hueco);
      if (!Number.isNaN(idx)) return idx;
    }

    for (const nodo of raiz.querySelectorAll<HTMLElement>('[data-hueco]')) {
      const b = nodo.getBoundingClientRect();
      if (!b.width) continue;
      if (x >= b.left && x <= b.right && y >= b.top && y <= b.bottom) {
        const idx = Number(nodo.dataset.hueco);
        if (!Number.isNaN(idx)) return idx;
      }
    }
    return null;
  };

  const empezarArrastre = (i: number, ev: PointerEvent) => {
    if (ev.button !== undefined && ev.button !== 0) return;
    const chip = ev.currentTarget as HTMLElement;
    chip.setPointerCapture(ev.pointerId);
    movido.current = false;
    setArrastrando(i);
    sonar('elegir');
    moverFantasma(ev.clientX, ev.clientY);
  };

  const seguirArrastre = (ev: PointerEvent) => {
    if (arrastrando === null) return;
    movido.current = true;
    moverFantasma(ev.clientX, ev.clientY);
    setSobreHueco(huecoBajo(ev.clientX, ev.clientY));
  };

  const soltarArrastre = (ev: PointerEvent) => {
    if (arrastrando === null) return;
    const i = arrastrando;
    const destino = huecoBajo(ev.clientX, ev.clientY);
    setArrastrando(null);
    setSobreHueco(null);
    /* Sin desplazamiento real fue un toque, no un arrastre: no se hace nada
       aqui porque el navegador va a disparar su propio `click` justo despues,
       y adelantarse contaria el paso dos veces. */
    if (!movido.current) return;
    /* Soltar fuera de un hueco no penaliza: cancelar no es equivocarse. */
    if (destino === null) {
      ignorarClick.current = true;
      return;
    }
    ignorarClick.current = true;
    click(destino === pz ? i : -1);
  };

  return (
    <section
      ref={shell}
      class={wrong ? 'pz-shell pz-shake' : 'pz-shell'}
      style={{ '--accent': accent } as Record<string, string>}
      aria-label={c.title}
    >
      <header class="pz-head">
        <span class="pz-badge">{c.badge}</span>
        <span class="pz-kind">{c.kind}</span>
        <span class="pz-spacer" />
        {(pz > 0 || wrong) && (
          <button type="button" class="pz-restart" onClick={restart}>
            {c.restart}
          </button>
        )}
      </header>

      <h3 class="pz-title">{c.title}</h3>
      <p class="pz-rule">{c.rule}</p>

      <div class="pz-progress">
        <div class="pz-pips" aria-hidden="true">
          {Array.from({ length: n }, (_, i) => (
            <span class={i < pz ? 'pz-pip pz-pip--on' : 'pz-pip'} />
          ))}
        </div>
        <span class="pz-count tabular">
          {pz} {ui.of} {n}
        </span>
        <span class={wrong ? 'pz-feedback pz-feedback--wrong' : 'pz-feedback'} aria-live="polite">
          {wrong ? ui.feedbackWrong : done ? '' : ui.feedbackDefault}
        </span>
      </div>

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
                class={
                  'pz-chip' +
                  (used ? ' pz-chip--used' : '') +
                  (arrastrando === i ? ' pz-chip--viajando' : '')
                }
                disabled={used}
                onClick={() => {
                  if (ignorarClick.current) {
                    ignorarClick.current = false;
                    return;
                  }
                  click(i);
                }}
                onPointerDown={(e: PointerEvent) => empezarArrastre(i, e)}
                onPointerMove={seguirArrastre}
                onPointerUp={soltarArrastre}
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

      {arrastrando !== null && (
        <div class="pz-fantasma" ref={fantasma} aria-hidden="true">
          {c.steps[arrastrando]}
        </div>
      )}

      {done && (
        <div class="pz-solved">
          <div class="pz-solved-label">{c.solvedLabel}</div>
          <p class="pz-solved-text">{c.solved}</p>
        </div>
      )}

      <style>{`
        .pz-shell {
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
        html[data-motion='off'] .pz-shake { animation: none; }
        @media (prefers-reduced-motion: reduce) { .pz-shake { animation: none; } }

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
          color: var(--on-mind);
          font-size: var(--fs-label);
          font-weight: var(--fw-medium);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .pz-kind { font-size: 12px; color: var(--dimmer); }
        .pz-spacer { flex: 1; min-width: 20px; }
        .pz-restart {
          padding: 6px 12px;
          border-radius: var(--r-pill);
          border: var(--border);
          background: var(--bg-2);
          color: var(--dim);
          font-size: 12.5px;
          transition: border-color var(--dur-hover) var(--ease-hover),
            color var(--dur-hover) var(--ease-hover);
        }
        .pz-restart:hover { border-color: var(--mind); color: var(--text); }

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
          max-width: 560px;
        }

        .pz-progress {
          display: flex;
          align-items: center;
          gap: 12px;
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
        .pz-feedback {
          font-size: 12.5px;
          color: var(--dimmer);
          transition: color var(--dur-hover) var(--ease-hover);
        }
        .pz-feedback--wrong { color: var(--feel); }

        .pz-slots {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 9px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .pz-slot {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-height: 74px;
          padding: 12px 14px;
          border-radius: 11px;
          border: var(--border-empty);
          background: var(--surface);
          transition: border-color var(--dur-state) var(--ease-state),
            background var(--dur-state) var(--ease-state);
        }
        .pz-slot--filled {
          border: 1px solid var(--accent);
          background: color-mix(in srgb, var(--accent) 12%, transparent);
        }
        .pz-slot-n {
          font-size: 10.5px;
          font-weight: var(--fw-medium);
          letter-spacing: 0.1em;
          color: var(--dimmer);
        }
        .pz-slot--filled .pz-slot-n { color: var(--on-mind); }
        .pz-slot-label {
          font-size: 13.5px;
          font-weight: var(--fw-regular);
          line-height: 1.25;
          color: var(--text);
        }

        .pz-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 20px;
        }
        .pz-chip {
          padding: 10px 16px;
          border-radius: var(--r-control);
          border: 1px solid var(--line-strong);
          background: var(--surface-2);
          color: var(--text);
          font-size: 14px;
          text-align: left;
          transition: border-color var(--dur-hover) var(--ease-hover);
        }
        .pz-chip:hover { border-color: var(--accent); }
        /* El puntero no arrastra texto ni hace scroll mientras se lleva una
           ficha; sin esto el gesto pelea con el desplazamiento en tactil. */
        .pz-chip { touch-action: none; cursor: grab; user-select: none; }
        .pz-chip--used { cursor: default; }
        .pz-chip:active { cursor: grabbing; }
        .pz-chip--viajando {
          opacity: 0.35;
          border-style: dashed;
        }

        /* El hueco que toca encender: respira mientras hay una ficha en el
           aire, se ilumina si la ficha va bien y se marca en coral si no. */
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
        html[data-motion='off'] .pz-slot--activo { animation: none; }

        /* La ficha que viaja con el dedo. Fuera del flujo y sin capturar
           eventos, para no taparse a si misma bajo elementFromPoint. */
        .pz-fantasma {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 60;
          pointer-events: none;
          transform: translate(-100px, -100px);
          margin: -18px 0 0 -60px;
          padding: 10px 16px;
          border-radius: var(--r-control);
          border: 1px solid var(--accent);
          background: var(--bg-2);
          color: var(--text);
          font-size: 14px;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
        }
        .pz-chip--used {
          border-color: var(--line);
          background: var(--bg-2);
          color: var(--dimmer);
          cursor: default;
        }

        .pz-solved {
          margin-top: 22px;
          border: 1px solid var(--mind);
          border-radius: var(--r-card);
          padding: 20px 22px;
          background: color-mix(in srgb, var(--mind) 10%, transparent);
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
          color: var(--on-mind);
          margin-bottom: 9px;
        }
        .pz-solved-text {
          font-size: 15.5px;
          line-height: var(--lh-body-lg);
          color: var(--text);
        }

        @media (max-width: 900px) {
          .pz-shell { padding: 22px 18px; }
          .pz-chip { min-height: 44px; }
        }
      `}</style>
    </section>
  );
}
