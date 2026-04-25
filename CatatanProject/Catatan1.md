# Catatan 1 - Audit Koneksi Frontend <-> Backend

Tanggal: 2026-04-21
Scope: Koneksi yang sudah benar-benar terpakai oleh Frontend saat ini.

## Ringkasan Cepat

Koneksi inti yang sudah aktif:

- Register -> Backend `/api/register`
- Login -> Backend `/api/login`
- Session check + role init -> Backend `/api/profile`
- Logout -> Backend `/api/logout`

Arsitektur traffic backend:

- Endpoint tetap lewat `Stream/main.go` -> `/api/*`
- Implementasi service dipilih via `CLOUD_TRAFFIC` (Cloud/Local)

## Mapping Frontend yang Sudah Terhubung

1. `React/src/app/global.service.ts`

- Source base URL dari `VITE_STREAM_API_URL`
- Endpoint aktif: `login`, `register`, `logout`, `profile`
- Request default pakai `credentials: include`

2. `React/src/app/login/login.service.ts`

- Submit login ke `POST /api/login`

3. `React/src/app/register/register.service.ts`

- Submit register ke `POST /api/register`

4. `React/src/app/home/role.service.ts`

- Inisialisasi role dari `GET /api/profile`

5. `React/src/app/auth.context.tsx`

- Saat init session: panggil profile endpoint untuk validasi auth state
- Logout client: panggil `POST /api/logout`

6. `React/src/app/home/component/profile/profile.service.ts`

- Ambil detail profil dari `GET /api/profile`

## Mapping Backend Route yang Sudah Aktif

1. `Stream/main.go`

- Registrasi grup `/api`
- Load route auth + profile

2. `Stream/endpoint/auth/routes.go`

- `POST /register`
- `POST /login`
- `POST /logout`

3. `Stream/endpoint/user/profile_endpoint.go`

- `GET /profile`
- `GET /lprofile` (alias)

## Implementasi Service Backend (Local + Cloud)

1. Register

- Menolak `user_role` dari request client
- Set default role ke `user_runner`
- Kembalikan `role_switch_enabled` sesuai role

2. Login

- Validasi credential
- Ambil role dari `user_identification`
- Set cookie session HttpOnly + cookie role HttpOnly
- Return payload termasuk `user_role`

3. Profile

- Resolve session dari cookie (Cloud juga support bearer)
- Return profile + `user_role` + `role_switch_enabled`

4. Logout

- Clear cookie session + cookie role

## Alur Nyata yang Sedang Jalan

1. User register (`/api/register`)
2. User login (`/api/login`)
3. App init panggil `/api/profile` untuk session validasi + role init
4. UI/guard baca hasil init tersebut
5. User logout (`/api/logout`) untuk clear session

## Temuan Risiko / Ketidaksinkronan

1. Cookie env key mismatch

- `service.go` baca: `AUTH_COOKIE_SAME_SITE`, `AUTH_COOKIE_SECURE`
- `.env` terlihat pakai: `SESSION_COOKIE_SAMESITE`, `SESSION_COOKIE_SECURE`
- Dampak: konfigurasi cookie bisa fallback default tanpa disadari

2. Role mode masih tersimpan di localStorage

- Ada penggunaan `qqm-active-role` di role context
- Ini bagus untuk UX state, tapi bukan sumber keamanan utama

3. Hash utility role sudah ada, belum sepenuhnya dijadikan enforcement utama

- Potensi inkonsistensi kalau ada path lama yang masih baca raw state

4. Terdapat endpoint mapping yang tampak tidak dipakai di flow aktif

- Perlu bersih-bersih saat hardening final

## Kesimpulan Audit (Koneksi Aktif)

- Jalur koneksi Frontend <-> Backend untuk `register/login/profile/logout` sudah tersambung dan berjalan.
- Role default `user_runner` secara backend sudah ada.
- Gate keamanan role masih perlu hardening lanjutan (terutama konsistensi cookie config + sinkronisasi state frontend).

## Next Lock (Saran Implementasi Lanjutan)

1. Samakan env key cookie antara `.env` dan parser backend.
2. Jadikan `/api/profile` sebagai source of truth saat init session.
3. Pastikan mode UI (runner/giver) hanya aktif sesuai role backend (`user_runner` vs `user_unlocked`).
4. Audit path lama yang masih tergantung localStorage sebagai penentu utama akses.
