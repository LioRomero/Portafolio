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
