// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// ES es el idioma por defecto y vive en la raíz; EN vive bajo /en/.
// Preact con `compat`: sintaxis React, ~5 KB gzip de runtime en vez de ~61.
// ─── Dominio y subdirectorio ────────────────────────────────────────────────
// No hay nada que editar para publicar en GitHub Pages: Actions expone el repo
// en `GITHUB_REPOSITORY` ("usuario/repo") y de ahí se deducen `site` y `base`.
// Esto evita el fallo clásico de Pages —la página carga sin estilos porque el
// subdirectorio está mal— y hace que el mismo código sirva para un repo de
// usuario (raíz) o de proyecto (subdirectorio).
//
// ¿Dominio propio más adelante? Pon aquí la URL y borra `base`:
//   const SITE = 'https://emilioromero.com'; const BASE = undefined;
const [OWNER, REPO] = (process.env.GITHUB_REPOSITORY ?? '').split('/');

const SITE = OWNER ? `https://${OWNER}.github.io` : 'http://localhost:4321';
// Un repo llamado `usuario.github.io` se sirve en la raíz; el resto, en /repo.
const BASE = OWNER && REPO !== `${OWNER}.github.io` ? `/${REPO}` : undefined;
// ────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  site: SITE,
  base: BASE,
  integrations: [
    preact({ compat: true }),
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-CO', en: 'en' } },
      filter: (page) => !page.includes('/404'),
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // El presupuesto es <100 KB de JS comprimido en la carga inicial.
      chunkSizeWarningLimit: 120,
    },
  },
});
