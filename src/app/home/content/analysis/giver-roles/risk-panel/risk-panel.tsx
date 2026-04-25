import { AnalysisNestedPointList, AnalysisNestedShell, AnalysisNestedStatGrid } from "../../page/nested-shell";
import { RiskPanelData } from "./risk-panel";

export function GiverRiskPanelDetail({ onBack }: { onBack: () => void }) {
  return (
    <AnalysisNestedShell
      eyebrow={RiskPanelData.eyebrow}
      title={RiskPanelData.title}
      description={RiskPanelData.description}
      chips={RiskPanelData.chips}
      onBack={onBack}
    >
      <AnalysisNestedStatGrid stats={RiskPanelData.stats} />
      <div className="mt-4">
        <AnalysisNestedPointList points={RiskPanelData.points} />
      </div>
    </AnalysisNestedShell>
  );
}
