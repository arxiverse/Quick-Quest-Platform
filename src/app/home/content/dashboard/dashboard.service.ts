import type {
  DashboardActivityItem,
  DashboardCarouselItem,
  DashboardQuestItem,
  DashboardQuickFilter,
  DashboardSnapshotItem,
} from "./dashboard";

export const dashboardCarouselItems: DashboardCarouselItem[] = [
  {
    title: "Quest UMKM Terdekat",
    subtitle: "Temukan bantuan harian dengan reward terbaik di sekitarmu.",
    accent: "from-[#ede9fe] via-[#f8f7ff] to-white dark:from-[#312e81] dark:via-[#1f2340] dark:to-[#111827]",
  },
  {
    title: "Weekly Highlight",
    subtitle: "Tugas cepat dengan rating stabil dan proses yang jelas.",
    accent: "from-[#e0f2fe] via-white to-[#f8fafc] dark:from-[#0e7490] dark:via-[#10263f] dark:to-[#111827]",
  },
  {
    title: "Top Performer",
    subtitle: "Quest prioritas dengan poin tinggi untuk minggu ini.",
    accent: "from-[#dcfce7] via-white to-[#f7fee7] dark:from-[#166534] dark:via-[#1a2f29] dark:to-[#111827]",
  },
];

export const liveQuestItems: DashboardQuestItem[] = [
  {
    title: "Bersihkan Toko",
    owner: "Neira",
    role: "Pedagang",
    status: "LIVE",
    distanceKm: 0.8,
    countdown: "13:42",
    slots: "1 / 1",
    category: "Bersih - Bersih, Tukang",
    points: "+ 125 pp",
    reward: "Rp. 150.000 - Rp.250.000",
    score: "2.68",
  },
  {
    title: "Membersihkan Kandang Ayam",
    owner: "Neira",
    role: "Pedagang",
    status: "MATCH",
    distanceKm: 1.6,
    countdown: "08:11",
    slots: "3 / 5",
    category: "Bersih - Bersih, Cleaning Service",
    points: "+ 245 pp",
    reward: "Rp. 200.000 - Rp.350.000",
    score: "2.97",
  },
  {
    title: "Rapikan Display Warung",
    owner: "Miska",
    role: "Pemilik Usaha",
    status: "IN_PROGRESS",
    distanceKm: 2.1,
    countdown: "05:27",
    slots: "1 / 1",
    category: "Retail, Kebersihan, Visual",
    points: "+ 180 pp",
    reward: "Rp. 175.000 - Rp.300.000",
    score: "4.12",
  },
];

export const dashboardQuickFilters: DashboardQuickFilter[] = [
  { label: "Status", value: "LIVE", active: true },
  { label: "Radius", value: "< 2 km" },
  { label: "Upah", value: "100K - 350K" },
  { label: "Skill", value: "Kebersihan" },
  { label: "Mode", value: "Per-Individu" },
];

export const dashboardSnapshotItems: DashboardSnapshotItem[] = [
  { label: "Live Quest Hari Ini", value: "41", hint: "+8 dari kemarin", toneClass: "bg-[#DBEAFE]" },
  { label: "Match Rate", value: "78%", hint: "Target 80%", toneClass: "bg-[#DCFCE7]" },
  { label: "Avg Time to Match", value: "12m", hint: "-2m minggu ini", toneClass: "bg-[#FCE7F3]" },
  { label: "Escrow Released", value: "Rp2.4jt", hint: "24 transaksi", toneClass: "bg-[#FEF3C7]" },
];

export const dashboardActivityItems: DashboardActivityItem[] = [
  {
    title: "Quest berhasil di-claim",
    detail: "Neira mengambil quest Bersihkan Toko (0.8 km)",
    time: "2 menit lalu",
    toneClass: "bg-[#DBEAFE] text-[#1D4ED8]",
  },
  {
    title: "Escrow status berubah",
    detail: "Quest Membersihkan Kandang Ayam masuk IN_PROGRESS",
    time: "11 menit lalu",
    toneClass: "bg-[#DCFCE7] text-[#166534]",
  },
  {
    title: "Rating masuk",
    detail: "Quest Giver memberi rating 4.8 untuk quest Display Warung",
    time: "27 menit lalu",
    toneClass: "bg-[#FCE7F3] text-[#9D174D]",
  },
];
