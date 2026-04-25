import { AnalysisNestedPointList, AnalysisNestedShell, AnalysisNestedStatGrid } from "../../page/nested-shell";
import { CohortRetentionData } from "./cohort-retention";

export function GiverCohortRetentionDetail({ onBack }: { onBack: () => void }) {
  return (
    <AnalysisNestedShell
      eyebrow={CohortRetentionData.eyebrow}
      title={CohortRetentionData.title}
      description={CohortRetentionData.description}
      chips={CohortRetentionData.chips}
      onBack={onBack}
    >
      <AnalysisNestedStatGrid stats={CohortRetentionData.stats} />
      <div className="mt-4">
        <AnalysisNestedPointList points={CohortRetentionData.points} />
      </div>
    </AnalysisNestedShell>
  );
}
