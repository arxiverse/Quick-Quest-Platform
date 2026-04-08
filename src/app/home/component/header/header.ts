import type { HomeProfile, HomeViewMeta } from "../../home";

export type HeaderProps = {
  meta: HomeViewMeta;
  profile: HomeProfile;
  onProfileOpen?: () => void;
};
