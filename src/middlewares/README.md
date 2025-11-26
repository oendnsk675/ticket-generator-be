# Middlewares

Folder `middlewares` berisi seluruh fungsi middleware yang digunakan dalam aplikasi.  
Middleware berfungsi sebagai lapisan perantara yang memproses request sebelum mencapai controller atau route handler.

## Fungsi Utama Middleware

- Melakukan validasi request
- Menjalankan autentikasi atau otorisasi
- Menyisipkan data tambahan pada objek `request`
- Logging aktivitas pengguna atau request
- Menangani error secara terpusat (opsional)

## Catatan

Setiap middleware disarankan dibuat dalam file terpisah untuk menjaga kerapian dan kemudahan pemeliharaan. Gunakan penamaan yang deskriptif agar mudah dipahami.
