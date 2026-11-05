import { useState } from 'preact/hooks';
import HiddenNote from './HiddenNote';
import { HOME_UX } from '../content/home';
import type { Lang } from '../content/ui';

interface Props {
  lang: Lang;
  /** Hojas de vida ya con el prefijo de despliegue: la del idioma y la otra. */
  cv: string;
  cvOtro: string;
}

type Voz = 'pensando' | 'sintiendo';

/**
 * Hero de la Home v3 (/ux/). "Pensando" y "sintiendo" son botones: cada uno
 * muestra a la derecha lo que escuché en un caso. Es contenido, no juego, así
 * que funciona igual en los dos modos de lectura.
 *
 * Clases con prefijo `hx-`: los `<style>` de Preact no están encapsulados.
 */
export default function HeroUx({ lang, cv, cvOtro }: Props) {
  const t = HOME_UX[lang];
  const [voz, setVoz] = useState<Voz>('sintiendo');
  const q = t.voces[voz];

  const palabra = (v: Voz) => (
    <button
      type="button"
      class={`hx-palabra hx-palabra--${v}`}
      aria-pressed={voz === v}
      aria-controls="hero-quote"
      onClick={() => setVoz(v)}
    >
      {t.titulo[v]}
    </button>
  );

  return (
    <>
      <h1 id="hero-t" class="hx-titulo">
        {t.titulo.a} <em>{t.titulo.em}</em> {palabra('pensando')} {t.titulo.y} {palabra('sintiendo')}{' '}
        {t.titulo.cola}
      </h1>

      <div class="hx-grid">
        <div class="hx-col">
          <div class="hx-fila-nota">
            <p class="hx-intro">{t.intro}</p>
            {/* Nota 0: por qué el titular es una frase y no un cargo. */}
            <HiddenNote index={0} lang={lang} />
          </div>
          <div class="hx-acciones">
            <a class="hx-btn hx-btn--primario" href="#casos">
              {t.verCasos} <span aria-hidden="true">↓</span>
            </a>
            <a class="hx-btn" href={cv} download>
              {t.cv.label} <span class="hx-btn-meta">{t.cv.meta}</span>
            </a>
            <a class="hx-otro" href={cvOtro} download lang={t.cv.otroLang} hreflang={t.cv.otroLang}>
              {t.cv.otro}
            </a>
          </div>
        </div>

        <figure id="hero-quote" class="hx-cita" aria-live="polite" style={{ '--hx-tono': q.hue } as Record<string, string>}>
          <p class="hx-cita-label">
            {q.label} · {t.escuche}
          </p>
          <blockquote class="hx-cita-texto">{q.cue}</blockquote>
          <figcaption class="hx-cita-pie">
            {q.signal} <a href={`#${q.ancla}`}>{q.enlace}</a>
          </figcaption>
          <p class="hx-pista">{t.pista}</p>
        </figure>
      </div>

      <style>{`
        .hx-titulo {
          margin-top: 18px;
          font-family: var(--serif);
          font-weight: 400;
          font-size: clamp(40px, 7vw, 96px);
          line-height: 1.02;
          letter-spacing: -0.015em;
          max-width: 1040px;
          text-wrap: balance;
        }
        .hx-palabra {
          font: inherit;
          letter-spacing: inherit;
          border: 0;
          padding: 0 .08em;
          border-radius: .12em;
          background: transparent;
          text-decoration: underline;
          text-decoration-style: wavy;
          text-decoration-thickness: 2px;
          text-underline-offset: .14em;
          transition: background-color var(--dur-hover) var(--ease-hover);
        }
        .hx-palabra--pensando { color: #6a4fd0; }
        .hx-palabra--sintiendo { color: #b4460c; }
        .hx-palabra--pensando[aria-pressed='true'] { background: rgba(106, 79, 208, .12); }
        .hx-palabra--sintiendo[aria-pressed='true'] { background: rgba(180, 70, 12, .10); }

        .hx-grid {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
          gap: 24px 56px;
          align-items: start;
        }
        .hx-col { display: flex; flex-direction: column; gap: 24px; }
        .hx-fila-nota { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 0 14px; }
        .hx-fila-nota .hx-intro { flex: 1 1 0; min-width: 0; }
        .hx-intro {
          font-size: clamp(17px, 1.6vw, 19px);
          line-height: 1.6;
          color: var(--dim);
          max-width: 560px;
          text-wrap: pretty;
        }
        .hx-acciones { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
        .hx-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 52px;
          padding: 0 22px;
          border-radius: 12px;
          border: 1.5px solid var(--text);
          color: var(--text);
          font-size: 16px;
          font-weight: 500;
        }
        .hx-btn:hover { background: #ffffff; color: var(--text); }
        .hx-btn--primario { padding: 0 24px; background: var(--text); color: #ffffff; }
        .hx-btn--primario:hover { background: var(--clarity); border-color: var(--clarity); color: #ffffff; }
        .hx-btn-meta { font-size: 13px; color: var(--dimmer); }
        .hx-otro {
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          padding: 0 6px;
          font-size: 15px;
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .hx-cita {
          margin: 0;
          border-left: 4px solid var(--hx-tono);
          background: #ffffff;
          border-radius: 0 14px 14px 0;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 1px 2px rgba(22, 24, 29, .06);
        }
        .hx-cita-label {
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--hx-tono);
        }
        .hx-cita-texto {
          margin: 0;
          font-family: var(--serif);
          font-size: clamp(24px, 2.4vw, 30px);
          line-height: 1.2;
          color: var(--text);
          text-wrap: pretty;
        }
        .hx-cita-pie { font-size: 14.5px; line-height: 1.55; color: var(--dimmer); }
        .hx-cita-pie a { text-decoration: underline; text-underline-offset: 3px; }
        .hx-pista { font-size: 13px; color: var(--dimmer); }
      `}</style>
    </>
  );
}
