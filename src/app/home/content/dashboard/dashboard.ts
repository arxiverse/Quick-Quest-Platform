import {
  DASHBOARD_FILTER_STORAGE_KEY_SEED,
  DASHBOARD_SUBVIEW_STORAGE_KEY_SEED,
  dashboardRoleDataSeed,
  dashboardActivityItems,
  dashboardCarouselItems,
  dashboardEscrowFlowSeed,
  dashboardGeoScopeItems,
  dashboardImpactCounterItems,
  dashboardKpiItems,
  dashboardLeaderboardGroups,
  dashboardLeaderboardScopesSeed,
  dashboardQuickFilterMenus,
  dashboardSnapshotItems,
  dashboardStatusHelpItems,
  dashboardViewCopySeed,
  liveQuestItems,
  type DashboardViewCopy,
} from "./dashboard.service";
import type { RoleMode } from "../../role.util";

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
  escrowState:
    | "UNPAID"
    | "LOCKED"
    | "IN_PROGRESS"
    | "PENDING_CONFIRMATION"
    | "RELEASED"
    | "DISPUTED";
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

export type DashboardKpiItem = {
  label: string;
  value: string;
  hint: string;
  tone: string;
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

export type DashboardLiveFilterState = Record<DashboardFilterKey, string>;

export type DashboardSubView =
  | { view: "QuestDetail"; payload: { id: string } }
  | { view: "RunnerImpactDetail" }
  | { view: "GiverBroadcastImpact" }
  | { view: "RunnerSnapshootDetail" }
  | { view: "GiverSnapshootDetail" }
  | { view: "RunnerMetricsDetail" }
  | { view: "GiverMetricsDetail" }
  | { view: "RunnerActiveQuestDetail" }
  | { view: "RunnerOnlineRunnerDetail" }
  | { view: "RunnerAvgResponseDetail" }
  | { view: "RunnerOpenIssueDetail" }
  | { view: "GiverBroadcastQuestDetail" }
  | { view: "GiverFillRateDetail" }
  | { view: "GiverMatchAvgDetail" }
  | { view: "GiverEscrowLockedDetail" }
  | { view: "RunnerRecentActivity" }
  | { view: "RunnerStateDetail" }
  | { view: "GiverActivityDetail" }
  | { view: "GiverStateDetail" }
  | { view: "RunnerMapsLiveDetail" }
  | { view: "GiverMapsLiveDetail" };

export type DashboardViewText = DashboardViewCopy;
export type DashboardRoleContext = RoleMode;
export type DashboardRoleData = (typeof dashboardRoleDataSeed)["runner"];

export const dashboardFilterStorageKey = DASHBOARD_FILTER_STORAGE_KEY_SEED;
export const dashboardSubViewStorageKey = DASHBOARD_SUBVIEW_STORAGE_KEY_SEED;
export const dashboardEscrowFlow: DashboardQuestItem["escrowState"][] = [
  ...dashboardEscrowFlowSeed,
];
export const dashboardLeaderboardScopes: DashboardLeaderboardScope[] = [
  ...dashboardLeaderboardScopesSeed,
];
export const dashboardViewText: DashboardViewText = dashboardViewCopySeed;

export function resolveDashboardRoleContext(role: RoleMode, isGiverVerified: boolean): DashboardRoleContext {
  if (!isGiverVerified) {
    return "runner";
  }
  return role === "giver" ? "giver" : "runner";
}

export function resolveDashboardRoleData(roleContext: DashboardRoleContext): DashboardRoleData {
  return dashboardRoleDataSeed[roleContext] ?? dashboardRoleDataSeed.runner;
}

export function resolveDashboardViewText(roleContext: DashboardRoleContext): DashboardViewText {
  return resolveDashboardRoleData(roleContext).viewCopy;
}

export function createDefaultLiveFilters(
  menus: DashboardQuickFilterMenu[],
): DashboardLiveFilterState {
  return menus.reduce(
    (accumulator, menu) => ({
      ...accumulator,
      [menu.key]: menu.options[0]?.value ?? "ALL",
    }),
    {} as DashboardLiveFilterState,
  );
}

export function resolveInitialLiveFilters(
  menus: DashboardQuickFilterMenu[],
): DashboardLiveFilterState {
  const defaults = createDefaultLiveFilters(menus);
  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const raw = window.localStorage.getItem(dashboardFilterStorageKey);
    if (!raw) {
      return defaults;
    }

    const parsed = JSON.parse(raw) as Partial<DashboardLiveFilterState>;
    const normalized = { ...defaults };

    for (const menu of menus) {
      const candidate = parsed[menu.key];
      const isValid = menu.options.some((option) => option.value === candidate);
      if (typeof candidate === "string" && isValid) {
        normalized[menu.key] = candidate;
      }
    }

    return normalized;
  } catch {
    return defaults;
  }
}

export function syncDashboardLiveFiltersStorage(
  liveFilters: DashboardLiveFilterState,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    dashboardFilterStorageKey,
    JSON.stringify(liveFilters),
  );
}

export function resolveInitialDashboardSubView(): DashboardSubView | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(dashboardSubViewStorageKey);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as DashboardSubView;
  } catch {
    return null;
  }
}

export function syncDashboardSubViewStorage(subView: DashboardSubView | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (subView) {
    window.localStorage.setItem(dashboardSubViewStorageKey, JSON.stringify(subView));
  } else {
    window.localStorage.removeItem(dashboardSubViewStorageKey);
  }
}

export function resolveDashboardQuestStatusClass(
  status: DashboardQuestItem["status"],
): string {
  if (status === "LIVE") {
    return "bg-[#FEE2E2] text-[#B91C1C]";
  }
  if (status === "MATCH") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  return "bg-[#DCFCE7] text-[#166534]";
}

export function resolveDashboardSkillMatchTone(score: number): string {
  if (score >= 90) {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  if (score >= 80) {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  return "bg-[#FEF3C7] text-[#92400E]";
}

export function filterDashboardQuestItems(
  quests: DashboardQuestItem[],
  liveFilters: DashboardLiveFilterState,
): DashboardQuestItem[] {
  return quests.filter((quest) => {
    if (liveFilters.status !== "ALL" && quest.status !== liveFilters.status) {
      return false;
    }
    if (liveFilters.radius === "LT_2" && quest.distanceKm >= 2) {
      return false;
    }
    if (liveFilters.radius === "GTE_2" && quest.distanceKm < 2) {
      return false;
    }
    if (liveFilters.upah !== "ALL" && quest.wageBand !== liveFilters.upah) {
      return false;
    }
    if (liveFilters.skill !== "ALL" && quest.skill !== liveFilters.skill) {
      return false;
    }
    if (liveFilters.mode !== "ALL" && quest.mode !== liveFilters.mode) {
      return false;
    }
    return true;
  });
}

export function resolveActiveDashboardLeaderboardGroup(
  groups: DashboardLeaderboardGroup[],
  scope: DashboardLeaderboardScope,
): DashboardLeaderboardGroup {
  const matched = groups.find((group) => group.scope === scope);
  if (matched) {
    return matched;
  }

  const firstGroup = groups[0];
  if (firstGroup) {
    return firstGroup;
  }

  return {
    scope,
    items: [],
  };
}

export function resolveActiveDashboardGeoScope(
  geoScopes: DashboardGeoScopeItem[],
  radiusFilter: DashboardLiveFilterState["radius"],
): DashboardGeoScopeItem {
  const matched = geoScopes.find((item) => item.radiusValue === radiusFilter);
  if (matched) {
    return matched;
  }

  const firstScope = geoScopes[0];
  if (firstScope) {
    return firstScope;
  }

  return {
    radiusValue: "ALL",
    radiusLabel: "Semua Radius",
    estimatedRunners: "0 runner",
    activeRunners: "0 online",
    avgEta: "ETA -",
    hotZones: [],
  };
}

export function rotateDashboardFilterState(
  previous: DashboardLiveFilterState,
  key: DashboardFilterKey,
  menus: DashboardQuickFilterMenu[],
): DashboardLiveFilterState {
  const menu = menus.find((entry) => entry.key === key);
  if (!menu) {
    return previous;
  }

  const currentIndex = menu.options.findIndex(
    (option) => option.value === previous[key],
  );
  const nextIndex =
    currentIndex === -1 ? 0 : (currentIndex + 1) % menu.options.length;

  return {
    ...previous,
    [key]: menu.options[nextIndex].value,
  };
}

export function normalizeDashboardLiveFilters(
  previous: DashboardLiveFilterState,
  menus: DashboardQuickFilterMenu[],
): DashboardLiveFilterState {
  const defaults = createDefaultLiveFilters(menus);
  const normalized = { ...defaults };

  for (const menu of menus) {
    const candidate = previous[menu.key];
    const isValid = menu.options.some((option) => option.value === candidate);
    if (isValid) {
      normalized[menu.key] = candidate;
    }
  }

  return normalized;
}

export function resetDashboardLowVolumeFilters(
  previous: DashboardLiveFilterState,
): DashboardLiveFilterState {
  return {
    ...previous,
    radius: "ALL",
    skill: "ALL",
    mode: "ALL",
  };
}

export {
  dashboardActivityItems,
  dashboardCarouselItems,
  dashboardGeoScopeItems,
  dashboardImpactCounterItems,
  dashboardKpiItems,
  dashboardLeaderboardGroups,
  dashboardQuickFilterMenus,
  dashboardSnapshotItems,
  dashboardStatusHelpItems,
  liveQuestItems,
};
