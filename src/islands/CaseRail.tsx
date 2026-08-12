import { useEffect, useState } from 'preact/hooks';

interface Props {
  /** Las siete etapas, ya traducidas. */
  etapas: string[];
  titulo: string;
}

/**
 * Índice de las etapas del caso que se está leyendo. Los casos son largos —
 * siete bloques cada uno— y sin esto no hay forma de saber por dónde vas ni de
 * volver a una etapa concreta.
 *
 * Marca la etapa visible y salta dentro del caso activo, no del primero: si
 * estás en QStrauss y pulsas "Resultado", te lleva al de QStrauss.
 *
 * Clases con prefijo `cr-`: los `<style>` de Preact no están encapsulados.
 */
export default function CaseRail({ etapas, titulo }: Props) {
  const [activa, setActiva] = useState(-1);
  const [caso, setCaso] = useState<string | null>(null);

  useEffect(() => {
    const bloques = Array.from(document.querySelectorAll<HTMLElement>('[data-etapa]'));
    if (bloques.length === 0) return;

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          setActiva(Number(el.dataset.etapa));
          setCaso(el.dataset.caso ?? null);
        }
      },
      { rootMargin: '-25% 0px -60% 0px' }
    );
    bloques.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, []);

  const ir = (i: number) => {
    const sel = caso ? `[data-caso="${caso}"][data-etapa="${i}"]` : `[data-etapa="${i}"]`;
    document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav class="cr" aria-label={titulo}>
      <ol class="cr-lista">
        {etapas.map((nombre, i) => (
          <li>
            <button
              type="button"
              class={i === activa ? 'cr-item cr-item--on' : 'cr-item'}
              aria-current={i === activa ? 'step' : undefined}
              onClick={() => ir(i)}
            >
              <span class="cr-marca" aria-hidden="true" />
              <span class="cr-texto">{nombre}</span>
            </button>
          </li>
        ))}
      </ol>

      <style>{`
        /* Solo cuando sobra sitio a los lados del contenido (máx. 1180 px).
           Por debajo estorbaría más de lo que orienta. */
        .cr { display: none; }

        @media (min-width: 1280px) {
          .cr {
            display: block;
            position: fixed;
            left: 24px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 60;
            max-width: 168px;
          }
        }

        .cr-lista { margin: 0; padding: 0; list-style: none; }

        .cr-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 5px 0;
          border: 0;
          background: transparent;
          color: var(--dimmer);
          font-size: 12px;
          text-align: left;
          line-height: 1.3;
          transition: color var(--dur-hover) var(--ease-hover);
        }
        .cr-item:hover { color: var(--dim); }
        .cr-item:hover .cr-marca { background: var(--dim); }

        .cr-marca {
          flex: none;
          width: 14px;
          height: 2px;
          border-radius: var(--r-pill);
          background: var(--line-strong);
          transition: all var(--dur-state) var(--ease-state);
        }

        .cr-item--on { color: var(--text); }
        .cr-item--on .cr-marca { width: 26px; background: var(--accent, var(--clarity)); }

        /* El texto solo se despliega al pasar por encima o al enfocar: en
           reposo es una regla de progreso, no un menú compitiendo por atención. */
        .cr-texto {
          opacity: 0;
          transform: translateX(-4px);
          transition: all var(--dur-hover) var(--ease-hover);
        }
        .cr:hover .cr-texto,
        .cr-item:focus-visible .cr-texto,
        .cr-item--on .cr-texto {
          opacity: 1;
          transform: none;
        }
      `}</style>
    </nav>
  );
}
