// giver-activity.service.ts — ESVMC Service Layer
// Data Seed untuk Giver Activity (History Broadcast, Filling, Pengeluaran)

export type GiverActivityEntry = {
  id: string;
  questTitle: string;
  category: string;
  status: "Selesai" | "Aktif" | "Dibatalkan" | "Menunggu";
  runnerCount: number;
  totalSlot: number;
  totalCost: string;
  escrowStatus: "Released" | "Locked" | "Disputed" | "Pending";
  broadcastDate: string;
  completionDate?: string;
};

export type GiverActivityFilterOption = {
  value: string;
  label: string;
};

export const giverActivityFilterOptionsSeed: GiverActivityFilterOption[] = [
  { value: "ALL", label: "Semua" },
  { value: "Selesai", label: "Selesai" },
  { value: "Aktif", label: "Aktif" },
  { value: "Menunggu", label: "Menunggu" },
  { value: "Dibatalkan", label: "Dibatalkan" },
];

export const giverActivityEntriesSeed: GiverActivityEntry[] = [
  {
    id: "QG-0011",
    questTitle: "Pembersihan Toko Sebelum Opening",
    category: "Kebersihan",
    status: "Selesai",
    runnerCount: 2,
    totalSlot: 2,
    totalCost: "Rp420.000",
    escrowStatus: "Released",
    broadcastDate: "Hari ini, 07:00",
    completionDate: "Hari ini, 09:45",
  },
  {
    id: "QG-0010",
    questTitle: "Restock & Sorting Gudang",
    category: "Retail",
    status: "Aktif",
    runnerCount: 3,
    totalSlot: 4,
    totalCost: "Rp780.000",
    escrowStatus: "Locked",
    broadcastDate: "Kemarin, 14:00",
  },
  {
    id: "QG-0009",
    questTitle: "Pengiriman Batch Dokumen",
    category: "Delivery",
    status: "Selesai",
    runnerCount: 1,
    totalSlot: 1,
    totalCost: "Rp195.000",
    escrowStatus: "Released",
    broadcastDate: "2 hari lalu",
    completionDate: "2 hari lalu",
  },
  {
    id: "QG-0008",
    questTitle: "Setup Booth Pameran",
    category: "Retail",
    status: "Dibatalkan",
    runnerCount: 0,
    totalSlot: 5,
    totalCost: "Rp0",
    escrowStatus: "Pending",
    broadcastDate: "3 hari lalu",
  },
  {
    id: "QG-0007",
    questTitle: "Konfigurasi Jaringan Kantor",
    category: "Teknologi",
    status: "Menunggu",
    runnerCount: 0,
    totalSlot: 2,
    totalCost: "Rp550.000",
    escrowStatus: "Locked",
    broadcastDate: "Hari ini, 11:00",
  },
];

export const giverActivitySummarySeed = {
  totalBroadcast: "11",
  totalSpent: "Rp4.8Jt",
  completionRate: "89%",
  avgFillTime: "18m",
  totalRunnerHired: "23",
  activeEscrow: "Rp1.3Jt",
};
