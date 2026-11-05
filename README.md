# AETHERIA — Website Profesional 3D (HTML, CSS, JS & Three.js)

Website 3D interaktif profesional berstandar modern internasional (Awwwards/FWA style) yang dibangun murni menggunakan **HTML5**, **CSS3 (Glassmorphism & 3D Perspective)**, dan **JavaScript (Three.js WebGL & Web Audio API)**.

---

## 🌟 Fitur Utama

1. **Inti 3D WebGL Real-Time (Three.js)**:
   - Objek Geometri 3D Interaktif (Quantum Knot, Cyber Crystal, Neural Sphere, Singularity Ring).
   - Efek pencahayaan dinamis multi-sumber (Key Light, Fill Light, Rim Light).
   - Sistem partikel kosmik (2.200+ partikel stardust) dengan pergerakan matematis harmonik.
   - Pecahan kristal (geometric shards) mengambang dalam ruang 3 dimensi.

2. **Interaktivitas Penuh**:
   - **Kamera Responsif Kursor**: Ruang 3D berputar halus mengikuti gerakan mouse/touch pengguna dengan algoritma peredaman *Lerp (Linear Interpolation)*.
   - **Scroll-Driven 3D Motion**: Sudut pandang kamera, translasi kedalaman z-axis, dan rotasi bertransformasi secara proporsional sesuai progres scroll halaman.
   - **Lab 3D Interaktif**: Pengunjung dapat mengubah bentuk geometri secara langsung (Morfologi objek), mengatur kecepatan rotasi, skala dimensi, dan intensitas aura partikel.
   - **Kontrol HUD**: Tombol instan untuk beralih mode wireframe, dispersi partikel, dan reset posisi kamera.

3. **Efek Desain Visual Kelas Atas**:
   - **Glassmorphism**: Panel transparan dengan blur latar belakang (`backdrop-filter: blur(16px)`) dan border semi-transparan elegan.
   - **Kartu Kemiringan 3D (*Tilt Effect*)**: Efek rotasi perspektif CSS 3D (`rotateX`, `rotateY`) dan pantulan kilau dinamis saat kursor melayang di atas kartu layanan maupun portofolio.
   - **Kursor Khusus Bercahaya**: Titik kursor berpresisi tinggi dengan cincin aura bercahaya dan efek magnetis.
   - **4 Pilihan Tema Warna Real-Time**: Cyber Cyan, Neon Violet, Matrix Emerald, dan Solar Amber yang langsung mengubah CSS variables dan pencahayaan Three.js secara sinkron.

4. **Sintesis Audio Web Murni (Web Audio API)**:
   - Efek suara futuristik (klik, hover, modulasi morphing, dan arpeggio sukses) yang disintesis langsung melalui kode matematika audio peramban tanpa perlu mengunduh file MP3/WAV eksternal berukuran besar.
   - Dilengkapi tombol toggle aktif/nonaktif di pojok kiri bawah.

5. **Responsif & Ringan**:
   - Berjalan lancar 60 FPS di desktop maupun layar sentuh smartphone/tablet.
   - Dilengkapi preloader 3D kubus CSS beranimasi futuristik.

---

## 🚀 Cara Menjalankan Website

Anda dapat langsung membuka file:

```
C:\Users\UseR\Downloads\website-3d-profesional\index.html
```

### Opsi 1: Langsung Klik Dua Kali
Cukup klik dua kali (double click) file `index.html` pada File Explorer untuk membukanya di browser favorit Anda (Google Chrome, Microsoft Edge, Firefox, Brave, Safari).

### Opsi 2: Menggunakan Local Server (Direkomendasikan)
Jika Anda memiliki Node.js, Python, atau VS Code Live Server:

**Menggunakan Python:**
```bash
cd "C:\Users\UseR\Downloads\website-3d-profesional"
python -m http.server 3000
```
Buka browser pada: `http://localhost:3000`

**Menggunakan Node.js `npx serve`:**
```bash
cd "C:\Users\UseR\Downloads\website-3d-profesional"
npx serve .
```

---

## 📁 Struktur Berkas

```
website-3d-profesional/
├── index.html        # Struktur semantik halaman, navigasi, lab 3D, layanan & formulir
├── style.css         # Desain Glassmorphism, sistem grid modern, animasi, dan tema warna
├── script.js         # Engine 3D Three.js, Web Audio API, interaksi kursor, dan kontrol lab
└── README.md         # Dokumentasi lengkap dan panduan kustomisasi
```

---

## 🛠️ Panduan Kustomisasi Cepat

- **Mengubah Teks / Konten**: Buka `index.html` dan sesuaikan teks judul, deskripsi, tautan sosial media, dan informasi kontak.
- **Mengubah Warna Utama**: Buka `style.css` pada bagian `:root` untuk mengganti nilai warna `--primary` dan `--secondary`.
- **Menambah Model 3D Sendiri (GLTF/GLB)**:
  Anda dapat menyertakan `GLTFLoader` dari Three.js untuk memuat file `.glb` atau `.gltf` kustom (misal model mobil, robot, sneakers, dsb.) dengan mengganti `coreMesh` pada `script.js`.
