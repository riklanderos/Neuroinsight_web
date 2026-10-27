/* ==========================================================
   NeuroInsight · Manual de marca
   La firma de la portada (firmaPortada) es la misma que usará el sitio.
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

  // Cálido, preciso y sereno: sin rebotes salvo en los nodos
  const M = { ease: 'power3.out', easeIO: 'power3.inOut', pop: 'back.out(1.4)', dur: 1, stagger: 0.085, dist: 26, lerp: 0.085 };

  if (!hasGSAP) {
    html.classList.remove('js');
    const r = $('[data-ver-de-nuevo]'); if (r) r.hidden = true;
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });

  // 2. Lenis
  let lenis = null;
  if (!RM && window.Lenis && M.lerp) {
    lenis = new Lenis({ lerp: M.lerp, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  d.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const el = a.getAttribute('href').length > 1 && d.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: -10, duration: 1.4 });
    else el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
  });

  // 3. Circuito que lleva del cerebro al botón (siempre se dibuja, aunque no haya movimiento)
  const trazarCamino = () => {
    const svg = $('.hero .camino');
    const desde = $('[data-camino-desde]');
    const hasta = $('[data-camino-hasta]');
    if (!svg || !desde || !hasta) return null;
    const h = svg.getBoundingClientRect();
    const a = desde.getBoundingClientRect();
    const b = hasta.getBoundingClientRect();
    const lado = a.left > b.right;                  // escritorio: el cerebro está a la derecha del botón
    // Escritorio: sale del borde izquierdo del cerebro, corre por debajo del texto y sube al botón.
    // Celular: sale junto a la palabra INSIGHT y llega al costado derecho del botón.
    const w = $(".palabra-fondo span");
    const r = w ? w.getBoundingClientRect() : a;
    const x1 = (lado ? a.left + a.width * 0.13 : Math.min(r.right + 12, window.innerWidth - 10)) - h.left;
    const y1 = (lado ? Math.max(a.top + a.height * 0.8, b.bottom + 44) : r.top + r.height * 0.42) - h.top;
    const x2 = (lado ? b.left + b.width / 2 : b.right + 12) - h.left;
    const y2 = (lado ? b.bottom + 12 : b.top + b.height / 2) - h.top;
    const dx = x2 - x1, dy = y2 - y1;
    // Como en el logo: un tramo recto y un quiebre a 45 grados hasta el nodo
    const mid = Math.abs(dy) >= Math.abs(dx)
      ? [x1, y2 - Math.sign(dy) * Math.abs(dx)]
      : [x2 - Math.sign(dx) * Math.abs(dy), y1];
    svg.setAttribute('viewBox', `0 0 ${h.width} ${h.height}`);
    const path = $('path', svg);
    path.setAttribute('d', `M${x1},${y1} L${mid[0]},${mid[1]} L${x2},${y2}`);
    const [ring, node] = [$('.camino__anillo', svg), $('.camino__nodo', svg)];
    ring.setAttribute('cx', x1); ring.setAttribute('cy', y1);
    node.setAttribute('cx', x2); node.setAttribute('cy', y2);
    return { path, ring, node };
  };
  safe(trazarCamino);
  let anchoCamino = window.innerWidth, rCamino;
  window.addEventListener('resize', () => {
    if (window.innerWidth === anchoCamino) return;
    anchoCamino = window.innerWidth;
    clearTimeout(rCamino);
    rCamino = setTimeout(() => safe(() => {
      const c = trazarCamino();
      if (c) gsap.set(c.path, { strokeDasharray: 'none', strokeDashoffset: 0 });
    }), 200);
  });

  const dibujarCamino = (c) => {
    const tl = gsap.timeline();
    if (!c) return tl;
    const L = c.path.getTotalLength();
    const btn = $('[data-camino-hasta]');
    return tl
      .call(() => btn && btn.classList.remove('is-lit'), null, 0)
      .fromTo(c.path, { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0.1)
      .fromTo(c.ring, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.5, ease: M.pop }, 0)
      .fromTo(c.path, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: M.dur * 1.1, ease: 'power2.inOut' }, 0.1)
      .fromTo(c.node, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.55, ease: M.pop }, '-=0.15')
      .call(() => btn && btn.classList.add('is-lit'), null, '<');
  };

  // 4. Menos movimiento: todo completo y quieto, "Ver de nuevo" solo con fundidos
  const repetir = $('[data-ver-de-nuevo]');
  if (RM) {
    const aviso = $('[data-aviso-rm]');
    if (aviso) aviso.hidden = false;
    if (repetir) repetir.addEventListener('click', () => {
      gsap.fromTo('.hero__title, [data-hero-in], .cerebro, .etiqueta, .hero__sello', { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5, stagger: 0.12, ease: 'none' });
    });
    return;
  }

  // 5. Estados iniciales
  gsap.set('[data-reveal]', { y: M.dist, opacity: 0 });

  // 6. Efectos de scroll
  safe(() => {
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: (lote) => gsap.to(lote, { y: 0, opacity: 1, duration: M.dur, ease: M.ease, stagger: Math.min(M.stagger, 0.6 / lote.length), overwrite: true }),
    });
  });

  const splitReveals = () => safe(() => {
    if (!window.SplitText) return;
    $$('[data-split]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'linea', autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, {
          yPercent: 130, duration: M.dur, stagger: M.stagger, ease: M.ease,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
      });
    });
  });

  // Firma del cierre: el símbolo se dibuja y luego se rellena
  safe(() => {
    const iso = $('.cierre__iso');
    if (!iso) return;
    const paths = $$('path', iso);
    paths.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L, fillOpacity: 0 }); });
    gsap.timeline({ scrollTrigger: { trigger: iso, start: 'top 85%', once: true } })
      .to(paths, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' })
      .to(paths, { fillOpacity: 1, duration: 0.7, ease: M.ease }, '-=0.5');
  });

  // Demostraciones de los elementos gráficos
  const demos = {
    nodos: (t) => gsap.fromTo($$('i', t), { scale: 0 }, { scale: 1, duration: 0.6, stagger: 0.12, ease: M.pop }),
    circuito: (t) => {
      const lines = $$('path', t), dots = $$('circle', t);
      const tl = gsap.timeline();
      lines.forEach((p, i) => { const L = p.getTotalLength(); tl.fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: M.dur * 1.2, ease: 'power2.inOut' }, i * 0.25); });
      tl.fromTo(dots, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, stagger: 0.15, ease: M.pop }, 0.2);
      return tl;
    },
    split: (t) => gsap.timeline()
      .fromTo(t.children[0], { xPercent: -60, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: M.dur * 1.1, ease: M.ease }, 0)
      .fromTo(t.children[1], { xPercent: 60, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: M.dur * 1.1, ease: M.ease }, 0),
    insight: (t) => gsap.fromTo($$('span', t), { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: M.dur, stagger: 0.06, ease: M.ease }),
  };
  $$('[data-demo]').forEach((b) => {
    const t = $(`[data-demo-target="${b.dataset.demo}"]`);
    if (!t) return;
    b.addEventListener('click', () => safe(() => demos[b.dataset.demo](t)));
    ScrollTrigger.create({ trigger: t, start: 'top 80%', once: true, onEnter: () => safe(() => demos[b.dataset.demo](t)) });
  });
  $$('.insight-demo span').forEach((s) => { s.style.display = 'inline-block'; });

  // 7. La firma: dos hemisferios que se encuentran, un pulso y el circuito hasta el botón
  let heroSplit = null;
  const firmaPortada = () => {
    const title = $('.hero__title');
    if (window.SplitText && !heroSplit) heroSplit = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'linea' });
    gsap.set(title, { visibility: 'visible', animation: 'none' });
    const lines = heroSplit ? heroSplit.lines : [title];
    const camino = trazarCamino();
    return gsap.timeline({ defaults: { ease: M.ease } })
      .fromTo('.nav__inner', { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: M.dur }, 0)
      .fromTo('.palabra-fondo span', { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: M.dur * 1.3, stagger: M.stagger }, 0)
      .fromTo('.hemi--l', { xPercent: -24, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: M.dur * 1.25 }, 0.1)
      .fromTo('.hemi--r', { xPercent: 24, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: M.dur * 1.25 }, 0.1)
      .fromTo('.pulso', { scale: 0.7, autoAlpha: 0.9 }, { scale: 1.9, autoAlpha: 0, duration: 1.3, ease: "power2.out", immediateRender: false }, 1.05)
      .fromTo(lines, { yPercent: 130 }, { yPercent: 0, duration: M.dur * 1.15, stagger: M.stagger }, 0.4)
      .fromTo('[data-hero-in]', { autoAlpha: 0, y: M.dist * 0.75 }, { autoAlpha: 1, y: 0, duration: M.dur, stagger: M.stagger }, 0.7)
      .fromTo('.etiqueta', { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: M.pop }, 1.25)
      .fromTo('.hero__sello', { scale: 0, rotate: -50 }, { scale: 1, rotate: 0, duration: 1, ease: M.pop }, 1.35)
      .add(dibujarCamino(camino), 1.45);
  };

  // 8. Arranque: cuando estén las fuentes, con tope de tiempo
  let tl = null;
  Promise.race([d.fonts ? d.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 1200))])
    .then(() => {
      safe(() => { tl = firmaPortada(); });
      splitReveals();
      ScrollTrigger.refresh();
    });
  if (repetir) repetir.addEventListener('click', () => { if (tl) tl.restart(); });
})();
