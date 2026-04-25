import { AnalysisNestedPointList, AnalysisNestedShell, AnalysisNestedStatGrid } from "../../page/nested-shell";
import { PpIntelligenceData } from "./pp-intelligence";

export function GiverPpIntelligenceDetail({ onBack }: { onBack: () => void }) {
  return (
    <AnalysisNestedShell
      eyebrow={PpIntelligenceData.eyebrow}
      title={PpIntelligenceData.title}
      description={PpIntelligenceData.description}
      chips={PpIntelligenceData.chips}
      onBack={onBack}
    >
      <AnalysisNestedStatGrid stats={PpIntelligenceData.stats} />
      <div className="mt-4">
        <AnalysisNestedPointList points={PpIntelligenceData.points} />
      </div>
    </AnalysisNestedShell>
  );
}
