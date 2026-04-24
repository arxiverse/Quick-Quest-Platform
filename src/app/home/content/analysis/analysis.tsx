import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn, Surface } from "../../home.ui";
import {
  analysisDefaultState,
  createInitialTargetImpianState,
  formatAnalysisIdr,
  resolveAnalysisCompareCards,
  resolveAnalysisEscrowMaxValue,
  resolveAnalysisFunnelConversion,
  resolveAnalysisFunnelMaxValue,
  resolveAnalysisFunnelPoints,
  resolveAnalysisGeoLabel,
  resolveAnalysisGeoSnapshot,
  resolveAnalysisInsightImpactTone,
  resolveAnalysisLeaderboardMovement,
  resolveAnalysisLeaderboardMovementTone,
  resolveAnalysisPpMaxValue,
  resolveAnalysisRiskSeverityTone,
  resolveAnalysisRoleContext,
  resolveAnalysisRoleData,
  resolveAnalysisSupplyDemandExtremes,
  resolveAnalysisSupplyDemandPoints,
  resolveTargetImpianProjection,
  type AnalysisGeoScopeKey,
  type AnalysisLeaderboardScope,
  type AnalysisSupplyGranularity,
  type AnalysisTargetImpianSeed,
  type AnalysisTargetImpianState,
  type AnalysisTimeRange,
  type AnalysisViewText,
} from "./analysis";
import { useRole } from "../../role.context";

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

function TargetImpianWidget({
  viewText,
  targetImpianSeed,
}: {
  viewText: AnalysisViewText;
  targetImpianSeed: AnalysisTargetImpianSeed;
}) {
  const [targetState, setTargetState] = useState<AnalysisTargetImpianState>(() =>
    createInitialTargetImpianState(targetImpianSeed),
  );

  const projection = resolveTargetImpianProjection(
    targetState,
    targetImpianSeed.averageQuestWage,
  );

  return (
    <Surface className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            <span className="text-xl">🎯</span> {viewText.targetImpian.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-base-content">
            {viewText.targetImpian.title}
          </h2>
        </div>
        <span className="rounded-[8px] bg-error/15 px-2.5 py-1 text-xs font-semibold text-error shadow-sm">
          {viewText.targetImpian.realityBadge} 👋
        </span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3 rounded-[10px] bg-base-100 p-1">
          <div>
            <label className="text-[11px] font-semibold text-base-content/55 uppercase tracking-[0.06em]">
              {viewText.targetImpian.itemNameLabel}
            </label>
            <input
              type="text"
              value={targetState.itemName}
              onChange={(e) =>
                setTargetState((prev) => ({ ...prev, itemName: e.target.value }))
              }
              className="input input-sm mt-1 h-9 min-h-9 w-full rounded-[8px] border-base-300 bg-base-100 text-sm font-medium"
              placeholder={viewText.targetImpian.itemNamePlaceholder}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-base-content/55 uppercase tracking-[0.06em]">
                {viewText.targetImpian.itemPriceLabel}
              </label>
              <input
                type="number"
                value={targetState.itemPrice}
                onChange={(e) =>
                  setTargetState((prev) => ({
                    ...prev,
                    itemPrice: Number(e.target.value),
                  }))
                }
                className="input input-sm mt-1 h-9 min-h-9 w-full rounded-[8px] border-base-300 bg-base-100 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-base-content/55 uppercase tracking-[0.06em]">
                {viewText.targetImpian.currentSavedLabel}
              </label>
              <input
                type="number"
                value={targetState.currentSaved}
                onChange={(e) =>
                  setTargetState((prev) => ({
                    ...prev,
                    currentSaved: Number(e.target.value),
                  }))
                }
                className="input input-sm mt-1 h-9 min-h-9 w-full rounded-[8px] border-base-300 bg-base-100 text-sm font-bold text-success"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-[12px] border border-base-300/70 bg-gradient-to-br from-base-200 to-base-100 p-4 shadow-inner">
          <p className="text-sm font-medium text-base-content/80">
            {viewText.targetImpian.realityPrefix}{" "}
            <span className="font-bold text-primary">
              {targetState.itemName || "Barang Impian"}
            </span>
            ,
          </p>
          <p className="mt-1 text-2xl font-bold leading-tight">
            {viewText.targetImpian.realitySuffix}{" "}
            <span className="bg-gradient-to-r from-[#A046FF] to-[#38BDF8] bg-clip-text text-transparent">
              {projection.questsNeeded}{" "}
            </span>
            {viewText.targetImpian.questNeededSuffix}
          </p>
          <p className="mt-1 text-[11px] font-medium text-base-content/55">
            {viewText.targetImpian.wageAssumption}
          </p>

          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs font-bold">
              <span>
                {viewText.targetImpian.progressPrefix}{" "}
                {projection.progressPercent.toFixed(1)}%
              </span>
              <span className="text-base-content/60">
                {viewText.targetImpian.remainingPrefix}{" "}
                {formatAnalysisIdr(projection.remaining)}
              </span>
            </div>
            <div className="h-3.5 overflow-hidden rounded-full border border-base-300/50 bg-base-300/50">
              <div
                className="h-full bg-gradient-to-r from-[#A046FF] to-[#38BDF8] transition-all duration-700 ease-out"
                style={{ width: `${projection.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Surface>
  );
}

function AnalysisComponent() {
  const { role, isGiverVerified } = useRole();
  const analysisRoleContext = resolveAnalysisRoleContext(role, isGiverVerified);
  const analysisRoleData = resolveAnalysisRoleData(analysisRoleContext);
  const analysisViewText = analysisRoleData.viewCopy;
  const analysisLeaderboardScopes = analysisRoleData.leaderboardScopes;
  const analysisTimeRangeOptions = analysisRoleData.timeRangeOptions;
  const analysisGeoScopeOptions = analysisRoleData.geoScopeOptions;
  const analysisSupplyGranularityOptions = analysisRoleData.supplyGranularityOptions;

  const [timeRange, setTimeRange] = useState<AnalysisTimeRange>(
    analysisDefaultState.timeRange,
  );
  const [geoScope, setGeoScope] = useState<AnalysisGeoScopeKey>(
    analysisDefaultState.geoScope,
  );
  const [granularity, setGranularity] = useState<AnalysisSupplyGranularity>(
    analysisDefaultState.granularity,
  );
  const [leaderboardScope, setLeaderboardScope] = useState<AnalysisLeaderboardScope>(
    analysisDefaultState.leaderboardScope,
  );

  const normalizedTimeRange = analysisTimeRangeOptions.includes(timeRange)
    ? timeRange
    : analysisRoleData.defaultState.timeRange;
  const normalizedGeoScope = analysisGeoScopeOptions.includes(geoScope)
    ? geoScope
    : analysisRoleData.defaultState.geoScope;
  const normalizedGranularity = analysisSupplyGranularityOptions.includes(granularity)
    ? granularity
    : analysisRoleData.defaultState.granularity;
  const normalizedLeaderboardScope = analysisLeaderboardScopes.includes(leaderboardScope)
    ? leaderboardScope
    : analysisRoleData.defaultState.leaderboardScope;

  const compareCards = resolveAnalysisCompareCards(
    normalizedTimeRange,
    analysisRoleData.compareByRange,
  );
  const funnelPoints = resolveAnalysisFunnelPoints(
    normalizedTimeRange,
    analysisRoleData.funnelByRange,
  );
  const geoSnapshot = resolveAnalysisGeoSnapshot(
    normalizedGeoScope,
    analysisRoleData.geoScopeSnapshots,
  );
  const supplyDemandPoints = resolveAnalysisSupplyDemandPoints(
    normalizedGranularity,
    analysisRoleData.supplyDemandByGranularity,
  );
  const leaderboardMovement = resolveAnalysisLeaderboardMovement(
    normalizedLeaderboardScope,
    analysisRoleData.leaderboardMovementGroups,
  );
  const maxFunnel = resolveAnalysisFunnelMaxValue(funnelPoints);
  const maxEscrow = resolveAnalysisEscrowMaxValue(analysisRoleData.escrowStatePoints);
  const maxPp = resolveAnalysisPpMaxValue(analysisRoleData.ppGrowthPoints);
  const { busiest, quietest } = resolveAnalysisSupplyDemandExtremes(
    supplyDemandPoints,
  );

  return (
    <div className="min-w-0 space-y-4">
      <Surface className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/45">
              {analysisViewText.hero.eyebrow}
            </p>
            <h1 className="mt-1 text-xl font-bold text-base-content sm:text-2xl">
              {analysisViewText.hero.title}
            </h1>
          </div>
          <div className="inline-flex rounded-[10px] bg-base-200 p-1">
            {analysisTimeRangeOptions.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={cn(
                  "btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none",
                  normalizedTimeRange === range ? "bg-primary text-primary-content" : "bg-transparent text-base-content/75 hover:bg-base-100"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </Surface>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {analysisRoleData.kpiItems.map((metric) => (
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
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
              {analysisViewText.compare.eyebrow}
            </p>
            <h2 className="mt-1 text-lg font-bold text-base-content">
              {analysisViewText.compare.title}
            </h2>
          </div>
          <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/70">
            {normalizedTimeRange} {analysisViewText.compare.activeRangeSuffix}
          </span>
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

      <TargetImpianWidget
        key={analysisRoleContext}
        viewText={analysisViewText}
        targetImpianSeed={analysisRoleData.targetImpianSeed}
      />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            {analysisViewText.funnel.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-base-content">
            {analysisViewText.funnel.title}
          </h2>
          <div className="mt-4 space-y-3">
            {funnelPoints.map((point, index) => {
              const conversion = resolveAnalysisFunnelConversion(
                funnelPoints,
                index,
              );
              return (
                <div key={point.stage} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-base-content">{point.stage}</p>
                    <div className="text-right">
                      <p className="text-sm font-bold text-base-content">{point.value}</p>
                      <p className="text-[11px] font-semibold text-base-content/60">
                        {analysisViewText.funnel.conversionPrefix} {conversion}
                      </p>
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
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
                {analysisViewText.geo.eyebrow}
              </p>
              <h2 className="mt-1 text-lg font-bold text-base-content">
                {analysisViewText.geo.title}
              </h2>
            </div>
            <div className="inline-flex rounded-[10px] bg-base-200 p-1">
              {analysisGeoScopeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setGeoScope(option)}
                  className={cn(
                    "btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none",
                    normalizedGeoScope === option ? "bg-primary text-primary-content" : "bg-transparent text-base-content/75 hover:bg-base-100"
                  )}
                >
                  {resolveAnalysisGeoLabel(option)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">
                {analysisViewText.geo.radiusActiveLabel}
              </p>
              <p className="text-sm font-bold text-base-content">{geoSnapshot.radiusLabel}</p>
            </div>
            <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">
                {analysisViewText.geo.candidateLabel}
              </p>
              <p className="text-sm font-bold text-base-content">{geoSnapshot.estimatedCandidates}</p>
            </div>
            <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">
                {analysisViewText.geo.avgEtaLabel}
              </p>
              <p className="text-sm font-bold text-base-content">{geoSnapshot.avgEta}</p>
            </div>
          </div>
          <div className="mt-3 rounded-[10px] border border-base-300/70 bg-base-100 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">
              {analysisViewText.geo.heatAreaLabel}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {geoSnapshot.heatAreas.map((area) => (
                <span key={area} className="rounded-[999px] bg-[#DBEAFE] px-2.5 py-1 text-[11px] font-semibold text-[#1D4ED8]">
                  {area}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-base-content/65">
              {analysisViewText.geo.activeRunnerPrefix} {geoSnapshot.activeRunners}
            </p>
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
                {analysisViewText.supplyDemand.eyebrow}
              </p>
              <h2 className="mt-1 text-lg font-bold text-base-content">
                {analysisViewText.supplyDemand.titlePrefix}{" "}
                {normalizedGranularity === "Jam"
                  ? analysisViewText.supplyDemand.byHourLabel
                  : analysisViewText.supplyDemand.byDayLabel}
              </h2>
            </div>
            <div className="inline-flex rounded-[10px] bg-base-200 p-1">
              {analysisSupplyGranularityOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setGranularity(option)}
                  className={cn(
                    "btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none",
                    normalizedGranularity === option ? "bg-primary text-primary-content" : "bg-transparent text-base-content/75 hover:bg-base-100"
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">
                {analysisViewText.supplyDemand.busiestLabel}
              </p>
              <p className="text-sm font-bold text-base-content">{busiest.slot}</p>
            </div>
            <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">
                {analysisViewText.supplyDemand.quietestLabel}
              </p>
              <p className="text-sm font-bold text-base-content">{quietest.slot}</p>
            </div>
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            {analysisViewText.sla.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-base-content">
            {analysisViewText.sla.title}
          </h2>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {analysisRoleData.slaMetrics.map((item) => (
              <div key={item.label} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <p className="text-xs font-semibold text-base-content/55">{item.label}</p>
                <p className="mt-1 text-xl font-bold text-base-content">{item.value}</p>
                <span className={cn("mt-2 inline-flex rounded-[8px] px-2 py-0.5 text-[11px] font-semibold text-black", item.tone)}>{item.hint}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 h-[220px] min-h-[220px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analysisRoleData.slaResponsePoints} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="step" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 8 }} />
                <Bar dataKey="median" name={analysisViewText.sla.medianLegend} fill="#A046FF" radius={[8, 8, 0, 0]} />
                <Line type="monotone" dataKey="target" name={analysisViewText.sla.targetLegend} stroke="#38BDF8" strokeWidth={2.5} dot={{ r: 3, fill: "#38BDF8" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 space-y-2">
            {analysisRoleData.slaOutliers.map((outlier) => (
              <div key={outlier.quest} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{outlier.quest}</p>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", analysisViewText.sla.outlierToneClass)}>{outlier.delay}</span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">{outlier.reason}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            {analysisViewText.escrow.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-base-content">
            {analysisViewText.escrow.title}
          </h2>

          <div className="mt-3 space-y-2.5">
            {analysisRoleData.escrowStatePoints.map((item) => (
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
              <BarChart data={analysisRoleData.pendingAgingPoints} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="bucket" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="total" name={analysisViewText.escrow.pendingAgingLegend} fill="#38BDF8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            {analysisViewText.risk.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-base-content">
            {analysisViewText.risk.title}
          </h2>

          <div className="mt-3 space-y-2.5">
            {analysisRoleData.riskPoints.map((risk) => (
              <div key={`${risk.dimension}-${risk.segment}`} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content/55">{risk.dimension}</p>
                    <p className="text-sm font-bold text-base-content">{risk.segment}</p>
                  </div>
                  <span className={cn("inline-flex rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", resolveAnalysisRiskSeverityTone(risk.severity))}>{risk.severity}</span>
                </div>
                <div className="h-2 rounded-full bg-base-200">
                  <div className="h-2 rounded-full bg-[#F97316]" style={{ width: `${Math.min(risk.disputeRate * 16, 100)}%` }} />
                </div>
                <p className="mt-1.5 text-xs font-medium text-base-content/65">
                  {analysisViewText.risk.disputeRatioPrefix} {risk.disputeRate}%
                </p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            {analysisViewText.ppIntelligence.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-base-content">
            {analysisViewText.ppIntelligence.title}
          </h2>

          <div className="mt-3 space-y-2.5">
            {analysisRoleData.ppGrowthPoints.map((item) => (
              <div key={item.skill} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-base-content">{item.skill}</p>
                  <p className="text-xs font-semibold text-base-content/65">{item.pp.toLocaleString()} PP</p>
                </div>
                <div className="h-2 rounded-full bg-base-200">
                  <div className="h-2 rounded-full bg-[#A046FF]" style={{ width: `${Math.round((item.pp / maxPp) * 100)}%` }} />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs font-medium text-base-content/65">
                  <span>{analysisViewText.ppIntelligence.growthPrefix} {item.growth}%</span>
                  <span>{analysisViewText.ppIntelligence.decayPrefix} {item.decayImpact}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {analysisRoleData.topContributors.map((person) => (
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
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
                {analysisViewText.leaderboard.eyebrow}
              </p>
              <h2 className="mt-1 text-lg font-bold text-base-content">
                {analysisViewText.leaderboard.title}
              </h2>
            </div>
            <div className="inline-flex rounded-[10px] bg-base-200 p-1">
              {analysisLeaderboardScopes.map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => setLeaderboardScope(scope)}
                  className={cn(
                    "btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none",
                    normalizedLeaderboardScope === scope ? "bg-primary text-primary-content" : "bg-transparent text-base-content/75 hover:bg-base-100"
                  )}
                >
                  {scope}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2.5">
            {leaderboardMovement.items.map((item) => {
              const movement = resolveAnalysisLeaderboardMovementTone(
                item.previousRank,
                item.currentRank,
                analysisViewText,
              );

              return (
                <div key={`${leaderboardMovement.scope}-${item.name}`} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-base-content">{item.name}</p>
                    <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", movement.toneClass)}>{movement.label}</span>
                  </div>
                  <p className="mt-1 text-xs text-base-content/65">
                    {analysisViewText.leaderboard.rankFromToPrefix} {item.previousRank}{" "}
                    {analysisViewText.leaderboard.rankFromToSeparator} {item.currentRank}{" "}
                    | {item.pp} {analysisViewText.leaderboard.ppSuffix}
                  </p>
                </div>
              );
            })}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            {analysisViewText.cohort.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-base-content">
            {analysisViewText.cohort.title}
          </h2>

          <div className="mt-4 h-[280px] min-h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={analysisRoleData.cohortRetentionPoints} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 8 }} />
                <Line type="monotone" dataKey="runnerRetention" name={analysisViewText.cohort.runnerRetentionLegend} stroke="#38BDF8" strokeWidth={3} dot={{ r: 4, fill: "#38BDF8" }} />
                <Line type="monotone" dataKey="giverRetention" name={analysisViewText.cohort.giverRetentionLegend} stroke="#A046FF" strokeWidth={3} dot={{ r: 4, fill: "#A046FF" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            {analysisViewText.insight.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-base-content">
            {analysisViewText.insight.title}
          </h2>

          <div className="mt-3 space-y-2.5">
            {analysisRoleData.insightCards.map((insight) => (
              <div key={insight.title} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{insight.title}</p>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", resolveAnalysisInsightImpactTone(insight.impact))}>{insight.impact}</span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">{insight.detail}</p>
                <p className="mt-1.5 text-[11px] font-semibold text-base-content/55">
                  {analysisViewText.insight.confidencePrefix} {insight.confidence}
                </p>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}

export default AnalysisComponent;

