/** Canvas de emociones. Copiado de `Canvas Emociones.dc.html`. */

export const CONTACT_EMAIL = 'emilio.romerog@outlook.com';

/** Un color por ánimo: cian, violeta, coral, violeta, cian. */
export const MOOD_HUES = ['#22D3EE', '#8B7BF0', '#F0466B', '#8B7BF0', '#22D3EE'] as const;

export const CANVAS = {
  es: {
    badge: 'Canvas abierto',
    kind: 'Escribe algo · queda en tu navegador',
    title: 'Deja aquí lo que te dejó esta página',
    sub: 'Una emoción, una duda, una idea de mejora o algo que no cuadró. Lo leo todo — es la única investigación que puedo hacer sobre mi propio portafolio.',
    moodLabel: '¿Con qué te quedas?',
    moods: ['Claridad', 'Curiosidad', 'Duda', 'Inspiración', 'Sugerencia'],
    placeholder: 'Escribe lo que quieras. Sin filtro es más útil.',
    whoPlaceholder: 'Tu nombre o cómo quieres firmar (opcional)',
    submit: 'Fijar la nota',
    mail: 'Enviármela por correo →',
    privacy:
      'Las notas se guardan solo en tu navegador: no viajan a ningún servidor. Si quieres que la lea de verdad, usa el enlace de correo — abre tu cliente con la nota ya escrita.',
    wallLabel: 'Tus notas',
    clearAll: 'Borrar todas',
    remove: 'Borrar esta nota',
    anon: 'Anónimo',
    justNow: 'ahora mismo',
    minsAgo: 'hace {n} min',
    hoursAgo: 'hace {n} h',
    daysAgo: 'hace {n} d',
    mailSubject: 'Nota desde tu portafolio',
  },
  en: {
    badge: 'Open canvas',
    kind: 'Write something · stays in your browser',
    title: 'Leave whatever this page left you with',
    sub: "An emotion, a doubt, an idea for improvement, or something that didn't land. I read all of it — it's the only research I can run on my own portfolio.",
    moodLabel: 'What are you taking away?',
    moods: ['Clarity', 'Curiosity', 'Doubt', 'Inspiration', 'Suggestion'],
    placeholder: 'Write whatever you want. Unfiltered is more useful.',
    whoPlaceholder: "Your name, or how you'd like to sign (optional)",
    submit: 'Pin the note',
    mail: 'Email it to me →',
    privacy:
      'Notes are stored only in your browser — they never reach a server. If you want me to actually read it, use the email link: it opens your mail client with the note already written.',
    wallLabel: 'Your notes',
    clearAll: 'Clear all',
    remove: 'Delete this note',
    anon: 'Anonymous',
    justNow: 'just now',
    minsAgo: '{n} min ago',
    hoursAgo: '{n} h ago',
    daysAgo: '{n} d ago',
    mailSubject: 'A note from your portfolio',
  },
} as const;
