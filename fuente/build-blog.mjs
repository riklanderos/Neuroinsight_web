// Arma el blog: blog/index.html y blog/<slug>/index.html, más sitemap.xml, robots.txt y las redirecciones
// de las direcciones viejas. Toma el menú y el pie de index.tpl.html para que todo el sitio comparta la misma navegación.
// Uso: node fuente/build-blog.mjs <version>
import fs from 'node:fs';
import { ARTICULOS } from './blog/articulos.mjs';

const V = process.argv[2] || '20261026f';
const DOM = 'https://neuroinsightcr.com';
const WA = (m) => 'https://wa.me/50671024989?text=' + encodeURIComponent(m);
const MODIFICADO = '2026-10-26';
const s = JSON.parse(fs.readFileSync(new URL('logo-split.json', import.meta.url)));
const m = JSON.parse(fs.readFileSync(new URL('logo-meta.json', import.meta.url)));
const tpl = fs.readFileSync(new URL('index.tpl.html', import.meta.url), 'utf8');
const ARROW = '<svg viewBox="0 0 34 12" aria-hidden="true"><path d="M1 6h24"/><circle cx="29" cy="6" r="4"/></svg>';
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sinHtml = (t) => t.replace(/<[^>]+>/g, '').replace(/­/g, '');

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const fecha = (iso) => { const [y, mo, d] = iso.split('-').map(Number); return `${d} de ${MESES[mo - 1]} de ${y}`; };
const minutos = (a) => Math.max(3, Math.ceil(sinHtml(a.cuerpo + a.faq.map(q => q.q + q.a).join(' ')).split(/\s+/).length / 200));

// Piezas compartidas del sitio, con las rutas ajustadas a la profundidad de cada página
const corta = (ini, fin) => { const a = tpl.indexOf(ini), b = tpl.indexOf(fin, a); return tpl.slice(a, b + fin.length); };
const SPRITE = corta('<!-- Sprite del logo', '</svg>');
const NAV = corta('<!-- ===== INICIO Navegación', '<!-- ===== FIN Navegación ===== -->');
const PIE = corta('<!-- ===== INICIO Cierre y pie', '<!-- ===== FIN Cierre y pie ===== -->');
const BARRA = corta('<div class="mobile-cta"', '</div>');
function rutas(html, R, actual) {
  html = html
    .replace(/%%WA:([^%]+)%%/g, (_, msg) => WA(msg))
    .replace(/(<a\b[^>]*?)href="#inicio"/g, `$1href="${R}"`)
    .replace(/(<a\b[^>]*?)href="#([\w-]+)"/g, `$1href="${R}#$2"`)
    .replace(/href="blog\/"/g, `href="${R}blog/"`);
  if (actual) html = html.replace(new RegExp(`href="${R}blog/"`, 'g'), `href="${R}blog/" aria-current="page"`);
  const map = { VB_ALL: m.all, VB_SYM: m.sym, NAVY_SYM: s.navySym, BLUE_SYM: s.blueSym, NAVY_WORD: s.navyWord, BLUE_WORD: s.blueWord, ARROW, V };
  return html.replace(/%%(\w+)%%/g, (_, k) => { if (!(k in map)) throw new Error('falta ' + k); return map[k]; });
}

function pagina({ R, titulo, descripcion, canonica, imagen, tipoOg, ld, cuerpo, blogActual, barra }) {
  return `<!doctype html>
<html lang="es-CR" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
<link rel="canonical" href="${canonica}">
<meta name="theme-color" content="#021E4B">
<meta property="og:type" content="${tipoOg}">
<meta property="og:site_name" content="NeuroInsight">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descripcion)}">
<meta property="og:image" content="${imagen}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${canonica}">
<meta property="og:locale" content="es_CR">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${R}favicon.ico" sizes="any">
<link rel="icon" href="${R}img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${R}img/apple-touch-icon.png">
<link rel="preload" href="${R}fonts/montserrat.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${R}fonts/instrument-serif.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${R}css/tokens.css?v=${V}">
<link rel="stylesheet" href="${R}css/site.css?v=${V}">
<link rel="stylesheet" href="${R}css/blog.css?v=${V}">
<script>document.documentElement.className=document.documentElement.className.replace('no-js','js');</script>
${ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>
<body class="blog">
${rutas(SPRITE, R)}
${rutas(NAV, R, blogActual)}
<main id="inicio">
${cuerpo}
</main>
${rutas(PIE, R)}
${barra || rutas(BARRA, R)}
<script src="${R}vendor/gsap.min.js" defer></script>
<script src="${R}vendor/ScrollTrigger.min.js" defer></script>
<script src="${R}vendor/SplitText.min.js" defer></script>
<script src="${R}vendor/lenis.min.js" defer></script>
<script src="${R}js/blog.js?v=${V}" defer></script>
</body>
</html>
`;
}

const ORG = { '@type': 'Organization', name: 'NeuroInsight', url: DOM + '/', logo: { '@type': 'ImageObject', url: DOM + '/img/logo-color.svg' } };
const url = (a) => `${DOM}/blog/${a.slug}/`;

// Tarjeta del índice y de "Siga leyendo"
function tarjeta(a, R, nivel = 'h2', destacada = false) {
  const img = destacada
    ? `<img src="${R}img/blog/${a.slug}-ancha.webp" width="1200" height="630" alt="" loading="lazy" decoding="async">`
    : `<img src="${R}img/blog/${a.slug}-portada-720.webp" srcset="${R}img/blog/${a.slug}-portada-720.webp 720w, ${R}img/blog/${a.slug}-portada-1080.webp 1080w" sizes="(min-width:1100px) 280px, (min-width:560px) 45vw, 92vw" width="720" height="900" alt="" loading="lazy" decoding="async">`;
  return `<a class="tarjeta${destacada ? ' tarjeta--destacada' : ''}" href="${R}blog/${a.slug}/" data-cat="${a.categoria}" data-tarjeta>
  <figure class="tarjeta__img">${img}</figure>
  <div class="tarjeta__txt">
    <p class="tarjeta__meta"><span>${a.categoria}</span><span>${minutos(a)} min de lectura</span></p>
    <${nivel} class="tarjeta__t">${a.h1}</${nivel}>
    ${destacada ? `<p class="tarjeta__bajada">${a.bajada}</p>` : ''}
    <span class="link-node">Leer artículo ${ARROW}</span>
  </div>
</a>`;
}

// ---------- Índice del blog ----------
{
  const R = '../';
  const [dest, ...resto] = ARTICULOS;
  const cats = ['Todos', ...new Set(ARTICULOS.map(a => a.categoria))];
  const cuerpo = `
<!-- ===== INICIO Portada del blog ===== -->
<section class="blog-hero">
  <div class="wrap blog-hero__grid">
    <div class="blog-hero__txt">
      <nav class="migas" aria-label="Ruta"><a href="${R}">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Blog</span></nav>
      <p class="eyebrow">Blog NeuroInsight</p>
      <h1 class="blog-hero__h1" data-split>Comprender para <em>acompañar</em>.</h1>
      <p class="lead" data-reveal>Guías claras sobre neurodivergencia para empresas, centros educativos y familias, escritas por nuestro equipo con base en evidencia.</p>
    </div>
    <div class="pila" aria-hidden="true">
      ${ARTICULOS.slice(0, 3).map((a, i) => `<img class="pila__p pila__p--${i + 1}" src="${R}img/blog/${a.slug}-portada-720.webp" width="720" height="900" alt="" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>`).join('\n      ')}
    </div>
  </div>
</section>
<!-- ===== FIN Portada del blog ===== -->

<!-- ===== INICIO Artículos ===== -->
<section class="sec blog-lista" aria-labelledby="t-articulos">
  <div class="wrap">
    <h2 class="sr" id="t-articulos">Artículos</h2>
    <div class="filtros" role="group" aria-label="Filtrar por tema" data-filtros hidden>
      ${cats.map((c, i) => `<button type="button" class="pestana" aria-pressed="${i === 0}" data-filtro="${c}">${c}</button>`).join('')}
    </div>
    ${tarjeta(dest, R, 'h2', true)}
    <div class="tarjetas">
      ${resto.map(a => tarjeta(a, R)).join('\n      ')}
    </div>
  </div>
</section>
<!-- ===== FIN Artículos ===== -->
`;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Blog', name: 'Blog NeuroInsight', url: DOM + '/blog/', inLanguage: 'es-CR', publisher: ORG,
      blogPost: ARTICULOS.map(a => ({ '@type': 'BlogPosting', headline: a.h1, url: url(a), datePublished: a.publicado, image: `${DOM}/img/blog/${a.slug}-portada-1080.webp` })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: DOM + '/' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: DOM + '/blog/' }] }
  ];
  fs.mkdirSync(new URL('../blog/', import.meta.url), { recursive: true });
  fs.writeFileSync(new URL('../blog/index.html', import.meta.url), pagina({
    R, titulo: 'Blog sobre neurodivergencia y neuroinclusión | NeuroInsight',
    descripcion: 'Guías claras sobre neurodivergencia, neuroinclusión laboral, escuelas neuroincluyentes, TEA y TDAH, para empresas, centros educativos y familias en Costa Rica.',
    canonica: DOM + '/blog/', imagen: `${DOM}/img/blog/${dest.slug}-og.jpg`, tipoOg: 'website', ld, cuerpo, blogActual: true
  }));
}

// ---------- Páginas de artículo ----------
for (const a of ARTICULOS) {
  const R = '../../';
  const org = a.audiencia === 'org';
  const tema = sinHtml(a.tituloSeo.split(':')[0]).toLowerCase();
  const waArt = org
    ? WA(`Hola NeuroInsight, leí el artículo "${sinHtml(a.tituloSeo)}" y quisiera información para mi organización.`)
    : WA(`Hola NeuroInsight, leí el artículo "${sinHtml(a.tituloSeo)}" y quisiera solicitar una cita.`);
  const propuesta = `${R}?tipo=${encodeURIComponent(a.tipo || 'Empresa')}#propuesta`;
  const ctaMedio = org
    ? `<aside class="cta-medio" data-reveal><p class="eyebrow">Para su ${a.tipo === 'Centro educativo' ? 'centro educativo' : 'empresa'}</p><p class="cta-medio__t">¿Quiere aplicar esto con su equipo?</p><p>Diseñamos capacitaciones y consultorías a la medida, en sus instalaciones o en nuestro espacio.</p><a class="btn" href="${propuesta}">Solicitar propuesta <span class="btn__node" aria-hidden="true"></span></a></aside>`
    : `<aside class="cta-medio" data-reveal><p class="eyebrow">Acompañamiento</p><p class="cta-medio__t">¿Le gustaría hablarlo con una especialista?</p><p>Escríbanos por WhatsApp y le orientamos sobre el siguiente paso. Las sesiones son presenciales en Cartago.</p><a class="btn" href="${waArt}" target="_blank" rel="noopener">Solicitar cita por WhatsApp <span class="btn__node" aria-hidden="true"></span></a></aside>`;
  // El llamado del medio va antes del tercer subtítulo
  let n = 0;
  const cuerpo = a.cuerpo.replace(/<h2 /g, (h) => (++n === 3 ? ctaMedio + '\n' + h : h));
  const indice = [...a.cuerpo.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)].map(([, id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('');
  const relacionados = ARTICULOS.filter(o => o !== a).sort((x, y) => (y.audiencia === a.audiencia) - (x.audiencia === a.audiencia)).slice(0, 3);
  const compartir = encodeURIComponent(url(a));
  const html = `
<div class="progreso" aria-hidden="true"><i data-progreso></i></div>
<article>
<!-- ===== INICIO Cabecera del artículo ===== -->
<header class="art-cab">
  <div class="wrap art-cab__grid">
    <div class="art-cab__txt">
      <nav class="migas" aria-label="Ruta"><a href="${R}">Inicio</a><span aria-hidden="true">/</span><a href="${R}blog/">Blog</a><span aria-hidden="true">/</span><span aria-current="page">${a.categoria}</span></nav>
      <p class="eyebrow">${a.categoria}</p>
      <h1 class="art-h1" data-split>${a.h1}</h1>
      <p class="lead" data-reveal>${a.bajada}</p>
      <p class="art-meta" data-reveal><span>Equipo NeuroInsight</span><span><time datetime="${a.publicado}">${fecha(a.publicado)}</time></span><span>${minutos(a)} min de lectura</span></p>
    </div>
    <figure class="art-portada" data-portada>
      <img src="${R}img/blog/${a.slug}-portada-1080.webp" srcset="${R}img/blog/${a.slug}-portada-720.webp 720w, ${R}img/blog/${a.slug}-portada-1080.webp 1080w" sizes="(min-width:960px) 420px, 86vw" width="1080" height="1350" alt="Portada del artículo: ${esc(sinHtml(a.portada.titulo))}" fetchpriority="high">
      <svg class="art-portada__trazo" viewBox="0 0 400 500" aria-hidden="true"><path data-draw d="M392 120 C 430 300, 300 520, 120 492 S -40 300, 20 140 S 250 -40, 360 60"/><circle cx="360" cy="60" r="9"/></svg>
    </figure>
  </div>
</header>
<!-- ===== FIN Cabecera del artículo ===== -->

<!-- ===== INICIO Cuerpo ===== -->
<div class="wrap art-cuerpo">
  <aside class="indice" aria-label="En este artículo">
    <p class="indice__t">En este artículo</p>
    <ol data-indice>${indice}<li><a href="#preguntas">Preguntas frecuentes</a></li></ol>
  </aside>
  <div class="prosa">
    <section class="resumen" aria-label="En resumen" data-reveal>
      <p class="resumen__t">En resumen</p>
      <ul>${a.resumen.map(t => `<li>${t}</li>`).join('')}</ul>
    </section>
    ${cuerpo}
    <section class="art-faq" id="preguntas" aria-labelledby="t-preguntas">
      <h2 id="t-preguntas">Preguntas frecuentes</h2>
      <div class="faq">
        ${a.faq.map(q => `<div class="qa"><h3><button class="qa__q" type="button" aria-expanded="false">${q.q}<span class="qa__icon" aria-hidden="true"></span></button></h3><div class="qa__a"><div><p>${q.a}</p></div></div></div>`).join('\n        ')}
      </div>
    </section>
    <section class="cta-final" aria-labelledby="t-cta">
      <svg class="cta-final__iso" viewBox="${m.sym}" aria-hidden="true"><use href="#iso"/></svg>
      <p class="eyebrow">${org ? 'Organizaciones' : 'Familias'}</p>
      <h2 id="t-cta">${org ? `Llevemos la neuroinclusión a su ${a.tipo === 'Centro educativo' ? 'centro educativo' : 'equipo'}.` : 'Demos juntos el primer paso.'}</h2>
      <p>${org ? 'Cuéntenos sobre su organización y le enviamos una propuesta de capacitación o consultoría.' : 'Le acompañamos con una evaluación y un plan claro para casa, escuela o trabajo.'}</p>
      <div class="cta-final__btns">
        ${org
          ? `<a class="btn" href="${propuesta}">Solicitar propuesta <span class="btn__node" aria-hidden="true"></span></a><a class="link-node" href="${waArt}" target="_blank" rel="noopener">Escribir por WhatsApp ${ARROW}</a>`
          : `<a class="btn" href="${waArt}" target="_blank" rel="noopener">Solicitar cita por WhatsApp <span class="btn__node" aria-hidden="true"></span></a><a class="link-node" href="${R}?tipo=Empresa#propuesta">¿Es para su empresa? Solicitar propuesta ${ARROW}</a>`}
      </div>
    </section>
    <div class="compartir">
      <p>Compartir</p>
      <a href="https://wa.me/?text=${encodeURIComponent(sinHtml(a.h1) + ' ' + url(a))}" target="_blank" rel="noopener">WhatsApp</a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${compartir}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${compartir}" target="_blank" rel="noopener">Facebook</a>
      <button type="button" data-copiar="${url(a)}">Copiar enlace</button>
    </div>
  </div>
</div>
<!-- ===== FIN Cuerpo ===== -->
</article>

<!-- ===== INICIO Siga leyendo ===== -->
<section class="sec relacionados" aria-labelledby="t-rel">
  <div class="wrap">
    <div class="relacionados__head"><h2 class="h2" id="t-rel">Siga leyendo</h2><a class="link-node" href="${R}blog/">Ver todo el blog ${ARROW}</a></div>
    <div class="tarjetas tarjetas--3">
      ${relacionados.map(o => tarjeta(o, R, 'h3')).join('\n      ')}
    </div>
  </div>
</section>
<!-- ===== FIN Siga leyendo ===== -->
`;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: a.h1, description: a.descripcion, inLanguage: 'es-CR',
      image: [`${DOM}/img/blog/${a.slug}-portada-1080.webp`, `${DOM}/img/blog/${a.slug}-og.jpg`],
      datePublished: a.publicado, dateModified: MODIFICADO, author: { '@type': 'Organization', name: 'Equipo NeuroInsight', url: DOM + '/' }, publisher: ORG,
      mainEntityOfPage: url(a), keywords: a.palabraClave, articleSection: a.categoria },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: DOM + '/' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: DOM + '/blog/' },
      { '@type': 'ListItem', position: 3, name: sinHtml(a.tituloSeo), item: url(a) }] },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: a.faq.map(q => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } })) }
  ];
  fs.mkdirSync(new URL(`../blog/${a.slug}/`, import.meta.url), { recursive: true });
  fs.writeFileSync(new URL(`../blog/${a.slug}/index.html`, import.meta.url), pagina({
    R, titulo: `${a.tituloSeo} | NeuroInsight`, descripcion: a.descripcion, canonica: url(a),
    imagen: `${DOM}/img/blog/${a.slug}-og.jpg`, tipoOg: 'article', ld, cuerpo: html, blogActual: true,
    // En los artículos para familias la barra del celular lleva directo a WhatsApp
    barra: org ? null : `<div class="mobile-cta" aria-hidden="true"><a class="btn" href="${waArt}" target="_blank" rel="noopener" tabindex="-1">Solicitar cita por WhatsApp <span class="btn__node" aria-hidden="true"></span></a></div>`
  }));
  console.log('artículo', a.slug, minutos(a) + ' min', a.tituloSeo.length + ' car. título', a.descripcion.length + ' car. descripción', tema);
}

// ---------- Sitemap, robots y redirecciones de las direcciones viejas ----------
const urls = [[DOM + '/', MODIFICADO], [DOM + '/blog/', MODIFICADO], ...ARTICULOS.map(a => [url(a), MODIFICADO])];
fs.writeFileSync(new URL('../sitemap.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `  <url><loc>${u}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(new URL('../robots.txt', import.meta.url), `User-agent: *\nAllow: /\nDisallow: /materiales/\nDisallow: /fuente/\n\nSitemap: ${DOM}/sitemap.xml\n`);
fs.writeFileSync(new URL('../_redirects', import.meta.url), ARTICULOS.map(a => `/${a.original}  /blog/${a.slug}/  301`).join('\n') + '\n');
fs.writeFileSync(new URL('../.htaccess', import.meta.url), '# Redirecciones de los artículos del sitio anterior (Hostinger / Apache)\nRewriteEngine On\n' + ARTICULOS.map(a => `RewriteRule ^${a.original}/?$ /blog/${a.slug}/ [R=301,L]`).join('\n') + '\n');
console.log('blog ok');
