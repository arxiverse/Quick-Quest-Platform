import { AnalysisNestedPointList, AnalysisNestedShell, AnalysisNestedStatGrid } from "../../page/nested-shell";
import { InsightPanelData } from "./insight-panel";

export function RunnerInsightPanelDetail({ onBack }: { onBack: () => void }) {
  return (
    <AnalysisNestedShell
      eyebrow={InsightPanelData.eyebrow}
      title={InsightPanelData.title}
      description={InsightPanelData.description}
      chips={InsightPanelData.chips}
      onBack={onBack}
    >
      <AnalysisNestedStatGrid stats={InsightPanelData.stats} />
      <div className="mt-4">
        <AnalysisNestedPointList points={InsightPanelData.points} />
      </div>
    </AnalysisNestedShell>
  );
}
