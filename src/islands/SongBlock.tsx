import { useEffect, useRef, useState } from 'preact/hooks';
import { HOME } from '../content/home';
import { CONTACT_EMAIL } from '../content/canvas';
import { getFinds, onFindsChange } from '../lib/finds';
import type { Lang } from '../content/ui';

/** Notas que hay que encontrar para que aparezca. */
const DESBLOQUEO = 4;
const CLAVE = 'em-songs';
/** Las últimas seis: es una lista de sugerencias, no un archivo. */
const MAX = 6;

const leer = (): string[] => {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(CLAVE) || '[]');
    return Array.isArray(v) ? (v as string[]) : [];
  } catch {
    return [];
  }
};

/**
 * Recompensa a media exploración: al encontrar cuatro de las ocho notas
 * aparece un bloque para sugerir música. Igual que el canvas, la sugerencia
 * vive en el navegador de quien escribe y sale por `mailto:` — aquí no hay
 * servidor que la reciba, y decirlo es parte del trato.
 *
 * Clases con prefijo `sb-`: los `<style>` de Preact no están encapsulados.
 */
export default function SongBlock({ lang }: { lang: Lang }) {
  const t = HOME[lang];
  const [encontradas, setEncontradas] = useState(0);
  const [borrador, setBorrador] = useState('');
  const [lista, setLista] = useState<string[]>([]);
  const [gracias, setGracias] = useState(false);
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => {
    setEncontradas(getFinds().length);
    setLista(leer());
    return onFindsChange((f) => setEncontradas(f.length));
  }, []);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const listo = borrador.trim().length > 0;

  const sumar = () => {
    if (!listo) return;
    const siguiente = [...lista, borrador.trim().slice(0, 60)].slice(-MAX);
    setLista(siguiente);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(siguiente));
    } catch {
      /* almacenamiento bloqueado: vale para esta sesión */
    }
    setBorrador('');
    setGracias(true);
    clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setGracias(false), 2600);
  };

  if (encontradas < DESBLOQUEO) return null;

  const asunto = encodeURIComponent(t.songTitle);
  const cuerpo = encodeURIComponent(
    lista.length ? lista.map((s) => `♪ ${s}`).join('\n') : borrador.trim()
  );

  return (
    <section class="sb" aria-label={t.songTitle}>
      <div class="sb-label">{t.songLabel}</div>
      <h3 class="sb-title">{t.songTitle}</h3>
      <p class="sb-body">{t.songBody}</p>

      <div class="sb-fila">
        <input
          class="sb-input"
          type="text"
          value={borrador}
          placeholder={t.songPlaceholder}
          aria-label={t.songPlaceholder}
          onInput={(e) => setBorrador((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => e.key === 'Enter' && sumar()}
        />
        <button type="button" class="sb-add" disabled={!listo} onClick={sumar}>
          {t.songAdd}
        </button>
      </div>

      <p class="sb-gracias" role="status">
        {gracias ? t.songThanks : ''}
      </p>

      {lista.length > 0 && (
        <ul class="sb-lista">
          {lista.map((s) => (
            <li class="sb-tema">♪ {s}</li>
          ))}
        </ul>
      )}

      <div class="sb-pie">
        {lista.length > 0 && (
          <a class="sb-link" href={`mailto:${CONTACT_EMAIL}?subject=${asunto}&body=${cuerpo}`}>
            {t.songMail}
          </a>
        )}
        <a class="sb-link" href={t.playlistHref} target="_blank" rel="noopener">
          {t.playlistLink}
        </a>
      </div>

      <style>{`
        .sb {
          margin-top: 40px;
          border: 1px solid var(--clarity-deep);
          border-radius: 16px;
          padding: 30px 32px;
          background: color-mix(in srgb, var(--clarity) 5%, transparent);
          max-width: 780px;
          animation: sbEntra var(--dur-enter) var(--ease-enter) both;
        }
        @keyframes sbEntra {
          from { opacity: 0; transform: translate3d(0, 12px, 0); }
          to { opacity: 1; transform: none; }
        }
        html[data-motion='off'] .sb { animation: none; }
        @media (prefers-reduced-motion: reduce) { .sb { animation: none; } }

        .sb-label {
          font-size: var(--fs-label);
          font-weight: var(--fw-medium);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--clarity);
          margin-bottom: 12px;
        }
        .sb-title {
          font-size: 22px;
          font-weight: var(--fw-medium);
          letter-spacing: -0.025em;
          margin-bottom: 10px;
        }
        .sb-body {
          font-size: var(--fs-body);
          line-height: var(--lh-body-sm);
          color: var(--dim);
          margin-bottom: 22px;
          max-width: 560px;
        }

        .sb-fila { display: flex; gap: 10px; flex-wrap: wrap; }
        .sb-input {
          flex: 1;
          min-width: 260px;
          padding: 12px 16px;
          border-radius: var(--r-control);
          border: var(--border);
          background: var(--bg);
          color: var(--text);
          font-family: inherit;
          font-size: var(--fs-body);
          font-weight: var(--fw-light);
        }
        .sb-input:focus-visible { border-color: var(--clarity); }
        .sb-add {
          padding: 12px 22px;
          border-radius: var(--r-control);
          border: 1px solid var(--clarity);
          background: transparent;
          color: var(--clarity);
          font-size: var(--fs-btn);
          font-weight: var(--fw-medium);
          transition: all var(--dur-hover) var(--ease-hover);
        }
        .sb-add:disabled {
          border-color: var(--line);
          color: var(--dimmer);
          cursor: default;
        }
        .sb-add:not(:disabled):hover { background: var(--clarity-16); }

        .sb-gracias {
          min-height: 18px;
          margin-top: 8px;
          font-size: var(--fs-meta);
          color: var(--on-clarity);
        }

        .sb-lista { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 0; padding: 0; list-style: none; }
        .sb-tema {
          padding: 7px 14px;
          border-radius: var(--r-pill);
          border: 1px solid var(--clarity-deep);
          color: var(--on-clarity);
          font-size: 13.5px;
        }

        .sb-pie { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 18px; }
        .sb-link { font-size: 14px; font-weight: var(--fw-medium); }

        @media (max-width: 900px) {
          .sb { padding: 22px 18px; }
          .sb-add { min-height: 44px; }
        }
      `}</style>
    </section>
  );
}
