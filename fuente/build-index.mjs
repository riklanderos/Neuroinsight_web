import fs from 'fs';
import { ARTICULOS } from './blog/articulos.mjs';
const s=JSON.parse(fs.readFileSync(new URL('logo-split.json', import.meta.url))), m=JSON.parse(fs.readFileSync(new URL('logo-meta.json', import.meta.url)));
const V=process.argv[2]||'20261026c';
let h=fs.readFileSync(new URL('index.tpl.html', import.meta.url),'utf8');
const ARROW='<svg viewBox="0 0 34 12" aria-hidden="true"><path d="M1 6h24"/><circle cx="29" cy="6" r="4"/></svg>';
// Tira del blog en Recursos: las cinco portadas, deslizables en el celular
const BLOG_TIRA=`<div class="del-blog">
      <div class="del-blog__tira" data-lenis-prevent>
        ${ARTICULOS.map(a=>`<a class="del-blog__item" href="blog/${a.slug}/" data-reveal><img src="img/blog/${a.imagen || a.slug}-portada-720.webp" width="720" height="900" alt="" loading="lazy" decoding="async"><span class="del-blog__cat">${a.categoria}</span><span class="del-blog__t">${a.h1}</span></a>`).join('\n        ')}
      </div>
      <a class="link-node" href="blog/">Ver todo el blog ${ARROW}</a>
    </div>`;
h=h.replace(/%%WA:([^%]+)%%/g,(_,msg)=>'https://wa.me/50671024989?text='+encodeURIComponent(msg));
const map={VB_ALL:m.all,VB_SYM:m.sym,NAVY_SYM:s.navySym,BLUE_SYM:s.blueSym,NAVY_WORD:s.navyWord,BLUE_WORD:s.blueWord,ARROW,V,BLOG_TIRA};
h=h.replace(/%%(\w+)%%/g,(_,k)=>{if(!(k in map))throw new Error('falta '+k);return map[k]});
fs.writeFileSync(new URL('../index.html', import.meta.url),h);
console.log('index ok',Math.round(h.length/1024)+'KB', (h.match(/wa\.me/g)||[]).length,'enlaces WA');
