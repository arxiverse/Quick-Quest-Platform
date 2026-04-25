import { AnalysisNestedPointList, AnalysisNestedShell, AnalysisNestedStatGrid } from "../../page/nested-shell";
import { SlaResponseData } from "./sla-response";

export function GiverSlaResponseDetail({ onBack }: { onBack: () => void }) {
  return (
    <AnalysisNestedShell
      eyebrow={SlaResponseData.eyebrow}
      title={SlaResponseData.title}
      description={SlaResponseData.description}
      chips={SlaResponseData.chips}
      onBack={onBack}
    >
      <AnalysisNestedStatGrid stats={SlaResponseData.stats} />
      <div className="mt-4">
        <AnalysisNestedPointList points={SlaResponseData.points} />
      </div>
    </AnalysisNestedShell>
  );
}
