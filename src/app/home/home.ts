export const homeViews = [
  "dashboard",
  "analysis",
  "runner",
  "recent",
  "leaderboard",
  "chat",
  "giver",
  "element",
  "profile",
] as const;

export type HomeView = (typeof homeViews)[number];

export function isHomeView(value: string): value is HomeView {
  return (homeViews as readonly string[]).includes(value);
}

export type HomeIconKey =
  | "home"
  | "analysis"
  | "briefcase"
  | "history"
  | "leaderboard"
  | "chat"
  | "switch"
  | "logout"
  | "user"
  | "element"
  | "search"
  | "filter"
  | "chevronDown"
  | "live"
  | "tag"
  | "arrowUp"
  | "dollar"
  | "star";

export type HomeNavTone = "primary" | "danger" | "neutral";

export type HomeNavItem = {
  key: string;
  label: string;
  iconKey: HomeIconKey;
  view?: HomeView;
  tone?: HomeNavTone;
  to?: string;
  mobileLabel?: string;
};

export type HomeViewMeta = {
  eyebrow: string;
  title: string;
  description: string;
  searchPlaceholder: string;
};

export type HomeProfile = {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  address: string;
};

export type HomeNotification = {
  id: number;
  title: string;
  description: string;
  tag: string;
  time: string;
};

export {
  HOME_ACTIVE_VIEW_STORAGE_KEY,
  desktopNavItems,
  getHomeViewMeta,
  homeActionItems,
  homeNotifications,
  homeProfile,
  initialHomeView,
  mobileNavItems,
  mobileShortcutItems,
} from "./home.service";
