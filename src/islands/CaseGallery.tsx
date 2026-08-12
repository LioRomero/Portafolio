import { useEffect, useState } from 'preact/hooks';

export interface Lamina {
  src: string;
  alt: string;
  cap: string;
}

interface Props {
  laminas: Lamina[];
  /** Etiquetas ya traducidas: la isla no importa el diccionario de casos. */
  anterior: string;
  siguiente: string;
  imagen: string;
  /** Acento del caso, para los puntos de posición. */
  accent: string;
}

/**
 * Las imágenes de un caso, de una en una, con el pie cambiando según cuál se
 * mire. Antes iban apiladas: el par antes/después obligaba a mover los ojos
 * entre dos marcos de distinto tamaño. Aquí ocupan el mismo sitio, así que
 * pasar de una a otra es una comparación directa.
 *
 * Clases con prefijo `cg-`: los `<style>` de Preact no están encapsulados.
 */
export default function CaseGallery({ laminas, anterior, siguiente, imagen, accent }: Props) {
  const [i, setI] = useState(0);
  const total = laminas.length;
  const actual = laminas[i]!;

  const ir = (paso: number) => setI((n) => (n + paso + total) % total);

  /* Flechas solo cuando el foco está dentro: en la página de Casos las flechas
     globales saltan de caso, y robárselas al visitante sería peor. */
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.stopPropagation();
      ir(-1);
    } else if (e.key === 'ArrowRight') {
      e.stopPropagation();
      ir(1);
    }
  };

  /* Precarga la siguiente para que el salto no parpadee. */
  useEffect(() => {
    if (total < 2) return;
    const img = new Image();
    img.src = laminas[(i + 1) % total]!.src;
  }, [i, total, laminas]);

  return (
    <figure
      class="cg"
      style={{ '--accent': accent } as Record<string, string>}
      onKeyDown={onKey}
      tabIndex={0}
      aria-roledescription="carousel"
    >
      <div class="cg-marco">
        <img src={actual.src} alt={actual.alt} loading="lazy" decoding="async" />
      </div>

      <figcaption class="cg-pie">
        <p class="cg-cap" aria-live="polite">
          {actual.cap}
        </p>

        <div class="cg-mandos">
          <span class="cg-cuenta tabular">
            {imagen} {i + 1}/{total}
          </span>
          <div class="cg-puntos">
            {laminas.map((l, k) => (
              <button
                type="button"
                class={k === i ? 'cg-punto cg-punto--on' : 'cg-punto'}
                aria-label={`${imagen} ${k + 1}: ${l.cap}`}
                aria-current={k === i}
                onClick={() => setI(k)}
              />
            ))}
          </div>
          <button type="button" class="cg-flecha" aria-label={anterior} onClick={() => ir(-1)}>
            ‹
          </button>
          <button type="button" class="cg-flecha" aria-label={siguiente} onClick={() => ir(1)}>
            ›
          </button>
        </div>
      </figcaption>

      <style>{`
        .cg {
          margin: 0;
          border: var(--border);
          border-radius: var(--r-card-lg);
          overflow: hidden;
          background: var(--bg-2);
        }
        .cg:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .cg-marco { display: block; background: var(--bg-2); }
        .cg-marco img { width: 100%; height: auto; display: block; }

        .cg-pie {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 12px 16px;
          border-top: var(--border);
        }
        .cg-cap {
          flex: 1 1 240px;
          margin: 0;
          font-size: var(--fs-meta);
          line-height: var(--lh-meta);
          color: var(--dimmer);
        }

        .cg-mandos { display: flex; align-items: center; gap: 10px; }
        .cg-cuenta { font-size: var(--fs-meta); color: var(--dimmer); }

        .cg-puntos { display: flex; gap: 6px; }
        .cg-punto {
          width: 7px;
          height: 7px;
          padding: 0;
          border: 0;
          border-radius: var(--r-pill);
          background: var(--line-strong);
          transition: all var(--dur-state) var(--ease-state);
        }
        .cg-punto--on { width: 20px; background: var(--accent); }

        .cg-flecha {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: var(--r-pill);
          border: var(--border);
          background: transparent;
          color: var(--dim);
          font-size: 17px;
          line-height: 1;
          transition: all var(--dur-hover) var(--ease-hover);
        }
        .cg-flecha:hover { border-color: var(--accent); color: var(--text); }

        @media (max-width: 900px) {
          .cg-flecha { width: 44px; height: 44px; }
          .cg-pie { padding: 12px; }
        }
      `}</style>
    </figure>
  );
}
