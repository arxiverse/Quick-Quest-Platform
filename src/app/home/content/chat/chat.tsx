import { useEffect, useMemo, useState } from "react";
import { cn, Surface } from "../../home.ui";
import { chatActionChips, chatThreads, type ChatAttachment, type ChatEscrowState, type ChatThread } from "./chat";

type ChatListFilter = "ALL" | "ACTION" | "RISK";
type ChatActionChipId = (typeof chatActionChips)[number]["id"];

const CHAT_ESCROW_FLOW: ChatEscrowState[] = ["UNPAID", "LOCKED", "IN_PROGRESS", "PENDING_CONFIRMATION", "RELEASED", "DISPUTED"];

function threadStatusClass(status: ChatThread["status"]) {
  if (status === "LIVE") return "bg-[#DBEAFE] text-[#1D4ED8]";
  if (status === "MATCH") return "bg-[#E9D5FF] text-[#6D28D9]";
  if (status === "IN_PROGRESS") return "bg-[#DCFCE7] text-[#166534]";
  return "bg-[#FECACA] text-[#991B1B]";
}

function escrowTone(state: ChatEscrowState) {
  if (state === "RELEASED") return "bg-[#DCFCE7] text-[#166534]";
  if (state === "DISPUTED") return "bg-[#FECACA] text-[#991B1B]";
  if (state === "PENDING_CONFIRMATION") return "bg-[#FEF3C7] text-[#92400E]";
  if (state === "IN_PROGRESS") return "bg-[#DBEAFE] text-[#1D4ED8]";
  return "bg-base-200 text-base-content/70";
}

function timelineStateClass(state: "done" | "active" | "upcoming") {
  if (state === "done") return "bg-[#DCFCE7] text-[#166534]";
  if (state === "active") return "bg-[#DBEAFE] text-[#1D4ED8] animate-pulse";
  return "bg-base-200 text-base-content/60";
}

function attachmentStatusClass(status: ChatAttachment["status"]) {
  if (status === "Uploaded") return "bg-[#DBEAFE] text-[#1D4ED8]";
  if (status === "Reviewed") return "bg-[#DCFCE7] text-[#166534]";
  return "bg-[#FEF3C7] text-[#92400E]";
}

function messageRoleClass(role: "giver" | "runner" | "system") {
  if (role === "giver") return "chat-end";
  if (role === "runner") return "chat-start";
  return "chat-center";
}

function messageBubbleClass(role: "giver" | "runner" | "system") {
  if (role === "giver") return "bg-primary text-primary-content";
  if (role === "runner") return "bg-base-200 text-base-content";
  return "bg-[#E2E8F0] text-[#334155]";
}

function isPhotoAttachment(type: ChatAttachment["type"]) {
  return type === "Before Photo" || type === "After Photo";
}

function resolveDelayRisk(thread: ChatThread) {
  return thread.sla.find((entry) => entry.label === "Delay Risk")?.value ?? "Low";
}

function ThreadListItem({ thread, onSelect }: { thread: ChatThread; onSelect: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(thread.id)}
      className="w-full rounded-[10px] border border-base-300/70 bg-base-100 p-3 text-left transition-all hover:border-primary/30 hover:bg-base-200/70"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-base-300 text-xs font-bold text-base-content/70">
          {thread.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-bold text-base-content">{thread.name}</p>
            <span className="shrink-0 text-[11px] font-semibold text-base-content/45">{thread.time}</span>
          </div>
          <p className="truncate text-[11px] font-medium text-base-content/60">{thread.role} • {thread.location}</p>
          <p className="mt-1 line-clamp-2 text-sm text-base-content/70">{thread.message}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={cn("rounded-[8px] px-2 py-0.5 text-[10px] font-bold tracking-[0.06em]", threadStatusClass(thread.status))}>{thread.status}</span>
            <span className={cn("rounded-[8px] px-2 py-0.5 text-[10px] font-semibold", escrowTone(thread.context.escrowState))}>{thread.context.escrowState}</span>
            <span className="rounded-[8px] bg-base-200 px-2 py-0.5 text-[10px] font-semibold text-base-content/65">{thread.context.mode}</span>
            {thread.unreadCount > 0 ? (
              <span className="rounded-[8px] bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-content">{thread.unreadCount} unread</span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}

function ChatDetailPanel({
  open,
  thread,
  activeActionChip,
  onActionChipChange,
  onClose,
}: {
  open: boolean;
  thread: ChatThread | null;
  activeActionChip: ChatActionChipId;
  onActionChipChange: (chipId: ChatActionChipId) => void;
  onClose: () => void;
}) {
  if (!open || !thread) return null;

  const selectedAction = chatActionChips.find((chip) => chip.id === activeActionChip) ?? chatActionChips[0];
  const currentEscrowIndex = CHAT_ESCROW_FLOW.indexOf(thread.context.escrowState);

  return (
    <div className="fixed inset-0 z-50 bg-black/35" onClick={onClose}>
      <aside
        className="ml-auto h-full w-full max-w-[44rem] overflow-y-auto border-l border-base-300/70 bg-base-100 p-3 pb-24 sm:p-4 sm:pb-24"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Live Thread Panel</p>
            <h2 className="mt-1 text-xl font-bold text-base-content">{thread.name}</h2>
            <p className="text-sm text-base-content/60">{thread.role} • {thread.location}</p>
          </div>
          <button
            type="button"
            className="btn btn-sm h-8 min-h-8 rounded-[8px] border-base-300 bg-base-100 text-xs"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>

        <div className="mt-3 rounded-[12px] border border-base-300/70 bg-base-100 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/45">Thread Context Header</p>
              <h3 className="mt-1 text-lg font-bold text-base-content">{thread.context.questId}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className={cn("rounded-[8px] px-2.5 py-1 text-[11px] font-bold", threadStatusClass(thread.status))}>{thread.status}</span>
              <span className={cn("rounded-[8px] px-2.5 py-1 text-[11px] font-semibold", escrowTone(thread.context.escrowState))}>{thread.context.escrowState}</span>
            </div>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/50">Mode</p>
              <p className="text-sm font-bold text-base-content">{thread.context.mode}</p>
            </div>
            <div className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/50">Radius</p>
              <p className="text-sm font-bold text-base-content">{thread.context.radius}</p>
            </div>
            <div className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/50">Wage Band</p>
              <p className="text-sm font-bold text-base-content">{thread.context.wageBand}</p>
            </div>
            <div className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2 sm:col-span-2 lg:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/50">Deadline</p>
              <p className="text-sm font-bold text-base-content">{thread.context.deadline}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-[12px] border border-base-300/70 bg-base-100 p-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">System Timeline</p>
          <h3 className="mt-1 text-sm font-bold text-base-content">Escrow Flow: LOCKED -&gt; IN_PROGRESS -&gt; PENDING_CONFIRMATION</h3>
          <div className="mt-3 space-y-2.5">
            {thread.timeline.map((event) => {
              const eventIndex = CHAT_ESCROW_FLOW.indexOf(event.state);
              const state = eventIndex < currentEscrowIndex ? "done" : eventIndex === currentEscrowIndex ? "active" : "upcoming";
              return (
                <div key={`${thread.id}-${event.state}-${event.time}`} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", timelineStateClass(state))}>{event.state}</span>
                    <span className="text-[11px] font-semibold text-base-content/60">{event.time}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-base-content/70">{event.note}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_0.95fr]">
          <div className="space-y-3">
            <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Live Conversation</p>
              <div className="mt-3 space-y-3">
                {thread.messages.map((message) => (
                  <div key={message.id} className={cn("chat", messageRoleClass(message.role))}>
                    <div className={cn("chat-bubble text-sm", messageBubbleClass(message.role))}>{message.text}</div>
                    <div className="chat-footer mt-1 text-[10px] font-semibold text-base-content/45">{message.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Action Chips</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {chatActionChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => onActionChipChange(chip.id)}
                    className={cn(
                      "btn h-8 min-h-8 rounded-[999px] border-none px-3 text-xs shadow-none",
                      activeActionChip === chip.id ? chip.tone : "bg-base-200 text-base-content/75 hover:bg-base-300"
                    )}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs font-medium text-base-content/65">{selectedAction.hint}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">SLA Widget</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                {thread.sla.map((metric) => (
                  <div key={`${thread.id}-${metric.label}`} className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/50">{metric.label}</p>
                    <span className={cn("mt-1 inline-flex rounded-[8px] px-2 py-0.5 text-xs font-semibold", metric.tone)}>{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Trust Signals</p>
              <div className="mt-2 space-y-2">
                {thread.trust.map((signal) => (
                  <div key={`${thread.id}-${signal.label}`} className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/50">{signal.label}</p>
                    <p className={cn("text-sm font-bold", signal.tone)}>{signal.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Attachment Panel</p>
              <div className="mt-2 space-y-2">
                {thread.attachments.map((attachment) => (
                  <div key={attachment.id} className="rounded-[9px] border border-base-300/70 bg-base-100 p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-base-content">{attachment.title}</p>
                      <span className={cn("rounded-[8px] px-2 py-0.5 text-[10px] font-semibold", attachmentStatusClass(attachment.status))}>{attachment.status}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] font-medium text-base-content/60">{attachment.type}</p>
                    {isPhotoAttachment(attachment.type) ? (
                      <div className="mt-2 h-16 rounded-[8px] border border-base-300/70 bg-gradient-to-br from-base-200 to-base-100" />
                    ) : null}
                    <p className="mt-2 truncate text-[11px] text-base-content/65">{attachment.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ChatComponent() {
  const [listFilter, setListFilter] = useState<ChatListFilter>("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeActionChip, setActiveActionChip] = useState<ChatActionChipId>(chatActionChips[0]?.id ?? "send-location");
  const [selectedThreadId, setSelectedThreadId] = useState(chatThreads[0].id);
  const [panelOpen, setPanelOpen] = useState(false);

  const filterSummary = useMemo(
    () => ({
      ALL: chatThreads.length,
      ACTION: chatThreads.filter((thread) => thread.unreadCount > 0 || thread.context.escrowState === "PENDING_CONFIRMATION").length,
      RISK: chatThreads.filter((thread) => thread.status === "RISK" || resolveDelayRisk(thread) === "High").length,
    }),
    []
  );

  const filteredThreads = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return chatThreads.filter((thread) => {
      if (listFilter === "ACTION" && thread.unreadCount === 0 && thread.context.escrowState !== "PENDING_CONFIRMATION") {
        return false;
      }
      if (listFilter === "RISK" && thread.status !== "RISK" && resolveDelayRisk(thread) !== "High") {
        return false;
      }
      if (!keyword) return true;
      return `${thread.name} ${thread.role} ${thread.context.questId}`.toLowerCase().includes(keyword);
    });
  }, [listFilter, searchKeyword]);

  const selectedThread = chatThreads.find((thread) => thread.id === selectedThreadId) ?? null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("chatThread")) return;
    url.searchParams.delete("chatThread");
    const search = url.searchParams.toString();
    window.history.replaceState(window.history.state, "", `${url.pathname}${search ? `?${search}` : ""}${url.hash}`);
  }, []);

  function openThreadPanel(threadId: string) {
    setSelectedThreadId(threadId);
    setPanelOpen(true);
  }

  return (
    <>
      <div className="grid gap-4">
        <Surface className="p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-base-content/45">QQM Chat Dispatch</p>
            <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-[11px] font-semibold text-base-content/70">Ojol x Freelance Thread</span>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {(["ALL", "ACTION", "RISK"] as ChatListFilter[]).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setListFilter(filterKey)}
                className={cn(
                  "btn h-8 min-h-8 rounded-[999px] border-none px-3 text-xs shadow-none",
                  listFilter === filterKey ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/75 hover:bg-base-300"
                )}
              >
                {filterKey} ({filterSummary[filterKey]})
              </button>
            ))}
          </div>

          <input
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            className="input input-sm mt-3 h-9 min-h-9 w-full rounded-[10px] border-base-300 bg-base-100 text-xs"
            placeholder="Cari thread by runner / quest id..."
          />

          <div className="mt-3 space-y-2.5">
            {filteredThreads.length ? (
              filteredThreads.map((thread) => (
                <ThreadListItem key={thread.id} thread={thread} onSelect={openThreadPanel} />
              ))
            ) : (
              <div className="rounded-[10px] border border-dashed border-base-300 bg-base-100 p-4 text-sm text-base-content/65">
                Thread tidak ditemukan. Coba ubah filter atau kata kunci.
              </div>
            )}
          </div>
        </Surface>
      </div>

      <ChatDetailPanel
        open={panelOpen}
        thread={selectedThread}
        activeActionChip={activeActionChip}
        onActionChipChange={setActiveActionChip}
        onClose={() => setPanelOpen(false)}
      />
    </>
  );
}

export default ChatComponent;
