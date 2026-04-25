import { AnalysisNestedPointList, AnalysisNestedShell, AnalysisNestedStatGrid } from "../../page/nested-shell";
import { EscrowHealthData } from "./escrow-health";

export function GiverEscrowHealthDetail({ onBack }: { onBack: () => void }) {
  return (
    <AnalysisNestedShell
      eyebrow={EscrowHealthData.eyebrow}
      title={EscrowHealthData.title}
      description={EscrowHealthData.description}
      chips={EscrowHealthData.chips}
      onBack={onBack}
    >
      <AnalysisNestedStatGrid stats={EscrowHealthData.stats} />
      <div className="mt-4">
        <AnalysisNestedPointList points={EscrowHealthData.points} />
      </div>
    </AnalysisNestedShell>
  );
}
