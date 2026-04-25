// giver.activity.ts — ESVMC Compute Layer
// Business logic untuk Giver Activity

import {
  giverActivityEntriesSeed,
  giverActivityFilterOptionsSeed,
  giverActivitySummarySeed,
  type GiverActivityEntry,
  type GiverActivityFilterOption,
} from "./giver-activity.service";

export type { GiverActivityEntry, GiverActivityFilterOption };

export const giverActivityEntries: GiverActivityEntry[] = [...giverActivityEntriesSeed];
export const giverActivityFilterOptions: GiverActivityFilterOption[] = [...giverActivityFilterOptionsSeed];
export const giverActivitySummary = { ...giverActivitySummarySeed };

export function resolveGiverActivityStatusClass(status: GiverActivityEntry["status"]): string {
  switch (status) {
    case "Selesai": return "bg-[#DCFCE7] text-[#166534]";
    case "Aktif":   return "bg-[#DBEAFE] text-[#1D4ED8]";
    case "Menunggu": return "bg-[#FEF3C7] text-[#92400E]";
    case "Dibatalkan": return "bg-[#FEE2E2] text-[#B91C1C]";
    default: return "bg-base-200 text-base-content/60";
  }
}

export function resolveEscrowStatusClass(status: GiverActivityEntry["escrowStatus"]): string {
  switch (status) {
    case "Released": return "text-[#166534]";
    case "Locked":   return "text-[#1D4ED8]";
    case "Disputed": return "text-[#B91C1C]";
    default:         return "text-base-content/50";
  }
}

export function filterGiverActivities(
  entries: GiverActivityEntry[],
  filter: string
): GiverActivityEntry[] {
  if (filter === "ALL") return entries;
  return entries.filter((e) => e.status === filter);
}

export function resolveSlotFillRate(filled: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((filled / total) * 100);
}
