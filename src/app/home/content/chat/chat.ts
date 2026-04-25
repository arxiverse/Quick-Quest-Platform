import {
  CHAT_ESCROW_FLOW_SEED,
  chatActionChips,
  chatListFiltersSeed,
  chatRoleDataSeed,
  chatThreads,
  chatViewCopySeed,
  type ChatRoleDataSeed,
  type ChatViewCopy,
} from "./chat.service";
import type { RoleMode } from "../../role.util";


export type ChatEscrowState =
  | "UNPAID"
  | "LOCKED"
  | "IN_PROGRESS"
  | "PENDING_CONFIRMATION"
  | "RELEASED"
  | "DISPUTED";

export type ChatThreadMode = "Per-Individu" | "Ber-Kelompok";

export type ChatThreadStatus = "LIVE" | "MATCH" | "IN_PROGRESS" | "RISK";

export type ChatTimelineEvent = {
  state: ChatEscrowState;
  time: string;
  note: string;
};

export type ChatActionChip = {
  id: "send-location" | "request-proof" | "raise-revision" | "escalate-dispute";
  label: string;
  hint: string;
  tone: string;
};

export type ChatSlaMetric = {
  label: "First Response" | "Avg Reply" | "Last Active" | "Delay Risk";
  value: string;
  tone: string;
};

export type ChatTrustSignal = {
  label: "Verified" | "Completion Rate" | "Dispute Ratio";
  value: string;
  tone: string;
};

export type ChatAttachment = {
  id: string;
  type: "Before Photo" | "After Photo" | "Brief File" | "Delivery Proof" | "Location Pin";
  title: string;
  detail: string;
  status: "Uploaded" | "Pending" | "Reviewed";
};

export type ChatMessage = {
  id: string;
  role: "giver" | "runner" | "system";
  text: string;
  time: string;
};

export type ChatThread = {
  id: string;
  name: string;
  role: string;
  location: string;
  message: string;
  time: string;
  unreadCount: number;
  status: ChatThreadStatus;
  context: {
    questId: string;
    mode: ChatThreadMode;
    radius: string;
    wageBand: string;
    deadline: string;
    escrowState: ChatEscrowState;
  };
  timeline: ChatTimelineEvent[];
  sla: ChatSlaMetric[];
  trust: ChatTrustSignal[];
  messages: ChatMessage[];
  attachments: ChatAttachment[];
};

export type ChatListFilter = "ALL" | "ACTION" | "RISK";

export type ChatActionChipId = ChatActionChip["id"];

export type ChatTimelineRenderState = "done" | "active" | "upcoming";

export type ChatRoleContext = RoleMode;
export type ChatRoleData = ChatRoleDataSeed;
export type ChatViewText = ChatViewCopy;

export const chatEscrowFlow: ChatEscrowState[] = [...CHAT_ESCROW_FLOW_SEED];

export const chatListFilters: ChatListFilter[] = [...chatListFiltersSeed];

export const chatViewText: ChatViewText = chatViewCopySeed;

export function resolveChatRoleContext(
  role: RoleMode,
  isGiverVerified: boolean,
): ChatRoleContext {
  if (!isGiverVerified) {
    return "runner";
  }
  return role === "giver" ? "giver" : "runner";
}

export function resolveChatRoleData(roleContext: ChatRoleContext): ChatRoleData {
  return chatRoleDataSeed[roleContext] ?? chatRoleDataSeed.runner;
}


export function resolveChatThreadStatusClass(status: ChatThread["status"]): string {
  if (status === "LIVE") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  if (status === "MATCH") {
    return "bg-[#E9D5FF] text-[#6D28D9]";
  }
  if (status === "IN_PROGRESS") {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  return "bg-[#FECACA] text-[#991B1B]";
}

export function resolveChatEscrowTone(state: ChatEscrowState): string {
  if (state === "RELEASED") {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  if (state === "DISPUTED") {
    return "bg-[#FECACA] text-[#991B1B]";
  }
  if (state === "PENDING_CONFIRMATION") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  if (state === "IN_PROGRESS") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  return "bg-base-200 text-base-content/70";
}

export function resolveChatTimelineStateClass(
  state: ChatTimelineRenderState,
): string {
  if (state === "done") {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  if (state === "active") {
    return "bg-[#DBEAFE] text-[#1D4ED8] animate-pulse";
  }
  return "bg-base-200 text-base-content/60";
}

export function resolveChatAttachmentStatusClass(
  status: ChatAttachment["status"],
): string {
  if (status === "Uploaded") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  if (status === "Reviewed") {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  return "bg-[#FEF3C7] text-[#92400E]";
}

export function resolveChatMessageRoleClass(
  role: ChatMessage["role"],
): string {
  if (role === "giver") {
    return "chat-end";
  }
  if (role === "runner") {
    return "chat-start";
  }
  return "chat-center";
}

export function resolveChatMessageBubbleClass(
  role: ChatMessage["role"],
): string {
  if (role === "giver") {
    return "bg-primary text-primary-content";
  }
  if (role === "runner") {
    return "bg-base-200 text-base-content";
  }
  return "bg-[#E2E8F0] text-[#334155]";
}

export function isChatPhotoAttachment(type: ChatAttachment["type"]): boolean {
  return type === "Before Photo" || type === "After Photo";
}

export function isChatLocationAttachment(type: ChatAttachment["type"]): boolean {
  return type === "Location Pin";
}

export function resolveChatDelayRisk(thread: ChatThread): string {
  return thread.sla.find((entry) => entry.label === "Delay Risk")?.value ?? "Low";
}

export function resolveChatTimelineRenderState(
  flow: ChatEscrowState[],
  currentState: ChatEscrowState,
  eventState: ChatEscrowState,
): ChatTimelineRenderState {
  const currentEscrowIndex = flow.indexOf(currentState);
  const eventIndex = flow.indexOf(eventState);

  if (eventIndex < currentEscrowIndex) {
    return "done";
  }
  if (eventIndex === currentEscrowIndex) {
    return "active";
  }
  return "upcoming";
}

export function resolveChatFilterSummary(
  threads: ChatThread[],
): Record<ChatListFilter, number> {
  return {
    ALL: threads.length,
    ACTION: threads.filter(
      (thread) =>
        thread.unreadCount > 0 ||
        thread.context.escrowState === "PENDING_CONFIRMATION",
    ).length,
    RISK: threads.filter(
      (thread) =>
        thread.status === "RISK" || resolveChatDelayRisk(thread) === "High",
    ).length,
  };
}

export function filterChatThreads(
  threads: ChatThread[],
  listFilter: ChatListFilter,
  searchKeyword: string,
): ChatThread[] {
  const keyword = searchKeyword.trim().toLowerCase();

  return threads.filter((thread) => {
    if (
      listFilter === "ACTION" &&
      thread.unreadCount === 0 &&
      thread.context.escrowState !== "PENDING_CONFIRMATION"
    ) {
      return false;
    }

    if (
      listFilter === "RISK" &&
      thread.status !== "RISK" &&
      resolveChatDelayRisk(thread) !== "High"
    ) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    return `${thread.name} ${thread.role} ${thread.context.questId}`
      .toLowerCase()
      .includes(keyword);
  });
}

export function resolveInitialChatActionChipId(
  chips: ChatActionChip[],
): ChatActionChipId {
  return chips[0]?.id ?? "send-location";
}

export { chatActionChips, chatThreads };
