# Quick Quest Platform - UI/UX Roadmap (2 Weeks)

## Goal
Mengangkat tampilan dari "template rapi" menjadi "product-grade QQM" yang menonjolkan:
- live quest experience
- trust & escrow visibility
- performance/rank progression
- konsistensi visual lintas halaman

## Week 1 - Foundation + Core Experience
### Day 1
- Finalisasi design tokens: radius, shadow, spacing, button height, badge size.
- Audit semua `home/content/*` dan samakan style card.

### Day 2
- Dashboard hero QQM + role mode switch (`Runner` / `Giver`).
- Perjelas hierarchy typography dashboard.

### Day 3
- Quest card status system (`LIVE`, `MATCH`, `IN_PROGRESS`).
- Tambah metadata visual: jarak, countdown, slot.

### Day 4
- Pola grid desktop fix: `row = 2` untuk quest list (dashboard + profile).
- Horizontal overflow behavior tetap smooth tanpa merusak mobile.

### Day 5
- Profile identity refinement: spacing, typo hierarchy, CTA rhythm.
- Tambah panel `Performance Ladder` dan `Trust Layer`.

### Day 6
- Empty/loading/error state untuk dashboard/profile.
- Buat CTA jelas per state (misalnya: "Ambil Quest Pertama").

### Day 7
- UI QA lintas breakpoint (mobile/tablet/desktop).
- Rapikan edge-case spacing dan overflow.

## Week 2 - Product Personality + Usability Polish
### Day 8
- Leaderboard visual improvements: rank emphasis + local/global context.
- Badge rank Q1/Q2/Q3 lebih tegas.

### Day 9
- Analysis page polish: chart container safety + consistent panel hierarchy.
- Tooltip style konsisten dengan surface theme.

### Day 10
- Notifikasi center mock UI: event list (match, release, rating).
- Grouping event per waktu (Hari ini, Kemarin).

### Day 11
- Quest detail sheet/modal design system:
- section tetap: deskripsi, skill tag, estimasi upah, risk note, trust marker.

### Day 12
- Motion pass ringan:
- page-load stagger, status-change highlight, CTA press feedback.

### Day 13
- Accessibility pass:
- color contrast, focus ring, keyboard tab flow, aria label penting.

### Day 14
- Final UI sweep + visual regression checklist.
- Freeze UI baseline untuk lanjut ke feature phase berikutnya.

## Success Criteria
- Semua page utama punya visual language konsisten (radius/shadow/spacing).
- Status quest bisa dipahami < 3 detik oleh user baru.
- Profile menampilkan trust + progression, bukan hanya biodata.
- Tidak ada layout break di mobile/desktop utama.
