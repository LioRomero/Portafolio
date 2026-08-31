/**
 * Genera `public/og.jpg`, la tarjeta que se ve al compartir el enlace en
 * LinkedIn, WhatsApp o Slack.
 *
 * El posicionamiento va pintado dentro de la imagen, así que este archivo hay
 * que volver a correrlo cada vez que cambie: `node scripts/og.cjs`.
 *
 * El texto se compone en SVG desde un archivo (no desde la línea de comandos)
 * porque al pasarlo por el shell se perdían los acentos y salía "BOGOTA".
 */
const sharp = require('sharp');
const raiz = __dirname + '/../';
const W = 1200;
const H = 630;
const RETRATO = 430; // ancho de la columna del retrato, a la derecha

const tipo = 'Segoe UI, Inter, Helvetica, Arial, sans-serif';

// Fondo de marca con el halo violeta de la intro
const fondo = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <radialGradient id="halo" cx="0.18" cy="0.28" r="0.75">
         <stop offset="0" stop-color="#8B7BF0" stop-opacity="0.26"/>
         <stop offset="1" stop-color="#8B7BF0" stop-opacity="0"/>
       </radialGradient>
     </defs>
     <rect width="${W}" height="${H}" fill="#080B16"/>
     <rect width="${W}" height="${H}" fill="url(#halo)"/>
   </svg>`,
  'utf8'
);

// El retrato se funde hacia la izquierda para que no corte en seco
const desvanecido = Buffer.from(
  `<svg width="${RETRATO}" height="${H}" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="f" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0" stop-color="#000" stop-opacity="0"/>
         <stop offset="0.42" stop-color="#000" stop-opacity="0.75"/>
         <stop offset="1" stop-color="#000" stop-opacity="1"/>
       </linearGradient>
     </defs>
     <rect width="${RETRATO}" height="${H}" fill="url(#f)"/>
   </svg>`,
  'utf8'
);

const texto = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
     <circle cx="86" cy="152" r="8" fill="#22D3EE"/>
     <text x="110" y="160" font-family="${tipo}" font-size="22" fill="#22D3EE" letter-spacing="3.2">BOGOTÁ · REMOTO GLOBAL</text>
     <text x="82" y="296" font-family="${tipo}" font-size="82" font-weight="600" fill="#E9EBF4" letter-spacing="-2.2">Emilio Romero</text>
     <text x="82" y="352" font-family="${tipo}" font-size="31" fill="#A2A8C2">Service Designer · UX Research</text>
     <text x="82" y="394" font-family="${tipo}" font-size="31" fill="#A2A8C2">&amp; Diseño de Negocio</text>
     <rect x="82" y="446" width="110" height="2" fill="#3A4468"/>
     <text x="82" y="504" font-family="${tipo}" font-size="25" fill="#767C99">Antes de la pantalla, hay alguien pensando.</text>
   </svg>`,
  'utf8'
);

(async () => {
  const retrato = await sharp(raiz + 'src/images/perfil-emilio.jpg')
    .resize(RETRATO, H, { fit: 'cover', position: 'top' })
    .modulate({ brightness: 0.94 })
    .composite([{ input: desvanecido, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const info = await sharp(fondo)
    .composite([
      { input: retrato, top: 0, left: W - RETRATO },
      { input: texto, top: 0, left: 0 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(raiz + 'public/og.jpg');

  console.log('og.jpg:', Math.round(info.size / 1024) + ' KB', info.width + 'x' + info.height);
})().catch((e) => console.log('ERROR', e.message));
