# Quick Quest Frontend Structure Guide

Frontend Quick Quest menggunakan pendekatan **ESVMC (Extreme Strict by Virtual Machine Concept)** untuk Separation of Concern level enterprise.

## Dokumen Utama

- Aturan lengkap wajib baca: `ESVMC-Rulebook.md`
- Dokumen ini (`README.md`) adalah versi ringkas operasional.

## Blueprint Arsitektur Wajib

Setiap feature wajib mengikuti alur satu arah:

```text
{feature}.tsx -> {feature}.ts -> {feature}.service.ts -> global.service.ts
```

`{feature}.service.ts` dibuat saat feature butuh koneksi API atau adapter data eksternal.

## Struktur Standar

```text
src/app/
|- {feature}/
|  |- {feature}.tsx
|  |- {feature}.ts
|  |- {feature}.service.ts
|  |- {feature}.css
|- global.service.ts
```

## Kontrak Layer Singkat

- `*.tsx`: View + wiring event.
- `*.ts`: Business logic + data orchestration.
- `*.service.ts`: jalur service ke/dari `global.service.ts`.
- `global.service.ts`: root endpoint registry dan util request global.

## Aturan Import (Tidak Boleh Dilanggar)

| Dari \ Ke                  | `*.tsx` | `*.ts` | `*.service.ts` | `global.service.ts` |
| -------------------------- | ------- | ------ | -------------- | ------------------- |
| `*.tsx`                    | -       | YES    | NO             | NO                  |
| `*.ts`                     | NO      | -      | YES            | NO                  |
| `*.service.ts`             | NO      | NO     | -              | YES                 |
| `global.service.ts`        | NO      | NO     | NO             | -                   |

### Exception: Service Lintas Container Dalam Konteks Sama

Service lintas container boleh dipakai jika:

- masih 1 domain konteks (contoh: `Keuangan`),
- masih dalam halaman/fitur yang sama,
- data yang ditangani tetap satu konteks bisnis.

Contoh konteks `Keuangan`:

- `Pemasukan`
- `Pengeluaran`
- `Selisih`

Tetap dilarang mengambil service dari domain berbeda konteks tanpa kontrak yang jelas.

## Ketentuan Folder `stack`

Folder `stack` dipakai untuk koneksi direct ke stack external saat benar-benar dibutuhkan, misalnya:

- Supabase
- Redis
- Apache Kafka
- ObjectBox

Default platform tetap memprioritaskan jalur full control:

```text
Frontend -> Stream Backend -> Cloud/Stack
```

## Penjelasan Direktori Penting

- `src/app/`: root aplikasi frontend.
- `src/app/home/`: area utama setelah auth.
- `src/app/home/component/`: container global (`header`, `navbar`, `notification`, `profile`).
- `src/app/home/content/{feature}/`: konten utama SPA per feature.
- `src/app/home/content/{feature}/page/`: subpage/child dari feature utama.

## Skalabilitas Target

| Skala User | Arsitektur                 | Infra                  | Database              | Caching             | Keamanan                | Target           |
| ---------- | -------------------------- | ---------------------- | --------------------- | ------------------- | ----------------------- | ---------------- |
| 100        | Monolitik                  | 1 server kecil         | Single DB             | Tidak wajib         | SSL dasar               | Prototype        |
| 1.000      | Monolitik + Load Balancing | VPS medium             | Optimasi index        | Redis basic         | Rate limit              | Stabil komunitas |
| 10.000     | Modular microservices      | 2-3 server cluster     | Master-slave          | Redis cluster       | WAF                     | < 1s respon      |
| 100.000    | Distributed services       | Kubernetes + autoscale | Sharding + clustering | Redis + CDN         | Multi-layer             | 99.9% uptime     |
| 1.000.000  | Cloud-native microservices | Multi-region cloud     | Global sharding       | Multi-layer caching | Zero-trust + compliance | Enterprise-grade |

### Fokus Fase 1

Target fase saat ini: `1.000 user` dengan fokus stack:

- Supabase
- Redis
- Apache Kafka

## File Kritis

- `src/app/strict.engine.ts`: strict runtime/helper untuk kebutuhan security hardening frontend.

## Kapan ESVMC Bisa Disederhanakan

ESVMC tidak wajib dipakai full ketika container dalam konteks UI/UX:

- bersifat global,
- hanya memegang event global,
- statis secara konten,
- atau dinamis ringan tanpa kebutuhan API/service.

Begitu ada kebutuhan API atau business logic kompleks, gunakan kembali pola ESVMC lengkap.
