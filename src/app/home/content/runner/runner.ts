export type RunnerMember = {
  name: string;
  primarySkill: string;
  currentStatus: "Ready" | "On Quest" | "Standby" | "Need Brief";
  location: string;
  reliabilityScore: string;
};

export type RunnerCareerMetric = {
  label: string;
  value: string;
  hint: string;
  tone: string;
};

export type RunnerSkillInventoryItem = {
  skill: string;
  level: "Q1" | "Q2" | "Q3";
  pp: string;
  completionRate: string;
  trend: string;
};

export type RunnerAvailabilitySlot = {
  day: string;
  morning: "Online" | "Limited" | "Offline";
  afternoon: "Online" | "Limited" | "Offline";
  night: "Online" | "Limited" | "Offline";
};

export type RunnerEarningPoint = {
  period: string;
  income: number;
  quests: number;
};

export type RunnerReliabilityBadge = {
  name: string;
  description: string;
  tone: string;
};

export {
  runnerAvailabilitySchedule,
  runnerCareerMetrics,
  runnerEarningTrajectory,
  runnerFocusInsight,
  runnerMembers,
  runnerReliabilityBadges,
  runnerSkillInventory,
} from "./runner.service";
