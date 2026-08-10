import { useEffect, useRef, useState } from 'preact/hooks';
import { HOME } from '../content/home';
import { UI, type Lang } from '../content/ui';
import { getFinds, onFindsChange, resetFinds, TOTAL_FINDS } from '../lib/finds';

type Hue = '#8B7BF0' | '#22D3EE' | '#F0466B';

const HUE_BY_SECTION: Record<string, Hue> = {
  mind: '#8B7BF0',
  clarity: '#22D3EE',
  feel: '#F0466B',
};

/** Radio del haz, en px. Fuera de él la letra chica no se lee. */
const BEAM = 210;
/** Distancia a la que un fragmento cuenta como encontrado. */
const FOUND_AT = 130;

const isCoarse = (): boolean => {
  try {
    return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900;
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
  const [xray, setXray] = useState(false);
  const [hasCases, setHasCases] = useState(false);
  const [researchOn, setResearchOn] = useState(false);
  const [ghosts, setGhosts] = useState(0);
  const [ghostTotal, setGhostTotal] = useState(0);

  const canvas = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const points = useRef<{ x: number; y: number; r: number }[]>([]);
  const hue = useRef<Hue>('#8B7BF0');
  const seen = useRef<Set<string>>(new Set());

  /** Borra el lienzo de un golpe, sin esperar al desvanecido. */
  const clearPaint = () => {
    points.current.length = 0;
    const cx = ctx.current;
    if (!cx) return;
    cx.globalCompositeOperation = 'destination-out';
    cx.fillStyle = 'rgba(0,0,0,1)';
    cx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  };

  /* --- Notas encontradas ------------------------------------------------- */
  useEffect(() => {
    setFound(getFinds());
    return onFindsChange(setFound);
  }, []);

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
    if (isCoarse() || reducedMotion() || !paint) return;

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

    const onMove = (e: PointerEvent) => {
      if (points.current.length < 44) {
        points.current.push({ x: e.clientX, y: e.clientY, r: 55 + Math.random() * 75 });
      }
    };

    /* El color depende de la sección visible: violeta donde se reflexiona,
       coral en los casos, cian en el método. */
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-hue]'));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const key = (entry.target as HTMLElement).dataset.hue ?? 'mind';
            hue.current = HUE_BY_SECTION[key] ?? '#8B7BF0';
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );
    sections.forEach((s) => observer.observe(s));

    let raf = 0;
    let running = true;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const cx = ctx.current;
      if (!cx || !running) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      /* Cada frame borra un 10%: el rastro se desvanece en ~0.4s. */
      cx.globalCompositeOperation = 'destination-out';
      cx.fillStyle = 'rgba(0,0,0,0.10)';
      cx.fillRect(0, 0, w, h);

      cx.globalCompositeOperation = 'lighter';

      /* 55 bpm. El latido modula radio e intensidad, nunca la posición. */
      let beat = 1;
      if (pulse) {
        const phase = (performance.now() % 1100) / 1100;
        const thump = (t0: number) => Math.exp(-Math.pow((phase - t0) / 0.055, 2));
        beat = 0.34 + 1.5 * thump(0.1) + 0.72 * thump(0.28);
      }
      const alpha = Math.min(255, Math.round(20 + 30 * beat))
        .toString(16)
        .padStart(2, '0');

      let p = points.current.shift();
      while (p) {
        const r = p.r * (0.72 + 0.34 * beat);
        const grad = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0, hue.current + alpha);
        grad.addColorStop(1, hue.current + '00');
        cx.fillStyle = grad;
        cx.beginPath();
        cx.arc(p.x, p.y, r, 0, Math.PI * 2);
        cx.fill();
        p = points.current.shift();
      }
    };
    raf = requestAnimationFrame(frame);

    /* Pausa cuando la pestaña no está visible: nada de pintar en segundo plano. */
    const onVisibility = () => {
      running = !document.hidden;
      if (!running) points.current.length = 0;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', fit);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', fit);
      document.removeEventListener('visibilitychange', onVisibility);
      /* Al apagar el fondo no debe quedar el último rastro congelado. */
      clearPaint();
    };
  }, [paint, pulse]);

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
  const coarse = isCoarse();

  return (
    <div data-playful>
      <canvas ref={canvas} class="cl-paint" aria-hidden="true" />

      {foco && <div class="cl-foco" aria-hidden="true" />}

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
        .cl-keys { color: var(--disabled); }

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
