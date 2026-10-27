// Builds compositions/intro.html from src/intro.template.html:
//  - injects the two traced paths of the brain symbol (assets/iso-color.svg)
//  - generates the circuit traces (45° elbows, round nodes)
import {readFileSync, writeFileSync} from 'node:fs';

const iso = readFileSync(new URL('./assets/iso-color.svg', import.meta.url), 'utf8');
const ds = [...iso.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
if (ds.length !== 2) throw new Error(`expected 2 paths in iso-color.svg, got ${ds.length}`);

// [points, end node type]; points in the 1080x1920 frame; only 0/45/90° turns
const TRACES = [
	[[[292, 560], [200, 560], [140, 500], [140, 330]], 'dot'],
	[[[296, 765], [210, 765], [150, 825], [150, 990]], 'ring'],
	[[[400, 432], [400, 330], [340, 270], [230, 270]], 'ring'],
	[[[680, 432], [680, 300], [740, 240], [860, 240]], 'dot'],
	[[[790, 560], [880, 560], [940, 500], [940, 380]], 'ring'],
	[[[786, 765], [870, 765], [930, 825], [930, 990]], 'dot'],
	[[[540, 876], [540, 962]], 'ring'],
];

const SKY = '#8EC0F0';
const LIGHT = '#DCE9F7';
const traceSvg = TRACES.map(([pts, type], i) => {
	const d = 'M ' + pts.map((p) => p.join(' ')).join(' L ');
	const [sx, sy] = pts[0];
	const [ex, ey] = pts[pts.length - 1];
	const node =
		type === 'dot'
			? `<circle cx="${ex}" cy="${ey}" r="10" fill="${SKY}" />`
			: `<circle cx="${ex}" cy="${ey}" r="9.5" fill="none" stroke="${SKY}" stroke-width="3.5" />`;
	return `<g class="trace" id="trace-${i + 1}">
            <path class="tr-line" d="${d}" pathLength="1" stroke="${SKY}" stroke-opacity="0.6" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 1.2" stroke-dashoffset="1.1" />
            <path class="tr-pulse" d="${d}" pathLength="1" stroke="${LIGHT}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.14 3" stroke-dashoffset="0.14" opacity="0" />
            <circle class="tr-start" cx="${sx}" cy="${sy}" r="5" fill="${SKY}" opacity="0" />
            <g class="tr-end" data-origin="${ex} ${ey}" opacity="0">
              <circle class="halo" cx="${ex}" cy="${ey}" r="22" fill="${SKY}" filter="url(#intro-halo)" opacity="0" />
              ${node}
            </g>
          </g>`;
}).join('\n          ');

let html = readFileSync(new URL('./src/intro.template.html', import.meta.url), 'utf8');
const outline = (d) => d.split(/(?=M )/).map((s) => `<path class="ol" pathLength="1" stroke-dasharray="1 1.2" stroke-dashoffset="1.1" d="${s.trim()}" />`).join('');
html = html.replace('__LEFT_OL__', outline(ds[0])).replace('__RIGHT_OL__', outline(ds[1]));
html = html.replace('__LEFT_D__', ds[0]).replace('__RIGHT_D__', ds[1]).replace('__TRACES__', traceSvg);
writeFileSync(new URL('./compositions/intro.html', import.meta.url), html);
console.log('compositions/intro.html written', html.length, 'bytes');
