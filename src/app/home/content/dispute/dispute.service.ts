// ─────────────────────────────────────────────────
// dispute.service.ts — Dummy data for Dispute Center
// ─────────────────────────────────────────────────
import GlobalEndpoint, { postJson, requestJson } from "../../../global.service";
import type { DisputeItem, DisputeLayer } from "./dispute";

export const DISPUTE_FILTER_OPTIONS_SEED = [
  "ALL",
  "EVIDENCE_SUBMISSION",
  "UNDER_REVIEW",
  "RESOLVED_RUNNER",
] as const;

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

type ApiDisputeEvidence = {
  id?: string;
  uploader?: string;
  type?: string;
  label?: string;
  uploadedAt?: string;
  uploaded_at?: string;
  url?: string;
  file_url?: string;
};

type ApiDisputeTimeline = {
  status?: string;
  time?: string;
  description?: string;
};

type ApiDisputeItem = {
  id: string;
  questId?: string;
  questTitle?: string;
  assignmentId?: string;
  amount?: string;
  raisedBy?: string;
  raisedAt?: string;
  status?: string;
  autoReleaseHoursLeft?: number;
  evidenceDeadline?: string;
  giverEvidence?: ApiDisputeEvidence[];
  runnerEvidence?: ApiDisputeEvidence[];
  mediatorNote?: string;
  resolvedAt?: string;
  timeline?: ApiDisputeTimeline[];
};

export type CreateDisputeEvidencePayload = {
  type: "PHOTO" | "VIDEO" | "NOTE";
  label: string;
  note_text?: string;
  file_name?: string;
  file_url?: string;
};

function normalizeStatus(status?: string): DisputeItem["status"] {
  switch ((status ?? "").toLowerCase()) {
    case "auto_timer":
      return "AUTO_TIMER";
    case "under_review":
      return "UNDER_REVIEW";
    case "resolved_giver":
      return "RESOLVED_GIVER";
    case "resolved_partial":
      return "RESOLVED_PARTIAL";
    case "dismissed":
      return "DISMISSED";
    case "resolved_runner":
      return "RESOLVED_RUNNER";
    default:
      return "EVIDENCE_SUBMISSION";
  }
}

function normalizeParty(party?: string): "GIVER" | "RUNNER" {
  return (party ?? "").toUpperCase() === "GIVER" ? "GIVER" : "RUNNER";
}

function normalizeEvidenceType(type?: string): "PHOTO" | "VIDEO" | "NOTE" {
  const normalized = (type ?? "").toUpperCase();
  return normalized === "VIDEO" || normalized === "NOTE" ? normalized : "PHOTO";
}

function normalizeDate(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toLocaleString("id-ID") : value;
}

function mapEvidence(item: ApiDisputeEvidence) {
  return {
    id: item.id || `EV-${Date.now()}`,
    uploader: normalizeParty(item.uploader),
    type: normalizeEvidenceType(item.type),
    label: item.label || "Evidence",
    uploadedAt: normalizeDate(item.uploadedAt || item.uploaded_at),
    url: item.url || item.file_url,
  };
}

export function mapDisputeFromApi(item: ApiDisputeItem): DisputeItem {
  const status = normalizeStatus(item.status);
  return {
    id: item.id,
    questId: item.questId || "-",
    questTitle: item.questTitle || "Quest dispute",
    amount: item.amount || "Rp0",
    raisedBy: normalizeParty(item.raisedBy),
    raisedAt: normalizeDate(item.raisedAt),
    status,
    autoReleaseHoursLeft: item.autoReleaseHoursLeft ?? 0,
    evidenceDeadline: normalizeDate(item.evidenceDeadline),
    giverEvidence: (item.giverEvidence ?? []).map(mapEvidence),
    runnerEvidence: (item.runnerEvidence ?? []).map(mapEvidence),
    mediatorNote: item.mediatorNote,
    resolvedAt: item.resolvedAt ? normalizeDate(item.resolvedAt) : undefined,
    timeline:
      item.timeline?.map((event) => ({
        status: normalizeStatus(event.status),
        time: normalizeDate(event.time),
        description: event.description || "-",
      })) ?? [{ status, time: normalizeDate(item.raisedAt), description: "Dispute dibuat." }],
  };
}

export async function fetchDisputesFromApi(): Promise<DisputeItem[]> {
  const response = await requestJson<ApiEnvelope<{ items?: ApiDisputeItem[] }>>(
    GlobalEndpoint().dispute.list,
  );
  return Array.isArray(response.data?.items) ? response.data.items.map(mapDisputeFromApi) : [];
}

export async function fetchDisputeDetailFromApi(disputeId: string): Promise<DisputeItem> {
  const response = await requestJson<ApiEnvelope<ApiDisputeItem>>(
    GlobalEndpoint().dispute.detail(disputeId),
  );
  return mapDisputeFromApi(response.data);
}

export async function createDisputeEvidenceFromApi(
  disputeId: string,
  payload: CreateDisputeEvidencePayload,
): Promise<DisputeItem> {
  const response = await postJson<CreateDisputeEvidencePayload, ApiEnvelope<ApiDisputeItem>>(
    GlobalEndpoint().dispute.evidence(disputeId),
    payload,
  );
  return mapDisputeFromApi(response.data);
}

export const disputeFilterLabelSeed: Record<
  (typeof DISPUTE_FILTER_OPTIONS_SEED)[number],
  string
> = {
  ALL: "Semua",
  EVIDENCE_SUBMISSION: "Submit Bukti",
  UNDER_REVIEW: "Review",
  RESOLVED_RUNNER: "Selesai",
};

export type DisputeViewCopy = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  stats: {
    caseSuffix: string;
    labels: {
      active: string;
      resolved: string;
      total: string;
    };
  };
  layer: {
    eyebrow: string;
    title: string;
    badgePrefix: string;
  };
  list: {
    eyebrow: string;
    title: string;
    emptyMessage: string;
    detailButton: string;
  };
  card: {
    raisedByPrefix: string;
    raisedAtSeparator: string;
    evidenceUploadedLabel: string;
    evidenceItemSuffix: string;
    evidenceDeadlineLabel: string;
    mediatorNoteLabel: string;
    autoTimerEnded: string;
    autoTimerPrefix: string;
  };
};

export const disputeViewCopySeed: DisputeViewCopy = {
  hero: {
    eyebrow: "Dispute Center",
    title: "Pusat Penyelesaian Sengketa",
    description:
      "Mekanisme 3 lapis: Auto Timer → Evidence → Platform Mediasi. Dana aman selama proses berlangsung.",
  },
  stats: {
    caseSuffix: "kasus",
    labels: {
      active: "Sengketa Aktif",
      resolved: "Terselesaikan",
      total: "Total",
    },
  },
  layer: {
    eyebrow: "Mekanisme Penyelesaian",
    title: "3 Lapis Dispute Resolution",
    badgePrefix: "Layer",
  },
  list: {
    eyebrow: "Daftar Sengketa",
    title: "Semua Kasus Aktif & Selesai",
    emptyMessage: "Tidak ada dispute ditemukan",
    detailButton: "Lihat Detail & Upload Bukti",
  },
  card: {
    raisedByPrefix: "Diajukan oleh",
    raisedAtSeparator: "·",
    evidenceUploadedLabel: "Bukti Diupload",
    evidenceItemSuffix: "item",
    evidenceDeadlineLabel: "Deadline Bukti",
    mediatorNoteLabel: "Catatan Mediator",
    autoTimerEnded: "Auto-timer sudah habis",
    autoTimerPrefix: "⏱ Auto-Release Dalam",
  },
};

export const disputeLayerToneSeed = [
  {
    border: "border-[#10B981]/30",
    bg: "dispute-layer-gradient-1",
    badge: "bg-[#DCFCE7] text-[#166534]",
  },
  {
    border: "border-[#F59E0B]/30",
    bg: "dispute-layer-gradient-2",
    badge: "bg-[#FEF3C7] text-[#92400E]",
  },
  {
    border: "border-[#A046FF]/30",
    bg: "dispute-layer-gradient-3",
    badge: "bg-[#E9D5FF] text-[#6D28D9]",
  },
] as const;

export const disputeLayers: DisputeLayer[] = [
  {
    layer: 1,
    label: "Auto Timer",
    description:
      "Jika Giver tidak melakukan audit dalam 24 jam setelah Runner menekan 'Selesai Kerja', sistem secara otomatis me-release dana ke Runner.",
  },
  {
    layer: 2,
    label: "Evidence Based",
    description:
      "Kedua pihak dapat mengupload bukti (foto/video pekerjaan). Sistem memberi waktu 24 jam untuk submit bukti dari masing-masing pihak.",
  },
  {
    layer: 3,
    label: "Platform Mediasi",
    description:
      "Tim QQ mereview bukti dari kedua pihak dan memberikan keputusan final. Pihak yang terbukti salah mendapat PP turun + peringatan. Repeat offender → akun di-suspend.",
  },
];

export const disputeStatusMeta: Record<
  DisputeItem["status"],
  { label: string; color: string; bg: string }
> = {
  AUTO_TIMER:           { label: "Auto Timer Aktif",    color: "text-[#92400E]",  bg: "bg-[#FEF3C7]" },
  EVIDENCE_SUBMISSION:  { label: "Submit Bukti",        color: "text-[#1D4ED8]",  bg: "bg-[#DBEAFE]" },
  UNDER_REVIEW:         { label: "Dalam Review",        color: "text-[#6D28D9]",  bg: "bg-[#E9D5FF]" },
  RESOLVED_RUNNER:      { label: "Selesai — Runner Menang", color: "text-[#166534]", bg: "bg-[#DCFCE7]" },
  RESOLVED_GIVER:       { label: "Selesai — Giver Menang",  color: "text-[#166534]", bg: "bg-[#DCFCE7]" },
  RESOLVED_PARTIAL:     { label: "Selesai — Win-Win (50:50)", color: "text-[#166534]", bg: "bg-[#DCFCE7]" },
  DISMISSED:            { label: "Ditolak",             color: "text-[#991B1B]",  bg: "bg-[#FEE2E2]" },
};

export const disputeItems: DisputeItem[] = [
  {
    id: "DSP-001",
    questId: "QST-7821",
    questTitle: "Bersih-bersih Kantor Lantai 3",
    amount: "Rp 120.000",
    raisedBy: "GIVER",
    raisedAt: "14 Apr 2026, 09:30",
    status: "EVIDENCE_SUBMISSION",
    autoReleaseHoursLeft: 18,
    evidenceDeadline: "15 Apr 2026, 09:30",
    giverEvidence: [
      {
        id: "EV-001",
        uploader: "GIVER",
        type: "PHOTO",
        label: "Foto area yang belum dibersihkan",
        uploadedAt: "14 Apr 2026, 10:15",
      },
      {
        id: "EV-002",
        uploader: "GIVER",
        type: "NOTE",
        label: "Catatan inspeksi: sudut kiri toilet masih kotor",
        uploadedAt: "14 Apr 2026, 10:20",
      },
    ],
    runnerEvidence: [
      {
        id: "EV-003",
        uploader: "RUNNER",
        type: "PHOTO",
        label: "Foto hasil bersih-bersih (after)",
        uploadedAt: "14 Apr 2026, 11:00",
      },
    ],
    timeline: [
      { status: "AUTO_TIMER", time: "14 Apr 2026, 09:30", description: "Dispute dinaikkan oleh Giver. Pembekuan Escrow Rp 120.000." },
      { status: "EVIDENCE_SUBMISSION", time: "-", description: "Menunggu submit bukti foto/keterangan dari kedua belah pihak." }
    ]
  },
  {
    id: "DSP-002",
    questId: "QST-7744",
    questTitle: "Install Jaringan WiFi Kantor",
    amount: "Rp 350.000",
    raisedBy: "RUNNER",
    raisedAt: "12 Apr 2026, 14:00",
    status: "UNDER_REVIEW",
    autoReleaseHoursLeft: 0,
    evidenceDeadline: "13 Apr 2026, 14:00",
    giverEvidence: [],
    runnerEvidence: [
      {
        id: "EV-010",
        uploader: "RUNNER",
        type: "PHOTO",
        label: "Foto instalasi selesai + speed test",
        uploadedAt: "12 Apr 2026, 15:30",
      },
      {
        id: "EV-011",
        uploader: "RUNNER",
        type: "VIDEO",
        label: "Video demo koneksi berjalan normal",
        uploadedAt: "12 Apr 2026, 15:35",
      },
    ],
    mediatorNote: "Bukti Runner lebih kuat. Sedang dalam finalisasi keputusan.",
    timeline: [
      { status: "AUTO_TIMER", time: "12 Apr 2026, 14:00", description: "Dispute dinaikkan oleh Runner. Menunggu audit." },
      { status: "EVIDENCE_SUBMISSION", time: "12 Apr 2026, 15:35", description: "Runner melampirkan 2 bukti operasional." },
      { status: "UNDER_REVIEW", time: "13 Apr 2026, 09:00", description: "Sistem meninjau kelengkapan bukti." }
    ]
  },
  {
    id: "DSP-003",
    questId: "QST-7610",
    questTitle: "Antar Dokumen ke Notaris",
    amount: "Rp 75.000",
    raisedBy: "RUNNER",
    raisedAt: "10 Apr 2026, 08:00",
    status: "RESOLVED_RUNNER",
    autoReleaseHoursLeft: 0,
    evidenceDeadline: "11 Apr 2026, 08:00",
    giverEvidence: [],
    runnerEvidence: [
      {
        id: "EV-020",
        uploader: "RUNNER",
        type: "PHOTO",
        label: "Foto tanda terima dari notaris",
        uploadedAt: "10 Apr 2026, 10:45",
      },
    ],
    mediatorNote: "Runner terbukti telah mengantar dokumen. Dana di-release penuh.",
    resolvedAt: "11 Apr 2026, 12:00",
    timeline: [
      { status: "AUTO_TIMER", time: "10 Apr 2026, 08:00", description: "Dispute dinaikkan. Refund request." },
      { status: "EVIDENCE_SUBMISSION", time: "10 Apr 2026, 10:45", description: "Runner memberikan bukti." },
      { status: "UNDER_REVIEW", time: "10 Apr 2026, 15:00", description: "Mediator melakukan audit notaris." },
      { status: "RESOLVED_RUNNER", time: "11 Apr 2026, 12:00", description: "Sengketa dimenangkan oleh Runner." }
    ]
  },
  {
    id: "DSP-004",
    questId: "QST-7555",
    questTitle: "Edit Video Iklan 1 Menit",
    amount: "Rp 500.000",
    raisedBy: "GIVER",
    raisedAt: "08 Apr 2026, 10:00",
    status: "RESOLVED_PARTIAL",
    autoReleaseHoursLeft: 0,
    evidenceDeadline: "09 Apr 2026, 10:00",
    giverEvidence: [
      { id: "EV-030", uploader: "GIVER", type: "NOTE", label: "Revisi tidak dikerjakan sesuai brief, tapi durasi terpenuhi.", uploadedAt: "08 Apr 2026, 10:15" },
    ],
    runnerEvidence: [
      { id: "EV-031", uploader: "RUNNER", type: "PHOTO", label: "Screenshot folder project telah selesai.", uploadedAt: "08 Apr 2026, 11:00" }
    ],
    mediatorNote: "Kualitas hasil tidak memenuhi 100% brief namun runner telah mengalokasikan waktu dan resource. Refund 50:50 diputuskan untuk keadilan bersama.",
    resolvedAt: "10 Apr 2026, 15:30",
    timeline: [
      { status: "AUTO_TIMER", time: "08 Apr 2026, 10:00", description: "Giver menahan escrow karena revisi belum selesai." },
      { status: "EVIDENCE_SUBMISSION", time: "08 Apr 2026, 11:00", description: "Kedua belah pihak merilis bukti awal." },
      { status: "UNDER_REVIEW", time: "09 Apr 2026, 09:00", description: "Mediator turun tangan membandingkan hasil render." },
      { status: "RESOLVED_PARTIAL", time: "10 Apr 2026, 15:30", description: "Resolusi Win-Win: Escrow dipotong 50:50." }
    ]
  },
];

// ─── GIVER MODE DATA ────────────────────────────────────────────────────────

export const disputeGiverViewCopySeed: DisputeViewCopy = {
  hero: {
    eyebrow: "Giver Dispute Center",
    title: "Pusat Sengketa Pemberi Kerja",
    description:
      "Lindungi dana escrow Anda. Gunakan fitur audit 24 jam untuk menahan dana jika kinerja tidak sesuai standar.",
  },
  stats: {
    caseSuffix: "laporan",
    labels: {
      active: "Investigasi",
      resolved: "Kasus Selesai",
      total: "Total Laporan",
    },
  },
  layer: {
    eyebrow: "Sistem Perlindungan Giver",
    title: "Tiga Tahap Audit Kinerja",
    badgePrefix: "Tahap",
  },
  list: {
    eyebrow: "Daftar Laporan Anda",
    title: "Pekerjaan Bermasalah Aktif & Selesai",
    emptyMessage: "Tidak ada kinerja bermasalah saat ini",
    detailButton: "Tinjau & Lengkapi Bukti",
  },
  card: {
    raisedByPrefix: "Dilaporkan oleh",
    raisedAtSeparator: "·",
    evidenceUploadedLabel: "Bukti Diunggah",
    evidenceItemSuffix: "lampiran",
    evidenceDeadlineLabel: "Batas Waktu Upload",
    mediatorNoteLabel: "Catatan Admin Neiraverse",
    autoTimerEnded: "Dana ter-release ke Runner",
    autoTimerPrefix: "⏱ Sisa Waktu Audit",
  },
};

export const disputeGiverItems: DisputeItem[] = [
  {
    id: "GDSP-001",
    questId: "QST-9912",
    questTitle: "Riset Pasar Kopi Lokal (200 Responden)",
    amount: "Rp 850.000",
    raisedBy: "GIVER",
    raisedAt: "15 Apr 2026, 14:20",
    status: "EVIDENCE_SUBMISSION",
    autoReleaseHoursLeft: 0,
    evidenceDeadline: "16 Apr 2026, 14:20",
    giverEvidence: [
      {
        id: "GEV-001",
        uploader: "GIVER",
        type: "NOTE",
        label: "Bukti screenshot: Mayoritas responden diisi oleh bot/akun palsu.",
        uploadedAt: "15 Apr 2026, 14:35",
      },
      {
        id: "GEV-002",
        uploader: "GIVER",
        type: "PHOTO",
        label: "Data excel anomali",
        uploadedAt: "15 Apr 2026, 14:40",
      },
    ],
    runnerEvidence: [],
    timeline: [
      { status: "AUTO_TIMER", time: "15 Apr 2026, 14:20", description: "Laporkan masalah: Kualitas responden rendah." },
      { status: "EVIDENCE_SUBMISSION", time: "-", description: "Menunggu Runner melengkapi pembelaan/bukti." }
    ]
  },
  {
    id: "GDSP-002",
    questId: "QST-9884",
    questTitle: "Jaga Stand Pameran 8 Jam",
    amount: "Rp 300.000",
    raisedBy: "GIVER",
    raisedAt: "12 Apr 2026, 18:00",
    status: "UNDER_REVIEW",
    autoReleaseHoursLeft: 0,
    evidenceDeadline: "13 Apr 2026, 18:00",
    giverEvidence: [
      {
        id: "GEV-010",
        uploader: "GIVER",
        type: "VIDEO",
        label: "Rekaman CCTV: Runner meninggalkan stand selama 3 jam",
        uploadedAt: "12 Apr 2026, 18:15",
      },
    ],
    runnerEvidence: [
      {
        id: "GEV-011",
        uploader: "RUNNER",
        type: "NOTE",
        label: "Surat izin sakit sementara / P3K",
        uploadedAt: "13 Apr 2026, 09:10",
      },
    ],
    mediatorNote: "Bukti CCTV dan alasan P3K sedang dievaluasi bersama panitia pameran.",
    timeline: [
      { status: "AUTO_TIMER", time: "12 Apr 2026, 18:00", description: "Laporan dibangkitkan. Escrow terkunci." },
      { status: "EVIDENCE_SUBMISSION", time: "13 Apr 2026, 09:10", description: "Kedua pihak telah memberikan bukti kuat." },
      { status: "UNDER_REVIEW", time: "13 Apr 2026, 14:00", description: "Sedang dikomunikasikan dengan penyelenggara." }
    ]
  },
];

// ─── ROLE DATA SEED MAP ──────────────────────────────────────────────────────

export type DisputeRoleDataSeed = {
  viewCopy: DisputeViewCopy;
  items: DisputeItem[];
};

export const disputeRoleDataSeed: Record<"runner" | "giver", DisputeRoleDataSeed> = {
  runner: {
    viewCopy: disputeViewCopySeed,
    items: disputeItems,
  },
  giver: {
    viewCopy: disputeGiverViewCopySeed,
    items: disputeGiverItems,
  },
};
