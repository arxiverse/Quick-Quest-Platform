# Admin Panel Plan

Tanggal: 2026-04-24
Status: Planning Draft
Scope: Rencana panel admin di dalam aplikasi React yang sama, tanpa framework terpisah.

## Tujuan

1. Menyediakan panel admin tanpa membuat aplikasi kedua.
2. Memanfaatkan field `authorization` sebagai penentu hak akses sistem.
3. Menjaga ESVMC tetap rapi: `app/` untuk user app, `admin/` untuk admin app.
4. Memisahkan privilege sistem dari role bisnis pengguna.
5. Tetap memakai one root URL dan route/state internal aplikasi.
6. Tidak menambah `react-router-dom`.

## Konsep Inti

QuickQuest tetap memakai satu frontend utama di dalam direktori `src/`, tetapi dibagi dua area besar:

- `src/app/`
  Area aplikasi utama untuk user biasa.
- `src/admin/`
  Area panel admin/root untuk fitur operasional internal.

Artinya admin panel tetap hidup di codebase yang sama, memakai auth yang sama, tetapi jalur halaman, service, dan logic-nya dipisah.

## Rule Arsitektur Tambahan

1. Struktur tetap mengikuti ESVMC.
2. Admin panel tetap berada di root aplikasi yang sama.
3. Perpindahan view admin tidak memakai `react-router-dom`.
4. Navigasi admin harus mengikuti sistem route context / state internal yang sudah dipakai project.

## Pembagian Tanggung Jawab

1. `user_role`

- Dipakai untuk hak akses bisnis produk.
- Nilai aktif saat ini:
  - `user_runner`
  - `user_unlocked`

2. `authorization`

- Dipakai untuk hak akses sistem.
- Contoh nilai yang direncanakan:
  - `user`
  - `admin`
  - `root`

Kesimpulan:

- `user_role` menjawab: user boleh jadi giver atau belum?
- `authorization` menjawab: user boleh masuk panel admin atau tidak?

## Flow Akses Admin

1. User login memakai akun masing-masing.
2. Backend `POST /api/login` mengembalikan session aktif + `authorization` + `user_role`.
3. User masuk dashboard biasa.
4. User membuka menu `Profile`.
5. Di halaman profile:
   - jika `authorization === "user"` maka tombol admin tidak muncul
   - jika `authorization !== "user"` maka tombol admin panel muncul
6. User klik tombol admin panel.
7. Frontend masuk ke area `src/admin/`.
8. Backend tetap wajib memvalidasi `authorization` di route admin.

Catatan penting:

- Hidden button di frontend hanya UX gate.
- Keamanan utama tetap harus dijaga backend.

## Arah Struktur Frontend

Rencana direktori:

```text
src/
  app/
    ...
  admin/
    dashboard/
    verification/
    users/
    admin.service.ts
    admin.ts
    admin.tsx
```

Struktur ESVMC yang disarankan untuk admin:

- `admin.tsx`
  Fokus render dan interaksi UI admin.
- `admin.ts`
  Fokus logic admin dan state orchestration.
- `admin.service.ts`
  Fokus request ke backend admin route.

Jika nanti ada feature admin terpisah, pola yang sama bisa dipakai lagi:

- `verification-admin.tsx`
- `verification-admin.ts`
- `verification-admin.service.ts`

Catatan penting:

- `src/admin/` adalah pemisahan konteks, bukan aplikasi baru.
- Admin tetap hidup dalam one root URL.
- Pergantian area `app` ke `admin` diperlakukan sebagai perpindahan mode/view internal.

## Titik Masuk Dari Profile

Fitur admin panel tidak perlu muncul di navbar publik.

Titik masuk awal yang paling aman:

- user login
- buka `Profile`
- baca `authorization`
- tampilkan tombol tersembunyi kalau eligible

Ini cocok dengan flow produk saat ini karena profile memang menjadi tempat yang membaca identitas dan status user aktif.

Karena one root URL tetap dipertahankan, tombol admin dari profile harus mengarahkan user ke state/view admin internal, bukan ke router tree eksternal.

## Kebutuhan Backend Nanti

Backend tidak perlu dipisah server baru. Cukup tambah route khusus admin di backend strict mode.

Contoh arah route:

- `GET /api/admin/overview`
- `GET /api/admin/verifications`
- `POST /api/admin/verifications/:id/approve`
- `POST /api/admin/verifications/:id/reject`
- `GET /api/admin/users`

Aturan backend:

1. Semua route admin wajib cek `authorization`.
2. `authorization = user` harus ditolak.
3. `authorization = admin/root` baru bisa lanjut.
4. Audit log admin action wajib dipikirkan sejak awal.

## Use Case Awal Yang Paling Masuk Akal

Fase awal admin panel tidak perlu terlalu lebar. Yang paling berguna dulu:

1. Review verification user
2. Approve / reject verification
3. Lihat daftar user dan status role
4. Lihat `authorization` dan `user_role`

Jadi admin panel pertama sebaiknya fokus ke operasi trust dan verification.

## Risiko Yang Perlu Dijaga

1. Jangan jadikan frontend sebagai penentu akses akhir.
2. Jangan campur `authorization` dengan `user_role`.
3. Jangan letakkan service admin di `src/app/` agar boundary tetap jelas.
4. Jangan buat route admin tanpa validasi server-side.
5. Jangan menambah `react-router-dom` hanya untuk menghidupkan panel admin.
6. Jangan memecah admin menjadi root URL atau app kedua jika belum benar-benar diperlukan.

## Keputusan Sementara

1. Admin panel tetap satu aplikasi dengan frontend utama.
2. Admin UI akan ditempatkan di `React/src/admin/`.
3. Entry point admin sementara muncul dari halaman `Profile`.
4. Tombol admin hanya visible untuk akun dengan `authorization !== "user"`.
5. Implementasi backend admin route akan menyusul setelah core verification flow stabil.
6. Admin panel akan mengikuti mekanisme route/state internal project.
7. `react-router-dom` bukan bagian dari arsitektur target admin.

## Next Step Yang Direkomendasikan

1. Definisikan contract login supaya `authorization` selalu ikut terbaca rapi di frontend.
2. Tambahkan pembacaan `authorization` di state auth/global user session.
3. Rancang state/view frontend untuk area `admin` memakai mekanisme internal yang sudah ada.
4. Siapkan backend route admin untuk verification review.
