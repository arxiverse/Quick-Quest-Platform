import {
  analysisRoleDataSeed,
  analysisCohortRetentionPoints,
  analysisCompareByRange,
  analysisDefaultStateSeed,
  analysisEscrowStatePoints,
  analysisFunnelByRange,
  analysisGeoScopeOptions,
  analysisGeoScopeSnapshots,
  analysisInsightCards,
  analysisKpiItems,
  analysisLeaderboardMovementGroups,
  analysisLeaderboardScopesSeed,
  analysisPendingAgingPoints,
  analysisPpGrowthPoints,
  analysisRiskPoints,
  analysisSlaMetrics,
  analysisSlaOutliers,
  analysisSlaResponsePoints,
  analysisSupplyDemandByGranularity,
  analysisSupplyGranularityOptions,
  analysisTargetImpianSeed,
  analysisTimeRangeOptions,
  analysisTopContributors,
  analysisViewCopySeed,
  type AnalysisViewCopy,
} from "./analysis.service";
import type { RoleMode } from "../../role.util";

export type AnalysisTimeRange = "Today" | "7D" | "30D";
export type AnalysisSupplyGranularity = "Jam" | "Hari";
export type AnalysisGeoScopeKey = "ALL" | "LT_2" | "GTE_2";

export type AnalysisKpiItem = {
  label: string;
  value: string;
  delta: string;
  tone: string;
};

export type AnalysisCompareCard = {
  label: string;
  value: string;
  delta: string;
  tone: string;
};

export type AnalysisFunnelPoint = {
  stage: "Posted" | "Match" | "In Progress" | "Released" | "Disputed";
  value: number;
};

export type AnalysisGeoScopeSnapshot = {
  radiusLabel: string;
  estimatedCandidates: string;
  activeRunners: string;
  avgEta: string;
  heatAreas: string[];
};

export type AnalysisSupplyDemandPoint = {
  slot: string;
  supply: number;
  demand: number;
};

export type AnalysisSlaMetric = {
  label: string;
  value: string;
  hint: string;
  tone: string;
};

export type AnalysisSlaResponsePoint = {
  step: string;
  median: number;
  target: number;
};

export type AnalysisSlaOutlier = {
  quest: string;
  delay: string;
  reason: string;
};

export type AnalysisEscrowStatePoint = {
  state:
    | "UNPAID"
    | "LOCKED"
    | "IN_PROGRESS"
    | "PENDING_CONFIRMATION"
    | "RELEASED"
    | "DISPUTED";
  total: number;
};

export type AnalysisPendingAgingPoint = {
  bucket: string;
  total: number;
};

export type AnalysisRiskPoint = {
  dimension: "Skill" | "Radius" | "Verification";
  segment: string;
  disputeRate: number;
  severity: "Low" | "Medium" | "High";
};

export type AnalysisPpGrowthPoint = {
  skill: string;
  pp: number;
  growth: number;
  decayImpact: number;
};

export type AnalysisTopContributor = {
  name: string;
  skill: string;
  ppGain: string;
  note: string;
};

export type AnalysisLeaderboardScope = "Lokal" | "Provinsi" | "Nasional";

export type AnalysisLeaderboardMovementItem = {
  name: string;
  previousRank: number;
  currentRank: number;
  pp: string;
};

export type AnalysisLeaderboardMovementGroup = {
  scope: AnalysisLeaderboardScope;
  items: AnalysisLeaderboardMovementItem[];
};

export type AnalysisCohortPoint = {
  week: string;
  runnerRetention: number;
  giverRetention: number;
};

export type AnalysisInsightCard = {
  title: string;
  detail: string;
  confidence: string;
  impact: "High" | "Medium" | "Low";
};

export type AnalysisTargetImpianSeed = {
  itemName: string;
  itemPrice: number;
  currentSaved: number;
  averageQuestWage: number;
};

export type AnalysisDefaultState = {
  timeRange: AnalysisTimeRange;
  geoScope: AnalysisGeoScopeKey;
  granularity: AnalysisSupplyGranularity;
  leaderboardScope: AnalysisLeaderboardScope;
};

export type AnalysisViewText = AnalysisViewCopy;
export type AnalysisRoleContext = RoleMode;
export type AnalysisRoleData = (typeof analysisRoleDataSeed)["runner"];

export type AnalysisTargetImpianState = {
  itemName: string;
  itemPrice: number;
  currentSaved: number;
};

export type AnalysisTargetImpianProjection = {
  remaining: number;
  questsNeeded: number;
  progressPercent: number;
};

export type AnalysisLeaderboardMovementTone = {
  label: string;
  toneClass: string;
};

export const analysisDefaultState: AnalysisDefaultState = {
  ...analysisDefaultStateSeed,
};

export const analysisLeaderboardScopes: AnalysisLeaderboardScope[] = [
  ...analysisLeaderboardScopesSeed,
];

export const analysisViewText: AnalysisViewText = analysisViewCopySeed;

export function resolveAnalysisRoleContext(
  role: RoleMode,
  isGiverVerified: boolean,
): AnalysisRoleContext {
  if (!isGiverVerified) {
    return "runner";
  }
  return role === "giver" ? "giver" : "runner";
}

export function resolveAnalysisRoleData(roleContext: AnalysisRoleContext): AnalysisRoleData {
  return analysisRoleDataSeed[roleContext] ?? analysisRoleDataSeed.runner;
}

const ANALYSIS_EMPTY_SUPPLY_DEMAND_POINT: AnalysisSupplyDemandPoint = {
  slot: "-",
  supply: 0,
  demand: 0,
};

const ANALYSIS_IDR_FORMATTER = new Intl.NumberFormat("id-ID");

export function resolveAnalysisGeoLabel(scope: AnalysisGeoScopeKey): string {
  if (scope === "LT_2") {
    return "< 2 km";
  }
  if (scope === "GTE_2") {
    return ">= 2 km";
  }
  return "Semua Radius";
}

export function resolveAnalysisRiskSeverityTone(
  level: AnalysisRiskPoint["severity"],
): string {
  if (level === "High") {
    return "bg-[#FECACA] text-[#991B1B]";
  }
  if (level === "Medium") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  return "bg-[#DCFCE7] text-[#166534]";
}

export function resolveAnalysisInsightImpactTone(
  level: AnalysisInsightCard["impact"],
): string {
  if (level === "High") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  if (level === "Medium") {
    return "bg-[#E9D5FF] text-[#6D28D9]";
  }
  return "bg-[#DCFCE7] text-[#166534]";
}

export function resolveAnalysisCompareCards(
  timeRange: AnalysisTimeRange,
  compareByRange: Record<AnalysisTimeRange, AnalysisCompareCard[]> = analysisCompareByRange,
): AnalysisCompareCard[] {
  return compareByRange[timeRange] ?? [];
}

export function resolveAnalysisFunnelPoints(
  timeRange: AnalysisTimeRange,
  funnelByRange: Record<AnalysisTimeRange, AnalysisFunnelPoint[]> = analysisFunnelByRange,
): AnalysisFunnelPoint[] {
  return funnelByRange[timeRange] ?? [];
}

export function resolveAnalysisGeoSnapshot(
  scope: AnalysisGeoScopeKey,
  geoScopeSnapshots: Record<AnalysisGeoScopeKey, AnalysisGeoScopeSnapshot> = analysisGeoScopeSnapshots,
): AnalysisGeoScopeSnapshot {
  return (
    geoScopeSnapshots[scope] ?? geoScopeSnapshots.ALL ?? {
      radiusLabel: "Semua Radius",
      estimatedCandidates: "0 runner",
      activeRunners: "0 online",
      avgEta: "-",
      heatAreas: [],
    }
  );
}

export function resolveAnalysisSupplyDemandPoints(
  granularity: AnalysisSupplyGranularity,
  supplyDemandByGranularity: Record<AnalysisSupplyGranularity, AnalysisSupplyDemandPoint[]> = analysisSupplyDemandByGranularity,
): AnalysisSupplyDemandPoint[] {
  return supplyDemandByGranularity[granularity] ?? [];
}

export function resolveAnalysisLeaderboardMovement(
  scope: AnalysisLeaderboardScope,
  groups: AnalysisLeaderboardMovementGroup[] = analysisLeaderboardMovementGroups,
): AnalysisLeaderboardMovementGroup {
  const matched = groups.find(
    (group) => group.scope === scope,
  );

  if (matched) {
    return matched;
  }

  const fallback = groups[0];
  if (fallback) {
    return fallback;
  }

  return {
    scope,
    items: [],
  };
}

function resolveAnalysisMaxValue(values: number[]): number {
  return Math.max(...values, 1);
}

export function resolveAnalysisFunnelMaxValue(points: AnalysisFunnelPoint[]): number {
  return resolveAnalysisMaxValue(points.map((point) => point.value));
}

export function resolveAnalysisEscrowMaxValue(
  points: AnalysisEscrowStatePoint[],
): number {
  return resolveAnalysisMaxValue(points.map((point) => point.total));
}

export function resolveAnalysisPpMaxValue(points: AnalysisPpGrowthPoint[]): number {
  return resolveAnalysisMaxValue(points.map((point) => point.pp));
}

export function resolveAnalysisSupplyDemandExtremes(
  points: AnalysisSupplyDemandPoint[],
): {
  busiest: AnalysisSupplyDemandPoint;
  quietest: AnalysisSupplyDemandPoint;
} {
  if (points.length === 0) {
    return {
      busiest: ANALYSIS_EMPTY_SUPPLY_DEMAND_POINT,
      quietest: ANALYSIS_EMPTY_SUPPLY_DEMAND_POINT,
    };
  }

  let busiest = points[0];
  let quietest = points[0];

  for (const point of points) {
    if (point.demand > busiest.demand) {
      busiest = point;
    }
    if (point.demand < quietest.demand) {
      quietest = point;
    }
  }

  return {
    busiest,
    quietest,
  };
}

export function resolveAnalysisFunnelConversion(
  points: AnalysisFunnelPoint[],
  index: number,
): string {
  if (index <= 0) {
    return "100%";
  }

  const current = points[index]?.value ?? 0;
  const previous = points[index - 1]?.value ?? 0;
  if (previous <= 0) {
    return "0%";
  }

  return `${Math.round((current / previous) * 100)}%`;
}

function normalizePositiveNumber(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

export function createInitialTargetImpianState(
  seed: AnalysisTargetImpianSeed,
): AnalysisTargetImpianState {
  return {
    itemName: seed.itemName,
    itemPrice: seed.itemPrice,
    currentSaved: seed.currentSaved,
  };
}

export function resolveTargetImpianProjection(
  state: AnalysisTargetImpianState,
  averageQuestWage: number,
): AnalysisTargetImpianProjection {
  const itemPrice = normalizePositiveNumber(state.itemPrice);
  const currentSaved = normalizePositiveNumber(state.currentSaved);
  const safeAverageWage = Math.max(1, normalizePositiveNumber(averageQuestWage));

  const remaining = Math.max(0, itemPrice - currentSaved);
  const questsNeeded = Math.ceil(remaining / safeAverageWage);
  const progressPercent =
    itemPrice > 0 ? Math.min(100, (currentSaved / itemPrice) * 100) : 0;

  return {
    remaining,
    questsNeeded,
    progressPercent,
  };
}

export function formatAnalysisIdr(value: number): string {
  return ANALYSIS_IDR_FORMATTER.format(normalizePositiveNumber(value));
}

export function resolveAnalysisLeaderboardMovementTone(
  previousRank: number,
  currentRank: number,
  viewText: AnalysisViewText = analysisViewText,
): AnalysisLeaderboardMovementTone {
  const delta = previousRank - currentRank;

  if (delta > 0) {
    return {
      label: `${viewText.leaderboard.movementUpPrefix} ${delta}`,
      toneClass: viewText.leaderboard.upToneClass,
    };
  }

  if (delta < 0) {
    return {
      label: `${viewText.leaderboard.movementDownPrefix} ${Math.abs(delta)}`,
      toneClass: viewText.leaderboard.downToneClass,
    };
  }

  return {
    label: viewText.leaderboard.movementSteadyLabel,
    toneClass: viewText.leaderboard.steadyToneClass,
  };
}

export {
  analysisCompareByRange,
  analysisCohortRetentionPoints,
  analysisEscrowStatePoints,
  analysisFunnelByRange,
  analysisGeoScopeOptions,
  analysisGeoScopeSnapshots,
  analysisInsightCards,
  analysisKpiItems,
  analysisLeaderboardMovementGroups,
  analysisPendingAgingPoints,
  analysisPpGrowthPoints,
  analysisRiskPoints,
  analysisSlaMetrics,
  analysisSlaOutliers,
  analysisSlaResponsePoints,
  analysisSupplyDemandByGranularity,
  analysisSupplyGranularityOptions,
  analysisTargetImpianSeed,
  analysisTopContributors,
  analysisTimeRangeOptions,
};
