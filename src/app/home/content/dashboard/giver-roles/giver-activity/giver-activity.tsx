import { useState } from "react";
import { Surface } from "../../../../home.ui";
import {
  giverActivityEntries,
  giverActivityFilterOptions,
  giverActivitySummary,
  filterGiverActivities,
  resolveGiverActivityStatusClass,
  resolveEscrowStatusClass,
  resolveSlotFillRate,
} from "./giver.activity";

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

export function GiverActivityDetail({ onBack }: { onBack: () => void }) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const filtered = filterGiverActivities(giverActivityEntries, activeFilter);

  return (
    <PageShell
      title="Riwayat Aktivitas Giver"
      eyebrow="Giver Analytics"
      onBack={onBack}
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 mb-5">
        {[
          { label: "Broadcast", value: giverActivitySummary.totalBroadcast },
          { label: "Total Spent", value: giverActivitySummary.totalSpent },
          { label: "Completion", value: giverActivitySummary.completionRate },
          { label: "Avg Fill", value: giverActivitySummary.avgFillTime },
          { label: "Runner Dipekerjakan", value: giverActivitySummary.totalRunnerHired },
          { label: "Escrow Aktif", value: giverActivitySummary.activeEscrow },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[10px] bg-base-200 p-2.5 text-center">
            <p className="text-[10px] font-semibold text-base-content/50">{stat.label}</p>
            <p className="text-sm font-bold text-base-content mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 flex-wrap mb-4">
        {giverActivityFilterOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setActiveFilter(opt.value)}
            className={`btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none transition-all ${
              activeFilter === opt.value
                ? "bg-primary text-primary-content"
                : "bg-base-200 text-base-content/70 hover:bg-base-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="rounded-[12px] border-2 border-dashed border-base-300 p-8 text-center">
            <p className="text-sm text-base-content/50">Tidak ada quest untuk filter ini.</p>
          </div>
        )}
        {filtered.map((act) => {
          const fillRate = resolveSlotFillRate(act.runnerCount, act.totalSlot);
          return (
            <div
              key={act.id}
              className="rounded-[12px] border border-base-300/70 bg-base-100 p-4 flex flex-col gap-2.5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[10px] font-bold text-base-content/40">{act.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[6px] ${resolveGiverActivityStatusClass(act.status)}`}>
                      {act.status}
                    </span>
                    <span className="text-[10px] bg-base-200 px-2 py-0.5 rounded-[5px] font-semibold text-base-content/60">
                      {act.category}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-base-content">{act.questTitle}</p>
                </div>
                <p className="text-sm font-bold text-base-content shrink-0">{act.totalCost}</p>
              </div>

              {/* Slot Progress */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-semibold text-base-content/50">
                    Slot terisi: {act.runnerCount}/{act.totalSlot}
                  </p>
                  <p className="text-[10px] font-bold text-base-content/60">
                    {fillRate}%
                  </p>
                </div>
                <div className="h-1.5 rounded-full bg-base-200">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all"
                    style={{ width: `${fillRate}%` }}
                  />
                </div>
              </div>

              {/* Footer Meta */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content/60">
                  📣 {act.broadcastDate}
                </span>
                {act.completionDate && (
                  <span className="text-[10px] bg-[#DCFCE7] text-[#166534] rounded-[5px] px-1.5 py-0.5 font-semibold">
                    ✅ {act.completionDate}
                  </span>
                )}
                <span className={`text-[10px] font-semibold bg-base-100 border border-base-300 px-1.5 py-0.5 rounded-[5px] ${resolveEscrowStatusClass(act.escrowStatus)}`}>
                  Escrow: {act.escrowStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight Accordion */}
      <div className="mt-5">
        <div className="collapse collapse-arrow rounded-[12px] border border-base-300/70 bg-base-100">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-sm font-semibold text-base-content peer-checked:text-primary">
            💡 Insight Broadcast Giver
          </div>
          <div className="collapse-content text-sm text-base-content/70 flex flex-col gap-2">
            <p>• Quest broadcast jam <strong>07.00–09.00</strong> rata-rata terisi <strong>3x lebih cepat</strong>.</p>
            <p>• Quest kelompok memiliki <strong>fill rate 84%</strong> vs 91% untuk solo.</p>
            <p>• Menyertakan detail lokasi GPS meningkatkan match speed hingga <strong>+40%</strong>.</p>
            <p>• Escrow yang ditahan lebih dari 24 jam berpotensi meningkatkan dispute rate.</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
