import { useState } from "react";
import {
  GIVER_SUBVIEW_STORAGE_KEY,
  giverBriefChecklistItems,
  giverBroadcastFiltersSeed,
  giverBroadcastQuests,
  giverBudgetCards,
  giverCandidateSortOptionsSeed,
  giverCandidates,
  giverEscrowEntries,
  giverKpiCards,
  giverPostQuestInsights,
  giverViewCopySeed,
  type GiverViewCopy,
  QQM_SKILL_TAGS,
  QQM_PLATFORM_FEE_PERCENT,
  type EditorQuestType,
  type EditorStep,
} from "./giver.service";

export type GiverKpiCard = {
  label: string;
  value: string;
  hint: string;
  tone: string;
};

export type GiverBroadcastStatus = "LIVE" | "MATCH" | "WAITING_RUNNER" | "FROZEN";
export type GiverQuestMode = "Per-Individu" | "Ber-Kelompok";
export type BroadcastFilter = "ALL" | GiverBroadcastStatus;
export type CandidateSort = "MATCH" | "DISTANCE" | "ETA";

export type GiverBroadcastQuest = {
  id: string;
  title: string;
  status: GiverBroadcastStatus;
  mode: GiverQuestMode;
  skillTag: string;
  wageBand: string;
  slotFilled: number;
  slotTotal: number;
  baseRadiusKm: number;
  maxRadiusKm: number;
  elapsedSeedSeconds: number;
  deadline: string;
  location: string;
  estimatedCandidates: number;
  escrowState: "LOCKED" | "IN_PROGRESS" | "PENDING_CONFIRMATION";
};

export type GiverCandidateStatus = "Ready" | "On Quest" | "Standby";

export type GiverCandidate = {
  id: string;
  name: string;
  distanceKm: number;
  etaMinutes: number;
  skill: string;
  matchScore: number;
  completionRate: string;
  disputeRatio: string;
  reliabilityBadge: string;
  status: GiverCandidateStatus;
};

export type GiverBudgetCard = {
  label: string;
  value: string;
  hint: string;
  tone: string;
};

export type GiverEscrowEntry = {
  id: string;
  questId: string;
  type: "LOCKED" | "PENDING_RELEASE" | "RELEASED" | "REFUND" | "DISPUTE";
  amount: string;
  note: string;
  time: string;
};

export type GiverBriefChecklistItem = {
  id: string;
  label: string;
  description: string;
  weight: number;
  required: boolean;
  defaultChecked: boolean;
};

export type GiverPostQuestInsight = {
  id: string;
  title: string;
  recommendation: string;
  impact: string;
  confidence: string;
  tone: string;
};

export type GiverSubView =
  | { view: "QuestEditor" }
  | { view: "CandidateReview"; payload: { id: string } };

export type GiverRadiusRuntime = {
  currentRadius: number;
  nextRadius: number;
  nextExpandIn: number;
  maxReached: boolean;
};

export type GiverViewText = GiverViewCopy;

export const giverBroadcastFilters = [...giverBroadcastFiltersSeed];
export const giverCandidateSortOptions = [...giverCandidateSortOptionsSeed];
export const giverViewText: GiverViewText = giverViewCopySeed;

export function resolveGiverBroadcastStatusClass(status: GiverBroadcastStatus): string {
  if (status === "LIVE") return "bg-[#DBEAFE] text-[#1D4ED8]";
  if (status === "MATCH") return "bg-[#E9D5FF] text-[#6D28D9]";
  if (status === "WAITING_RUNNER") return "bg-[#FEF3C7] text-[#92400E]";
  return "bg-[#FECACA] text-[#991B1B]";
}

export function resolveGiverEscrowStateClass(
  state: GiverBroadcastQuest["escrowState"],
): string {
  if (state === "IN_PROGRESS") return "bg-[#DCFCE7] text-[#166534]";
  if (state === "PENDING_CONFIRMATION") return "bg-[#E9D5FF] text-[#6D28D9]";
  return "bg-[#DBEAFE] text-[#1D4ED8]";
}

export function resolveGiverCandidateStatusClass(
  status: GiverCandidate["status"],
): string {
  if (status === "Ready") return "bg-[#DCFCE7] text-[#166534]";
  if (status === "On Quest") return "bg-[#DBEAFE] text-[#1D4ED8]";
  return "bg-[#FEF3C7] text-[#92400E]";
}

export function resolveGiverEscrowTypeClass(type: GiverEscrowEntry["type"]): string {
  if (type === "RELEASED") return "bg-[#DCFCE7] text-[#166534]";
  if (type === "PENDING_RELEASE") return "bg-[#FEF3C7] text-[#92400E]";
  if (type === "LOCKED") return "bg-[#DBEAFE] text-[#1D4ED8]";
  if (type === "REFUND") return "bg-[#E9D5FF] text-[#6D28D9]";
  return "bg-[#FECACA] text-[#991B1B]";
}

export function formatGiverCountdown(seconds: number): string {
  const safe = Math.max(0, seconds);
  const minute = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const second = Math.floor(safe % 60)
    .toString()
    .padStart(2, "0");
  return `${minute}:${second}`;
}

export function resolveGiverRadiusRuntime(
  quest: GiverBroadcastQuest,
  tickSeconds: number,
): GiverRadiusRuntime {
  const elapsed = quest.elapsedSeedSeconds + tickSeconds;
  const expansionStep = Math.floor(elapsed / 300);
  const currentRadius = Math.min(quest.baseRadiusKm + expansionStep, quest.maxRadiusKm);
  const maxReached = currentRadius >= quest.maxRadiusKm;
  const modulo = elapsed % 300;
  const nextExpandIn = maxReached ? 0 : modulo === 0 ? 300 : 300 - modulo;
  const nextRadius = Math.min(currentRadius + 1, quest.maxRadiusKm);

  return {
    currentRadius,
    nextRadius,
    nextExpandIn,
    maxReached,
  };
}

export function resolveInitialGiverSubView(): GiverSubView | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(GIVER_SUBVIEW_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GiverSubView;
  } catch {
    return null;
  }
}

export function persistGiverSubView(subView: GiverSubView | null): void {
  if (typeof window === "undefined") return;
  if (subView) {
    window.localStorage.setItem(GIVER_SUBVIEW_STORAGE_KEY, JSON.stringify(subView));
    return;
  }
  window.localStorage.removeItem(GIVER_SUBVIEW_STORAGE_KEY);
}

export function filterGiverBroadcastQuests(
  items: GiverBroadcastQuest[],
  filter: BroadcastFilter,
): GiverBroadcastQuest[] {
  if (filter === "ALL") return items;
  return items.filter((item) => item.status === filter);
}

export function sortGiverCandidates(
  items: GiverCandidate[],
  sortBy: CandidateSort,
): GiverCandidate[] {
  const candidates = [...items];
  if (sortBy === "MATCH") {
    return candidates.sort((left, right) => right.matchScore - left.matchScore);
  }
  if (sortBy === "DISTANCE") {
    return candidates.sort((left, right) => left.distanceKm - right.distanceKm);
  }
  return candidates.sort((left, right) => left.etaMinutes - right.etaMinutes);
}

export function buildInitialGiverBriefState(
  items: GiverBriefChecklistItem[],
): Record<string, boolean> {
  return items.reduce(
    (accumulator, item) => ({
      ...accumulator,
      [item.id]: item.defaultChecked,
    }),
    {} as Record<string, boolean>,
  );
}

export function resolveGiverBriefScore(
  items: GiverBriefChecklistItem[],
  briefState: Record<string, boolean>,
): {
  totalWeight: number;
  achievedWeight: number;
  score: number;
  missingRequired: GiverBriefChecklistItem[];
  ready: boolean;
} {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const achievedWeight = items.reduce(
    (sum, item) => (briefState[item.id] ? sum + item.weight : sum),
    0,
  );
  const score = Math.round((achievedWeight / totalWeight) * 100);
  const missingRequired = items.filter((item) => item.required && !briefState[item.id]);
  const ready = score >= 85 && missingRequired.length === 0;

  return {
    totalWeight,
    achievedWeight,
    score,
    missingRequired,
    ready,
  };
}

export function resolveGiverPartyLobbyWaitingText(candidates: number): string {
  return giverViewText.broadcast.partyLobby.waitingTemplate.replace(
    "{candidates}",
    `${candidates}`,
  );
}

export function resolveGiverSlotProgress(quest: GiverBroadcastQuest): number {
  return Math.round((quest.slotFilled / quest.slotTotal) * 100);
}

export {
  giverBriefChecklistItems,
  giverBroadcastQuests,
  giverBudgetCards,
  giverCandidates,
  giverEscrowEntries,
  giverKpiCards,
  giverPostQuestInsights,
};

export function formatRupiah(val: string): string {
  const digits = val.replace(/\D/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("id-ID");
}

export function parseRupiah(val: string): number {
  return parseInt(val.replace(/\./g, "").replace(/,/g, ""), 10) || 0;
}

export function useQuestEditorVM() {
  const [step, setStep] = useState<EditorStep>(1);
  const [questType, setQuestType] = useState<EditorQuestType>("SOLO");
  const [slotCount, setSlotCount] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [upahMin, setUpahMin] = useState("");
  const [upahMax, setUpahMax] = useState("");
  const [baseRadius, setBaseRadius] = useState(1);
  const [escrowLocked, setEscrowLocked] = useState(false);

  const upahMinNum = parseRupiah(upahMin);
  const upahMaxNum = parseRupiah(upahMax);
  const totalEscrowMin = upahMinNum * (questType === "KELOMPOK" ? slotCount : 1);
  const totalEscrowMax = upahMaxNum * (questType === "KELOMPOK" ? slotCount : 1);
  const platformFeeMin = Math.round(totalEscrowMin * (QQM_PLATFORM_FEE_PERCENT / 100));
  const platformFeeMax = Math.round(totalEscrowMax * (QQM_PLATFORM_FEE_PERCENT / 100));
  const totalDepositMax = totalEscrowMax + platformFeeMax;

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  }

  const canProceedStep1 = selectedSkills.length > 0 && upahMin !== "" && upahMax !== "" && upahMaxNum >= upahMinNum;
  const canProceedStep2 = true;
  const canBroadcast = escrowLocked;

  return {
    step,
    setStep,
    questType,
    setQuestType,
    slotCount,
    setSlotCount,
    selectedSkills,
    toggleSkill,
    upahMin,
    setUpahMin,
    upahMax,
    setUpahMax,
    baseRadius,
    setBaseRadius,
    escrowLocked,
    setEscrowLocked,
    upahMinNum,
    upahMaxNum,
    totalEscrowMin,
    totalEscrowMax,
    platformFeeMin,
    platformFeeMax,
    totalDepositMax,
    canProceedStep1,
    canProceedStep2,
    canBroadcast,
    skillTags: QQM_SKILL_TAGS,
    platformFeePercent: QQM_PLATFORM_FEE_PERCENT,
  };
}
