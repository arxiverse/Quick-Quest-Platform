export type GiverKpiCard = {
  label: string;
  value: string;
  hint: string;
  tone: string;
};

export type GiverBroadcastStatus = "LIVE" | "MATCH" | "WAITING_RUNNER" | "FROZEN";
export type GiverQuestMode = "Per-Individu" | "Ber-Kelompok";

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

export {
  giverBriefChecklistItems,
  giverBroadcastQuests,
  giverBudgetCards,
  giverCandidates,
  giverEscrowEntries,
  giverKpiCards,
  giverPostQuestInsights,
} from "./giver.service";
