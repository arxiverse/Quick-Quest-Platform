import type { PerformanceView } from "../performance";

export const ppOverviewCopy = {
  eyebrow: "PP Overview",
  title: "Total poin performa kamu.",
  totalPPLabel: "Total PP",
  globalRankLabel: "Rank Global",
  provinceRankLabel: "Rank Provinsi",
  cityRankLabel: "Rank Kota",
  tierLabel: "Tier Saat Ini",
  nextTierLabel: "PP ke Tier Berikutnya",
  completedLabel: "Quest Selesai",
  givenLabel: "Quest Dibuat",
  progressLabel: "Progress ke Tier Berikutnya",
  noRankText: "—",
  maxTierText: "Tier Tertinggi! 🏆",
  ppUnit: "PP",
};

export type PpOverviewCopy = typeof ppOverviewCopy;

export const ratingHistoryCopy = {
  eyebrow: "Riwayat Rating",
  title: "Rating yang kamu terima dari quest.",
  avgAsRunnerLabel: "Rata-rata sebagai Runner",
  avgAsGiverLabel: "Rata-rata sebagai Giver",
  totalRatingsLabel: "Total Rating Diterima",
  noRatingsText: "Belum ada rating yang diterima.",
  asRunnerBadge: "Sebagai Runner",
  asGiverBadge: "Sebagai Giver",
  commentLabel: "Komentar",
  noCommentText: "Tidak ada komentar.",
  questLabel: "Quest",
  fromLabel: "Dari",
};

export type RatingHistoryCopy = typeof ratingHistoryCopy;

export const skillBoardCopy = {
  eyebrow: "Skill Board",
  title: "Breakdown PP per kategori skill.",
  noSkillsText: "Belum ada data skill PP.",
  cityRankLabel: "Rank Kota",
  noRankText: "—",
  questCountLabel: "Quest",
  ppLabel: "PP",
  topSkillLabel: "Skill Teratas",
  allSkillsLabel: "Semua Skill",
};

export type SkillBoardCopy = typeof skillBoardCopy;

// ─── Performance view tab copy ────────────────────────────────────────────────

export const performanceTabCopy: Record<
  PerformanceView,
  { label: string; shortLabel: string }
> = {
  "pp-overview": { label: "PP Overview", shortLabel: "PP" },
  "rating-history": { label: "Riwayat Rating", shortLabel: "Rating" },
  "skill-board": { label: "Skill Board", shortLabel: "Skill" },
};
