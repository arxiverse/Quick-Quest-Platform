export type ChatEscrowState = "UNPAID" | "LOCKED" | "IN_PROGRESS" | "PENDING_CONFIRMATION" | "RELEASED" | "DISPUTED";

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
  type: "Before Photo" | "After Photo" | "Brief File" | "Delivery Proof";
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

export { chatActionChips, chatThreads } from "./chat.service";
