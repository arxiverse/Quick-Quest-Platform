import type { ElementChartPoint, ElementMetric, ElementTableRow } from "./element";

export const elementMetrics: ElementMetric[] = [
  { label: "Revenue", value: "Rp12.8jt", detail: "+8.2% minggu ini", tone: "bg-[#D9F99D]" },
  { label: "Active Orders", value: "126", detail: "24 order sedang jalan", tone: "bg-[#BFDBFE]" },
  { label: "Pending Review", value: "18", detail: "Butuh approval cepat", tone: "bg-[#FDE68A]" },
  { label: "Issue Tickets", value: "05", detail: "2 baru hari ini", tone: "bg-[#FECACA]" },
];

export const elementChartPoints: ElementChartPoint[] = [
  { label: "Mon", orders: 24, users: 18 },
  { label: "Tue", orders: 29, users: 20 },
  { label: "Wed", orders: 27, users: 19 },
  { label: "Thu", orders: 34, users: 24 },
  { label: "Fri", orders: 38, users: 27 },
  { label: "Sat", orders: 31, users: 23 },
  { label: "Sun", orders: 26, users: 21 },
];

export const elementTableRows: ElementTableRow[] = [
  { name: "Neira Verse", role: "Quest Runner", status: "Active", completion: "96%" },
  { name: "Miska Aurora", role: "Quest Giver", status: "Review", completion: "87%" },
  { name: "Farel Danu", role: "Runner Ops", status: "Pending", completion: "73%" },
  { name: "Raka Aditama", role: "Field Support", status: "Active", completion: "91%" },
];
