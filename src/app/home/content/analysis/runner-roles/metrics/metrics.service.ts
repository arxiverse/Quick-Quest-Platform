export type RunnerMetricKey =
  | "gmv"
  | "match_rate"
  | "fill_time"
  | "completion"
  | "dispute"
  | "escrow_released";

export type RunnerMetricSeed = {
  key: RunnerMetricKey;
  label: string;
  value: string;
  hint: string;
  toneClass: string;
  detailPoints: Array<{ title: string; detail: string; toneClass?: string }>;
};

export const runnerMetricSeeds: RunnerMetricSeed[] = [
  {
    key: "gmv",
    label: "GMV",
    value: "Rp 18.6jt",
    hint: "+11.8%",
    toneClass: "bg-[#DBEAFE] text-[#1D4ED8]",
    detailPoints: [
      {
        title: "Kontributor Tertinggi: Retail",
        detail: "Segmen retail menyumbang 37% GMV dengan pattern demand stabil di jam 12-18.",
        toneClass: "bg-[#DBEAFE] text-[#1D4ED8]",
      },
      {
        title: "Lonjakan Harian Terbesar: Jumat",
        detail: "Kenaikan order kontrak pendek di Jumat menaikkan GMV harian hingga 14%.",
      },
      {
        title: "Aksi",
        detail: "Prioritaskan broadcast slot retail/cleaning saat peak untuk menjaga momentum GMV.",
      },
    ],
  },
  {
    key: "match_rate",
    label: "Match Rate",
    value: "78.4%",
    hint: "+3.2%",
    toneClass: "bg-[#DCFCE7] text-[#166534]",
    detailPoints: [
      {
        title: "Radius Optimal",
        detail: "Match rate terbaik terjadi di radius <2km untuk quest individu.",
        toneClass: "bg-[#DCFCE7] text-[#166534]",
      },
      {
        title: "Gap Utama",
        detail: "Quest kelompok di atas 3 slot masih punya waktu tunggu lebih panjang.",
      },
      {
        title: "Aksi",
        detail: "Tambahkan rekomendasi slot adaptif berdasarkan supply runner real-time.",
      },
    ],
  },
  {
    key: "fill_time",
    label: "Fill Time",
    value: "12m",
    hint: "-2m",
    toneClass: "bg-[#E9D5FF] text-[#6D28D9]",
    detailPoints: [
      {
        title: "Median Fill Time",
        detail: "12 menit dengan performa terbaik di kategori cleaning.",
        toneClass: "bg-[#E9D5FF] text-[#6D28D9]",
      },
      {
        title: "Outlier",
        detail: "Outlier >30 menit didominasi oleh brief yang kurang lengkap.",
      },
      {
        title: "Aksi",
        detail: "Dorong template brief terstruktur agar match lebih cepat dan presisi.",
      },
    ],
  },
  {
    key: "completion",
    label: "Completion",
    value: "86.9%",
    hint: "+4.1%",
    toneClass: "bg-[#FEF3C7] text-[#92400E]",
    detailPoints: [
      {
        title: "Top Completion Skill",
        detail: "Cleaning dan Retail punya completion rate tertinggi minggu ini.",
      },
      {
        title: "Faktor Penurun",
        detail: "Konfirmasi akhir dari giver menjadi bottleneck utama completion.",
        toneClass: "bg-[#FEF3C7] text-[#92400E]",
      },
      {
        title: "Aksi",
        detail: "Aktifkan reminder otomatis saat quest masuk pending confirmation.",
      },
    ],
  },
  {
    key: "dispute",
    label: "Dispute",
    value: "2.3%",
    hint: "-0.5%",
    toneClass: "bg-[#FECACA] text-[#991B1B]",
    detailPoints: [
      {
        title: "Tren Dispute",
        detail: "Rasio dispute menurun konsisten di 2 minggu terakhir.",
        toneClass: "bg-[#FECACA] text-[#991B1B]",
      },
      {
        title: "Hotspot",
        detail: "Dispute lebih sering terjadi di quest tanpa acceptance criteria jelas.",
      },
      {
        title: "Aksi",
        detail: "Perkuat validasi brief dan mandatory proof checklist sebelum release.",
      },
    ],
  },
  {
    key: "escrow_released",
    label: "Escrow Released",
    value: "Rp 16.1jt",
    hint: "+9.6%",
    toneClass: "bg-[#BFDBFE] text-[#1E3A8A]",
    detailPoints: [
      {
        title: "Release Velocity",
        detail: "Rata-rata release escrow berhasil di bawah 45 menit.",
      },
      {
        title: "Pending Aging",
        detail: "Kasus aging >60 menit turun 18% dibanding minggu lalu.",
        toneClass: "bg-[#BFDBFE] text-[#1E3A8A]",
      },
      {
        title: "Aksi",
        detail: "Pertahankan SLA approval agar cashflow runner tetap sehat.",
      },
    ],
  },
];

export const runnerMetricOverviewStatsSeed = [
  {
    label: "Quest Aktif",
    value: "286",
    hint: "range 7D",
    toneClass: "bg-[#DBEAFE] text-[#1D4ED8]",
  },
  {
    label: "Runner Online",
    value: "34",
    hint: "scope ALL",
    toneClass: "bg-[#DCFCE7] text-[#166534]",
  },
  {
    label: "Escrow Locked",
    value: "48",
    hint: "needs monitoring",
    toneClass: "bg-[#FEF3C7] text-[#92400E]",
  },
];
