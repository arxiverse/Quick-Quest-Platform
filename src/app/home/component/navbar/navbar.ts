import type { HomeNavItem, HomeView } from "../../home";

export type NavbarProps = {
  items: HomeNavItem[];
  mobileItems: HomeNavItem[];
  actions: HomeNavItem[];
  activeView: HomeView;
  onViewChange: (view: HomeView) => void;
};

