/** Contenido de la home. Copiado de `Portafolio Emilio - Mente.dc.html`. */

export const TOTAL_FINDS = 8;

export const HOME = {
  es: {
    ctaTitle: '¿Tienes un problema que todavía nadie sabe enunciar?',
    ctaSub: 'Esa es exactamente la parte que me gusta. Elige el canal que te quede más cómodo.',
    heroA: 'Antes de la pantalla, hay',
    heroB: 'una persona',
    heroThinking: 'pensando',
    heroAnd: 'y',
    heroFeeling: 'sintiendo',
    heroTail: 'algo.',
    heroSub:
      'Soy Emilio. Investigo esa parte: qué entiende alguien, qué le da miedo, dónde se rinde. Ahí está casi siempre el problema del negocio — y la solución que sí se usa.',
    heroFindHint: 'Los puntos que laten esconden notas mías. Encuentra las ocho.',
    seeCases: 'Ver los casos',
    readEmotion: 'Qué leo en una emoción',
    mapTitle: 'Una emoción es un dato de negocio',
    mapHint: 'Toca una emoción',
    mapSub:
      'Los usuarios rara vez dicen “el flujo tiene un problema”. Dicen que se cansaron, que no entendieron, que prefirieron llamar. Mi trabajo es traducir eso a una decisión que alguien pueda tomar el lunes.',
    mapFoot:
      'Cinco señales que aparecen en casi todo proyecto. Cada una apunta a un costo o a una oportunidad concreta. Mantén pulsada una para leer la cita original.',
    whatYouSee: 'Lo que se ve',
    whatItMeans: 'Lo que significa',
    whatIDo: 'Lo que hago con eso',
    originalQuote: 'Cita original',
    seenIn: 'Visto en',
    casesTitle: 'Tres casos, tres decisiones difíciles',
    casesHint: 'Insight → Decisión → Resultado. Y la evidencia debajo.',
    xrayOn: 'Devolver la capa de research',
    xrayOff: 'Quitar la capa de research',
    xrayHintOff:
      'Un botón honesto: apaga los insights y déjame solo el “antes y después”. Es como se ve la mayoría de los portafolios.',
    xrayHintOn: 'Esto es lo que queda sin research: pantallas bonitas y ninguna razón. Vuelve a encenderlo.',
    readFull: 'Leer el caso completo →',
    methodTitle: 'Cómo trabajo',
    methodSub:
      'La consultoría me enseñó que la fricción vive en los procesos y en la comunicación, no en el botón. Así que empiezo ahí — y termino con una métrica que alguien más pueda defender.',
    aiTitle: 'IA como aliada',
    aiBody:
      'La uso para sintetizar entrevistas, explorar variantes y automatizar lo repetitivo — para gastar el tiempo en analizar y decidir, que es donde aporto.',
    aboutTitleA: 'Curioso de oficio,',
    aboutTitleB: 'estratega por costumbre.',
    aboutP1:
      'Soy diseñador interactivo de la Universidad Jorge Tadeo Lozano. Pude ser economista o dedicarme a las ventas; elegí un camino donde la curiosidad se paga sola.',
    aboutP2:
      'Trabajo mejor cuando puedo preguntar mucho antes de proponer algo. Me interesan los proyectos donde nadie tiene todavía claro cuál es el problema.',
    /* Encabeza la métrica de ETB, que es la verificable. La de Ropofy pasa a
       un hecho de diseño comprobable en el propio caso, en vez de a un
       porcentaje que no se puede respaldar con una fuente. */
    proof: [
      { n: '30%', l: 'más eficiencia de navegación (ETB, 500+ usuarios/mes)' },
      { n: '311 de 622', l: 'contratos públicos con inconsistencias detectadas (BID, Rep. Dominicana)' },
      { n: '3 canales', l: 'unificados en una sola bandeja de entrada (Ropofy)' },
      { n: '3 a 6+ meses', l: 'duración de las implementaciones que documento hoy' },
    ],
    processPh: 'Foto de proceso sobre fondo oscuro — taller, entrevista, pizarra',
    aboutMore: 'Toda la historia: trayectoria, formación y hoja de vida →',
    waLabel: 'Lo más rápido',
    waTitle: 'WhatsApp · +57 314 254 3651',
    waHref: 'https://wa.me/573142543651',
    liHref: 'https://www.linkedin.com/in/emilio-romero-gutierrez',
    waBody:
      'Escríbeme directo. Contesto el mismo día — después de Ropofy no puedo permitirme lo contrario.',
    cvEs: 'CV en español ↓',
    cvEn: 'CV in English ↓',
    mailLabel: 'Para algo con detalle',
    mailBody: 'Si ya tienes un brief o un documento, mándalo por aquí y lo leo antes de responder.',
    liLabel: 'Para revisar antes',
    liBody: 'Perfil, recomendaciones y el CV en PDF si necesitas pasarlo a alguien más.',
    whatHappens:
      'Qué pasa después: te respondo con dos o tres preguntas antes de proponer nada. Si el problema no es de UX, te lo digo — y te digo qué sí creo que es.',
    unlockedLabel: 'Ocho de ocho',
    unlockedBody:
      'Encontraste las ocho notas. Nadie te pidió hacerlo — y eso es exactamente la clase de curiosidad que busco en la gente con la que trabajo.',
    unlockedTip:
      'Si llegaste hasta aquí, escríbeme y menciona la palabra “ocho”. Sabré con quién estoy hablando.',
    findHint: 'Nota escondida',
    findLabel: 'Nota de Emilio',
    findFound: 'Encontraste una nota',
    panelIntro:
      'Hay ocho notas escondidas en la página: por qué tomé cada decisión de diseño, manías de trabajo y cosas que normalmente solo salen en una entrevista. Busca los puntos que laten.',
    xray: 'Quitar la capa de research',
    reduceMotion: 'Reducir movimiento',
    resetFinds: 'Empezar de nuevo',
    foco: 'Linterna',
    clearPaint: 'Limpiar el fondo pintado',
    pulse: 'Latido en el rastro',
    spotifyRow: 'Mi playlist en Spotify',
    nowPlaying: 'Suena ahora',
    spotifyNote:
      'Cámbiala si no te gusta. Si te gusta, ábrela en Spotify — es mi playlist de trabajo real.',
    /* Playlist de trabajo real. El `?si=` del enlace de compartir es un token
       de seguimiento personal: no se propaga ni al embed ni al enlace. */
    spotifySrc:
      'https://open.spotify.com/embed/playlist/2XIGEB5k7r3OHdYqLVf2lv?utm_source=generator&theme=0',
    senseHint:
      'Nada de esto es decorado: la linterna existe porque todo proyecto tiene letra chica que nadie mira; la playlist es el contexto emocional de trabajar; el fondo pintado dice que quien está del otro lado deja huella aunque no la vea.',
    tutorialLink: 'Ver el tour completo →',
    ghost1:
      'Lo que no pongo en el CV: tardé dos años en aprender a decir “no sé todavía” en una reunión. Sigue siendo la frase más útil que tengo.',
    ghost2:
      'Enciende la linterna y verás que este portafolio tiene más letra chica de la que muestra. Igual que un proyecto.',
    ghost3:
      'Mi primer journey map lo hice en Excel porque no sabía que existía otra forma. Funcionó. Todavía creo que la herramienta importa menos de lo que decimos.',
    songLabel: 'Descubrimiento',
    songTitle: 'Déjame una canción',
    songBody:
      'Si llegaste hasta aquí, te debo algo. Dime qué debería estar en mi playlist mientras trabajo — la escucho de verdad.',
    songPlaceholder: 'Canción y artista',
    songAdd: 'Sumar',
    songThanks: 'Anotada. Gracias.',
    songMail: 'Enviarme tus canciones →',
    playlistLink: 'Abrir mi playlist en Spotify →',
    playlistHref: 'https://open.spotify.com/playlist/2XIGEB5k7r3OHdYqLVf2lv',
    panelKeys: 'Teclas: X research · F linterna · P playlist · M movimiento · L idioma · ? este panel.',
    progress: [
      'Aún no has abierto ninguna. Los puntos laten.',
      'Vas empezando. Quedan siete.',
      'Dos. Hay más en los casos.',
      'Tres. El método y el contacto también esconden.',
      'Cuatro, la mitad.',
      'Cinco. Faltan tres.',
      'Seis. Estás cerca.',
      'Siete. Falta una.',
      'Las ocho. Baja al final de la página.',
    ],
    steps: [
      ['01', 'Entender el negocio', 'Objetivos, procesos, quién decide y qué se mide. Antes de hablar de pantallas.', 'clarity'],
      ['02', 'Escuchar de verdad', 'Entrevistas y observación. Registro lo que se dice, lo que se evita y lo que se hace de otra forma.', 'mind'],
      ['03', 'Traducir a decisiones', 'Un problema bien enunciado y una lista corta. Lo demás se documenta y se deja ir.', 'feel'],
      ['04', 'Validar y medir', 'Pruebas con usuarios reales y una métrica acordada antes de empezar.', 'clarity'],
    ],
    skills: [
      'Entrevistas',
      'Desk research',
      'Journey maps',
      'Usability testing',
      'Diseño de servicios',
      'Figma',
      'Power BI',
      'Adobe Workfront',
    ],
    finds: [
      ['Por qué esta frase y no “UX Designer”', 'Cambié el titular tres veces. “UX Designer” describe un puesto; esto describe una creencia. Si alguien no está de acuerdo con la frase, probablemente tampoco quiera contratarme — y eso también ahorra tiempo a los dos.'],
      ['Este bloque es un truco de entrevista', 'Cuando explico mi trabajo en una llamada, siempre acabo dibujando esto: la emoción a la izquierda, la decisión de negocio a la derecha. Lo puse interactivo porque leerlo no convence; probarlo sí.'],
      ['Cuatro pasos, no siete', 'Tenía un método de siete pasos y lo usaba nadie, ni yo. Un proceso que no se recuerda no se puede contratar. Los tres que quité no eran malos: eran los que nunca hacía igual dos veces.'],
      ['La verdad sobre la curiosidad', 'Pregunto demasiado. En mi primer trabajo me lo dijeron como defecto y tardé años en entenderlo como herramienta. Todavía me cuesta callarme cuando algo no me cuadra — ya dejé de intentarlo.'],
      ['Yo también odio los formularios de contacto', 'Por eso no hay ninguno. Tres canales, todos directos, y ninguno pide tu cargo ni el tamaño de tu empresa antes de dejarte hablar.'],
      ['Ropofy: la conversación difícil', 'A los dos meses tuve que decirle al cliente que le estaba cobrando por lo equivocado. Rediseñar la web no iba a mover su número. Fue incómodo y fue el momento en que el proyecto empezó a servir.'],
      ['QStrauss: lo que no puedo mostrar', 'Este caso tiene NDA, así que no hay capturas — solo un diagrama que dibujé yo. Prefiero un caso honesto sin imágenes que uno ilustrado con material que no debería estar aquí.'],
      ['BID: ganamos una categoría, no el sprint', 'En la general quedamos segundos. Nos llevamos la Distinción en Democratización de Datos, que era justo la parte que nos importaba. Lo cuento entero porque un segundo puesto con criterio enseña más que un primero con suerte.'],
    ],
  },
  en: {
    ctaTitle: 'Got a problem nobody can quite name yet?',
    ctaSub: "That's exactly the part I enjoy. Pick whichever channel suits you.",
    heroA: "Before the screen, there's",
    heroB: 'a person',
    heroThinking: 'thinking',
    heroAnd: 'and',
    heroFeeling: 'feeling',
    heroTail: 'something.',
    heroSub:
      "I'm Emilio. I research that part: what someone understands, what scares them, where they give up. That's almost always where the business problem lives — and the solution people actually use.",
    heroFindHint: 'The pulsing dots hide notes of mine. Find all eight.',
    seeCases: 'See the cases',
    readEmotion: 'What I read in an emotion',
    mapTitle: 'An emotion is business data',
    mapHint: 'Tap an emotion',
    mapSub:
      'Users rarely say “the flow has a problem”. They say they got tired, they didn’t understand, they’d rather call. My job is to translate that into a decision someone can act on Monday morning.',
    mapFoot:
      'Five signals that show up in almost every project. Each one points at a concrete cost or opportunity. Press and hold one to read the original quote.',
    whatYouSee: 'What you see',
    whatItMeans: 'What it means',
    whatIDo: 'What I do with it',
    originalQuote: 'Original quote',
    seenIn: 'Seen in',
    casesTitle: 'Three cases, three hard decisions',
    casesHint: 'Insight → Decision → Outcome. With the evidence underneath.',
    xrayOn: 'Put the research layer back',
    xrayOff: 'Strip the research layer',
    xrayHintOff:
      "An honest button: switch the insights off and leave only the before-and-after. That's how most portfolios look.",
    xrayHintOn: "This is what's left without research: pretty screens and no reasons. Switch it back on.",
    readFull: 'Read the full case →',
    methodTitle: 'How I work',
    methodSub:
      'Consulting taught me that friction lives in processes and communication, not in the button. So I start there — and finish with a metric someone else can defend.',
    aiTitle: 'AI as an ally',
    aiBody:
      'I use it to synthesise interviews, explore variants and automate the repetitive — so the time goes into analysing and deciding, which is where I add value.',
    aboutTitleA: 'Curious by trade,',
    aboutTitleB: 'strategist by habit.',
    aboutP1:
      'I’m an interactive designer from Universidad Jorge Tadeo Lozano. I could have gone into economics or sales; I chose a path where curiosity pays for itself.',
    aboutP2:
      'I work best when I get to ask a lot before proposing anything. I’m drawn to projects where nobody is yet clear on what the problem is.',
    proof: [
      { n: '30%', l: 'better navigation efficiency (ETB, 500+ users/month)' },
      { n: '311 of 622', l: 'public contracts flagged as inconsistent (IDB, Dominican Republic)' },
      { n: '3 channels', l: 'merged into a single inbox (Ropofy)' },
      { n: '3 to 6+ months', l: 'length of the implementations I document today' },
    ],
    processPh: 'Process photo on a dark background — workshop, interview, whiteboard',
    aboutMore: 'The whole story: track record, education and CV →',
    waLabel: 'Fastest',
    waTitle: 'WhatsApp · +57 314 254 3651',
    waHref: 'https://wa.me/573142543651',
    liHref: 'https://www.linkedin.com/in/emilio-romero-gutierrez',
    waBody: "Message me directly. I reply the same day — after Ropofy I can't afford to do otherwise.",
    cvEs: 'CV in Spanish ↓',
    cvEn: 'CV in English ↓',
    mailLabel: 'For something detailed',
    mailBody: "If you already have a brief or a document, send it here and I'll read it before replying.",
    liLabel: 'To check me out first',
    liBody: 'Profile, recommendations, and the CV as a PDF if you need to pass it along.',
    whatHappens:
      "What happens next: I reply with two or three questions before proposing anything. If the problem isn't a UX one, I'll tell you — and tell you what I think it actually is.",
    unlockedLabel: 'Eight of eight',
    unlockedBody:
      "You found all eight notes. Nobody asked you to — and that's exactly the kind of curiosity I look for in the people I work with.",
    unlockedTip:
      'If you made it this far, write to me and mention the word “eight”. I’ll know who I’m talking to.',
    findHint: 'Hidden note',
    findLabel: 'Note from Emilio',
    findFound: 'You found a note',
    panelIntro:
      'There are eight notes hidden across the page: why I made each design decision, working habits, and things that normally only come up in an interview. Look for the pulsing dots.',
    xray: 'Strip the research layer',
    reduceMotion: 'Reduce motion',
    resetFinds: 'Start over',
    foco: 'Flashlight',
    clearPaint: 'Clear the painted background',
    pulse: 'Heartbeat in the trail',
    spotifyRow: 'My Spotify playlist',
    nowPlaying: 'Now playing',
    spotifyNote: "Skip it if you don't like it. If you do, open it in Spotify — it's my real working playlist.",
    spotifySrc:
      'https://open.spotify.com/embed/playlist/2XIGEB5k7r3OHdYqLVf2lv?utm_source=generator&theme=0',
    senseHint:
      "None of this is decoration: the flashlight exists because every project has fine print nobody reads; the playlist is the emotional context of working; the painted background says the person on the other side leaves a mark even when they can't see it.",
    tutorialLink: 'See the full tour →',
    ghost1:
      'What’s not on my CV: it took me two years to learn to say “I don’t know yet” in a meeting. It’s still the most useful sentence I have.',
    ghost2:
      "Switch the flashlight on and you'll find this portfolio has more fine print than it shows. Same as any project.",
    ghost3:
      "I built my first journey map in Excel because I didn't know there was another way. It worked. I still think the tool matters less than we say.",
    songLabel: 'A discovery',
    songTitle: 'Leave me a song',
    songBody:
      'If you got this far, I owe you something. Tell me what should be on my working playlist — I actually listen to it.',
    songPlaceholder: 'Song and artist',
    songAdd: 'Add',
    songThanks: 'Noted. Thank you.',
    songMail: 'Send me your songs →',
    playlistLink: 'Open my playlist on Spotify →',
    playlistHref: 'https://open.spotify.com/playlist/2XIGEB5k7r3OHdYqLVf2lv',
    panelKeys: 'Keys: X research · F flashlight · P playlist · M motion · L language · ? this panel.',
    progress: [
      "You haven't opened any yet. The dots are pulsing.",
      "You're off. Seven to go.",
      'Two. There are more in the cases.',
      'Three. The method and contact hide some too.',
      'Four — halfway.',
      'Five. Three left.',
      "Six. You're close.",
      'Seven. One to go.',
      'All eight. Scroll to the bottom of the page.',
    ],
    steps: [
      ['01', 'Understand the business', 'Goals, processes, who decides and what gets measured. Before any talk of screens.', 'clarity'],
      ['02', 'Listen properly', "Interviews and observation. I record what's said, what's avoided, and what's done another way.", 'mind'],
      ['03', 'Translate into decisions', 'One well-framed problem and a short list. The rest gets documented and let go.', 'feel'],
      ['04', 'Validate and measure', 'Testing with real users and a metric agreed before we start.', 'clarity'],
    ],
    skills: [
      'Interviews',
      'Desk research',
      'Journey maps',
      'Usability testing',
      'Service design',
      'Figma',
      'Power BI',
      'Adobe Workfront',
    ],
    finds: [
      ['Why this line and not “UX Designer”', 'I rewrote this headline three times. “UX Designer” describes a job title; this describes a belief. If someone disagrees with the line they probably don’t want to hire me either — which saves us both time.'],
      ['This block is an interview trick', "Whenever I explain my work on a call I end up drawing this: the emotion on the left, the business decision on the right. I made it interactive because reading it doesn't convince anyone; trying it does."],
      ['Four steps, not seven', "I had a seven-step method and nobody used it, including me. A process you can't remember can't be hired. The three I cut weren't bad: they were the ones I never did the same way twice."],
      ['The truth about the curiosity', "I ask too much. In my first job it was framed as a flaw and it took me years to understand it as a tool. I still struggle to stay quiet when something doesn't add up — I've stopped trying."],
      ['I hate contact forms too', "Which is why there isn't one. Three channels, all direct, and none of them ask for your job title or company size before letting you speak."],
      ['Ropofy: the hard conversation', "Two months in I had to tell the client I was charging them for the wrong thing. Redesigning the site wasn't going to move their number. It was uncomfortable, and it's the moment the project started to be useful."],
      ['QStrauss: what I can’t show', "This case is under NDA, so there are no screenshots — only a diagram I drew myself. I'd rather have an honest case with no images than one illustrated with material that shouldn't be here."],
      ['IDB: we won a category, not the sprint', "We came second overall. We took the Distinction in Data Democratisation, which was exactly the part we cared about. I tell the whole thing because second place with judgement teaches more than first place with luck."],
    ],
  },
} as const;

/** Las cinco señales del mapa de emociones. */
export const EMOTIONS = [
  {
    key: 'espera',
    hue: '#F0466B',
    deep: '#4A1B2C',
    caseRef: 'Ropofy',
    es: {
      label: 'Espera',
      cue: '“Escribí y me contestaron tres días después.”',
      signal: 'El silencio se interpreta como desinterés. La persona ya decidió antes de que respondas.',
      move: 'Mido el tiempo real de respuesta por canal y rediseño el flujo alrededor del contacto, no del catálogo.',
      raw: '“Yo ya estaba lista para comprar. Lo que me hizo dudar fue el silencio, no el precio.” — cliente, entrevista 4',
    },
    en: {
      label: 'Waiting',
      cue: '“I wrote and they got back to me three days later.”',
      signal: 'Silence reads as indifference. The person has already decided before you reply.',
      move: 'I measure real response time per channel and rebuild the flow around getting in touch, not around the catalogue.',
      raw: '“I was ready to buy. What made me hesitate was the silence, not the price.” — customer, interview 4',
    },
  },
  {
    key: 'confusion',
    hue: '#8B7BF0',
    deep: '#2A2352',
    caseRef: 'BID',
    es: {
      label: 'Confusión',
      cue: '“Tengo toda la información y aun así no sé qué revisar primero.”',
      signal: 'El problema no es el acceso, es la verificación. Lo que no cuadra puede estar en cualquier campo del documento.',
      move: 'Digitalizo los documentos y automatizo la comparación: que la herramienta señale la inconsistencia, no la persona.',
      raw: '“Brindar una mayor transparencia en los procesos gubernamentales.” — el reto, tal como lo planteó el BID',
    },
    en: {
      label: 'Confusion',
      cue: "“I have all the information and still don't know what to check first.”",
      signal: "The problem isn't access, it's verification. What doesn't add up can sit in any field of the document.",
      move: 'I digitise the documents and automate the comparison: let the tool flag the inconsistency, not the person.',
      raw: '“Bring greater transparency to government processes.” — the challenge, as the IDB set it out',
    },
  },
  {
    key: 'incertidumbre',
    hue: '#22D3EE',
    deep: '#123A4A',
    caseRef: 'QStrauss',
    es: {
      label: 'Incertidumbre',
      cue: '“No sé cómo quedó configurado lo nuestro ni a quién preguntarle.”',
      signal: 'Sin un lugar donde viva la respuesta, cada duda vuelve al consultor. El cliente no avanza solo.',
      move: 'Convierto la documentación en producto: dominios reutilizables que responden antes de que pregunten.',
      raw: '“Tengo un Excel aparte porque en el sistema no confío.” — coordinadora de operaciones',
    },
    en: {
      label: 'Uncertainty',
      cue: "“I don't know how ours ended up configured, or who to ask.”",
      signal: 'With no place for the answer to live, every question comes back to the consultant. The client can’t move alone.',
      move: 'I turn documentation into a product: reusable domains that answer before anyone asks.',
      raw: "“I keep a separate spreadsheet because I don't trust the system.” — operations coordinator",
    },
  },
  {
    key: 'sobrecarga',
    hue: '#8B7BF0',
    deep: '#2A2352',
    caseRef: 'QStrauss',
    es: {
      label: 'Sobrecarga',
      cue: '“Para hacer esto tengo que abrir cuatro herramientas.”',
      signal: 'El costo no aparece en ningún reporte, pero se paga todos los días en horas del equipo.',
      move: 'Mapeo la operación real, no la documentada, y elimino pasos antes de automatizar nada.',
      raw: '“Cada vez que entra alguien nuevo, la capacitación se dicta otra vez desde cero.” — líder de implementación',
    },
    en: {
      label: 'Overload',
      cue: '“To do this I have to open four different tools.”',
      signal: "The cost shows up in no report, but it's paid every day in the team's hours.",
      move: 'I map the real operation, not the documented one, and remove steps before automating anything.',
      raw: '“Every time someone new joins, the training gets delivered from scratch again.” — implementation lead',
    },
  },
  {
    key: 'alivio',
    hue: '#22D3EE',
    deep: '#123A4A',
    caseRef: 'Ropofy',
    es: {
      label: 'Alivio',
      cue: '“Ya no necesito preguntarle a nadie para hacerlo.”',
      signal: 'La señal de que funcionó. Adopción real, no capacitación repetida.',
      move: 'Es la métrica que acuerdo al inicio: menos soporte, más permanencia, más repetición.',
      raw: '“Ahora entro, veo y pido. Ya no tengo que escribirle a nadie.” — cliente recurrente',
    },
    en: {
      label: 'Relief',
      cue: "“I don't need to ask anyone to get this done anymore.”",
      signal: 'The sign that it worked. Real adoption, not repeated training.',
      move: "It's the metric I agree on at the start: less support, more retention, more repeat business.",
      raw: "“Now I log in, look and order. I don't have to write to anyone.” — repeat customer",
    },
  },
] as const;

/** Resumen de los tres casos tal como aparece en la home (versión corta). */
export const HOME_CASES = [
  {
    key: 'ropofy',
    flip: false,
    findIdx: 5,
    shots: [
      { src: '/assets/diag/ropofy-despues.svg', es: ['Esquema de la arquitectura después', 'La home después: el contacto es parte del recorrido.'], en: ['Redesigned architecture diagram', 'The home after: contact is part of the journey.'] },
      { src: '/assets/diag/ropofy-antes.svg', es: ['Esquema del sitio original antes del rediseño', 'Antes: el catálogo al frente, el contacto al final.'], en: ['Ropofy — original site before the redesign', 'Before: catalogue up front, contact at the very end.'] },
      { src: '/assets/diag/ropofy-flujo.svg', es: ['Diagrama de los tres canales entrando a una bandeja', 'El flujo que ordenó WhatsApp, web e Instagram.'], en: ['Diagram of three channels feeding one inbox', 'The flow that put WhatsApp, web and Instagram in order.'] },
    ],
    es: {
      chips: [['SaaS · CRM', 'clarity'], ['Diseño + Consultoría', 'line'], ['Caso principal', 'feel']],
      title: 'Ropofy · Del rediseño a la estrategia',
      lede: 'Me contrataron para rediseñar la web. A los pocos meses el encargo cambió solo: el sitio no era el cuello de botella — la espera del cliente sí lo era.',
      rows: [
        ['Insight', 'Las consultas entraban por WhatsApp, web e Instagram a la vez y se perdían entre canales. El abandono no pasaba en el checkout: pasaba en la espera.', 'insight'],
        ['Decisión', 'Rediseñé la web alrededor del contacto, no del catálogo, y pasé a acompañar la estrategia para que ninguna conversación quedara suelta.', 'insight'],
        ['Resultado', 'El rediseño acompañó el crecimiento de tráfico y de generación de leads durante la etapa de estabilización de la compañía.', 'win'],
      ],
      tags: [['Espera', 'feel'], ['Desconfianza', 'line'], ['→ Hábito', 'clarity']],
      xray:
        'Sin el insight, este caso es “hicimos una web nueva”. La decisión no se puede defender y el resultado parece suerte.',
      method: 'Método: 6 entrevistas a clientes recientes y revisión de tres meses de conversaciones entrantes, canal por canal.',
      quote: '“Escribí el viernes y me contestaron el martes. Ya había comprado en otro lado.”',
      discard: 'Lo que descarté: un chatbot. La empresa no tenía el volumen para justificarlo y habría añadido una espera más — con una respuesta menos útil.',
    },
    en: {
      chips: [['SaaS · CRM', 'clarity'], ['Design + Consulting', 'line'], ['Lead case', 'feel']],
      title: 'Ropofy · From redesign to strategy',
      lede: "They hired me to redesign the website. Within months the brief changed on its own: the site wasn't the bottleneck — the customer's wait was.",
      rows: [
        ['Insight', "Enquiries arrived via WhatsApp, web and Instagram at once and got lost between channels. Drop-off wasn't at checkout: it was in the wait.", 'insight'],
        ['Decision', 'I rebuilt the site around getting in touch rather than the catalogue, then stayed on to shape the strategy so no conversation was left loose.', 'insight'],
        ['Outcome', 'The redesign accompanied the growth in traffic and lead generation during the company’s stabilisation stage.', 'win'],
      ],
      tags: [['Waiting', 'feel'], ['Distrust', 'line'], ['→ Habit', 'clarity']],
      xray:
        "Without the insight, this case reads as “we built a new website”. The decision can't be defended and the outcome looks like luck.",
      method: 'Method: 6 interviews with recent customers and a review of three months of inbound conversations, channel by channel.',
      quote: "“I wrote on Friday and they replied on Tuesday. I'd already bought elsewhere.”",
      discard: "What I ruled out: a chatbot. The company didn't have the volume to justify it and it would have added one more wait — with a less useful answer.",
    },
  },
  {
    key: 'qstrauss',
    flip: true,
    findIdx: 6,
    shots: [
      { src: '/assets/diag/qs-flujo.svg', es: ['Diagrama de flujo del caso (sin NDA)', 'El ciclo que se rompió: de la sesión repetida al material que se produce una vez.'], en: ['Case flow diagram (NDA-safe)', 'The cycle that broke: from repeated session to material produced once.'] },
      { src: '/assets/diag/qs-nav-despues.svg', es: ['Esquema de la navegación consolidada — sin datos reales', 'La navegación consolidada en dos niveles.'], en: ['Redrawn Custom Canvas wireframe — no real data', 'Navigation consolidated into two levels.'] },
      { src: '/assets/diag/qs-dominios.svg', es: ['Esquema del sistema de dominios y slots', 'Los bloques que se producen una vez y se adaptan por cliente.'], en: ['Diagram of the domain and slot system', 'Blocks produced once and adapted per client.'] },
    ],
    es: {
      chips: [['Consultoría · Enterprise', 'mind'], ['Diseño de servicios', 'line'], ['Actualidad', 'line']],
      title: 'QStrauss · La documentación como producto',
      lede: 'Entregábamos la plataforma configurada y el conocimiento se quedaba con nosotros. Meses después, el cliente seguía llamando para preguntar cómo funcionaba lo que ya tenía.',
      rows: [
        ['Insight', 'Las dudas se repetían dentro del mismo cliente, con los mismos equipos. No era un problema de configuración: era de transferencia de conocimiento.', 'insight'],
        ['Decisión', 'Tratar la documentación como un sistema reutilizable de dominios y slots, no como un anexo que se escribe al final de cada proyecto.', 'insight'],
        ['Resultado', 'Menos horas en capacitaciones y aclaraciones dentro de implementaciones de 3 a más de 6 meses.', 'win'],
      ],
      tags: [['Dependencia', 'feel'], ['Reproceso', 'line'], ['→ Autonomía', 'clarity']],
      xray:
        'Sin el insight, este caso es “escribimos más documentación”. Nada explica por qué el cliente seguía preguntando lo mismo, ni por qué esta vez iba a dejar de hacerlo.',
      method: 'Método: auditoría de la herramienta interna de documentación y revisión de las sesiones y preguntas que se repetían tras la entrega.',
      quote: '“No sabemos cómo quedó configurado lo nuestro ni a quién preguntarle.”',
      discard: 'Lo que descarté: empezar por rediseñar los componentes. El desorden se veía ahí, pero vivía en el sistema de espaciado y color.',
    },
    en: {
      chips: [['Consulting · Enterprise', 'mind'], ['Service design', 'line'], ['Current work', 'line']],
      title: 'QStrauss · Documentation as a product',
      lede: 'We delivered the platform configured and the knowledge stayed with us. Months later the client was still calling to ask how the thing they already owned worked.',
      rows: [
        ['Insight', 'The same questions repeated within the same client, with the same teams. Not a configuration problem: a knowledge-transfer one.', 'insight'],
        ['Decision', 'Treat documentation as a reusable system of domains and slots, not as an appendix written at the end of each project.', 'insight'],
        ['Outcome', 'Fewer hours on training and clarifications inside implementations running 3 to 6+ months.', 'win'],
      ],
      tags: [['Dependency', 'feel'], ['Rework', 'line'], ['→ Autonomy', 'clarity']],
      xray:
        'Without the insight, this case reads as “we wrote more documentation”. Nothing explains why the client kept asking the same questions, or why this time they would stop.',
      method: 'Method: an audit of the internal documentation tool and a review of the sessions and questions that kept repeating after delivery.',
      quote: "“We don't know how ours ended up configured, or who to ask.”",
      discard: 'What I ruled out: starting by redesigning the components. The disorder showed there, but it lived in the spacing and colour system.',
    },
  },
  {
    key: 'bid',
    flip: false,
    findIdx: 7,
    shots: [
      { src: '/assets/diag/bid-comparacion.svg', es: ['Tabla de aplicantes', 'Precio estimado contra precio ofertado: la herramienta marca la línea que no cuadra.'], en: ['Applicants table', 'Estimated price against offered price: the tool flags the line that does not add up.'] },
      { src: '/assets/diag/bid-detalle.svg', es: ['Tablero del catálogo de contratos', '311 de 622 contratos con información faltante o inconsistencias.'], en: ['Contract catalogue dashboard', '311 of 622 contracts with missing information or inconsistencies.'] },
      { src: '/assets/diag/bid-flujo.svg', es: ['Del documento publicado a la decisión', 'Digitalizar, comparar, señalar. La firma sigue siendo humana.'], en: ['From published document to decision', 'Digitise, compare, flag. The signature stays human.'] },
    ],
    es: {
      chips: [['Transparencia pública', 'mind'], ['UX/UI Designer', 'line']],
      title: 'BID · Verificación de licitaciones públicas',
      lede: 'Toda la documentación de una licitación estaba publicada — y verificar si cuadraba seguía siendo leerla a mano, documento por documento.',
      rows: [
        ['Insight', 'La inconsistencia puede estar en el precio, en un dato faltante o en el producto ofertado. Son tres revisiones distintas sobre el mismo papel.', 'insight'],
        ['Decisión', 'Digitalizamos los documentos con Power BI e inteligencia artificial, y automatizamos la comparación para que la herramienta señale lo que no cuadra.', 'insight'],
        ['Resultado', 'Ganadores de la categoría Distinción en Democratización de Datos. Segundos en la general.', 'win'],
      ],
      tags: [['Dispersión', 'feel'], ['Miedo a equivocarse', 'line'], ['→ Criterio', 'clarity']],
      xray:
        'Sin el insight, este caso es “hicimos otro portal de licitaciones”. Los documentos ya estaban publicados: sin la pregunta detrás, la pantalla no cambia nada.',
      method: 'Método: análisis de soluciones potenciales y definición del usuario objetivo — el funcionario que revisa — antes de proponer la herramienta. Las pruebas con usuarios llegaron sobre el prototipo.',
      quote: '“Brindar una mayor transparencia en los procesos gubernamentales.” — el reto, tal como lo planteó el BID',
      discard: 'Lo que no hicimos: decidir por el funcionario. La herramienta señala dónde mirar; adjudicar sigue siendo una decisión humana y auditable.',
    },
    en: {
      chips: [['Public transparency', 'mind'], ['UX/UI Designer', 'line']],
      title: 'IDB · Verifying public tenders',
      lede: 'Every document in a tender was published — and checking whether it added up still meant reading them by hand, one at a time.',
      rows: [
        ['Insight', 'An inconsistency can sit in the price, in a missing field or in the product offered. That is three different reviews of the same paperwork.', 'insight'],
        ['Decision', 'We digitised the documents with Power BI and AI, and automated the comparison so the tool flags what does not match.', 'insight'],
        ['Outcome', 'Winners of the Distinction in Data Democratisation category. Second overall.', 'win'],
      ],
      tags: [['Scattered', 'feel'], ['Fear of getting it wrong', 'line'], ['→ Judgement', 'clarity']],
      xray:
        'Without the insight, this case reads as “we built another procurement portal”. The documents were already published: without the question behind it, the screen changes nothing.',
      method: 'Method: analysing potential solutions and defining the target user — the officer doing the review — before proposing the tool. User testing came later, on the prototype.',
      quote: '“Bring greater transparency to government processes.” — the challenge, as the IDB set it out',
      discard: "What we didn't do: decide for the officer. The tool points at where to look; awarding remains a human, auditable decision.",
    },
  },
] as const;
