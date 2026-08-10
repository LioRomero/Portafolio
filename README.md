# Portafolio UX — Emilio Romero

Sitio estático bilingüe (ES/EN) de tres páginas, construido a partir del handoff
de `design-refs/`. Astro + TypeScript, con islas de Preact solo donde hay estado.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run check    # astro check (TypeScript)
```

## Estructura

```
src/
  content/        Textos ES/EN extraídos de los .dc.html — copiados literalmente
  lib/            prefs (estado compartido), finds (notas), waltz (Web Audio)
  islands/        Preact: lo único que se hidrata
  components/     Astro: barra, contacto y las tres páginas
  pages/          Rutas ES en la raíz, EN bajo /en/
  styles/         tokens.css (todos los design tokens) + global.css
design-refs/      Referencias de diseño. No se portan ni se compilan.
assets/           Fuente original; se copia a public/assets/ para servirla.
```

## Decisiones de implementación

**Preact en vez de React.** El presupuesto es menos de 100 KB de JS comprimido.
React son ~61 KB de runtime; Preact con `compat` son ~4,4 KB con la misma
sintaxis. Todo el JS del sitio pesa hoy **44 KB gzip**, y la home carga menos.

**Sin vals sintetizado.** Se eliminó: teniendo la playlist real de Spotify, dos
fuentes de audio competían por lo mismo. El reproductor es un embed que solo se
pide cuando el visitante lo activa (tecla `P`) y vive fuera del panel, para que
cerrarlo no corte la música. Nunca hay autoplay.

**La linterna tiene una función, no es un efecto.** Revela la letra chica del
portafolio: dos fragmentos que están en el DOM desde el principio al 5% de
opacidad y solo se leen dentro del haz. El panel lleva la cuenta. Donde no hay
cursor (móvil, táctil) se muestran enteros y etiquetados, así que no hay
contenido accesible solo en escritorio.

**Las imágenes pesadas pasan por `astro:assets`.** El retrato original son
1,8 MB y va en el LCP de Sobre mí; servido en AVIF al tamaño real son 17–37 KB.

**Las clases de las islas llevan prefijo** (`pz-`, `tu-`, `cl-`…). Preact no
encapsula los `<style>`, así que un nombre genérico se filtra al resto de la
página. Los componentes `.astro` sí llevan scoping automático y no lo necesitan.

**El desorden de las fichas del puzzle es determinista** (`shuffle(n, seedFor(n))`).
Aleatorizarlo en render daría una hidratación inconsistente.

**Modo y movimiento se aplican antes del primer pintado**, con un script inline en
`BaseLayout.astro`, para que no haya parpadeo entre el valor por defecto y el
guardado por el visitante.

## Estado compartido

| Clave | Valores | Por defecto |
|---|---|---|
| `em-lang` | `es` \| `en` | por ruta |
| `em-mode` | `explorar` \| `grano` | **`grano`** |
| `em-tutorial-seen` | `1` | ausente |
| `em-canvas-notes` | JSON `Note[]` | `[]` |
| `em-found` | JSON `number[]` | `[]` |
| `em-motion` | `on` \| `off` | `on` |
| `em-intro-seen:<página>` | `1` (sessionStorage) | ausente |

Todo lo lúdico se marca con `data-playful` y se oculta con una sola regla cuando
`html[data-mode="grano"]`. **Ningún dato vive solo en modo explorar**: si algo
desaparece en "Al grano" y no está en otro sitio, es un bug.

Las notas de diseño de los casos son la excepción y no son un dato del caso: son
metacomentario, y viven detrás del **modo investigador** (tecla `R`), igual que
en la referencia.

Todos los interruptores opcionales viven en el panel curioso, incluido el modo
investigador. Antes estaba en la barra de casos: en móvil eso costaba una
segunda fila fija y mezclaba navegación con ajustes.

## Atajos

`?` panel curioso · `F` linterna · `P` playlist · `X` radiografía · `M`
movimiento · `R` modo investigador (Casos) · `←` `→` mover entre casos / pasos
del tutorial · `Esc` cerrar.

## Publicar en GitHub Pages

**Antes del primer despliegue hay que tocar dos líneas.** En `astro.config.mjs`:

```js
const SITE = 'https://TU-USUARIO.github.io';
const BASE = '/portafolio';   // el nombre del repo
```

Si el repo se llama `TU-USUARIO.github.io` (repo de usuario), el sitio vive en la
raíz y hay que poner `const BASE = undefined`. Si es un repo normal, `BASE` es
`/` + el nombre del repo. Equivocarse aquí es el fallo clásico de GitHub Pages:
la página carga pero sin estilos ni imágenes.

Actualiza también la última línea de `public/robots.txt` con la misma URL.

Todos los enlaces y assets pasan por `withBase()` (`src/lib/paths.ts`), así que
funcionan igual en la raíz que en un subdirectorio. Si añades un enlace interno
o una imagen de `public/`, envuélvelo también o se romperá en producción.

**Pasos:**

1. Sube el proyecto a un repo de GitHub, rama `main`.
2. En el repo: *Settings → Pages → Build and deployment → Source:* **GitHub Actions**.
3. Haz push. El workflow `.github/workflows/deploy.yml` compila y publica solo.
4. La URL sale en *Actions* o en *Settings → Pages*.

Cada push a `main` vuelve a publicar. No subas `dist/` ni `node_modules/`: ya
están en `.gitignore`.

## Pendientes del cliente

Decisiones ya tomadas en esta implementación:

- **Modo por defecto: "Al grano".** Un reclutador con diez minutos ve el
  portafolio completo sin capa lúdica y la activa si quiere.
- **Intro: una vez por sesión** (`sessionStorage`), no en cada carga.

Todavía sin resolver — hoy quedan los valores de los prototipos:

1. **WhatsApp** — `https://wa.me/573142543651` en `src/content/home.ts`. Confirmar.
2. **LinkedIn** — `https://www.linkedin.com/in/emilio-romero-gutierrez`. Confirmar.
3. **Playlist de Spotify** — el reproductor carga hoy una playlist editorial de
   Spotify como marcador de posición. Hay que cambiar `spotifySrc` (la URL de
   embed) y `playlistHref` en `src/content/home.ts` por la playlist real. Es el
   único pendiente que se ve en pantalla.

   El reproductor **se abre solo al terminar la intro**, y únicamente en modo
   explorar. No suena solo: ningún navegador reproduce audio sin un gesto previo
   del visitante, así que lo que se puede garantizar es dejarlo a un toque.
4. **Canvas de emociones** — ver la sección siguiente: hay tres caminos y hay
   que elegir uno.
5. ~~**PDF del CV**~~ — hecho. Los dos PDF están en `public/uploads/` y
   enlazados desde contacto. Para actualizarlos, reemplaza el archivo
   conservando el nombre; las rutas viven en `CV_PDFS` (`src/content/ui.ts`).

## El canvas: qué hace hoy y qué caminos hay

**Hoy (implementado).** El visitante elige un ánimo, escribe y pulsa *Fijar la
nota*. La nota se guarda en `localStorage` (clave `em-canvas-notes`, máximo 40)
y se pinta en el muro de esa misma persona. **Nunca sale de su navegador.** Si
cambia de equipo o borra datos, desaparece. Emilio no recibe nada.

El único camino de salida es el enlace *Enviármela por correo →*: construye un
`mailto:` con asunto y cuerpo ya escritos y abre el cliente de correo del
visitante. Solo llega si esa persona además pulsa "enviar". En GitHub Pages no
hay servidor, así que esto es lo máximo posible sin añadir un tercero.

El aviso de privacidad de la tarjeta ya lo dice tal cual, así que la promesa que
se hace en pantalla y lo que hace el código coinciden. **No hay nada roto: es
una decisión de producto, no una tarea a medias.**

Tres caminos, de menos a más trabajo:

1. **Dejarlo así.** Coherente y sin dependencias. Coste: recibes muy pocas notas
   — el `mailto:` es mucha fricción y en móvil a veces ni abre.
2. **Formspree o Tally** (~30 min). Un `fetch` al endpoint del servicio en el
   mismo `submit` que ya existe, en `src/islands/EmotionCanvas.tsx`. Las notas te
   llegan por correo o a un panel. Plan gratuito de sobra para el volumen de un
   portafolio. Funciona en GitHub Pages porque el POST sale del navegador.
   **Hay que reescribir el aviso de privacidad**: dejaría de ser cierto que la
   nota no viaja a ningún servidor.
3. **Función serverless** (Netlify/Vercel Functions). Control total del dato y
   sin terceros, pero obliga a salir de GitHub Pages, que no ejecuta backend.

Mi recomendación: **la 2 con Formspree**, y cambiar el aviso a algo como "tu
nota se guarda en tu navegador y se me envía a mí; no la comparto con nadie".
Si el portafolio existe para escuchar, conviene que las notas lleguen de verdad.

## Verificado en navegador

- `npm run check`: 0 errores de TypeScript. Las seis rutas devuelven 200 y
  compilan; 44 KB de JS gzip en todo el sitio.
- **Sin desbordamiento horizontal** en las 6 páginas × 375 / 768 / 1280 px.
- **Consola limpia** en carga y recorrido completo de la home.
- Interacciones probadas una a una: puzzle (fallo → temblor y reinicio; orden
  correcto → bloque resuelto), linterna (haz, revelado por proximidad, contador,
  velo), radiografía (oculta los insights y muestra la nota coral), modo
  investigador, reproductor de Spotify, tutorial (hoja completa en móvil),
  cambio de modo e idioma.
- El modo "Al grano" oculta los 14 bloques lúdicos y ningún dato.
- Paridad ES/EN de todos los diccionarios y los assets referenciados,
  comprobados con un script de invariantes.

### Arreglado durante la revisión

- La barra superior se partía en dos líneas por debajo de ~420 px.
- El punto de nota escondida caía a una línea propia y parecía un elemento suelto.
- Los títulos de sección iban pegados a su entradilla, sin aire.
- Una regla global de `min-height: 44px` sobre todo `button` deformaba en móvil
  los controles pequeños: los pips del tutorial salían como barras verticales y
  los puntos de nota como cápsulas. Ahora cada control táctil declara su mínimo.
- La página de Casos no tenía ningún `h1`: la jerarquía empezaba en `h2`.
- La letra chica parecía contenido roto (borde visible, texto invisible).
- La tecla `X` estaba anunciada en el panel y no hacía nada, porque la
  radiografía nunca se había implementado.
