// Imágenes para compartir (1200 x 630): la vista previa que sale en WhatsApp, Facebook, LinkedIn y X
// al pegar el enlace. Mismo lenguaje de collage que las portadas del blog: la ciencia (el cerebro) y lo humano (Adriana)
// sobre azul noche, papel rasgado y un trazo de circuito que termina en nodos.
// Guarda img/og-imagen.jpg (página principal) e img/og-manual.jpg (manual de marca).
// Uso: SHARP_PATH=<ruta a sharp> node fuente/compartir.mjs   (necesita Google Chrome, igual que portadas.mjs)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const RAIZ = new URL('../', import.meta.url).pathname;
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH || 'sharp');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'compartir-'));
const f = (p) => 'file://' + path.join(RAIZ, p);
const logo = fs.readFileSync(path.join(RAIZ, 'img/logo-blanco.svg'), 'utf8').replace('<svg', '<svg class="logo"');

// Azar con semilla, para que la imagen salga igual cada vez
function azar(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// Papel rasgado: rectángulo con bordes irregulares (misma idea que portadas.mjs)
function rasgado(w, h, r, paso = 16, j = 7) {
  const p = [];
  for (let x = 0; x <= w; x += paso) p.push([x, (r() - .5) * j]);
  for (let y = paso; y <= h; y += paso) p.push([w + (r() - .5) * j, y]);
  for (let x = w - paso; x >= 0; x -= paso) p.push([x, h + (r() - .5) * j]);
  for (let y = h - paso; y > 0; y -= paso) p.push([(r() - .5) * j, y]);
  return 'polygon(' + p.map(([x, y]) => `${(x / w * 100).toFixed(2)}% ${(y / h * 100).toFixed(2)}%`).join(',') + ')';
}

// Trazo a mano que termina en nodos
function trazo({ cx, cy, rx, ry, vueltas, inicio, seed }, color, w) {
  const r = azar(seed), pts = [], n = Math.round(vueltas * 14);
  for (let i = 0; i <= n; i++) { const a = inicio + i / n * vueltas * Math.PI * 2, k = 1 + (r() - .5) * .32; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  let d = `M${pts[0].map(v => v.toFixed(1))}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += `C${[p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6].map(v => v.toFixed(1))} ${[p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6].map(v => v.toFixed(1))} ${p2.map(v => v.toFixed(1))}`;
  }
  const [a, b] = [pts[0], pts[pts.length - 1]];
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/><circle cx="${a[0]}" cy="${a[1]}" r="${w * 3}" fill="none" stroke="${color}" stroke-width="${w}"/><circle cx="${b[0]}" cy="${b[1]}" r="${w * 3.2}" fill="${color}"/>`;
}

const grano = `<svg class="grano" xmlns="http://www.w3.org/2000/svg"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>`;

function escena({ eyebrow, titulo, etiqueta, servicios }) {
  const W = 1200, H = 630, r = azar(11);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:M;src:url(${f('fonts/montserrat.woff2')});font-weight:500 700}
@font-face{font-family:S;src:url(${f('fonts/instrument-serif.woff2')})}
@font-face{font-family:S;font-style:italic;src:url(${f('fonts/instrument-serif-italic.woff2')})}
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#021E4B}
.st{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:radial-gradient(120% 90% at 78% 40%,#0B3470 0%,#021E4B 62%);color:#fff}
.st>*{position:absolute}
.grano{inset:0;width:100%;height:100%;opacity:.16;mix-blend-mode:soft-light;z-index:20}
.fantasma{left:-30px;bottom:-62px;font:italic 400 250px/1 S;color:rgba(142,192,240,.07);white-space:nowrap;z-index:1}
.eyebrow{left:64px;top:62px;font:600 17px M;letter-spacing:.22em;text-transform:uppercase;color:#8EC0F0;display:flex;align-items:center;gap:.7em;z-index:6}
.eyebrow::before{content:"";width:.6em;height:.6em;border-radius:50%;background:currentColor}
.titulo{left:60px;top:106px;width:720px;font:400 104px/.92 S;letter-spacing:-.015em;z-index:6}
.titulo em{color:#8EC0F0}
.etiqueta{left:66px;top:322px;font:italic 400 44px/1.05 S;background:#fff;color:#021E4B;padding:.06em .3em .12em;rotate:-2deg;box-shadow:0 12px 26px -14px rgba(0,0,0,.6);z-index:6}
.etiqueta em{color:#1D78C9}
.servicios{left:66px;top:430px;display:flex;gap:14px;font:600 17px M;letter-spacing:.04em;color:#B9C6DA;z-index:6}
.servicios span{display:flex;align-items:center;gap:14px}
.servicios span+span::before{content:"";width:7px;height:7px;border-radius:50%;background:#1D78C9}
.logo{left:64px;bottom:54px;height:40px;width:auto;z-index:8}
.papel{z-index:2}
.cerebro{z-index:2;filter:drop-shadow(0 20px 30px rgba(0,8,30,.45))}
.persona{z-index:4;filter:drop-shadow(0 18px 30px rgba(0,8,30,.5))}
.trazos{left:0;top:0;z-index:3;overflow:visible}
</style></head><body><div class="st">
<div class="fantasma">neuroinclusión</div>
<p class="eyebrow">${eyebrow}</p>
<h1 class="titulo">${titulo}</h1>
<p class="etiqueta">${etiqueta}</p>
<p class="servicios">${servicios.map(t => `<span>${t}</span>`).join('')}</p>
<div class="papel" style="left:742px;top:78px;width:380px;height:470px;background:#1D78C9;rotate:4deg;clip-path:${rasgado(380, 470, r)}"></div>
<img class="cerebro" src="${f('materiales/generadas/cerebro-dual-recorte.png')}" style="left:985px;top:12px;width:225px;rotate:12deg">
<img class="persona" src="${f('materiales/generadas/equipo/recorte-adriana.png')}" style="left:640px;bottom:0;height:560px">
<svg class="trazos" width="${W}" height="${H}">${trazo({ cx: 930, cy: 320, rx: 285, ry: 245, vueltas: 1.3, inicio: 2.4, seed: 5 }, '#8EC0F0', 3)}</svg>
${logo}
${grano}
</div></body></html>`;
}

function foto(html, salida) {
  const archivo = path.join(TMP, 'p.html');
  fs.writeFileSync(archivo, html);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1',
    '--window-size=1200,630', '--virtual-time-budget=4000', `--screenshot=${salida}`, 'file://' + archivo], { stdio: 'ignore' });
}

const PIEZAS = [
  { archivo: 'og-imagen.jpg', eyebrow: 'Neuroinclusión · Costa Rica', titulo: 'Comprender<br>para <em>acompañar.</em>', etiqueta: 'Empresas, escuelas y <em>familias</em>', servicios: ['Capacitación', 'Evaluación', 'Acompañamiento'] },
  { archivo: 'og-manual.jpg', eyebrow: 'Manual de marca', titulo: 'Comprender<br>para <em>acompañar.</em>', etiqueta: 'Identidad visual de <em>NeuroInsight</em>', servicios: ['Logo', 'Color', 'Letra', 'Imagen', 'Movimiento'] }
];
for (const p of PIEZAS) {
  const png = path.join(TMP, p.archivo + '.png');
  foto(escena(p), png);
  await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(RAIZ, 'img', p.archivo));
  console.log('compartir', p.archivo);
}
fs.rmSync(TMP, { recursive: true, force: true });
