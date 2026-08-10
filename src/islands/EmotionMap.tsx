import { useRef, useState } from 'preact/hooks';
import { EMOTIONS, HOME } from '../content/home';
import type { Lang } from '../content/ui';

/**
 * Cinco señales que aparecen en casi todo proyecto. Mantener pulsada una revela
 * la cita original — el dato en bruto detrás de la traducción.
 *
 * Clases con prefijo `emap-`: los `<style>` de Preact no están encapsulados.
 */
export default function EmotionMap({ lang }: { lang: Lang }) {
  const t = HOME[lang];
  const [sel, setSel] = useState(0);
  const [raw, setRaw] = useState(false);
  const hold = useRef<number | undefined>(undefined);

  const em = EMOTIONS[sel]!;
  const d = em[lang];

  const startHold = (i: number) => {
    clearTimeout(hold.current);
    hold.current = window.setTimeout(() => {
      setSel(i);
      setRaw(true);
    }, 620);
  };

  return (
    <div class="emap" style={{ '--hue': em.hue, '--deep': em.deep } as Record<string, string>}>
      <div class="emap-chips" role="tablist" aria-label={t.mapHint}>
        {EMOTIONS.map((e, i) => (
          <button
            type="button"
            role="tab"
            aria-selected={i === sel}
            class={i === sel ? 'emap-chip emap-chip--on' : 'emap-chip'}
            style={{ '--c': e.hue, '--d': e.deep } as Record<string, string>}
            onClick={() => {
              setSel(i);
              setRaw(false);
            }}
            onPointerDown={() => startHold(i)}
            onPointerUp={() => clearTimeout(hold.current)}
            onPointerLeave={() => clearTimeout(hold.current)}
          >
            <span class="emap-chip-dot" aria-hidden="true" />
            {e[lang].label}
          </button>
        ))}
      </div>

      <div class="emap-panel">
        <div class="emap-glow" aria-hidden="true" />

        <div class="emap-col">
          <div class="emap-col-label">{t.whatYouSee}</div>
          <p class="emap-cue">{d.cue}</p>
        </div>

        <div class="emap-col">
          <div class="emap-col-label">{t.whatItMeans}</div>
          <p class="emap-col-text">{d.signal}</p>
        </div>

        <div class="emap-col">
          <div class="emap-col-label">{t.whatIDo}</div>
          <p class="emap-col-text">{d.move}</p>
          <p class="emap-seen">
            {t.seenIn}: <strong>{em.caseRef}</strong>
          </p>
        </div>

        {raw && (
          <div class="emap-raw">
            <div class="emap-col-label">{t.originalQuote}</div>
            <p class="emap-raw-text">{d.raw}</p>
          </div>
        )}
      </div>

      <style>{`
        .emap { margin-top: 30px; }

        .emap-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
        .emap-chip {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: var(--r-pill);
          border: var(--border);
          background: transparent;
          color: var(--dim);
          font-size: var(--fs-body-sm);
          transition: all var(--dur-state) var(--ease-state);
        }
        .emap-chip--on {
          border-color: var(--c);
          background: var(--d);
          color: var(--text);
        }
        .emap-chip-dot {
          width: 9px;
          height: 9px;
          border-radius: var(--r-pill);
          background: var(--c);
          opacity: .45;
        }
        .emap-chip--on .emap-chip-dot { opacity: 1; box-shadow: 0 0 14px var(--c); }

        .emap-panel {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 28px;
          border: var(--border);
          border-radius: var(--r-card-lg);
          padding: 30px 32px;
          background: var(--bg-2);
        }
        .emap-glow {
          position: absolute;
          top: -140px;
          right: -100px;
          width: 360px;
          height: 360px;
          border-radius: var(--r-pill);
          pointer-events: none;
          background: radial-gradient(circle, color-mix(in srgb, var(--hue) 18%, transparent) 0%, transparent 68%);
          transition: background var(--dur-enter) var(--ease-state);
        }

        .emap-col { position: relative; }
        .emap-col-label {
          font-size: var(--fs-label);
          font-weight: var(--fw-medium);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--dimmer);
          margin-bottom: 10px;
        }
        .emap-cue {
          font-size: 17px;
          line-height: 1.45;
          letter-spacing: -0.015em;
          color: var(--text);
        }
        .emap-col-text {
          font-size: var(--fs-body-sm);
          line-height: var(--lh-body-sm);
          color: var(--dim);
        }
        .emap-seen { margin-top: 10px; font-size: var(--fs-meta); color: var(--dimmer); }
        .emap-seen strong { color: var(--hue); font-weight: var(--fw-medium); }

        .emap-raw {
          position: relative;
          grid-column: 1 / -1;
          border-top: var(--border);
          padding-top: 18px;
        }
        .emap-raw-text {
          font-size: var(--fs-body);
          line-height: var(--lh-body-sm);
          color: var(--dim);
          font-style: italic;
        }

        @media (max-width: 900px) {
          .emap-panel { padding: 22px 18px; gap: 20px; }
          .emap-chip { min-height: 44px; }
        }
      `}</style>
    </div>
  );
}
