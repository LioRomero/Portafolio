/**
 * Prefijo de despliegue.
 *
 * En GitHub Pages un repo de proyecto se sirve desde un subdirectorio
 * (`usuario.github.io/portafolio/`), así que ninguna ruta absoluta escrita a
 * mano funciona tal cual. Astro expone ese prefijo en `BASE_URL`; todo enlace
 * interno y todo asset de `public/` pasa por aquí.
 *
 * Con `base` sin configurar, `BASE_URL` es `/` y esto no cambia nada.
 */
const BASE = import.meta.env.BASE_URL;
const PREFIX = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;

export const withBase = (path: string): string => PREFIX + path;

/**
 * Ruta de un diagrama según el idioma, con el prefijo de despliegue puesto.
 *
 * Los diagramas llevan su texto dentro del SVG, así que hay una versión por
 * idioma: la española en `assets/diag/` y la inglesa, con el mismo nombre de
 * archivo, en `assets/diag/en/`. Las genera `scripts/diagramas-en.cjs`.
 *
 * La ruta se deriva en vez de duplicarla en el contenido: así un diagrama
 * nuevo no puede quedarse a medias por olvidar la segunda ruta, y si falta el
 * archivo inglés se nota como imagen rota en vez de colarse en español.
 */
export const diagrama = (path: string, lang: string): string =>
  withBase(lang === 'en' ? path.replace('/assets/diag/', '/assets/diag/en/') : path);
