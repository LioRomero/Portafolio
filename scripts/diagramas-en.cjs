/**
 * Genera la versión inglesa de los diagramas.
 *
 * El conmutador de idioma promete que cambia *todo* el contenido, no solo los
 * menús. Los once diagramas eran la excepción: un lector en inglés abría un
 * caso y encontraba «Precio ofertado» dentro de la imagen, justo en la única
 * evidencia visual que tienen Ropofy y QStrauss.
 *
 * Lee cada SVG de `public/assets/diag/` y escribe su gemelo en
 * `public/assets/diag/en/`. La traducción va por nodo de texto completo, no
 * por subcadena: así «Artículo» y «Artículo 1» son entradas distintas y no
 * hay reemplazos parciales que rompan una frase por dentro.
 *
 * Si aparece un texto sin traducir, el script falla en vez de publicar el
 * diagrama a medias. Al añadir texto a un diagrama hay que añadirlo aquí.
 *
 * Orden: primero `bid-diagramas.cjs` (que escribe los tres del BID en
 * español), después este.
 */
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..', 'public', 'assets', 'diag');
const destino = path.join(raiz, 'en');

/** Textos que no se traducen: nombres propios, marcas y cifras. */
const IGUAL = new Set([
  'MapaInversiones', 'WhatsApp', 'Instagram', 'Home', 'Santiago', 'Distrito Nacional',
  'slot', '0', '622', '311', '229', '61', '20',
  'Sto. Domingo Este', 'Sto. Domingo Oeste',
]);

const DICC = {
  /* --- BID · tabla de aplicantes ------------------------------------- */
  'Tabla de aplicantes · precio estimado contra precio ofertado': 'Applicants table · estimated price against offered price',
  'TABLA DE APLICANTES · PRECIO ESTIMADO CONTRA PRECIO OFERTADO': 'APPLICANTS TABLE · ESTIMATED PRICE AGAINST OFFERED PRICE',
  'Aplicantes · comparación automática': 'Applicants · automated comparison',
  'filtro: bienes · obras · servicios': 'filter: goods · works · services',
  'Razón social': 'Company name',
  'Artículo': 'Item',
  'Cantidad': 'Quantity',
  'Precio estimado': 'Estimated price',
  'Precio ofertado': 'Offered price',
  'Diferencia': 'Difference',
  'Oferente A': 'Bidder A',
  'Oferente B': 'Bidder B',
  'Oferente C': 'Bidder C',
  'Artículo 1': 'Item 1',
  'Artículo 2': 'Item 2',
  'Artículo 3': 'Item 3',
  'Artículo 4': 'Item 4',
  'sin estimado': 'no estimate',
  'sin oferta': 'no offer',
  '3 de 5 líneas señaladas: sobreprecio, dato faltante y producto sin oferta.': '3 of 5 lines flagged: overpricing, missing data and a product with no offer.',
  'La herramienta calcula la diferencia y marca la línea: se revisa lo señalado, no todo.': 'The tool computes the difference and flags the line: you review the flags, not everything.',
  'Esquema propio sobre el producto real · oferentes anonimizados': 'My own diagram of the real product · bidders anonymised',

  /* --- BID · tablero del catálogo ------------------------------------- */
  'Tablero del catálogo de contratos': 'Contract catalogue dashboard',
  'TABLERO DEL CATÁLOGO DE CONTRATOS': 'CONTRACT CATALOGUE DASHBOARD',
  'MapaInversiones · Catálogo de Contratos — Estado del contrato': 'MapaInversiones · Contract Catalogue — Contract status',
  'Activo': 'Active',
  'Cerrado': 'Closed',
  'En edición': 'In edit',
  'Modificado': 'Modified',
  'Rescindido': 'Terminated',
  'Contratos con información faltante': 'Contracts with missing information',
  'Contratos con inconsistencias en documentos': 'Contracts with document inconsistencies',
  'Distribución de contratos por tipo': 'Contracts by type',
  'Bienes': 'Goods',
  'Obras': 'Works',
  'Servicios': 'Services',
  'Distribución por región · valor contratado': 'By region · contracted value',
  'La mitad del catálogo: 311 de 622 contratos con información faltante o inconsistencias.': 'Half the catalogue: 311 of 622 contracts with missing data or inconsistencies.',
  'Cifras del producto · Gobierno de la República Dominicana': 'Product figures · Government of the Dominican Republic',

  /* --- BID · flujo ----------------------------------------------------- */
  'Del documento publicado a la decisión': 'From published document to decision',
  'DEL DOCUMENTO PUBLICADO A LA DECISIÓN': 'FROM PUBLISHED DOCUMENT TO DECISION',
  'Documentos': 'Documents',
  'de la licitación,': 'from the tender,',
  'como se publican': 'as published',
  'Digitalización': 'Digitisation',
  'Power BI + IA': 'Power BI + AI',
  'los vuelven datos': 'turn them into data',
  'Comparación': 'Comparison',
  'lo solicitado contra': 'requested',
  'lo ofertado': 'vs. offered',
  'Inconsistencia': 'Inconsistency',
  'precio, dato faltante': 'price, missing',
  'o producto': 'data or product',
  'Decisión': 'Decision',
  'la firma sigue': 'the signature',
  'siendo humana': 'stays human',
  'Lo que cambia el trabajo: el paso 4 lo hace la herramienta.': "What changes the work: step 4 is the tool's job.",
  'Antes, encontrar la inconsistencia era leer los documentos completos, uno por uno.': 'Before, finding the inconsistency meant reading whole documents, one by one.',
  'La herramienta señala dónde mirar. Adjudicar sigue siendo humano, y por eso auditable.': 'The tool points at where to look. Awarding stays human, and so auditable.',
  'Esquema propio · TechSprint BID 2024': 'My own diagram · IDB TechSprint 2024',

  /* --- QStrauss · dominios --------------------------------------------- */
  'Sistema de dominios y slots': 'Domain and slot system',
  'SISTEMA DE DOMINIOS Y SLOTS': 'DOMAIN AND SLOT SYSTEM',
  'Un bloque se produce una vez. Lo que cambia entre': 'A block is produced once. What changes between',
  'clientes es la configuración, no la estructura.': 'clients is the configuration, not the structure.',
  'DOMINIOS (SE ESCRIBEN UNA VEZ)': 'DOMAINS (WRITTEN ONCE)',
  'Estructura de trabajo': 'Work structure',
  'Solicitudes': 'Requests',
  'Reportes': 'Reports',
  'Permisos': 'Permissions',
  'SLOTS (SE CONFIGURAN POR CLIENTE)': 'SLOTS (CONFIGURED PER CLIENT)',
  'Esquema propio · sin datos de cliente (NDA)': 'My own diagram · no client data (NDA)',

  /* --- QStrauss · flujo ------------------------------------------------ */
  'El ciclo que se rompió': 'The cycle that broke',
  'EL CICLO QUE SE ROMPIÓ': 'THE CYCLE THAT BROKE',
  'Antes: el conocimiento se quedaba con nosotros': 'Before: the knowledge stayed with us',
  'Implementación': 'Rollout',
  'configurada y': 'configured and',
  'entregada': 'handed over',
  'Dudas': 'Questions',
  'semanas después': 'weeks later',
  'Sesión': 'Session',
  'en vivo, otra vez': 'live, all over again',
  'Dependencia': 'Dependency',
  'del equipo consultor': 'on the consultants',
  'el ciclo se repetía dentro del mismo cliente': 'the cycle repeated inside the same client',
  'Después: documentación como producto': 'After: documentation as a product',
  'Material': 'Material',
  'producido una vez': 'produced once',
  'El equipo del cliente': 'The client team',
  'resuelve solo': 'sorts it out alone',
  'Autonomía': 'Autonomy',
  'menos horas de': 'fewer hours',
  'aclaración': 'clarifying',

  /* --- QStrauss · navegación ------------------------------------------- */
  'Navegación · antes': 'Navigation · before',
  'NAVEGACIÓN · ANTES': 'NAVIGATION · BEFORE',
  'Tres formas de llegar al mismo sitio, ninguna': 'Three ways to reach the same place, none of',
  'clara.': 'them clear.',
  'Barra superior': 'Top bar',
  '8 destinos': '8 destinations',
  'Sidebar': 'Sidebar',
  'Contenido': 'Content',
  'acción': 'action',
  'Tres acciones primarias compitiendo en la misma pantalla.': 'Three primary actions competing on the same screen.',
  'El desorden se veía en los componentes, pero vivía en el sistema.': 'The mess showed in the components, but it lived in the system.',
  'Tercera capa: accesos duplicados dentro del propio contenido': 'Third layer: duplicate entry points inside the content itself',
  'Navegación · después': 'Navigation · after',
  'NAVEGACIÓN · DESPUÉS': 'NAVIGATION · AFTER',
  'Dos niveles, una acción primaria por pantalla.': 'Two levels, one primary action per screen.',
  'Nivel 1 · dominio': 'Level 1 · domain',
  '4 destinos': '4 destinations',
  'Nivel 2 · sección': 'Level 2 · section',
  'Una acción primaria': 'One primary action',
  'lo demás pasa a secundario o desaparece': 'everything else drops to secondary or goes',
  'Primero la base visual (espaciado y color), después la': 'Visual base first (spacing and colour), then the',
  'estructura, y solo al final los componentes.': 'structure, and only then the components.',
  'Refactorización por fases: del sistema hacia los componentes': 'Phased refactor: from the system towards the components',

  /* --- Ropofy · arquitectura ------------------------------------------- */
  'Arquitectura del sitio · antes': 'Site architecture · before',
  'ARQUITECTURA DEL SITIO · ANTES': 'SITE ARCHITECTURE · BEFORE',
  'Catálogo al frente. La empresa se presenta, no conversa.': 'Catalogue up front. The company introduces itself, it does not talk.',
  'Categoría': 'Category',
  'productos': 'products',
  'Ficha de producto': 'Product page',
  'Sin canal de contacto en la pantalla. El siguiente paso queda en el aire.': 'No contact channel on screen. The next step is left hanging.',
  'Contacto — en el pie, al final de todo': 'Contact — in the footer, at the very end',
  'Cuatro pantallas después de la intención de compra.': 'Four screens after the intent to buy.',
  'Esquema propio · no es captura de pantalla': 'My own diagram · not a screenshot',
  'Arquitectura del sitio · después': 'Site architecture · after',
  'ARQUITECTURA DEL SITIO · DESPUÉS': 'SITE ARCHITECTURE · AFTER',
  'Qué resolvemos, para quién, y cómo escribirnos hoy.': 'What we solve, for whom, and how to reach us today.',
  'Escríbenos': 'Message us',
  'canal + tiempo de respuesta': 'channel + response time',
  'Qué hacemos': 'What we do',
  'contacto visible': 'contact in view',
  'Casos': 'Cases',
  'Productos': 'Products',
  'Un solo CTA': 'One CTA',
  'por pantalla': 'per screen',
  'Bandeja única · dueño y estado por consulta': 'Single inbox · owner and status per enquiry',
  'Deja de importar por dónde entró la consulta: importa si ya se respondió.': 'It stops mattering where the enquiry came in: it matters whether it was answered.',
  'Métrica del equipo: tiempo real de primera respuesta': 'Team metric: actual time to first response',
  'Acordada antes de rediseñar nada.': 'Agreed before redesigning anything.',

  /* --- Ropofy · la espera ---------------------------------------------- */
  'El hallazgo · la espera': 'The finding · the wait',
  'EL HALLAZGO · LA ESPERA': 'THE FINDING · THE WAIT',
  '“Escribí el viernes y me contestaron el martes.': '“I wrote on Friday and they replied on Tuesday.',
  'Ya había comprado en otro lado.”': 'I had already bought elsewhere.”',
  'Viernes': 'Friday',
  // 'Llega la' encabeza dos frases distintas: el viernes llega la consulta y
  // el martes llega la respuesta. La traducción tiene que servir a las dos.
  'Llega la': 'In comes',
  'consulta': 'the enquiry',
  'Sábado': 'Saturday',
  'Silencio': 'Silence',
  'Domingo': 'Sunday',
  'Compra en otro': 'Buys somewhere',
  'lado': 'else',
  'Lunes': 'Monday',
  'Sigue el': 'Still',
  'silencio': 'silence',
  'Martes': 'Tuesday',
  'respuesta': 'the reply',
  'LO QUE EL CLIENTE LEE': 'WHAT THE CUSTOMER READS',
  'El silencio se interpreta como': 'Silence reads as indifference.',
  'desinterés. La decisión ya se tomó': 'The decision is already made',
  'antes de que respondas.': 'before you reply.',
  'LO QUE HICE CON ESO': 'WHAT I DID WITH IT',
  'Medir el tiempo real de respuesta por': 'Measure the real response time per',
  'canal y rediseñar el flujo alrededor': 'channel and rebuild the flow around',
  'del contacto, no del catálogo.': 'contact, not the catalogue.',
  'Esquema propio · basado en entrevistas a clientes': 'My own diagram · based on customer interviews',

  /* --- Ropofy · flujo de consultas -------------------------------------- */
  'Flujo de consultas · antes y después': 'Enquiry flow · before and after',
  'FLUJO DE CONSULTAS · ANTES Y DESPUÉS': 'ENQUIRY FLOW · BEFORE AND AFTER',
  'Antes: tres entradas, ningún dueño': 'Before: three inlets, no owner',
  'Sitio web': 'Website',
  'Sin bandeja': 'No inbox,',
  'ni tiempo acordado': 'no agreed time',
  'Después: una bandeja con dueño y estado': 'After: one inbox with an owner and a status',
  'Bandeja única': 'Single inbox',
  'dueño · estado · SLA': 'owner · status · SLA',
  'Respuesta': 'Response',
  'medida por canal': 'measured per channel',
};

const traducir = (s) => {
  const t = s.trim();
  if (!t) return null;
  if (IGUAL.has(t)) return s;
  if (/^[\d\s.,%+·—–-]+$/.test(t)) return s; // cifras y viñetas sueltas
  if (DICC[t] === undefined) return undefined;
  return s.replace(t, DICC[t]);
};

fs.mkdirSync(destino, { recursive: true });

const sinTraducir = [];
let escritos = 0;

for (const archivo of fs.readdirSync(raiz).filter((f) => f.endsWith('.svg'))) {
  let svg = fs.readFileSync(path.join(raiz, archivo), 'utf8');

  // aria-label del <svg>
  svg = svg.replace(/aria-label="([^"]+)"/g, (m, v) => {
    const r = traducir(v);
    if (r === undefined) { sinTraducir.push(`${archivo} · aria-label · ${v}`); return m; }
    return `aria-label="${r}"`;
  });

  // nodos de texto
  svg = svg.replace(/>([^<>]+)</g, (m, v) => {
    if (!v.trim()) return m;
    const r = traducir(v);
    if (r === undefined) { sinTraducir.push(`${archivo} · ${v.trim()}`); return m; }
    return `>${r}<`;
  });

  fs.writeFileSync(path.join(destino, archivo), svg);
  escritos++;
}

if (sinTraducir.length) {
  console.error(`\n✗ ${sinTraducir.length} texto(s) sin traducir:`);
  [...new Set(sinTraducir)].forEach((x) => console.error('  · ' + x));
  process.exit(1);
}

console.log(`✓ ${escritos} diagramas traducidos en public/assets/diag/en/`);
