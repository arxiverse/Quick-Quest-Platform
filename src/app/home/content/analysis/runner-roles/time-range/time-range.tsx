import { AnalysisNestedPointList, AnalysisNestedShell, AnalysisNestedStatGrid } from "../../page/nested-shell";
import { TimeRangeData } from "./time-range";

export function RunnerTimeRangeDetail({ onBack }: { onBack: () => void }) {
  return (
    <AnalysisNestedShell
      eyebrow={TimeRangeData.eyebrow}
      title={TimeRangeData.title}
      description={TimeRangeData.description}
      chips={TimeRangeData.chips}
      onBack={onBack}
    >
      <AnalysisNestedStatGrid stats={TimeRangeData.stats} />
      <div className="mt-4">
        <AnalysisNestedPointList points={TimeRangeData.points} />
      </div>
    </AnalysisNestedShell>
  );
}
