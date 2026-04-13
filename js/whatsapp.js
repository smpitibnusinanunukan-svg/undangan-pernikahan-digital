/* ═══════════════════════════════════════════════════════
   WHATSAPP.JS — Bulk WhatsApp Sender
═══════════════════════════════════════════════════════ */

let waContacts = [];
let waSending  = false;
let waCurrent  = 0;
let waTimerRef = null;

// ─── Parse Contact List ─────────────────────────────────
// Supported formats (one per line):
//   Name,+628xxxxxxxxxx
//   +628xxxxxxxxxx
//   Name 08xxxxxxxxxx
function parseContacts(raw) {
  const lines = raw.trim().split('\n');
  const result = [];

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    // CSV: Name,number
    if (line.includes(',')) {
      const [name, ...rest] = line.split(',');
      const num = rest.join(',').trim().replace(/[^+\d]/g, '');
      if (num) result.push({ name: name.trim(), number: normalizePhone(num) });
      return;
    }

    // Try to extract phone (starts with + or 0 or 62) after possible name
    const phoneMatch = line.match(/((?:\+?62|0)[\d\s\-]{8,14})/);
    if (phoneMatch) {
      const num  = phoneMatch[1].trim().replace(/\s|\-/g, '');
      const name = line.replace(phoneMatch[0], '').trim() || 'Tamu';
      result.push({ name, number: normalizePhone(num) });
    }
  });

  return result;
}

function normalizePhone(phone) {
  phone = phone.replace(/\D/g, '');
  if (phone.startsWith('0'))  phone = '62' + phone.slice(1);
  if (!phone.startsWith('62')) phone = '62' + phone;
  return phone;
}

// ─── Build WhatsApp URL ──────────────────────────────────
function buildWaUrl(contact, template, baseUrl) {
  const guestUrl = baseUrl.includes('?')
    ? `${baseUrl}&to=${encodeURIComponent(contact.name)}`
    : `${baseUrl}?to=${encodeURIComponent(contact.name)}`;

  const message = template
    .replace(/\{nama\}/gi, contact.name)
    .replace(/\{link\}/gi, guestUrl)
    .replace(/\{no\}/gi, contact.number);

  return `https://wa.me/${contact.number}?text=${encodeURIComponent(message)}`;
}

// ─── Render Contact Rows ─────────────────────────────────
function renderContactRows() {
  const container = document.getElementById('wa-contact-rows');
  if (!container) return;
  container.innerHTML = '';

  waContacts.forEach((c, i) => {
    const row = document.createElement('div');
    row.className = 'wa-contact-row pending';
    row.id = `wa-row-${i}`;
    row.innerHTML = `
      <div>
        <div class="wa-contact-name">${escapeHtml(c.name)}</div>
        <div class="wa-contact-num">+${c.number}</div>
      </div>
      <div class="wa-contact-status" id="wa-status-${i}">⏳</div>
    `;
    container.appendChild(row);
  });
}

// ─── Parse & Preview Button ─────────────────────────────
function initWaParser() {
  const parseBtn = document.getElementById('wa-parse-btn');
  if (!parseBtn) return;

  parseBtn.addEventListener('click', () => {
    const raw = document.getElementById('wa-list').value;
    waContacts = parseContacts(raw);

    if (waContacts.length === 0) {
      showToast('Tidak ada kontak yang valid ditemukan', 'error');
      return;
    }

    document.getElementById('wa-contact-rows').style.display = '';
    renderContactRows();
    document.getElementById('wa-count-label').textContent =
      `${waContacts.length} kontak siap dikirim`;
    document.getElementById('wa-send-btn-wrap').style.display = '';
    showToast(`${waContacts.length} kontak berhasil diparse`, 'success');
  });
}

// ─── Send WhatsApp Messages ─────────────────────────────
function initWaSender() {
  const sendBtn = document.getElementById('wa-send-btn');
  if (!sendBtn) return;

  sendBtn.addEventListener('click', () => {
    if (waSending) return;
    if (waContacts.length === 0) {
      showToast('Parse kontak terlebih dahulu', 'error');
      return;
    }

    const template = document.getElementById('wa-template').value;
    const baseUrl  = document.getElementById('wa-base-url').value || window.location.href.replace('admin.html', 'index.html');
    const delay    = parseInt(document.getElementById('wa-delay').value) || 3;

    if (!template.includes('{link}') && !template.includes('{nama}')) {
      showToast('Template harus mengandung {nama} atau {link}', 'error');
      return;
    }

    waSending = true;
    waCurrent = 0;
    sendBtn.disabled = true;
    sendBtn.textContent = 'Mengirim...';

    // Show progress bar
    const progress = document.getElementById('wa-progress');
    if (progress) progress.style.display = 'block';

    sendNextWa(template, baseUrl, delay * 1000);
  });
}

function sendNextWa(template, baseUrl, delayMs) {
  if (waCurrent >= waContacts.length) {
    // Done
    waSending = false;
    const sendBtn = document.getElementById('wa-send-btn');
    if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = '🚀 Kirim Semua'; }
    updateWaProgress(waContacts.length, waContacts.length);
    showToast('Semua pesan berhasil dikirim!', 'success');
    return;
  }

  const contact = waContacts[waCurrent];
  const url     = buildWaUrl(contact, template, baseUrl);

  // Mark as sent
  const row    = document.getElementById(`wa-row-${waCurrent}`);
  const status = document.getElementById(`wa-status-${waCurrent}`);
  if (row)    row.classList.replace('pending', 'sent');
  if (status) status.textContent = '✅';

  // Open WhatsApp tab
  window.open(url, '_blank');

  updateWaProgress(waCurrent + 1, waContacts.length);
  waCurrent++;

  if (waCurrent < waContacts.length) {
    updateWaProgress(waCurrent, waContacts.length, true);
    document.getElementById('wa-progress-text').textContent =
      `Mengirim ${waCurrent} / ${waContacts.length}... (${delay} dtk jeda)`;
    const delay = Math.round(delayMs / 1000);
    waTimerRef = setTimeout(() => sendNextWa(template, baseUrl, delayMs), delayMs);
  } else {
    sendNextWa(template, baseUrl, delayMs);
  }
}

function updateWaProgress(current, total, waiting = false) {
  const bar  = document.getElementById('wa-progress-bar');
  const text = document.getElementById('wa-progress-text');
  if (bar)  bar.style.width  = `${(current / total) * 100}%`;
  if (text) text.textContent = waiting
    ? `Menunggu jeda sebelum kontak berikutnya...`
    : `Terkirim: ${current} / ${total}`;
}

// ─── Toast Helper (shared with admin.js) ────────────────
function showToast(msg, type = 'info') {
  const wrap = document.getElementById('toast-wrap');
  if (!wrap) return;
  const div = document.createElement('div');
  div.className  = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  div.innerHTML  = `<span>${icons[type] || ''}</span><span>${escapeHtml(msg)}</span>`;
  wrap.appendChild(div);
  setTimeout(() => div.remove(), 3200);
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Add custom row manually ──────────────────────────────
function initManualAdd() {
  const addBtn = document.getElementById('wa-add-btn');
  if (!addBtn) return;

  addBtn.addEventListener('click', () => {
    const name  = document.getElementById('wa-add-name').value.trim();
    const phone = document.getElementById('wa-add-phone').value.trim();
    if (!name || !phone) {
      showToast('Isi nama dan nomor HP', 'error');
      return;
    }
    const num = normalizePhone(phone.replace(/\D/g, ''));
    waContacts.push({ name, number: num });
    renderContactRows();
    document.getElementById('wa-count-label').textContent =
      `${waContacts.length} kontak siap dikirim`;
    document.getElementById('wa-send-btn-wrap').style.display = '';
    document.getElementById('wa-add-name').value  = '';
    document.getElementById('wa-add-phone').value = '';
    showToast(`${name} ditambahkan`, 'success');
  });
}

// ─── Init ────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  initWaParser();
  initWaSender();
  initManualAdd();
});
