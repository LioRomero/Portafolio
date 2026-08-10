import { useEffect, useState } from 'preact/hooks';

export interface CaseTab {
  key: string;
  label: string;
  accent: string;
}

interface Props {
  tabs: CaseTab[];
  /** Etiqueta accesible ya traducida: así la isla no importa el diccionario. */
  navLabel: string;
}

/**
 * Selector de caso pegado bajo la barra, con `←` `→` para moverse entre casos.
 * Es navegación pura, no capa lúdica: sigue presente en modo "Al grano" y no
 * comparte fila con interruptores — en móvil eso costaba dos líneas fijas.
 *
 * Clases con prefijo `cn-`: los `<style>` de Preact no están encapsulados.
 */
export default function CaseNav({ tabs, navLabel }: Props) {
  const order = tabs.map((t) => t.key);
  const [active, setActive] = useState<string>(order[0]!);

  /* El caso activo se deduce de lo que está en pantalla, no del hash. */
  useEffect(() => {
    const sections = order
      .map((k) => document.getElementById(k))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const key = (entry.target as HTMLElement).dataset.case;
            if (key) setActive(key);
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const i = order.indexOf(active);
      const step = e.key === 'ArrowRight' ? 1 : -1;
      const next = order[(i + step + order.length) % order.length]!;
      document.getElementById(next)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <nav class="cn-nav" aria-label={navLabel}>
      {tabs.map((t) => (
        <a
          class={t.key === active ? 'cn-tab cn-tab--on' : 'cn-tab'}
          href={`#${t.key}`}
          aria-current={t.key === active ? 'true' : undefined}
          style={{ '--accent': t.accent } as Record<string, string>}
        >
          {t.label}
        </a>
      ))}

      <style>{`
        .cn-nav {
          position: sticky;
          top: 56px;
          z-index: 70;
          display: flex;
          gap: 8px;
          padding: 10px 20px;
          background: color-mix(in srgb, var(--bg) 88%, transparent);
          backdrop-filter: blur(8px);
          border-bottom: var(--border);
        }
        .cn-tab {
          padding: 6px 14px;
          border-radius: var(--r-pill);
          border: var(--border);
          color: var(--dim);
          font-size: 13px;
          font-weight: var(--fw-medium);
          transition: all var(--dur-hover) var(--ease-hover);
        }
        .cn-tab:hover { color: var(--text); border-color: var(--line-strong); }
        .cn-tab--on {
          border-color: var(--accent);
          background: color-mix(in srgb, var(--accent) 14%, transparent);
          color: var(--text);
        }
        @media (max-width: 900px) {
          .cn-nav { padding: 8px 14px; }
          .cn-tab {
            min-height: 36px;
            display: inline-flex;
            align-items: center;
            font-size: 12.5px;
            padding: 6px 12px;
          }
        }
      `}</style>
    </nav>
  );
}
