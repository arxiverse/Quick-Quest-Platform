// ─────────────────────────────────────────────────
// dispute.ts — Types for QQM Dispute Center
// ─────────────────────────────────────────────────
import { useCallback, useEffect, useState } from "react";
import {
  DISPUTE_FILTER_OPTIONS_SEED,
  disputeFilterLabelSeed,
  disputeItems,
  disputeLayers,
  disputeLayerToneSeed,
  disputeStatusMeta,
  disputeRoleDataSeed,
  disputeViewCopySeed,
  createDisputeEvidenceFromApi,
  fetchDisputeDetailFromApi,
  fetchDisputesFromApi,
  type DisputeRoleDataSeed,
  type DisputeViewCopy,
  type CreateDisputeEvidencePayload,
} from "./dispute.service";
import type { RoleMode } from "../../role.util";

export type DisputeStatus =
  | "AUTO_TIMER"
  | "EVIDENCE_SUBMISSION"
  | "UNDER_REVIEW"
  | "RESOLVED_RUNNER"
  | "RESOLVED_GIVER"
  | "RESOLVED_PARTIAL"
  | "DISMISSED";

export type DisputeParty = "GIVER" | "RUNNER";

export type DisputeEvidence = {
  id: string;
  uploader: DisputeParty;
  type: "PHOTO" | "VIDEO" | "NOTE";
  label: string;
  uploadedAt: string;
  url?: string;
};

export type DisputeItem = {
  id: string;
  questId: string;
  questTitle: string;
  amount: string;
  raisedBy: DisputeParty;
  raisedAt: string;
  status: DisputeStatus;
  autoReleaseHoursLeft: number;
  evidenceDeadline: string;
  giverEvidence: DisputeEvidence[];
  runnerEvidence: DisputeEvidence[];
  mediatorNote?: string;
  resolvedAt?: string;
  timeline: DisputeTimelineEvent[];
};

export type DisputeTimelineEvent = {
  status: DisputeStatus;
  time: string;
  description: string;
};

export type DisputeLayer =
  | { layer: 1; label: "Auto Timer"; description: string }
  | { layer: 2; label: "Evidence Based"; description: string }
  | { layer: 3; label: "Platform Mediasi"; description: string };

export type DisputeFilterOption = (typeof DISPUTE_FILTER_OPTIONS_SEED)[number];

export type DisputeSubView = { view: "DisputeDetail"; payload: { id: string } } | null;

export type DisputeStatCard = {
  key: "active" | "resolved" | "total";
  label: string;
  value: number;
  tone: string;
};

export type DisputeViewText = DisputeViewCopy;
export type DisputeRoleContext = RoleMode;
export type DisputeRoleData = DisputeRoleDataSeed;

export const disputeFilterOptions = [...DISPUTE_FILTER_OPTIONS_SEED];
export const disputeFilterLabels = disputeFilterLabelSeed;

// Static fallback, in components use useRole() + resolver
export const disputeViewText: DisputeViewText = disputeViewCopySeed;

export function resolveDisputeRoleContext(
  role: RoleMode,
  isGiverVerified: boolean,
): DisputeRoleContext {
  if (!isGiverVerified) return "runner";
  return role === "giver" ? "giver" : "runner";
}

export function resolveDisputeRoleData(
  roleContext: DisputeRoleContext
): DisputeRoleData {
  return disputeRoleDataSeed[roleContext] ?? disputeRoleDataSeed.runner;
}

export function resolveDisputeTotalEvidence(item: DisputeItem): number {
  return item.giverEvidence.length + item.runnerEvidence.length;
}

export function resolveDisputeCountdownLabel(remaining: number): string {
  const safeSeconds = Math.max(0, remaining);
  const hour = Math.floor(safeSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minute = Math.floor((safeSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const second = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${hour}:${minute}:${second}`;
}

export function resolveDisputeAutoTimerTone(remaining: number): {
  container: string;
  label: string;
  clock: string;
  urgency: boolean;
} {
  const urgency = remaining < 7200;
  return urgency
    ? {
        container: "border-error/40 bg-error/5",
        label: "text-error",
        clock: "text-error",
        urgency: true,
      }
    : {
        container: "border-[#FDE68A] bg-[#FEF3C7]",
        label: "text-[#92400E]",
        clock: "text-[#92400E]",
        urgency: false,
      };
}

export function resolveDisputeLayerTone(layer: DisputeLayer["layer"]) {
  return disputeLayerToneSeed[layer - 1];
}

export function filterDisputeItems(
  items: DisputeItem[],
  filter: DisputeFilterOption,
): DisputeItem[] {
  if (filter === "ALL") {
    return items;
  }
  return items.filter((item) => {
    if (filter === "RESOLVED_RUNNER") {
      return item.status.startsWith("RESOLVED_");
    }
    return item.status === filter;
  });
}

export function buildDisputeStatCards(items: DisputeItem[], viewText: DisputeViewText): DisputeStatCard[] {
  const active = items.filter((item) =>
    ["AUTO_TIMER", "EVIDENCE_SUBMISSION", "UNDER_REVIEW"].includes(item.status),
  ).length;
  const resolved = items.filter((item) =>
    ["RESOLVED_RUNNER", "RESOLVED_GIVER", "RESOLVED_PARTIAL"].includes(item.status),
  ).length;
  const total = items.length;

  return [
    {
      key: "active",
      label: viewText.stats.labels.active,
      value: active,
      tone: "bg-[#FEE2E2] text-[#B91C1C]",
    },
    {
      key: "resolved",
      label: viewText.stats.labels.resolved,
      value: resolved,
      tone: "bg-[#DCFCE7] text-[#166534]",
    },
    {
      key: "total",
      label: viewText.stats.labels.total,
      value: total,
      tone: "bg-base-200 text-base-content/70",
    },
  ];
}

export function useDisputeCenterVM(fallbackItems: DisputeItem[]) {
  const [items, setItems] = useState<DisputeItem[]>(fallbackItems);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const liveItems = await fetchDisputesFromApi();
      setItems(liveItems.length > 0 ? liveItems : fallbackItems);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengambil dispute.");
      setItems(fallbackItems);
    } finally {
      setIsLoading(false);
    }
  }, [fallbackItems]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    items,
    isLoading,
    errorMessage,
    refresh,
  };
}

export function useDisputeDetailVM(disputeId: string, fallbackItem: DisputeItem) {
  const [item, setItem] = useState<DisputeItem>(fallbackItem);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      setItem(await fetchDisputeDetailFromApi(disputeId));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengambil detail dispute.");
      setItem(fallbackItem);
    } finally {
      setIsLoading(false);
    }
  }, [disputeId, fallbackItem]);

  const submitEvidence = useCallback(async (payload: CreateDisputeEvidencePayload) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      setItem(await createDisputeEvidenceFromApi(disputeId, payload));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengirim evidence.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [disputeId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    item,
    isLoading,
    errorMessage,
    refresh,
    submitEvidence,
  };
}

export { disputeItems, disputeLayers, disputeStatusMeta };
