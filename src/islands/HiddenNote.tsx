import { useEffect, useState } from 'preact/hooks';
import { getFinds, toggleFind, onFindsChange } from '../lib/finds';
import { HOME } from '../content/home';
import type { Lang } from '../content/ui';

/**
 * Un punto violeta junto a un párrafo. Al abrirlo despliega una reflexión.
 * Nunca contiene información que no esté en otro lugar del sitio: es personalidad.
 *
 * Las clases llevan prefijo `hn-`. Preact no encapsula los `<style>`, así que un
 * nombre genérico se filtraría al resto de la página y a las demás islas.
 */
export default function HiddenNote({ index, lang }: { index: number; lang: Lang }) {
  const t = HOME[lang];
  const [open, setOpen] = useState(false);
  const [tag, text] = t.finds[index] ?? ['', ''];

  useEffect(() => {
    setOpen(getFinds().includes(index));
    return onFindsChange((found) => setOpen(found.includes(index)));
  }, [index]);

  return (
    <div class="hn-host" data-playful>
      <button
        type="button"
        class={open ? 'hn-dot hn-dot--found' : 'hn-dot'}
        aria-expanded={open}
        aria-label={open ? tag : t.findHint}
        title={open ? tag : t.findHint}
        onClick={() => toggleFind(index)}
      />

      {open && (
        <div class="hn-box" role="note">
          <div class="hn-box-label">{t.findLabel}</div>
          <p class="hn-box-text">{text}</p>
        </div>
      )}

      <style>{`
        .hn-host { display: contents; }
        .hn-dot {
          flex: none;
          width: 14px;
          min-width: 14px;
          height: 14px;
          min-height: 14px;
          margin-top: 9px;
          padding: 0;
          border-radius: var(--r-pill);
          border: 1px solid var(--mind);
          background: var(--mind-22);
          line-height: 0;
          font-size: 0;
          animation: hnPulseRing 2.6s ease-out infinite;
          transition: background var(--dur-state) var(--ease-state);
        }
        .hn-dot--found {
          background: var(--mind);
          animation: none;
        }
        @keyframes hnPulseRing {
          0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--mind) 45%, transparent); }
          70% { box-shadow: 0 0 0 9px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        html[data-motion='off'] .hn-dot { animation: none; }
        @media (prefers-reduced-motion: reduce) {
          .hn-dot { animation: none; }
        }

        .hn-box {
          flex-basis: 100%;
          margin: 14px 0 0;
          border: 1px solid var(--mind-deep);
          border-left: 2px solid var(--mind);
          border-radius: 0 12px 12px 0;
          padding: 18px 22px;
          background: color-mix(in srgb, var(--mind) 8%, transparent);
          max-width: 620px;
          animation: hnRiseIn var(--dur-enter) var(--ease-enter) both;
        }
        @keyframes hnRiseIn {
          from { opacity: 0; transform: translate3d(0, 10px, 0); }
          to { opacity: 1; transform: none; }
        }
        .hn-box-label {
          font-size: var(--fs-label);
          font-weight: var(--fw-medium);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--on-mind);
          margin-bottom: 9px;
        }
        .hn-box-text {
          font-size: 15.5px;
          line-height: 1.6;
          color: var(--text);
        }
      `}</style>
    </div>
  );
}
