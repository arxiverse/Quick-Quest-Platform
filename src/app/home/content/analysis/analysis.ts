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
  state: "UNPAID" | "LOCKED" | "IN_PROGRESS" | "PENDING_CONFIRMATION" | "RELEASED" | "DISPUTED";
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
  analysisTopContributors,
  analysisTimeRangeOptions,
} from "./analysis.service";
