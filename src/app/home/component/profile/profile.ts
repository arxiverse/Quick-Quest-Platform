import type { HomeProfile } from "../../home";

export type ProfileProps = {
  profile: HomeProfile;
  compact?: boolean;
  className?: string;
  showMeta?: boolean;
};

export type ProfileStatItem = {
  label: string;
  value: string;
  toneClass: string;
  iconKey: "quest" | "pp" | "rank" | "nation" | "accuracy" | "level";
};

export type ProfileQuestItem = {
  title: string;
  owner: string;
  role: string;
  category: string;
  points: string;
  reward: string;
  score: string;
};
