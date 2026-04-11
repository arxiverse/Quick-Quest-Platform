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

export {
  contractArchiveRows,
  ppLedgerRows,
  questHistoryRows,
  recentSummaryMetrics,
  transactionHistoryRows,
} from "./recent.service";
