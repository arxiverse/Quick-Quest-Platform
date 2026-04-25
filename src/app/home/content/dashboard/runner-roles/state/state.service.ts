// state.service.ts — ESVMC Service Layer
// Data seed untuk Runner State (Reputasi, Level, Kondisi Akun)

export type RunnerBadge = {
  id: string;
  label: string;
  description: string;
  earnedAt: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
};

export type RunnerSkillStat = {
  skill: string;
  level: number;
  maxLevel: number;
  completedQuest: number;
  ppShare: string;
};

export type RunnerStateWarning = {
  id: string;
  type: "warning" | "info" | "danger";
  message: string;
};

export const runnerBadgesSeed: RunnerBadge[] = [
  {
    id: "B01",
    label: "Rookie Runner",
    description: "Menyelesaikan quest pertama.",
    earnedAt: "Maret 2024",
    tier: "bronze",
  },
  {
    id: "B02",
    label: "Speed Demon",
    description: "Respons di bawah 5 menit selama 7 hari berturut.",
    earnedAt: "April 2024",
    tier: "silver",
  },
  {
    id: "B03",
    label: "Quest Veteran",
    description: "Menyelesaikan 25 quest tanpa pembatalan.",
    earnedAt: "April 2024",
    tier: "gold",
  },
  {
    id: "B04",
    label: "Reliable Star",
    description: "Rating rata-rata 4.8+ selama 30 hari.",
    earnedAt: "Baru Saja",
    tier: "platinum",
  },
];

export const runnerSkillStatsSeed: RunnerSkillStat[] = [
  { skill: "Kebersihan", level: 4, maxLevel: 5, completedQuest: 18, ppShare: "38%" },
  { skill: "Retail", level: 3, maxLevel: 5, completedQuest: 12, ppShare: "28%" },
  { skill: "Delivery", level: 2, maxLevel: 5, completedQuest: 7, ppShare: "19%" },
  { skill: "Teknologi", level: 1, maxLevel: 5, completedQuest: 4, ppShare: "15%" },
];

export const runnerStateWarningsSeed: RunnerStateWarning[] = [
  {
    id: "W01",
    type: "info",
    message: "Lengkapi verifikasi dokumen untuk membuka slot quest Teknologi lebih banyak.",
  },
  {
    id: "W02",
    type: "warning",
    message: "Response time meningkat 3 menit dari rata-rata minggu lalu. Jaga konsistensi!",
  },
];

export const runnerStateSummarySeed = {
  level: "Q2 — Runner Handal",
  pp: "6.495",
  rank: "#14 Lokal",
  reliability: "94.2%",
  cancelRate: "5.8%",
  joinedAt: "Maret 2024",
};
