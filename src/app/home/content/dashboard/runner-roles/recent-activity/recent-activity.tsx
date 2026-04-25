import { useState } from "react";
import { Surface } from "../../../../home.ui";
import {
  recentActivities,
  activityFilterOptions,
  activitySummaryStats,
  filterActivities,
  resolveActivityStatusClass,
  resolveRatingStars,
} from "./recent-activity";

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

export function RunnerRecentActivity({ onBack }: { onBack: () => void }) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const filtered = filterActivities(recentActivities, activeFilter);

  return (
    <PageShell
      title="Riwayat Aktivitas"
      eyebrow="Runner Analytics"
      onBack={onBack}
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 mb-5">
        {[
          { label: "Total Quest", value: activitySummaryStats.totalQuest },
          { label: "Pendapatan", value: activitySummaryStats.totalEarned },
          { label: "PP Earned", value: activitySummaryStats.totalPP },
          { label: "Completion", value: activitySummaryStats.completionRate },
          { label: "Avg Durasi", value: activitySummaryStats.avgDuration },
          { label: "Cancel Rate", value: activitySummaryStats.cancelRate },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[10px] bg-base-200 p-2.5 text-center"
          >
            <p className="text-[10px] font-semibold text-base-content/50">
              {stat.label}
            </p>
            <p className="text-sm font-bold text-base-content mt-0.5">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="inline-flex gap-1 rounded-[10px] bg-base-200 p-1 mb-4">
        {activityFilterOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setActiveFilter(opt.value)}
            className={`btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none transition-all ${
              activeFilter === opt.value
                ? "bg-primary text-primary-content"
                : "bg-transparent text-base-content/70 hover:bg-base-100"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 && (
          <div className="rounded-[12px] border-2 border-dashed border-base-300 p-8 text-center">
            <p className="text-sm text-base-content/50">
              Tidak ada aktivitas untuk filter ini.
            </p>
          </div>
        )}
        {filtered.map((act) => (
          <div
            key={act.id}
            className="rounded-[12px] border border-base-300/70 bg-base-100 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-base-content/40">
                  {act.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-[6px] ${resolveActivityStatusClass(act.status)}`}
                >
                  {act.status}
                </span>
                <span className="text-[10px] bg-base-200 px-2 py-0.5 rounded-[5px] font-semibold text-base-content/60">
                  {act.category}
                </span>
              </div>
              <p className="text-sm font-bold text-base-content truncate">
                {act.title}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content/60">
                  📅 {act.date}
                </span>
                <span className="text-[10px] bg-base-200 rounded-[5px] px-1.5 py-0.5 text-base-content/60">
                  ⏱ {act.duration}
                </span>
                {act.ratingGiven && (
                  <span className="text-[10px] bg-[#FEF3C7] text-[#92400E] rounded-[5px] px-1.5 py-0.5 font-semibold">
                    {resolveRatingStars(act.ratingGiven)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <p className="text-sm font-bold text-base-content">
                {act.reward}
              </p>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-[6px] ${
                  act.ppEarned.startsWith("+")
                    ? "bg-[#DCFCE7] text-[#166534]"
                    : act.ppEarned === "Pending"
                      ? "bg-[#FEF3C7] text-[#92400E]"
                      : "bg-[#FEE2E2] text-[#B91C1C]"
                }`}
              >
                {act.ppEarned}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Accordion: Quick Insight */}
      <div className="mt-5">
        <div className="collapse collapse-arrow rounded-[12px] border border-base-300/70 bg-base-100">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-sm font-semibold text-base-content peer-checked:text-primary">
            💡 Insight & Tips Aktivitas
          </div>
          <div className="collapse-content text-sm text-base-content/70 flex flex-col gap-2">
            <p>• Quest Retail memiliki <strong>completion rate tertinggi</strong> (96%) di lokasi lu.</p>
            <p>• Respon di bawah 10 menit meningkatkan match rate hingga <strong>+35%</strong>.</p>
            <p>• Quest kelompok rata-rata memberikan <strong>2.2x PP</strong> dibanding solo.</p>
            <p>• Hindari cancel di jam 07.00–11.00 karena penalty PP lebih besar <strong>1.8x</strong>.</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
