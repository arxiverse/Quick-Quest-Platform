import type {
  AnalysisCohortPoint,
  AnalysisCompareCard,
  AnalysisEscrowStatePoint,
  AnalysisFunnelPoint,
  AnalysisGeoScopeKey,
  AnalysisGeoScopeSnapshot,
  AnalysisInsightCard,
  AnalysisKpiItem,
  AnalysisLeaderboardScope,
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
  AnalysisTargetImpianSeed,
  AnalysisTopContributor,
} from "./analysis";

export const analysisLeaderboardScopesSeed: AnalysisLeaderboardScope[] = [
  "Lokal",
  "Provinsi",
  "Nasional",
];

export const analysisDefaultStateSeed = {
  timeRange: "7D" as AnalysisTimeRange,
  geoScope: "ALL" as AnalysisGeoScopeKey,
  granularity: "Jam" as AnalysisSupplyGranularity,
  leaderboardScope: "Lokal" as AnalysisLeaderboardScope,
};

export type AnalysisViewCopy = {
  hero: {
    eyebrow: string;
    title: string;
  };
  general: {
    simulationBadge: string;
  };
  compare: {
    eyebrow: string;
    title: string;
    activeRangeSuffix: string;
  };
  targetImpian: {
    eyebrow: string;
    title: string;
    realityBadge: string;
    itemNameLabel: string;
    itemNamePlaceholder: string;
    itemPriceLabel: string;
    currentSavedLabel: string;
    realityPrefix: string;
    realitySuffix: string;
    questNeededSuffix: string;
    wageAssumption: string;
    progressPrefix: string;
    remainingPrefix: string;
  };
  funnel: {
    eyebrow: string;
    title: string;
    conversionPrefix: string;
  };
  geo: {
    eyebrow: string;
    title: string;
    radiusActiveLabel: string;
    candidateLabel: string;
    avgEtaLabel: string;
    heatAreaLabel: string;
    activeRunnerPrefix: string;
  };
  supplyDemand: {
    eyebrow: string;
    titlePrefix: string;
    byHourLabel: string;
    byDayLabel: string;
    busiestLabel: string;
    quietestLabel: string;
  };
  sla: {
    eyebrow: string;
    title: string;
    medianLegend: string;
    targetLegend: string;
    outlierToneClass: string;
  };
  escrow: {
    eyebrow: string;
    title: string;
    pendingAgingLegend: string;
  };
  risk: {
    eyebrow: string;
    title: string;
    disputeRatioPrefix: string;
  };
  ppIntelligence: {
    eyebrow: string;
    title: string;
    growthPrefix: string;
    decayPrefix: string;
  };
  leaderboard: {
    eyebrow: string;
    title: string;
    movementUpPrefix: string;
    movementDownPrefix: string;
    movementSteadyLabel: string;
    rankFromToPrefix: string;
    rankFromToSeparator: string;
    ppSuffix: string;
    upToneClass: string;
    downToneClass: string;
    steadyToneClass: string;
  };
  cohort: {
    eyebrow: string;
    title: string;
    runnerRetentionLegend: string;
    giverRetentionLegend: string;
  };
  insight: {
    eyebrow: string;
    title: string;
    confidencePrefix: string;
  };
};

export const analysisViewCopySeed: AnalysisViewCopy = {
  hero: {
    eyebrow: "Analisis QQM",
    title: "Command Center - Metrics, Funnel, Supply",
  },
  general: {
    simulationBadge: "Dummy data simulation",
  },
  compare: {
    eyebrow: "Time Range + Compare",
    title: "Perbandingan dengan Periode Sebelumnya",
    activeRangeSuffix: "aktif",
  },
  targetImpian: {
    eyebrow: "Target & Realita (Anti-HEDON)",
    title: "Kalkulator Target Impian",
    realityBadge: "Reality Slap",
    itemNameLabel: "Nama Barang Impian",
    itemNamePlaceholder: "Contoh: Tiket Konser Coldplay",
    itemPriceLabel: "Harga Barang (Rp)",
    currentSavedLabel: "Uang Tabungan (Rp)",
    realityPrefix: "Untuk dapetin",
    realitySuffix: "Realitanya kerjain",
    questNeededSuffix: "Quest lagi!",
    wageAssumption: "*Asumsi rata-rata upah Quest Rp75.000 / kontrak",
    progressPrefix: "Progress",
    remainingPrefix: "Sisa Rp",
  },
  funnel: {
    eyebrow: "Quest Funnel",
    title: "Posted to Match to In Progress to Released/Disputed",
    conversionPrefix: "conv",
  },
  geo: {
    eyebrow: "Geo Scope Analytics",
    title: "Radius, Kandidat Runner, Heat Area",
    radiusActiveLabel: "Radius Aktif",
    candidateLabel: "Kandidat Runner",
    avgEtaLabel: "Avg ETA",
    heatAreaLabel: "Heat Area",
    activeRunnerPrefix: "Runner aktif saat ini:",
  },
  supplyDemand: {
    eyebrow: "Supply vs Demand",
    titlePrefix: "Per",
    byHourLabel: "Jam",
    byDayLabel: "Hari",
    busiestLabel: "Jam/Hari Ramai",
    quietestLabel: "Jam/Hari Sepi",
  },
  sla: {
    eyebrow: "SLA & Response",
    title: "Median First Response, Match Time, Outlier",
    medianLegend: "Median (menit)",
    targetLegend: "Target (menit)",
    outlierToneClass: "bg-[#FECACA] text-[#991B1B]",
  },
  escrow: {
    eyebrow: "Escrow Health",
    title: "State Distribution + Pending Aging",
    pendingAgingLegend: "Pending Aging",
  },
  risk: {
    eyebrow: "Risk Panel",
    title: "Dispute Ratio by Skill/Radius/Verification",
    disputeRatioPrefix: "Dispute Ratio:",
  },
  ppIntelligence: {
    eyebrow: "PP Intelligence",
    title: "Growth per Skill + Top Contributor + Decay",
    growthPrefix: "Growth",
    decayPrefix: "Decay impact",
  },
  leaderboard: {
    eyebrow: "Leaderboard Movement",
    title: "Naik/Turun Rank Lokal/Provinsi/Nasional",
    movementUpPrefix: "Naik",
    movementDownPrefix: "Turun",
    movementSteadyLabel: "Tetap",
    rankFromToPrefix: "Rank",
    rankFromToSeparator: "to",
    ppSuffix: "PP",
    upToneClass: "bg-[#DCFCE7] text-[#166534]",
    downToneClass: "bg-[#FECACA] text-[#991B1B]",
    steadyToneClass: "bg-base-200 text-base-content/70",
  },
  cohort: {
    eyebrow: "Cohort Retention",
    title: "Retention Runner/Giver (Dummy)",
    runnerRetentionLegend: "Runner Retention",
    giverRetentionLegend: "Giver Retention",
  },
  insight: {
    eyebrow: "Insight Cards",
    title: "Insight Otomatis untuk Optimasi Operasional",
    confidencePrefix: "Confidence",
  },
};

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

export const analysisTargetImpianSeed: AnalysisTargetImpianSeed = {
  itemName: "Iphone 15 Pro Max",
  itemPrice: 18000000,
  currentSaved: 2500000,
  averageQuestWage: 75000,
};

export const analysisGiverViewCopySeed: AnalysisViewCopy = {
  ...analysisViewCopySeed,
  hero: {
    eyebrow: "Analisis Giver",
    title: "Broadcast Intelligence - Fill Rate, Escrow, Risiko Operasional",
  },
  compare: {
    ...analysisViewCopySeed.compare,
    title: "Perbandingan Broadcast terhadap Periode Sebelumnya",
  },
  funnel: {
    ...analysisViewCopySeed.funnel,
    title: "Broadcasted to Match to In Progress to Released/Disputed",
  },
  geo: {
    ...analysisViewCopySeed.geo,
    title: "Radius Broadcast, Kandidat Runner, Heat Area",
    candidateLabel: "Runner Terjangkau",
    activeRunnerPrefix: "Runner aktif di scope ini:",
  },
  supplyDemand: {
    ...analysisViewCopySeed.supplyDemand,
    titlePrefix: "Demand Giver vs Supply Runner per",
  },
  sla: {
    ...analysisViewCopySeed.sla,
    title: "Median Approval, Match Time, dan Outlier Operasional",
  },
  escrow: {
    ...analysisViewCopySeed.escrow,
    title: "Escrow Pipeline + Pending Aging",
  },
  risk: {
    ...analysisViewCopySeed.risk,
    title: "Risk by Skill/Radius/Verification (Perspective Giver)",
  },
  ppIntelligence: {
    ...analysisViewCopySeed.ppIntelligence,
    title: "Growth Skill Runner + Kandidat Stabil + Decay",
  },
  cohort: {
    ...analysisViewCopySeed.cohort,
    title: "Retention Runner/Giver (Mode Giver)",
  },
  insight: {
    ...analysisViewCopySeed.insight,
    title: "Insight Otomatis untuk Optimasi Broadcast",
  },
};

export const analysisGiverDefaultStateSeed = {
  timeRange: "7D" as AnalysisTimeRange,
  geoScope: "ALL" as AnalysisGeoScopeKey,
  granularity: "Hari" as AnalysisSupplyGranularity,
  leaderboardScope: "Lokal" as AnalysisLeaderboardScope,
};

export const analysisGiverKpiItemsSeed: AnalysisKpiItem[] = [
  { label: "Broadcast", value: "312", delta: "+13.1%", tone: "bg-[#DCFCE7]" },
  { label: "Fill Rate", value: "81.2%", delta: "+4.7%", tone: "bg-[#DBEAFE]" },
  { label: "Avg Match", value: "10m", delta: "-2m", tone: "bg-[#E9D5FF]" },
  { label: "Escrow Locked", value: "Rp 9.4jt", delta: "+10.8%", tone: "bg-[#FEF3C7]" },
  { label: "Dispute", value: "1.8%", delta: "-0.6%", tone: "bg-[#FECACA]" },
  { label: "Escrow Released", value: "Rp 21.3jt", delta: "+12.2%", tone: "bg-[#BFDBFE]" },
];

export const analysisGiverCompareByRangeSeed: Record<AnalysisTimeRange, AnalysisCompareCard[]> = {
  Today: [
    { label: "vs kemarin (Broadcast)", value: "48", delta: "+9%", tone: "bg-[#DBEAFE]" },
    { label: "vs kemarin (Match)", value: "37", delta: "+6%", tone: "bg-[#DCFCE7]" },
    { label: "vs kemarin (Released)", value: "29", delta: "+4%", tone: "bg-[#E9D5FF]" },
  ],
  "7D": [
    { label: "vs 7D sebelumnya (Broadcast)", value: "312", delta: "+13%", tone: "bg-[#DBEAFE]" },
    { label: "vs 7D sebelumnya (Match)", value: "254", delta: "+10%", tone: "bg-[#DCFCE7]" },
    { label: "vs 7D sebelumnya (Released)", value: "223", delta: "+8%", tone: "bg-[#E9D5FF]" },
  ],
  "30D": [
    { label: "vs 30D sebelumnya (Broadcast)", value: "1,248", delta: "+16%", tone: "bg-[#DBEAFE]" },
    { label: "vs 30D sebelumnya (Match)", value: "1,014", delta: "+12%", tone: "bg-[#DCFCE7]" },
    { label: "vs 30D sebelumnya (Released)", value: "892", delta: "+9%", tone: "bg-[#E9D5FF]" },
  ],
};

export const analysisGiverFunnelByRangeSeed: Record<AnalysisTimeRange, AnalysisFunnelPoint[]> = {
  Today: [
    { stage: "Posted", value: 48 },
    { stage: "Match", value: 37 },
    { stage: "In Progress", value: 31 },
    { stage: "Released", value: 29 },
    { stage: "Disputed", value: 2 },
  ],
  "7D": [
    { stage: "Posted", value: 312 },
    { stage: "Match", value: 254 },
    { stage: "In Progress", value: 233 },
    { stage: "Released", value: 223 },
    { stage: "Disputed", value: 11 },
  ],
  "30D": [
    { stage: "Posted", value: 1248 },
    { stage: "Match", value: 1014 },
    { stage: "In Progress", value: 936 },
    { stage: "Released", value: 892 },
    { stage: "Disputed", value: 45 },
  ],
};

export const analysisGiverGeoScopeSnapshotsSeed: Record<AnalysisGeoScopeKey, AnalysisGeoScopeSnapshot> = {
  ALL: {
    radiusLabel: "Semua Radius",
    estimatedCandidates: "63 runner",
    activeRunners: "39 online",
    avgEta: "14m",
    heatAreas: ["Pasar Minggu", "Cilandak", "Kuningan"],
  },
  LT_2: {
    radiusLabel: "< 2 km",
    estimatedCandidates: "24 runner",
    activeRunners: "18 online",
    avgEta: "8m",
    heatAreas: ["Kemang", "Fatmawati", "Cipete"],
  },
  GTE_2: {
    radiusLabel: ">= 2 km",
    estimatedCandidates: "39 runner",
    activeRunners: "21 online",
    avgEta: "18m",
    heatAreas: ["Tebet", "Pancoran", "Kuningan"],
  },
};

export const analysisGiverSupplyDemandByGranularitySeed: Record<AnalysisSupplyGranularity, AnalysisSupplyDemandPoint[]> = {
  Jam: [
    { slot: "06", supply: 14, demand: 22 },
    { slot: "09", supply: 31, demand: 39 },
    { slot: "12", supply: 44, demand: 53 },
    { slot: "15", supply: 37, demand: 47 },
    { slot: "18", supply: 35, demand: 45 },
    { slot: "21", supply: 19, demand: 27 },
  ],
  Hari: [
    { slot: "Sen", supply: 172, demand: 204 },
    { slot: "Sel", supply: 181, demand: 219 },
    { slot: "Rab", supply: 176, demand: 213 },
    { slot: "Kam", supply: 188, demand: 232 },
    { slot: "Jum", supply: 196, demand: 244 },
    { slot: "Sab", supply: 181, demand: 223 },
    { slot: "Min", supply: 163, demand: 197 },
  ],
};

export const analysisGiverSlaMetricsSeed: AnalysisSlaMetric[] = [
  { label: "Median First Response", value: "3m 50s", hint: "target <= 5m", tone: "bg-[#DCFCE7]" },
  { label: "Median Match Time", value: "10m", hint: "target <= 15m", tone: "bg-[#DBEAFE]" },
  { label: "P90 Completion", value: "2j 02m", hint: "target <= 3j", tone: "bg-[#E9D5FF]" },
  { label: "Outlier Cases", value: "5", hint: "butuh review cepat", tone: "bg-[#FECACA]" },
];

export const analysisGiverSlaResponsePointsSeed: AnalysisSlaResponsePoint[] = [
  { step: "First Response", median: 3.8, target: 5 },
  { step: "Match Confirm", median: 9.9, target: 15 },
  { step: "Start Work", median: 17.2, target: 25 },
  { step: "Release Escrow", median: 34.1, target: 45 },
];

export const analysisGiverSlaOutliersSeed: AnalysisSlaOutlier[] = [
  { quest: "Pickup Stok Gudang", delay: "43m", reason: "Slot kelompok belum penuh" },
  { quest: "Survey Display UMKM", delay: "37m", reason: "Brief sempat direvisi" },
  { quest: "Audit Booth Event", delay: "31m", reason: "Konfirmasi tahap akhir tertunda" },
];

export const analysisGiverEscrowStatePointsSeed: AnalysisEscrowStatePoint[] = [
  { state: "UNPAID", total: 18 },
  { state: "LOCKED", total: 62 },
  { state: "IN_PROGRESS", total: 44 },
  { state: "PENDING_CONFIRMATION", total: 23 },
  { state: "RELEASED", total: 168 },
  { state: "DISPUTED", total: 6 },
];

export const analysisGiverPendingAgingPointsSeed: AnalysisPendingAgingPoint[] = [
  { bucket: "< 10m", total: 11 },
  { bucket: "10-30m", total: 7 },
  { bucket: "30-60m", total: 3 },
  { bucket: "> 60m", total: 1 },
];

export const analysisGiverRiskPointsSeed: AnalysisRiskPoint[] = [
  { dimension: "Skill", segment: "Delivery", disputeRate: 3.6, severity: "High" },
  { dimension: "Skill", segment: "Retail", disputeRate: 2.2, severity: "Medium" },
  { dimension: "Radius", segment: ">= 2 km", disputeRate: 2.9, severity: "Medium" },
  { dimension: "Radius", segment: "< 2 km", disputeRate: 1.4, severity: "Low" },
  { dimension: "Verification", segment: "Unverified Giver", disputeRate: 4.4, severity: "High" },
  { dimension: "Verification", segment: "Verified Giver", disputeRate: 1.1, severity: "Low" },
];

export const analysisGiverPpGrowthPointsSeed: AnalysisPpGrowthPoint[] = [
  { skill: "Retail", pp: 2380, growth: 9.4, decayImpact: 1.1 },
  { skill: "Delivery", pp: 2050, growth: 7.9, decayImpact: 1.5 },
  { skill: "Cleaning", pp: 1625, growth: 5.8, decayImpact: 1.8 },
  { skill: "Teknologi", pp: 910, growth: 8.7, decayImpact: 2.9 },
];

export const analysisGiverTopContributorsSeed: AnalysisTopContributor[] = [
  { name: "Aghnia", skill: "Retail", ppGain: "+141", note: "Brief quality tinggi" },
  { name: "Naufal", skill: "Delivery", ppGain: "+117", note: "Fill group stabil" },
  { name: "Miska", skill: "Cleaning", ppGain: "+94", note: "Rilis escrow cepat" },
];

export const analysisGiverLeaderboardMovementGroupsSeed: AnalysisLeaderboardMovementGroup[] = [
  {
    scope: "Lokal",
    items: [
      { name: "Aghnia", previousRank: 2, currentRank: 1, pp: "7,014" },
      { name: "Naufal", previousRank: 1, currentRank: 2, pp: "6,802" },
      { name: "Miska", previousRank: 4, currentRank: 3, pp: "6,410" },
    ],
  },
  {
    scope: "Provinsi",
    items: [
      { name: "Rizki", previousRank: 1, currentRank: 1, pp: "9,112" },
      { name: "Aghnia", previousRank: 3, currentRank: 2, pp: "7,014" },
      { name: "Naufal", previousRank: 2, currentRank: 3, pp: "6,802" },
    ],
  },
  {
    scope: "Nasional",
    items: [
      { name: "Salsabila", previousRank: 1, currentRank: 1, pp: "12,804" },
      { name: "Rizki", previousRank: 3, currentRank: 2, pp: "9,112" },
      { name: "Aghnia", previousRank: 5, currentRank: 3, pp: "7,014" },
    ],
  },
];

export const analysisGiverCohortRetentionPointsSeed: AnalysisCohortPoint[] = [
  { week: "W1", runnerRetention: 100, giverRetention: 100 },
  { week: "W2", runnerRetention: 75, giverRetention: 82 },
  { week: "W3", runnerRetention: 66, giverRetention: 74 },
  { week: "W4", runnerRetention: 59, giverRetention: 69 },
  { week: "W5", runnerRetention: 55, giverRetention: 66 },
  { week: "W6", runnerRetention: 51, giverRetention: 62 },
];

export const analysisGiverInsightCardsSeed: AnalysisInsightCard[] = [
  {
    title: "Slot grup 3+ runner paling optimal di radius >=2km",
    detail: "Broadcast kelompok naik conversion 15% saat radius awal dibuka lebih luas.",
    confidence: "89%",
    impact: "High",
  },
  {
    title: "Jam 12-18 paling ideal untuk quest retail",
    detail: "Demand tinggi dengan respon cepat membuat fill time turun signifikan.",
    confidence: "84%",
    impact: "Medium",
  },
  {
    title: "Template brief wajib menurunkan dispute ratio",
    detail: "Dispute turun 1.6 poin pada quest dengan acceptance criteria terukur.",
    confidence: "91%",
    impact: "High",
  },
  {
    title: "Pending confirmation >30m perlu auto-reminder",
    detail: "Bottleneck terbesar tetap di approval tahap akhir sebelum release escrow.",
    confidence: "79%",
    impact: "Medium",
  },
];

export const analysisGiverTargetImpianSeed: AnalysisTargetImpianSeed = {
  itemName: "MacBook Pro M4",
  itemPrice: 28000000,
  currentSaved: 4200000,
  averageQuestWage: 110000,
};

export type AnalysisRoleDataSeed = {
  defaultState: typeof analysisDefaultStateSeed;
  viewCopy: AnalysisViewCopy;
  leaderboardScopes: AnalysisLeaderboardScope[];
  timeRangeOptions: AnalysisTimeRange[];
  geoScopeOptions: AnalysisGeoScopeKey[];
  supplyGranularityOptions: AnalysisSupplyGranularity[];
  kpiItems: AnalysisKpiItem[];
  compareByRange: Record<AnalysisTimeRange, AnalysisCompareCard[]>;
  funnelByRange: Record<AnalysisTimeRange, AnalysisFunnelPoint[]>;
  geoScopeSnapshots: Record<AnalysisGeoScopeKey, AnalysisGeoScopeSnapshot>;
  supplyDemandByGranularity: Record<AnalysisSupplyGranularity, AnalysisSupplyDemandPoint[]>;
  slaMetrics: AnalysisSlaMetric[];
  slaResponsePoints: AnalysisSlaResponsePoint[];
  slaOutliers: AnalysisSlaOutlier[];
  escrowStatePoints: AnalysisEscrowStatePoint[];
  pendingAgingPoints: AnalysisPendingAgingPoint[];
  riskPoints: AnalysisRiskPoint[];
  ppGrowthPoints: AnalysisPpGrowthPoint[];
  topContributors: AnalysisTopContributor[];
  leaderboardMovementGroups: AnalysisLeaderboardMovementGroup[];
  cohortRetentionPoints: AnalysisCohortPoint[];
  insightCards: AnalysisInsightCard[];
  targetImpianSeed: AnalysisTargetImpianSeed;
};

export const analysisRoleDataSeed: Record<"runner" | "giver", AnalysisRoleDataSeed> = {
  runner: {
    defaultState: analysisDefaultStateSeed,
    viewCopy: analysisViewCopySeed,
    leaderboardScopes: analysisLeaderboardScopesSeed,
    timeRangeOptions: analysisTimeRangeOptions,
    geoScopeOptions: analysisGeoScopeOptions,
    supplyGranularityOptions: analysisSupplyGranularityOptions,
    kpiItems: analysisKpiItems,
    compareByRange: analysisCompareByRange,
    funnelByRange: analysisFunnelByRange,
    geoScopeSnapshots: analysisGeoScopeSnapshots,
    supplyDemandByGranularity: analysisSupplyDemandByGranularity,
    slaMetrics: analysisSlaMetrics,
    slaResponsePoints: analysisSlaResponsePoints,
    slaOutliers: analysisSlaOutliers,
    escrowStatePoints: analysisEscrowStatePoints,
    pendingAgingPoints: analysisPendingAgingPoints,
    riskPoints: analysisRiskPoints,
    ppGrowthPoints: analysisPpGrowthPoints,
    topContributors: analysisTopContributors,
    leaderboardMovementGroups: analysisLeaderboardMovementGroups,
    cohortRetentionPoints: analysisCohortRetentionPoints,
    insightCards: analysisInsightCards,
    targetImpianSeed: analysisTargetImpianSeed,
  },
  giver: {
    defaultState: analysisGiverDefaultStateSeed,
    viewCopy: analysisGiverViewCopySeed,
    leaderboardScopes: analysisLeaderboardScopesSeed,
    timeRangeOptions: analysisTimeRangeOptions,
    geoScopeOptions: analysisGeoScopeOptions,
    supplyGranularityOptions: analysisSupplyGranularityOptions,
    kpiItems: analysisGiverKpiItemsSeed,
    compareByRange: analysisGiverCompareByRangeSeed,
    funnelByRange: analysisGiverFunnelByRangeSeed,
    geoScopeSnapshots: analysisGiverGeoScopeSnapshotsSeed,
    supplyDemandByGranularity: analysisGiverSupplyDemandByGranularitySeed,
    slaMetrics: analysisGiverSlaMetricsSeed,
    slaResponsePoints: analysisGiverSlaResponsePointsSeed,
    slaOutliers: analysisGiverSlaOutliersSeed,
    escrowStatePoints: analysisGiverEscrowStatePointsSeed,
    pendingAgingPoints: analysisGiverPendingAgingPointsSeed,
    riskPoints: analysisGiverRiskPointsSeed,
    ppGrowthPoints: analysisGiverPpGrowthPointsSeed,
    topContributors: analysisGiverTopContributorsSeed,
    leaderboardMovementGroups: analysisGiverLeaderboardMovementGroupsSeed,
    cohortRetentionPoints: analysisGiverCohortRetentionPointsSeed,
    insightCards: analysisGiverInsightCardsSeed,
    targetImpianSeed: analysisGiverTargetImpianSeed,
  },
};

export const analysisNestedMenuSeed = {
  runner: [
    {
      key: "runner_metrics",
      label: "Metrics",
      description: "Pendalaman metrik runner dari level overview sampai per-metrik.",
    },
    {
      key: "runner_time_range",
      label: "Time Range",
      description: "Perbandingan periodik untuk membaca perubahan performa.",
    },
    {
      key: "runner_funnel",
      label: "Funnel",
      description: "Deteksi bottleneck dari posted sampai released/disputed.",
    },
    {
      key: "runner_scope_analytics",
      label: "Scope",
      description: "Kontrol radius, kandidat, dan area panas.",
    },
    {
      key: "runner_supply_demand",
      label: "Supply-Demand",
      description: "Keseimbangan demand quest vs supply runner.",
    },
    {
      key: "runner_sla_response",
      label: "SLA",
      description: "Kontrol response time dan outlier operasional.",
    },
    {
      key: "runner_escrow_health",
      label: "Escrow",
      description: "Monitoring distribusi state escrow dan aging.",
    },
    {
      key: "runner_risk_panel",
      label: "Risk",
      description: "Pemantauan risiko dispute lintas dimensi.",
    },
    {
      key: "runner_pp_intelligence",
      label: "PP Intel",
      description: "Analisis growth PP per skill dan decay impact.",
    },
    {
      key: "runner_cohort_retention",
      label: "Cohort",
      description: "Retensi cohort untuk kualitas pengalaman jangka panjang.",
    },
    {
      key: "runner_insight_panel",
      label: "Insight",
      description: "Ringkasan insight prioritas untuk aksi cepat.",
    },
  ],
  giver: [
    {
      key: "giver_metrics",
      label: "Metrics",
      description: "Pendalaman metrik giver dari overview sampai per-metrik.",
    },
    {
      key: "giver_time_range",
      label: "Time Range",
      description: "Perbandingan periodik performa broadcast.",
    },
    {
      key: "giver_funnel",
      label: "Funnel",
      description: "Deteksi bottleneck conversion broadcast.",
    },
    {
      key: "giver_scope_analytics",
      label: "Scope",
      description: "Kontrol radius dan coverage kandidat runner.",
    },
    {
      key: "giver_supply_demand",
      label: "Supply-Demand",
      description: "Monitoring demand giver vs supply runner.",
    },
    {
      key: "giver_sla_response",
      label: "SLA",
      description: "Kontrol match/approval time dan outlier.",
    },
    {
      key: "giver_escrow_health",
      label: "Escrow",
      description: "Kesehatan pipeline escrow dan aging.",
    },
    {
      key: "giver_risk_panel",
      label: "Risk",
      description: "Mitigasi risiko dispute dari perspektif giver.",
    },
    {
      key: "giver_pp_intelligence",
      label: "PP Intel",
      description: "Analisis growth skill runner yang berdampak ke giver.",
    },
    {
      key: "giver_cohort_retention",
      label: "Cohort",
      description: "Retensi cohort untuk kestabilan ekosistem.",
    },
    {
      key: "giver_insight_panel",
      label: "Insight",
      description: "Insight operasional prioritas mode giver.",
    },
  ],
} as const;

export const analysisRunnerMetricSubViewSeed = [
  "runner_metric_gmv",
  "runner_metric_match_rate",
  "runner_metric_fill_time",
  "runner_metric_completion",
  "runner_metric_dispute",
  "runner_metric_escrow_released",
] as const;

export const analysisGiverMetricSubViewSeed = [
  "giver_metric_broadcast",
  "giver_metric_fill_rate",
  "giver_metric_avg_match",
  "giver_metric_escrow_locked",
  "giver_metric_dispute",
  "giver_metric_escrow_released",
] as const;
