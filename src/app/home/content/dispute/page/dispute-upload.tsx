import { useRef, useState } from "react";
import { ArrowLeftIcon } from "../../../home.icons";
import { cn, Surface } from "../../../home.ui";
import {
  disputeItems,
  disputeStatusMeta,
  type DisputeEvidence,
} from "../dispute";

type UploadItem = {
  id: string;
  label: string;
  type: "PHOTO" | "VIDEO" | "NOTE";
  note?: string;
};

export function DisputeUpload({
  disputeId,
  onBack,
}: {
  disputeId: string;
  onBack: () => void;
}) {
  const dispute =
    disputeItems.find((d) => d.id === disputeId) || disputeItems[0];
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

  if (submitted) {
    return (
      <div className="flex flex-col gap-4 animate-in fade-in duration-300">
        <button
          type="button"
          onClick={onBack}
          className="btn btn-sm border-base-300 bg-base-100/50 hover:bg-base-200 self-start gap-2 h-10 px-4 rounded-[10px] text-base-content/80 shadow-sm"
        >
          <ArrowLeftIcon className="size-4" />
          Kembali ke Dispute Center
        </button>
        <Surface className="p-8 flex flex-col items-center text-center gap-4">
          <div className="size-16 rounded-full bg-[#DCFCE7] flex items-center justify-center text-3xl">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-base-content">
            Bukti Berhasil Disubmit!
          </h1>
          <p className="text-base-content/65 max-w-md">
            {uploads.length} bukti baru telah dikirim. Tim mediator QQ akan
            mereview dan memberikan keputusan dalam 1×24 jam kerja.
          </p>
          <div className="rounded-[12px] border border-[#A046FF]/30 bg-[#A046FF]/5 p-4 max-w-sm w-full">
            <p className="text-sm font-bold text-[#6D28D9]">
              Status: Dalam Review Mediator
            </p>
            <p className="text-xs text-[#6D28D9]/70 mt-1">
              Anda akan mendapat notifikasi saat keputusan final ditetapkan.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="btn h-11 px-8 rounded-[10px] border-none bg-primary text-primary-content font-bold shadow-none hover:opacity-90"
          >
            Kembali ke Dispute Center
          </button>
        </Surface>
      </div>
    );
  }

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

      <Surface className="p-5 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-error/10 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-error">
              Upload Bukti — {dispute.id}
            </p>
            <span
              className={cn(
                "rounded-[8px] px-2.5 py-1 text-[11px] font-bold",
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
          <div className="mt-1 flex flex-wrap gap-3 text-sm text-base-content/60">
            <span>
              Nilai:{" "}
              <strong className="text-[#10B981]">{dispute.amount}</strong>
            </span>
            <span>
              Diajukan oleh: <strong>{dispute.raisedBy}</strong>
            </span>
            <span>
              Deadline: <strong>{dispute.evidenceDeadline}</strong>
            </span>
          </div>
        </div>
      </Surface>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Upload Panel */}
        <div className="space-y-4">
          <Surface className="p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
              Layer 2 — Kirim Buktimu
            </p>
            <h2 className="mt-1 text-lg font-bold text-base-content">
              Upload Foto / Video / Catatan
            </h2>
            <p className="mt-1 text-sm text-base-content/65">
              Sistem memberi waktu 24 jam untuk submit bukti. Bukti yang
              disubmit menjadi dasar keputusan mediator.
            </p>

            {/* Upload Buttons */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => addMedia("PHOTO")}
                className="btn h-20 flex-col rounded-[12px] border-2 border-dashed border-[#38BDF8]/50 bg-[#38BDF8]/5 text-[#38BDF8] hover:bg-[#38BDF8]/10 gap-1.5 shadow-none"
              >
                <span className="text-2xl">🖼️</span>
                <span className="text-xs font-bold">Upload Foto</span>
              </button>
              <button
                type="button"
                onClick={() => addMedia("VIDEO")}
                className="btn h-20 flex-col rounded-[12px] border-2 border-dashed border-[#A046FF]/50 bg-[#A046FF]/5 text-[#A046FF] hover:bg-[#A046FF]/10 gap-1.5 shadow-none"
              >
                <span className="text-2xl">🎥</span>
                <span className="text-xs font-bold">Upload Video</span>
              </button>
            </div>

            {/* Note Input */}
            <div className="mt-4">
              <label className="text-xs font-bold text-base-content/70">
                Tambah Catatan / Keterangan
              </label>
              <div className="mt-1.5 flex gap-2">
                <textarea
                  className="textarea textarea-bordered flex-1 h-20 text-sm focus:border-primary bg-base-100"
                  placeholder="Jelaskan konteks bukti yang kamu upload..."
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
                    className="flex items-center gap-3 rounded-[10px] border border-base-300/70 bg-base-100 p-2.5"
                  >
                    <span className="text-lg">
                      {item.type === "PHOTO"
                        ? "🖼️"
                        : item.type === "VIDEO"
                          ? "🎥"
                          : "📝"}
                    </span>
                    <p className="flex-1 text-xs text-base-content line-clamp-1">
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

            <div className="mt-6 border-t border-base-200 pt-4">
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                disabled={uploads.length === 0}
                className="btn h-12 w-full rounded-[10px] border-none bg-linear-to-r from-[#38BDF8] to-[#A046FF] text-white font-bold shadow-lg shadow-[#38BDF8]/20 transition-transform active:scale-95 disabled:opacity-40"
              >
                {uploads.length > 0
                  ? `Submit ${uploads.length} Bukti ke Mediator`
                  : "Tambah bukti terlebih dahulu"}
              </button>
            </div>
          </Surface>
        </div>

        {/* Existing Evidence Panel */}
        <div className="space-y-4">
          <Surface className="p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
              Bukti yang Sudah Ada
            </p>
            <h2 className="mt-1 text-lg font-bold text-base-content">
              {allEvidence.length} Bukti Tersimpan
            </h2>
            <div className="mt-3 space-y-2">
              {allEvidence.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-base-300 p-4 text-center">
                  <p className="text-sm text-base-content/60">
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

          {dispute.mediatorNote && (
            <Surface className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6D28D9]">
                Layer 3 — Catatan Mediator
              </p>
              <p className="mt-2 text-sm text-base-content/80 leading-relaxed">
                {dispute.mediatorNote}
              </p>
            </Surface>
          )}
        </div>
      </div>
    </div>
  );
}

function EvidenceCard({ evidence }: { evidence: DisputeEvidence }) {
  const iconMap = { PHOTO: "🖼️", VIDEO: "🎥", NOTE: "📝" } as const;
  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-base-300/70 bg-base-100 p-3">
      <span className="text-xl mt-0.5">{iconMap[evidence.type]}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-base-content">
          {evidence.label}
        </p>
        <p className="mt-0.5 text-[11px] text-base-content/55">
          {evidence.uploader} · {evidence.uploadedAt}
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-[8px] px-2 py-0.5 text-[10px] font-bold",
          evidence.type === "PHOTO"
            ? "bg-[#DBEAFE] text-[#1D4ED8]"
            : evidence.type === "VIDEO"
              ? "bg-[#E9D5FF] text-[#6D28D9]"
              : "bg-base-200 text-base-content/70",
        )}
      >
        {evidence.type}
      </span>
    </div>
  );
}
