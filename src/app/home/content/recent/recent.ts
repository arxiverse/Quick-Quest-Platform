import {
  RECENT_SUBVIEW_STORAGE_KEY_SEED,
  contractArchiveRows,
  ppLedgerRows,
  questHistoryRows,
  recentEscrowPipelineStepsSeed,
  recentRoleDataSeed,
  recentSummaryMetrics,
  recentViewCopySeed,
  transactionHistoryRows,
  type RecentEscrowPipelineStepSeed,
  type RecentRoleDataSeed,
  type RecentViewCopy,
} from "./recent.service";
import type { RoleMode } from "../../role.util";


export type RecentSummaryMetric = {
  label: string;
  value: string;
  hint: string;
  tone: string;
};

export type ContractArchiveRow = {
  contractId: string;
  questTitle: string;
  giver: string;
  runner: string;
  type: "Per-Individu" | "Ber-Kelompok";
  status: "Open" | "In Progress" | "Pending Confirmation" | "Completed" | "Disputed";
  startDate: string;
  endDate: string;
  value: string;
};

export type QuestHistoryRow = {
  questId: string;
  title: string;
  category: string;
  status: "Open" | "In Progress" | "Pending Confirmation" | "Completed" | "Disputed";
  progress: string;
  updatedAt: string;
};

export type TransactionHistoryRow = {
  transactionId: string;
  questTitle: string;
  type: "Escrow Lock" | "Escrow Release" | "Platform Fee" | "Refund";
  amount: string;
  status: "Success" | "Pending" | "Failed";
  createdAt: string;
};

export type PpLedgerRow = {
  ledgerId: string;
  skill: string;
  change: string;
  reason: string;
  balanceAfter: string;
  createdAt: string;
};

export type RecentSubView =
  | { view: "DisputeCenter"; payload: { questId: string } }
  | { view: "ContractInvoice"; payload: { contractId: string } };

export type RecentEscrowPipelineStep = RecentEscrowPipelineStepSeed & {
  active: boolean;
};

export type RecentRoleContext = RoleMode;
export type RecentViewText = RecentViewCopy;
export type RecentRoleData = RecentRoleDataSeed;

export const recentSubViewStorageKey = RECENT_SUBVIEW_STORAGE_KEY_SEED;

export const recentViewText: RecentViewText = recentViewCopySeed;

export const recentEscrowPipelineSteps: RecentEscrowPipelineStepSeed[] = [
  ...recentEscrowPipelineStepsSeed,
];

export function resolveRecentRoleContext(
  role: RoleMode,
  isGiverVerified: boolean,
): RecentRoleContext {
  if (!isGiverVerified) {
    return "runner";
  }
  return role === "giver" ? "giver" : "runner";
}

export function resolveRecentRoleData(roleContext: RecentRoleContext): RecentRoleData {
  return recentRoleDataSeed[roleContext] ?? recentRoleDataSeed.runner;
}


export function resolveRecentStatusTone(
  status: ContractArchiveRow["status"] | QuestHistoryRow["status"],
): string {
  if (status === "Completed") {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  if (status === "In Progress") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  if (status === "Pending Confirmation") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  if (status === "Disputed") {
    return "bg-[#FECACA] text-[#991B1B]";
  }
  return "bg-base-200 text-base-content/70";
}

export function resolveRecentTransactionTone(
  status: TransactionHistoryRow["status"],
): string {
  if (status === "Success") {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  if (status === "Pending") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  return "bg-[#FECACA] text-[#991B1B]";
}

export function resolveRecentPpChangeTone(change: string): string {
  return change.startsWith("-") ? "text-[#991B1B]" : "text-[#166534]";
}

export function resolveInitialRecentSubView(): RecentSubView | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(recentSubViewStorageKey);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as RecentSubView;
  } catch {
    return null;
  }
}

export function syncRecentSubViewStorage(subView: RecentSubView | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (subView) {
    window.localStorage.setItem(recentSubViewStorageKey, JSON.stringify(subView));
  } else {
    window.localStorage.removeItem(recentSubViewStorageKey);
  }
}

export function resolveEscrowPipelineSteps(
  status: QuestHistoryRow["status"],
): RecentEscrowPipelineStep[] {
  const isCompleted = status === "Completed";

  return recentEscrowPipelineSteps.map((step) => {
    if (step.label === "Uang Ditahan") {
      return { ...step, active: true };
    }

    if (step.label === "Selesai") {
      return { ...step, active: isCompleted };
    }

    if (step.label === "Potong Fee 5%") {
      return { ...step, active: isCompleted };
    }

    return { ...step, active: isCompleted };
  });
}

export function isRecentQuestDisputed(status: QuestHistoryRow["status"]): boolean {
  return status === "Disputed";
}

export function isRecentQuestCompleted(status: QuestHistoryRow["status"]): boolean {
  return status === "Completed";
}

export {
  contractArchiveRows,
  ppLedgerRows,
  questHistoryRows,
  recentSummaryMetrics,
  transactionHistoryRows,
};
