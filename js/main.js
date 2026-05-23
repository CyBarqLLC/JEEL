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
  initReveal();
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
  });

  // Re-animate hero lines when language toggles
  if (animate) {
    const visLines = document.querySelectorAll(`[data-lang="${lang}"] .hero-line`);
    visLines.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
    });
    setTimeout(() => {
      if (window.gsap) {
        gsap.to(visLines, { opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out' });
      } else {
        visLines.forEach((el, i) => {
          el.style.transition = `opacity 0.85s ${i * 0.1}s ease, transform 0.85s ${i * 0.1}s ease`;
          el.style.opacity = '1';
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
  const burger = document.getElementById('navBurger');
  const links  = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ══════════════════════════════════════════════════════
   HERO LEAF PARTICLES
══════════════════════════════════════════════════════ */
function initHeroLeaves() {
  const container = document.getElementById('heroLeaves');
  if (!container) return;

  // Three pre-colored SVGs — no CSS filter tricks needed
  const leafSrcs = ['leaf-blue.svg', 'leaf-yellow.svg', 'leaf-pink.svg'];
  // Opacity per color — blue dominant
  const leafOpacity = [0.30, 0.22, 0.20];
  // Color distribution: blue-heavy, accent sparingly
  const leafColorMap = [0, 0, 1, 0, 2, 0, 0, 1, 0, 2, 0, 0];

  const count = isMobile() ? 5 : 8;

  for (let i = 0; i < count; i++) {
    const wrap = document.createElement('div');
    wrap.className = 'hero-leaf';

    const img = document.createElement('img');
    const colorIdx = leafColorMap[i % leafColorMap.length];
    img.src = leafSrcs[colorIdx];
    img.alt = '';
    img.loading = 'lazy';

    const size  = 24 + Math.random() * 52;
    const x     = Math.random() * 88 + 2;
    const y     = Math.random() * 78 + 4;
    const rot   = Math.random() * 360;
    const dur   = 7 + Math.random() * 9;
    const delay = Math.random() * 5;

    wrap.style.cssText = `width:${size}px;left:${x}%;top:${y}%;`;

    // Opacity only — actual color is baked into the SVG file
    img.style.opacity = String(leafOpacity[colorIdx]);

    wrap.appendChild(img);
    container.appendChild(wrap);

    const kf    = `hlf${i}`;
    const dx    = (Math.random() - 0.5) * 28;
    const dy    = -18 - Math.random() * 28;
    const drot  = rot + 35 + Math.random() * 20;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${kf} {
        0%   { transform: rotate(${rot}deg) translate(0,0); opacity: 0; }
        12%  { opacity: 1; }
        88%  { opacity: 1; }
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
    /* ── Mobile mode: pure CSS, no JS transforms ── */
    products.forEach((el, i) => {
      // Unique but gentle float — only Y, minimal rotation
      const dur   = 3.2 + i * 0.65;
      const ampY  = 5 + i * 1.2;
      const delay = i * 0.55;
      const kf    = `pmf${i}`;
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ${kf} {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%     { transform: translateY(-${ampY}px) rotate(${i % 2 === 0 ? 0.6 : -0.6}deg); }
        }
      `;
      document.head.appendChild(style);
      // Use will-change: auto on mobile (CSS only)
      el.style.willChange = 'auto';
      el.style.animation  = `${kf} ${dur}s ${delay}s ease-in-out infinite`;
    });
    return;
  }

  /* ── Desktop mode: JS-driven float + cursor parallax ──
     Each product has completely unique motion parameters
     to produce an organic, non-uniform floating composition. */

  // Per-product tuning: [ampY, ampX, rotAmp, freqBase, phase, cursorDepth]
  // p1 Serum        — tall, stately, slow
  // p2 Drink        — dominant, mid pace
  // p3 Cream        — gentle, grounded
  // p4 Serum 02     — small, set back, subtle
  // p5 Cream 02     — mirrors p3 on right, slightly faster
  const params = [
    { aY: 12, aX: 2.5, aR: 0.7, freq: 0.00038, ph: 0.0,          cd: 0.038 },
    { aY: 14, aX: 3.0, aR: 0.9, freq: 0.00044, ph: Math.PI * 0.3, cd: 0.065 },
    { aY:  9, aX: 2.0, aR: 0.5, freq: 0.00032, ph: Math.PI * 0.8, cd: 0.048 },
    { aY:  7, aX: 1.5, aR: 0.4, freq: 0.00050, ph: Math.PI * 1.4, cd: 0.028 },
    { aY: 10, aX: 2.2, aR: 0.6, freq: 0.00040, ph: Math.PI * 1.1, cd: 0.058 },
  ];

  let mx = 0, my = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  const tick = (ts) => {
    // Smooth cursor follow
    cx += (mx - cx) * 0.038;
    cy += (my - cy) * 0.038;

    products.forEach((el, i) => {
      const p = params[i] || params[0];
      const t = ts;

      // Compound sine waves for organic feel
      const floatY = Math.sin(t * p.freq + p.ph) * p.aY
                   + Math.sin(t * p.freq * 1.7 + p.ph + 0.5) * p.aY * 0.2;
      const floatX = Math.sin(t * p.freq * 0.63 + p.ph + 1.1) * p.aX;
      const rotZ   = Math.sin(t * p.freq * 0.48 + p.ph + 0.3) * p.aR;

      // Cursor contribution
      const cursorX = cx * p.cd * 44;
      const cursorY = cy * p.cd * 28;

      el.style.transform =
        `translate(${floatX + cursorX}px, ${floatY + cursorY}px) rotate(${rotZ}deg)`;
    });

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ══════════════════════════════════════════════════════
   HERO ENTRANCE
══════════════════════════════════════════════════════ */
function initHeroEntrance() {
  const lines = document.querySelectorAll('.hero-tagline-en .hero-line');
  const cta   = document.querySelector('.hero-cta');
  if (!lines.length) return;

  const run = () => {
    if (window.gsap) {
      gsap.to(lines, { opacity: 1, y: 0, duration: 1.2, stagger: 0.13, ease: 'power3.out', delay: 0.3 });
      if (cta) gsap.to(cta, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.88 });
    } else {
      lines.forEach((el, i) => {
        el.style.transition = `opacity 1.1s ${0.3 + i * 0.13}s ease, transform 1.1s ${0.3 + i * 0.13}s ease`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      if (cta) {
        cta.style.transition = 'opacity 1s 0.88s ease, transform 1s 0.88s ease';
        cta.style.opacity = '1';
        cta.style.transform = 'translateY(0)';
      }
    }
  };

  setTimeout(run, 100);
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
  for (let i = 0; i <= 24; i++) {   // longitude
    const x = (i / 24) * 1024;
    ctx.strokeStyle = 'rgba(170,220,234,0.20)';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }
  for (let i = 0; i <= 12; i++) {   // latitude
    const y = (i / 12) * 512;
    ctx.strokeStyle = i === 6
      ? 'rgba(170,220,234,0.28)'    // equator — barely distinguishable
      : 'rgba(170,220,234,0.16)';
    ctx.lineWidth = i === 6 ? 0.65 : 0.5;
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
  const leafOpacity = [0.72, 0.56, 0.54];  // blue dominant, accents softer

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

    const size = 26 + Math.random() * 26;

    img.style.width   = size + 'px';
    img.style.opacity = String(leafOpacity[colorIdx]);

    wrap.appendChild(img);
    container.appendChild(wrap);

    // smoother cinematic orbital motion
    const baseAngle = (i / count) * Math.PI * 2;

    const orbitRX   = 0.42 + Math.random() * 0.12;
    const orbitRY   = 0.14 + Math.random() * 0.10;

    const bobAmp    = 8 + Math.random() * 10;
    const bobFreq   = 0.0007 + Math.random() * 0.0005;

    // refined movement speed
    const speed   =
      (colorMap[i] === 0 ? 0.00055 : 0.00072)
      + Math.random() * 0.00045;

    const spinSpd =
      (Math.random() > 0.5 ? 1 : -1)
      * (0.18 + Math.random() * 0.34);

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
});
