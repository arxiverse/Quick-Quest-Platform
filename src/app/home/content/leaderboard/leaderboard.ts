import {
  LEADERBOARD_ALL_SKILL_SEED,
  leaderboardGroups,
  leaderboardInsightByPeriod,
  leaderboardPeriods,
  leaderboardPeriodConfigSeed,
  leaderboardProfileQueryKeysSeed,
  leaderboardPublicFeed,
  leaderboardRankHistories,
  leaderboardScopes,
  leaderboardSummaryMetricMap,
  leaderboardSummaryMetrics,
  leaderboardTopProfiles,
  leaderboardViewCopySeed,
  type LeaderboardViewCopy,
} from "./leaderboard.service";

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

export type LeaderboardHistoryChartPoint = {
  period: string;
  Lokal: number;
  Regional: number;
  Nasional: number;
};

export type LeaderboardTooltipRow = {
  color?: string;
  dataKey?: string | number;
  name?: string;
  value?: string | number;
};

export type LeaderboardViewText = LeaderboardViewCopy;

export const leaderboardAllSkill = LEADERBOARD_ALL_SKILL_SEED;
export const leaderboardProfileQueryKeys = [...leaderboardProfileQueryKeysSeed];
export const leaderboardPeriodConfig = leaderboardPeriodConfigSeed;
export const leaderboardViewText: LeaderboardViewText = leaderboardViewCopySeed;

export function resolveLeaderboardLevelTone(
  level: LeaderboardTableRow["level"],
): string {
  if (level === "Q1") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  if (level === "Q2") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  return "bg-[#DCFCE7] text-[#166534]";
}

export function resolveLeaderboardTrendTone(value: number): string {
  if (value > 0) {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  if (value < 0) {
    return "bg-[#FECACA] text-[#991B1B]";
  }
  return "bg-base-200 text-base-content/70";
}

export function resolveLeaderboardTrendLabel(value: number): string {
  if (value > 0) {
    return `Naik ${value}`;
  }
  if (value < 0) {
    return `Turun ${Math.abs(value)}`;
  }
  return "Tetap";
}

export function isLeaderboardScope(value: string | null): value is LeaderboardScope {
  return !!value && leaderboardScopes.some((scope) => scope === value);
}

export function isLeaderboardPeriod(value: string | null): value is LeaderboardPeriod {
  return !!value && leaderboardPeriods.some((period) => period === value);
}

function parseLeaderboardNumber(value: string): number {
  return Number(value.replace(/[^\d]/g, "")) || 0;
}

export function formatLeaderboardNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function buildLeaderboardRowsByPeriod(
  rows: LeaderboardTableRow[],
  period: LeaderboardPeriod,
): LeaderboardTableRow[] {
  const config = leaderboardPeriodConfig[period];

  return rows
    .map((row, index) => ({
      ...row,
      ppTotal: formatLeaderboardNumber(
        Math.round(
          parseLeaderboardNumber(row.ppTotal) * config.pp +
            (rows.length - index) * 12,
        ),
      ),
      trend: row.trend + (period === "Weekly" ? 0 : 1),
    }))
    .sort(
      (left, right) =>
        parseLeaderboardNumber(right.ppTotal) - parseLeaderboardNumber(left.ppTotal),
    )
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

export function buildLeaderboardHistoryByPeriod(
  points: LeaderboardHistoryChartPoint[],
  period: LeaderboardPeriod,
): LeaderboardHistoryChartPoint[] {
  const config = leaderboardPeriodConfig[period];

  return points.map((point, index) => ({
    period: `${config.prefix}${index + 1}`,
    Lokal: point.Lokal + config.shift,
    Regional: point.Regional + config.shift,
    Nasional: point.Nasional + config.shift,
  }));
}

export function resolveLeaderboardRunnerProfile(
  row: LeaderboardTableRow,
): LeaderboardRunnerProfile {
  const found = leaderboardTopProfiles.find((entry) => entry.id === row.id);
  if (found) {
    return found;
  }

  return {
    id: row.id,
    name: row.name,
    handle: `@${row.name.toLowerCase().replaceAll(" ", ".")}`,
    location: row.city,
    joinedAt: "2025-10-01",
    headline: `${row.name} menjaga performa stabil untuk ${row.primarySkill}.`,
    badges: ["Public Profile"],
    reliability: {
      onTimeRate: row.completionRate,
      cancelRate: "1.6%",
      avgRating: "4.80",
      responseSpeed: "5m 30s",
    },
    skills: [
      {
        skill: row.primarySkill,
        level: row.level,
        pp: row.ppTotal,
        share: 100,
      },
    ],
    percentile: "Top 15%",
    nextRankGap: "140 PP ke rank berikutnya",
    momentum: "+90 PP (7D)",
    milestones: [
      { label: "Streak", value: "5 quest", note: "On-time stabil" },
    ],
    recentActivities: [
      {
        id: `${row.id}-1`,
        tag: "Quest",
        title: "Quest selesai",
        note: "Konfirmasi giver diterima",
        time: "35 menit lalu",
      },
    ],
  };
}

export function resolveLeaderboardDelaySafeGroup(
  scope: LeaderboardScope,
): LeaderboardScopeGroup {
  return (
    leaderboardGroups.find((group) => group.scope === scope) ?? leaderboardGroups[0]
  );
}

export function resolveLeaderboardMaxRank(points: LeaderboardHistoryChartPoint[]): number {
  return Math.max(
    ...points.flatMap((point) => [point.Lokal, point.Regional, point.Nasional]),
    10,
  );
}

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
};
