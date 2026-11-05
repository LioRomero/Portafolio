import { useState } from 'preact/hooks';
import { HOME_UX } from '../content/home';
import { CONTACT_EMAIL } from '../content/canvas';
import type { Lang } from '../content/ui';

/** El mismo número que trae la hoja de vida. */
const WHATSAPP = '573142543651';

/**
 * Contacto de la Home v3: se elige la frase que más se parece a lo que se
 * siente y el mensaje queda escrito, listo para WhatsApp o correo. No hay
 * formulario: nada se envía desde aquí, solo se abre la app de cada quien.
 *
 * Clases con prefijo `cx-`: los `<style>` de Preact no están encapsulados.
 */
export default function ContactoUx({ lang }: { lang: Lang }) {
  const t = HOME_UX[lang].contacto;
  const [sel, setSel] = useState(-1);
  const msg = sel >= 0 ? t.sentires[sel]!.msg : t.porDefecto;

  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  const correo = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.asunto)}&body=${encodeURIComponent(msg)}`;

  return (
    <>
      <div role="group" aria-label={t.grupo} class="cx-sentires">
        {t.sentires.map((s, i) => (
          <button
            type="button"
            class="cx-sentir"
            aria-pressed={i === sel}
            onClick={() => setSel(sel === i ? -1 : i)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div class="cx-caja">
        <p class="cx-label">{t.tuMensaje}</p>
        {/* `key` reinicia la animación de entrada cada vez que cambia el texto. */}
        <p class="cx-msg" aria-live="polite" key={sel}>
          {msg}
        </p>
        <div class="cx-botones">
          <a class="cx-btn cx-btn--lleno" href={wa} target="_blank" rel="noopener">
            {t.whatsapp}
          </a>
          <a class="cx-btn" href={correo}>
            {t.correo}
          </a>
        </div>
      </div>

      <style>{`
        .cx-sentires { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 10px; }
        .cx-sentir {
          min-height: 48px;
          padding: 10px 20px;
          border-radius: var(--r-pill);
          border: 1.5px solid #75787f;
          background: transparent;
          color: var(--sobre-tinta);
          font-size: 15.5px;
          font-weight: 500;
          text-align: left;
          transition: background-color var(--dur-hover) var(--ease-hover), border-color var(--dur-hover) var(--ease-hover);
        }
        .cx-sentir:hover { border-color: var(--sobre-tinta); }
        .cx-sentir[aria-pressed='true'] { background: var(--sobre-tinta); border-color: var(--sobre-tinta); color: var(--tinta); }
        .cx-sentir:focus-visible { outline-color: var(--sobre-tinta); }

        .cx-caja {
          margin-top: 20px;
          border-radius: 16px;
          background: var(--tinta-2);
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 860px;
        }
        .cx-label {
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--sobre-tinta-meta);
        }
        .cx-msg {
          font-size: 18px;
          line-height: 1.55;
          color: #ffffff;
          animation: cxSube calc(250ms * var(--motion)) ease-out;
        }
        @keyframes cxSube { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .cx-botones { display: flex; flex-wrap: wrap; gap: 12px; }
        .cx-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 52px;
          padding: 0 22px;
          border-radius: 12px;
          border: 1.5px solid var(--sobre-tinta);
          color: var(--sobre-tinta);
          font-size: 16px;
          font-weight: 500;
        }
        .cx-btn:hover { background: #2c2f37; color: #ffffff; }
        .cx-btn--lleno { background: var(--sobre-tinta); color: var(--tinta); font-weight: 600; }
        .cx-btn--lleno:hover { background: #ffffff; color: var(--tinta); }
        .cx-btn:focus-visible { outline-color: var(--sobre-tinta); }
      `}</style>
    </>
  );
}
