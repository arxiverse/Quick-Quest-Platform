export type AnalysisMetric = {
  label: string;
  value: string;
  delta: string;
  tone: string;
};

export type AnalysisFlow = {
  label: string;
  percentage: number;
  note: string;
};

export type AnalysisTrendPoint = {
  day: string;
  completed: number;
  active: number;
  accuracy: number;
};

export type AnalysisStatusPoint = {
  label: string;
  total: number;
};

export type AnalysisCategoryPoint = {
  name: string;
  value: number;
  fill: string;
};

export {
  analysisCategoryPoints,
  analysisFlows,
  analysisMetrics,
  analysisStatusPoints,
  analysisTrendPoints,
} from "./analysis.service";
