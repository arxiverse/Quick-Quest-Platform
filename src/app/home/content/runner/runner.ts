import {
  RUNNER_SUBVIEW_STORAGE_KEY_SEED,
  runnerActiveQuests,
  runnerAvailabilitySchedule,
  runnerCareerMetrics,
  runnerEarningTrajectory,
  runnerFocusInsight,
  runnerMembers,
  runnerOpenParties,
  runnerPartyLobbyChatMessages,
  runnerPartyLobbyInfoSeed,
  runnerQuestEscrowFlow,
  runnerReliabilityBadges,
  runnerSkillInventory,
  runnerViewCopySeed,
  type RunnerViewCopy,
} from "./runner.service";

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

export type RunnerActiveQuestStatus =
  | "HEADING_TO_LOCATION"
  | "ON_SITE"
  | "IN_PROGRESS"
  | "PENDING_CONFIRMATION"
  | "COMPLETED";

export type RunnerActiveQuest = {
  id: string;
  questTitle: string;
  giverName: string;
  escrowState: "LOCKED" | "IN_PROGRESS" | "PENDING_CONFIRMATION" | "RELEASED";
  status: RunnerActiveQuestStatus;
  reward: string;
  locationAddress: string;
  workStartedAt: string | null;
  workFinishedAt: string | null;
  autoReleaseHoursLeft: number;
  ppGain: string;
};

export type RunnerOpenParty = {
  id: string;
  title: string;
  giver: string;
  slotFilled: number;
  slotTotal: number;
  reward: string;
  match: number;
};

export type RunnerPartyLobbySlotState = "self" | "filled" | "waiting";

export type RunnerPartyLobbySlot = {
  id: string;
  label: string;
  icon: string;
  state: RunnerPartyLobbySlotState;
};

export type RunnerPartyLobbyInfo = {
  id: string;
  title: string;
  giver: string;
  reward: string;
  slotTotal: number;
  teamSlots: RunnerPartyLobbySlot[];
};

export type RunnerPartyLobbyChatMessage = {
  id: string;
  sender: string;
  role: "giver" | "runner";
  content: string;
};

export type RunnerSubView = { view: "PartyLobbyRoom"; payload: { partyId: string } };

export type RunnerWorkStatus = "idle" | "started" | "finished";

export type RunnerWorkStateMap = Record<string, RunnerWorkStatus>;

export type RunnerCountdownMap = Record<string, number>;

export type RunnerViewText = RunnerViewCopy;

export const runnerSubViewStorageKey = RUNNER_SUBVIEW_STORAGE_KEY_SEED;
export const runnerViewText: RunnerViewText = runnerViewCopySeed;

export function resolveRunnerSkillLevelClass(
  level: RunnerSkillInventoryItem["level"],
): string {
  if (level === "Q1") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  if (level === "Q2") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  return "bg-[#DCFCE7] text-[#166534]";
}

export function resolveRunnerAvailabilityClass(
  status: RunnerAvailabilitySlot["morning"],
): string {
  if (status === "Online") {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  if (status === "Limited") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  return "bg-[#FECACA] text-[#991B1B]";
}

export function resolveRunnerMemberStatusClass(
  status: RunnerMember["currentStatus"],
): string {
  if (status === "Ready") {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  if (status === "On Quest") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  if (status === "Standby") {
    return "bg-[#E9D5FF] text-[#6D28D9]";
  }
  return "bg-[#FECACA] text-[#991B1B]";
}

export function resolveRunnerActiveQuestEscrowClass(
  state: RunnerActiveQuest["escrowState"],
): string {
  if (state === "LOCKED") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  if (state === "IN_PROGRESS") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  if (state === "PENDING_CONFIRMATION") {
    return "bg-[#E9D5FF] text-[#6D28D9]";
  }
  return "bg-[#DCFCE7] text-[#166534]";
}

export function createInitialRunnerWorkState(
  quests: RunnerActiveQuest[],
): RunnerWorkStateMap {
  return Object.fromEntries(
    quests.map((quest) => [quest.id, quest.workStartedAt ? "started" : "idle"]),
  ) as RunnerWorkStateMap;
}

export function createInitialRunnerCountdown(
  quests: RunnerActiveQuest[],
): RunnerCountdownMap {
  return Object.fromEntries(
    quests.map((quest) => [quest.id, quest.autoReleaseHoursLeft * 3600]),
  ) as RunnerCountdownMap;
}

export function tickRunnerCountdown(previous: RunnerCountdownMap): RunnerCountdownMap {
  return Object.fromEntries(
    Object.entries(previous).map(([key, value]) => [key, Math.max(0, value - 1)]),
  );
}

export function formatRunnerCountdown(seconds: number): string {
  const safeSeconds = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;
  const pad = (value: number) => value.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

export function resolveRunnerAutoReleaseUrgency(seconds: number): boolean {
  return seconds < 7200;
}

export function resolveRunnerEscrowFlowIndex(
  flow: RunnerActiveQuest["escrowState"][],
  state: RunnerActiveQuest["escrowState"],
): number {
  return flow.indexOf(state);
}

export function createRunnerPartySlotFill(
  slotFilled: number,
  slotTotal: number,
): boolean[] {
  return Array.from({ length: slotTotal }, (_, index) => index < slotFilled);
}

export function resolveInitialRunnerSubView(): RunnerSubView | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(runnerSubViewStorageKey);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as RunnerSubView;
  } catch {
    return null;
  }
}

export function syncRunnerSubViewStorage(subView: RunnerSubView | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (subView) {
    window.localStorage.setItem(runnerSubViewStorageKey, JSON.stringify(subView));
  } else {
    window.localStorage.removeItem(runnerSubViewStorageKey);
  }
}

export function getRunnerPartyLobbyInfo(partyId: string): RunnerPartyLobbyInfo {
  return (
    runnerPartyLobbyInfoSeed.find((party) => party.id === partyId) ??
    runnerPartyLobbyInfoSeed[0]
  );
}

export {
  runnerAvailabilitySchedule,
  runnerCareerMetrics,
  runnerEarningTrajectory,
  runnerFocusInsight,
  runnerMembers,
  runnerReliabilityBadges,
  runnerSkillInventory,
  runnerActiveQuests,
  runnerOpenParties,
  runnerQuestEscrowFlow,
  runnerPartyLobbyChatMessages,
  runnerPartyLobbyInfoSeed,
};
