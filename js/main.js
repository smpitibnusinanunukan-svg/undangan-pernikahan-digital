/* ═══════════════════════════════════════════════════════
   MAIN.JS — Wedding Invitation Logic
═══════════════════════════════════════════════════════ */

// ─── State ──────────────────────────────────────────────
const STATE = {
  editMode:      false,
  petalInterval: null,
  countdownInterval: null,
  wishes:        [],
  musicPlaying:  false,
  countdownTarget: null,
};


// ─── Utility: Get Data (LocalStorage merged with Config) ──
function getStoreObj(lsKey, configKey) {
  const lsData  = JSON.parse(localStorage.getItem(lsKey) || '{}');
  const cfgData = window.WEDDING_CONFIG ? window.WEDDING_CONFIG[configKey] : {};
  return Object.assign({}, cfgData || {}, lsData);
}

function getStoreVal(lsKey, configKey) {
  const lsVal = localStorage.getItem(lsKey);
  if (lsVal !== null) return lsVal;
  return window.WEDDING_CONFIG ? window.WEDDING_CONFIG[configKey] : null;
}

// ─── Utility: Load from localStorage or Config ──────────
function loadSettings() {
  // Theme colors
  const colors = getStoreObj('wi_colors', 'colors');
  Object.entries(colors).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v);
  });

  // Text content
  const texts = getStoreObj('wi_texts', 'texts');
  Object.entries(texts).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = val;
  });

  // Images
  const images = getStoreObj('wi_images', 'images');
  Object.entries(images).forEach(([id, src]) => {
    const el = document.getElementById(id);
    if (el && el.tagName === 'IMG') el.src = src;
  });

  // Background settings
  loadBackground();

  // Countdown date
  const cdate = getStoreVal('wi_countdown_date', 'countdown_date');
  if (cdate) STATE.countdownTarget = new Date(cdate);

  // Wishes will be loaded via Supabase if available, otherwise fallback:
  STATE.wishes = JSON.parse(localStorage.getItem('wi_wishes') || '[]');

  // Sync duplicate name elements
  if (texts['ed-groom-name']) {
    const el2 = document.getElementById('ed-groom-name-2');
    if (el2) el2.textContent = texts['ed-groom-name'];
  }
  if (texts['ed-bride-name']) {
    const el2 = document.getElementById('ed-bride-name-2');
    if (el2) el2.textContent = texts['ed-bride-name'];
  }
  // Apply all texts to matching IDs (broader sync)
  const dupMap = {
    'ed-akad-date':    ['ed-akad-date-2'],
  };
  Object.entries(dupMap).forEach(([src, targets]) => {
    if (texts[src]) {
      targets.forEach(tid => {
        const el = document.getElementById(tid);
        if (el) el.innerHTML = texts[src];
      });
    }
  });
}

// ─── Guest Name from URL (supports single & couple) ──────
function loadGuestName() {
  const params   = new URLSearchParams(window.location.search);
  const name1    = decodeURIComponent(params.get('to')      || params.get('nama')     || '');
  const name2    = decodeURIComponent(params.get('pasangan')|| params.get('to2')      || '');

  const openingName   = document.getElementById('opening-guest-name');
  const coupleWrap    = document.getElementById('opening-couple-wrap');
  const coupleName1   = document.getElementById('opening-guest-name-1');
  const coupleName2   = document.getElementById('opening-guest-name-2');
  const heroGuest     = document.getElementById('hero-guest-name');

  if (!name1) return; // No params — show defaults

  if (name2) {
    // COUPLE MODE — show two names
    if (openingName) openingName.style.display  = 'none';
    if (coupleWrap)  coupleWrap.style.display   = 'block';
    if (coupleName1) coupleName1.textContent    = name1;
    if (coupleName2) coupleName2.textContent    = name2;
    if (heroGuest)   heroGuest.textContent      = `${name1} & ${name2}`;
  } else {
    // SINGLE GUEST MODE
    if (openingName) {
      openingName.textContent = name1;
      openingName.style.display = '';
    }
    if (coupleWrap) coupleWrap.style.display = 'none';
    if (heroGuest)  heroGuest.textContent    = name1;
  }
}

// ─── Background Settings Loader ──────────────────────────
function loadBackground() {
  const bg = getStoreObj('wi_background', 'bg_main');
  if (!Object.keys(bg).length) return;

  const body = document.body;

  // Create or find persistent background layer
  let bgLayer = document.getElementById('wi-bg-layer');
  if (!bgLayer) {
    bgLayer = document.createElement('div');
    bgLayer.id = 'wi-bg-layer';
    bgLayer.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: -2;
      pointer-events: none;
      transition: all 0.5s ease;
    `;
    document.body.prepend(bgLayer);
  }

  // Create or find overlay layer
  let overlayLayer = document.getElementById('wi-bg-overlay');
  if (!overlayLayer) {
    overlayLayer = document.createElement('div');
    overlayLayer.id = 'wi-bg-overlay';
    overlayLayer.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
    `;
    document.body.prepend(overlayLayer);
  }

  // Apply background image or color
  const brightness = bg.brightness || 100;
  const saturate   = bg.saturate   || 100;
  const blur       = bg.blur       || 0;
  const filter     = `brightness(${brightness}%) saturate(${saturate}%) blur(${blur}px)`;

  if (bg.image) {
    bgLayer.style.backgroundImage    = `url(${bg.image})`;
    bgLayer.style.backgroundSize     = bg.size       || 'cover';
    bgLayer.style.backgroundPosition = bg.position   || 'center';
    bgLayer.style.backgroundAttachment = bg.attachment || 'scroll';
    bgLayer.style.backgroundRepeat   = 'no-repeat';
    bgLayer.style.backgroundColor    = bg.color || '#fdf6f0';
    bgLayer.style.filter             = filter;

    // Make body/section backgrounds transparent to show custom bg
    document.documentElement.style.setProperty('--color-bg', 'transparent');
    document.documentElement.style.setProperty('--color-bg-section', 'rgba(255,255,255,0.65)');
  } else if (bg.color) {
    bgLayer.style.backgroundImage = 'none';
    bgLayer.style.backgroundColor = bg.color;
    bgLayer.style.filter          = filter;
  }

  // Overlay
  if (bg.overlayOpacity > 0 && bg.overlayColor) {
    const hex = bg.overlayColor;
    const r   = parseInt(hex.slice(1,3), 16);
    const g   = parseInt(hex.slice(3,5), 16);
    const b   = parseInt(hex.slice(5,7), 16);
    overlayLayer.style.background = `rgba(${r},${g},${b},${(bg.overlayOpacity||0)/100})`;
  } else {
    overlayLayer.style.background = 'none';
  }
}

// ─── Opening Screen ─────────────────────────────────────
function initOpening() {
  const btn = document.getElementById('btn-open-invite');
  const screen = document.getElementById('opening-screen');
  if (!btn || !screen) return;

  btn.addEventListener('click', () => {
    screen.classList.add('hide');
    setTimeout(() => { screen.style.display = 'none'; }, 900);
    startPetals();
    startCountdown();
  });
}

// ─── Petal / Sakura Canvas Animation ────────────────────
function startPetals() {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const PETAL_COUNT = 35;
  const petals = [];

  // Get config from DB or LocalStorage
  let modelStr = localStorage.getItem('wi_particle_model') || 'sakura';
  let customImgStr = localStorage.getItem('wi_particle_custom_img') || null;
  
  if (window.WEDDING_CONFIG && window.WEDDING_CONFIG.extra && window.WEDDING_CONFIG.extra.particles) {
    if (!localStorage.getItem('wi_particle_model')) {
      modelStr = window.WEDDING_CONFIG.extra.particles.model || 'sakura';
      customImgStr = window.WEDDING_CONFIG.extra.particles.custom_img || null;
    }
  }

  let customImgObj = null;
  if (modelStr === 'custom' && customImgStr) {
    customImgObj = new Image();
    customImgObj.src = customImgStr;
  }

  const baseColors = [
    getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#b5838d',
    getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim() || '#e8c4c4',
    getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#d4a5a5',
    '#ffffff'
  ];

  function mkPetal() {
    return {
      x: Math.random() * canvas.width,
      y: -20,
      size: (modelStr === 'snow' ? 4 : 8) + Math.random() * (modelStr === 'snow' ? 6 : 14),
      speedY: (modelStr === 'snow' ? 0.8 : 1.2) + Math.random() * 2,
      speedX: (Math.random() - 0.5) * 1.5,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      opacity: 0.4 + Math.random() * 0.6,
      color: modelStr === 'snow' ? '#ffffff' : baseColors[Math.floor(Math.random() * baseColors.length)],
      swing: Math.random() * Math.PI * 2,
      swingSpeed: 0.02 + Math.random() * 0.02,
    };
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    const p = mkPetal(); p.y = Math.random() * window.innerHeight; petals.push(p);
  }

  function drawPetal(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;

    if (modelStr === 'custom' && customImgObj && customImgObj.complete) {
      ctx.drawImage(customImgObj, -p.size / 2, -p.size / 2, p.size, p.size);
    } else if (modelStr === 'heart') {
      ctx.beginPath();
      const topCurveHeight = p.size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -p.size / 2, 0, -p.size / 2, topCurveHeight);
      ctx.bezierCurveTo(-p.size / 2, p.size * 0.6, 0, p.size * 0.8, 0, p.size);
      ctx.bezierCurveTo(0, p.size * 0.8, p.size / 2, p.size * 0.6, p.size / 2, topCurveHeight);
      ctx.bezierCurveTo(p.size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.fill();
    } else if (modelStr === 'star') {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * p.size, -Math.sin((18 + i * 72) / 180 * Math.PI) * p.size);
        ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (p.size * 0.4), -Math.sin((54 + i * 72) / 180 * Math.PI) * (p.size * 0.4));
      }
      ctx.closePath();
      ctx.fill();
    } else if (modelStr === 'snow') {
      ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill();
    } else {
      // default: sakura or rose (ellipse)
      ctx.beginPath(); ctx.ellipse(0, 0, p.size / 2, p.size / 3.5, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.swing += p.swingSpeed;
      p.x += p.speedX + Math.sin(p.swing) * 0.8;
      p.y += p.speedY;
      p.rot += p.rotSpeed;

      if (p.y > canvas.height + 30) {
        Object.assign(p, mkPetal());
      }
      drawPetal(p);
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ─── Countdown Timer ─────────────────────────────────────
function startCountdown() {
  function update() {
    const target = STATE.countdownTarget || new Date('2026-08-17T09:00:00');
    const now    = new Date();
    const diff   = target - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent    = '0';
      document.getElementById('cd-hours').textContent   = '0';
      document.getElementById('cd-minutes').textContent = '0';
      document.getElementById('cd-seconds').textContent = '0';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent    = String(d).padStart(2, '0');
    document.getElementById('cd-hours').textContent   = String(h).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(s).padStart(2, '0');
  }

  update();
  STATE.countdownInterval = setInterval(update, 1000);
}

// ─── Scroll Reveal ─────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ─── Image Upload Helper ────────────────────────────────
function setupImageUploader(triggerEl, imgEl, storageKey) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.className = 'hidden-upload';
  document.body.appendChild(input);

  triggerEl.addEventListener('click', (e) => {
    e.stopPropagation();
    input.click();
  });

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      imgEl.src = ev.target.result;
      if (storageKey) {
        const images = JSON.parse(localStorage.getItem('wi_images') || '{}');
        images[storageKey] = ev.target.result;
        localStorage.setItem('wi_images', JSON.stringify(images));
      }
    };
    reader.readAsDataURL(file);
  });
}

// ─── RSVP Form ─────────────────────────────────────────
function initRSVP() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = document.getElementById('rsvp-name').value;
    const attend  = document.getElementById('rsvp-attend').value;
    const message = document.getElementById('rsvp-message').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name.trim()) return;

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Mengirim...'; }

    const wishData = { guest_name: name, attend: attend, message: message };
    
    // Save to Supabase if available
    let success = false;
    if (window.sb) {
      try {
        const { error } = await window.sb.from('wishes').insert([wishData]);
        if (!error) success = true;
      } catch (err) { console.error('Supabase RSVP error', err); }
    }

    // Local state append
    const wish = { name, attend, message, ts: Date.now() };
    STATE.wishes.unshift(wish);
    localStorage.setItem('wi_wishes', JSON.stringify(STATE.wishes));

    renderWish(wish, true);

    form.style.display = 'none';
    document.getElementById('rsvp-success').style.display = 'block';

    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Kirim Konfirmasi & Ucapan'; }

    setTimeout(() => {
      form.style.display = '';
      form.reset();
      document.getElementById('rsvp-success').style.display = 'none';
    }, 4000);
  });
}

// ─── Render Wishes ──────────────────────────────────────
async function renderWishes() {
  const container = document.getElementById('wishes-list');
  if (!container) return;

  // Try to load from Supabase FIRST
  if (window.sb) {
    try {
      const { data, error } = await window.sb.from('wishes').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        // Replace STATE.wishes with DB data
        STATE.wishes = data.map(dbW => ({
          name: dbW.guest_name,
          attend: dbW.attend,
          message: dbW.message,
          ts: new Date(dbW.created_at).getTime()
        }));
      }
    } catch (err) { console.error('Failed to load wishes from Supabase', err); }
  }

  container.innerHTML = '';
  STATE.wishes.forEach(w => renderWish(w, false));
}

function renderWish(w, prepend = false) {
  const container = document.getElementById('wishes-list');
  if (!container) return;

  const attendText = { hadir: '✓ Hadir', tidak: '✗ Tidak Hadir', mungkin: '? Mungkin' };
  const div = document.createElement('div');
  div.className = 'wish-card reveal';
  div.innerHTML = `
    <div class="wish-author">${escapeHtml(w.name)}</div>
    <div class="wish-attend">${attendText[w.attend] || w.attend}</div>
    ${w.message ? `<div class="wish-text">${escapeHtml(w.message)}</div>` : ''}
  `;
  if (prepend && container.firstChild) {
    container.insertBefore(div, container.firstChild);
  } else {
    container.appendChild(div);
  }
  setTimeout(() => div.classList.add('visible'), 50);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Music Player (loads from localStorage or fallback) ───
function initMusic() {
  const btn   = document.getElementById('music-btn');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;

  // Music config may come from Supabase object or localStorage string
  let musicSrc = localStorage.getItem('wi_music_src');
  let musicAutoplay = localStorage.getItem('wi_music_autoplay') === 'true';

  if (window.WEDDING_CONFIG && window.WEDDING_CONFIG.music && Object.keys(window.WEDDING_CONFIG.music).length) {
    if (!musicSrc) musicSrc = window.WEDDING_CONFIG.music.src;
    // localStorage string overrides config if explicitly set to 'true'/'false'
    const storedAuto = localStorage.getItem('wi_music_autoplay');
    if (storedAuto === 'true' || storedAuto === 'false') {
      musicAutoplay = storedAuto === 'true';
    } else {
      musicAutoplay = window.WEDDING_CONFIG.music.autoplay === 'true' || window.WEDDING_CONFIG.music.autoplay === true;
    }
  }

  if (musicSrc) {
    audio.src = musicSrc;
    audio.load();
  } else {
    audio.src = 'assets/music.mp3';
  }

  // Auto-play setting
  if (musicAutoplay) {
    const tryPlay = () => {
      audio.play().then(() => {
        btn.classList.add('playing');
        btn.textContent = '🎶';
        STATE.musicPlaying = true;
      }).catch(() => {
        // Autoplay blocked — wait for user interaction
        document.addEventListener('click', () => {
          if (!STATE.musicPlaying) {
            audio.play().catch(()=>{});
            btn.classList.add('playing');
            btn.textContent = '🎶';
            STATE.musicPlaying = true;
          }
        }, { once: true });
      });
    };
    tryPlay();
  }

  btn.addEventListener('click', () => {
    if (STATE.musicPlaying) {
      audio.pause();
      btn.classList.remove('playing');
      btn.textContent = '🎵';
    } else {
      audio.play().catch(() => {});
      btn.classList.add('playing');
      btn.textContent = '🎶';
    }
    STATE.musicPlaying = !STATE.musicPlaying;
  });
}

// ─── Gallery Image Upload ────────────────────────────────
function initGalleryUploads() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach((item, i) => {
    const img = item.querySelector('img');
    if (!img) return;
    // Key matches editor.js IMAGE_DEFS
    const storageKey = `gallery-img-${i}`;
    setupImageUploader(item, img, storageKey);
  });
}

// ─── Event Icon Upload ───────────────────────────────────
function initEventIconUploads() {
  const icons = document.querySelectorAll('.event-icon-wrap');
  icons.forEach((wrap, i) => {
    const img = wrap.querySelector('.event-icon-img');
    if (!img) return;
    // Key matches HTML id: event-icon-0, event-icon-1
    const imgId = img.id || `event-icon-${i}`;
    setupImageUploader(wrap, img, imgId);
  });
}

// ─── Hero Photo Upload ───────────────────────────────────
function initHeroPhotoUpload() {
  const img = document.getElementById('hero-photo');
  const wrap = document.getElementById('hero-photo-wrap');
  if (img && wrap) {
    // Key matches editor.js IMAGE_DEFS id: 'hero-photo'
    setupImageUploader(wrap, img, 'hero-photo');
  }
}

// ─── Couple Photos Upload ─────────────────────────────────
function initCouplePhotoUploads() {
  ['groom-photo', 'bride-photo'].forEach(id => {
    const img  = document.getElementById(id);
    const wrap = img ? img.closest('.couple-photo-wrap') : null;
    if (img && wrap) {
      const editBtn = wrap.querySelector('.photo-edit-btn');
      if (editBtn) {
        // Key matches editor.js IMAGE_DEFS id: 'groom-photo' / 'bride-photo'
        setupImageUploader(editBtn, img, id);
      }
    }
  });
}

// ─── Opening Screen Background ───────────────────────────
function loadOpeningBg() {
  const ob = getStoreObj('wi_opening_bg', 'bg_opening');
  if (!Object.keys(ob).length) return;

  const bgLayer  = document.getElementById('opening-bg-layer');
  const overlay  = document.getElementById('opening-bg-overlay');
  const screen   = document.getElementById('opening-screen');

  if (!bgLayer) return;

  // Apply filter
  const filter = `brightness(${ob.brightness||100}%) saturate(${ob.saturate||100}%) blur(${ob.blur||0}px)`;
  bgLayer.style.filter = filter;

  if (ob.image) {
    bgLayer.style.backgroundImage    = `url(${ob.image})`;
    bgLayer.style.backgroundSize     = ob.size     || 'cover';
    bgLayer.style.backgroundPosition = ob.position || 'center';
    bgLayer.style.backgroundRepeat   = 'no-repeat';
    bgLayer.style.backgroundColor    = ob.color || '';
  } else if (ob.color) {
    bgLayer.style.backgroundImage = 'none';
    bgLayer.style.backgroundColor = ob.color;
  }

  // Overlay
  if (overlay && ob.overlayOpacity > 0 && ob.overlayColor) {
    const hex = ob.overlayColor;
    const r   = parseInt(hex.slice(1,3),16);
    const g   = parseInt(hex.slice(3,5),16);
    const b   = parseInt(hex.slice(5,7),16);
    overlay.style.background = `rgba(${r},${g},${b},${(ob.overlayOpacity||0)/100})`;
  }
}

// ─── Supabase Config Fetcher ───────────────────────────
async function initSupabaseConfig() {
  if (!window.sb) return;
  try {
    const { data, error } = await window.sb.from('wedding_config').select('*').eq('id', 1).single();
    if (!error && data) {
      window.WEDDING_CONFIG = Object.assign({}, window.WEDDING_CONFIG || {}, data);
      console.log('✅ Supabase configuration loaded!');
    }
  } catch (err) { console.error('Error fetching config from DB', err); }
}

// ─── Kado Digital Linker ────────────────────────────────
function loadGiftConfig() {
  const wrap = document.getElementById('digital-gift');
  if (!wrap) return;

  let enableStr = localStorage.getItem('wi_gift_enable');
  let bankStr   = localStorage.getItem('wi_gift_bank') || '';
  let accStr    = localStorage.getItem('wi_gift_acc')  || '';
  let nameStr   = localStorage.getItem('wi_gift_name') || '';
  let qrStr     = localStorage.getItem('wi_gift_qr')   || '';

  if (window.WEDDING_CONFIG && window.WEDDING_CONFIG.extra && window.WEDDING_CONFIG.extra.gift) {
    if (!localStorage.getItem('wi_gift_enable')) enableStr = window.WEDDING_CONFIG.extra.gift.enable ? 'true' : 'false';
    if (!localStorage.getItem('wi_gift_bank')) bankStr = window.WEDDING_CONFIG.extra.gift.bank || '';
    if (!localStorage.getItem('wi_gift_acc')) accStr = window.WEDDING_CONFIG.extra.gift.acc || '';
    if (!localStorage.getItem('wi_gift_name')) nameStr = window.WEDDING_CONFIG.extra.gift.name || '';
    if (!localStorage.getItem('wi_gift_qr')) qrStr = window.WEDDING_CONFIG.extra.gift.qr || '';
  }

  if (enableStr === 'true') {
    wrap.style.display = 'block';
    
    const dbank = document.getElementById('pg-gift-bank');
    const dacc  = document.getElementById('pg-gift-acc');
    const dname = document.getElementById('pg-gift-name');
    const dqrwrap = document.getElementById('pg-gift-qr-wrap');
    const dqrimg  = document.getElementById('pg-gift-qr');

    if (dbank) dbank.textContent = bankStr || 'Bank';
    if (dacc) dacc.textContent = accStr || '-';
    if (dname) dname.textContent = nameStr || '-';
    
    if (qrStr && dqrimg && dqrwrap) {
      dqrimg.src = qrStr;
      dqrwrap.style.display = 'block';
    }
  } else {
    wrap.style.display = 'none';
  }
}

// ─── Init All ─────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  // Tunggu konfigurasi dari Supabase jika ada sebelum merender tampilan
  await initSupabaseConfig();

  loadSettings();
  loadGuestName();
  loadOpeningBg();
  loadGiftConfig();
  initOpening();
  initScrollReveal();
  initRSVP();
  await renderWishes();
  initMusic();
  initGalleryUploads();
  initEventIconUploads();
  initHeroPhotoUpload();
  initCouplePhotoUploads();
  startCountdown();

  // Sync extra page fields
  const mapsUrl = getStoreVal('wi_maps_url', 'maps_url');
  if (mapsUrl) { const el = document.getElementById('maps-iframe'); if (el) el.src = mapsUrl; }
  const mapsLink = getStoreVal('wi_maps_link', 'maps_link');
  if (mapsLink) { const el = document.getElementById('ed-maps-link-btn'); if (el) el.href = mapsLink; }

  const texts = getStoreObj('wi_texts', 'texts');
  if (texts['ed-groom-name']) {
    ['ed-groom-name-2'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=texts['ed-groom-name']; });
  }
  if (texts['ed-bride-name']) {
    ['ed-bride-name-2'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=texts['ed-bride-name']; });
  }
});
