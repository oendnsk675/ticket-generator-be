# Utils

Folder `utils` berisi fungsi-fungsi utilitas yang bersifat reusable dan tidak terikat pada satu modul tertentu.  
Utility di sini membantu mempermudah proses pengembangan dengan menyediakan helper function yang dapat dipanggil oleh berbagai bagian aplikasi.

## Contoh Fungsi Utility

- Formatter (tanggal, angka, string)
- Pembungkus response (response helper)
- Helper untuk validasi sederhana
- Generator (token, kode unik, dll.)

## Catatan

Setiap fungsi utilitas sebaiknya bersifat:

- Mandiri (tidak memiliki dependensi silang)
- General-purpose
- Mudah untuk diuji (unit test-friendly)
