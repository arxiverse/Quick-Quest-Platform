import { useEffect, useState } from "react";
import "./dispute.css";
import { cn, Surface } from "../../home.ui";
import {
  buildDisputeStatCards,
  disputeFilterLabels,
  disputeFilterOptions,
  disputeLayers,
  disputeStatusMeta,
  filterDisputeItems,
  resolveDisputeAutoTimerTone,
  resolveDisputeCountdownLabel,
  resolveDisputeLayerTone,
  resolveDisputeTotalEvidence,
  resolveDisputeRoleContext,
  resolveDisputeRoleData,
  type DisputeFilterOption,
  type DisputeItem,
  type DisputeSubView,
  type DisputeViewText,
} from "./dispute";
import { DisputeDetail } from "./page/dispute-detail";
import { useRole } from "../../role.context";

function AutoTimerWidget({
  hoursLeft,
  viewText,
}: {
  hoursLeft: number;
  viewText: DisputeViewText;
}) {
  const totalSeconds = hoursLeft * 3600;
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (hoursLeft <= 0) return;
    const timerId = window.setInterval(
      () => setRemaining((previous) => Math.max(0, previous - 1)),
      1000,
    );
    return () => window.clearInterval(timerId);
  }, [hoursLeft]);

  if (hoursLeft <= 0) {
    return (
      <div className="rounded-[10px] bg-base-200 px-3 py-2 text-center">
        <p className="text-xs font-semibold text-base-content/60">
          {viewText.card.autoTimerEnded}
        </p>
      </div>
    );
  }

  const tone = resolveDisputeAutoTimerTone(remaining);

  return (
    <div
      className={cn("rounded-[10px] border p-3 text-center", tone.container)}
    >
      <p
        className={cn(
          "text-[10px] font-bold uppercase tracking-wider",
          tone.label,
        )}
      >
        {viewText.card.autoTimerPrefix}
      </p>
      <p
        className={cn(
          "mt-1 font-mono text-xl font-bold tracking-widest",
          tone.clock,
        )}
      >
        {resolveDisputeCountdownLabel(remaining)}
      </p>
    </div>
  );
}

function DisputeCard({
  dispute,
  viewText,
  onViewDetail,
}: {
  dispute: DisputeItem;
  viewText: DisputeViewText;
  onViewDetail: () => void;
}) {
  const meta = disputeStatusMeta[dispute.status];
  const totalEvidence = resolveDisputeTotalEvidence(dispute);

  return (
    <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold text-base-content/55 uppercase tracking-wider">
            {dispute.id} · {dispute.questId}
          </p>
          <h3 className="mt-1 text-base font-bold text-base-content">
            {dispute.questTitle}
          </h3>
          <p className="text-xs text-base-content/60 mt-0.5">
            {viewText.card.raisedByPrefix} {dispute.raisedBy}{" "}
            {viewText.card.raisedAtSeparator} {dispute.raisedAt}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={cn(
              "rounded-[8px] px-2.5 py-1 text-[11px] font-bold",
              meta.bg,
              meta.color,
            )}
          >
            {meta.label}
          </span>
          <span className="rounded-[8px] bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-bold text-[#166534]">
            {dispute.amount}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-[9px] border border-base-300/70 bg-base-200/40 px-3 py-2">
          <p className="text-[10px] font-semibold text-base-content/55">
            {viewText.card.evidenceUploadedLabel}
          </p>
          <p className="text-sm font-bold text-base-content">
            {totalEvidence} {viewText.card.evidenceItemSuffix}
          </p>
        </div>
        <div className="rounded-[9px] border border-base-300/70 bg-base-200/40 px-3 py-2">
          <p className="text-[10px] font-semibold text-base-content/55">
            {viewText.card.evidenceDeadlineLabel}
          </p>
          <p className="text-xs font-bold text-base-content">
            {dispute.evidenceDeadline}
          </p>
        </div>
      </div>

      {dispute.status === "AUTO_TIMER" ? (
        <AutoTimerWidget
          hoursLeft={dispute.autoReleaseHoursLeft}
          viewText={viewText}
        />
      ) : null}

      {dispute.mediatorNote ? (
        <div className="rounded-[9px] border border-[#A046FF]/30 bg-[#A046FF]/5 p-2.5">
          <p className="text-[10px] font-bold text-[#6D28D9] uppercase tracking-wide">
            {viewText.card.mediatorNoteLabel}
          </p>
          <p className="text-xs text-base-content/80 mt-0.5">
            {dispute.mediatorNote}
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onViewDetail}
        className="btn h-9 w-full rounded-[10px] border-none bg-primary text-primary-content text-xs font-bold shadow-none hover:opacity-90 active:scale-95 transition-transform"
      >
        {viewText.list.detailButton}
      </button>
    </div>
  );
}

function DisputeComponent() {
  const { role, isGiverVerified } = useRole();
  const roleContext = resolveDisputeRoleContext(role, isGiverVerified);
  const disputeRoleData = resolveDisputeRoleData(roleContext);
  const disputeViewText = disputeRoleData.viewCopy;
  const disputeItems = disputeRoleData.items;

  const [subView, setSubView] = useState<DisputeSubView>(null);
  const [filterStatus, setFilterStatus] = useState<DisputeFilterOption>("ALL");

  if (subView?.view === "DisputeDetail") {
    return (
      <DisputeDetail
        disputeId={subView.payload.id}
        onBack={() => setSubView(null)}
      />
    );
  }

  const filtered = filterDisputeItems(disputeItems, filterStatus);
  const statCards = buildDisputeStatCards(disputeItems, disputeViewText);

  return (
    <div className="min-w-0 space-y-4">
      <Surface className="p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-error/10 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-error/70">
            {disputeViewText.hero.eyebrow}
          </p>
          <h1 className="mt-1.5 text-xl font-bold text-base-content sm:text-2xl">
            {disputeViewText.hero.title}
          </h1>
          <p className="mt-1 text-sm text-base-content/65">
            {disputeViewText.hero.description}
          </p>
        </div>
      </Surface>

      <div className="grid gap-3 sm:grid-cols-3">
        {statCards.map((stat) => (
          <Surface key={stat.key} className="p-4">
            <p className="text-xs font-semibold text-base-content/55 uppercase tracking-[0.06em]">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-base-content">
              {stat.value}
            </p>
            <span
              className={cn(
                "mt-2 inline-flex rounded-[8px] px-2.5 py-1 text-[11px] font-semibold",
                stat.tone,
              )}
            >
              {disputeViewText.stats.caseSuffix}
            </span>
          </Surface>
        ))}
      </div>

      <Surface className="p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
          {disputeViewText.layer.eyebrow}
        </p>
        <h2 className="mt-1 text-lg font-bold text-base-content">
          {disputeViewText.layer.title}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {disputeLayers.map((layer) => {
            const layerStyle = resolveDisputeLayerTone(layer.layer);
            return (
              <div
                key={layer.layer}
                className={cn(
                  "rounded-[12px] border p-4",
                  layerStyle.border,
                  layerStyle.bg,
                )}
              >
                <span
                  className={cn(
                    "inline-flex rounded-[8px] px-2.5 py-1 text-[11px] font-bold",
                    layerStyle.badge,
                  )}
                >
                  {disputeViewText.layer.badgePrefix} {layer.layer}
                </span>
                <p className="mt-2 text-sm font-bold text-base-content">
                  {layer.label}
                </p>
                <p className="mt-1.5 text-xs text-base-content/65 leading-relaxed">
                  {layer.description}
                </p>
              </div>
            );
          })}
        </div>
      </Surface>

      <Surface className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
              {disputeViewText.list.eyebrow}
            </p>
            <h2 className="mt-1 text-lg font-bold text-base-content">
              {disputeViewText.list.title}
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {disputeFilterOptions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "btn h-8 min-h-8 rounded-[999px] border-none px-3 text-[11px] shadow-none",
                  filterStatus === status
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content/75 hover:bg-base-300",
                )}
              >
                {disputeFilterLabels[status]}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-base-300 bg-base-100 p-6 text-center">
            <p className="text-sm font-semibold text-base-content/70">
              {disputeViewText.list.emptyMessage}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {filtered.map((dispute) => (
              <DisputeCard
                key={dispute.id}
                dispute={dispute}
                viewText={disputeViewText}
                onViewDetail={() =>
                  setSubView({
                    view: "DisputeDetail",
                    payload: { id: dispute.id },
                  })
                }
              />
            ))}
          </div>
        )}
      </Surface>
    </div>
  );
}

export default DisputeComponent;
