/** Los tres casos en detalle. Copiado de `Casos Emilio.dc.html`. */

export const CASE_ORDER = ['ropofy', 'qstrauss', 'bid'] as const;
export type CaseKey = (typeof CASE_ORDER)[number];

export const CASES_UI = {
  es: {
    back: '← Todos los casos',
    researchMode: 'Modo investigador',
    onThisPage: 'En esta página',
    designNote: 'Nota de diseño',
    theBrief: 'El encargo',
    realProblem: 'El problema real',
    questionsAsked: 'Las preguntas que hice',
    nextCase: 'Siguiente caso',
    backHome: 'Volver al inicio',
    prev: 'Imagen anterior',
    next: 'Imagen siguiente',
    slide: 'Imagen',
    shortcutsHint: 'El modo Al grano deja la decisión y el resultado. Explorar abre la evidencia.',
    ctaTitle: '¿Te suena el problema? Hablemos del tuyo.',
    ctaSub: 'Si estás en el punto en que nadie sabe todavía cómo enunciarlo, es justo donde me gusta empezar.',
    kickers: ['01 · El encargo', '02 · Investigación', '03 · Hallazgos', '04 · Decisiones', '05 · La solución', '06 · Resultado', '07 · Qué me dejó'],
    rail: ['El encargo', 'Investigación', 'Hallazgos', 'Decisiones', 'La solución', 'Resultado', 'Qué me dejó'],
  },
  en: {
    back: '← All case studies',
    researchMode: 'Researcher mode',
    onThisPage: 'On this page',
    designNote: 'Design note',
    theBrief: 'The brief',
    realProblem: 'The real problem',
    questionsAsked: 'The questions I asked',
    nextCase: 'Next case',
    backHome: 'Back to home',
    prev: 'Previous image',
    next: 'Next image',
    slide: 'Image',
    shortcutsHint: 'Quick read keeps the decision and the outcome. Explore opens the evidence.',
    ctaTitle: "Does the problem sound familiar? Let's talk about yours.",
    ctaSub: "If you're at the point where nobody can quite name it yet, that's exactly where I like to start.",
    kickers: ['01 · The brief', '02 · Research', '03 · Findings', '04 · Decisions', '05 · The solution', '06 · Outcome', '07 · What it taught me'],
    rail: ['The brief', 'Research', 'Findings', 'Decisions', 'The solution', 'Outcome', 'What it taught me'],
  },
} as const;

export const CASES = {
  ropofy: {
    tab: 'Ropofy',
    accent: '#22D3EE',
    es: {
      chips: [['SaaS · CRM', 'clarity'], ['Diseño + Consultoría estratégica', 'line'], ['Jun 2025 – Abr 2026', 'line']],
      title: 'Me contrataron para rediseñar una web. El problema estaba en el silencio.',
      sub: 'Ropofy vendía bien y perdía clientes sin saber dónde. El sitio no era el cuello de botella: lo era el tiempo que tardaban en responder.',
      cols: [
        ['Mi rol', 'Investigación, rediseño y, después, acompañamiento estratégico del proceso comercial.'],
        ['La decisión', 'Diseñar el sitio alrededor del contacto —no del catálogo— y ordenar los canales de entrada.'],
        ['El resultado', '+15% en ventas y permanencia de clientes. La empresa alcanzó su curva de estabilización.', true],
      ],
      note: 'El caso abre con el resultado, no con el proceso. Quien decide contratarme casi nunca llega al final de la página — pero si el resultado lo engancha, sí lee el método.',
      brief: {
        h2: 'Lo que me pidieron y lo que realmente necesitaban',
        p1: 'Ropofy es una empresa pequeña que vende por varios canales a la vez. El encargo llegó formulado como un problema de imagen: la web se veía vieja y no reflejaba lo que la empresa era. Rediseñarla, entonces.',
        p2: 'Antes de abrir Figma pregunté algo distinto: ¿de dónde vienen las ventas que sí se cierran, y dónde se caen las que no? Nadie tenía la respuesta completa. Ese vacío fue el verdadero punto de partida.',
        asked: '“Necesitamos una web nueva, más moderna.”',
        real: '“Nos escriben por tres canales y no sabemos a quién dejamos esperando.”',
      },
      research: {
        h2: 'Poco presupuesto, así que fui a lo que ya existía',
        p: 'No había plata para un estudio grande ni tiempo para esperarlo. Usé dos fuentes que la empresa ya tenía y que nadie había mirado como datos: las conversaciones entrantes y la memoria de los clientes recientes.',
        stats: [['6', 'entrevistas a clientes que compraron en los últimos tres meses'], ['3 meses', 'de conversaciones entrantes revisadas canal por canal'], ['3', 'canales de entrada sin dueño: WhatsApp, web e Instagram']],
        questions: ['¿Cómo nos encontraste y por dónde escribiste primero?', '¿Cuánto esperaste y qué pensaste mientras esperabas?', '¿Miraste otras opciones en ese rato? ¿Qué te hizo volver o no volver?'],
        note: 'Ninguna pregunta sobre el diseño de la web. Si el problema hubiera estado ahí, habría salido solo.',
      },
      findings: {
        h2: 'El abandono no pasaba en el checkout. Pasaba en la espera.',
        items: [
          { tag: 'Hallazgo 1 · Espera', color: 'feel', h3: 'El silencio se lee como desinterés', p: 'La decisión de compra no se rompía por precio ni por producto: se rompía en las horas que pasaban sin respuesta. Para el cliente, no contestar significa “no me quieren vender”.', quote: '“Escribí el viernes y me contestaron el martes. Ya había comprado en otro lado.”', caveat: 'Cita representativa — pendiente de reemplazar por el verbatim exacto de la entrevista.' },
          { tag: 'Hallazgo 2 · Dispersión', color: 'mind', h3: 'Tres canales, ningún dueño', p: 'La misma consulta podía entrar por WhatsApp, por el formulario de la web y por Instagram. Nadie sabía cuál era la fuente de verdad, así que algunas se respondían dos veces y otras ninguna.', quote: 'Al cruzar los tres canales aparecieron consultas duplicadas y consultas sin ninguna respuesta. El equipo no era negligente: no tenía forma de ver el total.', plain: true, caveat: 'Volumen exacto de duplicados y de no respondidas — por confirmar con los datos del proyecto.' },
          { tag: 'Hallazgo 3 · Catálogo', color: 'clarity', h3: 'La web tenía que abrir conversaciones, no cerrar ventas', p: 'Casi nadie compraba sin hablar antes con alguien. Un sitio pensado como vitrina de catálogo estaba resolviendo un paso que en este negocio no existía.' },
        ],
      },
      decisions: {
        h2: 'Tres decisiones y una que descarté',
        items: [
          ['La web se organiza alrededor del contacto', 'Contacto visible en cada pantalla, con el canal que el cliente ya prefiere y una expectativa clara de cuándo le responden.'],
          ['Un solo lugar donde caen todas las consultas', 'Los tres canales confluyen en una bandeja con dueño y con estado. Deja de importar por dónde entró: importa si ya se respondió.'],
          ['El tiempo de respuesta se vuelve la métrica del equipo', 'Lo que no se mide no se defiende. Acordamos medirlo antes de tocar nada, para poder comparar después.'],
          ['Lo que descarté: un chatbot', 'Era la solución que todos esperaban. La descarté: la empresa no tenía el volumen para justificarlo y habría añadido una espera más, con una respuesta menos útil. El problema era organizativo, no tecnológico.', true],
        ],
      },
      hero: { src: '/assets/diag/ropofy-espera.svg', ph: 'El hallazgo: la espera, día por día' },
      pairs: [
        { src: '/assets/diag/ropofy-antes.svg', ph: 'ANTES — arquitectura original', cap: 'Antes: el catálogo al frente, el contacto al final.' },
        { src: '/assets/diag/ropofy-despues.svg', ph: 'DESPUÉS — arquitectura rediseñada', cap: 'Después: el contacto es parte del recorrido, no un pie de página.' },
      ],
      flow: { src: '/assets/diag/ropofy-flujo.svg', ph: 'Diagrama del flujo de consultas: WhatsApp / web / Instagram → bandeja única → respuesta', cap: 'El flujo que ordenó los tres canales de entrada.' },
      result: {
        big: '+15%',
        tone: 'clarity',
        p: 'en ventas y en permanencia de clientes. Con eso la empresa alcanzó su curva de estabilización — el punto en que deja de depender de cada venta suelta.',
        secondary: 'La consecuencia que no estaba en el encargo: el rediseño terminó siendo la parte pequeña. Lo que movió el número fue dejar de perder conversaciones.',
      },
      takeaways: [
        ['Lo que aprendí', 'Que un encargo mal formulado no es un obstáculo: es el primer hallazgo. Y que negociar el alcance a mitad del proyecto es parte del trabajo, no un fracaso de la propuesta.', 'clarity'],
        ['Qué haría distinto', 'Medir el tiempo de respuesta desde la primera semana, no desde que tuve la sospecha. Habría podido mostrar el costo del silencio con números propios en vez de con citas.', 'feel'],
      ],
    },
    en: {
      chips: [['SaaS · CRM', 'clarity'], ['Design + Strategy consulting', 'line'], ['Jun 2025 – Apr 2026', 'line']],
      title: 'They hired me to redesign a website. The problem was the silence.',
      sub: "Ropofy was selling well and losing customers without knowing where. The site wasn't the bottleneck — how long they took to reply was.",
      cols: [
        ['My role', 'Research, redesign, and afterwards strategic support of the sales process.'],
        ['The decision', 'Build the site around getting in touch — not around the catalogue — and put the inbound channels in order.'],
        ['The outcome', '+15% in sales and customer retention. The company reached its stabilisation curve.', true],
      ],
      note: 'The case opens with the outcome, not the process. Whoever decides to hire me rarely reaches the bottom of the page — but if the outcome hooks them, they do read the method.',
      brief: {
        h2: 'What they asked for, and what they actually needed',
        p1: 'Ropofy is a small company selling across several channels at once. The brief arrived framed as an image problem: the site looked dated and didn’t reflect what the company had become. So, redesign it.',
        p2: 'Before opening Figma I asked something else: where do the sales that close actually come from, and where do the others fall apart? Nobody had the full answer. That gap was the real starting point.',
        asked: '“We need a new site, something more modern.”',
        real: "“People write to us on three channels and we don't know who we've left waiting.”",
      },
      research: {
        h2: 'Little budget, so I went to what already existed',
        p: 'There was no money for a large study and no time to wait for one. I used two sources the company already had and nobody had treated as data: the inbound conversations and the memory of recent customers.',
        stats: [['6', 'interviews with customers who bought in the last three months'], ['3 months', 'of inbound conversations reviewed channel by channel'], ['3', 'inbound channels with no owner: WhatsApp, web and Instagram']],
        questions: ['How did you find us, and where did you write first?', 'How long did you wait, and what went through your head while waiting?', 'Did you look at other options in that time? What made you come back — or not?'],
        note: "Not a single question about the website's design. If the problem had been there, it would have surfaced on its own.",
      },
      findings: {
        h2: "Drop-off wasn't happening at checkout. It happened in the wait.",
        items: [
          { tag: 'Finding 1 · Waiting', color: 'feel', h3: 'Silence reads as indifference', p: "The purchase decision didn't break on price or product: it broke in the hours that passed without a reply. To the customer, no answer means “they don't want to sell to me”.", quote: "“I wrote on Friday and they replied on Tuesday. I'd already bought elsewhere.”", caveat: 'Representative quote — to be replaced with the exact interview verbatim.' },
          { tag: 'Finding 2 · Scatter', color: 'mind', h3: 'Three channels, no owner', p: 'The same enquiry could arrive via WhatsApp, the web form or Instagram. Nobody knew which was the source of truth, so some were answered twice and others not at all.', quote: "Cross-referencing the three channels surfaced duplicate enquiries and enquiries with no reply at all. The team wasn't negligent — it had no way of seeing the whole.", plain: true, caveat: 'Exact volume of duplicates and unanswered enquiries — to be confirmed against project data.' },
          { tag: 'Finding 3 · Catalogue', color: 'clarity', h3: 'The site had to open conversations, not close sales', p: "Almost nobody bought without talking to someone first. A site built as a catalogue window was solving a step that doesn't exist in this business." },
        ],
      },
      decisions: {
        h2: 'Three decisions, and one I ruled out',
        items: [
          ['The site is organised around getting in touch', "Contact visible on every screen, through the channel the customer already prefers, with a clear expectation of when they'll hear back."],
          ['One place where every enquiry lands', "All three channels converge in a single inbox with an owner and a status. Where it came from stops mattering: whether it's been answered starts to."],
          ["Response time becomes the team's metric", "What isn't measured can't be defended. We agreed to measure it before touching anything, so we could compare afterwards."],
          ['What I ruled out: a chatbot', "It was the solution everyone expected. I ruled it out: the company didn't have the volume to justify it and it would have added one more wait, with a less useful answer. The problem was organisational, not technological.", true],
        ],
      },
      hero: { src: '/assets/diag/ropofy-espera.svg', ph: 'The finding: the wait, day by day' },
      pairs: [
        { src: '/assets/diag/ropofy-antes.svg', ph: 'BEFORE — original architecture', cap: 'Before: catalogue up front, contact at the very end.' },
        { src: '/assets/diag/ropofy-despues.svg', ph: 'AFTER — redesigned architecture', cap: 'After: contact is part of the journey, not a footer.' },
      ],
      flow: { src: '/assets/diag/ropofy-flujo.svg', ph: 'Enquiry flow diagram: WhatsApp / web / Instagram → single inbox → reply', cap: 'The flow that put the three inbound channels in order.' },
      result: {
        big: '+15%',
        tone: 'clarity',
        p: 'in sales and in customer retention. With that the company reached its stabilisation curve — the point where it stops depending on each individual sale.',
        secondary: "The consequence that wasn't in the brief: the redesign turned out to be the small part. What moved the number was stopping the loss of conversations.",
      },
      takeaways: [
        ['What I learned', "That a badly framed brief isn't an obstacle: it's the first finding. And that renegotiating scope mid-project is part of the job, not a failure of the proposal.", 'clarity'],
        ["What I'd do differently", 'Measure response time from week one, not from the moment I had a suspicion. I could have shown the cost of silence with my own numbers instead of with quotes.', 'feel'],
      ],
    },
  },

  qstrauss: {
    tab: 'QStrauss',
    accent: '#8B7BF0',
    es: {
      chips: [['Consultoría · Enterprise', 'mind'], ['Diseño de servicios + Documentación', 'line'], ['2026 – Actualidad', 'line']],
      title: 'Entregábamos la plataforma configurada. El conocimiento se quedaba con nosotros.',
      sub: 'Las implementaciones salían bien. Meses después, el cliente seguía llamando para preguntar cómo funcionaba lo que ya tenía.',
      cols: [
        ['Mi rol', 'Consultoría de implementación, diagnóstico de configuración y diseño de la documentación como producto.'],
        ['La decisión', 'Tratar la documentación como un sistema reutilizable, no como un anexo que se escribe al final de cada proyecto.'],
        ['El resultado', 'Menos tiempo en capacitaciones, reuniones y aclaraciones dentro de implementaciones que corren de 3 a más de 6 meses.', true],
      ],
      note: 'Es el caso más reciente y el que menos puedo mostrar: hay NDA. Lo resuelvo con un diagrama abstracto en vez de capturas — un caso honesto sin imágenes convence más que uno ilustrado con material que no debería estar ahí.',
      brief: {
        h2: 'Lo que me pidieron y lo que realmente necesitaban',
        p1: 'Trabajo en consultoría de implementación de Adobe Workfront para clientes enterprise. El encargo, proyecto tras proyecto, llegaba formulado igual: resolver dudas puntuales de configuración y ajustar lo que no estaba quedando.',
        p2: 'Pero las dudas se repetían. No entre clientes distintos: dentro del mismo cliente, con los mismos equipos, meses después de la entrega. Eso no es un problema de configuración. Es un problema de transferencia de conocimiento.',
        asked: '“Necesitamos ajustar unos flujos que no están funcionando.”',
        real: '“No sabemos cómo quedó configurado lo nuestro ni a quién preguntarle.”',
      },
      research: {
        h2: 'No hice un estudio: revisé lo que ya estaba pasando',
        p: 'No había presupuesto ni margen para una investigación formal. Usé lo que la operación ya generaba y que nadie estaba mirando como dato: las sesiones de capacitación que se repetían, las preguntas que volvían por correo, y la propia herramienta de documentación que estábamos usando por dentro.',
        stats: [['3 a 6+', 'meses que dura una implementación típica, con ajustes y diálogos de por medio'], ['3', 'capas de navegación compitiendo entre sí dentro de nuestra propia herramienta de documentación'], ['4', 'niveles distintos de peso visual usados sin jerarquía definida en la interfaz']],
        questions: ['¿Qué pregunta el cliente después de la entrega, y cuántas veces?', '¿Dónde vive hoy la respuesta: en un documento, o en la cabeza de alguien?', '¿Cuánto de cada capacitación es contenido nuevo y cuánto es lo mismo de la vez pasada?'],
        note: 'Ninguna pregunta sobre la configuración de Workfront. Si el problema hubiera estado ahí, habría salido en los tickets.',
      },
      findings: {
        h2: 'El cuello de botella no era la implementación. Era lo que pasaba después.',
        items: [
          { tag: 'Hallazgo 1 · Dependencia', color: 'feel', h3: 'El conocimiento nunca salía de la reunión', p: 'Todo lo que el cliente necesitaba saber se explicaba en sesiones en vivo. Cuando la persona capacitada rotaba de rol o salía de la empresa, ese conocimiento se iba con ella y el ciclo empezaba otra vez.' },
          { tag: 'Hallazgo 2 · Reproceso', color: 'mind', h3: 'Cada entregable se armaba desde cero', p: 'Los materiales de entrenamiento no se reutilizaban entre proyectos, aunque una parte importante del contenido fuera equivalente. El costo no era el diseño: era volver a tomar las decisiones ya tomadas.' },
          { tag: 'Hallazgo 3 · La herramienta', color: 'clarity', h3: 'La herramienta para documentar necesitaba documentación', p: 'Al auditar el Custom Canvas encontré tres capas de navegación compitiendo, cuatro pesos visuales sin jerarquía y estados de componente inconsistentes. La herramienta que debía ordenar el conocimiento tenía el mismo desorden que quería resolver.' },
        ],
      },
      decisions: {
        h2: 'Tres decisiones y una que descarté',
        items: [
          ['La documentación se trata como producto, no como anexo', 'Deja de ser lo último que se escribe cuando el proyecto ya se entregó, y pasa a diseñarse con criterio de usuario: quién la va a leer, en qué momento y con qué pregunta en la cabeza.'],
          ['El contenido se organiza en dominios y slots reutilizables', 'En vez de un deck por cliente, un sistema de bloques que se producen una vez y se adaptan. Lo que cambia entre clientes es la configuración específica, no la estructura del material.'],
          ['La refactorización va del sistema hacia los componentes', 'Primero la base visual (espaciado y color), después la estructura (navegación y sidebar), y solo al final los componentes individuales. Es lo contrario de lo intuitivo, y es lo que evita retocar cada pieza dos veces.'],
          ['Lo que descarté: empezar por rediseñar los componentes', 'Era lo obvio y lo más visible: los slots y los botones eran lo que peor se veía. Lo descarté porque construir componentes sobre un sistema de espaciado y color que todavía no existía obligaba a rehacerlos después. El desorden se veía en los componentes, pero vivía en el sistema.', true],
        ],
      },
      hero: { src: '/assets/diag/qs-dominios.svg', ph: 'Esquema del sistema de dominios y slots' },
      pairs: [
        { src: '/assets/diag/qs-nav-antes.svg', ph: 'ANTES — las tres capas de navegación compitiendo', cap: 'Tres formas de llegar al mismo sitio, ninguna clara.' },
        { src: '/assets/diag/qs-nav-despues.svg', ph: 'DESPUÉS — navegación consolidada en dos niveles', cap: 'Dos niveles, una acción primaria por pantalla.' },
      ],
      flow: { src: '/assets/qstrauss-flujo.png', ph: 'Diagrama del ciclo de documentación', cap: 'El ciclo que se rompió: de la sesión repetida al material que se produce una vez.' },
      result: {
        big: 'De 3 a 6+ meses',
        tone: 'mind',
        small: true,
        p: 'es lo que dura una implementación enterprise, con sus ajustes y diálogos de por medio. Los entregables de documentación redujeron el tiempo dedicado a capacitaciones, reuniones y aclaraciones dentro de ese ciclo.',
        secondary: 'La consecuencia que no estaba en el encargo: el trabajo dejó de medirse en sesiones dictadas y pasó a medirse en cuánto podía avanzar el cliente sin nosotros.',
      },
      takeaways: [
        ['Lo que aprendí', 'Que la parte más frágil de una implementación no es la configuración: es lo que el cliente entiende de ella. Y que en consultoría, la documentación no es el cierre del proyecto — es parte del producto.', 'clarity'],
        ['Qué haría distinto', 'Medir desde el primer día cuántas horas se van en capacitaciones y aclaraciones por implementación. Tenía el problema clarísimo y no tenía con qué demostrarlo.', 'feel'],
      ],
    },
    en: {
      chips: [['Consulting · Enterprise', 'mind'], ['Service design + Documentation', 'line'], ['2026 – Present', 'line']],
      title: 'We delivered the platform configured. The knowledge stayed with us.',
      sub: 'The implementations went well. Months later the client was still calling to ask how the thing they already owned worked.',
      cols: [
        ['My role', 'Implementation consulting, configuration diagnosis, and designing documentation as a product.'],
        ['The decision', 'Treat documentation as a reusable system, not as an appendix written at the end of each project.'],
        ['The outcome', 'Less time spent on training, meetings and clarifications inside implementations that run from 3 to 6+ months.', true],
      ],
      note: "It's the most recent case and the one I can show least of: there's an NDA. I solve it with an abstract diagram instead of screenshots — an honest case with no images is more convincing than one illustrated with material that shouldn't be there.",
      brief: {
        h2: 'What they asked for, and what they actually needed',
        p1: 'I work in Adobe Workfront implementation consulting for enterprise clients. Project after project, the brief arrived framed the same way: resolve specific configuration questions and fix what wasn’t landing.',
        p2: "But the questions repeated. Not across different clients: within the same client, with the same teams, months after delivery. That isn't a configuration problem. It's a knowledge-transfer problem.",
        asked: "“We need to adjust some workflows that aren't working.”",
        real: "“We don't know how ours ended up configured, or who to ask.”",
      },
      research: {
        h2: "I didn't run a study: I looked at what was already happening",
        p: 'There was no budget and no room for formal research. I used what the operation already produced and nobody was reading as data: the training sessions that kept repeating, the questions coming back over email, and the documentation tool we were using internally.',
        stats: [['3 to 6+', 'months a typical implementation runs, with adjustments and reviews along the way'], ['3', 'navigation layers competing with each other inside our own documentation tool'], ['4', 'different levels of visual weight used with no defined hierarchy in the interface']],
        questions: ['What does the client ask after delivery, and how many times?', "Where does the answer live today: in a document, or in someone's head?", "How much of each training session is new content, and how much is last time's?"],
        note: 'Not a single question about Workfront configuration. If the problem had been there, it would have shown up in the tickets.',
      },
      findings: {
        h2: "The bottleneck wasn't the implementation. It was what happened afterwards.",
        items: [
          { tag: 'Finding 1 · Dependency', color: 'feel', h3: 'Knowledge never left the meeting', p: 'Everything the client needed to know was explained in live sessions. When the trained person changed roles or left the company, that knowledge went with them and the cycle started over.' },
          { tag: 'Finding 2 · Rework', color: 'mind', h3: 'Every deliverable was built from scratch', p: "Training materials weren't reused across projects, even though a significant share of the content was equivalent. The cost wasn't the design: it was re-making decisions that had already been made." },
          { tag: 'Finding 3 · The tool', color: 'clarity', h3: 'The tool for documenting needed documentation', p: 'Auditing the Custom Canvas I found three competing navigation layers, four visual weights with no hierarchy, and inconsistent component states. The tool meant to organise knowledge had exactly the disorder it was supposed to solve.' },
        ],
      },
      decisions: {
        h2: 'Three decisions, and one I ruled out',
        items: [
          ['Documentation is treated as a product, not an appendix', 'It stops being the last thing written once the project has shipped, and starts being designed with user criteria: who will read it, at what moment, and with what question in mind.'],
          ['Content is organised into reusable domains and slots', 'Instead of one deck per client, a system of blocks produced once and adapted. What changes between clients is the specific configuration, not the structure of the material.'],
          ['Refactoring runs from the system towards the components', "First the visual base (spacing and colour), then the structure (navigation and sidebar), and only at the end the individual components. It's the opposite of intuitive, and it's what stops you reworking every piece twice."],
          ['What I ruled out: starting by redesigning the components', "It was the obvious, most visible move: the slots and buttons looked worst. I ruled it out because building components on a spacing and colour system that didn't exist yet would force a rebuild later. The disorder showed in the components, but it lived in the system.", true],
        ],
      },
      hero: { src: '/assets/diag/qs-dominios.svg', ph: 'Diagram of the domain and slot system' },
      pairs: [
        { src: '/assets/diag/qs-nav-antes.svg', ph: 'BEFORE — three navigation layers competing', cap: 'Three ways to reach the same place, none of them clear.' },
        { src: '/assets/diag/qs-nav-despues.svg', ph: 'AFTER — navigation consolidated into two levels', cap: 'Two levels, one primary action per screen.' },
      ],
      flow: { src: '/assets/qstrauss-flujo.png', ph: 'Documentation cycle diagram', cap: 'The cycle that broke: from the repeated session to material produced once.' },
      result: {
        big: '3 to 6+ months',
        tone: 'mind',
        small: true,
        p: 'is how long an enterprise implementation runs, adjustments and reviews included. The documentation deliverables cut the time spent on training, meetings and clarifications inside that cycle.',
        secondary: "The consequence that wasn't in the brief: the work stopped being measured in sessions delivered and started being measured in how far the client could get without us.",
      },
      takeaways: [
        ['What I learned', "That the most fragile part of an implementation isn't the configuration: it's what the client understands of it. And that in consulting, documentation isn't the close of the project — it's part of the product.", 'clarity'],
        ["What I'd do differently", 'Measure from day one how many hours go into training and clarifications per implementation. I had the problem crystal clear and nothing to prove it with.', 'feel'],
      ],
    },
  },

  bid: {
    tab: 'BID',
    accent: '#8B7BF0',
    es: {
      chips: [['Fintech público', 'mind'], ['UX/UI Designer', 'line'], ['Techsprint BID', 'line']],
      title: 'Tenían toda la información. Ninguna forma de compararla.',
      sub: 'En compras públicas la transparencia se mide en documentos publicados. Pero un PDF disponible no es un dato utilizable: la decisión estaba ocurriendo fuera del sistema.',
      cols: [
        ['Mi rol', 'Research con funcionarios de compras, definición del problema y diseño de la interfaz de comparación.'],
        ['La decisión', 'Dejar de digitalizar documentos y diseñar la comparación: oferentes, montos y productos en una sola vista.'],
        ['El resultado', '2.º lugar del Techsprint, con mención especial por democratización de datos.', true],
      ],
      note: 'Este caso se cuenta en el mismo orden que los otros a propósito. Un formato repetido hace que el lector compare decisiones, no estéticas.',
      brief: {
        h2: 'Transparencia no es publicar. Es poder entender.',
        p1: 'El reto del Techsprint hablaba de acceso a la información de contratación pública. La lectura fácil era construir un buscador mejor. Pero el acceso ya existía: los documentos estaban publicados.',
        p2: 'La pregunta que abrí fue otra: ¿qué hace realmente un funcionario cuando tiene que elegir entre tres propuestas?',
        asked: '“Hacer más accesible la información de las licitaciones.”',
        real: '“Está toda publicada y aun así comparo de memoria, en un papel.”',
      },
      research: {
        h2: 'Ver el proceso real, no el documentado',
        p: 'Acompañé el proceso de evaluación tal como ocurre y lo contrasté con cómo está escrito en el manual. La distancia entre los dos era el hallazgo.',
        stats: [['Observación', 'del proceso de evaluación con funcionarios de compras públicas'], ['Benchmark', 'de portales de contratación de la región, mirando qué permiten comparar'], ['Análisis', 'de la estructura de los PDF publicados y de qué campos son comparables entre sí']],
        questions: ['¿Qué mira primero cuando abre una propuesta?', '¿Qué anota fuera del sistema, y por qué ahí?', '¿Qué tendría que ver para quedarse tranquilo con la decisión?'],
        note: 'Número de sesiones y perfiles exactos — por confirmar con la documentación del proyecto.',
      },
      findings: {
        h2: 'Nadie lee un PDF completo. Se comparan pestañas.',
        items: [
          { tag: 'Hallazgo 1 · Sobrecarga', color: 'feel', h3: 'La decisión se toma fuera del sistema', p: 'Tres propuestas abiertas en tres pestañas y las cifras anotadas a mano. El sistema guardaba la información, pero el trabajo cognitivo quedaba entero del lado de la persona.', quote: '“Abro las tres propuestas en pestañas y anoto en un papel. El sistema no me deja comparar.”', caveat: 'Cita representativa — pendiente de reemplazar por el verbatim exacto.' },
          { tag: 'Hallazgo 2 · Miedo a equivocarse', color: 'mind', h3: 'Cuando la decisión es auditable, la duda paraliza', p: 'Elegir mal en compras públicas tiene consecuencias personales. Sin una comparación que respalde el criterio, la gente se protege revisando de más — y aun así no queda tranquila.' },
          { tag: 'Hallazgo 3 · Público', color: 'clarity', h3: 'El ciudadano tampoco puede leer eso', p: 'Si el funcionario experto no logra comparar, la vigilancia ciudadana es teórica. La legibilidad no es una comodidad: es la condición de la transparencia.' },
        ],
      },
      decisions: {
        h2: 'Diseñar la comparación, no el archivo',
        items: [
          ['Una sola vista con los criterios que deciden', 'Oferentes, montos y productos lado a lado. Lo que antes vivía en un papel ahora es la pantalla principal.'],
          ['El documento pasa a ser el respaldo, no la interfaz', 'El PDF sigue estando, un clic más abajo, para cuando hay que citar la fuente exacta.'],
          ['Legible para dos públicos a la vez', 'La misma vista sirve al funcionario que evalúa y al ciudadano que vigila. No se hicieron dos productos.'],
          ['Lo que descarté: un ranking automático', 'Tentador y peligroso: una puntuación oculta el criterio y traslada la responsabilidad a un algoritmo. En una decisión auditable, la persona tiene que poder explicar por qué eligió.', true],
        ],
      },
      hero: { src: '/assets/diag/bid-comparacion.svg', ph: 'Wireframe de la vista de comparación de licitaciones' },
      pairs: [
        { src: '/assets/diag/bid-detalle.svg', ph: 'Detalle de un oferente', cap: 'El detalle, cuando hace falta citar la fuente.' },
        { src: '/assets/diag/bid-flujo.svg', ph: 'Flujo de evaluación: buscar → comparar → sustentar', cap: 'El recorrido de evaluación, de la búsqueda al sustento.' },
      ],
      result: {
        big: '2.º lugar',
        tone: 'mind',
        small: true,
        p: 'en el Techsprint del BID, con mención especial por democratización de datos — el jurado premió justamente el cambio de enfoque: pasar del acceso a la comprensión.',
        secondary: 'Es el caso donde más claro tengo el aporte del research: la solución técnica era casi la misma que la de los demás equipos. La diferencia fue haber redefinido el problema.',
      },
      takeaways: [
        ['Lo que aprendí', 'Que redefinir el problema es la parte del trabajo que más valor genera y la que menos se ve en un entregable. Hay que aprender a contarla.', 'clarity'],
        ['Qué haría distinto', 'Probar la vista de comparación con ciudadanos, no solo con funcionarios. Diseñamos para dos públicos y solo validamos con uno.', 'feel'],
      ],
    },
    en: {
      chips: [['Public fintech', 'mind'], ['UX/UI Designer', 'line'], ['IDB Techsprint', 'line']],
      title: 'They had all the information. No way to compare it.',
      sub: "In public procurement, transparency is measured in documents published. But an available PDF isn't usable data: the decision was happening outside the system.",
      cols: [
        ['My role', 'Research with procurement officers, problem definition, and design of the comparison interface.'],
        ['The decision', 'Stop digitising documents and design the comparison instead: bidders, amounts and products in a single view.'],
        ['The outcome', '2nd place in the Techsprint, with a special mention for data democratisation.', true],
      ],
      note: 'This case is told in the same order as the others on purpose. A repeated format makes the reader compare decisions, not aesthetics.',
      brief: {
        h2: "Transparency isn't publishing. It's being able to understand.",
        p1: 'The Techsprint challenge talked about access to public procurement information. The easy reading was to build a better search. But access already existed: the documents were published.',
        p2: 'The question I opened was a different one: what does an officer actually do when they have to choose between three proposals?',
        asked: '“Make tender information more accessible.”',
        real: "“It's all published and I still compare from memory, on paper.”",
      },
      research: {
        h2: 'See the real process, not the documented one',
        p: 'I shadowed the evaluation process as it actually happens and contrasted it with how the manual describes it. The distance between the two was the finding.',
        stats: [['Shadowing', 'of the evaluation process with public procurement officers'], ['Benchmark', 'of procurement portals across the region, looking at what they let you compare'], ['Analysis', 'of the structure of published PDFs and which fields are comparable at all']],
        questions: ['What do you look at first when you open a proposal?', 'What do you write down outside the system, and why there?', 'What would you need to see to feel settled about the decision?'],
        note: 'Exact number of sessions and profiles — to be confirmed against project documentation.',
      },
      findings: {
        h2: 'Nobody reads a full PDF. People compare browser tabs.',
        items: [
          { tag: 'Finding 1 · Overload', color: 'feel', h3: 'The decision is made outside the system', p: "Three proposals open in three tabs and the figures written down by hand. The system stored the information, but the cognitive work stayed entirely on the person's side.", quote: "“I open the three proposals in tabs and write on paper. The system won't let me compare.”", caveat: 'Representative quote — to be replaced with the exact verbatim.' },
          { tag: 'Finding 2 · Fear of getting it wrong', color: 'mind', h3: 'When a decision is auditable, doubt paralyses', p: "Choosing badly in public procurement has personal consequences. Without a comparison that backs the criteria, people protect themselves by over-reviewing — and still don't feel settled." },
          { tag: 'Finding 3 · The public', color: 'clarity', h3: "Citizens can't read it either", p: "If the expert officer can't compare, citizen oversight is theoretical. Legibility isn't a convenience: it's the condition of transparency." },
        ],
      },
      decisions: {
        h2: 'Design the comparison, not the archive',
        items: [
          ['One view with the criteria that decide', 'Bidders, amounts and products side by side. What used to live on a sheet of paper is now the main screen.'],
          ['The document becomes the backup, not the interface', 'The PDF is still there, one click deeper, for when you have to cite the exact source.'],
          ['Legible for two audiences at once', "The same view serves the officer evaluating and the citizen watching. We didn't build two products."],
          ['What I ruled out: an automatic ranking', 'Tempting and dangerous: a score hides the criteria and shifts responsibility onto an algorithm. In an auditable decision, the person has to be able to explain why they chose.', true],
        ],
      },
      hero: { src: '/assets/diag/bid-comparacion.svg', ph: 'Wireframe of the tender comparison view' },
      pairs: [
        { src: '/assets/diag/bid-detalle.svg', ph: 'Detail of one bidder', cap: 'The detail, for when you need to cite the source.' },
        { src: '/assets/diag/bid-flujo.svg', ph: 'Evaluation flow: search → compare → justify', cap: 'The evaluation journey, from search to justification.' },
      ],
      result: {
        big: '2nd place',
        tone: 'mind',
        small: true,
        p: 'in the IDB Techsprint, with a special mention for data democratisation — the jury rewarded precisely the shift in framing: from access to comprehension.',
        secondary: "It's the case where research's contribution is clearest to me: the technical solution was nearly the same as the other teams'. The difference was having redefined the problem.",
      },
      takeaways: [
        ['What I learned', 'That redefining the problem is the part of the work that creates the most value and shows up least in a deliverable. You have to learn to narrate it.', 'clarity'],
        ["What I'd do differently", 'Test the comparison view with citizens, not only with officers. We designed for two audiences and validated with one.', 'feel'],
      ],
    },
  },
} as const;
