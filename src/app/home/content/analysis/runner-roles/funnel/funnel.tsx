import { AnalysisNestedPointList, AnalysisNestedShell, AnalysisNestedStatGrid } from "../../page/nested-shell";
import { FunnelData } from "./funnel";

export function RunnerFunnelDetail({ onBack }: { onBack: () => void }) {
  return (
    <AnalysisNestedShell
      eyebrow={FunnelData.eyebrow}
      title={FunnelData.title}
      description={FunnelData.description}
      chips={FunnelData.chips}
      onBack={onBack}
    >
      <AnalysisNestedStatGrid stats={FunnelData.stats} />
      <div className="mt-4">
        <AnalysisNestedPointList points={FunnelData.points} />
      </div>
    </AnalysisNestedShell>
  );
}
