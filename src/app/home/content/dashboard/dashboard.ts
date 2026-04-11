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
  distanceKm: number;
  countdown: string;
  slots: string;
  category: string;
  points: string;
  reward: string;
  score: string;
};

export type DashboardQuickFilter = {
  label: string;
  value: string;
  active?: boolean;
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

export { dashboardActivityItems, dashboardCarouselItems, dashboardQuickFilters, dashboardSnapshotItems, liveQuestItems } from "./dashboard.service";

