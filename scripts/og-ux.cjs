/**
 * Genera `public/og-ux.jpg`, la tarjeta del perfil UX (/ux/) al compartir el
 * enlace en LinkedIn, WhatsApp o Slack. Va en la paleta clara del diseño v3.
 *
 * El posicionamiento va pintado dentro de la imagen: si cambia, hay que volver
 * a correrlo (`node scripts/og-ux.cjs`). La serif es Georgia porque el SVG se
 * rasteriza con las fuentes del sistema, no con las del sitio.
 */
const sharp = require('sharp');
const raiz = __dirname + '/../';
const W = 1200;
const H = 630;
const RETRATO = 470; // ancho de la columna del retrato, a la derecha

const sans = 'Segoe UI, Inter, Helvetica, Arial, sans-serif';
const serif = 'Georgia, Times New Roman, serif';

const fondo = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
     <rect width="${W}" height="${H}" fill="#F7F5F0"/>
   </svg>`,
  'utf8'
);

// El retrato se funde hacia la izquierda, sobre el papel
const desvanecido = Buffer.from(
  `<svg width="${RETRATO}" height="${H}" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="f" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0" stop-color="#000" stop-opacity="0"/>
         <stop offset="0.38" stop-color="#000" stop-opacity="0.8"/>
         <stop offset="1" stop-color="#000" stop-opacity="1"/>
       </linearGradient>
     </defs>
     <rect width="${RETRATO}" height="${H}" fill="url(#f)"/>
   </svg>`,
  'utf8'
);

const texto = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
     <text x="80" y="150" font-family="${sans}" font-size="21" font-weight="600" fill="#4A4F5C" letter-spacing="3">UX DESIGNER · BOGOTÁ, REMOTO</text>
     <text x="78" y="262" font-family="${serif}" font-size="86" fill="#16181D" letter-spacing="-1.5">Emilio Romero</text>
     <text x="82" y="318" font-family="${sans}" font-size="28" fill="#33363F">Investigación, estrategia y consultoría</text>
     <rect x="82" y="372" width="120" height="2" fill="#16181D"/>
     <text x="82" y="440" font-family="${serif}" font-size="34" fill="#16181D">Antes de la pantalla, hay una persona</text>
     <text x="82" y="488" font-family="${serif}" font-size="34" fill="#16181D"><tspan fill="#6A4FD0">pensando</tspan> y <tspan fill="#B4460C">sintiendo</tspan> algo.</text>
   </svg>`,
  'utf8'
);

(async () => {
  const retrato = await sharp(raiz + 'src/images/perfil-emilio.jpg')
    .resize(RETRATO, H, { fit: 'cover', position: 'top' })
    .composite([{ input: desvanecido, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const info = await sharp(fondo)
    .composite([
      { input: retrato, top: 0, left: W - RETRATO },
      { input: texto, top: 0, left: 0 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(raiz + 'public/og-ux.jpg');

  console.log('og-ux.jpg:', Math.round(info.size / 1024) + ' KB', info.width + 'x' + info.height);
})().catch((e) => console.log('ERROR', e.message));
