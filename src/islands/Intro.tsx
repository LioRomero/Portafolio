import { useEffect, useState } from 'preact/hooks';
import { INTRO, BEAT_HUES, type IntroVariant } from '../content/intro';
import { isIntroSeen, markIntroSeen } from '../lib/prefs';
import type { Lang } from '../content/ui';

interface Props {
  variant: IntroVariant;
  lang: Lang;
}

/**
 * Tiempos de la intro, en ms. Se dimensionan por lectura, no por efecto: el
 * cierre de la larga tiene 16 palabras y necesita unos cuatro segundos quieto
 * en pantalla; el título de la corta, unos dos. Es la misma en móvil y en
 * escritorio: se lee igual de rápido en las dos pantallas. Clic, cualquier
 * tecla o «Saltar» la cierran antes.
 */
const TIEMPO = {
  largo: { total: 9400, fundido: 1100 },
  corto: { total: 3400, fundido: 900 },
} as const;

const prefersReducedMotion = (): boolean => {
  try {
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.motion === 'off'
    );
  } catch {
    return false;
  }
};

/**
 * Pantalla de carga. Bloquea el scroll mientras se muestra y lo libera siempre:
 * por temporizador, por clic, por tecla o al desmontarse.
 *
 * Clases con prefijo `intro-`: los `<style>` de Preact no están encapsulados.
 */
export default function Intro({ variant, lang }: Props) {
  const long = variant === 'home';
  const c = INTRO[variant][lang];
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    /* Una vez por sesión, y nunca con movimiento reducido. */
    if (isIntroSeen(variant) || prefersReducedMotion()) return;

    markIntroSeen(variant);
    setShowing(true);

    const root = document.documentElement;
    root.setAttribute('data-scroll-locked', '');

    const release = () => {
      root.removeAttribute('data-scroll-locked');
      setShowing(false);
      /* La capa ambiental escucha esto para sacar el reproductor en cuanto
         termina la animación. No puede sonar solo —los navegadores exigen un
         gesto— pero sí puede quedar a un toque. */
      window.dispatchEvent(new CustomEvent('em-intro-done', { detail: { variant } }));
    };

    const timer = window.setTimeout(release, (long ? TIEMPO.largo : TIEMPO.corto).total);
    const onKey = () => release();
    window.addEventListener('keydown', onKey);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      root.removeAttribute('data-scroll-locked');
    };
  }, [variant, long]);

  if (!showing) return null;

  const tiempo = long ? TIEMPO.largo : TIEMPO.corto;
  const hue = 'hue' in c ? c.hue : '#22D3EE';

  const dismiss = () => {
    document.documentElement.removeAttribute('data-scroll-locked');
    setShowing(false);
    window.dispatchEvent(new CustomEvent('em-intro-done', { detail: { variant } }));
  };

  return (
    <div
      class="intro-veil"
      style={
        {
          '--dur': `${tiempo.total}ms`,
          '--fundido': `${tiempo.fundido}ms`,
          '--sosten': `${tiempo.total - tiempo.fundido}ms`,
          '--hue': hue,
        } as Record<string, string>
      }
      onClick={dismiss}
    >
      {long ? (
        <>
          <div class="intro-halo" aria-hidden="true" />
          <div class="intro-stack" aria-hidden="true">
            <span class="intro-beacon" />
            <div class="intro-kicker">{c.kicker}</div>
            <div class="intro-name">Emilio Romero</div>
            <span class="intro-rule" />
            <h1 class="intro-headline">
              {c.lineA}
              <br />
              {'lineB' in c ? c.lineB : ''}
            </h1>
            <div class="intro-beats">
              {('words' in c ? c.words : []).map((word, i) => (
                <span
                  class="intro-beat"
                  style={{
                    color: BEAT_HUES[i % 3],
                    animationDelay: `${(2.6 + i * 0.5).toFixed(2)}s`,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
            <p class="intro-close">{'close' in c ? c.close : ''}</p>
          </div>
        </>
      ) : (
        <>
          <div class="intro-wipe" aria-hidden="true" />
          <div class="intro-rush" aria-hidden="true">
            <div class="intro-kicker intro-kicker--short">{c.kicker}</div>
            <div class="intro-short-title">{c.lineA}</div>
          </div>
        </>
      )}

      <button type="button" class="intro-skip" onClick={dismiss}>
        {c.skip}
      </button>

      <style>{`
        .intro-veil {
          position: fixed;
          inset: 0;
          z-index: var(--z-intro);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: var(--bg);
          cursor: pointer;
          /* Se sostiene opaca y solo al final se funde: el texto no empieza a
             desaparecer mientras todavía se está leyendo. */
          animation: introVeil var(--fundido) ease var(--sosten) both;
        }
        @keyframes introVeil { from { opacity: 1; } to { opacity: 0; } }

        .intro-halo {
          position: absolute;
          width: 640px;
          height: 640px;
          border-radius: var(--r-pill);
          pointer-events: none;
          background: radial-gradient(circle, var(--mind-22) 0%, transparent 66%);
          animation: introHalo var(--dur) ease-out both;
        }
        @keyframes introHalo {
          0% { transform: scale(.6); opacity: 0; }
          40% { opacity: .9; }
          100% { transform: scale(1.25); opacity: 0; }
        }

        .intro-stack {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 32px;
        }

        .intro-beacon {
          width: 9px;
          height: 9px;
          border-radius: var(--r-pill);
          background: var(--clarity);
          box-shadow: 0 0 18px var(--clarity);
          animation: introPulse 1.6s ease-in-out infinite, introFade .5s ease both;
        }
        @keyframes introPulse {
          0%, 100% { transform: scale(1); opacity: .55; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        @keyframes introFade { from { opacity: 0; } to { opacity: 1; } }

        .intro-kicker {
          font-size: var(--fs-kicker);
          font-weight: var(--fw-medium);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--clarity);
          margin-top: 22px;
          animation: introRise .7s ease .2s both;
        }
        .intro-kicker--short {
          margin-top: 0;
          letter-spacing: 0.2em;
          color: var(--hue);
          animation: none;
        }
        @keyframes introRise {
          from { opacity: 0; transform: translate3d(0, 14px, 0); }
          to { opacity: 1; transform: none; }
        }

        .intro-name {
          font-size: 15px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--text);
          margin-top: 12px;
          animation: introRise .7s ease .45s both;
        }

        .intro-rule {
          width: 120px;
          height: 1px;
          background: var(--line-strong);
          margin-top: 22px;
          transform-origin: center;
          animation: introLine .8s cubic-bezier(.2, .7, .3, 1) .8s both;
        }
        @keyframes introLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }

        .intro-headline {
          font-weight: var(--fw-light);
          font-size: var(--fs-intro);
          line-height: var(--lh-intro);
          letter-spacing: var(--ls-intro);
          color: var(--text);
          margin-top: 26px;
          max-width: 760px;
          animation: introRise .9s ease 1.1s both;
        }

        .intro-beats {
          display: flex;
          gap: 26px;
          margin-top: 34px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .intro-beat {
          font-size: 19px;
          font-weight: var(--fw-regular);
          letter-spacing: -0.01em;
          animation: introOut 2s ease both;
        }
        @keyframes introOut {
          0% { opacity: 0; transform: translate3d(0, 10px, 0); }
          18% { opacity: 1; transform: none; }
          82% { opacity: 1; transform: none; }
          100% { opacity: 0; transform: translate3d(0, -10px, 0); }
        }

        .intro-close {
          font-size: 15px;
          line-height: 1.6;
          color: var(--dim);
          margin-top: 30px;
          max-width: 520px;
          /* Entra a los 3.6s y queda completa a los 4.5s: unos cuatro segundos
             quieta antes del fundido. */
          animation: introRise .9s ease 3.6s both;
        }

        .intro-wipe {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            100deg,
            color-mix(in srgb, var(--hue) 18%, #080b16) 0%,
            #080b16 62%
          );
          animation: introWipe var(--dur) var(--ease-sweep) both;
        }
        @keyframes introWipe {
          0% { transform: translate3d(-101%, 0, 0); }
          26%, 70% { transform: none; }
          100% { transform: translate3d(101%, 0, 0); }
        }

        .intro-rush {
          position: relative;
          text-align: center;
          padding: 0 32px;
          animation: introRush var(--dur) var(--ease-enter) both;
        }
        /* Entra en medio segundo y se queda quieta unos dos para leer el título. */
        @keyframes introRush {
          0% { opacity: 0; transform: scale(1.5); }
          15% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(.9); }
        }

        .intro-short-title {
          font-weight: var(--fw-regular);
          font-size: 42px;
          line-height: 1.12;
          letter-spacing: -0.035em;
          color: var(--text);
          margin-top: 14px;
        }

        .intro-skip {
          position: absolute;
          right: 26px;
          bottom: 24px;
          padding: 8px 16px;
          border-radius: var(--r-pill);
          border: var(--border);
          background: var(--bg-2);
          color: var(--dimmer);
          font-size: 12.5px;
        }
        .intro-skip:hover { color: var(--text); }

        @media (max-width: 900px) {
          .intro-short-title { font-size: 28px; }
          .intro-beats { gap: 16px; }
        }
      `}</style>
    </div>
  );
}
