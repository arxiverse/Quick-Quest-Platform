// state.ts — ESVMC Compute Layer
// Business logic untuk Giver State

import {
  giverTrustBadgesSeed,
  giverPaymentRecordsSeed,
  giverStateWarningsSeed,
  giverStateSummarySeed,
  type GiverTrustBadge,
  type GiverPaymentRecord,
  type GiverStateWarning,
} from "./state.service";

export type { GiverTrustBadge, GiverPaymentRecord, GiverStateWarning };

export const giverTrustBadges: GiverTrustBadge[] = [...giverTrustBadgesSeed];
export const giverPaymentRecords: GiverPaymentRecord[] = [...giverPaymentRecordsSeed];
export const giverStateWarnings: GiverStateWarning[] = [...giverStateWarningsSeed];
export const giverStateSummary = { ...giverStateSummarySeed };

export function resolveBadgeTierClass(tier: GiverTrustBadge["tier"]): string {
  switch (tier) {
    case "platinum": return "bg-[#E0E7FF] text-[#3730A3] ring-1 ring-[#818CF8]";
    case "gold":     return "bg-[#FEF3C7] text-[#92400E] ring-1 ring-[#F59E0B]";
    case "silver":   return "bg-[#F1F5F9] text-[#475569] ring-1 ring-[#94A3B8]";
    case "bronze":   return "bg-[#FEF9C3] text-[#713F12] ring-1 ring-[#A16207]";
    default:         return "bg-base-200 text-base-content/60";
  }
}

export function resolvePaymentTypeClass(type: GiverPaymentRecord["type"]): string {
  switch (type) {
    case "Escrow Release": return "bg-[#DCFCE7] text-[#166534]";
    case "Escrow Lock":    return "bg-[#DBEAFE] text-[#1D4ED8]";
    case "Refund":         return "bg-[#FEF3C7] text-[#92400E]";
    case "Penalty":        return "bg-[#FEE2E2] text-[#B91C1C]";
    default:               return "bg-base-200 text-base-content/60";
  }
}

export function resolveWarningClass(type: GiverStateWarning["type"]): string {
  switch (type) {
    case "danger":  return "border-error/30 bg-error/5 text-error";
    case "warning": return "border-warning/30 bg-warning/5 text-warning";
    default:        return "border-info/30 bg-info/5 text-info";
  }
}
