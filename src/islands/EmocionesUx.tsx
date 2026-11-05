import { useRef, useState } from 'preact/hooks';
import { HOME_UX, TONO_EMOCION } from '../content/home';
import type { Lang } from '../content/ui';

/**
 * "Una emoción es un dato de negocio" de la Home v3: cinco pestañas y un panel
 * con lo que escucho, lo que significa y lo que hago con eso. Pestañas ARIA de
 * verdad: flechas, Inicio y Fin mueven el foco y la selección a la vez.
 *
 * Clases con prefijo `ex-`: los `<style>` de Preact no están encapsulados.
 */
export default function EmocionesUx({ lang }: { lang: Lang }) {
  const t = HOME_UX[lang].metodo;
  const [sel, setSel] = useState(0);
  const pestanas = useRef<(HTMLButtonElement | null)[]>([]);
  const e = t.emociones[sel]!;
  const total = t.emociones.length;

  const elegir = (i: number, enfocar: boolean) => {
    setSel(i);
    if (enfocar) pestanas.current[i]?.focus();
  };

  const tecla = (ev: KeyboardEvent, i: number) => {
    const mapa: Record<string, number> = {
      ArrowRight: (i + 1) % total,
      ArrowDown: (i + 1) % total,
      ArrowLeft: (i - 1 + total) % total,
      ArrowUp: (i - 1 + total) % total,
      Home: 0,
      End: total - 1,
    };
    const n = mapa[ev.key];
    if (n === undefined) return;
    ev.preventDefault();
    elegir(n, true);
  };

  return (
    <div class="ex" style={{ '--ex-tono': TONO_EMOCION[sel] } as Record<string, string>}>
      <div role="tablist" aria-label={t.tabsLabel} class="ex-tabs">
        {t.emociones.map((em, i) => (
          <button
            type="button"
            role="tab"
            id={`ex-tab-${i}`}
            aria-selected={i === sel}
            aria-controls="ex-panel"
            tabIndex={i === sel ? 0 : -1}
            class="ex-tab"
            style={{ '--ex-c': TONO_EMOCION[i] } as Record<string, string>}
            ref={(el) => {
              pestanas.current[i] = el;
            }}
            onClick={() => elegir(i, false)}
            onKeyDown={(ev) => tecla(ev as KeyboardEvent, i)}
          >
            {em.label}
          </button>
        ))}
      </div>

      <div id="ex-panel" role="tabpanel" aria-labelledby={`ex-tab-${sel}`} class="ex-panel">
        <div class="ex-col">
          <p class="ex-label">{t.escucho}</p>
          <p class="ex-cue">{e.cue}</p>
        </div>
        <div class="ex-col">
          <p class="ex-label">{t.significa}</p>
          <p class="ex-texto">{e.signal}</p>
        </div>
        <div class="ex-col">
          <p class="ex-label">{t.hago}</p>
          <p class="ex-texto">{e.move}</p>
          <p class="ex-vivi">
            {t.vivi} <a href={`#${e.ancla}`}>{e.caso}</a>
          </p>
        </div>
      </div>

      <style>{`
        .ex-tabs { margin-top: 36px; display: flex; flex-wrap: wrap; gap: 10px; }
        .ex-tab {
          min-height: 46px;
          padding: 0 20px;
          border-radius: var(--r-pill);
          border: 1.5px solid #75787f;
          background: transparent;
          color: var(--sobre-tinta);
          font-size: 15px;
          font-weight: 500;
          transition: background-color var(--dur-hover) var(--ease-hover), border-color var(--dur-hover) var(--ease-hover);
        }
        .ex-tab:hover { border-color: var(--ex-c); }
        .ex-tab[aria-selected='true'] { background: var(--ex-c); border-color: var(--ex-c); color: var(--tinta); }
        .ex-tab:focus-visible { outline-color: var(--sobre-tinta); }

        .ex-panel {
          margin-top: 18px;
          border-radius: 18px;
          background: var(--tinta-2);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
          overflow: hidden;
        }
        .ex-col {
          padding: 26px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 4px solid var(--ex-tono);
        }
        .ex-label {
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--sobre-tinta-meta);
        }
        .ex-cue {
          font-family: var(--serif);
          font-size: 26px;
          line-height: 1.2;
          color: #ffffff;
          text-wrap: pretty;
        }
        .ex-texto { font-size: 16px; line-height: 1.6; color: var(--sobre-tinta); text-wrap: pretty; }
        .ex-vivi { margin-top: auto; padding-top: 6px; font-size: 14px; color: var(--sobre-tinta-dim); }
        .ex-vivi a { color: #a9bcff; text-decoration: underline; text-underline-offset: 3px; }
        .ex-vivi a:hover { color: #ffffff; }
      `}</style>
    </div>
  );
}
