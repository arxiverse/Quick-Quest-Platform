# ESVMC Rulebook v1.1 (Refined)

---

## 1. Philosophy

ESVMC (Extreme Strict by Virtual Machine Concept) memperlakukan setiap container UI sebagai **Virtual Machine Instance (VM Instance)** yang memiliki:

- ruang komputasi sendiri
- kontrak komunikasi terbatas
- dependency graph yang deterministik
- boundary yang tidak boleh ditembus langsung

Frontend diperlakukan sebagai **distributed UI runtime**, bukan sekadar template renderer.

---

## 2. Core Principles

### 2.1 VM Isolation

Setiap container dianggap sebagai VM independen.

VM tidak boleh:

- mengakses state internal VM lain tanpa kontrak eksplisit
- mengakses network layer secara langsung
- mencampur logic rendering dan business rule

---

### 2.2 Deterministic Data Flow

Aliran data bersifat absolut satu arah:

```
.tsx → .ts → .service.ts → global.service.ts → backend
```

Tidak boleh ada reverse import.

Semua komunikasi antar layer harus melalui kontrak eksplisit.

---

### 2.3 Explicit Boundary Over Implicit Convenience

ESVMC memprioritaskan:

predictability > brevity
structure > flexibility
traceability > implicit magic

---

## 3. VM Layer Architecture

### 3.1 View Layer (.tsx)

Analogi: Display Adapter

Tanggung jawab:

- merender JSX
- menghubungkan event ke logic
- menyusun container
- menggabungkan VM output

Boleh:

- memanggil logic dari `.ts`
- mengatur komposisi container
- mengatur struktur layout

Tidak boleh:

- mengandung business rule kompleks
- memanggil API
- mengimport `.service.ts`
- mengimport `global.service.ts`
- mengakses network state
- mengandung data transform berat

---

### 3.2 Compute Layer (.ts)

Analogi: CPU VM

Tanggung jawab:

- transformasi data
- orkestrasi logic container
- validasi data
- normalisasi data
- mapping output ke View layer

Boleh:

- memanggil `.service.ts`
- melakukan kalkulasi
- memproses state

Tidak boleh:

- render JSX
- mengimport CSS
- mengakses global.service langsung
- melakukan request network langsung

---

### 3.3 Service Layer (.service.ts)

Analogi: Network Adapter / LAN Card

Tanggung jawab:

- mengambil data dari global.service
- mapping response backend
- normalisasi struktur data dasar
- menyusun kontrak data untuk compute layer

Boleh:

- import global.service
- melakukan request data
- mapping response ringan

Tidak boleh:

- mengandung JSX
- menyimpan UI state
- melakukan kalkulasi berat
- mengatur navigasi
- mengimport .tsx
- mengimport .ts

---

### 3.4 Global Service Layer (global.service.ts)

Analogi: Backbone Network

Tanggung jawab:

- endpoint registry
- konfigurasi koneksi backend
- global request adapter
- global error normalization
- auth header injection

Boleh:

- mengatur base URL
- mengatur header global
- mengatur request wrapper

Tidak boleh:

- mengandung business rule feature
- mengandung logic container spesifik
- mengimport service lain

---

## 4. Import Direction Law (Strict)

Dependency hanya boleh:

```
.tsx → .ts
.ts → .service.ts
.service.ts → global.service.ts
```

Dilarang:

```
.tsx → .service.ts
.tsx → global.service.ts
.ts → global.service.ts
.service.ts → .ts
.service.ts → .tsx
global.service.ts → apapun
```

---

## 5. Container Isolation Law

Dalam 1 file `.tsx`:

Setiap container function:

- tidak boleh menggunakan logic container lain secara langsung
- tidak boleh mengakses state container lain
- hanya boleh menggunakan logic yang dikontrak untuk dirinya

Komposisi hanya boleh dilakukan di:

```
<FeatureName>Component
```

yang menjadi assembler VM.

---

## 6. VM Composition Rule

Struktur standar:

```
ContainerA
ContainerB
ContainerC
↓
FinalAssembler
```

Assembler bertanggung jawab:

- menyusun VM output
- bukan melakukan compute logic

---

## 7. Folder Structure

Standard:

```
src/app/{feature}/

{feature}.tsx
{feature}.ts
{feature}.service.ts
{feature}.css
```

Nested feature:

```
src/app/home/content/{feature}/

{feature}.tsx
{feature}.ts
{feature}.service.ts
{feature}.css

page/
subpage.tsx
```

---

## 8. Data Ownership Rule

Source of truth selalu backend.

Frontend hanya cache sementara.

localStorage hanya boleh berisi:

- UI preference
- session hint non-sensitive
- state non-authoritative

Tidak boleh menyimpan:

- role authority
- permission authority
- financial authority

---

## 9. Static Content Rule

Static content boleh disimpan di:

.service.ts jika:

- kemungkinan reuse tinggi
- kemungkinan berubah rendah
- digunakan banyak container

boleh disimpan di .tsx jika:

- hanya digunakan sekali
- purely visual
- tidak memiliki dependency data

---

## 10. Cross Domain Service Restriction

Service hanya boleh digunakan lintas container jika:

- domain sama
- konteks bisnis sama
- kontrak data konsisten

Contoh valid:

keuangan/_
quest/_
profile/\*

Contoh tidak valid:

quest service dipakai di auth domain.

---

## 11. Router Elimination Principle

ESVMC tidak bergantung pada URL path sebagai state.

State ditentukan oleh VM stack.

URL hanya berfungsi sebagai:

application entry point.

Tujuan:

- mengurangi hydration cost
- mengurangi router overhead
- meningkatkan rendering determinism
- menyerupai native runtime

---

## 12. When ESVMC Is Required

ESVMC wajib digunakan jika:

- container memiliki business logic
- container memerlukan API
- container memiliki transformasi data
- container memerlukan state orchestration

ESVMC opsional jika:

- purely visual
- static content
- global layout wrapper
- presentational component

---

## 13. Naming Standard

View:

```
UserProfileComponent
QuestCardComponent
```

Logic:

```
useUserProfileLogic
resolveQuestCardData
computeLeaderboard
```

Service:

```
fetchUserProfile
createQuest
updateQuest
deleteQuest
```

---

## 14. Anti Pattern

Tidak diperbolehkan:

fetch di tsx
logic berat di tsx
service memodifikasi UI
cross domain service tanpa kontrak
implicit dependency antar container
global.service berisi logic feature

---

## 15. VM Mental Model

```
.tsx            = Display VM instances
.ts             = Compute VM instances
.service.ts     = Network adapter VM
global.service  = backbone network
```

Frontend = kumpulan VM yang saling berkomunikasi melalui kontrak eksplisit.

---

# Improvement dibanding versi awal

Refinement utama:

### 1. menghilangkan ambiguitas rule container

sekarang jelas kapan boleh compose.

### 2. memperjelas kapan ESVMC wajib vs opsional

mengurangi overengineering.

### 3. memperjelas static content placement

biar tidak semua text dipaksa ke service.ts.

### 4. memperjelas cross domain boundary

biar tidak terjadi service spaghetti.

### 5. memperjelas mental model VM

biar dev baru cepat ngerti.

---
