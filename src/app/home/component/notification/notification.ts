import type { HomeNotification, HomeProfile } from "../../home";

export type NotificationProps = {
  notifications: HomeNotification[];
  profile?: HomeProfile;
  onProfileOpen?: () => void;
  className?: string;
};
