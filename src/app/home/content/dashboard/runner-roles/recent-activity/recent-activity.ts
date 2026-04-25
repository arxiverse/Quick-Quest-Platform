// recent-activity.ts — ESVMC Compute Layer
// Business logic & transformasi data untuk Recent Activity Runner

import {
  recentActivitySeed,
  activitySummaryStatsSeed,
  activityFilterOptionsSeed,
  type ActivityEntry,
  type ActivityFilterOption,
} from "./recent-activity.service";

export type { ActivityEntry, ActivityFilterOption };

export const recentActivities: ActivityEntry[] = [...recentActivitySeed];
export const activityFilterOptions: ActivityFilterOption[] = [...activityFilterOptionsSeed];

export type ActivitySummaryStats = typeof activitySummaryStatsSeed;
export const activitySummaryStats: ActivitySummaryStats = { ...activitySummaryStatsSeed };

export function resolveActivityStatusClass(status: ActivityEntry["status"]): string {
  switch (status) {
    case "Selesai":
      return "bg-[#DCFCE7] text-[#166534]";
    case "Terverifikasi":
      return "bg-[#DBEAFE] text-[#1D4ED8]";
    case "Dalam Progress":
      return "bg-[#FEF3C7] text-[#92400E]";
    case "Dibatalkan":
      return "bg-[#FEE2E2] text-[#B91C1C]";
    default:
      return "bg-base-200 text-base-content/60";
  }
}

export function filterActivities(
  entries: ActivityEntry[],
  filter: string
): ActivityEntry[] {
  if (filter === "ALL") return entries;
  return entries.filter((e) => e.status === filter);
}

export function resolveRatingStars(rating?: number): string {
  if (!rating) return "—";
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}
