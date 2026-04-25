// state.ts — ESVMC Compute Layer
// Business logic & type untuk Runner State

import {
  runnerBadgesSeed,
  runnerSkillStatsSeed,
  runnerStateWarningsSeed,
  runnerStateSummarySeed,
  type RunnerBadge,
  type RunnerSkillStat,
  type RunnerStateWarning,
} from "./state.service";

export type { RunnerBadge, RunnerSkillStat, RunnerStateWarning };

export const runnerBadges: RunnerBadge[] = [...runnerBadgesSeed];
export const runnerSkillStats: RunnerSkillStat[] = [...runnerSkillStatsSeed];
export const runnerStateWarnings: RunnerStateWarning[] = [...runnerStateWarningsSeed];
export const runnerStateSummary = { ...runnerStateSummarySeed };

export function resolveBadgeTierClass(tier: RunnerBadge["tier"]): string {
  switch (tier) {
    case "platinum": return "bg-[#E0E7FF] text-[#3730A3] ring-1 ring-[#818CF8]";
    case "gold":     return "bg-[#FEF3C7] text-[#92400E] ring-1 ring-[#F59E0B]";
    case "silver":   return "bg-[#F1F5F9] text-[#475569] ring-1 ring-[#94A3B8]";
    case "bronze":   return "bg-[#FEF9C3] text-[#713F12] ring-1 ring-[#A16207]";
    default:         return "bg-base-200 text-base-content/60";
  }
}

export function resolveSkillLevelBar(level: number, maxLevel: number): number {
  return Math.round((level / maxLevel) * 100);
}

export function resolveWarningClass(type: RunnerStateWarning["type"]): string {
  switch (type) {
    case "danger":  return "border-error/30 bg-error/5 text-error";
    case "warning": return "border-warning/30 bg-warning/5 text-warning";
    default:        return "border-info/30 bg-info/5 text-info";
  }
}
