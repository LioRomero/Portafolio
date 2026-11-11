import { useState } from 'preact/hooks';
import type { Lang } from '../content/ui';

/**
 * Caso BID · "Antes y después de la herramienta". Un deslizador recorre la
 * misma tabla de propuestas: a la izquierda la revisión manual (todo se ve
 * igual), a la derecha la herramienta marcando el tipo de inconsistencia.
 * Muestra pensamiento de datos y de interfaz para quien revisa.
 *
 * La tabla es un ejemplo ilustrativo con oferentes anonimizados y lo dice; el
 * único dato real es el del caso (311 de 622 contratos).
 * Clases con prefijo `ad-`.
 */

type Celda = { v: string; error?: 'precio' | 'dato' | 'producto' };

const T = {
  es: {
    skill: 'Habilidad · Datos e interfaz para decidir',
    titulo: 'La misma licitación, antes y después',
    instr: 'Mueve el control: a la izquierda, revisar a mano; a la derecha, lo que señala la herramienta.',
    manual: 'Revisión manual',
    herramienta: 'Con la herramienta',
    slider: 'Comparar revisión manual y herramienta',
    cols: ['Oferente', 'Precio', 'Datos', 'Producto'],
    tipos: { precio: 'Precio', dato: 'Dato faltante', producto: 'Producto' },
    filas: [
      ['Oferente A', { v: 'Dentro del estimado' }, { v: 'Completos' }, { v: 'El que se pidió' }],
      ['Oferente B', { v: 'Por encima del estimado', error: 'precio' }, { v: 'Completos' }, { v: 'El que se pidió' }],
      ['Oferente C', { v: 'Dentro del estimado' }, { v: 'Campo obligatorio vacío', error: 'dato' }, { v: 'Otro producto', error: 'producto' }],
    ] as [string, Celda, Celda, Celda][],
    resumen: (n: number) => (n === 0 ? 'Nada marcado: hay que leer cada campo.' : n === 1 ? '1 inconsistencia marcada, sin leer documento por documento.' : `${n} inconsistencias marcadas, sin leer documento por documento.`),
    real: 'Ejemplo ilustrativo con oferentes anonimizados, no son datos reales. El dato real: sobre el catálogo de contratos, la herramienta detectó inconsistencias en 311 de 622.',
  },
  en: {
    skill: 'Skill · Data and interfaces for decisions',
    titulo: 'The same tender, before and after',
    instr: 'Move the control: on the left, reviewing by hand; on the right, what the tool flags.',
    manual: 'Manual review',
    herramienta: 'With the tool',
    slider: 'Compare manual review and the tool',
    cols: ['Bidder', 'Price', 'Data', 'Product'],
    tipos: { precio: 'Price', dato: 'Missing data', producto: 'Product' },
    filas: [
      ['Bidder A', { v: 'Within the estimate' }, { v: 'Complete' }, { v: 'As requested' }],
      ['Bidder B', { v: 'Above the estimate', error: 'precio' }, { v: 'Complete' }, { v: 'As requested' }],
      ['Bidder C', { v: 'Within the estimate' }, { v: 'Required field empty', error: 'dato' }, { v: 'A different product', error: 'producto' }],
    ] as [string, Celda, Celda, Celda][],
    resumen: (n: number) => (n === 0 ? 'Nothing flagged: every field has to be read.' : n === 1 ? '1 inconsistency flagged, without reading document by document.' : `${n} inconsistencies flagged, without reading document by document.`),
    real: 'Illustrative example with anonymised bidders, not real data. The real figure: across the contract catalogue, the tool flagged inconsistencies in 311 of 622.',
  },
};

/** Columnas fijas: las dos tablas superpuestas deben coincidir celda por celda. */
const COL_NOMBRE = 22;
const COL_DATO = (100 - COL_NOMBRE) / 3;

function Tabla({ t, marcada }: { t: (typeof T)['es']; marcada: boolean }) {
  return (
    <table class={`ad-tabla${marcada ? ' ad-tabla--marcada' : ''}`} aria-hidden={marcada ? 'true' : undefined}>
      <colgroup>
        <col style={{ width: `${COL_NOMBRE}%` }} />
        <col style={{ width: `${COL_DATO}%` }} />
        <col style={{ width: `${COL_DATO}%` }} />
        <col style={{ width: `${COL_DATO}%` }} />
      </colgroup>
      <thead>
        <tr>
          {t.cols.map((c) => (
            <th scope="col" key={c}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {t.filas.map(([nombre, ...celdas]) => (
          <tr key={nombre}>
            <th scope="row">
              {/* En móvil solo queda la letra: el encabezado ya dice "Oferente". */}
              <span class="ad-n-pre">{nombre.slice(0, nombre.lastIndexOf(' ') + 1)}</span>
              {nombre.slice(nombre.lastIndexOf(' ') + 1)}
            </th>
            {celdas.map((c, i) => (
              <td key={i} class={marcada && c.error ? 'ad-error' : ''}>
                {/* La insignia existe en las dos tablas para que midan igual; en la manual es invisible. */}
                {c.error && <span class={marcada ? 'ad-badge' : 'ad-badge ad-badge--oculta'}>{t.tipos[c.error]}</span>}
                {c.v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AntesDespuesBid({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [pos, setPos] = useState(35);
  // Una celda cuenta como marcada cuando el control ya pasó la mitad de su columna.
  const marcadas = t.filas
    .flatMap(([, ...c]) => c.map((celda, i) => ({ celda, centro: COL_NOMBRE + COL_DATO * (i + 0.5) })))
    .filter(({ celda, centro }) => celda.error && pos >= centro).length;

  return (
    <div class="ad">
      <p class="ad-skill">{t.skill}</p>
      <h3 class="ad-titulo">{t.titulo}</h3>
      <p class="ad-instr">{t.instr}</p>

      <div class="ad-etiquetas" aria-hidden="true">
        <span>{t.manual}</span>
        <span>{t.herramienta}</span>
      </div>
      <div class="ad-marco">
        <Tabla t={t} marcada={false} />
        <div class="ad-capa" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Tabla t={t} marcada={true} />
        </div>
        <div class="ad-linea" style={{ left: `${pos}%` }} aria-hidden="true" />
      </div>
      <input
        class="ad-rango"
        type="range"
        min={0}
        max={100}
        value={pos}
        aria-label={t.slider}
        aria-valuetext={`${pos}% · ${t.resumen(marcadas)}`}
        onInput={(e) => setPos(Number((e.target as HTMLInputElement).value))}
      />
      <p class="ad-resumen" aria-live="polite">
        {t.resumen(marcadas)}
      </p>
      <p class="ad-real">{t.real}</p>

      <style>{`
        .ad { margin-top: 28px; padding: clamp(20px, 3vw, 32px); border-radius: 18px; background: #f4f2fb; border: 1px solid var(--line); }
        .ad-skill { font-size: 12.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--c-oscuro, #4b34a8); }
        .ad-titulo { margin-top: 6px; font-family: var(--serif); font-weight: 400; font-size: clamp(24px, 2.6vw, 30px); line-height: 1.15; }
        .ad-instr { margin-top: 8px; font-size: 15.5px; line-height: 1.55; color: var(--dimmer); max-width: 60ch; }
        .ad-etiquetas { margin-top: 20px; display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--dimmer); }
        .ad-marco { position: relative; margin-top: 8px; border-radius: 12px; overflow: hidden; border: 1px solid var(--line); background: #fff; }
        .ad-capa { position: absolute; inset: 0; background: #fff; }
        .ad-tabla { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: 14.5px; }
        .ad-capa .ad-tabla { height: 100%; }
        .ad-tabla th, .ad-tabla td { padding: 12px 12px; text-align: left; border-bottom: 1px solid var(--line); vertical-align: top; }
        .ad-tabla thead th { font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--dimmer); background: #faf9f6; }
        .ad-tabla tbody th { font-weight: 600; }
        .ad-tabla th, .ad-tabla td { overflow-wrap: break-word; }
        .ad-tabla td { color: #55585f; }
        .ad-tabla--marcada thead th { background: #efeafd; }
        .ad-error { background: #fdecea; color: #8a1c12 !important; }
        .ad-badge { display: block; width: fit-content; margin: 0 0 6px; padding: 2px 8px; border-radius: 999px; background: #b42318; color: #fff; font-size: 11.5px; font-weight: 700; }
        .ad-badge--oculta { visibility: hidden; }
        .ad-linea { position: absolute; top: 0; bottom: 0; width: 3px; margin-left: -1.5px; background: var(--c, #6a4fd0); pointer-events: none; }
        .ad-rango { width: 100%; margin-top: 14px; accent-color: var(--c, #6a4fd0); min-height: 32px; }
        .ad-resumen { margin-top: 6px; font-size: 15px; font-weight: 600; color: var(--c-oscuro, #4b34a8); }
        .ad-real { margin-top: 8px; font-size: 13px; line-height: 1.5; color: var(--dimmer); }
        @media (max-width: 560px) { .ad-tabla { font-size: 12.5px; } .ad-tabla th, .ad-tabla td { padding: 10px 6px; } .ad-tabla thead th { font-size: 10px; letter-spacing: 0; } .ad-n-pre { display: none; } .ad-badge { font-size: 10.5px; padding: 2px 6px; } }
      `}</style>
    </div>
  );
}
