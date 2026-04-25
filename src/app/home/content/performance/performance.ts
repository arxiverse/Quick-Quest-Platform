// ─── Types ────────────────────────────────────────────────────────────────────

export type PerformanceTier = "bronze" | "silver" | "gold" | "platinum";

export type PerformanceView = "pp-overview" | "rating-history" | "skill-board";

export const performanceViews: PerformanceView[] = [
  "pp-overview",
  "rating-history",
  "skill-board",
];

export type PerformanceSummary = {
  totalPP: number;
  globalRank: number | null;
  provinceRank: number | null;
  cityRank: number | null;
  tier: PerformanceTier;
  avgRatingAsRunner: number | null;
  avgRatingAsGiver: number | null;
  totalQuestsCompleted: number;
  totalQuestsGiven: number;
  totalRatingsReceived: number;
};

export type PerformanceViewCopy = {
  eyebrow: string;
  title: string;
  tabPpOverview: string;
  tabRatingHistory: string;
  tabSkillBoard: string;
  loadingText: string;
  emptyText: string;
  errorText: string;
};

export type RatingEntry = {
  id: string;
  questId: string;
  questTitle: string;
  raterName: string;
  score: number;
  comment: string | null;
  role: "as_runner" | "as_giver";
  createdAt: string;
};

export type SkillPP = {
  skill: string;
  pp: number;
  questCount: number;
  cityRank: number | null;
};

// ─── Re-exports from service (ESVMC) ─────────────────────────────────────────

export {
  performanceViewCopy,
  performanceSummarySeed,
  PP_TIER_MAP,
  PP_TIER_ORDER,
  resolveTierFromPP,
  resolvePPProgress,
  type TierMeta,
} from "./performance.service";
