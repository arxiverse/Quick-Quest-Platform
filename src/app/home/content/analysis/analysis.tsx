import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn, Surface } from "../../home.ui";
import {
  analysisCohortRetentionPoints,
  analysisCompareByRange,
  analysisEscrowStatePoints,
  analysisFunnelByRange,
  analysisGeoScopeOptions,
  analysisGeoScopeSnapshots,
  analysisInsightCards,
  analysisKpiItems,
  analysisLeaderboardMovementGroups,
  analysisPendingAgingPoints,
  analysisPpGrowthPoints,
  analysisRiskPoints,
  analysisSlaMetrics,
  analysisSlaOutliers,
  analysisSlaResponsePoints,
  analysisSupplyDemandByGranularity,
  analysisSupplyGranularityOptions,
  analysisTimeRangeOptions,
  analysisTopContributors,
  type AnalysisGeoScopeKey,
  type AnalysisLeaderboardScope,
  type AnalysisSupplyGranularity,
  type AnalysisTimeRange,
} from "./analysis";

type TooltipRow = {
  color?: string;
  dataKey?: string | number;
  name?: string;
  value?: string | number;
};

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipRow[]; label?: string }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-[10px] border border-base-300/70 bg-base-100/95 px-3 py-2 shadow-lg backdrop-blur">
      {label && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">{label}</p>}
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={`${entry.dataKey}-${entry.name}`} className="flex items-center gap-2 text-sm text-base-content">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.color ?? "#A046FF" }} />
            <span className="font-medium text-base-content/65">{entry.name}</span>
            <span className="font-bold text-base-content">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function geoLabel(scope: AnalysisGeoScopeKey): string {
  if (scope === "LT_2") {
    return "< 2 km";
  }
  if (scope === "GTE_2") {
    return ">= 2 km";
  }
  return "Semua Radius";
}

function riskSeverityTone(level: "Low" | "Medium" | "High") {
  if (level === "High") {
    return "bg-[#FECACA] text-[#991B1B]";
  }
  if (level === "Medium") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  return "bg-[#DCFCE7] text-[#166534]";
}

function insightImpactTone(level: "Low" | "Medium" | "High") {
  if (level === "High") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  if (level === "Medium") {
    return "bg-[#E9D5FF] text-[#6D28D9]";
  }
  return "bg-[#DCFCE7] text-[#166534]";
}

function AnalysisComponent() {
  const [timeRange, setTimeRange] = useState<AnalysisTimeRange>("7D");
  const [geoScope, setGeoScope] = useState<AnalysisGeoScopeKey>("ALL");
  const [granularity, setGranularity] = useState<AnalysisSupplyGranularity>("Jam");
  const [leaderboardScope, setLeaderboardScope] = useState<AnalysisLeaderboardScope>("Lokal");

  const compareCards = analysisCompareByRange[timeRange];
  const funnelPoints = analysisFunnelByRange[timeRange];
  const geoSnapshot = analysisGeoScopeSnapshots[geoScope];
  const supplyDemandPoints = analysisSupplyDemandByGranularity[granularity];
  const leaderboardMovement = analysisLeaderboardMovementGroups.find((group) => group.scope === leaderboardScope) ?? analysisLeaderboardMovementGroups[0];
  const maxFunnel = Math.max(...funnelPoints.map((item) => item.value), 1);
  const maxEscrow = Math.max(...analysisEscrowStatePoints.map((item) => item.total), 1);
  const maxPp = Math.max(...analysisPpGrowthPoints.map((item) => item.pp), 1);

  let busiest = supplyDemandPoints[0];
  let quietest = supplyDemandPoints[0];
  for (const point of supplyDemandPoints) {
    if (point.demand > busiest.demand) {
      busiest = point;
    }
    if (point.demand < quietest.demand) {
      quietest = point;
    }
  }

  return (
    <div className="min-w-0 space-y-4">
      <Surface className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/45">Analisis QQM</p>
            <h1 className="mt-1 text-xl font-bold text-base-content sm:text-2xl">Command Center - Metrics, Funnel, Supply</h1>
          </div>
          <div className="inline-flex rounded-[10px] bg-base-200 p-1">
            {analysisTimeRangeOptions.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={cn(
                  "btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none",
                  timeRange === range ? "bg-primary text-primary-content" : "bg-transparent text-base-content/75 hover:bg-base-100"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </Surface>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {analysisKpiItems.map((metric) => (
          <Surface key={metric.label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content/55">{metric.label}</p>
            <p className="mt-2 text-xl font-bold text-base-content">{metric.value}</p>
            <span className={cn("mt-2 inline-flex rounded-[8px] px-2.5 py-1 text-[11px] font-semibold text-black", metric.tone)}>{metric.delta}</span>
          </Surface>
        ))}
      </div>

      <Surface className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Time Range + Compare</p>
            <h2 className="mt-1 text-lg font-bold text-base-content">Perbandingan dengan Periode Sebelumnya</h2>
          </div>
          <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/70">{timeRange} aktif</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {compareCards.map((card) => (
            <div key={card.label} className="rounded-[11px] border border-base-300/70 bg-base-100 p-3.5">
              <p className="text-xs font-semibold text-base-content/55">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-base-content">{card.value}</p>
              <span className={cn("mt-2 inline-flex rounded-[8px] px-2.5 py-1 text-[11px] font-semibold text-black", card.tone)}>{card.delta}</span>
            </div>
          ))}
        </div>
      </Surface>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Quest Funnel</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Posted to Match to In Progress to Released/Disputed</h2>
          <div className="mt-4 space-y-3">
            {funnelPoints.map((point, index) => {
              const conversion = index === 0 ? "100%" : `${Math.round((point.value / funnelPoints[index - 1].value) * 100)}%`;
              return (
                <div key={point.stage} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-base-content">{point.stage}</p>
                    <div className="text-right">
                      <p className="text-sm font-bold text-base-content">{point.value}</p>
                      <p className="text-[11px] font-semibold text-base-content/60">conv {conversion}</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-base-200">
                    <div className="h-2 rounded-full bg-[#6B21FF]" style={{ width: `${Math.round((point.value / maxFunnel) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Geo Scope Analytics</p>
              <h2 className="mt-1 text-lg font-bold text-base-content">Radius, Kandidat Runner, Heat Area</h2>
            </div>
            <div className="inline-flex rounded-[10px] bg-base-200 p-1">
              {analysisGeoScopeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setGeoScope(option)}
                  className={cn(
                    "btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none",
                    geoScope === option ? "bg-primary text-primary-content" : "bg-transparent text-base-content/75 hover:bg-base-100"
                  )}
                >
                  {geoLabel(option)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">Radius Aktif</p>
              <p className="text-sm font-bold text-base-content">{geoSnapshot.radiusLabel}</p>
            </div>
            <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">Kandidat Runner</p>
              <p className="text-sm font-bold text-base-content">{geoSnapshot.estimatedCandidates}</p>
            </div>
            <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">Avg ETA</p>
              <p className="text-sm font-bold text-base-content">{geoSnapshot.avgEta}</p>
            </div>
          </div>
          <div className="mt-3 rounded-[10px] border border-base-300/70 bg-base-100 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">Heat Area</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {geoSnapshot.heatAreas.map((area) => (
                <span key={area} className="rounded-[999px] bg-[#DBEAFE] px-2.5 py-1 text-[11px] font-semibold text-[#1D4ED8]">
                  {area}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-base-content/65">Runner aktif saat ini: {geoSnapshot.activeRunners}</p>
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Supply vs Demand</p>
              <h2 className="mt-1 text-lg font-bold text-base-content">Per {granularity === "Jam" ? "Jam" : "Hari"}</h2>
            </div>
            <div className="inline-flex rounded-[10px] bg-base-200 p-1">
              {analysisSupplyGranularityOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setGranularity(option)}
                  className={cn(
                    "btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none",
                    granularity === option ? "bg-primary text-primary-content" : "bg-transparent text-base-content/75 hover:bg-base-100"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] min-h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={supplyDemandPoints} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="slot" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Line type="monotone" dataKey="supply" name="Supply" stroke="#38BDF8" strokeWidth={3} dot={{ r: 4, fill: "#38BDF8" }} />
                <Line type="monotone" dataKey="demand" name="Demand" stroke="#A046FF" strokeWidth={3} dot={{ r: 4, fill: "#A046FF" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">Jam/Hari Ramai</p>
              <p className="text-sm font-bold text-base-content">{busiest.slot}</p>
            </div>
            <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">Jam/Hari Sepi</p>
              <p className="text-sm font-bold text-base-content">{quietest.slot}</p>
            </div>
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">SLA & Response</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Median First Response, Match Time, Outlier</h2>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {analysisSlaMetrics.map((item) => (
              <div key={item.label} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <p className="text-xs font-semibold text-base-content/55">{item.label}</p>
                <p className="mt-1 text-xl font-bold text-base-content">{item.value}</p>
                <span className={cn("mt-2 inline-flex rounded-[8px] px-2 py-0.5 text-[11px] font-semibold text-black", item.tone)}>{item.hint}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 h-[220px] min-h-[220px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analysisSlaResponsePoints} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="step" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 8 }} />
                <Bar dataKey="median" name="Median (menit)" fill="#A046FF" radius={[8, 8, 0, 0]} />
                <Line type="monotone" dataKey="target" name="Target (menit)" stroke="#38BDF8" strokeWidth={2.5} dot={{ r: 3, fill: "#38BDF8" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 space-y-2">
            {analysisSlaOutliers.map((outlier) => (
              <div key={outlier.quest} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{outlier.quest}</p>
                  <span className="rounded-[8px] bg-[#FECACA] px-2 py-0.5 text-[11px] font-semibold text-[#991B1B]">{outlier.delay}</span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">{outlier.reason}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Escrow Health</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">State Distribution + Pending Aging</h2>

          <div className="mt-3 space-y-2.5">
            {analysisEscrowStatePoints.map((item) => (
              <div key={item.state} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-base-content/70">{item.state}</p>
                  <p className="text-sm font-bold text-base-content">{item.total}</p>
                </div>
                <div className="h-2 rounded-full bg-base-200">
                  <div className="h-2 rounded-full bg-[#6B21FF]" style={{ width: `${Math.round((item.total / maxEscrow) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 h-[210px] min-h-[210px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={analysisPendingAgingPoints} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="bucket" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="total" name="Pending Aging" fill="#38BDF8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Risk Panel</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Dispute Ratio by Skill/Radius/Verification</h2>

          <div className="mt-3 space-y-2.5">
            {analysisRiskPoints.map((risk) => (
              <div key={`${risk.dimension}-${risk.segment}`} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content/55">{risk.dimension}</p>
                    <p className="text-sm font-bold text-base-content">{risk.segment}</p>
                  </div>
                  <span className={cn("inline-flex rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", riskSeverityTone(risk.severity))}>{risk.severity}</span>
                </div>
                <div className="h-2 rounded-full bg-base-200">
                  <div className="h-2 rounded-full bg-[#F97316]" style={{ width: `${Math.min(risk.disputeRate * 16, 100)}%` }} />
                </div>
                <p className="mt-1.5 text-xs font-medium text-base-content/65">Dispute Ratio: {risk.disputeRate}%</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">PP Intelligence</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Growth per Skill + Top Contributor + Decay</h2>

          <div className="mt-3 space-y-2.5">
            {analysisPpGrowthPoints.map((item) => (
              <div key={item.skill} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-base-content">{item.skill}</p>
                  <p className="text-xs font-semibold text-base-content/65">{item.pp.toLocaleString()} PP</p>
                </div>
                <div className="h-2 rounded-full bg-base-200">
                  <div className="h-2 rounded-full bg-[#A046FF]" style={{ width: `${Math.round((item.pp / maxPp) * 100)}%` }} />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs font-medium text-base-content/65">
                  <span>Growth {item.growth}%</span>
                  <span>Decay impact {item.decayImpact}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {analysisTopContributors.map((person) => (
              <div key={person.name} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{person.name} | {person.skill}</p>
                  <span className="rounded-[8px] bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-semibold text-[#166534]">{person.ppGain}</span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">{person.note}</p>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Leaderboard Movement</p>
              <h2 className="mt-1 text-lg font-bold text-base-content">Naik/Turun Rank Lokal/Provinsi/Nasional</h2>
            </div>
            <div className="inline-flex rounded-[10px] bg-base-200 p-1">
              {(["Lokal", "Provinsi", "Nasional"] as AnalysisLeaderboardScope[]).map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => setLeaderboardScope(scope)}
                  className={cn(
                    "btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none",
                    leaderboardScope === scope ? "bg-primary text-primary-content" : "bg-transparent text-base-content/75 hover:bg-base-100"
                  )}
                >
                  {scope}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2.5">
            {leaderboardMovement.items.map((item) => {
              const delta = item.previousRank - item.currentRank;
              const movementLabel = delta > 0 ? `Naik ${delta}` : delta < 0 ? `Turun ${Math.abs(delta)}` : "Tetap";
              const movementClass = delta > 0 ? "bg-[#DCFCE7] text-[#166534]" : delta < 0 ? "bg-[#FECACA] text-[#991B1B]" : "bg-base-200 text-base-content/70";

              return (
                <div key={`${leaderboardMovement.scope}-${item.name}`} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-base-content">{item.name}</p>
                    <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", movementClass)}>{movementLabel}</span>
                  </div>
                  <p className="mt-1 text-xs text-base-content/65">Rank {item.previousRank} to {item.currentRank} | {item.pp} PP</p>
                </div>
              );
            })}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Cohort Retention</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Retention Runner/Giver (Dummy)</h2>

          <div className="mt-4 h-[280px] min-h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={analysisCohortRetentionPoints} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 8 }} />
                <Line type="monotone" dataKey="runnerRetention" name="Runner Retention" stroke="#38BDF8" strokeWidth={3} dot={{ r: 4, fill: "#38BDF8" }} />
                <Line type="monotone" dataKey="giverRetention" name="Giver Retention" stroke="#A046FF" strokeWidth={3} dot={{ r: 4, fill: "#A046FF" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Insight Cards</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Insight Otomatis untuk Optimasi Operasional</h2>

          <div className="mt-3 space-y-2.5">
            {analysisInsightCards.map((insight) => (
              <div key={insight.title} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{insight.title}</p>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", insightImpactTone(insight.impact))}>{insight.impact}</span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">{insight.detail}</p>
                <p className="mt-1.5 text-[11px] font-semibold text-base-content/55">Confidence {insight.confidence}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}

export default AnalysisComponent;
