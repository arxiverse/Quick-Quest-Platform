import type {
  AnalysisCohortPoint,
  AnalysisCompareCard,
  AnalysisEscrowStatePoint,
  AnalysisFunnelPoint,
  AnalysisGeoScopeKey,
  AnalysisGeoScopeSnapshot,
  AnalysisInsightCard,
  AnalysisKpiItem,
  AnalysisLeaderboardMovementGroup,
  AnalysisPendingAgingPoint,
  AnalysisPpGrowthPoint,
  AnalysisRiskPoint,
  AnalysisSlaMetric,
  AnalysisSlaOutlier,
  AnalysisSlaResponsePoint,
  AnalysisSupplyDemandPoint,
  AnalysisSupplyGranularity,
  AnalysisTimeRange,
  AnalysisTopContributor,
} from "./analysis";

export const analysisKpiItems: AnalysisKpiItem[] = [
  { label: "GMV", value: "Rp 18.6jt", delta: "+11.8%", tone: "bg-[#DCFCE7]" },
  { label: "Match Rate", value: "78.4%", delta: "+3.2%", tone: "bg-[#DBEAFE]" },
  { label: "Fill Time", value: "12m", delta: "-2m", tone: "bg-[#E9D5FF]" },
  { label: "Completion", value: "86.9%", delta: "+4.1%", tone: "bg-[#FEF3C7]" },
  { label: "Dispute", value: "2.3%", delta: "-0.5%", tone: "bg-[#FECACA]" },
  { label: "Escrow Released", value: "Rp 16.1jt", delta: "+9.6%", tone: "bg-[#BFDBFE]" },
];

export const analysisTimeRangeOptions: AnalysisTimeRange[] = ["Today", "7D", "30D"];

export const analysisCompareByRange: Record<AnalysisTimeRange, AnalysisCompareCard[]> = {
  Today: [
    { label: "vs kemarin (Posted)", value: "42", delta: "+8%", tone: "bg-[#DBEAFE]" },
    { label: "vs kemarin (Match)", value: "31", delta: "+5%", tone: "bg-[#DCFCE7]" },
    { label: "vs kemarin (Released)", value: "24", delta: "+3%", tone: "bg-[#E9D5FF]" },
  ],
  "7D": [
    { label: "vs 7D sebelumnya (Posted)", value: "286", delta: "+12%", tone: "bg-[#DBEAFE]" },
    { label: "vs 7D sebelumnya (Match)", value: "219", delta: "+9%", tone: "bg-[#DCFCE7]" },
    { label: "vs 7D sebelumnya (Released)", value: "184", delta: "+7%", tone: "bg-[#E9D5FF]" },
  ],
  "30D": [
    { label: "vs 30D sebelumnya (Posted)", value: "1,122", delta: "+15%", tone: "bg-[#DBEAFE]" },
    { label: "vs 30D sebelumnya (Match)", value: "902", delta: "+11%", tone: "bg-[#DCFCE7]" },
    { label: "vs 30D sebelumnya (Released)", value: "771", delta: "+9%", tone: "bg-[#E9D5FF]" },
  ],
};

export const analysisFunnelByRange: Record<AnalysisTimeRange, AnalysisFunnelPoint[]> = {
  Today: [
    { stage: "Posted", value: 42 },
    { stage: "Match", value: 31 },
    { stage: "In Progress", value: 27 },
    { stage: "Released", value: 24 },
    { stage: "Disputed", value: 3 },
  ],
  "7D": [
    { stage: "Posted", value: 286 },
    { stage: "Match", value: 219 },
    { stage: "In Progress", value: 198 },
    { stage: "Released", value: 184 },
    { stage: "Disputed", value: 14 },
  ],
  "30D": [
    { stage: "Posted", value: 1122 },
    { stage: "Match", value: 902 },
    { stage: "In Progress", value: 829 },
    { stage: "Released", value: 771 },
    { stage: "Disputed", value: 58 },
  ],
};

export const analysisGeoScopeOptions: AnalysisGeoScopeKey[] = ["ALL", "LT_2", "GTE_2"];

export const analysisGeoScopeSnapshots: Record<AnalysisGeoScopeKey, AnalysisGeoScopeSnapshot> = {
  ALL: {
    radiusLabel: "Semua Radius",
    estimatedCandidates: "56 runner",
    activeRunners: "34 online",
    avgEta: "16m",
    heatAreas: ["Cilandak", "Pasar Minggu", "Cipete"],
  },
  LT_2: {
    radiusLabel: "< 2 km",
    estimatedCandidates: "21 runner",
    activeRunners: "15 online",
    avgEta: "9m",
    heatAreas: ["Fatmawati", "Kemang", "Lebak Bulus"],
  },
  GTE_2: {
    radiusLabel: ">= 2 km",
    estimatedCandidates: "35 runner",
    activeRunners: "19 online",
    avgEta: "19m",
    heatAreas: ["Tebet", "Pancoran", "Kuningan"],
  },
};

export const analysisSupplyGranularityOptions: AnalysisSupplyGranularity[] = ["Jam", "Hari"];

export const analysisSupplyDemandByGranularity: Record<AnalysisSupplyGranularity, AnalysisSupplyDemandPoint[]> = {
  Jam: [
    { slot: "06", supply: 12, demand: 18 },
    { slot: "09", supply: 28, demand: 34 },
    { slot: "12", supply: 40, demand: 46 },
    { slot: "15", supply: 34, demand: 41 },
    { slot: "18", supply: 31, demand: 39 },
    { slot: "21", supply: 18, demand: 22 },
  ],
  Hari: [
    { slot: "Sen", supply: 162, demand: 186 },
    { slot: "Sel", supply: 171, demand: 201 },
    { slot: "Rab", supply: 168, demand: 194 },
    { slot: "Kam", supply: 179, demand: 213 },
    { slot: "Jum", supply: 188, demand: 226 },
    { slot: "Sab", supply: 174, demand: 205 },
    { slot: "Min", supply: 151, demand: 178 },
  ],
};

export const analysisSlaMetrics: AnalysisSlaMetric[] = [
  { label: "Median First Response", value: "4m 20s", hint: "target <= 5m", tone: "bg-[#DCFCE7]" },
  { label: "Median Match Time", value: "12m", hint: "target <= 15m", tone: "bg-[#DBEAFE]" },
  { label: "P90 Completion", value: "2j 15m", hint: "target <= 3j", tone: "bg-[#E9D5FF]" },
  { label: "Outlier Cases", value: "7", hint: "butuh review manual", tone: "bg-[#FECACA]" },
];

export const analysisSlaResponsePoints: AnalysisSlaResponsePoint[] = [
  { step: "First Response", median: 4.3, target: 5 },
  { step: "Match Confirm", median: 11.8, target: 15 },
  { step: "Start Work", median: 19.6, target: 25 },
  { step: "Release Escrow", median: 38.4, target: 45 },
];

export const analysisSlaOutliers: AnalysisSlaOutlier[] = [
  { quest: "Bersihkan Gudang Mini", delay: "47m", reason: "Kandidat runner minim di radius aktif" },
  { quest: "Pickup Dokumen Kuningan", delay: "42m", reason: "Konfirmasi giver terlambat" },
  { quest: "Rapikan Booth Event", delay: "39m", reason: "Perubahan brief di tengah proses" },
];

export const analysisEscrowStatePoints: AnalysisEscrowStatePoint[] = [
  { state: "UNPAID", total: 26 },
  { state: "LOCKED", total: 48 },
  { state: "IN_PROGRESS", total: 39 },
  { state: "PENDING_CONFIRMATION", total: 19 },
  { state: "RELEASED", total: 124 },
  { state: "DISPUTED", total: 7 },
];

export const analysisPendingAgingPoints: AnalysisPendingAgingPoint[] = [
  { bucket: "< 10m", total: 8 },
  { bucket: "10-30m", total: 6 },
  { bucket: "30-60m", total: 3 },
  { bucket: "> 60m", total: 2 },
];

export const analysisRiskPoints: AnalysisRiskPoint[] = [
  { dimension: "Skill", segment: "Teknologi", disputeRate: 4.2, severity: "High" },
  { dimension: "Skill", segment: "Retail", disputeRate: 2.7, severity: "Medium" },
  { dimension: "Radius", segment: ">= 2 km", disputeRate: 3.4, severity: "High" },
  { dimension: "Radius", segment: "< 2 km", disputeRate: 1.8, severity: "Low" },
  { dimension: "Verification", segment: "Unverified Giver", disputeRate: 5.1, severity: "High" },
  { dimension: "Verification", segment: "Verified Giver", disputeRate: 1.3, severity: "Low" },
];

export const analysisPpGrowthPoints: AnalysisPpGrowthPoint[] = [
  { skill: "Cleaning", pp: 2140, growth: 8.6, decayImpact: 1.2 },
  { skill: "Retail", pp: 1860, growth: 6.4, decayImpact: 1.6 },
  { skill: "Delivery", pp: 1240, growth: 4.9, decayImpact: 2.1 },
  { skill: "Teknologi", pp: 755, growth: 9.2, decayImpact: 3.4 },
];

export const analysisTopContributors: AnalysisTopContributor[] = [
  { name: "Neira", skill: "Cleaning", ppGain: "+128", note: "Streak 6 hari" },
  { name: "Miska", skill: "Retail", ppGain: "+102", note: "Akurasi 97.1%" },
  { name: "Raka", skill: "Delivery", ppGain: "+86", note: "On-time tinggi" },
];

export const analysisLeaderboardMovementGroups: AnalysisLeaderboardMovementGroup[] = [
  {
    scope: "Lokal",
    items: [
      { name: "Neira", previousRank: 2, currentRank: 1, pp: "6,495" },
      { name: "Miska", previousRank: 1, currentRank: 2, pp: "6,220" },
      { name: "Raka", previousRank: 4, currentRank: 3, pp: "5,901" },
    ],
  },
  {
    scope: "Provinsi",
    items: [
      { name: "Aghnia", previousRank: 1, currentRank: 1, pp: "8,112" },
      { name: "Neira", previousRank: 3, currentRank: 2, pp: "6,495" },
      { name: "Naufal", previousRank: 2, currentRank: 3, pp: "6,410" },
    ],
  },
  {
    scope: "Nasional",
    items: [
      { name: "Rizki", previousRank: 1, currentRank: 1, pp: "12,224" },
      { name: "Aghnia", previousRank: 4, currentRank: 2, pp: "8,112" },
      { name: "Neira", previousRank: 5, currentRank: 3, pp: "6,495" },
    ],
  },
];

export const analysisCohortRetentionPoints: AnalysisCohortPoint[] = [
  { week: "W1", runnerRetention: 100, giverRetention: 100 },
  { week: "W2", runnerRetention: 72, giverRetention: 79 },
  { week: "W3", runnerRetention: 61, giverRetention: 70 },
  { week: "W4", runnerRetention: 56, giverRetention: 66 },
  { week: "W5", runnerRetention: 52, giverRetention: 63 },
  { week: "W6", runnerRetention: 49, giverRetention: 60 },
];

export const analysisInsightCards: AnalysisInsightCard[] = [
  {
    title: "Naikkan radius +1km untuk slot kelompok",
    detail: "Segmen Ber-Kelompok memiliki fill-rate 14% lebih baik saat radius dinaikkan ke >=2km.",
    confidence: "87%",
    impact: "High",
  },
  {
    title: "Skill Teknologi demand tinggi di jam 18-21",
    detail: "Demand > supply pada slot malam, potensi GMV naik jika suplai ditambah.",
    confidence: "81%",
    impact: "Medium",
  },
  {
    title: "Prioritaskan giver verified untuk menekan dispute",
    detail: "Dispute ratio verified giver lebih rendah 3.8 poin dibanding unverified.",
    confidence: "92%",
    impact: "High",
  },
  {
    title: "Pending confirmation >30m perlu auto-reminder",
    detail: "Kasus aging 30-60m mendominasi bottleneck release escrow harian.",
    confidence: "76%",
    impact: "Medium",
  },
];
