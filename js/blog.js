/* ==========================================================
   NeuroInsight · Blog (índice y artículos)
   1. Ayudantes  2. Lo que funciona siempre  3. Lenis  4. Animaciones
   Mismos tokens de movimiento que el sitio: cálido, preciso y sereno.
   ========================================================== */
(() => {
  'use strict';

  // 1. Ayudantes, banderas y tokens de movimiento
  const d = document;
  const html = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const safe = (fn) => { try { return fn(); } catch (e) { console.warn('[neuroinsight]', e); } };
  const M = { ease: 'power3.out', pop: 'back.out(1.4)', dur: 1, stagger: 0.085, dist: 26, lerp: 0.085 };

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);
    ScrollTrigger.config({ ignoreMobileResize: true });
  } else {
    html.classList.remove('js');
  }

  let lenis = null;
  const navH = () => (($('[data-nav]') || {}).offsetHeight || 0);

  // 2. Lo que funciona siempre

  // Barra de navegación con fondo al bajar
  safe(() => {
    const nav = $('[data-nav]');
    let tick = false;
    const upd = () => { nav.classList.toggle('is-scrolled', window.scrollY > 12); tick = false; };
    window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  });

  // Menú del celular
  safe(() => {
    const panel = $('[data-menu]');
    const abrir = $('[data-menu-abrir]');
    if (!panel || !abrir) return;
    const set = (open) => {
      panel.classList.toggle('is-open', open);
      abrir.setAttribute('aria-expanded', String(open));
      if (lenis) open ? lenis.stop() : lenis.start();
      d.body.style.overflow = open ? 'hidden' : '';
      if (open) $('a', panel).focus(); else abrir.focus({ preventScroll: true });
    };
    abrir.addEventListener('click', () => set(true));
    $('[data-menu-cerrar]').addEventListener('click', () => set(false));
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('is-open')) set(false); });
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  });

  // Índice del artículo: salto suave y sección activa
  safe(() => {
    const links = $$('[data-indice] a');
    if (!links.length) return;
    d.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      const el = a && d.getElementById(a.getAttribute('href').slice(1));
      if (!el) return;
      e.preventDefault();
      const off = -navH() - 16;
      if (lenis) lenis.scrollTo(el, { offset: off, duration: 1.2 });
      else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + off, behavior: RM ? 'auto' : 'smooth' });
      history.replaceState(null, '', a.getAttribute('href'));
    });
    if (!('IntersectionObserver' in window)) return;
    const mapa = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.removeAttribute('aria-current'));
        const l = mapa.get(en.target.id);
        if (l) l.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    mapa.forEach((_, id) => { const el = d.getElementById(id); if (el) io.observe(el); });
  });

  // Barra de lectura
  safe(() => {
    const bar = $('[data-progreso]');
    const art = $('article');
    if (!bar || !art) return;
    let tick = false;
    const upd = () => {
      const r = art.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      bar.style.transform = `scaleX(${p})`;
      tick = false;
    };
    window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  });

  // Preguntas frecuentes: una abierta a la vez
  safe(() => {
    const items = $$('.qa');
    items.forEach((qa, n) => {
      const b = $('.qa__q', qa);
      const a = $('.qa__a', qa);
      a.id = `qa-${n + 1}`;
      a.setAttribute('role', 'region');
      b.setAttribute('aria-controls', a.id);
      a.inert = true;
      b.addEventListener('click', () => {
        const open = !qa.classList.contains('is-open');
        items.forEach((o) => {
          if (o === qa || !o.classList.contains('is-open')) return;
          o.classList.remove('is-open');
          $('.qa__q', o).setAttribute('aria-expanded', 'false');
          $('.qa__a', o).inert = true;
        });
        qa.classList.toggle('is-open', open);
        b.setAttribute('aria-expanded', String(open));
        a.inert = !open;
        if (hasGSAP) setTimeout(() => ScrollTrigger.refresh(), 650);
      });
    });
    requestAnimationFrame(() => html.classList.add('qa-listo'));
  });

  // Filtros del índice
  safe(() => {
    const grupo = $('[data-filtros]');
    if (!grupo) return;
    grupo.hidden = false;
    const botones = $$('[data-filtro]', grupo);
    const tarjetas = $$('[data-tarjeta]');
    grupo.addEventListener('click', (e) => {
      const b = e.target.closest('[data-filtro]');
      if (!b) return;
      botones.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
      const f = b.dataset.filtro;
      const visibles = [];
      tarjetas.forEach((t) => { const on = f === 'Todos' || t.dataset.cat === f; t.hidden = !on; if (on) visibles.push(t); });
      if (hasGSAP && !RM) gsap.fromTo(visibles, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: M.ease, stagger: 0.06, overwrite: true });
      if (hasGSAP) ScrollTrigger.refresh();
    });
  });

  // Copiar enlace
  safe(() => {
    const b = $('[data-copiar]');
    if (!b || !navigator.clipboard) { if (b) b.hidden = true; return; }
    b.addEventListener('click', () => navigator.clipboard.writeText(b.dataset.copiar).then(() => {
      const t = b.textContent; b.textContent = 'Enlace copiado'; setTimeout(() => { b.textContent = t; }, 1800);
    }));
  });

  // Barra fija del celular: aparece al pasar la cabecera y se esconde en el cierre
  safe(() => {
    const bar = $('.mobile-cta');
    const startEl = $('.art-cab, .blog-hero');
    const fin = $('#contacto');
    if (!bar || !startEl || !('IntersectionObserver' in window)) return;
    let past = false, enFin = false;
    const update = () => {
      const on = past && !enFin;
      bar.classList.toggle('is-visible', on);
      bar.setAttribute('aria-hidden', String(!on));
      $$('a', bar).forEach((el) => { el.tabIndex = on ? 0 : -1; });
    };
    new IntersectionObserver(([e]) => { past = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }).observe(startEl);
    if (fin) new IntersectionObserver(([e]) => { enFin = e.isIntersecting; update(); }, { threshold: 0.05 }).observe(fin);
  });

  if (!hasGSAP) return;

  // 3. Lenis
  if (!RM && window.Lenis) {
    lenis = new Lenis({ lerp: M.lerp, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  if (RM) return;

  // 4. Animaciones. Estados iniciales solo con GSAP: sin él, todo se ve completo.
  gsap.set('[data-reveal]', { y: M.dist, opacity: 0 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%', once: true,
    onEnter: (lote) => gsap.to(lote, { y: 0, opacity: 1, duration: M.dur, ease: M.ease, stagger: Math.min(M.stagger, 0.6 / lote.length), overwrite: true }),
  });

  // Tarjetas: cada portada entra como un recorte que se pega en la página
  safe(() => {
    const tarjetas = $$('[data-tarjeta]');
    gsap.set(tarjetas, { y: 40, opacity: 0, rotate: (i) => (i % 2 ? 1.6 : -1.6) });
    ScrollTrigger.batch(tarjetas, {
      start: 'top 92%', once: true,
      onEnter: (lote) => gsap.to(lote, { y: 0, opacity: 1, rotate: 0, duration: 1.1, ease: M.pop, stagger: 0.1, overwrite: true }),
    });
  });

  // Cierre: el símbolo se dibuja y se rellena (igual que en la página principal)
  safe(() => {
    const iso = $('.cierre__iso');
    if (!iso) return;
    const paths = $$('path', iso);
    paths.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L, fillOpacity: 0 }); });
    gsap.timeline({ scrollTrigger: { trigger: iso, start: 'top 85%', once: true } })
      .to(paths, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' })
      .to(paths, { fillOpacity: 1, duration: 0.7, ease: M.ease }, '-=0.5');
  });

  // Firma del blog: las portadas caen como recortes y el trazo las rodea hasta su nodo
  const entrada = () => {
    const tl = gsap.timeline({ defaults: { ease: M.ease } });
    tl.fromTo('.nav__inner', { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: M.dur }, 0);
    const pila = $$('.pila__p');
    if (pila.length) {
      tl.fromTo(pila, { y: 120, rotate: (i) => [-14, 10, 22][i], autoAlpha: 0, scale: 0.92 },
        { y: 0, rotate: (i) => [-7, 3, 11][i], autoAlpha: 1, scale: 1, duration: 1.3, ease: M.pop, stagger: 0.14 }, 0.2);
    }
    const portada = $('[data-portada] img');
    if (portada) tl.fromTo(portada, { y: 60, rotate: 7, autoAlpha: 0 }, { y: 0, rotate: -2.5, autoAlpha: 1, duration: 1.3, ease: M.pop }, 0.25);
    const trazo = $('[data-portada] [data-draw]');
    if (trazo) {
      const L = trazo.getTotalLength();
      const nodo = trazo.nextElementSibling;
      tl.fromTo(trazo, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.7)
        .fromTo(nodo, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: M.pop }, '-=0.2');
    }
    if (window.SplitText) {
      $$('[data-split]').forEach((el) => {
        // El título de la cabecera entra con la firma; al terminar se deshace la división para que reacomode al cambiar el ancho
        if (el.closest('.art-cab, .blog-hero')) {
          const sp = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'linea' });
          tl.fromTo(sp.lines, { yPercent: 130 }, { yPercent: 0, duration: M.dur * 1.1, stagger: M.stagger, onComplete: () => sp.revert() }, 0.3);
          return;
        }
        SplitText.create(el, {
          type: 'lines', mask: 'lines', linesClass: 'linea', autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, { yPercent: 130, duration: M.dur, stagger: M.stagger, ease: M.ease, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
        });
      });
    }
    return tl;
  };

  // Arranque: cuando estén las fuentes, con tope de tiempo
  Promise.race([d.fonts ? d.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 1200))])
    .then(() => { safe(entrada); ScrollTrigger.refresh(); });
})();
