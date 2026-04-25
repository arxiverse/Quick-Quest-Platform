import { AnalysisNestedPointList, AnalysisNestedShell, AnalysisNestedStatGrid } from "../../page/nested-shell";
import { SuppyDemandData } from "./suppy-demand";

export function RunnerSuppyDemandDetail({ onBack }: { onBack: () => void }) {
  return (
    <AnalysisNestedShell
      eyebrow={SuppyDemandData.eyebrow}
      title={SuppyDemandData.title}
      description={SuppyDemandData.description}
      chips={SuppyDemandData.chips}
      onBack={onBack}
    >
      <AnalysisNestedStatGrid stats={SuppyDemandData.stats} />
      <div className="mt-4">
        <AnalysisNestedPointList points={SuppyDemandData.points} />
      </div>
    </AnalysisNestedShell>
  );
}
