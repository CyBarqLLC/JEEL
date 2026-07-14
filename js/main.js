/* ═══════════════════════════════════════════════════════
   JEEL WELLNESS — main.js
   Animations · Globe · Language · Video Strip
═══════════════════════════════════════════════════════ */
'use strict';

// ── Utilities ─────────────────────────────────────────
const isMobile  = () => window.innerWidth <= 480;
const isTablet  = () => window.innerWidth > 480 && window.innerWidth <= 900;
const isTouch   = () => ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

// ── Boot ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLang();
  initNavbar();
  initMobileNav();
  initHeroLeaves();
  initHeroProducts();
  initHeroEntrance();
  initAssetProtection();
  initAboutFx();
  initMomentsCarousel();
  initReveal();
  initCollagenReveal();
  initVideoStrip();
  initGlobe();
  initGlobeLeaves();
});

/* ══════════════════════════════════════════════════════
   LANGUAGE SWITCHER
══════════════════════════════════════════════════════ */
function initLang() {
  const btn  = document.getElementById('langSwitcher');
  let   lang = localStorage.getItem('jeel-lang') || 'en';
  applyLang(lang, false);

  btn.addEventListener('click', () => {
    lang = lang === 'en' ? 'ar' : 'en';
    localStorage.setItem('jeel-lang', lang);
    applyLang(lang, true);
  });
}

function applyLang(lang, animate) {
  const html = document.documentElement;
  const btn  = document.getElementById('langSwitcher');
  const enEl = btn.querySelector('.lang-en');
  const arEl = btn.querySelector('.lang-ar');

  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.body.classList.toggle('lang-ar', lang === 'ar');
  enEl.classList.toggle('active', lang === 'en');
  arEl.classList.toggle('active', lang === 'ar');

  // Toggle data-lang blocks
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('hidden', el.dataset.lang !== lang);
  });

  // Swap data-en / data-ar text
  document.querySelectorAll('[data-en]').forEach(el => {
    const txt = el.dataset[lang];
    if (txt) el.textContent = txt;
  });

  // Re-trigger reveals in newly shown blocks
  requestAnimationFrame(() => {
    document.querySelectorAll(`[data-lang="${lang}"] .reveal:not(.visible)`).forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        setTimeout(() => el.classList.add('visible'), i * 90);
      }
    });

    // Re-trigger pillar stagger for the newly visible language block
    document.querySelectorAll(`[data-lang="${lang}"] .jeel-name-pillars`).forEach(container => {
      const rect = container.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        container.querySelectorAll('.jeel-name-pillar:not(.pillar-visible)').forEach((p, i) => {
          setTimeout(() => p.classList.add('pillar-visible'), i * 220);
        });
      }
    });
  });

  // Smooth values row direction reset on language switch
  if (animate) {
    const valRow = document.querySelector('.vt-row');
    if (valRow) {
      valRow.style.transition = 'opacity 0.22s ease';
      valRow.style.opacity    = '0';
      setTimeout(() => {
        valRow.style.opacity = '1';
        setTimeout(() => { valRow.style.transition = ''; }, 280);
      }, 220);
    }
  }

  // Re-animate hero lines when language toggles interactively
  if (animate) {
    const prevLang  = lang === 'ar' ? 'en' : 'ar';
    const prevLines = document.querySelectorAll(
      `.hero-tagline-${prevLang} .hero-line`
    );
    const visLines  = document.querySelectorAll(
      `.hero-tagline-${lang} .hero-line`
    );

    // Hide outgoing language lines instantly
    prevLines.forEach(el => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(34px)';
    });

    // Animate incoming language lines in
    visLines.forEach(el => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(34px)';
    });

    setTimeout(() => {
      if (window.gsap) {
        gsap.to(visLines, {
          opacity: 1, y: 0,
          duration: 0.85, stagger: 0.10, ease: 'power3.out',
        });
      } else {
        visLines.forEach((el, i) => {
          el.style.transition =
            `opacity 0.85s ${i * 0.1}s ease, transform 0.85s ${i * 0.1}s ease`;
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        });
      }
    }, 80);
  }
}

/* ══════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

function initMobileNav() {
  const burger   = document.getElementById('navBurger');
  const links    = document.getElementById('navLinks');
  const navInner = document.querySelector('.nav-inner');

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.classList.toggle('active', open);
    navInner?.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.classList.remove('active');
      navInner?.classList.remove('menu-open');
    });
  });
}

/* ══════════════════════════════════════════════════════
   HERO LEAF PARTICLES
══════════════════════════════════════════════════════ */
function initHeroLeaves() {
  const container = document.getElementById('heroLeaves');
  if (!container) return;

  // Three pre-colored SVGs — no CSS filter tricks needed
  const leafSrcs    = ['leaf-blue.svg', 'leaf-yellow.svg', 'leaf-pink.svg'];
  // Boosted opacity (+12%) — leaves now more present and elegant
  const leafOpacity = [0.42, 0.34, 0.32];
  // Color distribution: blue-heavy, accent sparingly
  const leafColorMap = [0, 0, 1, 0, 2, 0, 0, 1, 0, 2, 0, 0];

  const count = isMobile() ? 6 : 10;

  for (let i = 0; i < count; i++) {
    const wrap = document.createElement('div');
    wrap.className = 'hero-leaf';

    const img = document.createElement('img');
    const colorIdx = leafColorMap[i % leafColorMap.length];
    img.src = leafSrcs[colorIdx];
    img.alt = '';
    img.loading = 'lazy';

    const size  = 28 + Math.random() * 62;   // slightly larger leaves
    const x     = Math.random() * 88 + 2;
    const y     = Math.random() * 78 + 4;
    const rot   = Math.random() * 360;
    // Faster: 4–10s instead of 7–16s
    const dur   = 4 + Math.random() * 6;
    const delay = Math.random() * 4;

    wrap.style.cssText = `width:${size}px;left:${x}%;top:${y}%;`;
    img.style.opacity = String(leafOpacity[colorIdx]);

    wrap.appendChild(img);
    container.appendChild(wrap);

    const kf   = `hlf${i}`;
    // More dramatic drift path — wider X and taller Y
    const dx   = (Math.random() - 0.5) * 48;
    const dy   = -28 - Math.random() * 44;
    const drot = rot + 55 + Math.random() * 35;

    const midX = (Math.random() - 0.5) * 22;
    const midY = -(14 + Math.random() * 18);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${kf} {
        0%   { transform: rotate(${rot}deg) translate(0,0); opacity: 0; }
        10%  { opacity: ${leafOpacity[colorIdx]}; }
        45%  { transform: rotate(${rot + (drot - rot) * 0.4}deg) translate(${midX}px,${midY}px); }
        88%  { opacity: ${leafOpacity[colorIdx]}; }
        100% { transform: rotate(${drot}deg) translate(${dx}px,${dy}px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    wrap.style.animation = `${kf} ${dur}s ${delay}s ease-in-out infinite`;
  }
}

/* ══════════════════════════════════════════════════════
   HERO PRODUCTS — two-mode system
   • Mobile / Touch : lightweight CSS keyframe float
   • Desktop        : JS rAF with X+Y+rotation + cursor parallax
   This prevents the CSS↔JS transform conflict that hid
   products on iPhone Safari.
══════════════════════════════════════════════════════ */
function initHeroProducts() {
  const products = document.querySelectorAll('.product-float');
  if (!products.length) return;

  if (isMobile() || isTouch()) {
    /* ── Mobile mode: pure CSS, visible + dynamic float ── */
    products.forEach((el, i) => {
      // Prominent float on mobile — clearly visible, premium feel
      const dur   = 3.2 + i * 0.45;
      const ampY  = 26 + i * 2.0;          // 26 → 34px range
      const ampR  = 0.35 + i * 0.12;       // subtle rotation only
      const delay = i * 0.52;
      const kf    = `pmf${i}`;
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ${kf} {
          0%   { transform: translateY(0px) rotate(0deg); }
          30%  { transform: translateY(-${ampY * 0.6}px) rotate(${i % 2 === 0 ? ampR * 0.5 : -ampR * 0.5}deg); }
          60%  { transform: translateY(-${ampY}px) rotate(${i % 2 === 0 ? ampR : -ampR}deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `;
      document.head.appendChild(style);
      el.style.willChange = 'auto';
      el.style.animation  = `${kf} ${dur}s ${delay}s ease-in-out infinite`;
    });
    return;
  }

  /* ── Desktop mode: JS-driven float + cursor parallax ──
     Significantly boosted amplitudes — products are truly alive.
     Rotation adds strong cinematic depth quality. */

  // [ampY, ampX, rotAmp, freqBase, phase, cursorDepth]
  const params = [
    { aY: 22, aX: 6.0, aR: 2.8, freq: 0.00042, ph: 0.0,           cd: 0.055 },
    { aY: 28, aX: 7.5, aR: 3.5, freq: 0.00048, ph: Math.PI * 0.3,  cd: 0.085 },
    { aY: 18, aX: 5.0, aR: 2.2, freq: 0.00036, ph: Math.PI * 0.8,  cd: 0.065 },
    { aY: 16, aX: 4.2, aR: 1.8, freq: 0.00055, ph: Math.PI * 1.4,  cd: 0.042 },
    { aY: 20, aX: 5.5, aR: 2.5, freq: 0.00044, ph: Math.PI * 1.1,  cd: 0.075 },
  ];

  // Base opacity for each product (from CSS — p1..p5)
  const baseOpacities = [0.94, 0.96, 0.88, 0.72, 0.90];

  // Scroll depth multipliers — deeper products drift faster
  const scrollDepths = [0.38, 0.55, 0.30, 0.22, 0.42];

  let mx = 0, my = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  const hero = document.querySelector('.hero');

  const tick = (ts) => {
    // Scroll parallax — products drift upward at depth-based rates
    const scrollY    = window.scrollY;
    const heroH      = hero ? hero.offsetHeight : window.innerHeight;
    const scrollProg = Math.min(scrollY / (heroH * 0.85), 1);

    // Smooth cursor follow
    cx += (mx - cx) * 0.038;
    cy += (my - cy) * 0.038;

    products.forEach((el, i) => {
      const p = params[i] || params[0];
      const t = ts;

      // Compound sine waves for organic float feel
      const floatY = Math.sin(t * p.freq + p.ph) * p.aY
                   + Math.sin(t * p.freq * 1.7 + p.ph + 0.5) * p.aY * 0.2;
      const floatX = Math.sin(t * p.freq * 0.63 + p.ph + 1.1) * p.aX;
      const rotZ   = Math.sin(t * p.freq * 0.48 + p.ph + 0.3) * p.aR;

      // Cursor contribution
      const cursorX = cx * p.cd * 62;
      const cursorY = cy * p.cd * 40;

      // Scroll contribution — each product drifts at its own depth rate
      const scrollOffY = -scrollProg * scrollDepths[i] * heroH * 0.55;
      const scrollOffX =  scrollProg * (i % 2 === 0 ? -1 : 1) * scrollDepths[i] * 28;

      // Fade out as hero scrolls away — deeper products vanish sooner
      const fade = Math.max(0, 1 - scrollProg * (1.1 + scrollDepths[i] * 0.5));
      el.style.opacity = String(fade * baseOpacities[i]);

      el.style.transform =
        `translate(${floatX + cursorX + scrollOffX}px, ${floatY + cursorY + scrollOffY}px) rotate(${rotZ}deg)`;
    });

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ══════════════════════════════════════════════════════
   HERO ENTRANCE
   Animates the correct language tagline on every load.

   Root cause of the Arabic-refresh bug:
   • .hero-line starts at opacity:0 / translateY(30px) in CSS
   • initLang() runs FIRST and sets html[lang] to the saved value
   • We read html[lang] here to pick the visible tagline
   • This ensures Arabic lines are animated on refresh, just
     like English lines always were.
   • Interactive language switching is handled separately by
     the animate=true branch inside applyLang().
══════════════════════════════════════════════════════ */
function initHeroEntrance() {
  // Read the language that initLang() has already applied
  // to <html lang="..."> — always correct, even after refresh.
  const lang     = document.documentElement.getAttribute('lang') || 'en';
  const selector = lang === 'ar'
    ? '.hero-tagline-ar .hero-line'
    : '.hero-tagline-en .hero-line';

  const lines = document.querySelectorAll(selector);
  const cta   = document.querySelector('.hero-cta');

  // Fallback: if no hero on this page, bail silently
  if (!lines.length) return;

  // Ensure lines start from their CSS-initial hidden state
  // (already true from CSS, but guard against any prior inline style)
  lines.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(34px)';
  });

  const run = () => {
    if (window.gsap) {
      gsap.to(lines, {
        opacity: 1, y: 0,
        duration: 1.3, stagger: 0.18, ease: 'power3.out', delay: 0.25,
      });
      if (cta) gsap.to(cta, {
        opacity: 1, y: 0,
        duration: 1.0, ease: 'power3.out', delay: 0.95,
      });
    } else {
      lines.forEach((el, i) => {
        el.style.transition =
          `opacity 1.2s ${0.25 + i * 0.18}s ease, transform 1.2s ${0.25 + i * 0.18}s ease`;
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      });
      if (cta) {
        cta.style.transition = 'opacity 1s 0.95s ease, transform 1s 0.95s ease';
        cta.style.opacity    = '1';
        cta.style.transform  = 'translateY(0)';
      }
    }
  };

  setTimeout(run, 100);
}

/* ══════════════════════════════════════════════════════
   COLLAGEN WORD-BY-WORD REVEAL
   Splits the collagen statement into individual words,
   each revealed sequentially on scroll — cinematic and
   emotionally impactful without requiring GSAP.
══════════════════════════════════════════════════════ */
function initCollagenReveal() {
  const blocks = document.querySelectorAll('.collagen-statement');
  if (!blocks.length) return;

  blocks.forEach(block => {
    // Preserve <br/> line breaks while splitting into words
    const rawHTML = block.innerHTML;
    const lines   = rawHTML.split(/<br\s*\/?>/gi);
    block.innerHTML = '';

    let globalWordIdx = 0;

    lines.forEach((line, lineIdx) => {
      const words = line.trim().split(/\s+/).filter(Boolean);

      words.forEach(word => {
        const span = document.createElement('span');
        span.className   = 'collagen-word';
        span.textContent = word + ' '; // non-breaking space preserves word gap
        span.style.setProperty('--wi', String(globalWordIdx));
        block.appendChild(span);
        globalWordIdx++;
      });

      // Restore line break between lines
      if (lineIdx < lines.length - 1) {
        block.appendChild(document.createElement('br'));
      }
    });

    // Trigger reveal when the collagen card enters viewport
    const card = block.closest('.about-collagen') || block;
    const obs  = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      block.classList.add('collagen-revealed');
      obs.unobserve(card);
    }, { threshold: 0.30, rootMargin: '0px 0px -60px 0px' });

    obs.observe(card);
  });
}

/* ══════════════════════════════════════════════════════
   ABOUT v2 — interactive narrative
   • Splits [data-wordfx] text into word spans (inline
     elements like .ab2-chip are kept whole and sequenced)
   • Releases stagger delays after reveal so hovers are instant
   • Cursor tilt + shine on the collagen card
══════════════════════════════════════════════════════ */
function initAboutFx() {
  // 1 · Word splitter
  document.querySelectorAll('[data-wordfx]').forEach(el => {
    let wi = 0;
    Array.from(el.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!node.textContent.trim()) { node.textContent = ' '; return; }
        const frag = document.createDocumentFragment();
        node.textContent.split(/\s+/).filter(Boolean).forEach(word => {
          const s = document.createElement('span');
          s.className = 'wfx-w';
          s.textContent = word;
          s.style.setProperty('--wi', String(wi++));
          frag.appendChild(s);
          frag.appendChild(document.createTextNode(' '));
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        node.classList.add('wfx-w');
        node.style.setProperty('--wi', String(wi++));
      }
    });
  });

  // 2 · After the cascade finishes, drop transition delays
  const doneObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const n  = el.querySelectorAll('.wfx-w').length;
      setTimeout(() => el.classList.add('wfx-done'), n * 65 + 1000);
      doneObs.unobserve(el);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.ab2-ch').forEach(ch => doneObs.observe(ch));

  // 3 · Collagen card — cursor tilt + shine (pointer devices only)
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.about-collagen[data-tilt]').forEach(card => {
    let raf = null;
    card.addEventListener('mousemove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r  = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width  - 0.5;
        const py = (e.clientY - r.top)  / r.height - 0.5;
        card.style.setProperty('--rx', (py * -6).toFixed(2) + 'deg');
        card.style.setProperty('--ry', (px *  8).toFixed(2) + 'deg');
        card.style.setProperty('--mx', ((px + 0.5) * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((py + 0.5) * 100).toFixed(1) + '%');
        card.style.setProperty('--px', (px * 18).toFixed(1) + 'px');
        card.style.setProperty('--py', (py * 14).toFixed(1) + 'px');
        raf = null;
      });
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--px', '0px');
      card.style.setProperty('--py', '0px');
    });
  });
}

/* ══════════════════════════════════════════════════════
   BRAND ASSET PROTECTION
   Blocks casual right-click / drag / long-press saving of
   images, videos, logos and icons. Not DRM — friction only.
   Keeps text selection and all interactions intact.
══════════════════════════════════════════════════════ */
function initAssetProtection() {
  const guarded = t =>
    t instanceof Element &&
    t.closest('img, video, svg, picture, .mo-slide, .video-card, .globe-canvas');

  ['contextmenu', 'dragstart'].forEach(evt => {
    document.addEventListener(evt, e => {
      if (guarded(e.target)) e.preventDefault();
    });
  });
  document.addEventListener('selectstart', e => {
    if (guarded(e.target)) e.preventDefault();
  });

  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
  });
  document.querySelectorAll('video').forEach(v => {
    v.setAttribute('controlslist', 'nodownload noremoteplayback');
    v.setAttribute('disablepictureinpicture', '');
  });
}

/* ══════════════════════════════════════════════════════
   JEEL MOMENTS — lifestyle carousel
   Center-focus slides, arrows, dots, autoplay, swipe.
══════════════════════════════════════════════════════ */
function initMomentsCarousel() {
  const viewport = document.getElementById('moViewport');
  const track    = document.getElementById('moTrack');
  if (!viewport || !track) return;

  const slides  = Array.from(track.children);
  const dotsBox = document.getElementById('moDots');
  const prevBtn = document.getElementById('moPrev');
  const nextBtn = document.getElementById('moNext');
  let index = 0;
  let timer = null;

  // dots
  const dots = slides.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'mo-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => { goTo(i); restart(); });
    dotsBox.appendChild(d);
    return d;
  });

  function layout() {
    const slide = slides[index];
    const vpW   = viewport.offsetWidth;
    const x     = slide.offsetLeft - (vpW - slide.offsetWidth) / 2;
    track.style.transform = 'translateX(' + (-x) + 'px)';
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === index));
    dots.forEach((d, k) => d.classList.toggle('active', k === index));
    layout();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 4500);
  }

  prevBtn.addEventListener('click', () => { goTo(index - 1); restart(); });
  nextBtn.addEventListener('click', () => { goTo(index + 1); restart(); });

  // pause on hover
  viewport.addEventListener('mouseenter', () => clearInterval(timer));
  viewport.addEventListener('mouseleave', restart);

  // swipe / drag
  let startX = 0, dragging = false;
  viewport.addEventListener('pointerdown', e => {
    dragging = true;
    startX = e.clientX;
    viewport.classList.add('dragging');
    clearInterval(timer);
  });
  window.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove('dragging');
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
    else layout();
    restart();
  });
  viewport.addEventListener('pointermove', e => {
    if (!dragging) return;
    const slide = slides[index];
    const vpW   = viewport.offsetWidth;
    const x     = slide.offsetLeft - (vpW - slide.offsetWidth) / 2;
    track.style.transform = 'translateX(' + (-(x - (e.clientX - startX))) + 'px)';
  });

  // keyboard
  viewport.setAttribute('tabindex', '0');
  viewport.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(index - 1); restart(); }
    if (e.key === 'ArrowRight') { goTo(index + 1); restart(); }
  });

  window.addEventListener('resize', layout);

  goTo(0);
  restart();
  // re-layout once images have dimensions
  window.addEventListener('load', layout);
}

/* ══════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════ */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 90);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════
   VIDEO STRIP
══════════════════════════════════════════════════════ */
function initVideoStrip() {
  const strip   = document.getElementById('videoStrip');
  const section = strip?.closest('.video-strip-section');
  if (!section) return;

  const loadObs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    section.querySelectorAll('video').forEach(v => {
      v.load();
      v.play().catch(() => {});
    });
    loadObs.disconnect();
  }, { rootMargin: '240px' });
  loadObs.observe(section);

  const visObs = new IntersectionObserver(entries => {
    strip.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
  }, { threshold: 0 });
  visObs.observe(section);
}

/* ══════════════════════════════════════════════════════
   THREE.JS GLOBE — richer, glossier, more atmospheric
══════════════════════════════════════════════════════ */
function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;
  if (!window.THREE) {
    window.addEventListener('load', () => { if (window.THREE) initGlobe(); }, { once: true });
    return;
  }

  const stage = canvas.parentElement;
  const W = stage.offsetWidth;
  const H = stage.offsetHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
  camera.position.z = 2.45;

  /* ── Build globe texture on an offscreen canvas ── */
  const tc  = document.createElement('canvas');
  tc.width  = 1024;
  tc.height = 512;
  const ctx = tc.getContext('2d');

  // 1. Base — pearl white center bleeding into soft Jeel blue at edges.
  //    Globe reads as white/light first, with Jeel blue as the presence.
  //    Colors: #ffffff → #edf9fd → #dff4fb → #aadcea
  const baseGrad = ctx.createLinearGradient(0, 0, 0, 512);
  baseGrad.addColorStop(0.0,  '#edf9fd');   // top pole — icy, near-white
  baseGrad.addColorStop(0.22, '#f0fafd');   // upper — very pale
  baseGrad.addColorStop(0.50, '#dff4fb');   // equator — lightest Jeel blue
  baseGrad.addColorStop(0.78, '#edf9fd');   // lower — pale again
  baseGrad.addColorStop(1.0,  '#e8f8fc');   // bottom pole
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // 2. Radial depth — adds a very soft central brightness (pearl quality)
  const pearlGrad = ctx.createRadialGradient(512, 256, 0, 512, 256, 440);
  pearlGrad.addColorStop(0,    'rgba(255,255,255,0.38)'); // near-white core
  pearlGrad.addColorStop(0.40, 'rgba(255,255,255,0.14)');
  pearlGrad.addColorStop(0.75, 'rgba(255,255,255,0.03)');
  pearlGrad.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = pearlGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // 3. Horizontal edge tint — dark side barely present, just enough for sphere feel
  const edgeTint = ctx.createLinearGradient(0, 0, 1024, 0);
  edgeTint.addColorStop(0,    'rgba(170,220,234,0.06)');  // Jeel blue on lit edge
  edgeTint.addColorStop(0.48, 'rgba(255,255,255,0)');
  edgeTint.addColorStop(1,    'rgba(150,200,220,0.08)');  // soft blue far edge
  ctx.fillStyle = edgeTint;
  ctx.fillRect(0, 0, 1024, 512);

  // 4. Grid lines — extremely whisper-thin, Jeel blue hue, barely visible
  //    Presence without weight — editorial, not cartographic.
  ctx.lineWidth = 0.5;
  // Clearer cartographic grid — light Jeel blue, elegant but readable
  for (let i = 0; i <= 24; i++) {   // longitude
    const x = (i / 24) * 1024;
    ctx.strokeStyle = 'rgba(123,185,208,0.42)';
    ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }
  for (let i = 0; i <= 12; i++) {   // latitude
    const y = (i / 12) * 512;
    ctx.strokeStyle = i === 6
      ? 'rgba(123,185,208,0.60)'    // equator — clearly defined
      : 'rgba(123,185,208,0.38)';
    ctx.lineWidth = i === 6 ? 1.4 : 0.9;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
  }

  // 5. Land masses — softest #aadcea tint, whisper-quiet, not maps.
  //    The globe reads as pure, abstract sphere — land is suggestive only.
  const landDots = [
    [0.47,0.32],[0.50,0.28],[0.53,0.35],[0.56,0.30],[0.58,0.36],
    [0.62,0.28],[0.66,0.24],[0.70,0.30],[0.74,0.26],[0.72,0.35],[0.76,0.42],
    [0.52,0.40],[0.54,0.48],[0.50,0.52],[0.56,0.56],[0.52,0.60],
    [0.25,0.28],[0.22,0.36],[0.28,0.42],[0.24,0.52],[0.30,0.58],[0.26,0.62],
    [0.82,0.52],[0.86,0.56],[0.84,0.48],
    [0.60,0.18],[0.66,0.14],[0.74,0.16],[0.70,0.20],
  ];
  landDots.forEach(([nx, ny]) => {
    const x = nx * 1024;
    const y = ny * 512;
    const r = 14 + Math.random() * 22;
    const lg = ctx.createRadialGradient(x, y, 0, x, y, r);
    // Jeel blue (#aadcea = rgba(170,220,234)) — at 12% max. Nearly invisible.
    lg.addColorStop(0,    'rgba(170,220,234,0.12)');
    lg.addColorStop(0.55, 'rgba(170,220,234,0.05)');
    lg.addColorStop(1,    'rgba(170,220,234,0)');
    ctx.fillStyle = lg;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  });

  // 6. Specular highlight — large, airy, very soft pearl sheen.
  //    Upper-left quadrant. Max 13% opacity. No hotspot — diffuse glow.
  const gloss = ctx.createRadialGradient(200, 120, 0, 200, 120, 380);
  gloss.addColorStop(0,    'rgba(255,255,255,0.13)');
  gloss.addColorStop(0.35, 'rgba(255,255,255,0.06)');
  gloss.addColorStop(0.70, 'rgba(255,255,255,0.01)');
  gloss.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = gloss;
  ctx.fillRect(0, 0, 1024, 512);

  const texture = new THREE.CanvasTexture(tc);

  /* ── Globe material ──
     High ambient → globe stays airy and bright (not dark/moody).
     Very low shininess + nearly-white specular → soft pearl gloss.
     The texture IS the globe. Lighting adds just a gentle breath. */
  const mat = new THREE.MeshPhongMaterial({
    map:         texture,
    shininess:   28,                           // low — soft pearl, not mirror
    specular:    new THREE.Color(0xf0fafd),    // near-white, Jeel-tinted
    transparent: false,
    opacity:     1.0,
  });
  const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 72, 72), mat);
  scene.add(globe);

  /* ── Atmosphere halo — barely-there, whisper of blue edge ── */
  const atmMat = new THREE.MeshBasicMaterial({
    color:       0xdff4fb,    // lightest Jeel blue-white
    transparent: true,
    opacity:     0.07,        // very subtle — just breathes
    side:        THREE.BackSide,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.055, 32, 32), atmMat));

  /* ── Lighting ──
     Very high ambient (0.82) → globe stays white and airy, never dark.
     Directional sun is low-intensity, warm-white — adds soft shape only.
     Rim is barely present — no harsh colored edges. */
  scene.add(new THREE.AmbientLight(0xffffff, 0.82));

  const sun = new THREE.DirectionalLight(0xfdfefe, 0.32);
  sun.position.set(2.5, 1.5, 3.5);
  scene.add(sun);

  const rim = new THREE.DirectionalLight(0xdff4fb, 0.14);
  rim.position.set(-2.0, -0.5, -2.0);
  scene.add(rim);

  /* ── Animation loop ── */
  let raf;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    globe.rotation.y += 0.0016;
    renderer.render(scene, camera);
  };
  tick();

  /* ── Resize ── */
  new ResizeObserver(() => {
    const nW = stage.offsetWidth;
    const nH = stage.offsetHeight;
    if (!nW || !nH) return;
    renderer.setSize(nW, nH);
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
  }).observe(stage);

  /* ── Pause off-screen ── */
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (!raf) tick();
    } else {
      cancelAnimationFrame(raf);
      raf = null;
    }
  }, { threshold: 0 }).observe(stage);
}

/* ══════════════════════════════════════════════════════
   GLOBE LEAVES — orbital particles with refined brand colors
   Softer luxury motion + calmer premium palette
══════════════════════════════════════════════════════ */
function initGlobeLeaves() {
  const container = document.getElementById('globeLeaves');
  const stage     = document.getElementById('globeStage');
  if (!container || !stage) return;

  // Three pre-colored SVGs — no CSS filters, actual brand colors baked in
  const leafSrcs    = ['leaf-blue.svg', 'leaf-yellow.svg', 'leaf-pink.svg'];
  // Boosted opacity (+12%) for more presence and elegance
  const leafOpacity = [0.82, 0.66, 0.64];  // blue dominant, accents softer

  // Blue dominant: 0=blue, 1=yellow, 2=pink
  const colorMap = [0, 0, 1, 0, 2, 0, 0, 1, 0, 2];

  const count  = isMobile() ? 6 : 10;
  const leaves = [];

  for (let i = 0; i < count; i++) {

    const wrap = document.createElement('div');
    wrap.className = 'globe-leaf';

    const img = document.createElement('img');
    const colorIdx = colorMap[i % colorMap.length];

    img.src     = leafSrcs[colorIdx];
    img.alt     = '';
    img.loading = 'lazy';

    // Larger leaves — more dramatic orbital presence
    const size = 30 + Math.random() * 32;

    img.style.width   = size + 'px';
    img.style.opacity = String(leafOpacity[colorIdx]);

    wrap.appendChild(img);
    container.appendChild(wrap);

    // Faster, more alive orbital motion
    const baseAngle = (i / count) * Math.PI * 2;

    const orbitRX   = 0.44 + Math.random() * 0.14;
    const orbitRY   = 0.16 + Math.random() * 0.12;

    const bobAmp    = 12 + Math.random() * 14;  // more dramatic bob
    const bobFreq   = 0.0010 + Math.random() * 0.0007;  // faster bob

    // ~40% faster orbital speed
    const speed   =
      (colorMap[i] === 0 ? 0.00078 : 0.00100)
      + Math.random() * 0.00060;

    const spinSpd =
      (Math.random() > 0.5 ? 1 : -1)
      * (0.28 + Math.random() * 0.50);  // faster spin

    leaves.push({
      el: wrap,
      angle:  baseAngle,
      speed,
      orbitRX,
      orbitRY,
      bobAmp,
      bobFreq,
      bobPhase: Math.random() * Math.PI * 2,
      spin:     Math.random() * 360,
      spinSpd,
      size,
    });
  }

  const animate = (ts) => {

    const cx = stage.offsetWidth  / 2;
    const cy = stage.offsetHeight / 2;

    leaves.forEach(l => {

      l.angle += l.speed;
      l.spin  += l.spinSpd;

      const oX  = stage.offsetWidth  * l.orbitRX;
      const oY  = stage.offsetHeight * l.orbitRY;

      const bob =
        Math.sin(ts * l.bobFreq + l.bobPhase)
        * l.bobAmp;

      const x =
        cx + Math.cos(l.angle) * oX - l.size / 2;

      const y =
        cy + Math.sin(l.angle) * oY + bob - l.size / 2;

      l.el.style.transform =
        `translate(${x}px, ${y}px) rotate(${l.spin}deg)`;
    });

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

/* ══════════════════════════════════════════════════════
   JEEL NAME PILLARS — staggered scroll reveal
══════════════════════════════════════════════════════ */
function initPillarReveal() {
  const containers = document.querySelectorAll('.jeel-name-pillars');
  if (!containers.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const pillars = entry.target.querySelectorAll('.jeel-name-pillar');
      pillars.forEach((p, i) => {
        setTimeout(() => p.classList.add('pillar-visible'), i * 220);
      });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -30px 0px' });

  containers.forEach(el => io.observe(el));
}

// Run on DOM ready, and re-run after language switch (pillars may be in hidden block)
document.addEventListener('DOMContentLoaded', initPillarReveal);

/* ══════════════════════════════════════════════════════
   GSAP SCROLL ENHANCEMENTS (progressive enhancement)
══════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // About leaf parallax
  const leafDeco = document.querySelector('.about-leaf-deco');
  if (leafDeco) {
    gsap.to(leafDeco, {
      y: -70, ease: 'none',
      scrollTrigger: {
        trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1.8,
      }
    });
  }

  // Video intro — large heading entrance
  gsap.from('.vi-title', {
    y: 48, opacity: 0, duration: 1.6, ease: 'power3.out',
    scrollTrigger: { trigger: '.video-intro-section', start: 'top 80%' }
  });
  gsap.from('.vi-subtitle', {
    y: 24, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.20,
    scrollTrigger: { trigger: '.video-intro-section', start: 'top 78%' }
  });

  // Values section — label + single row entrance
  gsap.from('.values-label', {
    y: 20, opacity: 0, duration: 1.0, ease: 'power3.out',
    scrollTrigger: { trigger: '.values-section', start: 'top 85%' }
  });
  gsap.from('.vt-row', {
    opacity: 0, duration: 1.4, ease: 'power2.out',
    scrollTrigger: { trigger: '.values-track', start: 'top 90%' }
  });

  // Globe entrance
  gsap.from('.globe-stage', {
    scale: 0.86, opacity: 0, duration: 1.5, ease: 'power3.out',
    scrollTrigger: { trigger: '.globe-section', start: 'top 80%' }
  });

  // Country buttons stagger
  gsap.from('.country-btn', {
    y: 16, opacity: 0, duration: 0.7, ease: 'power2.out',
    stagger: 0.055,
    scrollTrigger: { trigger: '.country-grid', start: 'top 88%' }
  });


  // Products scroll parallax on hero (depth-based drift into sections)
  document.querySelectorAll('.product-float').forEach((el, i) => {
    // GSAP handles opacity only — transform handled by rAF to avoid conflict
    gsap.to(el, {
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '80% top',
        scrub: 1.2,
        onUpdate: (self) => {
          // Expose scroll progress for rAF to consume
          if (!window._heroScrollProgress) window._heroScrollProgress = {};
          window._heroScrollProgress[i] = self.progress;
        }
      }
    });
  });
});
