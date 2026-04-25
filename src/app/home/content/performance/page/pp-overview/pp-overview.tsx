import type { PerformanceSummary } from "../../performance";
import { PP_TIER_MAP, resolvePPProgress } from "../../performance";
import { ppOverviewCopy } from "./pp-overview";

type Props = { summary: PerformanceSummary };

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-base-200 bg-base-100 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-base-content/45">
        {label}
      </p>
      <p className="text-2xl font-bold text-base-content">{value}</p>
      {sub && <p className="text-xs font-medium text-base-content/55">{sub}</p>}
    </div>
  );
}

export default function PpOverviewPage({ summary }: Props) {
  const copy = ppOverviewCopy;
  const tier = PP_TIER_MAP[summary.tier];
  const { nextTierPP, progress } = resolvePPProgress(summary.totalPP);

  return (
    <div className="flex flex-col gap-5">
      {/* Tier Badge + Total PP */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-base-200 bg-linear-to-br from-base-100 to-base-200 p-6 text-center sm:flex-row sm:text-left">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-black ${tier.bgClass} ${tier.textClass}`}
          style={{ boxShadow: `0 0 0 4px ${tier.color}33` }}
        >
          {summary.tier === "platinum"
            ? "💎"
            : summary.tier === "gold"
              ? "🥇"
              : summary.tier === "silver"
                ? "🥈"
                : "🥉"}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-base-content/45">
            {copy.tierLabel}
          </p>
          <p className={`text-xl font-black ${tier.textClass}`}>{tier.label}</p>
          <p className="text-4xl font-black text-base-content">
            {summary.totalPP.toLocaleString("id-ID")}{" "}
            <span className="text-base font-semibold text-base-content/50">
              {copy.ppUnit}
            </span>
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-2xl border border-base-200 bg-base-100 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-base-content/60">
            {copy.progressLabel}
          </p>
          {nextTierPP ? (
            <p className="text-xs font-bold text-base-content/70">
              {summary.totalPP.toLocaleString("id-ID")} /{" "}
              {nextTierPP.toLocaleString("id-ID")} PP
            </p>
          ) : (
            <p className="text-xs font-bold text-[#38bdf8]">
              {copy.maxTierText}
            </p>
          )}
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-base-200">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: tier.color,
            }}
          />
        </div>
      </div>

      {/* Rank Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label={copy.globalRankLabel}
          value={
            summary.globalRank ? `#${summary.globalRank}` : copy.noRankText
          }
        />
        <StatCard
          label={copy.provinceRankLabel}
          value={
            summary.provinceRank ? `#${summary.provinceRank}` : copy.noRankText
          }
        />
        <StatCard
          label={copy.cityRankLabel}
          value={summary.cityRank ? `#${summary.cityRank}` : copy.noRankText}
        />
      </div>

      {/* Quest Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label={copy.completedLabel}
          value={summary.totalQuestsCompleted.toString()}
          sub="Sebagai Runner"
        />
        <StatCard
          label={copy.givenLabel}
          value={summary.totalQuestsGiven.toString()}
          sub="Sebagai Giver"
        />
      </div>
    </div>
  );
}
