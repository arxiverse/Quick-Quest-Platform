import { AnalysisNestedPointList, AnalysisNestedShell, AnalysisNestedStatGrid } from "../../page/nested-shell";
import { ScopeAnalyticsData } from "./scope-analytics";

export function RunnerScopeAnalyticsDetail({ onBack }: { onBack: () => void }) {
  return (
    <AnalysisNestedShell
      eyebrow={ScopeAnalyticsData.eyebrow}
      title={ScopeAnalyticsData.title}
      description={ScopeAnalyticsData.description}
      chips={ScopeAnalyticsData.chips}
      onBack={onBack}
    >
      <AnalysisNestedStatGrid stats={ScopeAnalyticsData.stats} />
      <div className="mt-4">
        <AnalysisNestedPointList points={ScopeAnalyticsData.points} />
      </div>
    </AnalysisNestedShell>
  );
}
