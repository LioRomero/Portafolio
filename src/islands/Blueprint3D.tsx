import { useEffect, useRef, useState } from 'preact/hooks';
import { BLUEPRINT } from '../content/blueprint';
import { sonar, leerSonido, activarSonido } from '../lib/sonido';
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
  /* La capa abierta sale del archivador: sube, se acerca y despliega su ficha
     dentro. Se cierra volviendo a tocarla, como un cajon. */
  const [abierta, setAbierta] = useState<number | null>(null);
  /* Arranca ARMADO: el archivador 3D se ve desde que carga la página. Antes
     empezaba vacío y había que colocar las cinco fichas para que apareciera —
     por eso parecía que no había 3D. El montaje queda como opción ("Rearmar"),
     no como peaje para ver la pieza. Al arrancar lleno, el SSR ya pinta las
     cinco capas, así que el 3D aparece incluso antes de hidratar. */
  const [puestas, setPuestas] = useState<number>(t.capas.length);
  const [fallo, setFallo] = useState(false);
  const [suena, setSuena] = useState(false);
  const montado = puestas >= t.capas.length;
  const arrastre = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null);
  const girando = useRef(false);

  useEffect(() => {
    setSuena(leerSonido());
  }, []);

  const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  /* No se captura el puntero al apoyarlo, sino solo cuando el gesto se
     convierte en giro de verdad (mas de 4 px). Capturar de entrada retiraba
     el evento al boton de la capa y el navegador ya no disparaba su `click`:
     por eso los cajones no abrian. */
  const abajo = (e: PointerEvent) => {
    arrastre.current = { x: e.clientX, y: e.clientY, rx, ry };
  };

  const mover = (e: PointerEvent) => {
    const a = arrastre.current;
    if (!a) return;
    const dx = e.clientX - a.x;
    const dy = e.clientY - a.y;
    if (!girando.current) {
      if (Math.hypot(dx, dy) < 4) return;
      /* Si el gesto es mas vertical que horizontal, es scroll y no giro. */
      if (Math.abs(dy) > Math.abs(dx)) {
        arrastre.current = null;
        return;
      }
      girando.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    setRy(limitar(a.ry + dx * 0.4, -70, 70));
    setRx(limitar(a.rx - dy * 0.3, -20, 60));
  };

  const arriba = () => {
    arrastre.current = null;
    /* El `click` llega justo despues del `pointerup`; se levanta la bandera en
       el siguiente turno para que el cajon no se abra al terminar un giro. */
    window.setTimeout(() => {
      girando.current = false;
    }, 0);
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
    setAbierta(null);
  };

  const colocar = (i: number) => {
    if (i === puestas) {
      const fin = puestas + 1;
      setPuestas(fin);
      setFallo(false);
      sonar(fin >= t.capas.length ? 'completo' : 'acierto');
      return;
    }
    setPuestas(0);
    setFallo(true);
    sonar('error');
    window.setTimeout(() => setFallo(false), 1500);
  };

  /* Vaciar el archivador para volver a armarlo paso a paso: el montaje deja de
     ser obligatorio y pasa a ser un juego opcional para quien quiera. */
  const rearmar = () => {
    setAbierta(null);
    setActiva(null);
    setPuestas(0);
  };

  const abrirCajon = (i: number) => {
    const cerrando = abierta === i;
    setAbierta(cerrando ? null : i);
    setActiva(i);
    sonar(cerrando ? 'elegir' : 'acierto');
  };

  const giro = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';

  return (
    <section class="bp-shell" aria-label={t.title}>
      <div class="bp-cabeza">
        <div class="bp-cabeza-fila">
          <span class="label label--mind">{t.kicker}</span>
          <button
            type="button"
            class={suena ? 'bp-sonido bp-sonido--on' : 'bp-sonido'}
            aria-pressed={suena}
            onClick={() => {
              const v = !suena;
              setSuena(v);
              activarSonido(v);
              if (v) sonar('elegir');
            }}
          >
            {suena ? t.sonidoOn : t.sonidoOff}
          </button>
        </div>
        <h3 class="bp-title">{t.title}</h3>
        <p class="bp-lede">{montado ? t.lede : t.montaRegla}</p>
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
                  {i === 3 && puestas > 3 && (
                    <div
                      class="bp-linea"
                      style={{ transform: 'translate3d(0,' + (y + sep * 0.29) + 'px,' + (z + sep / 2) + 'px)' }}
                    >
                      <span class="bp-linea-txt">{t.lineaLabel}</span>
                    </div>
                  )}
                  {i < puestas && (
                  <button
                    type="button"
                    class={
                      'bp-capa bp-capa--' + c.tono +
                      (activa === i ? ' bp-capa--activa' : '') +
                      (abierta === i ? ' bp-capa--abierta' : '')
                    }
                    style={{
                      transform:
                        'translate3d(0,' + (abierta === i ? y - 74 : y) + 'px,' +
                        (abierta === i ? z + 130 : z) + 'px)',
                    }}
                    aria-expanded={abierta === i}
                    onPointerEnter={() => setActiva(i)}
                    onFocus={() => setActiva(i)}
                    onClick={() => {
                      if (girando.current) return;
                      abrirCajon(i);
                    }}
                  >
                    <span class="bp-fila">
                      <span class="bp-n tabular">{c.n}</span>
                      <span class="bp-t">{c.t}</span>
                      <span class="bp-tirador" aria-hidden="true" />
                    </span>
                    {abierta === i && <span class="bp-ficha">{c.d}</span>}
                  </button>
                  )}
                </>
              );
            })}
          </div>
        </div>

        <div class="bp-lado">
          {!montado && (
            <div class={fallo ? 'bp-monta bp-monta--mal' : 'bp-monta'}>
              <span class="bp-monta-cuenta tabular">
                {puestas} / {t.capas.length} {t.montaProgreso}
              </span>
              <span class="bp-monta-aviso" aria-live="polite">
                {fallo ? t.montaError : ''}
              </span>
              <div class="bp-fichas">
                {t.capas.map((c, i) =>
                  i < puestas ? null : (
                    <button type="button" class="bp-ficha-btn" onClick={() => colocar(i)}>
                      {c.t}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {montado && (
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

          )}

          {montado && (
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

          )}

          {montado && (
          <div class="bp-acciones">
            <button type="button" class="bp-reset" onClick={reiniciar}>
              {t.reiniciar}
            </button>
            <button type="button" class="bp-reset bp-reset--ghost" onClick={rearmar}>
              {t.rearmar}
            </button>
          </div>
          )}

          <p class="bp-nota meta">{t.lineaNota}</p>
        </div>
      </div>

      <p class="bp-cierre">{montado ? t.cierre : t.montaHecho}</p>

      <style>{`
        .bp-shell {
          border: var(--border);
          border-radius: var(--r-card-lg);
          padding: 30px 32px 26px;
          background: var(--bg-2);
        }
        .bp-cabeza-fila { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .bp-sonido {
          margin-left: auto;
          padding: 5px 11px;
          border-radius: 999px;
          border: 1px solid var(--line-strong);
          background: transparent;
          color: var(--dimmer);
          font-size: 12.5px;
        }
        .bp-sonido:hover { border-color: var(--mind); color: var(--text); }
        .bp-sonido--on { border-color: var(--mind); color: var(--mind); }
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
          /* pan-y y no none: con none, el dedo apoyado sobre la escena
             secuestraba el desplazamiento de la pagina y en el movil te
             quedabas atascado en un bloque de 330 px. Asi el arrastre
             horizontal gira y el vertical sigue desplazando la pagina. */
          touch-action: pan-y;
          border-radius: var(--r-card);
        }
        .bp-escena:active { cursor: grabbing; }
        .bp-escena:focus-visible { outline: 2px solid var(--mind); outline-offset: 4px; }

        .bp-pila {
          position: relative;
          width: 300px;
          height: 190px;
          transform-style: preserve-3d;
          /* El giro sigue al dedo y por eso va corto: una manipulacion directa
             con 300 ms de transicion se siente rota, no elegante. Lo lento es
             el cajon, que si hay que poder leer. */
          transition: transform .12s linear;
        }
        html[data-motion='off'] .bp-pila { transition: none; }

        .bp-capa, .bp-linea {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          border-radius: 12px;
        }
        /* Cada capa es un cajon del archivador: se saca tirando y vuelve a su
           sitio al empujarla. La transicion es lenta a proposito -- 480 ms --
           porque el movimiento es lo que explica que la capa sale de una pila,
           y a 150 ms no da tiempo a leerlo. */
        .bp-capa {
          display: flex;
          flex-direction: column;
          user-select: none;
          align-items: stretch;
          gap: 10px;
          padding: 13px 18px 0;
          text-align: left;
          font: inherit;
          cursor: pointer;
          border: 1px solid var(--line-strong);
          background: color-mix(in srgb, var(--surface) 86%, transparent);
          box-shadow: 0 18px 40px -24px rgba(0, 0, 0, 0.9);
          transition:
            transform 480ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 260ms var(--ease-hover),
            background 260ms var(--ease-hover),
            box-shadow 320ms var(--ease-hover);
        }
        html[data-motion='off'] .bp-capa { transition: none; }

        .bp-fila { display: flex; align-items: center; gap: 14px; }
        /* El tirador del cajon: sin el, la capa no se lee como algo que se abre. */
        .bp-tirador {
          margin-left: auto;
          width: 26px;
          height: 3px;
          border-radius: 2px;
          background: var(--line-strong);
          transition: background 260ms var(--ease-hover), width 260ms var(--ease-hover);
        }
        .bp-capa--activa .bp-tirador { background: currentColor; width: 34px; }

        .bp-capa--abierta {
          background: var(--surface-2);
          border-color: currentColor;
          box-shadow: 0 26px 60px -22px rgba(0, 0, 0, 0.95), 0 0 40px -10px currentColor;
        }
        .bp-ficha {
          display: block;
          padding-right: 4px;
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--dim);
          animation: bpFicha 420ms 120ms both ease-out;
        }
        @keyframes bpFicha {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: none; }
        }
        html[data-motion='off'] .bp-ficha { animation: none; }
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

        /* Fichas del montaje. Viven al lado de la escena y no debajo, para que
           se vea caer la capa en su sitio sin apartar la vista. */
        .bp-monta { display: grid; gap: 10px; }
        .bp-monta-cuenta { font-size: 13px; color: var(--dimmer); letter-spacing: var(--ls-label); }
        .bp-monta-aviso { font-size: 13px; color: var(--feel); min-height: 18px; }
        .bp-fichas { display: flex; flex-wrap: wrap; gap: 8px; }
        .bp-ficha-btn {
          padding: 9px 14px;
          border-radius: var(--r-control);
          border: 1px solid var(--line-strong);
          background: var(--surface-2);
          color: var(--text);
          font-size: 13.5px;
          text-align: left;
          transition: border-color var(--dur-hover) var(--ease-hover);
        }
        .bp-ficha-btn:hover { border-color: var(--mind); }
        .bp-monta--mal .bp-fichas { animation: bpNo .45s ease; }
        @keyframes bpNo {
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        html[data-motion='off'] .bp-monta--mal .bp-fichas { animation: none; }

        /* La capa recien colocada entra desde arriba: es el gesto que explica
           que se esta apilando algo, y por eso dura lo que dura. */
        .bp-capa { animation: bpEntra 520ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes bpEntra {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        html[data-motion='off'] .bp-capa { animation: none; }
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
        .bp-acciones { display: flex; gap: 10px; flex-wrap: wrap; }
        .bp-reset--ghost { color: var(--dimmer); }
        .bp-reset--ghost:hover { color: var(--text); }
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
