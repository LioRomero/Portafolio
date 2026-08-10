import { useEffect, useRef, useState } from 'preact/hooks';
import { TUTORIAL } from '../content/tutorial';
import { isTutorialSeen, markTutorialSeen } from '../lib/prefs';
import type { Lang } from '../content/ui';

interface Props {
  lang: Lang;
  /** 6s en la home, 2.6s en las otras páginas. */
  delay: number;
}

/** Clases con prefijo `tu-`: los `<style>` de Preact no están encapsulados. */
export default function Tutorial({ lang, delay }: Props) {
  const t = TUTORIAL[lang];
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const dialog = useRef<HTMLDivElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const last = i === t.steps.length - 1;
  const step = t.steps[Math.min(i, t.steps.length - 1)]!;

  const close = () => {
    markTutorialSeen();
    setOpen(false);
    returnFocus.current?.focus();
  };

  const next = () => (last ? close() : setI(i + 1));
  const prev = () => setI(Math.max(0, i - 1));

  /* Aparece una sola vez por visitante; reabrible con el botón `?` de la barra. */
  useEffect(() => {
    let timer: number | undefined;
    if (!isTutorialSeen()) {
      timer = window.setTimeout(() => setOpen(true), delay);
    }
    const onOpen = () => {
      setI(0);
      setOpen(true);
    };
    window.addEventListener('em-open-tutorial', onOpen);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('em-open-tutorial', onOpen);
    };
  }, [delay]);

  /* Teclado: ← → para navegar, Esc para cerrar, Tab atrapado dentro del modal. */
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    dialog.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'Tab') {
        const focusables = dialog.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0]!;
        const lastEl = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!open) return null;

  return (
    <div class="tu-veil" onClick={(e) => e.target === e.currentTarget && close()}>
      <div
        class="tu-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t.label}
        tabIndex={-1}
        ref={dialog}
      >
        <header class="tu-head">
          <span class="tu-head-label">{t.label}</span>
          <span class="tu-head-rule" />
          <span class="tu-head-count tabular">
            {i + 1} / {t.steps.length}
          </span>
          <button type="button" class="tu-x" aria-label={t.close} onClick={close}>
            ✕
          </button>
        </header>

        <div class="tu-icon" aria-hidden="true">
          {step.icon}
        </div>

        <h2 class="tu-title">{step.title}</h2>
        <p class="tu-body">{step.body}</p>

        <div class="tu-why">
          <div class="tu-why-label">{t.whyLabel}</div>
          <p class="tu-why-text">{step.why}</p>
        </div>

        <div class="tu-pips">
          {t.steps.map((_, k) => (
            <button
              type="button"
              class={k === i ? 'tu-pip tu-pip--on' : k < i ? 'tu-pip tu-pip--past' : 'tu-pip'}
              aria-label={`${k + 1} / ${t.steps.length}`}
              aria-current={k === i}
              onClick={() => setI(k)}
            />
          ))}
        </div>

        <footer class="tu-foot">
          {i > 0 && (
            <button type="button" class="tu-back" onClick={prev}>
              {t.prev}
            </button>
          )}
          <button
            type="button"
            class={last ? 'tu-primary tu-primary--last' : 'tu-primary'}
            onClick={next}
          >
            {last ? t.done : t.next}
          </button>
          <span class="tu-spacer" />
          <button type="button" class="tu-skip" onClick={close}>
            {t.skip}
          </button>
        </footer>
      </div>

      <style>{`
        .tu-veil {
          position: fixed;
          inset: 0;
          z-index: var(--z-tutorial);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
          background: rgba(4, 6, 14, .82);
          backdrop-filter: blur(6px);
          animation: tuVeil .3s ease both;
        }
        @keyframes tuVeil { from { opacity: 0; } to { opacity: 1; } }

        .tu-modal {
          width: min(620px, 100%);
          max-height: calc(100vh - 56px);
          overflow-y: auto;
          border: var(--border);
          border-radius: var(--r-modal);
          padding: 36px 38px 30px;
          background: var(--bg-2);
          box-shadow: var(--shadow-modal);
          animation: tuIn var(--dur-enter) var(--ease-enter) both;
        }
        @keyframes tuIn {
          from { opacity: 0; transform: translate3d(0, 16px, 0) scale(.98); }
          to { opacity: 1; transform: none; }
        }

        .tu-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
        }
        .tu-head-label {
          font-size: var(--fs-label);
          font-weight: var(--fw-medium);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--mind);
        }
        .tu-head-rule { flex: 1; height: 1px; background: var(--line); }
        .tu-head-count { font-size: 12.5px; color: var(--dimmer); }
        .tu-x {
          border: 0;
          background: transparent;
          color: var(--dimmer);
          font-size: 16px;
          line-height: 1;
          padding: 0;
        }
        .tu-x:hover { color: var(--text); }

        .tu-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 14px;
          border: 1px solid var(--mind);
          background: var(--mind-14);
          color: var(--on-mind);
          font-size: 24px;
          line-height: 1;
        }

        .tu-title {
          font-size: var(--fs-h3);
          line-height: var(--lh-h3);
          letter-spacing: var(--ls-h3);
          margin: 20px 0 12px;
        }
        .tu-body {
          font-size: var(--fs-body-lg);
          line-height: var(--lh-body-lg);
          color: var(--dim);
          margin-bottom: 16px;
        }

        .tu-why {
          border-left: 2px solid var(--mind);
          padding: 2px 0 2px 18px;
          margin-bottom: 26px;
        }
        .tu-why-label {
          font-size: var(--fs-label);
          font-weight: var(--fw-medium);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--on-mind);
          margin-bottom: 7px;
        }
        .tu-why-text {
          font-size: var(--fs-body-sm);
          line-height: var(--lh-body-sm);
          color: var(--dim);
        }

        .tu-pips { display: flex; gap: 7px; margin-bottom: 24px; }
        .tu-pip {
          width: 9px;
          height: 9px;
          border-radius: var(--r-pill);
          border: 0;
          padding: 0;
          background: var(--line);
          transition: all var(--dur-state) var(--ease-state);
        }
        .tu-pip--past { background: var(--line-strong); }
        .tu-pip--on { width: 26px; background: var(--mind); }

        .tu-foot {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .tu-back {
          padding: 11px 20px;
          border-radius: var(--r-control);
          border: var(--border);
          background: var(--surface);
          color: var(--dim);
          font-size: 14px;
          transition: color var(--dur-hover) var(--ease-hover),
            border-color var(--dur-hover) var(--ease-hover);
        }
        .tu-back:hover { color: var(--text); border-color: var(--line-strong); }

        .tu-primary {
          padding: 11px 22px;
          border-radius: var(--r-control);
          border: 0;
          background: var(--mind);
          color: var(--bg-2);
          font-size: 14px;
          font-weight: var(--fw-medium);
        }
        .tu-primary--last { background: var(--clarity); color: var(--on-clarity-solid); }

        .tu-spacer { flex: 1; }
        .tu-skip {
          border: 0;
          background: transparent;
          color: var(--dimmer);
          font-size: 13.5px;
        }
        .tu-skip:hover { color: var(--text); }

        /* Hoja completa en pantallas pequeñas. */
        @media (max-width: 900px) {
          .tu-veil { padding: 0; align-items: stretch; }
          .tu-modal {
            width: 100%;
            max-height: 100vh;
            border: 0;
            border-radius: 0;
            padding: 28px 20px 24px;
          }
          .tu-back, .tu-primary, .tu-skip { min-height: 44px; }
          /* Los pips son indicadores, no objetivos táctiles principales:
             se agrandan a lo ancho, no a lo alto. */
          .tu-pips { gap: 10px; }
          .tu-pip { height: 10px; }
          .tu-pip--on { width: 28px; }
        }
      `}</style>
    </div>
  );
}
