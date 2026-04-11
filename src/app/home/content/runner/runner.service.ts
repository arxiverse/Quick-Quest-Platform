import type {
  RunnerAvailabilitySlot,
  RunnerCareerMetric,
  RunnerEarningPoint,
  RunnerMember,
  RunnerReliabilityBadge,
  RunnerSkillInventoryItem,
} from "./runner";

export const runnerCareerMetrics: RunnerCareerMetric[] = [
  { label: "Quest Selesai", value: "394", hint: "+18 minggu ini", tone: "bg-[#DCFCE7]" },
  { label: "Avg Response", value: "4m 20s", hint: "target <= 5m", tone: "bg-[#DBEAFE]" },
  { label: "Cancel Rate", value: "1.2%", hint: "-0.4% dari minggu lalu", tone: "bg-[#E9D5FF]" },
  { label: "On-Time Rate", value: "96.8%", hint: "stabil 4 minggu", tone: "bg-[#FEF3C7]" },
];

export const runnerSkillInventory: RunnerSkillInventoryItem[] = [
  { skill: "Cleaning", level: "Q2", pp: "2,140 PP", completionRate: "97.2%", trend: "+8.6%" },
  { skill: "Coding", level: "Q1", pp: "755 PP", completionRate: "91.4%", trend: "+5.2%" },
  { skill: "Delivery", level: "Q3", pp: "1,240 PP", completionRate: "95.1%", trend: "+4.9%" },
  { skill: "Retail", level: "Q2", pp: "1,860 PP", completionRate: "93.8%", trend: "+6.4%" },
];

export const runnerAvailabilitySchedule: RunnerAvailabilitySlot[] = [
  { day: "Sen", morning: "Online", afternoon: "Limited", night: "Online" },
  { day: "Sel", morning: "Online", afternoon: "Online", night: "Limited" },
  { day: "Rab", morning: "Limited", afternoon: "Online", night: "Online" },
  { day: "Kam", morning: "Online", afternoon: "Online", night: "Online" },
  { day: "Jum", morning: "Limited", afternoon: "Online", night: "Online" },
  { day: "Sab", morning: "Online", afternoon: "Limited", night: "Online" },
  { day: "Min", morning: "Offline", afternoon: "Limited", night: "Online" },
];

export const runnerEarningTrajectory: RunnerEarningPoint[] = [
  { period: "W1", income: 1350000, quests: 18 },
  { period: "W2", income: 1610000, quests: 22 },
  { period: "W3", income: 1490000, quests: 20 },
  { period: "W4", income: 1820000, quests: 25 },
  { period: "W5", income: 1980000, quests: 27 },
  { period: "W6", income: 2140000, quests: 29 },
];

export const runnerReliabilityBadges: RunnerReliabilityBadge[] = [
  { name: "Fast Responder", description: "Median first response di bawah 5 menit.", tone: "bg-[#DBEAFE] text-[#1D4ED8]" },
  { name: "High Completion", description: "Penyelesaian quest stabil di atas 95%.", tone: "bg-[#DCFCE7] text-[#166534]" },
  { name: "Low Dispute", description: "Rasio dispute rendah selama 30 hari terakhir.", tone: "bg-[#E9D5FF] text-[#6D28D9]" },
  { name: "Night Owl", description: "Performa tertinggi di slot malam 18.00 - 22.00.", tone: "bg-[#FEF3C7] text-[#92400E]" },
  { name: "Weekend Grinder", description: "Aktif konsisten saat permintaan weekend meningkat.", tone: "bg-[#FCE7F3] text-[#9D174D]" },
];

export const runnerMembers: RunnerMember[] = [
  { name: "Neira", primarySkill: "Cleaning + Retail", currentStatus: "Ready", location: "Cilandak", reliabilityScore: "A+" },
  { name: "Miska", primarySkill: "Retail + Display", currentStatus: "On Quest", location: "Depok", reliabilityScore: "A" },
  { name: "Farel", primarySkill: "Survey + Pickup", currentStatus: "Standby", location: "Bekasi", reliabilityScore: "B+" },
  { name: "Raka", primarySkill: "Merchandising", currentStatus: "Need Brief", location: "Pasar Minggu", reliabilityScore: "A-" },
];

export const runnerFocusInsight = {
  title: "Active Skill Focus",
  description: "Cleaning dan Retail menyumbang 64% quest match minggu ini. Prioritaskan slot malam untuk demand puncak.",
  demandWindow: "18.00 - 21.00",
};
