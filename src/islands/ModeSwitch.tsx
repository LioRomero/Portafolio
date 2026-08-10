import { useEffect, useState } from 'preact/hooks';
import { getMode, setMode, type Mode } from '../lib/prefs';
import { UI, type Lang } from '../content/ui';

/**
 * Selector de modo de lectura. Es una isla porque el valor vive en localStorage:
 * el servidor no puede saber cuál eligió el visitante.
 *
 * Las clases llevan prefijo `ms-`: Preact no encapsula los `<style>`, así que
 * cualquier nombre genérico se filtraría al resto de la página.
 */
export default function ModeSwitch({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const [mode, setLocal] = useState<Mode>('grano');

  useEffect(() => {
    setLocal(getMode());
  }, []);

  const pick = (v: Mode) => {
    setMode(v);
    setLocal(v);
  };

  return (
    <div class="ms-wrap" title={t.modeTitle}>
      <button
        type="button"
        class={mode === 'grano' ? 'ms-btn ms-btn--on' : 'ms-btn'}
        aria-pressed={mode === 'grano'}
        onClick={() => pick('grano')}
      >
        {t.modeQuick}
      </button>
      <button
        type="button"
        class={mode === 'explorar' ? 'ms-btn ms-btn--on' : 'ms-btn'}
        aria-pressed={mode === 'explorar'}
        onClick={() => pick('explorar')}
      >
        {t.modeExplore}
      </button>

      <style>{`
        .ms-wrap {
          display: inline-flex;
          flex: none;
          gap: 2px;
          padding: 3px;
          border-radius: var(--r-pill);
          border: var(--border);
          background: var(--bg);
        }
        .ms-btn {
          padding: 5px 12px;
          white-space: nowrap;
          border: 0;
          border-radius: var(--r-pill);
          background: transparent;
          color: var(--dimmer);
          font-size: 12px;
          font-weight: var(--fw-medium);
          letter-spacing: 0.04em;
          transition: background var(--dur-hover) var(--ease-hover),
            color var(--dur-hover) var(--ease-hover);
        }
        .ms-btn:hover { color: var(--dim); }
        .ms-btn--on {
          background: var(--clarity-deep);
          color: var(--on-clarity);
          font-weight: var(--fw-semibold);
        }

        /* En la barra de móvil el alto lo fija el contenedor, no el mínimo
           táctil global: si no, los dos píldoras rompen los 56px de la barra. */
        @media (max-width: 900px) {
          .ms-btn {
            min-height: 0;
            padding: 6px 9px;
            font-size: 11.5px;
          }
        }
      `}</style>
    </div>
  );
}
