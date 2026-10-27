// Portada genérica del blog: la usan los artículos nuevos que todavía no tienen portada propia
// (campo imagen: "generica" en fuente/blog/articulos-estudio.json). Mismo estilo que portadas.mjs, sin fotografía.
// Guarda img/blog/generica-portada-{720,1080}.webp, generica-ancha.webp y generica-og.jpg.
// Uso: SHARP_PATH=<ruta a sharp> node fuente/blog/portada-generica.mjs   (necesita Google Chrome, igual que portadas.mjs)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const RAIZ = new URL('../../', import.meta.url).pathname;
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH || 'sharp');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SALIDA = path.join(RAIZ, 'img/blog');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'portada-generica-'));
const f = (p) => 'file://' + path.join(RAIZ, p);
const logo = fs.readFileSync(path.join(RAIZ, 'img/logo-blanco.svg'), 'utf8').replace('<svg', '<svg class="logo"');

// Trazo a mano que termina en nodos (misma idea que portadas.mjs)
function trazo(cx, cy, rx, ry, color, w) {
  let seed = 7;
  const r = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const pts = [];
  for (let i = 0; i <= 30; i++) { const a = -0.6 + i / 30 * Math.PI * 2 * 2.1, k = 1 + (r() - .5) * .3; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  let d = `M${pts[0].join(',')}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += `C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2.join(',')}`;
  }
  const [a, b] = [pts[0], pts[pts.length - 1]];
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/><circle cx="${a[0]}" cy="${a[1]}" r="${w * 3}" fill="none" stroke="${color}" stroke-width="${w}"/><circle cx="${b[0]}" cy="${b[1]}" r="${w * 3.2}" fill="${color}"/>`;
}

function escena(v) {
  const W = v ? 1080 : 1200, H = v ? 1350 : 630;
  const css = `
@font-face{font-family:M;src:url(${f('fonts/montserrat.woff2')});font-weight:500 700}
@font-face{font-family:S;src:url(${f('fonts/instrument-serif.woff2')})}
@font-face{font-family:S;font-style:italic;src:url(${f('fonts/instrument-serif-italic.woff2')})}
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#021E4B}
.st{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#021E4B;color:#fff}
.st>*{position:absolute}
.eyebrow{font:600 var(--fe) M;letter-spacing:.2em;text-transform:uppercase;color:#8EC0F0;display:flex;align-items:center;gap:.7em}
.eyebrow::before{content:"";width:.6em;height:.6em;border-radius:50%;background:currentColor}
.titulo{font:400 var(--ft)/.92 S;letter-spacing:-.01em}
.titulo em{font-style:italic;color:#8EC0F0}
.etiqueta{font:italic 400 var(--fl)/1.05 S;background:#fff;color:#021E4B;padding:.06em .28em .1em;rotate:-2deg}
.bloque{background:#1D78C9}
.fantasma{font:italic 400 var(--fg)/.82 S;color:rgba(142,192,240,.1);white-space:nowrap}
.pastilla{font:600 var(--fp)/1 M;border:2px solid #fff;border-radius:999px;padding:.55em .7em .55em 1em;display:flex;align-items:center;gap:.6em;background:#021E4B}
.pastilla i{width:1.1em;height:1.1em;border-radius:50%;background:#fff;display:block}
.logo{position:absolute}`;
  const s = v
    ? `<p class="fantasma" style="--fg:520px;left:-40px;bottom:120px">blog</p>
<div class="bloque" style="left:560px;top:640px;width:380px;height:440px;rotate:4deg"></div>
<svg width="${W}" height="${H}" style="left:0;top:0">${trazo(700, 860, 300, 230, '#8EC0F0', 4)}</svg>
<p class="eyebrow" style="--fe:28px;left:80px;top:96px">Blog NeuroInsight</p>
<h1 class="titulo" style="--ft:150px;left:80px;top:170px;width:900px">Comprender para <em>acompañar</em></h1>
<p class="etiqueta" style="--fl:56px;left:80px;top:520px">guías sobre neurodivergencia</p>
${logo.replace('class="logo"', 'class="logo" style="left:80px;bottom:78px;height:46px;width:auto"')}
<div class="pastilla" style="right:80px;bottom:74px;--fp:22px">Leer en el blog <i></i></div>`
    : `<p class="fantasma" style="--fg:420px;right:-30px;bottom:-60px">blog</p>
<div class="bloque" style="left:800px;top:120px;width:300px;height:340px;rotate:4deg"></div>
<svg width="${W}" height="${H}" style="left:0;top:0">${trazo(920, 300, 220, 180, '#8EC0F0', 3)}</svg>
<p class="eyebrow" style="--fe:22px;left:64px;top:64px">Blog NeuroInsight</p>
<h1 class="titulo" style="--ft:104px;left:64px;top:120px;width:700px">Comprender para <em>acompañar</em></h1>
<p class="etiqueta" style="--fl:40px;left:64px;top:370px">guías sobre neurodivergencia</p>
${logo.replace('class="logo"', 'class="logo" style="left:64px;bottom:52px;height:36px;width:auto"')}`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="st">${s}</div></body></html>`;
}

function foto(html, W, H, salida) {
  const archivo = path.join(TMP, 'p.html');
  fs.writeFileSync(archivo, html);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1',
    `--window-size=${W},${H}`, '--virtual-time-budget=4000', `--screenshot=${salida}`, 'file://' + archivo], { stdio: 'ignore' });
}

const pv = path.join(TMP, 'v.png'), ph = path.join(TMP, 'h.png');
foto(escena(true), 1080, 1350, pv);
foto(escena(false), 1200, 630, ph);
await sharp(pv).webp({ quality: 82 }).toFile(path.join(SALIDA, 'generica-portada-1080.webp'));
await sharp(pv).resize(720).webp({ quality: 80 }).toFile(path.join(SALIDA, 'generica-portada-720.webp'));
await sharp(ph).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(SALIDA, 'generica-og.jpg'));
await sharp(ph).webp({ quality: 82 }).toFile(path.join(SALIDA, 'generica-ancha.webp'));
fs.rmSync(TMP, { recursive: true, force: true });
console.log('portada genérica ok');
