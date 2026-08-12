import { useEffect, useRef, useState } from 'preact/hooks';
import { PUZZLE, PUZZLE_UI, shuffle, seedFor, type PuzzleVariant } from '../content/puzzle';
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

  /* Permutación determinista: mismo desorden en cada render y en cada visita. */
  const order = shuffle(n, seedFor(n));
  const done = pz >= n;

  useEffect(() => () => clearTimeout(timer.current), []);

  const click = (i: number) => {
    if (i === pz) {
      setPz(pz + 1);
      setWrong(false);
      return;
    }
    clearTimeout(timer.current);
    setPz(0);
    setWrong(true);
    timer.current = window.setTimeout(() => setWrong(false), 1600);
  };

  const restart = () => {
    clearTimeout(timer.current);
    setPz(0);
    setWrong(false);
  };

  return (
    <section
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
          return (
            <li class={filled ? 'pz-slot pz-slot--filled' : 'pz-slot'}>
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
                class={used ? 'pz-chip pz-chip--used' : 'pz-chip'}
                disabled={used}
                onClick={() => click(i)}
              >
                {c.steps[i]}
              </button>
            );
          })}
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
