# Flashcard App

Aplikasi web flashcard dengan fitur Spaced Repetition (SM-2) untuk membantu menghapal secara efektif. Dapat diinstall sebagai PWA di mobile.

## Fitur

- **Kartu Flashcard** - Buat kartu dengan sisi depan dan belakang
- **Deck Management** - Organisasi kartu ke dalam deck
- **Spaced Repetition (SM-2)** - Algoritma ulangi tertunda untuk menghapal optimal
- **Mode Latihan** - Review kartu dengan rating 1-5
- **Progress Tracking** - Lihat progres belajar
- **PWA** - Installable di mobile (Android/iOS)
- **Offline First** - Tersedia offline, data disimpan lokal
- **Import/Export CSV** - Backup dan import massal kartu dari file CSV
- **Dark Mode** - Dukungan tema gelap/terang
- **Haptic Feedback** - Feedback getaran pada mobile
- **Persistence** - Menyimpan state tab terakhir dan tema user

## Tech Stack

- **Framework**: Svelte 4 (Stable)
- **Styling**: TailwindCSS
- **Build Tool**: Vite 4
- **Storage**: IndexedDB (via idb library)
- **PWA**: vite-plugin-pwa

## Getting Started

### Prerequisites

- Node.js 18+
- npm atau pnpm

### Installation

```bash
# Clone repository
git clone <repo-url>
cd flashcard

# Install dependencies
npm install

# Development
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## Struktur Project

```
/src
  /lib
    /components     # Komponen UI
    /stores         # State management (auth, theme, cards)
    /utils          # Helpers (SM-2, storage, csv)
  App.svelte        # Root component
  main.js           # Entry point
/public
  icons/            # PWA icons
  manifest.json     # PWA manifest
```

## Milestone / Rencana Pengembangan

### Phase 1: Setup & Design (Fondasi)
- [x] Initialize Svelte 4 + Vite 4 project
- [x] Install dependencies (idb, vite-plugin-pwa)
- [x] Install & Konfigurasi **TailwindCSS** + PostCSS
- [x] Setup **Dark Mode Store** (preferensi sistem & toggle)
- [x] Implementasi UI Notifikasi PWA ("Update tersedia")
- [x] Perbaikan Asset: Logo SVG & generate icon layak

### Phase 2: Data Layer (IndexedDB)
- [x] Setup IndexedDB dengan library `idb`
- [x] Store logic untuk Deck & Card (CRUD)
- [x] Implementasi Algoritma SM-2 & Scheduler kartu
- [x] Fitur **Export Data** (JSON/CSV)

### Phase 3: UI Komponen (Mobile-First)
- [x] Layout Utama (Navbar bawah ala mobile app)
- [x] Dashboard: List Deck dengan indikator "Due"
- [x] Flashcard: Animasi flip dengan Tailwind
- [x] Modal input responsif

### Phase 4: Fitur Inti & Latihan
- [x] Logic Sesi Belajar (Filter kartu due)
- [x] UI Latihan: Tampilan kartu, tombol rating (1-5)
- [x] Update statistik SM-2 real-time

### Phase 5: Import/Export & Stats
- [x] Import CSV: Format `deck,depan,belakang`
- [x] Export CSV/JSON: Backup data user
- [x] Halaman Statistik sederhana (Total, Mastery, Streak)

### Phase 6: Final Polish
- [x] Verifikasi Offline support menyeluruh
- [x] Custom Install Prompt (A2HS)
- [x] Animasi transisi antar halaman

## Rencana Pengembangan Selanjutnya (Phase 7)

Berikut adalah breakdown tugas untuk pengembangan fitur lanjutan yang direncanakan:

### 1. Visualisasi Data & Insight Belajar (Advanced Stats)
- [ ] Integrasi library chart (misal: Chart.js atau LayerCake) untuk visualisasi.
- [ ] Chart "Mastery Distribution" (Penyebaran tingkat kemahiran kartu).
- [ ] Grafik "Activity Heatmap" atau "Learning Progress" mingguan.
- [x] Fitur "Study Streak" (Menghitung hari berturut-turut belajar).
- [ ] Statistik "Retention Rate" (Persentase jawaban benar/salah).

### 2. Manajemen Data Tingkat Lanjut
- [x] Fitur **Import JSON** untuk restorasi backup penuh (saat ini baru CSV).
- [x] Validasi data import yang lebih ketat dengan feedback error yang jelas.
- [ ] Fitur "Merge Decks" (Menggabungkan dua deck menjadi satu).
- [x] Opsi untuk menghapus semua data (Reset App).

### 3. Kustomisasi Sesi Belajar
- [ ] Pengaturan limit harian: "Max New Cards" per hari per deck.
- [ ] Pengaturan limit harian: "Max Review Cards" per hari per deck.
- [x] Fitur "Quick Study" (Latihan cepat dari semua deck sekaligus).
- [ ] Timer opsional saat menjawab kartu.

### 4. Navigasi & Organisasi
- [x] Fitur **Search Bar** di Dashboard untuk mencari deck.
- [x] Fitur **Search & Filter** di dalam deck untuk mencari kartu tertentu.
- [ ] Fitur **Tagging** pada kartu untuk pengelompokan lebih fleksibel.
- [x] Sortir deck berdasarkan: Nama, Terakhir dipelajari, Jumlah kartu due.

### 5. Robustness & Persistence
- [x] Pastikan tema (Dark/Light) tersimpan di IndexedDB (selain localStorage).
- [x] Restore "Last Session State": Kembali ke view/deck terakhir saat app dibuka.
- [ ] Optimasi performa untuk database dengan ribuan kartu.

## Cara Penggunaan

### 1. Buat Deck
- Klik tombol "Buat Deck" di halaman utama
- Masukkan nama deck
- Simpan

### 2. Tambah Kartu
- Pilih deck yang sudah dibuat
- Klik "Tambah Kartu"
- Isi sisi depan dan belakang
- Simpan

### 3. Mulai Latihan
- Pilih deck → Klik "Latihan"
- Kartu akan ditampilkan satu per satu
- Klik kartu untuk flip
- Beri rating 1-5 setelah menjawab:
  - 1: Sama sekali tidak ingat
  - 2: Susah ingat
  - 3: Hafal tapi lupa
  - 4: Hafal dengan susah payah
  - 5: Hafal dengan mudah

### 4. Review Terjadwal
- Kartu akan muncul kembali berdasarkan algoritma SM-2
- Kartu yang sulit akan lebih sering muncul
- Kartu yang mudah akan semakin jarang muncul

### 5. Import CSV
- Siapkan file CSV dengan format: `deck,depan,belakang`
- Buka menu import di halaman deck
- Upload file CSV (encoding UTF-8)
- Pilih opsi:
  - **Buat deck baru** - otomatis buat deck dari kolom deck
  - **Pilih deck existing** - masukkan semua kartu ke deck yang dipilih
- Preview data sebelum import
- Klik import

Contoh CSV:
```csv
deck,depan,belakang
Bahasa Japan,konnichiwa,halo
Matematika,2+2,4
```

## SM-2 Algorithm

Implementasi SuperMemo SM-2 untuk spaced repetition:

```
Initial:
  - Ease Factor (EF) = 2.5
  - Interval = 0

After review:
  - Rating < 3: Reset interval, EF tetap
  - Rating >= 3:
    - EF = EF + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
    - EF minimum = 1.3
    - Interval = Interval sebelumnya × EF
```

## PWA Installation

### Android
1. Buka aplikasi di Chrome
2. Klik menu → "Add to Home Screen"
3. Ikon akan muncul di homescreen

### iOS (Safari)
1. Buka aplikasi di Safari
2. Klik share button
3. Pilih "Add to Home Screen"

## Lisensi

MIT
