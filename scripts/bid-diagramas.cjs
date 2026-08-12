/**
 * Redibuja los tres diagramas del caso BID sobre el producto real, tal como
 * aparece en el archivo de Figma: MapaInversiones (Catálogo de Contratos y
 * Gestión de Emergencias) del Gobierno de la República Dominicana.
 *
 * Los anteriores mostraban "tres oferentes lado a lado", que era la narrativa
 * vieja. El producto real es un tablero de Power BI con dos vistas: el estado
 * del catálogo de contratos y la tabla de aplicantes, donde la comparación
 * automática contrasta precio estimado contra precio ofertado.
 */
const fs = require('fs');
const dir = 'C:/Users/emili/OneDrive/Portafolio/public/assets/diag/';

const F = 'Inter, system-ui, sans-serif';
const BG = '#0C1020';
const PANEL = '#141A2E';
const HEAD = '#1B2240';
const LINE = '#232A44';
const CYAN = '#22D3EE';
const VIOLETA = '#8B7BF0';
const CORAL = '#f0466b';
const TXT = '#E9EBF4';
const MUT = '#A2A8C2';
const DIM = '#767C99';

const t = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" fill="${o.f || TXT}" font-size="${o.s || 19}" font-weight="${o.w || 400}" font-family="${F}"${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.a ? ` text-anchor="${o.a}"` : ''}>${s}</text>`;

const marco = (titulo, cuerpo, pie, fuente) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="1200" height="700" role="img" aria-label="${titulo}">
<rect width="1200" height="700" fill="${BG}"/>
${t(56, 58, titulo.toUpperCase(), { f: CYAN, s: 17, w: 500, ls: 2.4 })}
${cuerpo}
${t(80, 632, pie, { f: MUT, s: 20 })}
${t(1144, 666, fuente, { f: DIM, s: 16, a: 'end' })}
</svg>`;

/* ── 1 · La tabla de aplicantes: la comparación automática ────────────────
   Estructura real de la vista "Aplicantes" de Gestión de Emergencias:
   razón social, artículo, cantidad, precio estimado, precio ofertado y la
   diferencia que la herramienta calcula. Los oferentes van anonimizados:
   son empresas reales y no hacen falta para explicar la pantalla. */
const filas = [
  ['Oferente A', 'Artículo 1', '4 200', '318', '318', '—', 'ok'],
  ['Oferente B', 'Artículo 1', '4 200', '318', '402', '+26 %', 'mal'],
  ['Oferente C', 'Artículo 2', '1 150', '2 940', '2 940', '—', 'ok'],
  ['Oferente B', 'Artículo 3', '860', '—', '1 275', 'sin estimado', 'mal'],
  ['Oferente A', 'Artículo 4', '520', '96', '—', 'sin oferta', 'mal'],
];
const colX = [88, 250, 400, 530, 720, 910];
const enc = ['Razón social', 'Artículo', 'Cantidad', 'Precio estimado', 'Precio ofertado', 'Diferencia'];

let tabla = `<rect x="56" y="104" width="1088" height="490" rx="12" fill="${PANEL}" stroke="${LINE}" stroke-width="2"/>
<rect x="56" y="104" width="1088" height="72" rx="12" fill="${HEAD}" stroke="${LINE}" stroke-width="2"/>
${t(80, 148, 'Aplicantes · comparación automática', { s: 23, w: 500 })}
${t(1120, 148, 'filtro: bienes · obras · servicios', { f: DIM, a: 'end' })}`;
enc.forEach((e, i) => {
  tabla += t(colX[i], 214, e, { f: CYAN, s: 17, w: 500, ls: 1 });
});
tabla += `<line x1="80" y1="236" x2="1120" y2="236" stroke="${LINE}" stroke-width="1.5"/>`;
filas.forEach((f, i) => {
  const y = 276 + i * 60;
  const mal = f[6] === 'mal';
  if (mal) tabla += `<rect x="80" y="${y - 26}" width="1040" height="46" rx="7" fill="${CORAL}" opacity="0.09"/>`;
  for (let c = 0; c < 5; c++) tabla += t(colX[c], y, f[c], { f: c === 0 ? TXT : MUT, s: 18 });
  tabla += t(colX[5], y, f[5], { f: mal ? CORAL : DIM, s: 18, w: mal ? 500 : 400 });
  if (mal) tabla += `<circle cx="1104" cy="${y - 6}" r="7" fill="${CORAL}"/>`;
  tabla += `<line x1="80" y1="${y + 22}" x2="1120" y2="${y + 22}" stroke="${LINE}" stroke-width="1.5"/>`;
});
tabla += t(80, 566, '3 de 5 líneas señaladas: sobreprecio, dato faltante y producto sin oferta.', { f: DIM, s: 17 });

fs.writeFileSync(
  dir + 'bid-comparacion.svg',
  marco(
    'Tabla de aplicantes · precio estimado contra precio ofertado',
    tabla,
    'La herramienta calcula la diferencia y marca la línea: se revisa lo señalado, no todo.',
    'Esquema propio sobre el producto real · oferentes anonimizados'
  )
);

/* ── 2 · El tablero del catálogo de contratos ─────────────────────────────
   Cifras reales del producto: 311 de 622 contratos con información faltante,
   311 de 622 con inconsistencias documentales, y la distribución por tipo. */
const medidor = (x, titulo, valor, tope) => {
  const cx = x + 210;
  const cy = 396;
  const r = 82;
  const frac = valor / tope;
  const ang = Math.PI * (1 - frac);
  const ex = cx + r * Math.cos(ang);
  const ey = cy - r * Math.sin(ang);
  return `<rect x="${x}" y="228" width="420" height="212" rx="10" fill="${HEAD}" stroke="${LINE}" stroke-width="2"/>
${t(x + 24, 262, titulo, { f: MUT, s: 17 })}
<path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="${LINE}" stroke-width="20" stroke-linecap="round"/>
<path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="${CORAL}" stroke-width="20" stroke-linecap="round"/>
${t(cx, cy - 14, String(valor), { s: 40, w: 600, a: 'middle' })}
${t(cx - r, cy + 26, '0', { f: DIM, s: 15, a: 'middle' })}
${t(cx + r, cy + 26, String(tope), { f: DIM, s: 15, a: 'middle' })}`;
};

const tipos = [['Bienes', 229], ['Obras', 61], ['Servicios', 20]];
let barras = `<rect x="56" y="462" width="420" height="132" rx="10" fill="${HEAD}" stroke="${LINE}" stroke-width="2"/>
${t(80, 494, 'Distribución de contratos por tipo', { f: MUT, s: 17 })}`;
tipos.forEach(([n, v], i) => {
  const y = 520 + i * 26;
  const w = (v / 229) * 226;
  barras += t(80, y + 12, n, { f: DIM, s: 15 });
  barras += `<rect x="176" y="${y}" width="${w.toFixed(0)}" height="17" rx="3" fill="${VIOLETA}" opacity="${1 - i * 0.22}"/>`;
  barras += t(176 + w + 10, y + 13, String(v), { f: MUT, s: 14 });
});

const estados = ['Activo', 'Cerrado', 'En edición', 'Modificado', 'Rescindido'];
let filtros = '';
estados.forEach((e, i) => {
  const x = 56 + i * 218;
  filtros += `<rect x="${x}" y="160" width="202" height="42" rx="7" fill="${HEAD}" stroke="${i === 4 ? CYAN : LINE}" stroke-width="2"/>`;
  filtros += t(x + 101, 187, e, { f: i === 4 ? CYAN : DIM, s: 16, a: 'middle' });
});

const tablero = `${t(56, 132, 'MapaInversiones · Catálogo de Contratos — Estado del contrato', { s: 22, w: 500 })}
${filtros}
${medidor(56, 'Contratos con información faltante', 311, 622)}
${medidor(504, 'Contratos con inconsistencias en documentos', 311, 622)}
${barras}
<rect x="504" y="462" width="640" height="132" rx="10" fill="${HEAD}" stroke="${LINE}" stroke-width="2"/>
${t(528, 494, 'Distribución por región · valor contratado', { f: MUT, s: 17 })}
${[['Distrito Nacional', 1], ['Santiago', 0.18], ['Sto. Domingo Este', 0.1], ['Sto. Domingo Oeste', 0.08]]
  .map(([n, f], i) => {
    const y = 516 + i * 20;
    return t(528, y + 11, n, { f: DIM, s: 14 }) + `<rect x="716" y="${y}" width="${(f * 380).toFixed(0)}" height="13" rx="3" fill="${CYAN}" opacity="${1 - i * 0.18}"/>`;
  })
  .join('')}`;

fs.writeFileSync(
  dir + 'bid-detalle.svg',
  marco(
    'Tablero del catálogo de contratos',
    tablero,
    'La mitad del catálogo: 311 de 622 contratos con información faltante o inconsistencias.',
    'Cifras del producto · Gobierno de la República Dominicana'
  )
);

/* ── 3 · El flujo, corregido ──────────────────────────────────────────────
   El anterior decía "buscar → comparar → sustentar", que omitía la
   digitalización. El real arranca en el documento en papel. */
const pasos = [
  ['Documentos', 'de la licitación,\ncomo se publican', VIOLETA],
  ['Digitalización', 'Power BI + IA\nlos vuelven datos', VIOLETA],
  ['Comparación', 'lo solicitado contra\nlo ofertado', CYAN],
  ['Inconsistencia', 'precio, dato faltante\no producto', CORAL],
  ['Decisión', 'la firma sigue\nsiendo humana', CYAN],
];
let flujo = '';
pasos.forEach(([n, d, c], i) => {
  const x = 56 + i * 222;
  flujo += `<rect x="${x}" y="230" width="188" height="188" rx="12" fill="${PANEL}" stroke="${c}" stroke-width="2"/>`;
  flujo += `<circle cx="${x + 30}" cy="${262}" r="15" fill="${c}" opacity="0.18"/>`;
  flujo += t(x + 30, 268, String(i + 1), { f: c, s: 16, w: 600, a: 'middle' });
  flujo += t(x + 20, 320, n, { s: 20, w: 500 });
  d.split('\n').forEach((l, j) => {
    flujo += t(x + 20, 354 + j * 24, l, { f: MUT, s: 16 });
  });
  if (i < 4) {
    flujo += `<path d="M ${x + 196} 324 L ${x + 214} 324" stroke="${DIM}" stroke-width="2"/><path d="M ${x + 208} 318 L ${x + 216} 324 L ${x + 208} 330 z" fill="${DIM}"/>`;
  }
});
flujo += `<rect x="56" y="462" width="1088" height="86" rx="10" fill="${HEAD}" stroke="${LINE}" stroke-width="2"/>
${t(80, 498, 'Lo que cambia el trabajo: el paso 4 lo hace la herramienta.', { s: 19, w: 500 })}
${t(80, 528, 'Antes, encontrar la inconsistencia era leer los documentos completos, uno por uno.', { f: MUT, s: 17 })}`;

fs.writeFileSync(
  dir + 'bid-flujo.svg',
  marco(
    'Del documento publicado a la decisión',
    flujo,
    'La herramienta señala dónde mirar. Adjudicar sigue siendo humano, y por eso auditable.',
    'Esquema propio · TechSprint BID 2024'
  )
);

for (const f of ['bid-comparacion', 'bid-detalle', 'bid-flujo']) {
  console.log(f + '.svg', Math.round(fs.statSync(dir + f + '.svg').size / 1024 * 10) / 10 + ' KB');
}
