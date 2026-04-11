export type LeaderboardScope = "Lokal" | "Regional" | "Nasional";
export type LeaderboardPeriod = "Weekly" | "Monthly" | "All-Time";

export type LeaderboardSummaryMetric = {
  label: string;
  value: string;
  hint: string;
  tone: string;
};

export type LeaderboardInsightCard = {
  id: string;
  title: string;
  value: string;
  note: string;
  tone: string;
};

export type LeaderboardPublicFeedItem = {
  id: string;
  time: string;
  title: string;
  note: string;
  tag: string;
};

export type LeaderboardTableRow = {
  id: string;
  rank: number;
  name: string;
  city: string;
  primarySkill: string;
  level: "Q1" | "Q2" | "Q3";
  ppTotal: string;
  completionRate: string;
  disputeRatio: string;
  trend: number;
};

export type LeaderboardScopeGroup = {
  scope: LeaderboardScope;
  rows: LeaderboardTableRow[];
};

export type LeaderboardRunnerSkill = {
  skill: string;
  level: "Q1" | "Q2" | "Q3";
  pp: string;
  share: number;
};

export type LeaderboardRunnerProfile = {
  id: string;
  name: string;
  handle: string;
  location: string;
  joinedAt: string;
  headline: string;
  badges: string[];
  reliability: {
    onTimeRate: string;
    cancelRate: string;
    avgRating: string;
    responseSpeed: string;
  };
  skills: LeaderboardRunnerSkill[];
  percentile?: string;
  nextRankGap?: string;
  momentum?: string;
  milestones?: Array<{
    label: string;
    value: string;
    note: string;
  }>;
  recentActivities?: Array<{
    id: string;
    tag: string;
    title: string;
    note: string;
    time: string;
  }>;
};

export type LeaderboardRankHistoryPoint = {
  period: string;
  Lokal: number;
  Regional: number;
  Nasional: number;
};

export type LeaderboardRunnerRankHistory = {
  runnerId: string;
  points: LeaderboardRankHistoryPoint[];
};

export {
  leaderboardGroups,
  leaderboardInsightByPeriod,
  leaderboardPeriods,
  leaderboardPublicFeed,
  leaderboardRankHistories,
  leaderboardScopes,
  leaderboardSummaryMetricMap,
  leaderboardSummaryMetrics,
  leaderboardTopProfiles,
} from "./leaderboard.service";
