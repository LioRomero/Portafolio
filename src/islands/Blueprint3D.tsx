import { useEffect, useRef, useState } from 'preact/hooks';
import { BLUEPRINT } from '../content/blueprint';
import { sonar, leerSonido } from '../lib/sonido';
import type { Lang } from '../content/ui';

interface Props {
  lang: Lang;
}

/**
 * El blueprint de servicio, en profundidad real.
 *
 * Se construye con transformaciones 3D del navegador y no con WebGL, y la
 * decisión importa: un blueprint son cinco planos paralelos con texto encima,
 * que es justo el caso donde el 3D del navegador gana. El texto sigue siendo
 * texto — se lee con lector de pantalla, se selecciona, se traduce y se busca
 * — mientras que en una malla habría que hornearlo como textura y perderlo
 * todo. Y pesa cero: three.js son unos 150 KB comprimidos, casi el triple que
 * todo el JavaScript del sitio.
 *
 * Clases con prefijo `bp-`: los estilos de Preact no están encapsulados.
 */
export default function Blueprint3D({ lang }: Props) {
  const t = BLUEPRINT[lang];
  const [rx, setRx] = useState(12);
  const [ry, setRy] = useState(-15);
  const [sep, setSep] = useState(60);
  const [activa, setActiva] = useState<number | null>(null);
  const arrastre = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null);

  useEffect(() => {
    leerSonido();
  }, []);

  const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  const abajo = (e: PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    arrastre.current = { x: e.clientX, y: e.clientY, rx, ry };
  };

  const mover = (e: PointerEvent) => {
    const a = arrastre.current;
    if (!a) return;
    setRy(limitar(a.ry + (e.clientX - a.x) * 0.4, -70, 70));
    setRx(limitar(a.rx - (e.clientY - a.y) * 0.3, -20, 60));
  };

  const arriba = () => {
    arrastre.current = null;
  };

  /* El teclado hace lo mismo que el ratón. Sin esto, girar sería un gesto
     exclusivo de quien puede arrastrar. */
  const teclas = (e: KeyboardEvent) => {
    const paso = e.shiftKey ? 12 : 5;
    const mapa: Record<string, () => void> = {
      ArrowLeft: () => setRy((v) => limitar(v - paso, -70, 70)),
      ArrowRight: () => setRy((v) => limitar(v + paso, -70, 70)),
      ArrowUp: () => setRx((v) => limitar(v + paso, -20, 60)),
      ArrowDown: () => setRx((v) => limitar(v - paso, -20, 60)),
      Home: () => {
        setRx(12);
        setRy(-15);
      },
    };
    const f = mapa[e.key];
    if (f) {
      e.preventDefault();
      f();
    }
  };

  const reiniciar = () => {
    setRx(12);
    setRy(-15);
    setSep(60);
    setActiva(null);
  };

  const giro = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';

  return (
    <section class="bp-shell" aria-label={t.title}>
      <div class="bp-cabeza">
        <span class="label label--mind">{t.kicker}</span>
        <h3 class="bp-title">{t.title}</h3>
        <p class="bp-lede">{t.lede}</p>
      </div>

      <div class="bp-cols">
        <div
          class="bp-escena"
          role="group"
          tabIndex={0}
          aria-label={t.girar}
          onPointerDown={abajo}
          onPointerMove={mover}
          onPointerUp={arriba}
          onPointerCancel={arriba}
          onKeyDown={teclas}
        >
          <div class="bp-pila" style={{ transform: giro }}>
            {t.capas.map((c, i) => {
              /* La línea de visibilidad va entre la tercera y la cuarta capa.
                 Además de separarlas en profundidad se escalonan hacia abajo:
                 apiladas a plomo, las de atrás quedaban tapadas por las de
                 delante y no se leía ni una etiqueta. */
              const z = (i - 2) * -sep;
              /* Escalonan hacia ARRIBA: la capa de delante es la mas baja, y
                 asi la franja superior de cada capa de atras asoma por encima
                 en vez de quedar tapada. */
              const y = (i - 2) * -(sep * 0.58);
              return (
                <>
                  {i === 3 && (
                    <div
                      class="bp-linea"
                      style={{ transform: 'translate3d(0,' + (y + sep * 0.29) + 'px,' + (z + sep / 2) + 'px)' }}
                    >
                      <span class="bp-linea-txt">{t.lineaLabel}</span>
                    </div>
                  )}
                  <div
                    class={'bp-capa bp-capa--' + c.tono + (activa === i ? ' bp-capa--activa' : '')}
                    style={{ transform: 'translate3d(0,' + y + 'px,' + z + 'px)' }}
                    onPointerEnter={() => {
                      setActiva(i);
                      sonar('elegir');
                    }}
                    onFocus={() => setActiva(i)}
                    tabIndex={0}
                  >
                    <span class="bp-n tabular">{c.n}</span>
                    <span class="bp-t">{c.t}</span>
                  </div>
                </>
              );
            })}
          </div>
        </div>

        <div class="bp-lado">
          <div class="bp-detalle" aria-live="polite">
            {activa === null ? (
              <p class="bp-hint">{t.hint}</p>
            ) : (
              <>
                <div class="bp-detalle-t">
                  <span class="tabular bp-detalle-n">{t.capas[activa]!.n}</span> {t.capas[activa]!.t}
                </div>
                <p class="bp-detalle-d">{t.capas[activa]!.d}</p>
              </>
            )}
          </div>

          <label class="bp-control">
            <span class="col-label">{t.separar}</span>
            <input
              type="range"
              min="0"
              max="120"
              value={sep}
              onInput={(e) => setSep(Number((e.currentTarget as HTMLInputElement).value))}
            />
          </label>

          <button type="button" class="bp-reset" onClick={reiniciar}>
            {t.reiniciar}
          </button>

          <p class="bp-nota meta">{t.lineaNota}</p>
        </div>
      </div>

      <p class="bp-cierre">{t.cierre}</p>

      <style>{`
        .bp-shell {
          border: var(--border);
          border-radius: var(--r-card-lg);
          padding: 30px 32px 26px;
          background: var(--bg-2);
        }
        .bp-title { font-size: var(--fs-h3); font-weight: var(--fw-medium); margin: 10px 0 8px; }
        .bp-lede { color: var(--dim); max-width: 62ch; margin: 0 0 22px; }
        .bp-cols {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(240px, 1fr);
          gap: var(--gap-cards);
          align-items: start;
        }

        /* La perspectiva vive en el contenedor y la rotación en la pila: si se
           mezclan, cada capa se deforma por su cuenta. */
        .bp-escena {
          perspective: 1100px;
          height: 430px;
          display: grid;
          place-items: center;
          cursor: grab;
          touch-action: none;
          border-radius: var(--r-card);
        }
        .bp-escena:active { cursor: grabbing; }
        .bp-escena:focus-visible { outline: 2px solid var(--mind); outline-offset: 4px; }

        .bp-pila {
          position: relative;
          width: 300px;
          height: 190px;
          transform-style: preserve-3d;
          transition: transform .12s linear;
        }
        html[data-motion='off'] .bp-pila { transition: none; }

        .bp-capa, .bp-linea {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          border-radius: 12px;
        }
        .bp-capa {
          display: flex;
          user-select: none;
          align-items: flex-start;
          gap: 14px;
          padding: 13px 20px 0;
          border: 1px solid var(--line-strong);
          background: color-mix(in srgb, var(--surface) 86%, transparent);
          box-shadow: 0 18px 40px -24px rgba(0, 0, 0, 0.9);
          transition: border-color var(--dur-hover) var(--ease-hover), background var(--dur-hover) var(--ease-hover);
        }
        .bp-capa--clarity { border-color: color-mix(in srgb, var(--clarity) 55%, var(--line-strong)); }
        .bp-capa--mind { border-color: color-mix(in srgb, var(--mind) 55%, var(--line-strong)); }
        .bp-capa--feel { border-color: color-mix(in srgb, var(--feel) 55%, var(--line-strong)); }
        .bp-capa--activa {
          background: color-mix(in srgb, var(--surface-2) 94%, transparent);
          box-shadow: 0 0 34px -8px currentColor, 0 18px 40px -24px rgba(0, 0, 0, 0.9);
        }
        .bp-capa--clarity.bp-capa--activa { color: var(--clarity); }
        .bp-capa--mind.bp-capa--activa { color: var(--mind); }
        .bp-capa--feel.bp-capa--activa { color: var(--feel); }
        .bp-capa:focus-visible { outline: 2px solid var(--mind); outline-offset: 3px; }

        .bp-n { font-size: 12px; color: var(--dimmer); letter-spacing: var(--ls-label); }
        .bp-t { font-size: 15px; color: var(--text); }

        /* La línea no es decorado: es el plano que separa lo que el cliente ve
           de lo que no, y por eso se dibuja como superficie y no como borde. */
        .bp-linea {
          border: 1px dashed color-mix(in srgb, var(--feel) 70%, transparent);
          background: color-mix(in srgb, var(--feel) 7%, transparent);
          display: grid;
          place-items: center;
          pointer-events: none;
        }
        .bp-linea-txt {
          font-size: 11px;
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--feel);
          background: var(--bg-2);
          padding: 2px 8px;
          border-radius: 999px;
        }

        .bp-lado { display: grid; gap: 18px; }
        .bp-detalle { min-height: 96px; border-left: 2px solid var(--line-strong); padding-left: 16px; }
        .bp-detalle-t { font-size: 15px; color: var(--text); margin-bottom: 6px; }
        .bp-detalle-n { color: var(--dimmer); font-size: 12px; }
        .bp-detalle-d { color: var(--dim); margin: 0; }
        .bp-hint { color: var(--dimmer); margin: 0; }

        .bp-control { display: grid; gap: 8px; }
        .bp-control input { width: 100%; accent-color: var(--mind); }

        .bp-reset {
          justify-self: start;
          padding: 8px 14px;
          border-radius: var(--r-control);
          border: 1px solid var(--line-strong);
          background: var(--surface-2);
          color: var(--text);
          font-size: 14px;
        }
        .bp-reset:hover { border-color: var(--mind); }
        .bp-nota { margin: 0; }
        .bp-cierre {
          margin: 24px 0 0;
          padding-top: 18px;
          border-top: var(--border);
          color: var(--dim);
        }

        @media (max-width: 860px) {
          .bp-cols { grid-template-columns: 1fr; }
          .bp-escena { height: 330px; }
          .bp-shell { padding: 24px 20px; }
        }
      `}</style>
    </section>
  );
}
