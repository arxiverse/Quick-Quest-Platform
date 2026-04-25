// recent-activity.service.ts — ESVMC Service Layer
// Data Seed & API adapter untuk Recent Activity Runner

export type ActivityEntry = {
  id: string;
  title: string;
  category: string;
  status: "Selesai" | "Dibatalkan" | "Dalam Progress" | "Terverifikasi";
  reward: string;
  ppEarned: string;
  date: string;
  duration: string;
  ratingGiven?: number;
};

export type ActivityFilterOption = {
  value: string;
  label: string;
};

export const activityFilterOptionsSeed: ActivityFilterOption[] = [
  { value: "ALL", label: "Semua" },
  { value: "Selesai", label: "Selesai" },
  { value: "Dalam Progress", label: "Progress" },
  { value: "Dibatalkan", label: "Dibatalkan" },
];

export const recentActivitySeed: ActivityEntry[] = [
  {
    id: "QST-0041",
    title: "Bersihkan Toko Kelontong",
    category: "Kebersihan",
    status: "Selesai",
    reward: "Rp180.000",
    ppEarned: "+95 PP",
    date: "Hari ini, 10:30",
    duration: "1j 45m",
    ratingGiven: 5,
  },
  {
    id: "QST-0040",
    title: "Rapikan Display Warung",
    category: "Retail",
    status: "Selesai",
    reward: "Rp220.000",
    ppEarned: "+110 PP",
    date: "Kemarin, 14:00",
    duration: "2j 10m",
    ratingGiven: 4,
  },
  {
    id: "QST-0039",
    title: "Pickup Paket Gudang",
    category: "Delivery",
    status: "Terverifikasi",
    reward: "Rp350.000",
    ppEarned: "+145 PP",
    date: "2 hari lalu",
    duration: "3j 00m",
    ratingGiven: 5,
  },
  {
    id: "QST-0038",
    title: "Instalasi Router Wifi",
    category: "Teknologi",
    status: "Dalam Progress",
    reward: "Rp200.000",
    ppEarned: "Pending",
    date: "Kemarin, 09:15",
    duration: "Ongoing",
  },
  {
    id: "QST-0037",
    title: "Antar Dokumen ke Notaris",
    category: "Delivery",
    status: "Dibatalkan",
    reward: "Rp0",
    ppEarned: "-10 PP",
    date: "3 hari lalu",
    duration: "—",
  },
  {
    id: "QST-0036",
    title: "Checkout & Packing Barang",
    category: "Retail",
    status: "Selesai",
    reward: "Rp150.000",
    ppEarned: "+80 PP",
    date: "4 hari lalu",
    duration: "1j 20m",
    ratingGiven: 4,
  },
];

export const activitySummaryStatsSeed = {
  totalQuest: "41",
  totalEarned: "Rp6.2Jt",
  totalPP: "+4.120 PP",
  completionRate: "91%",
  avgDuration: "1j 52m",
  cancelRate: "9%",
};
