# NeuroInsight · Proyecto web

Estado (26 de octubre de 2026): **etapa 4 construida, en revisión.** La página nueva está en `index.html`. El manual de marca (aprobado con los retratos del equipo) está en `manual-de-marca.html`.

## Cómo verla

Con la vista previa del proyecto (`.claude/launch.json` levanta un servidor en el puerto 4173) o con cualquier servidor estático en esta carpeta. Abrir `index.html` con doble clic también funciona, pero el video y algunas fuentes pueden no cargar desde `file://`.

## Qué hay en la carpeta

| Archivo | Qué es |
|---|---|
| `index.html` | La página. Se genera desde una plantilla (ver "Cómo editar") |
| `css/tokens.css` | Colores, letras, formas y movimiento. Lo comparten la página y el manual |
| `css/site.css`, `js/main.js` | Estilos y comportamiento de la página. Cada sección tiene su bloque |
| `manual-de-marca.html`, `css/manual.css`, `js/manual.js` | Manual de marca |
| `img/` | Logo en vector, favicon, cerebros, retratos del equipo (`img/equipo/`), actividades, testimonios, imágenes para compartir (`og-imagen.jpg`, `og-manual.jpg`) |
| `video/` | Video de fondo de la sección de organizaciones y video para redes |
| `fonts/`, `vendor/` | Tipografías y librerías (GSAP 3.13.0 con ScrollTrigger y SplitText; Lenis 1.3.11) |
| `estructura.md` | La estructura aprobada en la etapa 3 (antes del cambio a 60/40) |
| `materiales/` | Contenido extraído del sitio actual, fotos originales, imágenes generadas y referencias |

## Estructura final (60 % organizaciones, 40 % familias)

| # | Sección | Botón | Lleva a |
|---|---|---|---|
| 1 | Portada | Solicitar propuesta / Soy familia: solicitar cita | Formulario / WhatsApp |
| 2 | Cifras | | |
| 3 | Organizaciones: Empresas y Centros educativos (con video de fondo) | Solicitar propuesta para empresa / centro educativo | Formulario con el tipo ya marcado |
| 4 | Actividades (9 fotos reales) | | |
| 5 | Cómo trabajamos (4 pasos) | | |
| 6 | Formulario de propuesta | Enviar por WhatsApp / Prefiero enviarlo por correo | WhatsApp o correo con el mensaje armado |
| 7 | Familias: señales y Salud familiar, Coaching, Mentoría | Solicitar cita / Consultar por WhatsApp | WhatsApp con su mensaje |
| 8 | Conozca a Adriana | Solicitar cita con Adriana | WhatsApp |
| 9 | Equipo | | |
| 10 | Testimonios (con consentimiento) | | |
| 11 | Recursos: 17 artículos en pestañas | Cada artículo | Sitio actual |
| 12 | Preguntas frecuentes | Preguntar por WhatsApp | WhatsApp |
| 13 | Cierre, contacto y pie | Solicitar propuesta / Solicitar cita por WhatsApp | Formulario / WhatsApp |

Barra fija en celular: "Solicitar propuesta" y un botón de chat para familias. Se esconde en el formulario y en el cierre.

### Mensajes de WhatsApp (número +506 7102 4989)

| Botón | Mensaje |
|---|---|
| Portada, menú y barra del celular (familias) | Hola NeuroInsight, quisiera solicitar una cita para mi familia. |
| Salud familiar | Hola NeuroInsight, quisiera solicitar una cita de Salud familiar (evaluación y acompañamiento). |
| Coaching | Hola NeuroInsight, me interesa el coaching para profesionales. |
| Mentoría | Hola NeuroInsight, me interesa la mentoría para estudiantes. |
| Adriana | Hola NeuroInsight, quisiera una cita con la M.Sc. Adriana Córdoba. |
| Preguntas | Hola NeuroInsight, tengo una duda antes de agendar. |
| Cierre | Hola NeuroInsight, quisiera solicitar una cita. ¿Qué horarios tienen disponibles? |
| Formulario de organizaciones | "Hola NeuroInsight, quisiera solicitar una propuesta para mi organización." y debajo, renglón por renglón, solo lo que la persona llenó: nombre, organización, cargo, tipo, interés, personas a impactar y mensaje |

El formulario pide como obligatorios nombre, organización y tipo. "Prefiero enviarlo por correo" abre el correo a info@neuroinsightcr.com con el asunto "Solicitud de propuesta: [organización]" y el mismo texto.

## Cómo editar

- **Textos y secciones:** la página se genera desde `fuente/index.tpl.html` con `node fuente/build-index.mjs 20261026f` (el número es la versión para el caché), que inserta el logo vectorial y codifica los mensajes de WhatsApp. El manual igual, con `fuente/manual.tpl.html` y `node fuente/build-manual.mjs`. Si prefieres editar `index.html` directamente, cada sección está marcada con `<!-- ===== INICIO … ===== -->` y `<!-- ===== FIN … ===== -->`.
- **Un mensaje de WhatsApp:** busca `wa.me/50671024989?text=` y cambia el texto (va codificado: un espacio es `%20`).
- **Colores, letras o tiempos de movimiento:** `css/tokens.css` y el objeto `M` al inicio de `js/main.js`.
- **Después de cambiar CSS o JS:** sube el número `?v=` en `index.html` para que el hosting no muestre la versión vieja.

## Dirección de arte: "Dos hemisferios, una red"

El logo es un cerebro en dos azules que se unen al centro. Azul noche = ciencia y evidencia; azul Insight = empatía y cercanía.

**De las referencias se toma:** el objeto protagonista (cerebro en 3D) delante de una palabra gigante repetida que se desvanece (ref. 1 y 8); la mezcla de geométrica firme con cursiva con serifa (ref. 3 y 9); secciones profundas en azul oscuro con una imagen de luz (ref. 6 y 10); listas con viñetas propias (ref. 6); retratos con monograma, nombre en cursiva y cargo en etiqueta (ref. 11).
**No se toma:** el dorado y café de la ref. 6, el oscuro en toda la página, el collage con flores y pájaros, el humo, sus textos y fotos.

### Color

| Rol | HEX | Uso | Contraste |
|---|---|---|---|
| `--ink` azul noche | `#021E4B` | Texto, títulos, secciones oscuras | 14.48 sobre niebla |
| `--brand` azul Insight | `#1D78C9` | Botones, nodos, trazos | Blanco encima: 4.58 (pasa) |
| `--brand-press` | `#1765AB` | Hover del botón | Blanco encima: 6.02 |
| `--brand-text` | `#1A6CB5` | Texto pequeño azul sobre fondo claro | 4.84 sobre niebla. El `#1D78C9` como texto da 4.08 y no pasa |
| `--brand-on-dark` azul cielo | `#8EC0F0` | Texto y nodos sobre azul noche | 8.49. El `#1D78C9` sobre azul noche da 3.55 y no pasa |
| `--bg` niebla | `#EEF2F7` | Fondo general | |
| `--brand-soft` | `#DCE9F7` | Fondos de íconos, letras gigantes | |
| `--muted` pizarra | `#4A5B78` | Textos de apoyo | 6.11 sobre niebla |
| `--on-dark-muted` | `#B9C6DA` | Párrafos sobre azul noche | 9.42 |

### Letras
- **Montserrat** 500 a 700 (variable): títulos, botones y etiquetas con espaciado `.32em`.
- **Instrument Serif** cursiva: la palabra "comprensión" en la portada, "Adriana" en su título, los nombres de los retratos y las comillas de los testimonios.
- **DM Sans** 400 a 500: párrafos.

### Forma
Radios 36 / 26 / 16 / 10 px y botones en píldora. Trazo de circuito de 2.5 px con remates redondos. Nodo de 9 px. Sombra larga teñida de azul noche.

### Movimiento
- **Se siente:** cálido, preciso y sereno.
- **Tokens:** `M = { ease: 'power3.out', easeIO: 'power3.inOut', pop: 'back.out(1.4)', dur: 1, stagger: 0.085, dist: 26, lerp: 0.085 }`. CSS: `--ease: cubic-bezier(.25,1,.5,1)`, `--ease-io: cubic-bezier(.76,0,.24,1)`, `--ease-pop: cubic-bezier(.34,1.4,.64,1)`, `--dur: 1s`, `--dist: 26px`, `--t-hover: .45s`.
- **Firma (unos 2.6 s, dentro de la portada):** INSIGHT sube en cascada; los dos hemisferios entran desde lados opuestos y se unen; un anillo sale del centro; el titular sube por renglones; aparecen la etiqueta y el sello; un circuito con quiebre a 45° se dibuja hasta "Solicitar propuesta", que se ilumina.
- **Por sección:** paneles de Empresas y Centros educativos que se encuentran como hemisferios; fotos que se abren de abajo hacia arriba; línea de pasos que avanza con el scroll; nodos de las señales que se encienden al pasar; contadores; circuitos de las tarjetas que se dibujan; el símbolo se dibuja en el cierre.
- **No hará:** rebotes en textos, cursor personalizado, marquesinas, scroll horizontal anclado.
- Con "Reducir movimiento" o sin JavaScript todo se ve completo y quieto.

## Por validar (lo que decidí yo)

1. **Logo en vector:** redibujado automáticamente desde el PNG. Conviene pedir el original a quien lo diseñó.
2. **Paleta solo con los dos azules del logo.** El rosa y el azul del sitio actual vienen de la plantilla del constructor.
3. **Tipografías:** Montserrat, Instrument Serif y DM Sans.
4. **Imágenes del cerebro y fondos de retratos generados con IA** (Gemini Nano Banana Pro). Las personas son reales.
5. **"Comprender para acompañar."** como sello y lema.
6. **Trato de usted** en toda la página, los mensajes y el manual: lo más natural en Costa Rica y más serio frente a empresas.
7. **Dos acciones principales** por el 60/40: "Solicitar propuesta" (organizaciones, botón principal) y "Solicitar cita" (familias, WhatsApp directo).
8. **Los 4 pasos de "Cómo trabajamos"** los escribí con lo que me contaron (presencial con acompañamiento digital). Confirmar con Adriana.
9. **"En sus instalaciones o en nuestro espacio en Cartago"**: lo deduje de las fotos de talleres en empresas e instituciones. Confirmar.
10. **Sección "¿Le suena?":** escrita con los temas de sus propios artículos.
11. **Fotos de actividades:** sin nombrar a las empresas ni instituciones que aparecen (Electrotécnica, una municipalidad). Si tienen permiso, se pueden nombrar en los pies de foto.
12. **Foto de Adriana:** trae la marca de agua de Gemini; la recorté. Si es retocada con IA, conviene una sesión real.
13. **Retratos del equipo:** fondos asignados según la ropa (Adriana 1, Allan 3, Jennifer 2, Lindsay 4) y cargos de la página de equipo.
14. **Testimonios:** publicados con el consentimiento confirmado el 26 de octubre de 2026. La foto de Ana R. incluye a sus hijos.
15. **"5 instrumentos clínicos certificados"** en las cifras: cuenta las certificaciones de Adriana (ADOS-2, ADI-R, WISC-V, WPPSI y WAIS).

## Pendientes

- **[FECHA DE CORTE]** de las cifras 150+ casos y 100+ evaluaciones (va marcada en amarillo en la página).
- **Artículos:** los enlaces de Recursos apuntan al sitio actual. Si la página nueva reemplaza al sitio en Hostinger, hay que migrar los 17 artículos o se romperán los enlaces.
- **Aviso de privacidad:** el formulario no guarda datos (solo abre WhatsApp o el correo), pero conviene tener uno publicado.
- **Publicar sin `noindex`.** El sitio actual le pide a Google que no lo muestre.
- Texto de la **visión**, si lo quieren usar.

## Herramientas usadas

- FireCrawl: extracción de las 6 páginas, mapa del sitio, marca y búsqueda pública.
- Gemini Nano Banana Pro (vía Higgsfield): dos cerebros, cuatro fondos de retratos y recortes de fondo (unos 17 créditos).
- Remotion e HyperFrames: videos (ver abajo).
- potrace + sharp: logo a vector, fotos a WebP, favicon e imagen para compartir (capturada con Chrome sin ventana).
- Revisión con Chrome sin ventana a 375 x 812 y 1440 x 900, con "Reducir movimiento" y sin JavaScript.

## Videos

| Archivo | Qué es | Hecho con |
|---|---|---|
| `video/circuito-720.mp4` (292 KB) y `circuito-poster.webp` | Fondo de 8 s en bucle perfecto, 1280 x 720, para la sección de organizaciones | Remotion 4.0.539 |
| `video/circuito-vertical-720x1280.mp4` y su portada | La misma red en vertical, por si se usa en redes o en celular | Remotion 4.0.539 |
| `video/intro-redes-9x16.mp4` (991 KB) y `intro-redes-poster.webp` | Intro de 7 s para historias y reels, 1080 x 1920: el símbolo se dibuja, crecen circuitos, aparece "Comprender para acompañar." y cierra con el logo | HyperFrames 0.8.206 |

Los proyectos para volver a generarlos están en `fuente/video/` (sin `node_modules`; se instalan con `npm install`):
- `remotion-circuito/`: `npx remotion render src/index.ts Circuito out/circuito-720.mp4 --codec=h264 --crf=21 --x264-preset=slow --muted --pixel-format=yuv420p`.
- `hf-intro/`: `npm run render`. HyperFrames necesita ffmpeg: aquí se usó `ffmpeg-static` con las variables `HYPERFRAMES_FFMPEG_PATH` y `HYPERFRAMES_FFPROBE_PATH`. El ffprobe de ese paquete corre con Rosetta en Mac con chip Apple.
- El intro empieza con medio segundo de azul liso mientras arranca el trazo; si se quiere algo visible desde el primer cuadro, se adelantan los tiempos en `src/intro.template.html`.

## Blog (5 artículos)

Dirección: `blog/` (índice) y `blog/<artículo>/` (cada artículo). Está en el menú, en el pie y como tira de portadas en Recursos.

| Artículo | Público | Palabra clave | Botón principal |
|---|---|---|---|
| Neurodivergencia en el trabajo | Empresas | neurodivergencia en el trabajo | Solicitar propuesta (formulario, tipo Empresa) |
| Ajustes razonables en el trabajo | Empresas | ajustes razonables en el trabajo | Solicitar propuesta (Empresa) |
| Escuelas neuroincluyentes | Escuelas | escuelas neuroincluyentes | Solicitar propuesta (Centro educativo) |
| Señales tempranas de TEA y TDAH | Familias | señales de TEA y TDAH | Solicitar cita por WhatsApp |
| Camuflaje y burnout autista | Neurodivergencia | burnout autista | Solicitar cita por WhatsApp |

Tres de empresas y escuelas, dos de familias: la misma proporción 60/40 del sitio. Cada artículo tiene título SEO de 51 a 56 caracteres, descripción de 128 a 153, un solo H1, resumen al inicio, índice, un llamado a mitad del texto, preguntas frecuentes, llamado final, botones para compartir, "Siga leyendo" y datos para Google (BlogPosting, migas y preguntas frecuentes). El botón de propuesta abre la página principal con `?tipo=…` y deja marcado el tipo en el formulario.

**Portadas:** collage editorial inspirado en la referencia 12, con la marca: recortes en semitono hechos con Gemini (`materiales/generadas/blog/`), papel rasgado, trazos de circuito que terminan en nodos, Instrument Serif con cursiva azul, etiquetas tipo recorte y el logo. Cada artículo tiene portada 4:5 (`img/blog/<slug>-portada-720/1080.webp`, sirve también para Instagram) y versión ancha 1200 x 630 para compartir (`<slug>-og.jpg`).

**Cómo editar:**
- Los textos están en `fuente/blog/articulos.mjs`. Después de cambiarlos: `node fuente/build-blog.mjs <versión> && node fuente/build-index.mjs <versión>` (la versión nueva obliga a los navegadores a cargar el CSS y JS actualizados).
- Para rehacer las portadas: `SHARP_PATH=<ruta a sharp> node fuente/blog/portadas.mjs [slug]` (necesita Google Chrome).
- **Artículos nuevos desde el Estudio editorial:** viven en `fuente/blog/articulos-estudio.json` (no se editan a mano). El Estudio agrega o actualiza el artículo ahí, corre `build-blog.mjs` y `build-index.mjs` con la misma versión y abre un PR con las páginas generadas. `articulos.mjs` los pone primero, del más reciente al más antiguo.
- Un artículo sin portada propia usa la genérica (`img/blog/generica-*`, campo `imagen: "generica"`). Para rehacerla: `SHARP_PATH=<ruta a sharp> node fuente/blog/portada-generica.mjs`. Para darle portada propia, se agrega su diseño en `portadas.mjs`, se generan sus imágenes y se quita el campo `imagen`.
- Animaciones del blog en `js/blog.js`; estilos en `css/blog.css`.

**SEO técnico agregado:** `sitemap.xml`, `robots.txt` y redirecciones 301 de las direcciones viejas de estos 5 artículos a las nuevas (`_redirects` para Netlify y `.htaccess` para Hostinger), para no perder lo que ya tenían en Google.

**Por validar (blog):**
- Elegí estos 5 por público y por búsquedas: los 3 de empresas y escuelas más prácticos, y los 2 de familias con más interés de búsqueda.
- Los textos se reescribieron sin agregar datos ni cifras nuevas. Conviene que Adriana los revise; con su visto bueno se puede agregar "Revisado por M.Sc. Adriana Córdoba", que ayuda en Google en temas de salud.
- La autoría aparece como "Equipo NeuroInsight". Las fechas de publicación son las originales.
- En "Señales tempranas" mencioné ADOS-2, ADI-R y las escalas Wechsler como instrumentos que usan (salen de sus certificaciones).
- Agregué un tono de papel cálido (`#F1EDE4`) solo para las portadas tipo cuaderno, como en la referencia.

**Pendiente:** los otros 12 artículos siguen enlazando al sitio actual desde Recursos. Si la página nueva reemplaza la de Hostinger, hay que pasarlos al blog o quitarlos de la lista.

## Publicación en Vercel

- Proyecto `neuroinsight-web` en el equipo Ingeniak de Vercel, conectado al repositorio `riklanderos/Neuroinsight_web` (rama `main`).
- Dirección temporal: https://neuroinsight-web.vercel.app
- Cada cambio que se sube a `main` se publica solo, en unos segundos.
- `vercel.json` (lo genera `fuente/build-blog.mjs`) lleva las redirecciones 301 de los artículos viejos. `.vercelignore` evita que se publiquen `materiales/`, `fuente/` y este LEEME.
- Pendiente: conectar el dominio `neuroinsightcr.com` en Vercel (Settings → Domains) y cambiar los DNS donde está registrado. Mientras tanto, las etiquetas canónicas apuntan al dominio final.

## Vista previa al compartir

Es lo que aparece al pegar el enlace en WhatsApp, Facebook, LinkedIn o X (etiquetas Open Graph: los datos que leen las redes para armar la tarjeta).

- **Página principal:** `img/og-imagen.jpg` (1200 x 630). Collage sobre azul noche con Adriana (lo humano) y el cerebro de dos tonos (la ciencia), papel rasgado, trazo de circuito con nodos, el lema "Comprender para acompañar", la etiqueta "Empresas, escuelas y familias" y los tres servicios.
- **Manual de marca:** `img/og-manual.jpg`, la misma composición con "Manual de marca" y sus apartados.
- **Blog:** cada artículo usa su `<slug>-og.jpg`.
- Para rehacer las dos primeras: `SHARP_PATH=<ruta a sharp> node fuente/compartir.mjs` (necesita Google Chrome). Los textos están en la lista `PIEZAS` del mismo archivo.
- Título y descripción para compartir: en el `<head>` de `fuente/index.tpl.html` y `fuente/manual.tpl.html`; los del blog salen de cada artículo.
- **Dominio de las vistas previas:** `fuente/sitio.mjs` (`PUBLICO`). Hoy apunta a `neuroinsightcr.riklanderos.tech`, porque en `neuroinsightcr.com` sigue el sitio anterior y las redes no encontrarían la imagen. Al conectar el dominio final se cambia esa línea y se vuelven a armar index, blog y manual.
- Las redes guardan la vista previa varios días. Si al compartir sale la anterior, se actualiza en el depurador de Facebook (developers.facebook.com/tools/debug, botón "Volver a extraer") y en el Post Inspector de LinkedIn. Cada armado nuevo cambia el `?v=` de la imagen, y eso también ayuda.
