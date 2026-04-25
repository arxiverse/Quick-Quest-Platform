import { useRef, useState } from "react";
import { ArrowLeftIcon } from "../../../home.icons";
import { cn, Surface } from "../../../home.ui";
import {
  disputeItems,
  disputeStatusMeta,
  type DisputeEvidence,
  type DisputeItem,
} from "../dispute";
import { disputeGiverItems } from "../dispute.service";

type UploadItem = {
  id: string;
  label: string;
  type: "PHOTO" | "VIDEO" | "NOTE";
  note?: string;
};

// Combine lists just for lookup in this nested view
const allKnownDisputes = [...disputeItems, ...disputeGiverItems];

export function DisputeDetail({
  disputeId,
  onBack,
}: {
  disputeId: string;
  onBack: () => void;
}) {
  const dispute =
    allKnownDisputes.find((d) => d.id === disputeId) || allKnownDisputes[0];
  const meta = disputeStatusMeta[dispute.status];

  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [noteText, setNoteText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addNote() {
    if (!noteText.trim()) return;
    setUploads((prev) => [
      ...prev,
      {
        id: `up-${Date.now()}`,
        label: noteText,
        type: "NOTE",
        note: noteText,
      },
    ]);
    setNoteText("");
  }

  function addMedia(type: "PHOTO" | "VIDEO") {
    setUploads((prev) => [
      ...prev,
      {
        id: `up-${Date.now()}`,
        label: type === "PHOTO" ? "Foto bukti baru" : "Video bukti baru",
        type,
      },
    ]);
  }

  function removeUpload(id: string) {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }

  const allEvidence: DisputeEvidence[] = [
    ...dispute.giverEvidence,
    ...dispute.runnerEvidence,
  ];

  const isResolved =
    dispute.status.startsWith("RESOLVED") || dispute.status === "DISMISSED";
  const isUnderReview = dispute.status === "UNDER_REVIEW";
  const needsEvidence = !isResolved && !isUnderReview;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onBack}
        className="btn btn-sm border-base-300 bg-base-100/50 hover:bg-base-200 self-start gap-2 h-10 px-4 rounded-[10px] text-base-content/80 shadow-sm"
      >
        <ArrowLeftIcon className="size-4" />
        Kembali ke Dispute Center
      </button>

      {/* The Context Header */}
      <Surface className="p-5 sm:p-7 relative overflow-hidden">
        <div
          className={cn(
            "absolute top-0 right-0 h-32 w-32 rounded-bl-full blur-2xl pointer-events-none opacity-40",
            isResolved
              ? "bg-success"
              : isUnderReview
                ? "bg-primary"
                : "bg-error",
          )}
        />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/60">
              ID Mediasi: {dispute.id}
            </p>
            <span
              className={cn(
                "rounded-[8px] px-2.5 py-1 text-[11px] font-bold shadow-sm",
                meta.bg,
                meta.color,
              )}
            >
              {meta.label}
            </span>
          </div>
          <h1 className="mt-2 text-xl font-bold text-base-content sm:text-2xl">
            {dispute.questTitle}
          </h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-base-content/70">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                Escrow Value
              </span>
              <strong className="text-[#10B981] text-base">
                {dispute.amount}
              </strong>
            </div>
            <div className="flex flex-col border-l border-base-300 pl-4">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                Diajukan Oleh
              </span>
              <strong className="text-base-content">{dispute.raisedBy}</strong>
            </div>
            {dispute.resolvedAt && (
              <div className="flex flex-col border-l border-base-300 pl-4">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                  Tanggal Diputus
                </span>
                <strong className="text-base-content tracking-tight">
                  {dispute.resolvedAt}
                </strong>
              </div>
            )}
          </div>
        </div>
      </Surface>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        {/* The Action / Resolution Block */}
        <div className="space-y-4 flex flex-col">
          {needsEvidence && !submitted && (
            <Surface className="p-4 sm:p-5 flex-1 relative overflow-hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                Layer 2 — Kirim Buktimu
              </p>
              <h2 className="mt-1 text-lg font-bold text-base-content">
                Upload Foto / Video / Catatan
              </h2>
              <p className="mt-1 text-sm text-base-content/65">
                Sistem memberi waktu 24 jam untuk submit bukti. Bukti yang
                disubmit menjadi dasar keputusan mediator (Tenggat:{" "}
                {dispute.evidenceDeadline}).
              </p>

              {/* Upload Buttons */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => addMedia("PHOTO")}
                  className="btn h-20 flex-col rounded-[12px] border-2 border-dashed border-[#38BDF8]/50 bg-[#38BDF8]/5 text-[#38BDF8] hover:bg-[#38BDF8]/10 gap-1.5 shadow-none group"
                >
                  <span className="text-2xl group-active:scale-95 transition-transform">
                    🖼️
                  </span>
                  <span className="text-xs font-bold">Upload Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => addMedia("VIDEO")}
                  className="btn h-20 flex-col rounded-[12px] border-2 border-dashed border-[#A046FF]/50 bg-[#A046FF]/5 text-[#A046FF] hover:bg-[#A046FF]/10 gap-1.5 shadow-none group"
                >
                  <span className="text-2xl group-active:scale-95 transition-transform">
                    🎥
                  </span>
                  <span className="text-xs font-bold">Upload Video</span>
                </button>
              </div>

              {/* Note Input */}
              <div className="mt-4">
                <label className="text-xs font-bold text-base-content/70">
                  Tambah Catatan / Keterangan Pembelaan
                </label>
                <div className="mt-1.5 flex gap-2">
                  <textarea
                    className="textarea textarea-bordered flex-1 h-20 text-sm focus:border-primary bg-base-100"
                    placeholder="Contoh: Pekerjaan sudah selesai 100% pada jam..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={addNote}
                  disabled={!noteText.trim()}
                  className="btn btn-sm mt-2 rounded-[8px] border-none bg-base-200 text-base-content/80 hover:bg-base-300 shadow-none disabled:opacity-40"
                >
                  + Tambah Catatan
                </button>
              </div>

              {/* Upload Queue */}
              {uploads.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-base-content/55">
                    Antrean Upload ({uploads.length})
                  </p>
                  {uploads.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-[10px] border border-base-300/70 bg-base-100 p-2.5 shadow-xs"
                    >
                      <span className="text-lg">
                        {item.type === "PHOTO"
                          ? "🖼️"
                          : item.type === "VIDEO"
                            ? "🎥"
                            : "📝"}
                      </span>
                      <p className="flex-1 text-xs text-base-content font-medium line-clamp-1">
                        {item.label}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeUpload(item.id)}
                        className="btn btn-xs rounded border-none bg-error/10 text-error hover:bg-error/20 shadow-none h-6 px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept="image/*,video/*"
              />

              <div className="mt-6 border-t border-base-200 pt-4 relative z-10 bg-base-100">
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  disabled={uploads.length === 0}
                  className="btn h-12 w-full rounded-[10px] border-none bg-linear-to-r from-[#38BDF8] to-[#A046FF] text-white font-bold shadow-lg shadow-[#38BDF8]/20 transition-transform active:scale-95 disabled:opacity-40 disabled:shadow-none"
                >
                  {uploads.length > 0
                    ? `Submit ${uploads.length} Bukti ke Mediator`
                    : "Tambah bukti terlebih dahulu"}
                </button>
              </div>
            </Surface>
          )}

          {(submitted || isUnderReview) && !isResolved && (
            <Surface className="p-8 flex-1 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden bg-linear-to-b from-base-100 to-base-200/50">
              <div className="absolute inset-0 z-0 bg-[#A046FF]/5 animate-pulse" />
              <div className="size-20 rounded-full bg-[#A046FF]/10 flex items-center justify-center relative z-10 border-4 border-base-100 shadow-xl shadow-[#A046FF]/20">
                <span className="text-4xl animate-bounce">⚖️</span>
              </div>
              <h1 className="text-xl font-bold text-base-content relative z-10">
                Dalam Review Panel Mediator
              </h1>
              <p className="text-sm text-base-content/65 max-w-sm relative z-10">
                Laporan Anda dan bukti-bukti sedang ditinjau. Sistem Escrow
                mengunci dana secara aman hingga keputusan final ditetapkan
                secara objektif.
              </p>
              {dispute.mediatorNote && (
                <div className="mt-2 rounded-[12px] border border-[#A046FF]/30 bg-base-100 p-4 max-w-md w-full relative z-10 shadow-sm text-left">
                  <p className="text-[10px] font-bold text-[#A046FF] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <span className="relative flex size-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A046FF] opacity-75"></span>
                      <span className="relative inline-flex rounded-full size-2 bg-[#8B5CF6]"></span>
                    </span>
                    Update Mediator Live
                  </p>
                  <p className="text-sm text-base-content/80 font-medium">
                    "{dispute.mediatorNote}"
                  </p>
                </div>
              )}
            </Surface>
          )}

          {isResolved && <ResolutionSettlementInvoice dispute={dispute} />}
        </div>

        {/* Existing Evidence Panel & Timeline */}
        <div className="space-y-4">
          <Surface className="p-4 sm:p-5 relative overflow-hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50 mb-4">
              Riwayat Penanganan
            </p>
            <div className="relative pl-3 space-y-5 border-l-2 border-base-300 ml-2">
              {dispute.timeline.map((event, index) => {
                const isLast = index === dispute.timeline.length - 1;
                const isActive = !isResolved && isLast;
                return (
                  <div key={index} className="relative">
                    <span
                      className={cn(
                        "absolute -left-[18.5px] top-1 rounded-full border-2",
                        isActive
                          ? "size-3.5 border-primary bg-base-100 ring-4 ring-primary/20 animate-pulse"
                          : isResolved && isLast
                            ? "size-3.5 border-success bg-base-100"
                            : "size-3 border-base-300 bg-base-200",
                      )}
                    />
                    <p
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        isActive ? "text-primary" : "text-base-content/50",
                      )}
                    >
                      {event.time}
                    </p>
                    <p className="text-sm font-semibold text-base-content mt-0.5">
                      {event.status.replace("_", " ")}
                    </p>
                    <p className="text-xs text-base-content/70 mt-1 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Surface>

          <Surface className="p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50 flex justify-between items-center">
              <span>Arsip Bukti Digital</span>
              <span className="text-base-content font-bold">
                {allEvidence.length} Item
              </span>
            </p>
            <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {allEvidence.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-base-300 bg-base-100/50 p-6 text-center shadow-inner">
                  <span className="text-2xl opacity-50 mb-2 block">🗂️</span>
                  <p className="text-sm text-base-content/60 font-medium">
                    Belum ada bukti diupload.
                  </p>
                </div>
              ) : (
                allEvidence.map((ev) => (
                  <EvidenceCard key={ev.id} evidence={ev} />
                ))
              )}
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}

function ResolutionSettlementInvoice({ dispute }: { dispute: DisputeItem }) {
  // Parsing amount
  const rawAmtStr = dispute.amount.replace(/[^0-9]/g, "");
  const baseValue = parseInt(rawAmtStr, 10) || 500000;

  let giverShare = 0;
  let runnerShare = 0;
  const sysFeeShare = Math.floor(baseValue * 0.04);
  const pool = baseValue - sysFeeShare;

  if (dispute.status === "RESOLVED_GIVER") {
    giverShare = pool;
  } else if (dispute.status === "RESOLVED_RUNNER") {
    runnerShare = pool;
  } else if (dispute.status === "RESOLVED_PARTIAL") {
    giverShare = Math.floor(baseValue * 0.48);
    runnerShare = Math.floor(baseValue * 0.48);
  }

  const fmt = (num: number) => `Rp ${num.toLocaleString("id-ID")}`;

  const outcomeTitle =
    dispute.status === "RESOLVED_GIVER"
      ? "Giver Menang (100% Refund)"
      : dispute.status === "RESOLVED_RUNNER"
        ? "Runner Menang (100% Release)"
        : "Penyelesaian Adil (50:50 Partial)";

  return (
    <Surface className="p-0 sm:p-0 flex-1 relative overflow-hidden bg-base-100 border-success/30 flex flex-col justify-between">
      <div className="p-6 sm:p-8 relative z-10 flex flex-col items-center border-b border-dashed border-base-300">
        <div className="absolute inset-x-0 -top-24 h-48 bg-[#10B981]/10 blur-3xl pointer-events-none" />
        <div className="size-16 rounded-full bg-success/20 text-success flex items-center justify-center text-3xl mb-4 border-2 border-success/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-base-content text-center leading-tight">
          Sengketa Dihentikan
        </h2>
        <p className="text-sm font-semibold text-success mt-1 border border-success/20 bg-success/10 px-3 py-1 rounded-[8px] uppercase tracking-wider">
          {outcomeTitle}
        </p>

        {dispute.mediatorNote && (
          <p className="mt-5 text-[13px] text-base-content/70 text-center leading-relaxed max-w-md italic border-l-2 border-success pl-3">
            "{dispute.mediatorNote}" <br />
            <span className="text-[10px] not-italic font-bold text-base-content/40 mt-1 block uppercase">
              — Platform Mediator Panel
            </span>
          </p>
        )}
      </div>

      <div className="p-6 sm:p-8 bg-base-200/50">
        <p className="text-[11px] font-bold uppercase tracking-widest text-base-content/50 mb-4 block">
          Rincian Distribusi Escrow
        </p>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between items-center text-base-content/60 pb-2 border-b border-base-300">
            <span>Nilai Awal (Held in Escrow)</span>
            <span>{fmt(baseValue)}</span>
          </div>

          <div className="flex justify-between items-center font-bold text-base-content">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#38BDF8]" /> Dikembalikan
              ke Giver
            </span>
            <span>{fmt(giverShare)}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-base-content">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#A046FF]" /> Diteruskan
              ke Runner Wallet
            </span>
            <span>{fmt(runnerShare)}</span>
          </div>
          <div className="flex justify-between items-center text-base-content/50 italic text-xs pt-2 border-t border-base-300">
            <span>Platform Service Fee (Mediation)</span>
            <span>- {fmt(sysFeeShare)}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center border border-[#10B981]/20 bg-[#10B981]/5 px-4 py-3 rounded-[12px] shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl drop-shadow-sm">🔒</span>
            <p className="text-xs font-bold text-[#10B981]/80 leading-tight">
              Blockchain <br /> Settlement
            </p>
          </div>
          <p className="text-[10px] font-mono text-base-content/50 text-right opacity-80 break-all w-[150px]">
            TxHash: <br />
            0x{Math.random().toString(16).substr(2, 10).toUpperCase()}...
          </p>
        </div>
      </div>
    </Surface>
  );
}

function EvidenceCard({ evidence }: { evidence: DisputeEvidence }) {
  const iconMap = { PHOTO: "🖼️", VIDEO: "🎥", NOTE: "📝" } as const;
  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-base-300/70 bg-base-100 p-3 hover:bg-base-200/50 transition-colors">
      <span className="text-xl mt-0.5">{iconMap[evidence.type]}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-base-content">
          {evidence.label}
        </p>
        <p className="mt-0.5 text-[11px] text-base-content/55 font-medium">
          <span className="text-primary">{evidence.uploader}</span> ·{" "}
          {evidence.uploadedAt}
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-[8px] px-2 py-0.5 text-[10px] font-bold shadow-xs",
          evidence.type === "PHOTO"
            ? "bg-[#DBEAFE] text-[#1D4ED8] border border-[#1D4ED8]/20"
            : evidence.type === "VIDEO"
              ? "bg-[#E9D5FF] text-[#6D28D9] border border-[#6D28D9]/20"
              : "bg-base-200 text-base-content/70 border border-base-300",
        )}
      >
        {evidence.type}
      </span>
    </div>
  );
}
