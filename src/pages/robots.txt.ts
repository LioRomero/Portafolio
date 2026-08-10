import type { APIRoute } from 'astro';

/**
 * `robots.txt` generado, no escrito a mano: la URL del sitemap tiene que
 * coincidir siempre con `site` + `base`, y en GitHub Pages esos valores se
 * deducen del repo en tiempo de compilación.
 */
export const GET: APIRoute = ({ site }) => {
  /* BASE_URL llega como `/portafolio` o `/`: normalizar la barra final o la
     URL sale pegada ("/portafoliositemap-index.xml"). */
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const sitemap = new URL(`${base}sitemap-index.xml`, site).href;

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
