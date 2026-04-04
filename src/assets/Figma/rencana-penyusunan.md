1. Menggunakan Framework React + TS React Compiler
2. Penyusunan Struktur Komponen mirip Angular namun dengan
Engine React (Tidak mengubah Algoritma Penulisan)

```
{component_name}/
> {component_name}.tsx ## React Component
> {component_name}.ts ## Typescript {component_name}.tsx untuk Logika Bisnis
> {component_name}.service.ts ## Typescript {component_name}.ts untuk Logika Service API
> {component_name}.css ## Bila ada Style yang harus keluar dari Global Scope

```

Contoh Sederhana :
```
login/
> login.tsx
> login.ts
> login.service.ts
> login.css
```

3. Styling Menggunakan UI Tailwind CSS secara penuh