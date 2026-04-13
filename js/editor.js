/* ═══════════════════════════════════════════════════════
   EDITOR.JS — Admin Panel: Tab Nav, Colors, Text, Images, Background
═══════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────
   TAB NAVIGATION — Called first, before any build
─────────────────────────────────────────────────────── */
function initSidebarNav() {
  const navLinks = document.querySelectorAll('[data-tab]');
  const panels   = document.querySelectorAll('.tab-panel');

  function switchTab(tabId) {
    // Deactivate all
    navLinks.forEach(l => l.classList.remove('active'));
    panels.forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none'; // Force hide
    });

    // Activate target
    const targetLink  = document.querySelector(`[data-tab="${tabId}"]`);
    const targetPanel = document.getElementById(`panel-${tabId}`);

    if (targetLink)  targetLink.classList.add('active');
    if (targetPanel) {
      targetPanel.classList.add('active');
      targetPanel.style.display = 'block'; // Force show
    }
  }

  // Attach click handlers
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      switchTab(link.dataset.tab);
    });
  });

  // Hide all panels first
  panels.forEach(p => { p.style.display = 'none'; });

  // Activate "text" tab by default
  switchTab('text');
}

/* ───────────────────────────────────────────────────────
   COLOR DEFINITIONS
─────────────────────────────────────────────────────── */
const COLOR_DEFS = [
  { var: '--color-primary',    label: 'Warna Primer',      desc: 'Tombol, judul script, aksen utama' },
  { var: '--color-secondary',  label: 'Warna Sekunder',    desc: 'Border, background muda' },
  { var: '--color-accent',     label: 'Warna Aksen',       desc: 'Elemen pendukung, hover' },
  { var: '--color-gold',       label: 'Warna Emas',        desc: 'Ikon emas, divider, aksesoris' },
  { var: '--color-dark',       label: 'Warna Gelap',       desc: 'Teks judul heading' },
  { var: '--color-text',       label: 'Warna Teks Utama',  desc: 'Paragraf, konten' },
  { var: '--color-text-light', label: 'Teks Redup',        desc: 'Label kecil, keterangan' },
  { var: '--color-bg',         label: 'Background Utama',  desc: 'Warna latar halaman utama' },
  { var: '--color-bg-section', label: 'Background Section',desc: 'Latar section bergantian' },
];

const COLOR_DEFAULTS = {
  '--color-primary':    '#b5838d',
  '--color-secondary':  '#e8c4c4',
  '--color-accent':     '#d4a5a5',
  '--color-gold':       '#c9a96e',
  '--color-dark':       '#3d2b2b',
  '--color-text':       '#5c3d3d',
  '--color-text-light': '#9a7070',
  '--color-bg':         '#fdf6f0',
  '--color-bg-section': '#fff9f5',
};

const THEME_PRESETS = {
  rose:  { '--color-primary':'#b5838d', '--color-secondary':'#e8c4c4', '--color-accent':'#d4a5a5', '--color-gold':'#c9a96e', '--color-dark':'#3d2b2b', '--color-text':'#5c3d3d', '--color-text-light':'#9a7070', '--color-bg':'#fdf6f0', '--color-bg-section':'#fff9f5' },
  sage:  { '--color-primary':'#7a9e7e', '--color-secondary':'#c5ddc7', '--color-accent':'#a3c4a5', '--color-gold':'#c9a96e', '--color-dark':'#2b3d2b', '--color-text':'#3d5c3d', '--color-text-light':'#7a9a7a', '--color-bg':'#f3f8f3', '--color-bg-section':'#f8fbf8' },
  navy:  { '--color-primary':'#5c7a9a', '--color-secondary':'#c4d3e8', '--color-accent':'#a5bcd4', '--color-gold':'#c9a96e', '--color-dark':'#1e2d3d', '--color-text':'#2d3d5c', '--color-text-light':'#7090a7', '--color-bg':'#f5f7fb', '--color-bg-section':'#f9fafb' },
  mauve: { '--color-primary':'#9a7ab5', '--color-secondary':'#dcd0ee', '--color-accent':'#c4afd9', '--color-gold':'#c9a96e', '--color-dark':'#2d2040', '--color-text':'#4a3860', '--color-text-light':'#9080aa', '--color-bg':'#faf7fe', '--color-bg-section':'#f7f4fb' },
  earth: { '--color-primary':'#a0785a', '--color-secondary':'#e0d0c4', '--color-accent':'#c4a89a', '--color-gold':'#c9a96e', '--color-dark':'#3d2a1a', '--color-text':'#5c3d2a', '--color-text-light':'#9a8070', '--color-bg':'#fdf9f5', '--color-bg-section':'#faf5f0' },
};

/* ───────────────────────────────────────────────────────
   TEXT FIELD DEFINITIONS
─────────────────────────────────────────────────────── */
const TEXT_DEFS = [
  { id: 'ed-groom-name',      label: 'Nama Mempelai Pria (Script)',          group: 'Mempelai' },
  { id: 'ed-bride-name',      label: 'Nama Mempelai Wanita (Script)',        group: 'Mempelai' },
  { id: 'ed-groom-full',      label: 'Nama Lengkap Pria (+ gelar)',          group: 'Mempelai' },
  { id: 'ed-bride-full',      label: 'Nama Lengkap Wanita (+ gelar)',        group: 'Mempelai' },
  { id: 'ed-groom-parents',   label: 'Orang Tua Mempelai Pria',              group: 'Mempelai', multi: true },
  { id: 'ed-bride-parents',   label: 'Orang Tua Mempelai Wanita',            group: 'Mempelai', multi: true },
  { id: 'ed-event-date',      label: 'Tahun (kotak tanggal hero)',            group: 'Tanggal & Waktu' },
  { id: 'ed-countdown-date',  label: 'Tanggal Countdown (YYYY-MM-DD)',       group: 'Tanggal & Waktu', type: 'date' },
  { id: 'ed-akad-date',       label: 'Tanggal Akad Nikah',                   group: 'Acara' },
  { id: 'ed-akad-time',       label: 'Jam Akad Nikah',                       group: 'Acara' },
  { id: 'ed-akad-place',      label: 'Nama Tempat Akad',                     group: 'Acara' },
  { id: 'ed-akad-address',    label: 'Alamat Akad',                          group: 'Acara', multi: true },
  { id: 'ed-resepsi-date',    label: 'Tanggal Resepsi',                      group: 'Acara' },
  { id: 'ed-resepsi-time',    label: 'Jam Resepsi',                          group: 'Acara' },
  { id: 'ed-resepsi-place',   label: 'Nama Tempat Resepsi',                  group: 'Acara' },
  { id: 'ed-resepsi-address', label: 'Alamat Resepsi',                       group: 'Acara', multi: true },
  { id: 'ed-quote',           label: 'Kutipan Ayat / Pesan Utama',           group: 'Konten', multi: true },
  { id: 'ed-quote-source',    label: 'Sumber Kutipan',                       group: 'Konten' },
  { id: 'ed-tagline',         label: 'Tagline di bawah nama (hero)',         group: 'Konten' },
  { id: 'ed-maps-url',        label: 'Google Maps Embed URL (src iframe)',   group: 'Lokasi', type: 'url' },
  { id: 'ed-maps-link',       label: 'Link "Buka di Google Maps"',           group: 'Lokasi', type: 'url' },
];

/* ───────────────────────────────────────────────────────
   IMAGE FIELD DEFINITIONS
─────────────────────────────────────────────────────── */
const IMAGE_DEFS = [
  { id: 'hero-photo',    label: 'Foto Pasangan (Bulat Hero)' },
  { id: 'groom-photo',   label: 'Foto Mempelai Pria' },
  { id: 'bride-photo',   label: 'Foto Mempelai Wanita' },
  { id: 'event-icon-0', label: 'Ikon Akad Nikah' },
  { id: 'event-icon-1', label: 'Ikon Resepsi' },
  { id: 'gallery-img-0',label: 'Galeri Foto 1' },
  { id: 'gallery-img-1',label: 'Galeri Foto 2' },
  { id: 'gallery-img-2',label: 'Galeri Foto 3' },
  { id: 'gallery-img-3',label: 'Galeri Foto 4' },
  { id: 'gallery-img-4',label: 'Galeri Foto 5' },
  { id: 'gallery-img-5',label: 'Galeri Foto 6' },
];

/* ───────────────────────────────────────────────────────
   STORAGE HELPERS
─────────────────────────────────────────────────────── */
const SK = {
  colors: 'wi_colors',
  texts:  'wi_texts',
  images: 'wi_images',
  bg:     'wi_background',
};

function loadSK(key)      { return JSON.parse(localStorage.getItem(key) || '{}'); }
function saveSK(key, obj) { localStorage.setItem(key, JSON.stringify(obj)); }

/* ───────────────────────────────────────────────────────
   SAVE BAR
─────────────────────────────────────────────────────── */
function showSaveBar(show) {
  const bar = document.getElementById('save-bar');
  if (bar) bar.classList.toggle('show', !!show);
}

function initSaveBar() {
  const ok  = document.getElementById('save-bar-confirm');
  const can = document.getElementById('save-bar-cancel');
  if (ok)  ok.addEventListener('click',  () => { saveAllChanges(); showSaveBar(false); showToast('Semua perubahan tersimpan!', 'success'); });
  if (can) can.addEventListener('click', () => { showSaveBar(false); showToast('Perubahan dibatalkan', 'info'); });
}

/* ───────────────────────────────────────────────────────
   SAVE ALL
─────────────────────────────────────────────────────── */
function saveAllChanges() {
  // Colors
  const colorData = {};
  document.querySelectorAll('#color-grid input[type="color"]').forEach(inp => {
    colorData[inp.dataset.var] = inp.value;
  });
  saveSK(SK.colors, colorData);

  // Texts
  const textData = {};
  TEXT_DEFS.forEach(def => {
    const el = document.getElementById(`admin-${def.id}`);
    if (!el) return;
    textData[def.id] = el.value;
    if (def.id === 'ed-countdown-date' && el.value) localStorage.setItem('wi_countdown_date', el.value);
    if (def.id === 'ed-maps-url')  localStorage.setItem('wi_maps_url',  el.value);
    if (def.id === 'ed-maps-link') localStorage.setItem('wi_maps_link', el.value);
  });
  saveSK(SK.texts, textData);

  // Background settings (saved live already, but persist)
  saveBgSettings();
}

/* ───────────────────────────────────────────────────────
   COLOR PANEL
─────────────────────────────────────────────────────── */
function buildColorPanel() {
  const container = document.getElementById('color-grid');
  if (!container) return;
  container.innerHTML = '';

  const saved = loadSK(SK.colors);

  COLOR_DEFS.forEach(def => {
    const val    = saved[def.var] || COLOR_DEFAULTS[def.var] || '#ffffff';
    const idSlug = def.var.replace(/^--/, '').replace(/-/g, '_');

    const item = document.createElement('div');
    item.className = 'color-item';
    item.innerHTML = `
      <div class="color-swatch-wrap" title="Klik untuk ubah warna">
        <div class="color-swatch-preview" id="swatch_${idSlug}" style="background:${val}"></div>
        <input type="color" value="${val}" data-var="${def.var}" id="cinput_${idSlug}">
      </div>
      <div class="color-info">
        <div class="color-name">${def.label}</div>
        <div class="color-val" id="cval_${idSlug}">${val}</div>
      </div>
    `;
    container.appendChild(item);

    const inp    = item.querySelector('input[type="color"]');
    const swatch = item.querySelector('.color-swatch-preview');
    const valEl  = item.querySelector('.color-val');

    inp.addEventListener('input', () => {
      swatch.style.background = inp.value;
      valEl.textContent       = inp.value;
      showSaveBar(true);
    });
  });
}

function applyThemePreset(presetKey) {
  const preset = THEME_PRESETS[presetKey];
  if (!preset) return;
  Object.entries(preset).forEach(([varName, val]) => {
    const idSlug  = varName.replace(/^--/, '').replace(/-/g, '_');
    const inp     = document.getElementById(`cinput_${idSlug}`);
    const swatch  = document.getElementById(`swatch_${idSlug}`);
    const valEl   = document.getElementById(`cval_${idSlug}`);
    if (inp)    inp.value              = val;
    if (swatch) swatch.style.background = val;
    if (valEl)  valEl.textContent      = val;
  });
  showSaveBar(true);
  showToast(`Tema diterapkan. Klik Simpan untuk menyimpan.`, 'info');
}

function initThemePresets() {
  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => applyThemePreset(btn.dataset.preset));
  });
}

/* ───────────────────────────────────────────────────────
   TEXT PANEL
─────────────────────────────────────────────────────── */
function buildTextPanel() {
  const container = document.getElementById('text-fields-container');
  if (!container) return;
  container.innerHTML = '';

  const saved = loadSK(SK.texts);
  let curGroup = '';

  TEXT_DEFS.forEach(def => {
    if (def.group !== curGroup) {
      curGroup = def.group;
      const h = document.createElement('div');
      h.style.cssText = 'font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--c-muted);margin:22px 0 10px;font-weight:600;';
      h.textContent = curGroup;
      container.appendChild(h);
    }

    const fg   = document.createElement('div');
    fg.className = 'form-group';

    const lbl = document.createElement('label');
    lbl.textContent = def.label;
    lbl.htmlFor = `admin-${def.id}`;

    let el;
    if (def.type === 'date') {
      el = document.createElement('input'); el.type = 'date';
    } else if (def.type === 'url') {
      el = document.createElement('input'); el.type = 'url';
    } else if (def.multi) {
      el = document.createElement('textarea'); el.rows = 2;
    } else {
      el = document.createElement('input'); el.type = 'text';
    }

    el.id          = `admin-${def.id}`;
    el.value       = saved[def.id] || '';
    el.placeholder = `${def.label}...`;
    el.addEventListener('input', () => showSaveBar(true));

    fg.appendChild(lbl);
    fg.appendChild(el);
    container.appendChild(fg);
  });
}

/* ───────────────────────────────────────────────────────
   IMAGE PANEL
─────────────────────────────────────────────────────── */
function buildImagePanel() {
  const container = document.getElementById('img-grid');
  if (!container) return;
  container.innerHTML = '';

  const saved = loadSK(SK.images);

  IMAGE_DEFS.forEach(def => {
    const src  = saved[def.id] || svgPlaceholder(def.id);
    const item = document.createElement('div');
    item.className = 'img-item';
    item.title     = `Klik untuk ganti: ${def.label}`;
    item.innerHTML = `
      <img src="${src}" alt="${def.label}" id="aimg_${def.id.replace(/-/g,'_')}">
      <div class="img-edit-overlay">📷</div>
      <div class="img-item-label">${def.label}</div>
    `;

    const fileInput = document.createElement('input');
    fileInput.type    = 'file';
    fileInput.accept  = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    item.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const el = document.getElementById(`aimg_${def.id.replace(/-/g,'_')}`);
        if (el) el.src = ev.target.result;
        const imgs = loadSK(SK.images);
        imgs[def.id] = ev.target.result;
        saveSK(SK.images, imgs);
        showToast(`"${def.label}" berhasil diganti ✨`, 'success');
      };
      reader.readAsDataURL(file);
    });

    container.appendChild(item);
  });
}

/* Petal image uploader */
function initPetalUploader() {
  const item  = document.getElementById('petal-img-item');
  const img   = document.getElementById('admin-petal-img');
  if (!item || !img) return;

  const fi = document.createElement('input');
  fi.type = 'file'; fi.accept = 'image/*'; fi.style.display = 'none';
  document.body.appendChild(fi);

  item.style.cursor = 'pointer';
  item.addEventListener('click', () => fi.click());
  fi.addEventListener('change', () => {
    const file = fi.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      img.src = ev.target.result;
      localStorage.setItem('wi_petal_image', ev.target.result);
      showToast('Gambar petal diganti! ✨', 'success');
    };
    reader.readAsDataURL(file);
  });
}

function svgPlaceholder(id) {
  const palette = [
    ['#e8c4c4','#b5838d'], ['#d4a5a5','#c9a96e'],
    ['#c4e8d4','#83b595'], ['#c4d4e8','#8395b5'],
  ];
  const c   = palette[Math.abs(id.charCodeAt(0) - 97) % palette.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
    <defs><linearGradient id='pg' x1='0%' y1='0%' x2='100%' y2='100%'>
    <stop offset='0%' stop-color='${c[0]}'/>
    <stop offset='100%' stop-color='${c[1]}'/>
    </linearGradient></defs>
    <rect width='200' height='200' fill='url(#pg)'/>
    <text x='100' y='105' font-size='52' text-anchor='middle' fill='rgba(255,255,255,0.65)'>📷</text>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

/* ───────────────────────────────────────────────────────
   BACKGROUND PANEL
─────────────────────────────────────────────────────── */
const defaultBg = {
  image:          null,
  color:          '#fdf6f0',
  overlayColor:   '#000000',
  overlayOpacity: 0,
  blur:           0,
  brightness:     100,
  saturate:       100,
  size:           'cover',
  position:       'center',
  attachment:     'scroll',
};

let bgSettings = JSON.parse(JSON.stringify(defaultBg));
let obSettings = JSON.parse(JSON.stringify(defaultBg));
let currentBgTarget = 'main'; // 'main' or 'opening'

function getBg() {
  return currentBgTarget === 'main' ? bgSettings : obSettings;
}

function loadBgSettings() {
  const savedBg = loadSK(SK.bg);
  Object.assign(bgSettings, savedBg);
  const savedOb = JSON.parse(localStorage.getItem('wi_opening_bg') || '{}');
  Object.assign(obSettings, savedOb);
}

function saveBgSettings() {
  saveSK(SK.bg, bgSettings);
  localStorage.setItem('wi_opening_bg', JSON.stringify(obSettings));
}

function applyBgPreview() {
  const preview = document.getElementById('bg-preview-content');
  const overlay = document.getElementById('bg-preview-overlay');
  const clearBtn = document.getElementById('bg-clear-btn');
  if (!preview) return;

  const bg = getBg();

  const filter = `brightness(${bg.brightness}%) saturate(${bg.saturate}%) blur(${bg.blur}px)`;
  preview.style.filter = filter;

  if (bg.image) {
    preview.style.backgroundImage    = `url(${bg.image})`;
    preview.style.backgroundSize     = bg.size;
    preview.style.backgroundPosition = bg.position;
    preview.style.backgroundColor    = '';
    if (clearBtn) clearBtn.classList.add('visible');
  } else {
    preview.style.backgroundImage = 'none';
    preview.style.backgroundColor = bg.color;
    if (clearBtn) clearBtn.classList.remove('visible');
  }

  if (overlay) {
    const hex = bg.overlayColor;
    const r   = parseInt(hex.slice(1,3), 16);
    const g   = parseInt(hex.slice(3,5), 16);
    const b   = parseInt(hex.slice(5,7), 16);
    overlay.style.background = `rgba(${r},${g},${b},${(bg.overlayOpacity||0)/100})`;
  }
}

function syncBgInputs() {
  const bg = getBg();
  const ranges = [
    { id: 'bg-overlay-opacity', key: 'overlayOpacity', valId: 'val-overlay-opacity', suffix: '%' },
    { id: 'bg-blur',            key: 'blur',            valId: 'val-blur',            suffix: 'px' },
    { id: 'bg-brightness',      key: 'brightness',      valId: 'val-brightness',      suffix: '%' },
    { id: 'bg-saturate',        key: 'saturate',        valId: 'val-saturate',        suffix: '%' },
  ];
  ranges.forEach(r => {
    const el = document.getElementById(r.id);
    const val = document.getElementById(r.valId);
    if (!el) return;
    el.value = bg[r.key] || (r.key === 'brightness' || r.key === 'saturate' ? 100 : 0);
    if (val) val.textContent = el.value + r.suffix;
  });

  ['bg-size','bg-position','bg-attachment'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = bg[id.replace('bg-','')] || el.querySelector('option')?.[0]?.value;
  });

  const bgColorInput = document.getElementById('bg-color-input');
  if (bgColorInput) {
    bgColorInput.value = bg.color || '#fdf6f0';
    bgColorInput.dispatchEvent(new Event('input'));
  }

  const overlayColorInp = document.getElementById('bg-overlay-color');
  if (overlayColorInp) {
    overlayColorInp.value = bg.overlayColor || '#000000';
    overlayColorInp.dispatchEvent(new Event('input'));
  }
}

function buildBgPanel() {
  loadBgSettings();

  const mainBtn    = document.getElementById('bg-mode-main');
  const openingBtn = document.getElementById('bg-mode-opening');

  const updateModeBtn = () => {
    if (mainBtn && openingBtn) {
      if (currentBgTarget === 'main') {
        mainBtn.classList.replace('btn-ghost', 'btn-primary');
        openingBtn.classList.replace('btn-primary', 'btn-ghost');
      } else {
        openingBtn.classList.replace('btn-ghost', 'btn-primary');
        mainBtn.classList.replace('btn-primary', 'btn-ghost');
      }
    }
  };

  if (mainBtn) mainBtn.addEventListener('click', () => { currentBgTarget = 'main'; updateModeBtn(); syncBgInputs(); applyBgPreview(); });
  if (openingBtn) openingBtn.addEventListener('click', () => { currentBgTarget = 'opening'; updateModeBtn(); syncBgInputs(); applyBgPreview(); });

  const bgColorInput    = document.getElementById('bg-color-input');
  const bgImgInput      = document.getElementById('bg-image-file');
  const clearBtn        = document.getElementById('bg-clear-btn');
  const overlayColorInp = document.getElementById('bg-overlay-color');

  const ranges = [
    { id: 'bg-overlay-opacity', key: 'overlayOpacity', valId: 'val-overlay-opacity', suffix: '%' },
    { id: 'bg-blur',            key: 'blur',            valId: 'val-blur',            suffix: 'px' },
    { id: 'bg-brightness',      key: 'brightness',      valId: 'val-brightness',      suffix: '%' },
    { id: 'bg-saturate',        key: 'saturate',        valId: 'val-saturate',        suffix: '%' },
  ];

  ranges.forEach(r => {
    const el  = document.getElementById(r.id);
    const val = document.getElementById(r.valId);
    if (!el) return;
    el.addEventListener('input', () => {
      getBg()[r.key] = parseFloat(el.value);
      if (val) val.textContent = el.value + r.suffix;
      applyBgPreview();
      saveBgSettings();
    });
  });

  ['bg-size','bg-position','bg-attachment'].forEach(id => {
    const el  = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', () => {
      getBg()[id.replace('bg-','')] = el.value;
      applyBgPreview();
      saveBgSettings();
    });
  });

  if (bgColorInput) {
    bgColorInput.addEventListener('input', () => {
      getBg().color = bgColorInput.value;
      if (!getBg().image) applyBgPreview();
      saveBgSettings();
    });
  }

  if (overlayColorInp) {
    overlayColorInp.addEventListener('input', () => {
      getBg().overlayColor = overlayColorInp.value;
      applyBgPreview();
      saveBgSettings();
    });
  }

  if (bgImgInput) {
    bgImgInput.addEventListener('change', () => {
      const file = bgImgInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        getBg().image = ev.target.result;
        applyBgPreview();
        saveBgSettings();
        showToast('Background berhasil dipasang! ✨', 'success');
      };
      reader.readAsDataURL(file);
    });
  }

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      getBg().image = null;
      if (bgImgInput) bgImgInput.value = '';
      applyBgPreview();
      saveBgSettings();
      showToast('Background gambar dihapus', 'info');
    });
  }

  // Upload area click
  const uploadArea = document.getElementById('bg-upload-area');
  if (uploadArea && bgImgInput) {
    uploadArea.addEventListener('click', () => bgImgInput.click());
    uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.style.borderColor = 'var(--c-primary)'; });
    uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
    uploadArea.addEventListener('drop', e => {
      e.preventDefault();
      uploadArea.style.borderColor = '';
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = ev => {
          getBg().image = ev.target.result;
          applyBgPreview();
          saveBgSettings();
          showToast('Background berhasil dipasang! ✨', 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  syncBgInputs();
  applyBgPreview();
}

/* ───────────────────────────────────────────────────────
   SETTINGS PANEL (MUSIC)
─────────────────────────────────────────────────────── */
function initSettingsTab() {
  const fileInput = document.getElementById('settings-music-file');
  const filename  = document.getElementById('settings-music-filename');
  const autoplay  = document.getElementById('settings-music-autoplay');

  if (fileInput) {
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (!file) return;
      filename.textContent = file.name + ' (mengupload...)';

      // Try Supabase Storage first (avoids localStorage quota)
      if (window.sb) {
        try {
          // Sanitize filename — remove special chars, spaces, non-ASCII
          const safeName = file.name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')   // remove diacritics
            .replace(/[^\w.\-]/g, '_')          // replace spaces & special chars with _
            .replace(/_+/g, '_')                // collapse multiple underscores
            .toLowerCase();
          const path = `music/${Date.now()}_${safeName}`;
          const { data, error } = await window.sb.storage
            .from('wedding-assets')
            .upload(path, file, { upsert: true, contentType: file.type });

          if (!error) {
            const { data: urlData } = window.sb.storage
              .from('wedding-assets')
              .getPublicUrl(path);
            const publicUrl = urlData.publicUrl;
            localStorage.setItem('wi_music_src', publicUrl);
            localStorage.setItem('wi_music_type', file.type);
            filename.textContent = file.name + ' ✅';
            showToast('Musik berhasil diupload ke Cloud! 🎵', 'success');
            return;
          } else {
            console.warn('Supabase Storage error, falling back:', error.message);
          }
        } catch (err) {
          console.warn('Storage upload failed, trying local fallback:', err);
        }
      }

      // Fallback: warn user file may be too large
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for localStorage
        showToast('File terlalu besar (>2MB) untuk disimpan lokal. Hubungkan Supabase Storage terlebih dahulu.', 'error');
        filename.textContent = 'File terlalu besar!';
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        try {
          localStorage.setItem('wi_music_src', e.target.result);
          localStorage.setItem('wi_music_type', file.type);
          filename.textContent = file.name + ' ✅';
          showToast('Musik berhasil diganti! ✨', 'success');
        } catch (storageErr) {
          showToast('File terlalu besar! Silakan gunakan file MP3 yang lebih kecil (<2MB).', 'error');
          filename.textContent = 'Gagal — file terlalu besar!';
        }
      };
      reader.readAsDataURL(file);
    });
  }

  if (autoplay) {
    autoplay.checked = localStorage.getItem('wi_music_autoplay') === 'true';
    autoplay.addEventListener('change', () => {
      localStorage.setItem('wi_music_autoplay', autoplay.checked.toString());
      showToast(autoplay.checked ? 'Autoplay diaktifkan' : 'Autoplay dimatikan', 'info');
    });
  }
}


/* ───────────────────────────────────────────────────────
   RESET
─────────────────────────────────────────────────────── */
function initResetBtn() {
  const btn = document.getElementById('btn-reset-all');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!confirm('Reset semua perubahan ke default? Tidak bisa dibatalkan.')) return;
    [SK.colors, SK.texts, SK.images, SK.bg,
     'wi_countdown_date','wi_maps_url','wi_maps_link','wi_petal_image']
      .forEach(k => localStorage.removeItem(k));
    showToast('Reset berhasil! Halaman akan di-refresh.', 'success');
    setTimeout(() => location.reload(), 1500);
  });
}

/* ───────────────────────────────────────────────────────
   TOAST
─────────────────────────────────────────────────────── */
function showToast(msg, type = 'info') {
  const wrap = document.getElementById('toast-wrap');
  if (!wrap) return;
  const div = document.createElement('div');
  div.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  div.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  wrap.appendChild(div);
  setTimeout(() => div.remove(), 3200);
}

/* ───────────────────────────────────────────────────────
   EXPORTS / RESET HELPERS (called from admin.html inline)
─────────────────────────────────────────────────────── */
function exportWishes() {
  const wishes = JSON.parse(localStorage.getItem('wi_wishes') || '[]');
  if (!wishes.length) { showToast('Belum ada ucapan tersimpan', 'info'); return; }
  const txt = wishes.map(w =>
    `[${new Date(w.ts).toLocaleString('id-ID')}]\nNama: ${w.name}\nKehadiran: ${w.attend}\nPesan: ${w.message||'-'}`
  ).join('\n\n---\n\n');
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([txt], {type:'text/plain;charset=utf-8'})),
    download: 'ucapan-tamu.txt'
  });
  a.click();
}

function exportWishesCsv() {
  const wishes = JSON.parse(localStorage.getItem('wi_wishes') || '[]');
  if (!wishes.length) { showToast('Belum ada ucapan tersimpan', 'info'); return; }
  const header = 'Tanggal,Nama,Kehadiran,Pesan';
  const rows   = wishes.map(w =>
    `"${new Date(w.ts).toLocaleString('id-ID')}","${w.name}","${w.attend}","${(w.message||'').replace(/"/g,'""')}"`
  );
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([[header,...rows].join('\n')], {type:'text/csv;charset=utf-8'})),
    download: 'ucapan-tamu.csv'
  });
  a.click();
}

function resetWishes() {
  if (!confirm('Hapus semua ucapan dan konfirmasi tamu?')) return;
  localStorage.removeItem('wi_wishes');
  showToast('Semua ucapan dihapus', 'success');
}

/* ───────────────────────────────────────────────────────
   DEPLOYMENT CONFIG EXPORT (Now Pushes to Supabase)
─────────────────────────────────────────────────────── */
async function exportDeploymentConfig() {
  const payload = {
    id: 1, // enforce single row
    colors: JSON.parse(localStorage.getItem('wi_colors') || '{}'),
    texts: JSON.parse(localStorage.getItem('wi_texts') || '{}'),
    images: JSON.parse(localStorage.getItem('wi_images') || '{}'),
    bg_main: JSON.parse(localStorage.getItem('wi_background') || '{}'),
    bg_opening: JSON.parse(localStorage.getItem('wi_opening_bg') || '{}'),
    music: {
      src: localStorage.getItem('wi_music_src') || '',
      type: localStorage.getItem('wi_music_type') || '',
      autoplay: localStorage.getItem('wi_music_autoplay') || 'false'
    },
    maps: {
      url: localStorage.getItem('wi_maps_url') || '',
      link: localStorage.getItem('wi_maps_link') || ''
    },
    extra: {
      gift: {
        enable: localStorage.getItem('wi_gift_enable') === 'true',
        bank: localStorage.getItem('wi_gift_bank') || '',
        acc: localStorage.getItem('wi_gift_acc') || '',
        name: localStorage.getItem('wi_gift_name') || '',
        qr: localStorage.getItem('wi_gift_qr') || ''
      },
      particles: {
        model: localStorage.getItem('wi_particle_model') || 'sakura',
        custom_img: localStorage.getItem('wi_particle_custom_img') || ''
      },
      countdown_date: localStorage.getItem('wi_countdown_date') || ''
    }
  };

  // 1. Try push to Supabase if connected
  if (window.sb) {
    try {
      showToast('Mengirim data ke Database...', 'info');
      const { error } = await window.sb.from('wedding_config').upsert(payload);
      if (!error) {
        showToast('Sukses! Semua editan tersimpan ke Database Cloud 🚀', 'success');
        return; // Success, no need to download config.js fallback
      } else {
        console.error('Supabase UPSERT Error:', error);
        showToast('Gagal simpan ke DB. Mendownload fallback config.js...', 'error');
      }
    } catch (err) {
      console.error('Supabase push failed', err);
    }
  }


  // 2. Fallback: Download config.js
  const fallbackPayload = {
    colors: payload.colors, texts: payload.texts, images: payload.images,
    bg: payload.bg_main, opening_bg: payload.bg_opening,
    maps_url: payload.maps.url, maps_link: payload.maps.link,
    countdown_date: localStorage.getItem('wi_countdown_date') || '',
    music_src: payload.music.src, music_autoplay: payload.music.autoplay
  };

  const jsContent = `/* 
 * WEDDING INVITATION CONFIGURATION 
 * Generated automatically from Admin Panel.
 */
window.WEDDING_CONFIG = ${JSON.stringify(fallbackPayload, null, 2)};
`;

  const blob = new Blob([jsContent], { type: 'application/javascript;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'config.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('config.js cadangan di-download.', 'info');
}

/* ───────────────────────────────────────────────────────
   INIT — Entry point
─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Tab nav FIRST
  initSidebarNav();

  // 2. Build all panels
  buildColorPanel();
  buildTextPanel();
  buildImagePanel();
  buildBgPanel();
  initPetalUploader();
  initSettingsTab();
  initParticlesConfig();
  initGiftConfig();

  // 3. Wire up helpers
  initSaveBar();
  initResetBtn();
  initThemePresets();

  // 4. Restore saved values into text inputs
  const savedTexts = loadSK(SK.texts);
  TEXT_DEFS.forEach(def => {
    const el = document.getElementById(`admin-${def.id}`);
    if (el && savedTexts[def.id]) el.value = savedTexts[def.id];
  });

  // Special: countdown / maps
  const cd = localStorage.getItem('wi_countdown_date');
  if (cd) { const el = document.getElementById('admin-ed-countdown-date'); if (el) el.value = cd; }
  const mu = localStorage.getItem('wi_maps_url');
  if (mu) { const el = document.getElementById('admin-ed-maps-url'); if (el) el.value = mu; }
  const ml = localStorage.getItem('wi_maps_link');
  if (ml) { const el = document.getElementById('admin-ed-maps-link'); if (el) el.value = ml; }

  // Settings tab maps
  const sue = document.getElementById('settings-maps-embed');
  const sul = document.getElementById('settings-maps-link');
  if (sue && mu) sue.value = mu;
  if (sul && ml) sul.value = ml;

  // Countdown datetime-local
  const scd = document.getElementById('settings-countdown-date');
  if (scd && cd) scd.value = cd;

  // Petal image
  const pi = localStorage.getItem('wi_petal_image');
  if (pi) {
    const img = document.getElementById('admin-petal-img');
    if (img) img.src = pi;
  }

  // ── 5. Supabase Authentication ───────────────────────
  let isSignUpMode = false;
  const sb = window.sb; // use the safe client alias

  if (sb) {
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm    = document.getElementById('admin-login-form');
    const loginToggle  = document.getElementById('login-toggle-mode');
    const loginTitle   = document.getElementById('login-title');
    const loginBtn     = document.getElementById('login-submit-btn');

    // Check if already logged in
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (loginOverlay) loginOverlay.classList.add('hidden');
      } else {
        if (loginOverlay) loginOverlay.classList.remove('hidden');
      }
    });

    // Listen for auth state changes (login / logout)
    sb.auth.onAuthStateChange((_event, session) => {
      if (session) {
        if (loginOverlay) loginOverlay.classList.add('hidden');
      } else {
        if (loginOverlay) loginOverlay.classList.remove('hidden');
      }
    });

    // Toggle Sign Up / Login mode
    if (loginToggle) {
      loginToggle.addEventListener('click', () => {
        isSignUpMode = !isSignUpMode;
        if (isSignUpMode) {
          loginTitle.textContent = '📝 Daftar Admin Baru';
          loginBtn.textContent   = 'Sign Up';
          loginToggle.innerHTML  = 'Sudah punya akun? <span>Login di sini</span>';
        } else {
          loginTitle.textContent = '🔒 Login Admin';
          loginBtn.textContent   = 'Login';
          loginToggle.innerHTML  = 'Belum punya akun? <span>Daftar / Sign Up</span>';
        }
      });
    }

    // Handle form submit
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email    = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        loginBtn.disabled    = true;
        loginBtn.textContent = 'Loading...';

        if (isSignUpMode) {
          const { error } = await sb.auth.signUp({ email, password });
          if (error) {
            alert('Error Sign Up: ' + error.message);
          } else {
            alert('Pendaftaran berhasil! Silakan login dengan akun yang baru saja dibuat.');
            isSignUpMode = false;
            loginTitle.textContent = '🔒 Login Admin';
            loginBtn.textContent   = 'Login';
            loginToggle.innerHTML  = 'Belum punya akun? <span>Daftar / Sign Up</span>';
          }
        } else {
          const { error } = await sb.auth.signInWithPassword({ email, password });
          if (error) {
            alert('Gagal Login: ' + error.message);
          }
        }

        loginBtn.disabled    = false;
        loginBtn.textContent = isSignUpMode ? 'Sign Up' : 'Login';
      });
    }
  }
});

// ─── INIT PARTICLES CONFIG ────────────────────────────────────────────
function initParticlesConfig() {
  const model   = localStorage.getItem('wi_particle_model') || 'sakura';
  const sel     = document.getElementById('settings-particle-model');
  if (sel) sel.value = model;

  if (model === 'custom') {
    const w = document.getElementById('settings-particle-custom-wrap');
    if (w) w.style.display = 'block';
  }

  const customSrc = localStorage.getItem('wi_particle_custom_img');
  const preview   = document.getElementById('settings-particle-preview');
  if (customSrc && preview) { preview.src = customSrc; preview.style.display = 'block'; }

  const fileInp = document.getElementById('settings-particle-file');
  if (fileInp) {
    fileInp.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        localStorage.setItem('wi_particle_custom_img', evt.target.result);
        if (preview) { preview.src = evt.target.result; preview.style.display = 'block'; }
        showToast('Gambar partikel disimpan! ✨', 'success');
      };
      reader.readAsDataURL(file);
    });
  }
}

// ─── INIT GIFT CONFIG (Kado Digital) ─────────────────────────────────
function initGiftConfig() {
  const enableInp = document.getElementById('settings-gift-enable');
  if (enableInp) enableInp.checked = localStorage.getItem('wi_gift_enable') === 'true';

  const bInp = document.getElementById('settings-gift-bank');
  if (bInp) bInp.value = localStorage.getItem('wi_gift_bank') || '';

  const aInp = document.getElementById('settings-gift-acc');
  if (aInp) aInp.value = localStorage.getItem('wi_gift_acc') || '';

  const nInp = document.getElementById('settings-gift-name');
  if (nInp) nInp.value = localStorage.getItem('wi_gift_name') || '';

  const qrSrc  = localStorage.getItem('wi_gift_qr');
  const preview = document.getElementById('settings-gift-qr-preview');
  if (qrSrc && preview) { preview.src = qrSrc; preview.style.display = 'block'; }

  const fileInp = document.getElementById('settings-gift-qr-file');
  if (fileInp) {
    fileInp.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        localStorage.setItem('wi_gift_qr', evt.target.result);
        if (preview) { preview.src = evt.target.result; preview.style.display = 'block'; }
        showToast('QR Code Hadiah disimpan! 🎁', 'success');
      };
      reader.readAsDataURL(file);
    });
  }
}


