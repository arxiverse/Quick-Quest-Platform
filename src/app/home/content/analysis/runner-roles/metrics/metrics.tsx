import { AnalysisNestedPointList, AnalysisNestedShell, AnalysisNestedStatGrid } from "../../page/nested-shell";
import {
  resolveRunnerMetricByKey,
  runnerMetricOverviewStats,
  runnerMetrics,
  type RunnerMetricKey,
} from "./metrics";

function RunnerMetricPage({
  metricKey,
  onBack,
}: {
  metricKey: RunnerMetricKey;
  onBack: () => void;
}) {
  const metric = resolveRunnerMetricByKey(metricKey);

  return (
    <AnalysisNestedShell
      eyebrow="Runner Metrics"
      title={`${metric.label} Detail`}
      description={`Pendalaman metrik ${metric.label} untuk konteks runner dengan dummy data yang siap diganti API.`}
      chips={[{ label: metric.value, toneClass: metric.toneClass }, { label: metric.hint }]}
      onBack={onBack}
    >
      <AnalysisNestedPointList points={metric.detailPoints} />
    </AnalysisNestedShell>
  );
}

export function RunnerMetricsDetail({ onBack }: { onBack: () => void }) {
  return (
    <AnalysisNestedShell
      eyebrow="Runner Metrics"
      title="Overview Metrics"
      description="Pilih metrik untuk eksplorasi lebih dalam. Setiap metrik punya detail page terpisah dalam satu file metrics.tsx."
      onBack={onBack}
    >
      <AnalysisNestedStatGrid stats={runnerMetricOverviewStats} />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {runnerMetrics.map((metric) => (
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

export function RunnerMetricGmvDetail({ onBack }: { onBack: () => void }) {
  return <RunnerMetricPage metricKey="gmv" onBack={onBack} />;
}

export function RunnerMetricMatchRateDetail({ onBack }: { onBack: () => void }) {
  return <RunnerMetricPage metricKey="match_rate" onBack={onBack} />;
}

export function RunnerMetricFillTimeDetail({ onBack }: { onBack: () => void }) {
  return <RunnerMetricPage metricKey="fill_time" onBack={onBack} />;
}

export function RunnerMetricCompletionDetail({ onBack }: { onBack: () => void }) {
  return <RunnerMetricPage metricKey="completion" onBack={onBack} />;
}

export function RunnerMetricDisputeDetail({ onBack }: { onBack: () => void }) {
  return <RunnerMetricPage metricKey="dispute" onBack={onBack} />;
}

export function RunnerMetricEscrowReleasedDetail({ onBack }: { onBack: () => void }) {
  return <RunnerMetricPage metricKey="escrow_released" onBack={onBack} />;
}
