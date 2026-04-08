import type {
  AnalysisCategoryPoint,
  AnalysisFlow,
  AnalysisMetric,
  AnalysisStatusPoint,
  AnalysisTrendPoint,
} from "./analysis";

export const analysisMetrics: AnalysisMetric[] = [
  { label: "Quest Selesai", value: "128", delta: "+12%", tone: "bg-[#D9F99D]" },
  { label: "Completion Rate", value: "86.4%", delta: "+4.1%", tone: "bg-[#BFDBFE]" },
  { label: "Avg. Response", value: "14m", delta: "-3m", tone: "bg-[#E9D5FF]" },
  { label: "Escalation", value: "09", delta: "-2 issue", tone: "bg-[#FECACA]" },
];

export const analysisFlows: AnalysisFlow[] = [
  { label: "Matching runner ke brief", percentage: 82, note: "Paling stabil minggu ini" },
  { label: "Konfirmasi giver", percentage: 64, note: "Masih ada delay di approval" },
  { label: "Finalisasi reward", percentage: 91, note: "Aman, cepat ditutup" },
];

export const analysisTrendPoints: AnalysisTrendPoint[] = [
  { day: "Sen", completed: 18, active: 24, accuracy: 88 },
  { day: "Sel", completed: 22, active: 28, accuracy: 90 },
  { day: "Rab", completed: 19, active: 25, accuracy: 87 },
  { day: "Kam", completed: 27, active: 30, accuracy: 92 },
  { day: "Jum", completed: 31, active: 34, accuracy: 94 },
  { day: "Sab", completed: 25, active: 29, accuracy: 91 },
  { day: "Min", completed: 21, active: 26, accuracy: 89 },
];

export const analysisStatusPoints: AnalysisStatusPoint[] = [
  { label: "Open", total: 21 },
  { label: "Match", total: 16 },
  { label: "Done", total: 28 },
  { label: "Issue", total: 5 },
];

export const analysisCategoryPoints: AnalysisCategoryPoint[] = [
  { name: "Cleaning", value: 34, fill: "#A046FF" },
  { name: "Retail", value: 24, fill: "#38BDF8" },
  { name: "Pickup", value: 18, fill: "#84CC16" },
  { name: "Teknis", value: 14, fill: "#F97316" },
  { name: "Lainnya", value: 10, fill: "#F43F5E" },
];
