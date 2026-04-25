// state.service.ts — ESVMC Service Layer
// Data Seed untuk Giver State (Reputasi, Trust Score, Riwayat Bayar)

export type GiverTrustBadge = {
  id: string;
  label: string;
  description: string;
  earnedAt: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
};

export type GiverPaymentRecord = {
  id: string;
  description: string;
  type: "Escrow Lock" | "Escrow Release" | "Refund" | "Penalty";
  amount: string;
  date: string;
};

export type GiverStateWarning = {
  id: string;
  type: "warning" | "info" | "danger";
  message: string;
};

export const giverTrustBadgesSeed: GiverTrustBadge[] = [
  {
    id: "GB01",
    label: "Verified Giver",
    description: "Telah melewati proses verifikasi identitas resmi.",
    earnedAt: "Januari 2024",
    tier: "silver",
  },
  {
    id: "GB02",
    label: "Trusted Payer",
    description: "Tidak pernah gagal escrow dalam 10 quest terakhir.",
    earnedAt: "Maret 2024",
    tier: "gold",
  },
  {
    id: "GB03",
    label: "Quest Master",
    description: "Berhasil menyelesaikan lebih dari 10 quest dengan completion rate 90%+.",
    earnedAt: "April 2024",
    tier: "platinum",
  },
];

export const giverPaymentRecordsSeed: GiverPaymentRecord[] = [
  {
    id: "PAY-021",
    description: "Escrow untuk QG-0011 (2 Runner)",
    type: "Escrow Release",
    amount: "Rp420.000",
    date: "Hari ini",
  },
  {
    id: "PAY-020",
    description: "Escrow untuk QG-0010 (3 Runner, ongoing)",
    type: "Escrow Lock",
    amount: "Rp780.000",
    date: "Kemarin",
  },
  {
    id: "PAY-019",
    description: "Escrow QG-0009 selesai",
    type: "Escrow Release",
    amount: "Rp195.000",
    date: "2 hari lalu",
  },
  {
    id: "PAY-018",
    description: "Refund pembatalan QG-0008",
    type: "Refund",
    amount: "Rp0",
    date: "3 hari lalu",
  },
];

export const giverStateWarningsSeed: GiverStateWarning[] = [
  {
    id: "GW01",
    type: "info",
    message: "Sertakan deskripsi tugas lebih spesifik untuk meningkatkan fill rate quest kelompok.",
  },
];

export const giverStateSummarySeed = {
  tier: "Giver Terverifikasi",
  trustScore: "92/100",
  totalQuestPosted: "11",
  totalSpent: "Rp4.8Jt",
  completionRate: "89%",
  joinedAt: "Januari 2024",
};
