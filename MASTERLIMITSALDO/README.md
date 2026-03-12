# Card MPM - Master Kartu Petty Cash

Proyek front-end berbasis Vue.js 3 untuk pengelolaan Master Kartu Petty Cash. Aplikasi ini dirancang untuk menampilkan tabel data kartu, fitur pencarian/filter, pagination, dan pengelolaan data melalui modal pop-up (Tambah dan Edit).

## Fitur Utama

- **Tabel Data Responsif**: Menampilkan informasi lengkap kartu (NPK, Nama PIC, Saldo, Status, dll) menggunakan Bootstrap 5.
- **Filter Pencarian**: Dropdown filter dinamis untuk menyaring data berdasarkan NPK, PIC, Nomor Rekening, Status, maupun Tipe Kartu.
- **Pagination Sederhana**: Navigasi halaman tabel dengan kalkulasi Vue `computed` properties.
- **Modal Add & Edit**: Menggunakan satu komponen modal Bootstrap secara efisien. Secara otomatis melakukan pengisian awal (pre-fill) data saat masuk mode Edit, serta memblokir NPK agar tidak dapat diubah.
- **Manajemen State Sesi**: Terintegrasi dengan `Pinia` untuk menyimpan variabel Environment Dummy/Session User (Domain, User ID, dsb) yang dirender di Header.

## Teknologi Utama

- **Framework**: [Vue.js 3](https://vuejs.org/) (Composition API)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Styling UI**: [Bootstrap 5](https://getbootstrap.com/) & Custom CSS (Warna Tema MPM `#f26f21`)
- **Build Tool**: [Vite](https://vitejs.dev/)

## Struktur Direktori Utama

- `src/views/MasterKartu.vue` - Komponen halaman utama yang menampung tabel, filter, fungsi manipulasi data, dan *modal*.
- `src/components/` - Bebarapa komponen *reusable* yang digunakan:
  - `HeaderComponent.vue` - Header atas.
  - `FooterComponent.vue` - Footer aplikasi.
  - `AppButton.vue` - Tombol standar aplikasi yang telah dimodifikasi menggunakan konfigurasi *class* dasar Bootstrap.

## Persiapan Server Lokal (Development)

Pastikan [Node.js](https://nodejs.org/) telah ter-install di sistem Anda, lalu ikuti langkah berikut:

### 1. Install Dependencies
Buka terminal pada letak direktori repositori ini (`card-mpm`), lalu jalankan:
```sh
npm install
```

### 2. Jalankan Mode Server Dev Vite
```sh
npm run dev
```

### 3. Akses Web
Aplikasi dapat dibuka melalui *browser* pada *local environment url*, secara *default* akan berjalan pada:
```
http://localhost:5173/
```

## Catatan Rilis
- Integrasi *Tailwind* telah dihapus sepenuhnya berdasarkan kesepakatan versi dan aplikasi murni berjalan di atas susunan sintaks UI *Bootstrap*.
- Tampilan filter kini disusun berjajar ke samping secara dinamis menggunakan *flex-box* dan *grid*.
