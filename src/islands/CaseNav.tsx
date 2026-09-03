import { useEffect } from 'preact/hooks';

export interface CaseTab {
  key: string;
  label: string;
  accent: string;
  /** Ruta de la página de ese caso, con el prefijo de despliegue ya puesto. */
  href: string;
}

interface Props {
  tabs: CaseTab[];
  /** Caso que se está viendo ahora, para resaltar su pestaña. */
  current: string;
  /** Etiqueta accesible ya traducida: así la isla no importa el diccionario. */
  navLabel: string;
}

/**
 * Selector de caso pegado bajo la barra. Cada caso es su propia página, así que
 * las pestañas son enlaces de verdad y `←` `→` navegan entre páginas — no hacen
 * scroll. Es navegación pura, presente también en modo "Al grano".
 *
 * Clases con prefijo `cn-`: los `<style>` de Preact no están encapsulados.
 */
export default function CaseNav({ tabs, current, navLabel }: Props) {
  const order = tabs.map((t) => t.key);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const i = order.indexOf(current);
      if (i === -1) return;
      const step = e.key === 'ArrowRight' ? 1 : -1;
      const dest = tabs[(i + step + tabs.length) % tabs.length]!;
      window.location.href = dest.href;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current]);

  return (
    <nav class="cn-nav" aria-label={navLabel}>
      {tabs.map((t) => (
        <a
          class={t.key === current ? 'cn-tab cn-tab--on' : 'cn-tab'}
          href={t.href}
          aria-current={t.key === current ? 'page' : undefined}
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
