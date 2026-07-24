// ============================================================
//   RA Birthday Site — app.js
//   Main JavaScript: Password, Particles, Gallery,
//   Typing, Timeline, Countdown, Confetti, Music
// ============================================================

'use strict';

// ── Config & Constants ──────────────────────────────────────
const BIRTHDAY = new Date(2026, 6, 25);   // July 25 2026
const TOTAL_PHOTOS = 23;
const BIRTHDAY_MSG =
  `Some people come into our lives and quietly become the most beautiful part of it.\n\n` +
  `You are one of those rare souls.\n\n` +
  `Thank you for every smile, every memory, every moment.\n\n` +
  `May this birthday bring endless happiness, love, peace, and everything your heart wishes for.\n\n` +
  `Happy Birthday Afrin ☘️❤️`;

const FLOAT_EMOJIS = ['☘️', '🌸', '✨', '💕', '🎈', '💖', '⭐', '🌺', '💗', '🎀', '✿', '☘️', '🌷', '💞'];
const CONF_COLORS = ['#FF1493', '#FF69B4', '#FFD700', '#8B5CF6', '#E91E63', '#FF8C00', '#FFFFFF', '#00E5FF'];
const PARTICLE_COLS = ['#FF69B4', '#FFD700', '#C084FC', '#FF1493', '#FFFFFF', '#FFB3D1'];

// ── Helpers ──────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');

function isBirthdayToday() {
  const n = new Date();
  return n.getFullYear() === BIRTHDAY.getFullYear() &&
    n.getMonth() === BIRTHDAY.getMonth() &&
    n.getDate() === BIRTHDAY.getDate();
}

/** Convert hex color to rgba string */
function hex2rgba(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/** Radial gradient glow on a canvas context */
function drawGlow(ctx, x, y, r, col, alpha) {
  const gr = ctx.createRadialGradient(x, y, 0, x, y, r * 5.5);
  gr.addColorStop(0, hex2rgba(col, alpha * 0.72));
  gr.addColorStop(1, hex2rgba(col, 0));
  ctx.beginPath();
  ctx.arc(x, y, r * 5.5, 0, Math.PI * 2);
  ctx.fillStyle = gr;
  ctx.fill();
}

/** Draw solid particle dot */
function drawDot(ctx, x, y, r, col, alpha) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = col;
  ctx.globalAlpha = alpha;
  ctx.fill();
  ctx.globalAlpha = 1;
}


// ============================================================
//   PASSWORD SCREEN
// ============================================================

let pwCanvas, pwCtx, pwParticles = [], pwRaf;

function initPassword() {
  pwCanvas = $('pw-canvas');
  pwCtx = pwCanvas.getContext('2d');
  sizePwCanvas();
  window.addEventListener('resize', sizePwCanvas);

  spawnPwParticles();
  animPwParticles();

  const input = $('pw-input');
  const btn = $('pw-btn');
  const eyeBtn = $('pw-eye');
  const wrap = $('pw-input-wrap');
  const errEl = $('pw-error');

  // Auto-focus
  setTimeout(() => input.focus(), 500);

  // Clear error styling on new input
  input.addEventListener('input', () => {
    wrap.classList.remove('shake');
    errEl.classList.add('hidden');
  });

  // Enter key support
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') checkPassword();
  });

  btn.addEventListener('click', checkPassword);

  // Show / hide password toggle
  eyeBtn.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    $('eye-open').classList.toggle('hidden', show);
    $('eye-closed').classList.toggle('hidden', !show);
    input.focus();
  });

  // ── Inner: check password ──────────────────────────────────
  function checkPassword() {
    const val = input.value.toUpperCase().trim();
    if (val === 'RA') {
      doUnlock();
    } else {
      // Wrong — shake animation + error message
      wrap.classList.remove('shake');
      void wrap.offsetWidth;          // trigger reflow to restart animation
      wrap.classList.add('shake');
      errEl.classList.remove('hidden');
      input.value = '';
      input.focus();
      setTimeout(() => wrap.classList.remove('shake'), 600);
    }
  }
}

/** Animate the lock opening and transition to main site */
function doUnlock() {
  const lockEl = $('lock-icon');

  // Open the shackle visually
  const arch = lockEl.querySelector('#lock-arch');
  if (arch) {
    arch.setAttribute('d', 'M11,26 L11,20 C11,12 17.8,6 26,6');
    arch.style.opacity = '0.35';
  }
  lockEl.classList.add('open');

  // After short pause, fade out password screen
  setTimeout(() => {
    const pwScreen = $('password-screen');
    pwScreen.style.opacity = '0';
    pwScreen.style.pointerEvents = 'none';

    setTimeout(() => {
      pwScreen.style.display = 'none';
      cancelAnimationFrame(pwRaf);
      showMainSite();
    }, 1300);
  }, 660);
}

function sizePwCanvas() {
  if (!pwCanvas) return;
  pwCanvas.width = window.innerWidth;
  pwCanvas.height = window.innerHeight;
}

function spawnPwParticles() {
  pwParticles = [];
  for (let i = 0; i < 70; i++) {
    pwParticles.push({
      x: Math.random() * (pwCanvas.width || window.innerWidth),
      y: Math.random() * (pwCanvas.height || window.innerHeight),
      r: Math.random() * 2.8 + 0.5,
      vx: (Math.random() - 0.5) * 0.38,
      vy: -(Math.random() * 0.45 + 0.08),
      col: PARTICLE_COLS[Math.floor(Math.random() * PARTICLE_COLS.length)],
      a: Math.random() * 0.52 + 0.16,
      ph: Math.random() * Math.PI * 2,
      phs: Math.random() * 0.017 + 0.005,
    });
  }
}

function animPwParticles() {
  pwCtx.clearRect(0, 0, pwCanvas.width, pwCanvas.height);

  for (const p of pwParticles) {
    // Move
    p.x += p.vx;
    p.y += p.vy;
    p.ph += p.phs;

    // Wrap around edges
    if (p.y < -12) p.y = pwCanvas.height + 12;
    if (p.x < -12) p.x = pwCanvas.width + 12;
    if (p.x > pwCanvas.width + 12) p.x = -12;

    const alpha = p.a * (0.55 + 0.45 * Math.sin(p.ph));
    drawGlow(pwCtx, p.x, p.y, p.r, p.col, alpha);
    drawDot(pwCtx, p.x, p.y, p.r, p.col, alpha);
  }

  pwRaf = requestAnimationFrame(animPwParticles);
}


// ============================================================
//   MAIN SITE — INIT
// ============================================================

function showMainSite() {
  const main = $('main-site');
  main.style.opacity = '0';
  main.classList.remove('hidden');

  // Two rAFs to ensure display:block is painted before animation
  requestAnimationFrame(() => requestAnimationFrame(() => {
    main.style.opacity = '';
    main.classList.add('reveal');
  }));

  // Initialise all features
  initMainCanvas();
  startFloatingElements();
  buildGallery();
  initModalEvents();
  buildCountdown();
  initMusicPlayer();
  initScrollAnimations();
  scheduleTyping();

  // Confetti if today is the birthday!
  if (isBirthdayToday()) {
    setTimeout(launchConfetti, 1800);
  }
}


// ============================================================
//   MAIN CANVAS  (soft sparkle particles)
// ============================================================

let mainCanvas, mainCtx, mainPtcls = [], mainRaf;

function initMainCanvas() {
  mainCanvas = $('main-canvas');
  mainCtx = mainCanvas.getContext('2d');
  sizeMainCanvas();
  window.addEventListener('resize', sizeMainCanvas);
  buildMainParticles();
  animMainCanvas();
}

function sizeMainCanvas() {
  if (!mainCanvas) return;
  mainCanvas.width = window.innerWidth;
  mainCanvas.height = window.innerHeight;
}

function buildMainParticles() {
  mainPtcls = [];
  for (let i = 0; i < 50; i++) {
    mainPtcls.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      col: PARTICLE_COLS[Math.floor(Math.random() * PARTICLE_COLS.length)],
      a: Math.random() * 0.38 + 0.1,
      ph: Math.random() * Math.PI * 2,
      phs: Math.random() * 0.009 + 0.003,
    });
  }
}

function animMainCanvas() {
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

  for (const p of mainPtcls) {
    p.x += p.vx;
    p.y += p.vy;
    p.ph += p.phs;

    // Bounce off edges
    if (p.x < 0 || p.x > mainCanvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > mainCanvas.height) p.vy *= -1;

    const alpha = p.a * (0.5 + 0.5 * Math.sin(p.ph));
    drawGlow(mainCtx, p.x, p.y, p.r, p.col, alpha);
    drawDot(mainCtx, p.x, p.y, p.r, p.col, alpha);
  }

  mainRaf = requestAnimationFrame(animMainCanvas);
}


// ============================================================
//   FLOATING ELEMENTS  (hearts, flowers, balloons)
// ============================================================

function startFloatingElements() {
  // Spawn one element every ~1.1 seconds continuously
  setInterval(spawnFloat, 1100);
}

function spawnFloat() {
  const el = document.createElement('div');
  el.className = 'float-el';
  el.textContent = FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)];

  const size = Math.random() * 19 + 13;       // 13–32 px
  const dur = Math.random() * 12 + 9;        // 9–21 s

  el.style.cssText = `
    left: ${Math.random() * 100}%;
    font-size: ${size}px;
    animation-duration: ${dur}s;
    animation-timing-function: linear;
  `;

  const main = $('main-site');
  if (main) {
    main.appendChild(el);
    // Remove after animation completes
    setTimeout(() => el.remove(), dur * 1000 + 300);
  }
}


// ============================================================
//   TYPING ANIMATION
// ============================================================

function scheduleTyping() {
  const section = $('message-section');
  if (!section) return;

  // Start typing when the message section scrolls into view
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      obs.disconnect();
      typeMessage();
    }
  }, { threshold: 0.25 });

  obs.observe(section);
}

function typeMessage() {
  const textEl = $('typing-text');
  const cursor = $('blink-cursor');
  if (!textEl) return;

  textEl.textContent = '';
  let i = 0;

  function tick() {
    if (i < BIRTHDAY_MSG.length) {
      textEl.textContent += BIRTHDAY_MSG[i++];

      // Scroll message card smoothly as text grows
      const ch = BIRTHDAY_MSG[i - 1];
      let delay;
      if (ch === '\n') delay = 280;
      else if ('.!?,'.includes(ch)) delay = 100;
      else delay = 30 + Math.random() * 22;

      setTimeout(tick, delay);
    }
    // cursor keeps blinking after typing ends
  }

  tick();
}


// ============================================================
//   IMAGE GALLERY
// ============================================================

function buildGallery() {
  const grid = $('masonry-grid');
  if (!grid) return;

  for (let i = 1; i <= TOTAL_PHOTOS; i++) {
    const item = document.createElement('div');
    item.className = 'gal-item';
    item.dataset.idx = i - 1;

    const img = document.createElement('img');
    img.src = `assets/images/${i}.jpg`;
    img.alt = `Memory ${i}`;
    img.loading = 'lazy';
    img.draggable = false;

    item.appendChild(img);
    grid.appendChild(item);

    // Open modal on click
    item.addEventListener('click', () => openModal(i - 1));
  }

  // Reveal gallery items as they enter the viewport (staggered)
  const items = grid.querySelectorAll('.gal-item');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('show'), idx * 55);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

  items.forEach(it => obs.observe(it));
}


// ============================================================
//   GALLERY MODAL
// ============================================================

let curIdx = 0;
let isZoomed = false;
let tsX = 0;   // touch start X
let teX = 0;   // touch end   X

function initModalEvents() {
  const modal = $('gal-modal');
  const bg = $('gal-bg');
  const closeBtn = $('gal-close');
  const prevBtn = $('gal-prev');
  const nextBtn = $('gal-next');
  const img = $('gal-img');
  if (!modal) return;

  // Close
  bg.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  // Navigate
  prevBtn.addEventListener('click', () => navModal(-1));
  nextBtn.addEventListener('click', () => navModal(1));

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') navModal(-1);
    if (e.key === 'ArrowRight' || e.key === 'd') navModal(1);
    if (e.key === 'Escape') closeModal();
  });

  // Touch swipe on modal image
  img.addEventListener('touchstart', e => {
    tsX = e.changedTouches[0].clientX;
  }, { passive: true });

  img.addEventListener('touchend', e => {
    teX = e.changedTouches[0].clientX;
    if (Math.abs(tsX - teX) > 45) navModal(tsX - teX > 0 ? 1 : -1);
  });

  // Click image to zoom / unzoom
  img.addEventListener('click', () => {
    isZoomed = !isZoomed;
    img.style.transform = isZoomed ? 'scale(1.85)' : 'scale(1)';
    img.classList.toggle('zoomed', isZoomed);
  });
}

function openModal(idx) {
  curIdx = idx;
  const modal = $('gal-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setModalImg();
}

function closeModal() {
  $('gal-modal').classList.add('hidden');
  document.body.style.overflow = '';
  // Reset zoom
  isZoomed = false;
  const img = $('gal-img');
  img.style.transform = 'scale(1)';
  img.classList.remove('zoomed');
}

function navModal(dir) {
  curIdx = (curIdx + dir + TOTAL_PHOTOS) % TOTAL_PHOTOS;
  isZoomed = false;
  const img = $('gal-img');
  img.style.transform = 'scale(1)';
  img.classList.remove('zoomed');

  // Fade out → update → fade in
  img.style.opacity = '0';
  setTimeout(() => {
    setModalImg();
    img.style.transition = 'opacity 0.22s ease';
    img.style.opacity = '1';
    setTimeout(() => { img.style.transition = ''; }, 260);
  }, 140);
}

function setModalImg() {
  $('gal-img').src = `assets/images/${curIdx + 1}.jpg`;
  $('gal-count').textContent = `${curIdx + 1} / ${TOTAL_PHOTOS}`;
}


// ============================================================
//   BIRTHDAY COUNTDOWN
// ============================================================

function buildCountdown() {
  const box = $('countdown-box');
  if (!box) return;

  if (isBirthdayToday()) {
    // ── IT'S THE BIRTHDAY! ─────────────────────────────────
    box.innerHTML = `
      <div class="bday-today appear-scale" id="bday-today-div">
        <span class="bday-party-emoji">🎉</span>
        <h2 class="bday-today-title">It's Your Day! 🎉</h2>
        <p class="bday-today-sub">Wishing you the most magical birthday ever ❤️</p>
      </div>
    `;
    // Observe the dynamically added element for scroll animation
    observeWithVis($('bday-today-div'));

  } else {
    // ── Countdown timer ────────────────────────────────────
    box.innerHTML = `
      <div class="cd-wrap appear">
        <p class="cd-label">Until Your Special Day ✨</p>
        <div class="cd-grid">
          <div class="cd-box">
            <span class="cd-num" id="cd-d">00</span>
            <span class="cd-unit">Days</span>
          </div>
          <div class="cd-box">
            <span class="cd-num" id="cd-h">00</span>
            <span class="cd-unit">Hours</span>
          </div>
          <div class="cd-box">
            <span class="cd-num" id="cd-m">00</span>
            <span class="cd-unit">Minutes</span>
          </div>
          <div class="cd-box">
            <span class="cd-num" id="cd-s">00</span>
            <span class="cd-unit">Seconds</span>
          </div>
        </div>
      </div>
    `;
    // Observe the .cd-wrap for scroll animation
    observeWithVis(box.querySelector('.cd-wrap'));
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }
}

function tickCountdown() {
  const now = new Date();
  const target = new Date(BIRTHDAY);
  // If birthday passed, aim for next year
  if (now >= target) target.setFullYear(target.getFullYear() + 1);

  const diff = target - now;
  if (diff <= 0) return;

  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff / 36e5) % 24);
  const m = Math.floor((diff / 6e4) % 60);
  const s = Math.floor((diff / 1000) % 60);

  const de = $('cd-d'), he = $('cd-h'), me = $('cd-m'), se = $('cd-s');
  if (de) de.textContent = pad(d);
  if (he) he.textContent = pad(h);
  if (me) me.textContent = pad(m);
  if (se) se.textContent = pad(s);
}


// ============================================================
//   CONFETTI 🎊
// ============================================================

let cfvs, cfCtx, cfPtcls = [], cfRunning = false;

function launchConfetti() {
  cfvs = $('confetti-canvas');
  cfCtx = cfvs.getContext('2d');
  cfvs.width = window.innerWidth;
  cfvs.height = window.innerHeight;

  window.addEventListener('resize', () => {
    if (cfvs) { cfvs.width = window.innerWidth; cfvs.height = window.innerHeight; }
  });

  // Launch in multiple waves for a dramatic effect
  for (let wave = 0; wave < 6; wave++) {
    setTimeout(() => {
      for (let i = 0; i < 80; i++) {
        cfPtcls.push({
          x: Math.random() * cfvs.width,
          y: -10 - Math.random() * 160,
          vx: (Math.random() - 0.5) * 4.8,
          vy: Math.random() * 3.8 + 1.6,
          grav: 0.065 + Math.random() * 0.04,
          drag: 0.986,
          col: CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)],
          w: Math.random() * 9 + 4,
          h: Math.random() * 5 + 3,
          rot: Math.random() * 360,
          rotV: (Math.random() - 0.5) * 9.5,
          wob: Math.random() * Math.PI * 2,
          wobS: Math.random() * 0.09 + 0.04,
          shape: Math.random() > 0.38 ? 'rect' : 'circle',
        });
      }
      if (!cfRunning) animConfetti();
    }, wave * 380);
  }
}

function animConfetti() {
  cfRunning = true;
  cfCtx.clearRect(0, 0, cfvs.width, cfvs.height);

  // Remove particles that fell off screen
  cfPtcls = cfPtcls.filter(p => p.y < cfvs.height + 45);

  for (const p of cfPtcls) {
    p.vy += p.grav;
    p.vx *= p.drag;
    p.x += p.vx + Math.sin(p.wob) * 1.5;
    p.y += p.vy;
    p.rot += p.rotV;
    p.wob += p.wobS;

    cfCtx.save();
    cfCtx.translate(p.x, p.y);
    cfCtx.rotate((p.rot * Math.PI) / 180);
    cfCtx.fillStyle = p.col;
    cfCtx.globalAlpha = Math.max(0, 1 - (p.y / cfvs.height) * 0.65);

    if (p.shape === 'rect') {
      cfCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    } else {
      cfCtx.beginPath();
      cfCtx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      cfCtx.fill();
    }
    cfCtx.restore();
  }

  if (cfPtcls.length > 0) {
    requestAnimationFrame(animConfetti);
  } else {
    cfRunning = false;
    cfCtx.clearRect(0, 0, cfvs.width, cfvs.height);
  }
}


// ============================================================
//   MUSIC PLAYER
// ============================================================

function initMusicPlayer() {
  const audio = $('bg-audio');
  const btn = $('music-btn');
  if (!audio || !btn) return;

  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
      btn.title = 'Play Background Music';
    } else {
      audio.play().catch(() => {
        // Autoplay blocked by browser — user interaction already occurred
        // since this is inside a click handler, it should work.
      });
      btn.classList.add('playing');
      btn.title = 'Pause Music';
    }
    playing = !playing;
  });

  // If audio ends (shouldn't, it loops), reset state
  audio.addEventListener('ended', () => {
    playing = false;
    btn.classList.remove('playing');
  });
}


// ============================================================
//   SCROLL ANIMATIONS  (IntersectionObserver)
// ============================================================

/** Observe a single element and add 'vis' class when in view */
function observeWithVis(el) {
  if (!el) return;
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('vis');
      obs.unobserve(entry.target);
    }
  }, { threshold: 0.14 });
  obs.observe(el);
}

function initScrollAnimations() {
  // Select all elements that need scroll-triggered animation
  const targets = document.querySelectorAll(
    '.appear, .appear-up, .appear-left, .appear-right, .appear-scale'
  );

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => obs.observe(el));
}


// ============================================================
//   BOOT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initPassword();
});
