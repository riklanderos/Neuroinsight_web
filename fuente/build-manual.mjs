import fs from 'fs';
const s=JSON.parse(fs.readFileSync(new URL('logo-split.json', import.meta.url))), m=JSON.parse(fs.readFileSync(new URL('logo-meta.json', import.meta.url)));
let h=fs.readFileSync(new URL('manual.tpl.html', import.meta.url),'utf8');
const map={VB_ALL:m.all,VB_SYM:m.sym,NAVY_SYM:s.navySym,BLUE_SYM:s.blueSym,NAVY_WORD:s.navyWord,BLUE_WORD:s.blueWord};
h=h.replace(/%%(\w+)%%/g,(_,k)=>map[k]);
fs.writeFileSync(new URL('../manual-de-marca.html', import.meta.url),h);
console.log('ok',Math.round(h.length/1024)+'KB', /%%/.test(h));
