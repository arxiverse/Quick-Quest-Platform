import {
  giverMetricOverviewStatsSeed,
  giverMetricSeeds,
  type GiverMetricKey,
  type GiverMetricSeed,
} from "./metrics.service";

export type { GiverMetricKey, GiverMetricSeed };

export const giverMetricOverviewStats = [...giverMetricOverviewStatsSeed];
export const giverMetrics = [...giverMetricSeeds];

export function resolveGiverMetricByKey(key: GiverMetricKey): GiverMetricSeed {
  return giverMetrics.find((metric) => metric.key === key) ?? giverMetrics[0];
}
