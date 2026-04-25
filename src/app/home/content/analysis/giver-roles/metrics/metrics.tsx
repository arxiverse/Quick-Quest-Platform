import { AnalysisNestedPointList, AnalysisNestedShell, AnalysisNestedStatGrid } from "../../page/nested-shell";
import {
  giverMetricOverviewStats,
  giverMetrics,
  resolveGiverMetricByKey,
  type GiverMetricKey,
} from "./metrics";

function GiverMetricPage({
  metricKey,
  onBack,
}: {
  metricKey: GiverMetricKey;
  onBack: () => void;
}) {
  const metric = resolveGiverMetricByKey(metricKey);

  return (
    <AnalysisNestedShell
      eyebrow="Giver Metrics"
      title={`${metric.label} Detail`}
      description={`Pendalaman metrik ${metric.label} untuk konteks giver dengan data dummy siap replace API.`}
      chips={[{ label: metric.value, toneClass: metric.toneClass }, { label: metric.hint }]}
      onBack={onBack}
    >
      <AnalysisNestedPointList points={metric.detailPoints} />
    </AnalysisNestedShell>
  );
}

export function GiverMetricsDetail({ onBack }: { onBack: () => void }) {
  return (
    <AnalysisNestedShell
      eyebrow="Giver Metrics"
      title="Overview Metrics"
      description="Pilih metrik untuk eksplorasi lebih dalam. Setiap metrik dipisahkan sebagai function page di file yang sama."
      onBack={onBack}
    >
      <AnalysisNestedStatGrid stats={giverMetricOverviewStats} />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {giverMetrics.map((metric) => (
          <div
            key={metric.key}
            className="rounded-[10px] border border-base-300/70 bg-base-100 p-3"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content/55">
              {metric.label}
            </p>
            <p className="mt-1 text-lg font-bold text-base-content">{metric.value}</p>
            <span className={`mt-2 inline-flex rounded-[8px] px-2 py-0.5 text-[11px] font-semibold ${metric.toneClass}`}>
              {metric.hint}
            </span>
          </div>
        ))}
      </div>
    </AnalysisNestedShell>
  );
}

export function GiverMetricBroadcastDetail({ onBack }: { onBack: () => void }) {
  return <GiverMetricPage metricKey="broadcast" onBack={onBack} />;
}

export function GiverMetricFillRateDetail({ onBack }: { onBack: () => void }) {
  return <GiverMetricPage metricKey="fill_rate" onBack={onBack} />;
}

export function GiverMetricAvgMatchDetail({ onBack }: { onBack: () => void }) {
  return <GiverMetricPage metricKey="avg_match" onBack={onBack} />;
}

export function GiverMetricEscrowLockedDetail({ onBack }: { onBack: () => void }) {
  return <GiverMetricPage metricKey="escrow_locked" onBack={onBack} />;
}

export function GiverMetricDisputeDetail({ onBack }: { onBack: () => void }) {
  return <GiverMetricPage metricKey="dispute" onBack={onBack} />;
}

export function GiverMetricEscrowReleasedDetail({ onBack }: { onBack: () => void }) {
  return <GiverMetricPage metricKey="escrow_released" onBack={onBack} />;
}
