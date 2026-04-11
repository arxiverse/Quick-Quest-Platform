export type DashboardCarouselItem = {
  title: string;
  subtitle: string;
  accent: string;
};

export type DashboardQuestItem = {
  title: string;
  owner: string;
  role: string;
  status: "LIVE" | "MATCH" | "IN_PROGRESS";
  escrowState: "UNPAID" | "LOCKED" | "IN_PROGRESS" | "PENDING_CONFIRMATION" | "RELEASED" | "DISPUTED";
  mode: "Per-Individu" | "Ber-Kelompok";
  skill: "Kebersihan" | "Retail" | "Delivery" | "Teknologi";
  wageBand: "100K-200K" | "200K-350K" | "350K+";
  skillMatchScore: number;
  slotFilled: number;
  slotTotal: number;
  ppDelta: string;
  verifiedGiver: boolean;
  completionRate: string;
  disputeRatio: string;
  distanceKm: number;
  countdown: string;
  slots: string;
  category: string;
  points: string;
  reward: string;
  score: string;
};

export type DashboardFilterKey = "status" | "radius" | "upah" | "skill" | "mode";

export type DashboardQuickFilterOption = {
  value: string;
  label: string;
};

export type DashboardQuickFilterMenu = {
  key: DashboardFilterKey;
  label: string;
  options: DashboardQuickFilterOption[];
};

export type DashboardSnapshotItem = {
  label: string;
  value: string;
  hint: string;
  toneClass: string;
};

export type DashboardActivityItem = {
  title: string;
  detail: string;
  time: string;
  toneClass: string;
};

export type DashboardStatusHelpItem = {
  status: DashboardQuestItem["status"];
  description: string;
};

export type DashboardImpactCounterItem = {
  label: string;
  value: string;
  hint: string;
  toneClass: string;
};

export type DashboardLeaderboardScope = "Lokal" | "Provinsi" | "Nasional";

export type DashboardLeaderboardItem = {
  rank: number;
  name: string;
  pp: string;
  trend: string;
};

export type DashboardLeaderboardGroup = {
  scope: DashboardLeaderboardScope;
  items: DashboardLeaderboardItem[];
};

export type DashboardGeoScopeItem = {
  radiusValue: "ALL" | "LT_2" | "GTE_2";
  radiusLabel: string;
  estimatedRunners: string;
  activeRunners: string;
  avgEta: string;
  hotZones: string[];
};

export {
  dashboardActivityItems,
  dashboardCarouselItems,
  dashboardImpactCounterItems,
  dashboardLeaderboardGroups,
  dashboardGeoScopeItems,
  dashboardQuickFilterMenus,
  dashboardSnapshotItems,
  dashboardStatusHelpItems,
  liveQuestItems,
} from "./dashboard.service";

