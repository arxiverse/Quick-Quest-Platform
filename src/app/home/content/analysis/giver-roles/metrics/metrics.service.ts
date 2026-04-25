export type GiverMetricKey =
  | "broadcast"
  | "fill_rate"
  | "avg_match"
  | "escrow_locked"
  | "dispute"
  | "escrow_released";

export type GiverMetricSeed = {
  key: GiverMetricKey;
  label: string;
  value: string;
  hint: string;
  toneClass: string;
  detailPoints: Array<{ title: string; detail: string; toneClass?: string }>;
};

export const giverMetricSeeds: GiverMetricSeed[] = [
  {
    key: "broadcast",
    label: "Broadcast",
    value: "312",
    hint: "+13.1%",
    toneClass: "bg-[#DBEAFE] text-[#1D4ED8]",
    detailPoints: [
      {
        title: "Broadcast Volume",
        detail: "Kenaikan volume broadcast dipicu oleh quest kelompok di sektor retail.",
      },
      {
        title: "Audience Reach",
        detail: "Coverage meningkat saat radius dibuka adaptif mengikuti jam ramai.",
      },
      {
        title: "Aksi",
        detail: "Pertahankan brief ringkas dan jelas agar claim tidak drop.",
      },
    ],
  },
  {
    key: "fill_rate",
    label: "Fill Rate",
    value: "81.2%",
    hint: "+4.7%",
    toneClass: "bg-[#DCFCE7] text-[#166534]",
    detailPoints: [
      {
        title: "Konversi Terbaik",
        detail: "Quest individu dengan reward jelas menghasilkan fill rate tertinggi.",
      },
      {
        title: "Gap",
        detail: "Slot kelompok >4 masih butuh dukungan auto-matching lebih agresif.",
      },
      {
        title: "Aksi",
        detail: "Gunakan rekomendasi skill + radius untuk menjaga fill rate stabil.",
      },
    ],
  },
  {
    key: "avg_match",
    label: "Avg Match",
    value: "10m",
    hint: "-2m",
    toneClass: "bg-[#E9D5FF] text-[#6D28D9]",
    detailPoints: [
      {
        title: "Median Match Time",
        detail: "Median match time turun ke 10 menit berkat brief quality yang lebih baik.",
      },
      {
        title: "Outlier",
        detail: "Outlier masih muncul saat quest butuh verifikasi tambahan di tengah proses.",
      },
      {
        title: "Aksi",
        detail: "Siapkan acceptance criteria dari awal untuk memotong negotiation loop.",
      },
    ],
  },
  {
    key: "escrow_locked",
    label: "Escrow Locked",
    value: "Rp 9.4jt",
    hint: "+10.8%",
    toneClass: "bg-[#FEF3C7] text-[#92400E]",
    detailPoints: [
      {
        title: "Escrow Pipeline",
        detail: "Dana locked meningkat selaras dengan naiknya volume quest in-progress.",
      },
      {
        title: "Risk Control",
        detail: "Tidak ditemukan anomali besar pada aging bucket >60 menit.",
      },
      {
        title: "Aksi",
        detail: "Percepat approval akhir untuk menjaga cashflow dan kepuasan runner.",
      },
    ],
  },
  {
    key: "dispute",
    label: "Dispute",
    value: "1.8%",
    hint: "-0.6%",
    toneClass: "bg-[#FECACA] text-[#991B1B]",
    detailPoints: [
      {
        title: "Tren",
        detail: "Dispute ratio turun setelah template brief wajib diterapkan.",
      },
      {
        title: "Root Cause",
        detail: "Kasus tersisa paling banyak karena mismatch ekspektasi hasil akhir.",
      },
      {
        title: "Aksi",
        detail: "Perkuat checklist hasil kerja dan bukti completion sebelum release.",
      },
    ],
  },
  {
    key: "escrow_released",
    label: "Escrow Released",
    value: "Rp 21.3jt",
    hint: "+12.2%",
    toneClass: "bg-[#BFDBFE] text-[#1E3A8A]",
    detailPoints: [
      {
        title: "Release Performance",
        detail: "Release escrow konsisten cepat pada quest dengan SLA approval disiplin.",
      },
      {
        title: "Velocity",
        detail: "Waktu rata-rata release berada di bawah target operasional.",
      },
      {
        title: "Aksi",
        detail: "Pertahankan monitoring pending aging untuk mencegah bottleneck baru.",
      },
    ],
  },
];

export const giverMetricOverviewStatsSeed = [
  {
    label: "Broadcast Aktif",
    value: "312",
    hint: "range 7D",
    toneClass: "bg-[#DBEAFE] text-[#1D4ED8]",
  },
  {
    label: "Fill Rate",
    value: "81.2%",
    hint: "stabil",
    toneClass: "bg-[#DCFCE7] text-[#166534]",
  },
  {
    label: "Pending Escrow",
    value: "23",
    hint: "monitoring",
    toneClass: "bg-[#FEF3C7] text-[#92400E]",
  },
];
