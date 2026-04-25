import { Surface } from "../../../../home.ui";
import {
  giverTrustBadges,
  giverPaymentRecords,
  giverStateWarnings,
  giverStateSummary,
  resolveBadgeTierClass,
  resolvePaymentTypeClass,
  resolveWarningClass,
} from "./state";

function PageShell({
  title,
  eyebrow,
  onBack,
  children,
}: {
  title: string;
  eyebrow: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Surface className="p-5 sm:p-6 bg-base-100 border border-base-300">
        <div className="flex items-center justify-between mb-6 border-b border-base-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/70 mb-1">
              {eyebrow}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-base-content">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="btn h-10 min-h-10 px-5 cursor-pointer rounded-[8px] bg-base-200 text-base-content/70 border-none hover:bg-base-300 shadow-none transition-transform active:scale-95"
          >
            Kembali
          </button>
        </div>
        {children}
      </Surface>
    </div>
  );
}

export function GiverStateDetail({ onBack }: { onBack: () => void }) {
  return (
    <PageShell
      title="Status & Reputasi Giver"
      eyebrow="Giver Analytics"
      onBack={onBack}
    >
      {/* Account Summary */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 mb-5">
        {[
          { label: "Tier", value: giverStateSummary.tier },
          { label: "Trust Score", value: giverStateSummary.trustScore },
          { label: "Quest Diposting", value: giverStateSummary.totalQuestPosted },
          { label: "Total Spent", value: giverStateSummary.totalSpent },
          { label: "Completion", value: giverStateSummary.completionRate },
          { label: "Bergabung", value: giverStateSummary.joinedAt },
        ].map((item) => (
          <div key={item.label} className="rounded-[10px] bg-base-200 p-3">
            <p className="text-[10px] font-semibold text-base-content/50">{item.label}</p>
            <p className="text-sm font-bold text-base-content mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Trust Score Visual */}
      <div className="mb-5 rounded-[12px] border border-base-300/70 bg-base-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-base-content/50">
            Trust Score
          </p>
          <span className="text-lg font-bold text-primary">92/100</span>
        </div>
        <div className="h-3 rounded-full bg-base-200">
          <div
            className="h-3 rounded-full bg-primary transition-all duration-700"
            style={{ width: "92%" }}
          />
        </div>
        <p className="mt-2 text-[11px] text-base-content/50">
          Skor dihitung dari reliabilitas pembayaran, completion rate, dan review dari runner.
        </p>
      </div>

      {/* Warnings */}
      {giverStateWarnings.length > 0 && (
        <div className="flex flex-col gap-2 mb-5">
          {giverStateWarnings.map((w) => (
            <div
              key={w.id}
              className={`rounded-[10px] border p-3 text-xs font-semibold ${resolveWarningClass(w.type)}`}
            >
              {w.type === "warning" ? "⚠️" : w.type === "danger" ? "🚨" : "💡"} {w.message}
            </div>
          ))}
        </div>
      )}

      {/* Badges */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-base-content/50 mb-3">
          Lencana Kepercayaan
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {giverTrustBadges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-[12px] p-3 flex items-start gap-3 ${resolveBadgeTierClass(badge.tier)}`}
            >
              <div className="shrink-0 text-2xl">🏅</div>
              <div>
                <p className="text-sm font-bold">{badge.label}</p>
                <p className="text-[11px] opacity-75 mt-0.5">{badge.description}</p>
                <p className="text-[10px] mt-1 opacity-60">✅ {badge.earnedAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-base-content/50 mb-3">
          Riwayat Transaksi Escrow
        </p>
        <div className="flex flex-col gap-2">
          {giverPaymentRecords.map((pay) => (
            <div
              key={pay.id}
              className="rounded-[10px] border border-base-300/70 bg-base-100 p-3 flex items-center justify-between gap-2"
            >
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-base-content/40">{pay.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[6px] ${resolvePaymentTypeClass(pay.type)}`}>
                    {pay.type}
                  </span>
                </div>
                <p className="text-xs font-semibold text-base-content truncate">
                  {pay.description}
                </p>
                <p className="text-[10px] text-base-content/50">{pay.date}</p>
              </div>
              <p className="text-sm font-bold text-base-content shrink-0">{pay.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion: Upgrade Tips */}
      <div className="mt-5">
        <div className="collapse collapse-arrow rounded-[12px] border border-base-300/70 bg-base-100">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-sm font-semibold text-base-content peer-checked:text-primary">
            🚀 Cara Meningkatkan Trust Score
          </div>
          <div className="collapse-content text-sm text-base-content/70 flex flex-col gap-2">
            <p>• Selesaikan quest tanpa ada dispute setidaknya <strong>15 quest berturut.</strong></p>
            <p>• Respon complaint runner dalam <strong>kurang dari 1 jam.</strong></p>
            <p>• Berikan brief quest yang lengkap — runner lebih suka giver yang jelas instruksinya.</p>
            <p>• Escrow yang di-release tepat waktu meningkatkan trust score <strong>+3 poin</strong> per quest.</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
