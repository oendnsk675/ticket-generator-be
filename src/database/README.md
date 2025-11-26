# Database

Folder `database` berisi seluruh komponen yang berkaitan dengan pengelolaan struktur, model, dan data awal sistem. Seluruh file yang berada di dalam direktori ini digunakan untuk mendefinisikan skema database, memetakan model, serta menginisialisasi data.

## Struktur Folder

### 1. `migrations/`

Direktori ini berisi file migrasi yang digunakan untuk:

- Membuat, mengubah, atau menghapus tabel.
- Mengelola perubahan skema database secara bertahap.
- Menjamin konsistensi struktur database di setiap environment.

### 2. `models/`

Berisi definisi model yang merepresentasikan tabel atau entitas pada database.  
Setiap model memuat:

- Struktur data
- Relasi antar model (jika ada)
- Validasi dan konfigurasi lainnya

### 3. `seeds/`

Direktori ini digunakan untuk menyimpan file seed yang berfungsi untuk:

- Mengisi data awal (initial data)
- Menambahkan data contoh (dummy data) untuk keperluan testing atau development

## Catatan

Seluruh proses migrasi, model, dan seeding disarankan mengikuti standar arsitektur aplikasi dan konvensi penamaan yang konsisten.
