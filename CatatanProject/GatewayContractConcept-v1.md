# Gateway Contract Concept v1 (QuickQuest)

Tanggal: 2026-04-21
Status: Concept Draft (Phase Awal, tanpa signature kompleks)
Scope: Standar envelope request/response untuk single-entry gateway.

## Tujuan

1. Menyatukan pola komunikasi Frontend -> Backend dalam satu kontrak yang konsisten.
2. Menjaga struktur ESVMC: `component.service.ts` tetap domain-specific, `global.service.ts` sebagai jalur gateway.
3. Menyiapkan fondasi hardening bertahap tanpa mengubah alur besar aplikasi.

## Prinsip Dasar

1. Frontend tidak mengirim path endpoint mentah (contoh: `/api/auth/login`) sebagai kontrol utama.
2. Frontend mengirim `action` yang terstandar.
3. Backend (`main.go` gateway) melakukan validasi + dispatch berdasarkan whitelist action.
4. Semua respons memakai envelope standar agar mapping ke komponen tetap presisi.

## Arsitektur Alur (Ringkas)

1. `component.service.ts` membangun payload bisnis.
2. `global.service.ts` membungkus ke gateway envelope.
3. Frontend kirim ke single entry endpoint gateway (contoh: `POST /api`).
4. `main.go` decrypt/unwrap envelope, validasi action, route ke modul (contoh: `auth.go`).
5. Modul akses database lalu return hasil ke gateway.
6. Gateway mengembalikan response envelope ke frontend.
7. `global.service.ts` unwrap response lalu teruskan ke `component.service.ts`.

## Request Envelope (v1)

```json
{
  "request_id": "uuid-v4",
  "action": "AUTH_LOGIN",
  "component_id": "login.form",
  "timestamp": 1776700000,
  "payload": {
    "identifier": "email_or_username_or_phone",
    "password": "plain_or_preprocessed"
  },
  "meta": {
    "client_version": "web-1.0.0",
    "platform": "web"
  }
}
```

## Response Envelope (v1)

```json
{
  "request_id": "uuid-v4",
  "action": "AUTH_LOGIN",
  "status": "ok",
  "code": "SUCCESS",
  "message": "Login success",
  "data": {
    "user_id": "usr_xxx",
    "user_role": "user_runner",
    "role_switch_enabled": false
  },
  "error": null,
  "server_time": 1776700002
}
```

## Error Envelope (v1)

```json
{
  "request_id": "uuid-v4",
  "action": "AUTH_LOGIN",
  "status": "error",
  "code": "AUTH_INVALID_CREDENTIALS",
  "message": "Identifier atau password salah",
  "data": null,
  "error": {
    "retryable": false,
    "details": null
  },
  "server_time": 1776700002
}
```

## Daftar Action Awal (Whitelist v1)

1. `AUTH_REGISTER`
2. `AUTH_LOGIN`
3. `AUTH_LOGOUT`
4. `USER_GET_PROFILE`

Catatan:

- Tambahan action harus terdaftar eksplisit di whitelist gateway.
- Action yang tidak dikenal harus ditolak (`code: ACTION_NOT_ALLOWED`).

## Dispatch Map Konseptual (Backend)

- `AUTH_REGISTER` -> `auth.register`
- `AUTH_LOGIN` -> `auth.login`
- `AUTH_LOGOUT` -> `auth.logout`
- `USER_GET_PROFILE` -> `user.get_profile`

## Aturan Validasi Minimum (Phase Awal)

1. `request_id` wajib ada dan unik per request client.
2. `action` wajib ada dan harus masuk whitelist.
3. `payload` wajib object JSON (boleh kosong untuk action tertentu).
4. `timestamp` wajib ada untuk baseline anti-stale request.
