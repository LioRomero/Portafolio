import { useRef, useState } from 'preact/hooks';
import type { Lang } from '../content/ui';

/**
 * Caso QStrauss · "Una implementación, etapa por etapa". Un recorrido por las
 * seis etapas de mi trabajo en una implementación enterprise; en la última,
 * un selector muestra qué necesita cada rol y cuándo (la estrategia de
 * adopción). Sin datos de clientes: es el método, no un proyecto.
 *
 * Etapas = las fases estándar de una implementación (nombres genéricos de la
 * industria, sin datos del programa ni del cliente). Cada etapa dice si la
 * lidero o participo: las primeras las lidera el business analyst. Los roles son genéricos y lo dice.
 * Pestañas ARIA: flechas, Inicio y Fin. Clases con prefijo `rq-`.
 */

const T = {
  es: {
    skill: 'Habilidad · Procesos, QA y adopción',
    titulo: 'Una implementación, etapa por etapa',
    instr: 'Recorre las etapas con las flechas o tocándolas. En la última, elige un rol.',
    etapasLabel: 'Etapas de una implementación',
    hago: 'Cómo lo trabajo',
    entrego: 'Lo que sale de la etapa',
    papel: 'Mi papel',
    anterior: '← Anterior',
    siguiente: 'Siguiente →',
    de: 'de',
    rolesLabel: 'Roles',
    necesita: 'Qué necesita',
    cuando: 'Cuándo',
    generico: 'Esquema genérico, sin datos de clientes.',
    etapas: [
      { t: "Pre-discovery", papel: "Participo · lo lidera el business analyst", hago: "El business analyst envía el plan de pre-discovery: un cuestionario y la lista de lo que el cliente debe entregar y cuándo. Yo estoy desde esas primeras sesiones, para llegar al discovery con el contexto levantado.", entrego: "Cuestionario respondido, cronograma y entregables acordados desde el inicio." },
      { t: "Discovery", papel: "Participo · lo lidera el business analyst", hago: "En las sesiones con los stakeholders se mapea cómo trabajan de verdad. Mi parte es la mirada de configuración: separar lo estándar de la plataforma de lo propio de ese cliente. La etapa cierra con un readback de los requerimientos y una demo funcional.", entrego: "Requerimientos de negocio y funcionales validados por el cliente." },
      { t: "Diseño", papel: "Participo", hago: "Los requerimientos se traducen al diseño de la solución: flujos, configuración e integraciones. Participo en esa definición, pasa por revisión interna y el cliente lo aprueba antes de construir, lo que frena las personalizaciones que se salen del alcance.", entrego: "Documento de diseño de la solución, aprobado." },
      { t: "Build", papel: "Lidero", hago: "Configuro Adobe Workfront sobre el diseño aprobado, con las automatizaciones de Workfront Fusion, y muestro avances en demos para ajustar con el cliente antes de llegar a pruebas.", entrego: "La solución configurada y documentada." },
      { t: "Pruebas", papel: "Comparto · el business analyst guía al cliente, yo hago el QA técnico", hago: "El cliente valida con escenarios reales y guiones de prueba, guiado por el business analyst. Yo reviso cada flujo de punta a punta, incluidas las integraciones, y resuelvo los bugs con desarrollo antes de la aprobación formal.", entrego: "Bugs resueltos y aprobación del cliente antes de salir a producción." },
      { t: "Lanzamiento", papel: "Comparto · el business analyst capacita, yo diseño la adopción por rol", hago: "Salida a producción, capacitación y un periodo de acompañamiento cercano. Mi aporte es la documentación por rol, en bloques reutilizables, para que cada equipo resuelva sus dudas sin pedir otra sesión.", entrego: "Una estrategia de adopción por rol, que se adoptó con un cliente." },
    ],
    roles: [
      { t: 'Quien solicita', necesita: 'Saber cómo pedir trabajo y seguir su estado sin preguntarle a nadie.', cuando: 'Desde el primer día.' },
      { t: 'Quien aprueba', necesita: 'Saber qué revisar y cómo aprobar sin frenar el flujo.', cuando: 'Cuando le llega la primera aprobación.' },
      { t: 'Quien administra', necesita: 'Entender cómo quedó configurada la plataforma y qué hacer cuando algo cambia.', cuando: 'Antes de que el consultor se vaya.' },
    ],
  },
  en: {
    skill: 'Skill · Process, QA and adoption',
    titulo: 'One implementation, stage by stage',
    instr: 'Walk through the stages with the arrows or by tapping them. At the last one, pick a role.',
    etapasLabel: 'Stages of an implementation',
    hago: 'How I work it',
    entrego: 'What comes out of it',
    papel: 'My role',
    anterior: '← Previous',
    siguiente: 'Next →',
    de: 'of',
    rolesLabel: 'Roles',
    necesita: 'What they need',
    cuando: 'When',
    generico: 'Generic outline, no client data.',
    etapas: [
      { t: "Pre-discovery", papel: "I take part · led by the business analyst", hago: "The business analyst sends the pre-discovery plan: a questionnaire and a list of what the client needs to deliver and when. I join from those first sessions, so I reach discovery with the context already gathered.", entrego: "A completed questionnaire, plus a timeline and deliverables agreed from the start." },
      { t: "Discovery", papel: "I take part · led by the business analyst", hago: "Stakeholder sessions map how the client really works. My part is the configuration lens: separating what is standard on the platform from what is specific to that client. The stage closes with a requirements readback and a functional demo.", entrego: "Business and functional requirements validated by the client." },
      { t: "Design", papel: "I take part", hago: "The requirements are translated into the solution design: workflows, configuration and integrations. I take part in that definition; it goes through internal review and the client signs it off before the build, which curbs customisations that fall outside the scope.", entrego: "A signed-off solution design document." },
      { t: "Build", papel: "I lead", hago: "I configure Adobe Workfront on the approved design, including Workfront Fusion automations, and show progress in demos to adjust with the client before testing.", entrego: "The solution, configured and documented." },
      { t: "Testing", papel: "Shared · the business analyst guides the client, I do the technical QA", hago: "The client validates with real scenarios and test scripts, guided by the business analyst. I check every flow end to end, integrations included, and fix bugs with development before formal sign-off.", entrego: "Bugs fixed and client sign-off before going to production." },
      { t: "Launch", papel: "Shared · the business analyst trains, I design role-based adoption", hago: "Go-live, training and a period of close support. My contribution is the role-based documentation, in reusable blocks, so each team can answer its own questions without asking for another session.", entrego: "A role-based adoption strategy, adopted by one client." },
    ],
    roles: [
      { t: 'Requesters', necesita: 'Knowing how to request work and follow its status without asking anyone.', cuando: 'From day one.' },
      { t: 'Approvers', necesita: 'Knowing what to review and how to approve without stalling the flow.', cuando: 'When their first approval arrives.' },
      { t: 'Administrators', necesita: 'Understanding how the platform was configured and what to do when something changes.', cuando: 'Before the consultant leaves.' },
    ],
  },
};

export default function RecorridoQs({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [sel, setSel] = useState(0);
  const [rol, setRol] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = t.etapas.length;
  const e = t.etapas[sel]!;
  const r = t.roles[rol]!;

  const ir = (i: number, foco = false) => {
    const n = (i + total) % total;
    setSel(n);
    if (foco) tabs.current[n]?.focus();
  };

  const tecla = (ev: KeyboardEvent, i: number) => {
    const mapa: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: total - 1 };
    const n = mapa[ev.key];
    if (n === undefined) return;
    ev.preventDefault();
    ir(n, true);
  };

  return (
    <div class="rq">
      <p class="rq-skill">{t.skill}</p>
      <h3 class="rq-titulo">{t.titulo}</h3>
      <p class="rq-instr">{t.instr}</p>

      <div class="rq-riel" role="tablist" aria-label={t.etapasLabel}>
        {t.etapas.map((et, i) => (
          <button
            key={et.t}
            type="button"
            role="tab"
            id={`rq-tab-${i}`}
            aria-selected={i === sel}
            aria-controls="rq-panel"
            tabIndex={i === sel ? 0 : -1}
            class={`rq-paso${i < sel ? ' rq-hecho' : ''}`}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            onClick={() => ir(i)}
            onKeyDown={(ev) => tecla(ev as KeyboardEvent, i)}
          >
            <span class="rq-num">{i + 1}</span>
            <span class="rq-nombre">{et.t}</span>
          </button>
        ))}
      </div>
      <div class="rq-barra" aria-hidden="true">
        <span style={{ width: `${((sel + 1) / total) * 100}%` }} />
      </div>

      <div id="rq-panel" role="tabpanel" aria-labelledby={`rq-tab-${sel}`} class="rq-panel" key={sel}>
        <p class="rq-contador">
          {sel + 1} {t.de} {total} · {e.t}
        </p>
        <p class="rq-papel">
          <span class="rq-papel-l">{t.papel}:</span> {e.papel}
        </p>
        <div class="rq-cols">
          <div>
            <p class="rq-label">{t.hago}</p>
            <p class="rq-texto">{e.hago}</p>
          </div>
          <div>
            <p class="rq-label">{t.entrego}</p>
            <p class="rq-texto rq-entrega">{e.entrego}</p>
          </div>
        </div>

        {sel === total - 1 && (
          <div class="rq-roles">
            <div class="rq-chips" role="group" aria-label={t.rolesLabel}>
              {t.roles.map((ro, i) => (
                <button
                  key={ro.t}
                  type="button"
                  class="rq-chip"
                  aria-pressed={i === rol}
                  onClick={() => setRol(i)}
                >
                  {ro.t}
                </button>
              ))}
            </div>
            <div class="rq-rol" aria-live="polite">
              <p>
                <b>{t.necesita}:</b> {r.necesita}
              </p>
              <p>
                <b>{t.cuando}:</b> {r.cuando}
              </p>
            </div>
            <p class="rq-generico">{t.generico}</p>
          </div>
        )}
      </div>

      <div class="rq-nav">
        <button type="button" class="rq-boton" onClick={() => ir(sel - 1)} disabled={sel === 0}>
          {t.anterior}
        </button>
        <button type="button" class="rq-boton rq-boton--lleno" onClick={() => ir(sel + 1)} disabled={sel === total - 1}>
          {t.siguiente}
        </button>
      </div>

      <style>{`
        .rq { margin-top: 28px; padding: clamp(20px, 3vw, 32px); border-radius: 18px; background: #eef1fb; border: 1px solid var(--line); }
        .rq-skill { font-size: 12.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--c-oscuro, #183a9e); }
        .rq-titulo { margin-top: 6px; font-family: var(--serif); font-weight: 400; font-size: clamp(24px, 2.6vw, 30px); line-height: 1.15; }
        .rq-instr { margin-top: 8px; font-size: 15.5px; line-height: 1.55; color: var(--dimmer); max-width: 60ch; }
        .rq-riel { margin-top: 22px; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; }
        .rq-paso { min-height: 64px; padding: 10px 8px; border-radius: 12px; border: 1.5px solid #c6cfee; background: #fff; color: #2b2f3a; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; cursor: pointer; text-align: left; font-family: inherit; transition: background-color 200ms ease, border-color 200ms ease; }
        .rq-paso:hover { border-color: var(--c, #2449c8); }
        .rq-paso:focus-visible { outline: 3px solid var(--c, #2449c8); outline-offset: 2px; }
        .rq-paso[aria-selected='true'] { background: var(--c, #2449c8); border-color: var(--c, #2449c8); color: #fff; }
        .rq-hecho { border-color: var(--c, #2449c8); }
        .rq-num { font-family: var(--serif); font-size: 20px; line-height: 1; }
        .rq-nombre { font-size: 13.5px; font-weight: 600; line-height: 1.2; }
        .rq-barra { margin-top: 10px; height: 4px; border-radius: 4px; background: #d7ddf3; overflow: hidden; }
        .rq-barra span { display: block; height: 100%; background: var(--c, #2449c8); transition: width 300ms ease; }
        .rq-panel { margin-top: 18px; padding: 20px 22px; border-radius: 14px; background: #fff; animation: rq-entra 300ms ease both; }
        @keyframes rq-entra { from { opacity: 0; transform: translateX(8px); } }
        .rq-contador { font-size: 12.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--c-oscuro, #183a9e); }
        .rq-papel { margin-top: 10px; display: inline-block; padding: 6px 12px; border-radius: 999px; background: #eef1fb; color: var(--c-oscuro, #183a9e); font-size: 14px; font-weight: 600; line-height: 1.4; }
        .rq-papel-l { font-weight: 700; }
        .rq-cols { margin-top: 12px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 18px 28px; }
        .rq-label { font-size: 12.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--dimmer); }
        .rq-texto { margin-top: 6px; font-size: 16px; line-height: 1.6; }
        .rq-entrega { font-weight: 600; }
        .rq-roles { margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--line); }
        .rq-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .rq-chip { min-height: 42px; padding: 0 16px; border-radius: 999px; border: 1.5px solid var(--c, #2449c8); background: transparent; color: var(--c-oscuro, #183a9e); font-weight: 600; font-size: 14px; cursor: pointer; font-family: inherit; }
        .rq-chip[aria-pressed='true'] { background: var(--c, #2449c8); color: #fff; }
        .rq-chip:focus-visible { outline: 3px solid var(--c, #2449c8); outline-offset: 2px; }
        .rq-rol { margin-top: 12px; display: flex; flex-direction: column; gap: 6px; font-size: 15.5px; line-height: 1.55; }
        .rq-generico { margin-top: 8px; font-size: 12.5px; color: var(--dimmer); }
        .rq-nav { margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap; }
        .rq-boton { min-height: 44px; padding: 0 18px; border-radius: 999px; border: 1.5px solid var(--c, #2449c8); background: transparent; color: var(--c-oscuro, #183a9e); font-weight: 600; font-size: 14.5px; cursor: pointer; font-family: inherit; }
        .rq-boton--lleno { background: var(--c, #2449c8); color: #fff; }
        .rq-boton:disabled { opacity: .4; cursor: not-allowed; }
        /* En móvil los nombres no caben: quedan los números (el panel ya nombra la etapa) y el nombre sigue disponible para lectores de pantalla. */
        @media (max-width: 640px) { .rq-paso { position: relative; min-height: 48px; align-items: center; justify-content: center; } .rq-nombre { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; } }
        @media (prefers-reduced-motion: reduce) { .rq-panel { animation: none; } .rq-barra span { transition: none; } }
      `}</style>
    </div>
  );
}
