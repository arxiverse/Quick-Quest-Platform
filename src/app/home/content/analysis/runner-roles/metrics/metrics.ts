import {
  runnerMetricOverviewStatsSeed,
  runnerMetricSeeds,
  type RunnerMetricKey,
  type RunnerMetricSeed,
} from "./metrics.service";

export type { RunnerMetricKey, RunnerMetricSeed };

export const runnerMetricOverviewStats = [...runnerMetricOverviewStatsSeed];
export const runnerMetrics = [...runnerMetricSeeds];

export function resolveRunnerMetricByKey(
  key: RunnerMetricKey,
): RunnerMetricSeed {
  return runnerMetrics.find((metric) => metric.key === key) ?? runnerMetrics[0];
}
