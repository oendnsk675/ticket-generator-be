# Ticket Generator Backend

Backend ini dibangun menggunakan **Express.js** yang dijalankan melalui **Bun Runtime**. Struktur proyek dirancang dengan pendekatan modular untuk memastikan skalabilitas, kemudahan pemeliharaan, serta keteraturan kode dalam jangka panjang.

---

## 📦 Requirements

Pastikan seluruh perangkat berikut telah terpasang sebelum menjalankan proyek:

### 1. **Bun Runtime**

Versi yang direkomendasikan: **≥ 1.2.2**

Instalasi:

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. **Node.js (opsional)**

Hanya dibutuhkan jika terdapat tool eksternal yang memerlukan Node.

### 3. **Database**

Tergantung pada implementasi (contoh: PostgreSQL, MySQL, MongoDB). Pastikan database aktif dan kredensial sudah disesuaikan di file konfigurasi.

### 4. **TypeScript**

Proyek berjalan menggunakan TypeScript, pastikan environment mendukung proses kompilasi TypeScript.

---

## 🚀 Usage

### 1. **Install dependensi**

```bash
bun install
```

### 2. **Menjalankan server (development)**

```bash
bun run dev
```

Mode ini menggunakan watcher sehingga setiap perubahan kode akan memicu restart otomatis.

### 3. **Menjalankan server (production build)**

Jika ada proses build:

```bash
bun run build
bun run start
```

Jika tidak menggunakan build:

```bash
bun run start
```

### 4. **Menjalankan Seeder (jika tersedia)**

```bash
bun run seed
```

### 5. **Menjalankan Migration (jika tersedia)**

```bash
bun run migrate
```

---

## 📁 Struktur Direktori

```txt
├── database/
│   ├── migrations/
│   ├── models/
│   ├── README.md
│   └── seeds/
├── middlewares/
│   └── README.md
├── utils/
│   └── README.md
├── server.ts
└── package.json
```

---

## 🔄 Alur Arsitektur Request

```
Client
   │
   ▼
HTTP Request
   │
   ▼
Middleware
   │   (autentikasi, validasi, logging, dsb.)
   ▼
Route Handler / Controller
   │
   ▼
Service Layer
   │   (logika bisnis)
   ▼
Repository / Model
   │
   ▼
Database
   │
   ▼
HTTP Response
```

---

## 🧪 Pengujian

Aplikasi dapat diuji menggunakan:

- Unit Test (fungsi utilitas)
- Integration Test (route & service)
- Mocking (dependensi eksternal)

Framework testing disesuaikan dengan kebutuhan proyek.

---

## 🛠 Konvensi Pengembangan

- Gunakan TypeScript untuk seluruh file `.ts`
- Penamaan folder menggunakan kebab-case (contoh: `service-features`)
- Penamaan konsisten camelCase untuk variabel & fungsi (contoh: `createTicket`)
- Pisahkan middleware, service, controller, dan utilitas
