# ESVMC Rulebook

Dokumen ini adalah standar resmi arsitektur frontend Quick Quest dengan pendekatan **ESVMC (Extreme Strict by Virtual Machine Concept)**.

## 1) Tujuan

ESVMC dibuat untuk:

- menjaga Separation of Concern secara ekstrem,
- menekan kebocoran logika antar container,
- mempermudah scaling dan debugging saat komponen makin besar,
- membuat struktur React tetap konsisten seperti standar enterprise.

## 2) Prinsip Inti ESVMC

- Setiap komponen diperlakukan seperti mesin virtual kecil.
- Setiap container punya ruang logika sendiri (private strict).
- Alur data wajib satu arah: `tsx -> ts -> service -> global.service`.
- Layer atas tidak boleh melompati layer bawah.

## 3) Kontrak Layer

### `ComponentName.tsx` (View + Event Wiring)

Boleh:

- render UI,
- binding event (`onClick`, `onChange`, dst),
- memanggil fungsi logic dari `ComponentName.ts`,
- mengatur komposisi container.

Tidak boleh:

- import langsung `global.service.ts`,
- hit API langsung,
- menyimpan business rule kompleks.

### `ComponentName.ts` (Business Logic + Data Logic)

Boleh:

- menyimpan business rule,
- transformasi data,
- orkestrasi event handler,
- memanggil fungsi service dari `ComponentName.service.ts`.

Tidak boleh:

- render JSX,
- import CSS,
- memanggil endpoint langsung tanpa lewat service.

### `ComponentName.service.ts` (Service Logic / LAN Layer)

Boleh:

- menjadi adapter antara `global.service.ts` dan `ComponentName.ts`,
- menyiapkan request function per kebutuhan container,
- menangani mapping response minimal.

Tidak boleh:

- mengandung JSX,
- menyimpan state UI,
- mengatur alur navigasi/route.

### `global.service.ts` (Root API Gateway)

Boleh:

- menyimpan endpoint registry,
- helper request global,
- konfigurasi base URL dan header umum.

Tidak boleh:

- menyimpan logika UI spesifik komponen,
- menyimpan keputusan business rule per feature.

## 4) Aturan Import (Wajib)

Aturan satu arah:

- `*.tsx` boleh import `*.ts`
- `*.ts` boleh import `*.service.ts`
- `*.service.ts` boleh import `global.service.ts`

Larangan:

- `*.tsx` import `*.service.ts` langsung
- `*.tsx` import `global.service.ts` langsung
- `*.ts` import `global.service.ts` langsung
- `*.service.ts` import `*.tsx`

## 4.1) Cross-Service Exception (Konteks Sama)

Pengecualian diperbolehkan saat:

- masih dalam 1 halaman/feature,
- konteks bisnisnya sama,
- data yang dibawa tetap 1 domain.

Contoh:

- konteks `Keuangan` dengan container `Pemasukan`, `Pengeluaran`, `Selisih`,
- container boleh mengonsumsi service domain `keuangan` yang sama selama kontrak datanya konsisten.

Batasan wajib:

- tidak boleh menarik service dari domain lain yang beda konteks,
- tetap hindari dependency silang liar antar container,
- tetap utamakan adapter/fungsi per container di layer `.ts`.

## 5) Struktur Folder Standar

```text
src/app/{feature}/
|- {feature}.tsx
|- {feature}.ts
|- {feature}.service.ts
|- {feature}.css
```

Untuk fitur besar:

```text
src/app/home/content/{feature}/
|- {feature}.tsx
|- {feature}.ts
|- {feature}.service.ts
|- {feature}.css
|- page/
   |- {child-page}.tsx
```

## 6) Private Strict per Container

Dalam 1 file `*.tsx`, setiap container harus:

- menggunakan logic yang relevan dengan containernya,
- tidak mengakses logic private container lain tanpa kontrak eksplisit,
- tidak lompat langsung ke service.

Dalam 1 file `*.ts`, fungsi logic wajib:

- punya scope jelas per container,
- tidak mengakses state internal container lain tanpa argumen/kontrak.

## 7) Ketentuan State & Storage

- Data sensitif (contoh role auth/session context) **tidak** disimpan sebagai sumber kebenaran di `localStorage`.
- Sumber kebenaran data sensitif wajib dari backend/session cookie.
- `localStorage` hanya untuk state UI non-sensitif (contoh preferensi tampilan).

## 8) Ketentuan Security Role (Quick Quest)

- Role default user baru: `user_runner`.
- Akses mode giver aktif hanya jika backend mengembalikan role unlock (`user_unlocked`).
- UI switch mode hanya refleksi dari status role backend, bukan pemutus kebenaran.

## 9) Naming Convention

- Logic function: `handleXxx`, `computeXxx`, `resolveXxx`.
- Service function: `fetchXxx`, `createXxx`, `updateXxx`, `deleteXxx`.
- Hindari nama generik seperti `doStuff`, `tempFunc`, `data1`.

## 10) Checklist Pull Request (ESVMC)

Sebelum merge, wajib cek:

1. Apakah `tsx -> ts -> service -> global.service` sudah satu arah tanpa bypass?
2. Apakah business rule sudah ada di `.ts`, bukan di `.tsx`?
3. Apakah service call hanya terjadi di `.service.ts`?
4. Apakah data sensitif tidak dijadikan sumber kebenaran di `localStorage`?
5. Apakah naming function sudah eksplisit dan mudah dibaca?
6. Jika ada shared service, apakah benar masih dalam konteks domain yang sama?

## 11) Anti-Pattern (Dilarang)

- Komponen `tsx` melakukan fetch API langsung.
- Logic lintas container ditulis ad-hoc tanpa kontrak fungsi.
- Service mengubah state visual UI.
- `global.service.ts` diisi logic feature-specific.

## 12) Kapan ESVMC Tidak Wajib Dipakai

ESVMC boleh tidak dipakai penuh saat komponen/container:

- bersifat global,
- hanya mengelola event global,
- kontennya statis (output selalu sama),
- atau dinamis ringan tetapi tidak membutuhkan service/API.

Contoh kandidat:

- shell layout global,
- handler event UI global,
- halaman SPA presentasional tanpa request data backend.

Catatan:

- begitu container mulai butuh service/API atau business rule kompleks, kembali ke pola ESVMC penuh.

## 13) Aliran Data ESVMC

Semua yang menggunakan struktur ESVMC, aliran data seperti teks <p/>, <h1/>, akan tersimpan di ComponentName.service.ts selama
datanya berupa teks untuk keperluan tampilan UI baik itu datanya berupa data Dummy ataupun yang telah terkoneksi dengan API sekalipun. Ianya tidak diletakkan di .tsx ataupun .ts karena ketika direplace, data tersebut langsung diteruskan ke .ts kemudian diteruskan lagi ke .tsx. Alih alih data dummy ditampilkan di UI .tsx lebih baik itu ditaruh langsung di service.ts supaya terlihat mudah. Jadi komponen .tsx langsung mengarahkan tali ke .ts dan mengarahkan lagi tali .ts ke service.ts. Ini dipisah 2: Statis Permanen atau Dinamis Jangka Panjang, 
- Jika Dinamis Jangka panjang: Tingkat kemungkinan menaruh data di service.ts baik itu hanya tampilan saja adalah 46.55% tetapi mungkin agak ribet jika ingin menggantinya nanti karena harus mencarinya satu per satu di .tsx.
- Jika Statis Permanen dan tidak lagi berubah maka hal itu diwajarkan dan opsional jika ditaruh di service.ts

---

Rulebook ini menjadi acuan utama seluruh modul frontend Quick Quest.