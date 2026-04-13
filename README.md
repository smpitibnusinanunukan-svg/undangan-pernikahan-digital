# 💍 Wedding Invitation Website

Website undangan pernikahan digital dengan fitur lengkap.

## 🚀 Cara Penggunaan

### Membuka Website
1. Buka file `index.html` di browser untuk melihat halaman undangan
2. Buka file `admin.html` untuk mengelola konten undangan
3. Atau gunakan server lokal: `npx serve .` (jika Node.js terinstal)

---

## ✨ Fitur Lengkap

### Halaman Undangan (`index.html`)
- 🌸 **Animasi Kelopak Bunga** — Partikel kelopak jatuh (Canvas API)
- 💫 **Scroll Reveal** — Elemen muncul saat di-scroll
- 💖 **Floating Animations** — Foto dan dekorasi bergerak naik-turun
- ⏰ **Countdown Timer** — Hitung mundur ke hari pernikahan
- 📱 **Responsive** — Tampil baik di HP dan PC
- 👤 **Nama Tamu Dinamis** — Tambahkan `?to=NamaTamu` di URL
- 🎵 **Musik Latar** — Toggle on/off (tambahkan music.mp3 di folder assets)
- 📝 **RSVP Form** — Konfirmasi kehadiran + ucapan tersimpan

### Panel Admin (`admin.html`)
- ✏️ **Edit Teks** — Ubah semua teks undangan (nama, tanggal, lokasi, dll.)
- 🎨 **Ubah Warna** — 5 tema preset + color picker kustom
- 🖼️ **Ganti Gambar** — Upload foto untuk semua gambar (klik thumbnail)
- 📱 **Kirim WhatsApp Massal** — Input daftar kontak, kirim link personal
- 📥 **Export Data** — Download ucapan tamu dalam format TXT/CSV

---

## 🎨 Tema Warna Tersedia
| Tema | Warna Utama |
|------|-------------|
| 🌹 Rose Garden | Pink mawar (default) |
| 🌿 Sage Green | Hijau sage |
| 🌊 Navy Blue | Biru navy |
| 💜 Mauve Purple | Ungu mauve |
| 🌰 Earth Tones | Cokelat tanah |

---

## 📱 Cara Kirim Undangan via WhatsApp

1. Buka `admin.html` → Tab **Kirim WhatsApp**
2. Isi URL undangan (link hosting atau file lokal)
3. Edit template pesan (gunakan `{nama}` dan `{link}`)
4. Masukkan daftar kontak (format: `Nama, 08xxx` — satu per baris)
5. Klik **Parse & Preview**, lalu **Kirim Semua**
6. Browser akan membuka tab WhatsApp untuk setiap kontak

### Format Daftar Kontak
```
Budi Santoso, 081234567890
Siti Aminah, +6285678901234
Pak Wahyu 08987654321
+6281234509876
```

---

## 🔗 Nama Tamu Dinamis

Tambahkan parameter `?to=NamaTamu` di URL untuk menampilkan nama tamu:

```
index.html?to=Budi+Santoso
index.html?to=Anita+Dewi
```

Nama akan muncul di:
- Layar pembuka
- Section hero undangan

---

## 🖼️ Menambah Musik Latar

Letakkan file MP3 di `assets/music.mp3`. Musik bisa di-toggle dengan tombol 🎵 di pojok kiri bawah.

---

## 💾 Penyimpanan Data

Semua perubahan (teks, warna, gambar) disimpan di **localStorage** browser. Data tidak hilang saat refresh.

> **Catatan:** Data hanya tersimpan di browser yang sama. Untuk berbagi antar perangkat, upload ke hosting web.

---

## 📁 Struktur File

```
wedding-invitation/
├── index.html          ← Halaman undangan utama
├── admin.html          ← Panel admin
├── css/
│   ├── style.css       ← Design system undangan
│   └── admin.css       ← Style panel admin
├── js/
│   ├── main.js         ← Logic animasi, RSVP, nama tamu
│   ├── editor.js       ← Editor teks, warna, gambar
│   └── whatsapp.js     ← Bulk WhatsApp sender
└── assets/             ← Gambar placeholder (ganti sesuai kebutuhan)
```
