// Portadas del blog: arma cada portada en HTML con la tipografía de la marca, la fotografía con Chrome sin ventana
// y guarda img/blog/<slug>-portada-{720,1080}.webp (4:5, blog y redes) e img/blog/<slug>-og.jpg (1200 x 630, para compartir).
// Uso: node fuente/blog/portadas.mjs [slug]   (necesita Google Chrome y sharp; ver LEEME)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { ARTICULOS } from './articulos.mjs';

const RAIZ = new URL('../../', import.meta.url).pathname;
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH || 'sharp');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const RECORTES = path.join(RAIZ, 'materiales/generadas/blog');
const SALIDA = path.join(RAIZ, 'img/blog');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'portadas-'));
fs.mkdirSync(SALIDA, { recursive: true });

const f = (p) => 'file://' + path.join(RAIZ, p);
const logo = (claro) => fs.readFileSync(path.join(RAIZ, claro ? 'img/logo-blanco.svg' : 'img/logo-color.svg'), 'utf8').replace('<svg', '<svg class="logo"');

// Azar con semilla, para que cada portada salga igual cada vez
function azar(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// Papel rasgado: rectángulo con bordes irregulares
function rasgado(w, h, r, paso = 16, j = 7) {
  const p = [];
  for (let x = 0; x <= w; x += paso) p.push([x, (r() - .5) * j]);
  for (let y = paso; y <= h; y += paso) p.push([w + (r() - .5) * j, y]);
  for (let x = w - paso; x >= 0; x -= paso) p.push([x, h + (r() - .5) * j]);
  for (let y = h - paso; y > 0; y -= paso) p.push([(r() - .5) * j, y]);
  return 'polygon(' + p.map(([x, y]) => `${(x / w * 100).toFixed(2)}% ${(y / h * 100).toFixed(2)}%`).join(',') + ')';
}

// Trazo a mano que termina en nodos: la versión de marca de los garabatos de la referencia
function garabato({ cx, cy, rx, ry, vueltas = 2.2, inicio = 0, ruido = .16, seed = 1 }) {
  const r = azar(seed), pts = [], n = Math.round(vueltas * 14);
  for (let i = 0; i <= n; i++) {
    const a = inicio + i / n * vueltas * Math.PI * 2, k = 1 + (r() - .5) * ruido * 2;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1.map(v => v.toFixed(1))} ${c2.map(v => v.toFixed(1))} ${p2.map(v => v.toFixed(1))}`;
  }
  return { d, a: pts[0], b: pts[pts.length - 1] };
}
const trazo = (g, color, w = 3) => `<path d="${g.d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/><circle cx="${g.a[0]}" cy="${g.a[1]}" r="${w * 3}" fill="none" stroke="${color}" stroke-width="${w}"/><circle cx="${g.b[0]}" cy="${g.b[1]}" r="${w * 3.2}" fill="${color}"/>`;

const TEMAS = {
  noche: { bg: '#021E4B', tinta: '#fff', acento: '#8EC0F0', claro: true },
  papel: { bg: '#F1EDE4', tinta: '#021E4B', acento: '#1D78C9', claro: false },
  azul: { bg: '#1D78C9', tinta: '#fff', acento: '#DCE9F7', claro: true },
  suave: { bg: '#DCE9F7', tinta: '#021E4B', acento: '#1D78C9', claro: false }
};
// El fondo de cada portada; el artículo de escuelas va sobre azul y el de señales sobre azul suave
const FONDO = { 'escuelas-neuroincluyentes': 'azul', 'senales-tempranas-tea-tdah': 'suave' };

const css = (t, W, H) => `
@font-face{font-family:M;src:url(${f('fonts/montserrat.woff2')});font-weight:500 700}
@font-face{font-family:S;src:url(${f('fonts/instrument-serif.woff2')})}
@font-face{font-family:S;font-style:italic;src:url(${f('fonts/instrument-serif-italic.woff2')})}
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${t.bg}}
.st{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${t.bg};color:${t.tinta}}
.st>*{position:absolute}
.grano{inset:0;width:100%;height:100%;opacity:${t.claro ? .16 : .22};mix-blend-mode:${t.claro ? 'soft-light' : 'multiply'};pointer-events:none;z-index:20}
.eyebrow{font:600 var(--fe) M;letter-spacing:.2em;text-transform:uppercase;color:${t.acento === '#DCE9F7' ? '#DCE9F7' : t.claro ? t.acento : '#1A6CB5'};display:flex;align-items:center;gap:.7em;z-index:6}
.eyebrow::before{content:"";width:.6em;height:.6em;border-radius:50%;background:currentColor}
.titulo{font:400 var(--ft)/.92 S;letter-spacing:-.01em;z-index:6}
.titulo em{font-style:italic;color:${t.acento === '#DCE9F7' ? '#fff' : t.acento}}
.etiqueta{font:italic 400 var(--fl)/1.05 S;background:#fff;color:#021E4B;padding:.06em .28em .1em;z-index:6;rotate:-2deg;box-shadow:0 10px 24px -14px rgba(2,30,75,.6)}
.etiqueta em{color:#1D78C9}
.franja{font:600 var(--fs)/1.2 M;background:#021E4B;color:#fff;padding:.5em .8em;z-index:6;letter-spacing:.01em}
.franja--azul{background:#1D78C9}
.pastilla{font:600 var(--fp)/1 M;border:2px solid currentColor;border-radius:999px;padding:.55em .7em .55em 1em;display:flex;align-items:center;gap:.6em;z-index:8;background:${t.bg}}
.pastilla i{width:1.1em;height:1.1em;border-radius:50%;background:${t.claro ? t.tinta : '#1D78C9'};display:block}
.logo{position:absolute;z-index:8}
.recorte{z-index:4;filter:drop-shadow(0 18px 26px rgba(2,10,30,.35))}
.papel-r{z-index:2}
.trazos{z-index:5;overflow:visible}
.fantasma{font:italic 400 var(--fg)/.82 S;color:rgba(142,192,240,.1);z-index:1;white-space:nowrap}
.ovalo{z-index:5;overflow:visible}
.lista{z-index:6;color:#021E4B;font:500 var(--fli) M;list-style:none;padding:0}
.lista li{display:flex;gap:.55em;align-items:flex-start}
.lista b{flex:none;width:1.35em;height:1.35em;border:2px solid #1D78C9;border-radius:50%;display:grid;place-items:center;font:600 .8em/1 M;color:#1D78C9;margin-top:-.08em}
.puntos{z-index:2;background:radial-gradient(circle,#1D78C9 28%,transparent 31%) 0 0/14px 14px;opacity:.9}
`;

const grano = `<svg class="grano" xmlns="http://www.w3.org/2000/svg"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>`;

// Cada diseño devuelve el HTML de su escenario para 4:5 (v) o para compartir (h)
function escena(a, fmt) {
  const tema = TEMAS[FONDO[a.slug] || a.portada.fondo];
  const v = fmt === 'v', W = v ? 1080 : 1200, H = v ? 1350 : 630;
  const r = azar(a.slug.length * 97 + (v ? 1 : 2));
  const P = a.portada;
  const rec = (n) => f(`materiales/generadas/blog/${n}-recorte.png`);
  const pie = v
    ? `${logo(tema.claro).replace('class="logo"', 'class="logo" style="left:80px;bottom:78px;height:46px;width:auto"')}<div class="pastilla" style="right:80px;bottom:74px;--fp:22px;color:${tema.tinta}">Leer en el blog <i></i></div>`
    : `${logo(tema.claro).replace('class="logo"', 'class="logo" style="left:64px;bottom:52px;height:36px;width:auto"')}`;
  let s = '';
  const vars = (o) => Object.entries(o).map(([k, val]) => `--${k}:${val}`).join(';');

  if (P.recorte === 'trabajo') {
    const g = v ? garabato({ cx: 640, cy: 930, rx: 420, ry: 300, vueltas: 1.7, inicio: 2.6, seed: 4 }) : garabato({ cx: 930, cy: 380, rx: 300, ry: 230, vueltas: 1.6, inicio: 2.4, seed: 4 });
    s = v ? `
<p class="eyebrow" style="left:80px;top:92px;--fe:22px">${P.eyebrow}</p>
<h1 class="titulo" style="left:80px;top:150px;width:900px;--ft:132px">${P.titulo}</h1>
<p class="etiqueta" style="left:84px;top:430px;--fl:68px">${P.etiqueta}</p>
<div class="papel-r" style="left:300px;top:650px;width:660px;height:600px;background:#1D78C9;rotate:5deg;clip-path:${rasgado(660, 600, r)}"></div>
<img class="recorte" src="${rec('trabajo')}" style="right:-30px;bottom:-110px;height:880px;rotate:-3deg">
<svg class="trazos" width="${W}" height="${H}" style="left:0;top:0">${trazo(g, '#8EC0F0', 3.4)}</svg>` : `
<p class="eyebrow" style="left:64px;top:60px;--fe:17px">${P.eyebrow}</p>
<h1 class="titulo" style="left:64px;top:104px;width:600px;--ft:88px">${P.titulo}</h1>
<p class="etiqueta" style="left:68px;top:300px;--fl:48px">${P.etiqueta}</p>
<div class="papel-r" style="left:730px;top:150px;width:400px;height:420px;background:#1D78C9;rotate:5deg;clip-path:${rasgado(400, 420, r)}"></div>
<img class="recorte" src="${rec('trabajo')}" style="right:30px;bottom:-110px;height:640px;rotate:-3deg">
<svg class="trazos" width="${W}" height="${H}" style="left:0;top:0">${trazo(g, '#8EC0F0', 3)}</svg>`;
  }

  if (P.recorte === 'cuaderno') {
    // La hoja mide 1124 x 1400; renglones cada 63.9 px desde el 235 y margen en el 222
    const hojaH = v ? 860 : 590, k = hojaH / 1400, lh = 63.9 * k;
    const hx = v ? 215 : 640, hy = v ? 410 : 30;
    const items = P.lista.map((t, i) => `<li style="height:${(lh * 3).toFixed(2)}px"><b>${i + 1}</b><span>${t}</span></li>`).join('');
    const top = hy + (235 + 63.9 * 2) * k - lh * .64;
    const ovW = v ? 820 : 560, ovH = v ? 290 : 210;
    const ox = v ? (W - ovW) / 2 : 44, oy = v ? 122 : 170;
    const g = v ? garabato({ cx: 170, cy: 1110, rx: 120, ry: 90, vueltas: 1.3, inicio: 4, seed: 7 }) : garabato({ cx: 560, cy: 520, rx: 70, ry: 55, vueltas: 1.3, inicio: 4, seed: 7 });
    s = `
<p class="eyebrow" style="${v ? 'left:0;right:0;justify-content:center;top:72px;--fe:22px' : 'left:64px;top:90px;--fe:17px'}">${P.eyebrow}</p>
<svg class="ovalo" width="${ovW}" height="${ovH}" style="left:${ox}px;top:${oy}px"><ellipse cx="${ovW / 2}" cy="${ovH / 2}" rx="${ovW / 2 - 4}" ry="${ovH / 2 - 4}" fill="none" stroke="#021E4B" stroke-width="2.5"/><ellipse cx="${ovW / 2 + 6}" cy="${ovH / 2 + 3}" rx="${ovW / 2 - 10}" ry="${ovH / 2 - 8}" fill="none" stroke="#021E4B" stroke-width="1.5" transform="rotate(-1.5 ${ovW / 2} ${ovH / 2})"/></svg>
<h1 class="titulo" style="left:${ox}px;top:${oy}px;width:${ovW}px;height:${ovH}px;display:grid;place-items:center;text-align:center;--ft:${v ? 112 : 80}px">${P.titulo}</h1>
<div class="papel-r" style="left:${hx + (v ? 470 : 280)}px;top:${hy + (v ? 520 : 300)}px;width:${v ? 420 : 300}px;height:${v ? 380 : 260}px;background:#1D78C9;rotate:-6deg;clip-path:${rasgado(420, 380, r)}"></div>
<div style="left:${hx}px;top:${hy}px;width:${1124 * k}px;height:${hojaH}px;rotate:-3deg;transform-origin:50% 50%;z-index:4">
  <img src="${rec('cuaderno')}" style="position:absolute;inset:0;width:100%;height:100%;filter:drop-shadow(0 14px 22px rgba(2,10,30,.22))">
  <ol class="lista" style="position:absolute;left:${(240 * k).toFixed(1)}px;top:${(top - hy).toFixed(1)}px;width:${(760 * k).toFixed(1)}px;--fli:${v ? 29 : 19}px/${lh.toFixed(2)}px">${items}</ol>
</div>
<svg class="trazos" width="${W}" height="${H}" style="left:0;top:0">${trazo(g, '#1D78C9', v ? 3.4 : 2.6)}</svg>`;
  }

  if (P.recorte === 'escuela') {
    const g1 = v ? garabato({ cx: 620, cy: 1010, rx: 360, ry: 250, vueltas: 2.4, inicio: 3.1, seed: 11 }) : garabato({ cx: 930, cy: 400, rx: 250, ry: 190, vueltas: 2.2, inicio: 3.1, seed: 11 });
    const g2 = v ? garabato({ cx: 600, cy: 1040, rx: 300, ry: 200, vueltas: 1.4, inicio: .4, seed: 12 }) : garabato({ cx: 920, cy: 420, rx: 210, ry: 160, vueltas: 1.3, inicio: .4, seed: 12 });
    const [a1, a2] = P.titulo.split(' ');
    s = v ? `
<p class="eyebrow" style="left:80px;top:92px;--fe:22px">${P.eyebrow}</p>
<h1 class="titulo" style="left:76px;top:150px;width:940px;--ft:118px">${a1}<br><span style="font-size:1.26em;line-height:.95;display:block;margin-left:-.04em">${a2}</span></h1>
<div class="pastilla" style="left:80px;top:470px;--fp:26px;color:#fff">${P.etiqueta}</div>
<svg class="trazos" width="${W}" height="${H}" style="left:0;top:0;z-index:3">${trazo(g2, '#021E4B', 3.4)}</svg>
<img class="recorte" src="${rec('escuela')}" style="left:330px;bottom:-40px;height:780px">
<svg class="trazos" width="${W}" height="${H}" style="left:0;top:0">${trazo(g1, '#fff', 3)}</svg>` : `
<p class="eyebrow" style="left:64px;top:60px;--fe:17px">${P.eyebrow}</p>
<h1 class="titulo" style="left:60px;top:104px;width:640px;--ft:76px">${a1}<br><span style="font-size:1.22em;line-height:.95;display:block">${a2}</span></h1>
<div class="pastilla" style="left:64px;top:330px;--fp:19px;color:#fff">${P.etiqueta}</div>
<svg class="trazos" width="${W}" height="${H}" style="left:0;top:0;z-index:3">${trazo(g2, '#021E4B', 3)}</svg>
<img class="recorte" src="${rec('escuela')}" style="left:790px;bottom:-40px;height:600px">
<svg class="trazos" width="${W}" height="${H}" style="left:0;top:0">${trazo(g1, '#fff', 2.6)}</svg>`;
  }

  if (P.recorte === 'lupa') {
    const g = v ? garabato({ cx: 330, cy: 930, rx: 240, ry: 200, vueltas: 1.5, inicio: 1.5, seed: 21 }) : garabato({ cx: 790, cy: 330, rx: 200, ry: 170, vueltas: 1.5, inicio: 1.5, seed: 21 });
    const [t1, t2] = P.titulo.split(' ');
    s = v ? `
<p class="eyebrow" style="left:80px;top:92px;--fe:22px">${P.eyebrow}</p>
<h1 class="titulo" style="left:76px;top:150px;width:940px;--ft:150px">${t1}<br>${t2}</h1>
<p class="franja" style="left:80px;top:470px;--fs:32px">${P.etiqueta}</p>
<div class="papel-r" style="left:90px;top:640px;width:560px;height:520px;background:#fff;rotate:-4deg;clip-path:${rasgado(560, 520, r)}"></div>
<div class="puntos" style="left:520px;top:600px;width:220px;height:220px;border-radius:50%;opacity:.25"></div>
<img style="left:150px;top:690px;width:440px;z-index:3;rotate:-4deg" src="${f('img/cerebro-dual-640.webp')}">
<img class="recorte" src="${rec('lupa')}" style="right:-120px;bottom:-200px;height:1000px;rotate:-14deg">
<svg class="trazos" width="${W}" height="${H}" style="left:0;top:0">${trazo(g, '#1D78C9', 3.4)}</svg>` : `
<p class="eyebrow" style="left:64px;top:60px;--fe:17px">${P.eyebrow}</p>
<h1 class="titulo" style="left:60px;top:104px;width:560px;--ft:100px">${t1}<br>${t2}</h1>
<p class="franja" style="left:64px;top:330px;--fs:24px">${P.etiqueta}</p>
<div class="papel-r" style="left:615px;top:110px;width:330px;height:330px;background:#fff;rotate:-4deg;clip-path:${rasgado(330, 330, r)}"></div>
<img style="left:650px;top:130px;width:270px;z-index:3;rotate:-4deg" src="${f('img/cerebro-dual-640.webp')}">
<img class="recorte" src="${rec('lupa')}" style="right:-110px;bottom:-260px;height:760px;rotate:-14deg">
<svg class="trazos" width="${W}" height="${H}" style="left:0;top:0">${trazo(g, '#1D78C9', 2.8)}</svg>`;
  }

  if (P.recorte === 'mascara') {
    const filas = v ? 6 : 4;
    const fant = Array.from({ length: filas }, (_, i) => `<div style="margin-left:${-i * 140}px">${(P.fantasma + ' ').repeat(4)}</div>`).join('');
    const g = v ? garabato({ cx: 560, cy: 820, rx: 330, ry: 240, vueltas: 1.2, inicio: 3.7, seed: 31 }) : garabato({ cx: 900, cy: 260, rx: 220, ry: 160, vueltas: 1.2, inicio: 3.7, seed: 31 });
    s = v ? `
<div class="fantasma" style="left:-40px;top:520px;--fg:230px">${fant}</div>
<p class="eyebrow" style="left:0;right:0;justify-content:center;top:92px;--fe:22px">${P.eyebrow}</p>
<h1 class="titulo etiqueta" style="left:50%;translate:-50% 0;top:160px;--ft:132px;--fl:132px;font-style:normal;white-space:nowrap">${P.titulo}</h1>
<p class="franja franja--azul" style="left:50%;translate:-50% 0;top:360px;--fs:30px;white-space:nowrap">${P.etiqueta}</p>
<img class="recorte" src="${rec('mascara')}" style="left:50%;translate:-50% 0;bottom:-60px;height:820px">
<svg class="trazos" width="${W}" height="${H}" style="left:0;top:0;z-index:3">${trazo(g, '#8EC0F0', 3.4)}</svg>` : `
<div class="fantasma" style="left:-40px;top:20px;--fg:170px">${fant}</div>
<p class="eyebrow" style="left:64px;top:76px;--fe:17px">${P.eyebrow}</p>
<h1 class="titulo etiqueta" style="left:64px;top:130px;--ft:96px;--fl:96px;font-style:normal;white-space:nowrap">${P.titulo}</h1>
<p class="franja franja--azul" style="left:64px;top:290px;--fs:24px;white-space:nowrap">${P.etiqueta}</p>
<img class="recorte" src="${rec('mascara')}" style="left:780px;bottom:-60px;height:640px">
<svg class="trazos" width="${W}" height="${H}" style="left:0;top:0;z-index:3">${trazo(g, '#8EC0F0', 3)}</svg>`;
  }

  return `<!doctype html><html><head><meta charset="utf-8"><style>${css(tema, W, H)}</style></head><body><div class="st">${s}${pie}${grano}</div></body></html>`;
}

function foto(html, W, H, salida) {
  const archivo = path.join(TMP, 'p.html');
  fs.writeFileSync(archivo, html);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1',
    `--window-size=${W},${H}`, '--virtual-time-budget=4000', `--screenshot=${salida}`, 'file://' + archivo], { stdio: 'ignore' });
}

const solo = process.argv[2];
for (const a of ARTICULOS) {
  if (solo && a.slug !== solo) continue;
  const pv = path.join(TMP, a.slug + '-v.png'), ph = path.join(TMP, a.slug + '-h.png');
  foto(escena(a, 'v'), 1080, 1350, pv);
  foto(escena(a, 'h'), 1200, 630, ph);
  await sharp(pv).webp({ quality: 82 }).toFile(path.join(SALIDA, `${a.slug}-portada-1080.webp`));
  await sharp(pv).resize(720).webp({ quality: 80 }).toFile(path.join(SALIDA, `${a.slug}-portada-720.webp`));
  await sharp(ph).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(SALIDA, `${a.slug}-og.jpg`));
  await sharp(ph).webp({ quality: 82 }).toFile(path.join(SALIDA, `${a.slug}-ancha.webp`));
  console.log('portada', a.slug);
}
fs.rmSync(TMP, { recursive: true, force: true });
