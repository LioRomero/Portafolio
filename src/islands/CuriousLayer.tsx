import { useEffect, useRef, useState } from 'preact/hooks';
import { HOME } from '../content/home';
import { UI, type Lang } from '../content/ui';
import { activarSonido, sonidoActivo } from '../lib/sonido';
import { getFinds, onFindsChange, resetFinds, TOTAL_FINDS } from '../lib/finds';
import { getMode, onPrefsChange } from '../lib/prefs';
import {
  LIMITES,
  PINCEL_DEFECTO,
  PINCEL_GOTAS,
  guardarPincel,
  leerPincel,
  type ModoColor,
  type Pincel,
  type TipoPincel,
} from '../lib/pincel';

/** Radio del haz, en px. Fuera de él la letra chica no se lee. */
const BEAM = 210;
/** Distancia a la que un fragmento cuenta como encontrado. */
const FOUND_AT = 130;

/* --- Rastro del cursor ------------------------------------------------------
   Cada trazo es una partícula con su propia edad: vive los mismos segundos
   desde que se dibujó, se mueva el cursor o no. Antes el lienzo entero se
   borraba a la vez, así que al parar el ratón desaparecía todo de golpe.
   Los parámetros salen de `lib/pincel`, ajustables desde el panel.            */

/** Un trazo cada tantos ms: sin esto un gesto rápido crea cientos de partículas. */
const CADENCIA_MS = 26;
/** Las ondas se espacian más: si no, se pisan y dejan de leerse como gotas. */
const CADENCIA_ONDAS_MS = 130;
/** Techo de seguridad por si el navegador entrega eventos muy seguidos. */
const MAX_TRAZOS = 260;
/** Píxeles por segundo al cuadrado con `caida` al máximo. */
const GRAVEDAD = 260;

/**
 * Los tres acentos del sistema, que es lo que el rastro va recorriendo:
 * violeta (pensamiento), cian (claridad) y coral (emoción).
 */
const EMOCIONES: [number, number, number][] = [
  [139, 123, 240], // --mind
  [34, 211, 238], // --clarity
  [240, 70, 107], // --feel
];

/** Pasos de color pregenerados: interpolar en cada frame sería tirar CPU. */
const PASOS_COLOR = 36;
/** Lo que tarda el rastro en recorrer las tres emociones y volver a empezar. */
const CICLO_COLOR_MS = 21000;

interface Trazo {
  x: number;
  y: number;
  /** Velocidad en px/s. La dispersión la reparte al nacer; la caída la empuja. */
  vx: number;
  vy: number;
  r: number;
  nace: number;
  color: number;
}

/**
 * Un sprite por paso de color. Dibujar `drawImage` es mucho más barato que
 * construir un gradiente radial por partícula y por frame.
 */
/** Color interpolado del ciclo, en el paso `i`. */
function rgbDePaso(i: number): [number, number, number] {
  const t = (i / PASOS_COLOR) * EMOCIONES.length;
  const desde = EMOCIONES[Math.floor(t) % EMOCIONES.length]!;
  const hasta = EMOCIONES[(Math.floor(t) + 1) % EMOCIONES.length]!;
  const f = t % 1;
  return [0, 1, 2].map((k) => Math.round(desde[k]! + (hasta[k]! - desde[k]!) * f)) as [
    number,
    number,
    number,
  ];
}

function crearSprites(): HTMLCanvasElement[] {
  const LADO = 128;
  return Array.from({ length: PASOS_COLOR }, (_, i) => {
    const [r, g, b] = rgbDePaso(i);

    const s = document.createElement('canvas');
    s.width = s.height = LADO;
    const cx = s.getContext('2d')!;
    const grad = cx.createRadialGradient(LADO / 2, LADO / 2, 0, LADO / 2, LADO / 2, LADO / 2);
    /* El sprite se hornea a plena opacidad: el brillo real lo pone
       `globalAlpha` en cada frame, que es lo que ajusta el panel. */
    grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
    grad.addColorStop(0.35, `rgba(${r},${g},${b},0.3)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    cx.fillStyle = grad;
    cx.fillRect(0, 0, LADO, LADO);
    return s;
  });
}

/** Índice de sprite fijo para cada acento, cuando no se usa el ciclo. */
const SPRITE_POR_MODO: Record<Exclude<ModoColor, 'ciclo'>, number> = {
  mind: 0,
  clarity: Math.round(PASOS_COLOR / 3),
  feel: Math.round((PASOS_COLOR * 2) / 3),
};

/**
 * ¿Hay un cursor de verdad? El rastro y la linterna dependen de él.
 *
 * Se mira la capacidad del dispositivo, no el ancho: una ventana de escritorio
 * estrecha sigue teniendo ratón, y descartarla por tamaño apagaba el rastro en
 * pantallas pequeñas o con el navegador a media pantalla.
 */
const sinCursor = (): boolean => {
  try {
    return window.matchMedia('(pointer: coarse), (hover: none)').matches;
  } catch {
    return false;
  }
};

const reducedMotion = (): boolean => {
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
 * Capa ambiental: fondo pintado, linterna, playlist y panel curioso.
 * Una sola isla porque los interruptores comparten estado y atajos de teclado.
 *
 * Clases con prefijo `cl-`: los `<style>` de Preact no están encapsulados.
 */
interface Props {
  lang: Lang;
  /**
   * Sólo la página de Casos lo pasa: activa el modo investigador (tecla `R`),
   * que revela las notas de diseño. Llega ya traducido para que la isla no
   * tenga que importar el diccionario de casos, que pesa ~14 KB comprimidos.
   */
  research?: { label: string; hint: string };
}

export default function CuriousLayer({ lang, research }: Props) {
  const t = HOME[lang];
  const u = UI[lang];

  const [panel, setPanel] = useState(false);
  const [found, setFound] = useState<number[]>([]);
  const [paint, setPaint] = useState(true);
  const [pulse, setPulse] = useState(true);
  const [foco, setFoco] = useState(false);
  const [spotify, setSpotify] = useState(false);
  const [motion, setMotion] = useState(true);
  /* Apagado de fabrica: el navegador bloquea el audio sin gesto previo, y
     un portafolio que suena solo es un portafolio que se cierra. */
  const [sonido, setSonido] = useState(false);
  const [xray, setXray] = useState(false);
  const [hasCases, setHasCases] = useState(false);
  const [researchOn, setResearchOn] = useState(false);
  const [ghosts, setGhosts] = useState(0);
  const [ghostTotal, setGhostTotal] = useState(0);
  const [aviso, setAviso] = useState(false);
  /* En "Al grano" toda esta capa está oculta por CSS. Sin esto el bucle de
     pintado seguiría corriendo detrás de un `display:none`, gastando batería
     para dibujar algo que nadie ve. */
  const [explorando, setExplorando] = useState(true);

  useEffect(() => {
    setSonido(sonidoActivo());
  }, []);

  useEffect(() => {
    setExplorando(getMode() !== 'grano');
    return onPrefsChange(({ key, value }) => {
      if (key === 'mode') setExplorando(value !== 'grano');
    });
  }, []);

  const canvas = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const trazos = useRef<Trazo[]>([]);
  const seen = useRef<Set<string>>(new Set());

  /* Los ajustes viven a la vez en estado (para pintar los controles) y en una
     ref (para que el bucle lea el valor vivo sin reiniciarse en cada arrastre
     del deslizador, que cortaría el rastro a cada píxel). */
  const [pincel, setPincel] = useState<Pincel>(PINCEL_DEFECTO);
  const ajustes = useRef<Pincel>(PINCEL_DEFECTO);
  const [pincelAbierto, setPincelAbierto] = useState(false);

  useEffect(() => {
    const guardado = leerPincel();
    ajustes.current = guardado;
    setPincel(guardado);
  }, []);

  const cambiarPincel = (parcial: Partial<Pincel>) => {
    const siguiente = { ...ajustes.current, ...parcial };
    ajustes.current = siguiente;
    setPincel(siguiente);
    guardarPincel(siguiente);
  };

  /** Borra el lienzo de un golpe, sin esperar a que los trazos cumplan su vida. */
  const clearPaint = () => {
    trazos.current.length = 0;
    ctx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
  };

  /* --- Notas encontradas ------------------------------------------------- */
  useEffect(() => {
    setFound(getFinds());
    return onFindsChange(setFound);
  }, []);

  /* Aviso al descubrir una nota. `previas` arranca en null para no anunciar
     las que ya estaban guardadas de una visita anterior. */
  const previas = useRef<number | null>(null);
  const temporizadorAviso = useRef<number | undefined>(undefined);

  useEffect(() => {
    const n = found.length;
    const antes = previas.current;
    previas.current = n;
    if (antes === null || n <= antes) return;

    setAviso(true);
    clearTimeout(temporizadorAviso.current);
    temporizadorAviso.current = window.setTimeout(() => setAviso(false), 2600);
  }, [found]);

  useEffect(() => () => clearTimeout(temporizadorAviso.current), []);

  /* --- Qué ofrece esta página --------------------------------------------- */
  useEffect(() => {
    setGhostTotal(document.querySelectorAll('[data-ghost]').length);
    setHasCases(document.querySelector('.xray-note') !== null);
  }, []);

  /* --- Radiografía: quita la capa de research por sustracción -------------- */
  useEffect(() => {
    const root = document.documentElement;
    if (xray) root.dataset.xray = 'on';
    else delete root.dataset.xray;
  }, [xray]);

  /* --- Modo investigador: revela las notas de diseño de cada caso ---------- */
  useEffect(() => {
    const root = document.documentElement;
    if (researchOn) root.dataset.research = 'on';
    else delete root.dataset.research;
  }, [researchOn]);

  /* --- Movimiento: refleja el estado guardado y lo aplica al documento ---- */
  useEffect(() => {
    const off = (() => {
      try {
        return localStorage.getItem('em-motion') === 'off';
      } catch {
        return false;
      }
    })();
    setMotion(!off);
  }, []);

  const toggleMotion = () => {
    const next = !motion;
    setMotion(next);
    try {
      localStorage.setItem('em-motion', next ? 'on' : 'off');
    } catch {
      /* almacenamiento bloqueado */
    }
    if (next) delete document.documentElement.dataset.motion;
    else document.documentElement.dataset.motion = 'off';
  };

  /* --- Fondo pintado ------------------------------------------------------ */
  useEffect(() => {
    /* Sin cursor no hay rastro: en móvil y con movimiento reducido no se monta. */
    if (sinCursor() || reducedMotion() || !paint || !explorando) return;

    const el = canvas.current;
    if (!el) return;
    const ratio = Math.min(2, window.devicePixelRatio || 1);

    const fit = () => {
      el.width = Math.floor(window.innerWidth * ratio);
      el.height = Math.floor(window.innerHeight * ratio);
      const c = el.getContext('2d');
      c?.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.current = c;
    };
    fit();

    const sprites = crearSprites();

    /* El color avanza con el reloj, no con la posición: el rastro recorre las
       tres emociones y vuelve a empezar, así que un trazo largo queda como un
       degradado de violeta a cian a coral. */
    const colorAhora = (ahora: number) =>
      Math.floor(((ahora % CICLO_COLOR_MS) / CICLO_COLOR_MS) * PASOS_COLOR) % PASOS_COLOR;

    let ultimo = 0;
    const onMove = (e: PointerEvent) => {
      const ahora = performance.now();
      const p = ajustes.current;
      if (ahora - ultimo < (p.tipo === 'ondas' ? CADENCIA_ONDAS_MS : CADENCIA_MS)) return;
      ultimo = ahora;
      if (trazos.current.length >= MAX_TRAZOS) trazos.current.shift();

      /* La dispersión reparte velocidades al nacer: sin ella el trazo se queda
         clavado donde pasó el cursor; con ella se abre como salpicadura. */
      const empuje = p.dispersion * 46;
      trazos.current.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * empuje,
        vy: (Math.random() - 0.5) * empuje,
        r: p.tamano * (0.7 + Math.random() * 0.6),
        nace: ahora,
        color: p.modoColor === 'ciclo' ? colorAhora(ahora) : SPRITE_POR_MODO[p.modoColor],
      });
    };

    let raf = 0;
    let running = true;
    let anterior = performance.now();

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const cx = ctx.current;
      if (!cx || !running) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const ahora = performance.now();
      /* Acotado: al volver de una pestaña en segundo plano el salto sería
         enorme y las gotas se teletransportarían fuera de pantalla. */
      const dt = Math.min(0.05, (ahora - anterior) / 1000);
      anterior = ahora;

      const aj = ajustes.current;
      const vidaMs = aj.duracion * 1000;

      /* Se repinta todo desde cero cada frame. Al no acumular capas no queda
         ninguna película residual, por muchas vueltas que dé el cursor. */
      cx.clearRect(0, 0, w, h);

      /* Cada trazo muere a los `duracion` segundos de nacer, se mueva el
         cursor o no. */
      while (trazos.current.length && ahora - trazos.current[0]!.nace > vidaMs) {
        trazos.current.shift();
      }
      if (trazos.current.length === 0) return;

      /* 55 lpm: dos golpes por ciclo, como un corazón. Modula radio e
         intensidad de todo el rastro a la vez, nunca la posición. */
      let latido = 1;
      if (pulse) {
        const fase = (ahora % 1091) / 1091;
        const golpe = (t0: number) => Math.exp(-Math.pow((fase - t0) / 0.055, 2));
        latido = 0.34 + 1.5 * golpe(0.1) + 0.72 * golpe(0.28);
      }

      cx.globalCompositeOperation = 'lighter';

      for (const p of trazos.current) {
        const edad = (ahora - p.nace) / vidaMs;

        /* Física común: cae, se frena por rozamiento y deriva. */
        p.vy += GRAVEDAD * aj.caida * dt;
        const rozamiento = Math.pow(0.86, dt * 60);
        p.vx *= rozamiento;
        p.vy *= aj.caida > 0 ? 1 : rozamiento;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (aj.tipo === 'ondas') {
          /* Anillo que se expande deprisa y frena, como la onda de una gota:
             el radio va con una curva de salida y el grosor se afina. */
          const avance = 1 - Math.pow(1 - edad, 2.2);
          const radio = p.r * (1.1 + aj.dispersion * 3.4) * avance;
          /* Entra de golpe y se apaga despacio. */
          const vida = Math.min(1, edad * 9) * Math.pow(1 - edad, 1.7);
          const alfa = vida * aj.intensidad * (0.6 + 0.4 * latido);
          if (alfa <= 0.004 || radio < 1) continue;

          const [r, g, b] = rgbDePaso(p.color);
          cx.lineWidth = Math.max(0.6, 2.6 * (1 - edad) * (0.85 + 0.3 * latido));
          cx.strokeStyle = `rgba(${r},${g},${b},${alfa.toFixed(3)})`;
          cx.beginPath();
          cx.arc(p.x, p.y, radio, 0, Math.PI * 2);
          cx.stroke();

          /* Una segunda onda por detrás: es lo que la hace parecer agua y no
             un círculo creciendo. */
          const estela = radio * 0.78;
          if (estela > 1) {
            cx.lineWidth = Math.max(0.5, 1.6 * (1 - edad));
            cx.strokeStyle = `rgba(${r},${g},${b},${(alfa * 0.4).toFixed(3)})`;
            cx.beginPath();
            cx.arc(p.x, p.y, estela, 0, Math.PI * 2);
            cx.stroke();
          }
          continue;
        }

        /* Estela: mancha de luz que se abre y se apaga. */
        const vida = (1 - edad) * (1 - edad);
        const abierto = 1 + edad * aj.dispersion * 1.9;
        const radio = p.r * abierto * (0.82 + 0.26 * latido);

        /* Al abrirse reparte la misma luz en más superficie, así que se
           atenúa: si no, una gota grande quemaría la pantalla. */
        cx.globalAlpha = Math.min(1, (vida * aj.intensidad * (0.55 + 0.45 * latido)) / abierto);
        cx.drawImage(sprites[p.color]!, p.x - radio, p.y - radio, radio * 2, radio * 2);
      }
      cx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(frame);

    /* Pausa cuando la pestaña no está visible: nada de pintar en segundo plano. */
    const onVisibility = () => {
      running = !document.hidden;
      if (!running) clearPaint();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', fit);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', fit);
      document.removeEventListener('visibilitychange', onVisibility);
      /* Al apagar el fondo no debe quedar el último rastro congelado. */
      clearPaint();
    };
  }, [paint, pulse, explorando]);

  /* --- Linterna ------------------------------------------------------------
     Su función es literal: alumbrar la letra chica del portafolio. Los
     fragmentos `[data-ghost]` están en el DOM desde el principio, invisibles,
     y solo se leen dentro del haz. */
  useEffect(() => {
    if (!foco) return;
    const root = document.documentElement;
    root.dataset.foco = 'on';

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-ghost]'));

    const onMove = (e: PointerEvent) => {
      root.style.setProperty('--mx', `${e.clientX}px`);
      root.style.setProperty('--my', `${e.clientY}px`);

      for (const el of targets) {
        const r = el.getBoundingClientRect();
        /* Distancia del cursor al rectángulo, no a su centro: así un párrafo
           ancho se alumbra por la parte que estás mirando. */
        const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
        const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
        const d = Math.hypot(dx, dy);
        const reveal = Math.max(0, 1 - d / BEAM);
        el.style.setProperty('--reveal', reveal.toFixed(3));

        const id = el.dataset.ghost;
        if (id && d < FOUND_AT && !seen.current.has(id)) {
          seen.current.add(id);
          setGhosts(seen.current.size);
        }
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      delete root.dataset.foco;
      window.removeEventListener('pointermove', onMove);
      targets.forEach((el) => el.style.removeProperty('--reveal'));
    };
  }, [foco]);

  /* --- La playlist aparece al terminar la intro ----------------------------
     No suena sola: ningún navegador reproduce audio sin un gesto previo. Lo
     que sí se puede es dejarla servida, a un toque, en cuanto acaba la
     animación. Solo en modo explorar: quien eligió "Al grano" no pidió música. */
  useEffect(() => {
    const alTerminarIntro = () => {
      if (document.documentElement.dataset.mode === 'grano') return;
      setSpotify(true);
    };
    window.addEventListener('em-intro-done', alTerminarIntro);
    return () => window.removeEventListener('em-intro-done', alTerminarIntro);
  }, []);

  /* --- Atajos de teclado --------------------------------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
      const k = e.key;
      if (k === '?') setPanel((p) => !p);
      else if (k === 'Escape') setPanel(false);
      else if (k === 'm' || k === 'M') toggleMotion();
      else if (k === 'f' || k === 'F') setFoco((p) => !p);
      else if (k === 'p' || k === 'P') setSpotify((p) => !p);
      else if (k === 'x' || k === 'X') setXray((p) => !p);
      else if ((k === 'r' || k === 'R') && research) setResearchOn((p) => !p);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const n = found.length;
  const coarse = sinCursor();

  return (
    <div data-playful>
      <canvas ref={canvas} class="cl-paint" aria-hidden="true" />

      {foco && <div class="cl-foco" aria-hidden="true" />}

      {/* Aviso bajo la barra: confirma el hallazgo y se va solo. `role=status`
          para que un lector de pantalla lo anuncie sin robar el foco. */}
      {aviso && (
        <div class="cl-aviso" role="status">
          <span class="cl-aviso-dot" aria-hidden="true" />
          {t.findFound}
          <span class="cl-aviso-cuenta tabular">
            {found.length}/{TOTAL_FINDS}
          </span>
        </div>
      )}

      <button
        type="button"
        class={panel ? 'cl-toggle cl-toggle--on' : 'cl-toggle'}
        title={u.curiousTitle}
        aria-expanded={panel}
        onClick={() => setPanel(!panel)}
      >
        <span class="cl-toggle-dot" aria-hidden="true" />
        {u.curious}
        <span class="cl-toggle-count tabular">
          {n}/{TOTAL_FINDS}
        </span>
      </button>

      {panel && (
        <aside class="cl-panel" aria-label={u.curiousTitle}>
          <p class="cl-intro">{t.panelIntro}</p>

          <div class="cl-bar" aria-hidden="true">
            <div class="cl-bar-fill" style={{ width: `${Math.round((n / TOTAL_FINDS) * 100)}%` }} />
          </div>
          <p class="cl-progress" aria-live="polite">
            {t.progress[Math.min(n, TOTAL_FINDS)]}
          </p>

          {/* La linterna sólo tiene sentido con cursor. En táctil la letra chica
              se muestra siempre, así que aquí no se ofrece el interruptor. */}
          {!coarse && ghostTotal > 0 && (
            <>
              <Row
                label={t.foco}
                on={foco}
                onLabel={u.on}
                offLabel={u.off}
                onClick={() => setFoco(!foco)}
              />
              <p class="cl-ghost-count" aria-live="polite">
                <span class="tabular">
                  {u.finePrint}: {ghosts}/{ghostTotal}
                </span>
                <br />
                {ghosts >= ghostTotal ? u.finePrintDone : foco ? u.finePrintHint : t.ghost2}
              </p>
            </>
          )}

          {research && (
            <>
              <Row
                label={research.label}
                on={researchOn}
                onLabel={u.on}
                offLabel={u.off}
                onClick={() => setResearchOn(!researchOn)}
              />
              <p class="cl-ghost-count">{research.hint}</p>
            </>
          )}

          {hasCases && (
            <>
              <Row
                label={xray ? t.xrayOn : t.xrayOff}
                on={xray}
                onLabel={u.on}
                offLabel={u.off}
                onClick={() => setXray(!xray)}
              />
              <p class="cl-ghost-count">{xray ? t.xrayHintOn : t.xrayHintOff}</p>
            </>
          )}

          <Row
            label={t.spotifyRow}
            on={spotify}
            onLabel={u.on}
            offLabel={u.off}
            onClick={() => setSpotify(!spotify)}
          />
          <Row
            label={u.paintBg}
            on={paint}
            onLabel={u.on}
            offLabel={u.off}
            onClick={() => setPaint(!paint)}
          />
          <Row label={t.pulse} on={pulse} onLabel={u.on} offLabel={u.off} onClick={() => setPulse(!pulse)} />
          <Row label={t.reduceMotion} on={!motion} onLabel={u.on} offLabel={u.off} onClick={toggleMotion} />
          <Row
            label={t.sonido}
            on={sonido}
            onLabel={u.on}
            offLabel={u.off}
            onClick={() => {
              const v = !sonido;
              setSonido(v);
              activarSonido(v);
            }}
          />

          {/* Ajustes del pincel, plegados: son de afinado fino y no deben
              competir con los interruptores principales. */}
          <button
            type="button"
            class="cl-plegar"
            aria-expanded={pincelAbierto}
            onClick={() => setPincelAbierto(!pincelAbierto)}
          >
            {u.pincel}
            <span aria-hidden="true">{pincelAbierto ? '−' : '+'}</span>
          </button>

          {pincelAbierto && (
            <div class="cl-pincel">
              <label class="cl-campo">
                <span class="cl-campo-label">{u.pincelTipo}</span>
                <select
                  class="cl-select"
                  value={pincel.tipo}
                  onChange={(e) =>
                    cambiarPincel({ tipo: (e.target as HTMLSelectElement).value as TipoPincel })
                  }
                >
                  <option value="estela">{u.pincelEstela}</option>
                  <option value="ondas">{u.pincelOndas}</option>
                </select>
              </label>

              <Dial
                label={u.pincelIntensidad}
                valor={pincel.intensidad}
                {...LIMITES.intensidad}
                formato={(v) => `${Math.round(v * 100)}%`}
                onInput={(v) => cambiarPincel({ intensidad: v })}
              />
              <Dial
                label={u.pincelDispersion}
                valor={pincel.dispersion}
                {...LIMITES.dispersion}
                formato={(v) => `${Math.round(v * 100)}%`}
                onInput={(v) => cambiarPincel({ dispersion: v })}
              />
              <Dial
                label={u.pincelCaida}
                valor={pincel.caida}
                {...LIMITES.caida}
                formato={(v) => `${Math.round(v * 100)}%`}
                onInput={(v) => cambiarPincel({ caida: v })}
              />
              <Dial
                label={u.pincelDuracion}
                valor={pincel.duracion}
                {...LIMITES.duracion}
                formato={(v) => `${v.toFixed(1)} s`}
                onInput={(v) => cambiarPincel({ duracion: v })}
              />
              <Dial
                label={u.pincelTamano}
                valor={pincel.tamano}
                {...LIMITES.tamano}
                formato={(v) => `${Math.round(v)} px`}
                onInput={(v) => cambiarPincel({ tamano: v })}
              />

              <label class="cl-campo">
                <span class="cl-campo-label">{u.pincelColor}</span>
                <select
                  class="cl-select"
                  value={pincel.modoColor}
                  onChange={(e) =>
                    cambiarPincel({ modoColor: (e.target as HTMLSelectElement).value as ModoColor })
                  }
                >
                  <option value="ciclo">{u.pincelCiclo}</option>
                  <option value="mind">{u.pincelMind}</option>
                  <option value="clarity">{u.pincelClarity}</option>
                  <option value="feel">{u.pincelFeel}</option>
                </select>
              </label>

              <p class="cl-sense">{u.pincelNota}</p>

              <div class="cl-foot">
                <button type="button" class="cl-link" onClick={() => cambiarPincel(PINCEL_GOTAS)}>
                  {u.pincelGotas}
                </button>
                <button type="button" class="cl-link" onClick={() => cambiarPincel(PINCEL_DEFECTO)}>
                  {u.pincelDefecto}
                </button>
              </div>
            </div>
          )}

          <button type="button" class="cl-link cl-clear-paint" onClick={clearPaint}>
            {t.clearPaint}
          </button>

          <p class="cl-sense">{t.senseHint}</p>
          <p class="cl-keys">{t.panelKeys}</p>

          <div class="cl-foot">
            <button
              type="button"
              class="cl-link"
              onClick={() => {
                resetFinds();
                seen.current.clear();
                setGhosts(0);
                setPanel(false);
              }}
            >
              {t.resetFinds}
            </button>
            <button
              type="button"
              class="cl-link"
              onClick={() => dispatchEvent(new Event('em-open-tutorial'))}
            >
              {t.tutorialLink}
            </button>
          </div>
        </aside>
      )}

      {/* Reproductor propio, fuera del panel: si viviera dentro, cerrar el panel
          cortaría la música. El iframe sólo se pide cuando se activa. */}
      {spotify && (
        <aside class="cl-player" aria-label={t.spotifyRow}>
          <header class="cl-player-head">
            <span class="cl-player-label">{t.nowPlaying}</span>
            <button
              type="button"
              class="cl-player-x"
              aria-label={u.closePlayer}
              onClick={() => setSpotify(false)}
            >
              ✕
            </button>
          </header>
          <iframe
            class="cl-player-frame"
            src={t.spotifySrc}
            width="100%"
            height="152"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            title={t.spotifyRow}
          />
          <p class="cl-player-note">{t.spotifyNote}</p>
          <a class="cl-link" href={t.playlistHref} target="_blank" rel="noopener">
            {t.playlistLink}
          </a>
        </aside>
      )}

      {n >= TOTAL_FINDS && (
        <div class="cl-unlocked" role="status">
          <div class="cl-unlocked-label">{t.unlockedLabel}</div>
          <p class="cl-unlocked-body">{t.unlockedBody}</p>
          <p class="cl-unlocked-tip">{t.unlockedTip}</p>
        </div>
      )}

      <style>{`
        .cl-paint {
          position: fixed;
          inset: 0;
          z-index: var(--z-painted-bg);
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .cl-foco {
          position: fixed;
          inset: 0;
          z-index: 80;
          pointer-events: none;
          background: radial-gradient(
            circle ${BEAM}px at var(--mx, 50%) var(--my, 50%),
            transparent 0%,
            rgba(4, 6, 14, .92) 100%
          );
        }

        .cl-aviso {
          position: fixed;
          top: 68px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 88;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 9px 16px;
          border-radius: var(--r-pill);
          border: 1px solid var(--mind);
          background: color-mix(in srgb, var(--mind) 16%, var(--bg-2));
          color: var(--text);
          font-size: 13px;
          font-weight: var(--fw-medium);
          box-shadow: 0 14px 34px rgba(0, 0, 0, .5);
          pointer-events: none;
          animation: clAviso 2.6s ease both;
        }
        /* Entra rápido, se sostiene y se desvanece sin que haya que cerrarlo. */
        @keyframes clAviso {
          0% { opacity: 0; transform: translate(-50%, -10px); }
          9% { opacity: 1; transform: translate(-50%, 0); }
          76% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -6px); }
        }
        html[data-motion='off'] .cl-aviso { animation: none; }
        @media (prefers-reduced-motion: reduce) { .cl-aviso { animation: none; } }

        .cl-aviso-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--r-pill);
          background: var(--mind);
        }
        .cl-aviso-cuenta { color: var(--on-mind); }

        .cl-toggle {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 85;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: var(--r-pill);
          border: var(--border);
          background: var(--bg-2);
          color: var(--dim);
          font-size: 12.5px;
          font-weight: var(--fw-medium);
          transition: all var(--dur-hover) var(--ease-hover);
        }
        .cl-toggle--on { border-color: var(--mind); background: var(--mind-deep); color: var(--text); }
        .cl-toggle-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--r-pill);
          background: var(--mind);
        }
        .cl-toggle-count { color: var(--dimmer); }

        .cl-panel {
          position: fixed;
          right: 18px;
          bottom: 62px;
          z-index: 86;
          width: min(360px, calc(100vw - 36px));
          max-height: min(70vh, 640px);
          overflow-y: auto;
          border: var(--border);
          border-radius: var(--r-card-lg);
          padding: 20px 22px;
          background: var(--bg-2);
          box-shadow: var(--shadow-modal);
        }
        .cl-intro {
          font-size: var(--fs-body-sm);
          line-height: var(--lh-body-sm);
          color: var(--dim);
          margin-bottom: 16px;
        }
        .cl-bar {
          height: 4px;
          border-radius: var(--r-pill);
          background: var(--line);
          overflow: hidden;
          margin-bottom: 8px;
        }
        .cl-bar-fill {
          height: 100%;
          border-radius: var(--r-pill);
          background: linear-gradient(90deg, var(--mind), var(--clarity));
          transition: width var(--dur-enter) var(--ease-state);
        }
        .cl-progress { font-size: var(--fs-meta); color: var(--dimmer); margin-bottom: 16px; }

        .cl-ghost-count {
          margin: -2px 0 12px;
          font-size: var(--fs-meta);
          line-height: var(--lh-meta);
          color: var(--dimmer);
        }
        .cl-ghost-count .tabular { color: var(--on-mind); }

        .cl-sense, .cl-keys {
          font-size: var(--fs-meta);
          line-height: var(--lh-meta);
          color: var(--dimmer);
          margin-top: 14px;
        }
        .cl-keys { color: var(--dimmer); }

        .cl-plegar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin: 4px 0 8px;
          padding: 11px 14px;
          border-radius: var(--r-control);
          border: var(--border);
          background: var(--bg);
          color: var(--dim);
          font-size: 13.5px;
          font-weight: var(--fw-medium);
          text-align: left;
          transition: border-color var(--dur-hover) var(--ease-hover);
        }
        .cl-plegar:hover { border-color: var(--line-strong); }
        .cl-plegar span { color: var(--dimmer); font-size: 15px; line-height: 1; }

        .cl-pincel {
          margin: 0 0 10px;
          padding: 14px;
          border: var(--border);
          border-radius: var(--r-control);
          background: var(--bg);
        }

        .cl-campo { display: block; margin-bottom: 12px; }
        .cl-campo-label {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
          font-size: var(--fs-meta);
          color: var(--dim);
          margin-bottom: 6px;
        }
        .cl-campo-valor { color: var(--on-mind); }

        .cl-rango {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 3px;
          border-radius: var(--r-pill);
          background: var(--line-strong);
          outline-offset: 6px;
        }
        .cl-rango::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 15px;
          height: 15px;
          border-radius: var(--r-pill);
          background: var(--mind);
          border: 0;
          cursor: pointer;
        }
        .cl-rango::-moz-range-thumb {
          width: 15px;
          height: 15px;
          border-radius: var(--r-pill);
          background: var(--mind);
          border: 0;
          cursor: pointer;
        }

        .cl-select {
          width: 100%;
          padding: 9px 11px;
          border-radius: var(--r-control);
          border: var(--border);
          background: var(--bg-2);
          color: var(--text);
          font-family: inherit;
          font-size: 13px;
        }

        .cl-clear-paint { margin-top: 6px; }
        .cl-foot { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 18px; }
        .cl-link {
          border: 0;
          background: transparent;
          color: var(--link);
          font-size: 13px;
          padding: 0;
        }
        .cl-link:hover { color: var(--link-hover); }

        .cl-player {
          position: fixed;
          left: 18px;
          bottom: 18px;
          z-index: 86;
          width: min(340px, calc(100vw - 36px));
          border: 1px solid var(--clarity-deep);
          border-radius: var(--r-card-lg);
          padding: 14px 16px;
          background: var(--bg-2);
          box-shadow: var(--shadow-modal);
        }
        .cl-player-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .cl-player-label {
          font-size: var(--fs-label);
          font-weight: var(--fw-medium);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--clarity);
        }
        .cl-player-x {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: var(--dimmer);
          font-size: 14px;
          line-height: 1;
          padding: 0;
        }
        .cl-player-x:hover { color: var(--text); }
        .cl-player-frame { border: 0; border-radius: 12px; display: block; }
        .cl-player-note {
          margin: 10px 0 8px;
          font-size: var(--fs-meta);
          line-height: var(--lh-meta);
          color: var(--dimmer);
        }

        .cl-unlocked {
          position: fixed;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          z-index: 84;
          width: min(560px, calc(100vw - 36px));
          border: 1px solid var(--mind);
          border-radius: 16px;
          padding: 22px 24px;
          background: color-mix(in srgb, var(--mind) 12%, var(--bg-2));
          box-shadow: var(--shadow-modal);
        }
        .cl-unlocked-label {
          font-size: var(--fs-label);
          font-weight: var(--fw-medium);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--on-mind);
          margin-bottom: 12px;
        }
        .cl-unlocked-body { font-size: 17px; line-height: 1.55; margin-bottom: 12px; }
        .cl-unlocked-tip { font-size: var(--fs-body-sm); color: var(--dim); }

        .cl-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
          margin-bottom: 8px;
          padding: 11px 14px;
          border-radius: var(--r-control);
          border: var(--border);
          background: var(--bg);
          color: var(--dim);
          font-size: 13.5px;
          text-align: left;
          transition: border-color var(--dur-hover) var(--ease-hover);
        }
        .cl-row:hover { border-color: var(--line-strong); }
        .cl-sw {
          flex: none;
          padding: 3px 10px;
          border-radius: var(--r-pill);
          background: var(--surface-2);
          color: var(--dimmer);
          font-size: 11.5px;
          font-weight: var(--fw-semibold);
        }
        .cl-sw--on { background: var(--clarity-deep); color: var(--on-clarity); }

        @media (max-width: 900px) {
          .cl-toggle, .cl-row { min-height: 44px; }
          /* El reproductor pasa a ancho completo y deja libre el botón curioso. */
          .cl-player { left: 18px; right: 18px; bottom: 74px; width: auto; }
          .cl-unlocked { bottom: 74px; }
        }
      `}</style>
    </div>
  );
}

/** Un deslizador con su valor a la vista: sin cifra no se sabe qué se toca. */
function Dial({
  label,
  valor,
  min,
  max,
  step,
  formato,
  onInput,
}: {
  label: string;
  valor: number;
  min: number;
  max: number;
  step: number;
  formato: (v: number) => string;
  onInput: (v: number) => void;
}) {
  return (
    <label class="cl-campo">
      <span class="cl-campo-label">
        {label}
        <span class="cl-campo-valor tabular">{formato(valor)}</span>
      </span>
      <input
        class="cl-rango"
        type="range"
        min={min}
        max={max}
        step={step}
        value={valor}
        onInput={(e) => onInput(Number((e.target as HTMLInputElement).value))}
      />
    </label>
  );
}

function Row({
  label,
  on,
  onLabel,
  offLabel,
  onClick,
}: {
  label: string;
  on: boolean;
  onLabel: string;
  offLabel: string;
  onClick: () => void;
}) {
  return (
    <button type="button" class="cl-row" aria-pressed={on} onClick={onClick}>
      {label}
      <span class={on ? 'cl-sw cl-sw--on' : 'cl-sw'}>{on ? onLabel : offLabel}</span>
    </button>
  );
}
