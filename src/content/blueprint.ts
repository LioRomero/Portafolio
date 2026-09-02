/**
 * Las cinco capas de un service blueprint, contadas con el caso de Ropofy.
 *
 * No son etiquetas de manual: cada capa dice qué pasó de verdad en ese
 * proyecto, para que el visitante entienda la herramienta viendo un caso real
 * en vez de una definición. La línea de visibilidad va entre la tercera y la
 * cuarta, que es donde vive casi todo lo que me contratan a arreglar.
 */

export const BLUEPRINT = {
  es: {
    kicker: 'Herramienta · Service blueprint',
    title: 'Las cinco capas, con un caso encima',
    lede: 'Un blueprint apila lo que el cliente vive sobre lo que lo sostiene. Arrástralo para girarlo, o sepáralo para ver qué hay debajo de la línea. El ejemplo es Ropofy.',
    hint: 'Arrastra para girar · flechas del teclado también',
    separar: 'Separación',
    girar: 'Girar el blueprint',
    reiniciar: 'Volver al frente',
    sonidoOn: 'Silenciar',
    sonidoOff: 'Activar sonido',
    lineaLabel: 'Línea de visibilidad',
    lineaNota: 'Todo lo que está debajo es invisible para el cliente — y es donde estaba el problema real.',
    montaRegla: 'Antes de mirarlo hay que armarlo. Toca las capas en el orden en que se dibuja un blueprint: primero lo que el cliente vive, después lo que lo sostiene.',
    montaProgreso: 'colocadas',
    montaHecho: 'Armado. Ahora ábrelo: cada capa es un cajón.',
    montaError: 'Esa va más abajo. Se reinicia.',
    capas: [
      { n: '01', t: 'Evidencia física', d: 'La respuesta que llega al celular. Es lo único tangible de todo el servicio.', tono: 'clarity' },
      { n: '02', t: 'Acciones del usuario', d: 'Escribe el viernes. Espera. El martes ya compró en otro lado.', tono: 'feel' },
      { n: '03', t: 'Lo que el usuario ve', d: 'El sitio, el canal por donde escribe y el tiempo de respuesta que le prometen.', tono: 'mind' },
      { n: '04', t: 'Lo que pasa detrás', d: 'Tres canales sin dueño. Nadie sabe cuál consulta ya se respondió.', tono: 'feel' },
      { n: '05', t: 'Procesos de soporte', d: 'La bandeja única, el dueño por consulta y la métrica de primera respuesta.', tono: 'clarity' },
    ],
    cierre: 'El rediseño no empezó en la capa 03, que era la que me habían encargado. Empezó en la 04.',
  },
  en: {
    kicker: 'Tool · Service blueprint',
    title: 'The five layers, with a real case on top',
    lede: 'A blueprint stacks what the customer lives through on top of what holds it up. Drag to rotate it, or pull it apart to see what sits below the line. The example is Ropofy.',
    hint: 'Drag to rotate · arrow keys work too',
    separar: 'Spread',
    girar: 'Rotate the blueprint',
    reiniciar: 'Face on',
    sonidoOn: 'Mute',
    sonidoOff: 'Sound on',
    lineaLabel: 'Line of visibility',
    lineaNota: 'Everything below it is invisible to the customer — and that is where the real problem was.',
    montaRegla: 'Before looking at it you have to build it. Tap the layers in the order a blueprint is drawn: first what the customer lives through, then what holds it up.',
    montaProgreso: 'placed',
    montaHecho: 'Built. Now open it: every layer is a drawer.',
    montaError: 'That one goes further down. Starting over.',
    capas: [
      { n: '01', t: 'Physical evidence', d: 'The reply that lands on their phone. The only tangible part of the whole service.', tono: 'clarity' },
      { n: '02', t: 'User actions', d: 'Writes on Friday. Waits. By Tuesday they have bought elsewhere.', tono: 'feel' },
      { n: '03', t: 'What the user sees', d: 'The site, the channel they write through, and the response time they are promised.', tono: 'mind' },
      { n: '04', t: 'What happens backstage', d: 'Three channels with no owner. Nobody knows which enquiry was already answered.', tono: 'feel' },
      { n: '05', t: 'Support processes', d: 'The single inbox, an owner per enquiry, and the time-to-first-response metric.', tono: 'clarity' },
    ],
    cierre: 'The redesign did not start at layer 03, the one I was hired for. It started at 04.',
  },
} as const;
