import type {
  PerformanceSummary,
  PerformanceTier,
  PerformanceViewCopy,
} from "./performance";

// ─── Copy / Labels ───────────────────────────────────────────────────────────

export const performanceViewCopy: PerformanceViewCopy = {
  eyebrow: "Performance",
  title: "Pantau poin, rating, dan skill PP kamu.",
  tabPpOverview: "PP Overview",
  tabRatingHistory: "Riwayat Rating",
  tabSkillBoard: "Skill Board",
  loadingText: "Memuat data performa...",
  emptyText: "Data performa belum tersedia.",
  errorText: "Gagal memuat data performa.",
};

// ─── Tier Metadata ────────────────────────────────────────────────────────────

export type TierMeta = {
  label: string;
  minPP: number;
  maxPP: number | null;
  color: string;
  bgClass: string;
  textClass: string;
};

export const PP_TIER_MAP: Record<PerformanceTier, TierMeta> = {
  bronze: {
    label: "Bronze",
    minPP: 0,
    maxPP: 499,
    color: "#b8845a",
    bgClass: "bg-[#f3e3d5]",
    textClass: "text-[#7a4a28]",
  },
  silver: {
    label: "Silver",
    minPP: 500,
    maxPP: 1499,
    color: "#9ca3af",
    bgClass: "bg-[#e5e7eb]",
    textClass: "text-[#4b5563]",
  },
  gold: {
    label: "Gold",
    minPP: 1500,
    maxPP: 3999,
    color: "#f59e0b",
    bgClass: "bg-[#fef3c7]",
    textClass: "text-[#92400e]",
  },
  platinum: {
    label: "Platinum",
    minPP: 4000,
    maxPP: null,
    color: "#38bdf8",
    bgClass: "bg-[#e0f2fe]",
    textClass: "text-[#0369a1]",
  },
};

export const PP_TIER_ORDER: PerformanceTier[] = [
  "bronze",
  "silver",
  "gold",
  "platinum",
];

// ─── Tier Helpers ─────────────────────────────────────────────────────────────

export function resolveTierFromPP(pp: number): PerformanceTier {
  if (pp >= 4000) return "platinum";
  if (pp >= 1500) return "gold";
  if (pp >= 500) return "silver";
  return "bronze";
}

export function resolvePPProgress(pp: number): {
  nextTierPP: number | null;
  progress: number;
} {
  if (pp >= 4000) return { nextTierPP: null, progress: 100 };
  if (pp >= 1500)
    return {
      nextTierPP: 4000,
      progress: ((pp - 1500) / (4000 - 1500)) * 100,
    };
  if (pp >= 500)
    return { nextTierPP: 1500, progress: ((pp - 500) / (1500 - 500)) * 100 };
  return { nextTierPP: 500, progress: (pp / 500) * 100 };
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

export const performanceSummarySeed: PerformanceSummary = {
  totalPP: 0,
  globalRank: null,
  provinceRank: null,
  cityRank: null,
  tier: "bronze",
  avgRatingAsRunner: null,
  avgRatingAsGiver: null,
  totalQuestsCompleted: 0,
  totalQuestsGiven: 0,
  totalRatingsReceived: 0,
};
