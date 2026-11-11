import { useState } from 'preact/hooks';
import type { Lang } from '../content/ui';

/**
 * Caso Ropofy · "Del ruido al hallazgo". Una pared de post-its: el visitante
 * quita las suposiciones del encargo y lo que queda (lo que dijeron los
 * clientes) se agrupa solo en tres temas, como en un affinity map. Muestra la
 * habilidad de síntesis de research, no decora.
 *
 * Todo el contenido sale del caso (s1–s4 de CASES_UX.ropofy). La frase del
 * cliente es reconstruida y lo dice.
 * Clases con prefijo `pt-`: los <style> de Preact no están encapsulados.
 */

type Tema = 'espera' | 'dispersion' | 'conversacion';
interface Nota {
  id: string;
  tipo: 'supuesto' | 'evidencia';
  tema?: Tema;
  texto: string;
}

const T = {
  es: {
    skill: 'Habilidad · Síntesis de research',
    titulo: 'Del ruido al hallazgo',
    instruccion: 'Quita los post-its que son suposiciones del encargo. Deja lo que dijeron los clientes.',
    quedan: (n: number) => (n === 1 ? 'Queda 1 suposición' : `Quedan ${n} suposiciones`),
    seQueda: 'Esto lo dijeron los clientes: se queda.',
    fuera: 'Suposición fuera.',
    agrupar: 'Agrupar lo que queda',
    reiniciar: 'Volver a empezar',
    temas: { espera: 'Espera', dispersion: 'Dispersión', conversacion: 'Conversación' } as Record<Tema, string>,
    insight: 'El problema no era la web. Era el tiempo de respuesta.',
    insightSub: 'Por eso el rediseño se organizó alrededor del contacto y los tres canales llegaron a una bandeja única.',
    aviso: 'La frase del cliente está reconstruida de mis notas de entrevista; no es una transcripción literal.',
    notas: [
      { id: 'a1', tipo: 'supuesto', texto: 'La web se ve vieja.' },
      { id: 'e1', tipo: 'evidencia', tema: 'espera', texto: '“Escribí el viernes y me contestaron el martes. Ya había comprado en otro lado.”' },
      { id: 'a2', tipo: 'supuesto', texto: 'Necesitamos una web más moderna.' },
      { id: 'e3', tipo: 'evidencia', tema: 'dispersion', texto: 'La misma consulta entra por WhatsApp, por la web y por Instagram.' },
      { id: 'a3', tipo: 'supuesto', texto: 'El problema está en el checkout.' },
      { id: 'e5', tipo: 'evidencia', tema: 'conversacion', texto: 'Casi nadie compra sin hablar antes con alguien.' },
      { id: 'e2', tipo: 'evidencia', tema: 'espera', texto: 'Para el cliente, no contestar se lee como “no me quieren vender”.' },
      { id: 'a4', tipo: 'supuesto', texto: 'Un chatbot lo resolvería.' },
      { id: 'e4', tipo: 'evidencia', tema: 'dispersion', texto: 'Algunas consultas se responden dos veces y otras ninguna.' },
    ] as Nota[],
  },
  en: {
    skill: 'Skill · Research synthesis',
    titulo: 'From noise to insight',
    instruccion: 'Remove the sticky notes that are assumptions from the brief. Keep what customers said.',
    quedan: (n: number) => (n === 1 ? '1 assumption left' : `${n} assumptions left`),
    seQueda: 'Customers said this: it stays.',
    fuera: 'Assumption removed.',
    agrupar: 'Group what’s left',
    reiniciar: 'Start over',
    temas: { espera: 'Waiting', dispersion: 'Scattered', conversacion: 'Conversation' } as Record<Tema, string>,
    insight: 'The problem wasn’t the website. It was response time.',
    insightSub: 'That’s why the redesign was built around contact, and the three channels landed in a single inbox.',
    aviso: 'The customer quote is reconstructed from my interview notes; it isn’t a literal transcript.',
    notas: [
      { id: 'a1', tipo: 'supuesto', texto: 'The site looks old.' },
      { id: 'e1', tipo: 'evidencia', tema: 'espera', texto: '“I wrote on Friday and they replied on Tuesday. I’d already bought somewhere else.”' },
      { id: 'a2', tipo: 'supuesto', texto: 'We need a more modern site.' },
      { id: 'e3', tipo: 'evidencia', tema: 'dispersion', texto: 'The same enquiry comes in through WhatsApp, the website and Instagram.' },
      { id: 'a3', tipo: 'supuesto', texto: 'The problem is the checkout.' },
      { id: 'e5', tipo: 'evidencia', tema: 'conversacion', texto: 'Almost nobody buys without talking to someone first.' },
      { id: 'e2', tipo: 'evidencia', tema: 'espera', texto: 'To the customer, no reply reads as “they don’t want to sell to me”.' },
      { id: 'a4', tipo: 'supuesto', texto: 'A chatbot would fix it.' },
      { id: 'e4', tipo: 'evidencia', tema: 'dispersion', texto: 'Some enquiries get answered twice, and others not at all.' },
    ] as Nota[],
  },
};

const GIRO = [-2.5, 1.8, -1.2, 2.4, -1.8, 1.2, 2, -2.2, 1.4];
const TEMAS: Tema[] = ['espera', 'dispersion', 'conversacion'];

export default function PostitsRopofy({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [fuera, setFuera] = useState<Set<string>>(new Set());
  const [agrupado, setAgrupado] = useState(false);
  const [aviso, setAviso] = useState('');
  const [sacude, setSacude] = useState<string | null>(null);

  const supuestos = t.notas.filter((n) => n.tipo === 'supuesto');
  const quedan = supuestos.filter((n) => !fuera.has(n.id)).length;

  const tocar = (n: Nota) => {
    if (agrupado) return;
    if (n.tipo === 'supuesto') {
      const s = new Set(fuera);
      s.add(n.id);
      setFuera(s);
      setAviso(`${t.fuera} ${t.quedan(supuestos.length - s.size)}.`);
    } else {
      setSacude(n.id);
      setAviso(t.seQueda);
      setTimeout(() => setSacude(null), 450);
    }
  };

  const reiniciar = () => {
    setFuera(new Set());
    setAgrupado(false);
    setAviso('');
  };

  const visibles = t.notas.filter((n) => !fuera.has(n.id));

  return (
    <div class="pt">
      <p class="pt-skill">{t.skill}</p>
      <h3 class="pt-titulo">{t.titulo}</h3>
      <p class="pt-instr">{t.instruccion}</p>

      {!agrupado ? (
        <ul class="pt-pared">
          {visibles.map((n) => {
            const i = t.notas.indexOf(n);
            return (
              <li key={n.id}>
                <button
                  type="button"
                  class={`pt-nota pt-${n.tipo}${sacude === n.id ? ' pt-sacude' : ''}`}
                  style={{ '--pt-giro': `${GIRO[i % GIRO.length]}deg` } as Record<string, string>}
                  onClick={() => tocar(n)}
                >
                  {n.texto}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div class="pt-grupos">
          {TEMAS.map((tema) => (
            <div class="pt-grupo" key={tema}>
              <p class="pt-grupo-t">{t.temas[tema]}</p>
              <ul>
                {t.notas
                  .filter((n) => n.tema === tema)
                  .map((n) => (
                    <li class="pt-nota pt-evidencia pt-fija" key={n.id}>
                      {n.texto}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
          <div class="pt-insight" role="status">
            <p class="pt-insight-t">{t.insight}</p>
            <p class="pt-insight-p">{t.insightSub}</p>
          </div>
        </div>
      )}

      <div class="pt-barra">
        {!agrupado && <span class="pt-cuenta">{t.quedan(quedan)}</span>}
        {!agrupado && quedan === 0 && (
          <button type="button" class="pt-boton" onClick={() => setAgrupado(true)}>
            {t.agrupar}
          </button>
        )}
        {(agrupado || fuera.size > 0) && (
          <button type="button" class="pt-boton pt-boton--borde" onClick={reiniciar}>
            {t.reiniciar}
          </button>
        )}
      </div>
      <p class="pt-vivo" aria-live="polite">
        {aviso}
      </p>
      <p class="pt-aviso">{t.aviso}</p>

      <style>{`
        .pt { margin-top: 28px; padding: clamp(20px, 3vw, 32px); border-radius: 18px; background: #f6f3ec; border: 1px solid var(--line); }
        .pt-skill { font-size: 12.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--c-oscuro, #9a3a08); }
        .pt-titulo { margin-top: 6px; font-family: var(--serif); font-weight: 400; font-size: clamp(24px, 2.6vw, 30px); line-height: 1.15; }
        .pt-instr { margin-top: 8px; font-size: 15.5px; line-height: 1.55; color: var(--dimmer); max-width: 60ch; }
        .pt-pared { list-style: none; margin: 22px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 170px), 1fr)); gap: 16px; }
        @media (max-width: 560px) { .pt-pared { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; } .pt-nota { min-height: 96px; padding: 12px 11px; font-size: 13.5px; } }
        .pt-nota {
          width: 100%; min-height: 120px; padding: 16px 14px; text-align: left;
          font-size: 15px; line-height: 1.4; color: #1d1d1b; border: 0; border-radius: 4px;
          box-shadow: 0 6px 14px rgba(0,0,0,.09), 0 1px 2px rgba(0,0,0,.08);
          transform: rotate(var(--pt-giro, 0deg)); transition: transform 200ms ease, box-shadow 200ms ease;
          cursor: pointer; font-family: inherit;
        }
        .pt-supuesto { background: #fde68a; }
        .pt-evidencia { background: #fed7aa; }
        button.pt-nota:hover { transform: rotate(0deg) translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,.12); }
        button.pt-nota:focus-visible { outline: 3px solid var(--c, #b4460c); outline-offset: 3px; }
        .pt-sacude { animation: pt-sacude 420ms ease; }
        @keyframes pt-sacude { 25% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } 75% { transform: rotate(-2deg); } }
        .pt-grupos { margin-top: 22px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 16px; }
        .pt-grupo { padding: 14px; border-radius: 12px; border: 1.5px dashed #c9bfa9; animation: pt-entra 380ms ease both; }
        .pt-grupo-t { font-size: 13px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--c-oscuro, #9a3a08); }
        .pt-grupo ul { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .pt-fija { min-height: 0; cursor: default; transform: none; }
        .pt-insight { grid-column: 1 / -1; padding: 20px 22px; border-radius: 14px; background: var(--c, #b4460c); color: #fff; animation: pt-entra 380ms 120ms ease both; }
        .pt-insight-t { font-family: var(--serif); font-size: clamp(22px, 2.4vw, 28px); line-height: 1.2; }
        .pt-insight-p { margin-top: 6px; font-size: 15px; line-height: 1.55; opacity: .92; }
        @keyframes pt-entra { from { opacity: 0; transform: translateY(10px); } }
        .pt-barra { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
        .pt-cuenta { font-size: 14px; font-weight: 600; color: var(--dimmer); }
        .pt-boton { min-height: 44px; padding: 0 18px; border-radius: var(--r-pill, 999px); border: 1.5px solid var(--c, #b4460c); background: var(--c, #b4460c); color: #fff; font-weight: 600; font-size: 14.5px; cursor: pointer; }
        .pt-boton--borde { background: transparent; color: var(--c-oscuro, #9a3a08); }
        .pt-vivo { min-height: 1.4em; margin-top: 8px; font-size: 14px; color: var(--c-oscuro, #9a3a08); }
        .pt-aviso { margin-top: 4px; font-size: 12.5px; color: var(--dimmer); }
        @media (prefers-reduced-motion: reduce) { .pt-nota, .pt-grupo, .pt-insight, .pt-sacude { animation: none; transition: none; } }
      `}</style>
    </div>
  );
}
