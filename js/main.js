/* ==========================================================
   NeuroInsight · Sitio
   1. Ayudantes y tokens  2. Lo que funciona siempre  3. Lenis
   4. Animaciones de scroll  5. Firma de la portada
   ========================================================== */
(() => {
  'use strict';

  // 1. Ayudantes, banderas y tokens de movimiento (cálido, preciso y sereno)
  const d = document;
  const html = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SAVE_DATA = !!(navigator.connection && navigator.connection.saveData);
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const safe = (fn) => { try { return fn(); } catch (e) { console.warn('[neuroinsight]', e); } };
  const M = { ease: 'power3.out', easeIO: 'power3.inOut', pop: 'back.out(1.4)', dur: 1, stagger: 0.085, dist: 26, lerp: 0.085 };
  const WA = '50671024989';
  const CORREO = 'info@neuroinsightcr.com';

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);
    ScrollTrigger.config({ ignoreMobileResize: true });
  } else {
    html.classList.remove('js');
  }

  let lenis = null;
  const scrollToEl = (el, instant) => {
    const off = -(($('[data-nav]') || {}).offsetHeight || 0) + 1;
    if (lenis) lenis.scrollTo(el, { offset: off, duration: instant ? 0 : 1.4, immediate: !!instant });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + off, behavior: RM || instant ? 'auto' : 'smooth' });
  };

  // 2. Lo que funciona siempre, con o sin GSAP y con menos movimiento

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
    if (!panel || !abrir) return null;
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

  // Enlaces internos suaves; los botones de cada panel dejan marcado el tipo de organización
  d.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = id && d.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (a.dataset.tipo) safe(() => {
      const r = $(`#form-propuesta input[name="tipo"][value="${a.dataset.tipo}"]`);
      if (r) r.checked = true;
    });
    setTimeout(() => scrollToEl(el), 10);
    history.replaceState(null, '', `#${id}`);
  });

  // Los artículos del blog llegan con ?tipo=… y dejan marcado el tipo de organización
  safe(() => {
    const tipo = new URLSearchParams(location.search).get('tipo');
    const r = tipo && $$('#form-propuesta input[name="tipo"]').find((i) => i.value === tipo);
    if (r) r.checked = true;
  });

  // Formulario de propuesta: arma el mensaje y lo abre en WhatsApp o en el correo
  safe(() => {
    const form = $('#form-propuesta');
    if (!form) return;
    const err = $('[data-form-error]', form);
    const f = form.elements;
    const faltantes = () => {
      const out = [];
      if (!f.nombre.value.trim()) out.push(f.nombre);
      if (!f.org.value.trim()) out.push(f.org);
      if (!form.querySelector('input[name="tipo"]:checked')) out.push(form.querySelector('input[name="tipo"]'));
      return out;
    };
    const mensaje = () => {
      const lines = ['Hola NeuroInsight, quisiera solicitar una propuesta para mi organización.', ''];
      const add = (k, v) => { if (v) lines.push(`${k}: ${v}`); };
      add('Nombre', f.nombre.value.trim());
      add('Organización', f.org.value.trim());
      add('Cargo', f.cargo.value.trim());
      add('Tipo', (form.querySelector('input[name="tipo"]:checked') || {}).value);
      add('Interés', f.servicio.value);
      add('Personas a impactar', f.personas.value);
      add('Mensaje', f.mensaje.value.trim());
      return lines.join('\n');
    };
    const validar = () => {
      $$('[aria-invalid]', form).forEach((x) => x.removeAttribute('aria-invalid'));
      const falta = faltantes();
      err.classList.toggle('is-visible', falta.length > 0);
      falta.forEach((x) => { if (x.type !== 'radio') x.setAttribute('aria-invalid', 'true'); });
      if (falta.length) { falta[0].focus(); return false; }
      return true;
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validar()) return;
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(mensaje())}`, '_blank', 'noopener');
    });
    $('[data-por-correo]', form).addEventListener('click', () => {
      if (!validar()) return;
      const asunto = `Solicitud de propuesta: ${f.org.value.trim()}`;
      window.location.href = `mailto:${CORREO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje())}`;
    });
    form.addEventListener('input', () => { if (err.classList.contains('is-visible') && !faltantes().length) err.classList.remove('is-visible'); });
  });

  // Pestañas de recursos (sin JS se ven todos los grupos)
  safe(() => {
    const list = $('[data-pestanas]');
    if (!list) return;
    const tabs = $$('[role="tab"]', list);
    const show = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        d.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
      if (hasGSAP) ScrollTrigger.refresh();
    };
    list.hidden = false;
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); show(tabs[(i + k + tabs.length) % tabs.length], true); }
      });
    });
    show(tabs[0]);
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
    if (items[0]) { items[0].classList.add('is-open'); $('.qa__q', items[0]).setAttribute('aria-expanded', 'true'); $('.qa__a', items[0]).inert = false; }
    requestAnimationFrame(() => { html.classList.add('qa-listo'); if (hasGSAP) ScrollTrigger.refresh(); });
  });

  // Barra fija del celular: aparece después de la portada y se esconde en el formulario y el cierre
  safe(() => {
    const bar = $('.mobile-cta');
    const startEl = $('[data-cta-start]');
    const ends = [$('#propuesta'), $('#contacto')].filter(Boolean);
    if (!bar || !startEl || !('IntersectionObserver' in window)) return;
    let past = false;
    const enVista = new Set();
    const update = () => {
      const on = past && enVista.size === 0;
      bar.classList.toggle('is-visible', on);
      bar.setAttribute('aria-hidden', String(!on));
      $$('a', bar).forEach((el) => { el.tabIndex = on ? 0 : -1; });
    };
    new IntersectionObserver(([e]) => { past = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }).observe(startEl);
    const io = new IntersectionObserver((ents) => { ents.forEach((e) => (e.isIntersecting ? enVista.add(e.target) : enVista.delete(e.target))); update(); }, { threshold: 0.1 });
    ends.forEach((el) => io.observe(el));
    update();
  });

  // Video decorativo: solo carga y corre mientras se ve
  safe(() => {
    const canAutoplay = !RM && !SAVE_DATA;
    $$('video[data-src]').forEach((v) => {
      const setPoster = () => { if (v.dataset.poster) { v.poster = v.dataset.poster; delete v.dataset.poster; } };
      const play = () => {
        if (!canAutoplay) return;
        if (!v.dataset.loaded) { v.src = v.dataset.src; v.dataset.loaded = '1'; }
        const p = v.play(); if (p && p.catch) p.catch(() => {});
      };
      if (!('IntersectionObserver' in window)) { setPoster(); play(); return; }
      new IntersectionObserver(([en], o) => { if (en.isIntersecting) { setPoster(); o.disconnect(); } }, { rootMargin: '800px 0px' }).observe(v);
      new IntersectionObserver(([en]) => { if (en.isIntersecting) play(); else v.pause(); }, { threshold: 0.05 }).observe(v);
    });
  });

  // Circuito que lleva del cerebro al botón principal (se ve completo aunque no haya movimiento)
  const trazarCamino = () => {
    const svg = $('.hero .camino');
    const desde = $('[data-camino-desde]');
    const hasta = $('[data-camino-hasta]');
    if (!svg || !desde || !hasta) return null;
    const h = svg.getBoundingClientRect();
    const a = desde.getBoundingClientRect();
    const b = hasta.getBoundingClientRect();
    const lado = a.left > b.right;                  // escritorio: el cerebro queda a la derecha del botón
    const w = $('.palabra-fondo span');
    const r = w ? w.getBoundingClientRect() : a;
    // Escritorio: sale del borde izquierdo del cerebro, corre por debajo del texto y sube al botón.
    // Celular: sale junto a la palabra INSIGHT y llega al costado derecho del botón.
    const x1 = (lado ? a.left + a.width * 0.13 : Math.min(r.right + 12, window.innerWidth - 10)) - h.left;
    const y1 = (lado ? Math.max(a.top + a.height * 0.8, b.bottom + 70) : r.top + r.height * 0.42) - h.top;
    const x2 = (lado ? b.left + b.width / 2 : b.right + 12) - h.left;
    const y2 = (lado ? b.bottom + 12 : b.top + b.height / 2) - h.top;
    const dx = x2 - x1, dy = y2 - y1;
    // Como en el logo: un tramo recto y un quiebre a 45 grados hasta el nodo
    const mid = Math.abs(dy) >= Math.abs(dx) ? [x1, y2 - Math.sign(dy) * Math.abs(dx)] : [x2 - Math.sign(dx) * Math.abs(dy), y1];
    svg.setAttribute('viewBox', `0 0 ${h.width} ${h.height}`);
    const path = $('path', svg);
    path.setAttribute('d', `M${x1},${y1} L${mid[0]},${mid[1]} L${x2},${y2}`);
    const ring = $('.camino__anillo', svg), node = $('.camino__nodo', svg);
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
    rCamino = setTimeout(() => safe(() => { const c = trazarCamino(); if (c && hasGSAP) gsap.set(c.path, { strokeDasharray: 'none', strokeDashoffset: 0, opacity: 1 }); }), 200);
  });

  if (!hasGSAP) return;

  // 3. Lenis
  if (!RM && window.Lenis && M.lerp) {
    lenis = new Lenis({ lerp: M.lerp, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  if (RM) {
    $$('[data-senales] li').forEach((li) => li.classList.add('is-on'));
    return;
  }

  // 4. Animaciones de scroll. Estados iniciales solo con GSAP: sin él, todo se ve completo.
  gsap.set('[data-reveal]', { y: M.dist, opacity: 0 });
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

  // Contadores con la cifra real ya escrita en el HTML
  safe(() => {
    $$('[data-count]').forEach((el) => {
      const end = parseFloat(el.dataset.count);
      if (isNaN(end)) return;
      const o = { v: 0 };
      el.textContent = '0';
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true,
        onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v); } }) });
    });
  });

  // Trazos de la marca que se dibujan (circuitos y comillas)
  safe(() => {
    $$('[data-draw]').forEach((svg) => {
      const lines = $$('path', svg);
      const dots = $$('circle', svg);
      lines.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
      if (dots.length) gsap.set(dots, { scale: 0, transformOrigin: "50% 50%" });
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 88%", once: true } })
        .to(lines, { strokeDashoffset: 0, duration: M.dur * 1.3, stagger: M.stagger, ease: "power2.inOut" });
      if (dots.length) tl.to(dots, { scale: 1, duration: 0.5, stagger: 0.1, ease: M.pop }, "-=0.35");
    });
  });

  // Organizaciones: los dos paneles entran desde lados opuestos y se encuentran, como los hemisferios
  safe(() => {
    const izq = $('[data-panel="izq"]'), der = $('[data-panel="der"]');
    if (!izq || !der) return;
    gsap.set(izq, { xPercent: -8, autoAlpha: 0 });
    gsap.set(der, { xPercent: 8, autoAlpha: 0 });
    gsap.timeline({ scrollTrigger: { trigger: izq.parentElement, start: 'top 82%', once: true } })
      .to([izq, der], { xPercent: 0, autoAlpha: 1, duration: M.dur * 1.25, ease: M.ease });
  });

  // Fotos de actividades: se abren de abajo hacia arriba
  safe(() => {
    const figs = $$('[data-foto]');
    gsap.set(figs, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(figs.map((f) => $('img', f)), { scale: 1.15 });
    ScrollTrigger.batch(figs, {
      start: 'top 92%',
      once: true,
      onEnter: (lote) => {
        gsap.to(lote, { clipPath: 'inset(0% 0% 0% 0%)', duration: M.dur * 1.2, ease: M.easeIO, stagger: 0.08 });
        gsap.to(lote.map((f) => $('img', f)), { scale: 1, duration: M.dur * 1.6, ease: M.ease, stagger: 0.08 });
      },
    });
  });

  // Proceso: el circuito avanza de nodo en nodo con el scroll
  safe(() => {
    const wrap = $('[data-pasos]');
    const bar = wrap && $('.pasos__riel i', wrap);
    if (!bar) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 960px)', () => { gsap.fromTo(bar, { scaleX: 0, scaleY: 1 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top 75%', end: 'bottom 55%', scrub: true } }); });
    mm.add('(max-width: 959px)', () => { gsap.fromTo(bar, { scaleY: 0, scaleX: 1 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top 70%', end: 'bottom 60%', scrub: true } }); });
  });

  // Señales: cada nodo se enciende al pasar, como una sinapsis
  safe(() => {
    $$('[data-senales] li').forEach((li) => {
      ScrollTrigger.create({ trigger: li, start: 'top 72%', once: true, onEnter: () => li.classList.add('is-on') });
    });
  });

  // Cierre: el símbolo se dibuja y se rellena
  safe(() => {
    const iso = $('.cierre__iso');
    if (!iso) return;
    const paths = $$('path', iso);
    paths.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L, fillOpacity: 0 }); });
    gsap.timeline({ scrollTrigger: { trigger: iso, start: 'top 85%', once: true } })
      .to(paths, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' })
      .to(paths, { fillOpacity: 1, duration: 0.7, ease: M.ease }, '-=0.5');
  });

  // 5. Firma de la portada: dos hemisferios que se unen, un pulso y el circuito hasta el botón
  const dibujarCamino = (c) => {
    const tl = gsap.timeline();
    if (!c) return tl;
    const L = c.path.getTotalLength();
    const btn = $('[data-camino-hasta]');
    return tl
      .fromTo(c.path, { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0.1)
      .fromTo(c.ring, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: M.pop }, 0)
      .fromTo(c.path, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: M.dur * 1.1, ease: 'power2.inOut' }, 0.1)
      .fromTo(c.node, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.55, ease: M.pop }, '-=0.15')
      .call(() => btn && btn.classList.add('is-lit'), null, '<');
  };

  const firmaPortada = () => {
    const title = $('.hero__title');
    const split = window.SplitText ? SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'linea' }) : null;
    gsap.set(title, { visibility: 'visible', animation: 'none' });
    const camino = trazarCamino();
    return gsap.timeline({ defaults: { ease: M.ease } })
      .fromTo('.nav__inner', { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: M.dur }, 0)
      .fromTo('.palabra-fondo span', { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: M.dur * 1.3, stagger: M.stagger }, 0)
      .fromTo('.hemi--l', { xPercent: -24, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: M.dur * 1.25 }, 0.1)
      .fromTo('.hemi--r', { xPercent: 24, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: M.dur * 1.25 }, 0.1)
      .fromTo('.pulso', { scale: 0.7, autoAlpha: 0.9 }, { scale: 1.9, autoAlpha: 0, duration: 1.3, ease: 'power2.out', immediateRender: false }, 1.05)
      .fromTo(split ? split.lines : title, { yPercent: 130 }, { yPercent: 0, duration: M.dur * 1.15, stagger: M.stagger }, 0.4)
      .fromTo('[data-hero-in]', { autoAlpha: 0, y: M.dist * 0.75 }, { autoAlpha: 1, y: 0, duration: M.dur, stagger: M.stagger }, 0.7)
      .fromTo('.etiqueta', { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: M.pop }, 1.25)
      .fromTo('.hero__sello', { scale: 0, rotate: -50 }, { scale: 1, rotate: 0, duration: 1, ease: M.pop }, 1.35)
      .add(dibujarCamino(camino), 1.45);
  };

  // Arranque: cuando estén las fuentes, con tope de tiempo
  Promise.race([d.fonts ? d.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 1200))])
    .then(() => {
      safe(firmaPortada);
      splitReveals();
      ScrollTrigger.refresh();
      if (location.hash) { const el = d.getElementById(location.hash.slice(1)); if (el) setTimeout(() => scrollToEl(el, true), 300); }
    });
})();
