import type { ChatActionChip, ChatThread } from "./chat";

export const CHAT_ESCROW_FLOW_SEED = [
  "UNPAID",
  "LOCKED",
  "IN_PROGRESS",
  "PENDING_CONFIRMATION",
  "RELEASED",
  "DISPUTED",
] as const;

export const chatListFiltersSeed = ["ALL", "ACTION", "RISK"] as const;

export type ChatViewCopy = {
  hero: {
    eyebrow: string;
    badge: string;
    listFilterLabels: Record<(typeof chatListFiltersSeed)[number], string>;
    searchPlaceholder: string;
    emptyThreadMessage: string;
  };
  threadItem: {
    unreadSuffix: string;
  };
  panel: {
    eyebrow: string;
    closeButton: string;
    contextEyebrow: string;
    timelineEyebrow: string;
    timelineTitle: string;
    conversationEyebrow: string;
    actionChipsEyebrow: string;
    slaEyebrow: string;
    trustEyebrow: string;
    attachmentEyebrow: string;
  };
};

export const chatViewCopySeed: ChatViewCopy = {
  hero: {
    eyebrow: "QQM Chat Dispatch",
    badge: "Ojol x Freelance Thread",
    listFilterLabels: {
      ALL: "ALL",
      ACTION: "ACTION",
      RISK: "RISK",
    },
    searchPlaceholder: "Cari thread by runner / quest id...",
    emptyThreadMessage:
      "Thread tidak ditemukan. Coba ubah filter atau kata kunci.",
  },
  threadItem: {
    unreadSuffix: "unread",
  },
  panel: {
    eyebrow: "Live Thread Panel",
    closeButton: "Tutup",
    contextEyebrow: "Thread Context Header",
    timelineEyebrow: "System Timeline",
    timelineTitle: "Escrow Flow: LOCKED -> IN_PROGRESS -> PENDING_CONFIRMATION",
    conversationEyebrow: "Live Conversation",
    actionChipsEyebrow: "Action Chips",
    slaEyebrow: "SLA Widget",
    trustEyebrow: "Trust Signals",
    attachmentEyebrow: "Attachment Panel",
  },
};

export const chatActionChips: ChatActionChip[] = [
  {
    id: "send-location",
    label: "Kirim lokasi",
    hint: "Bagikan titik kerja realtime untuk sinkron pickup/dropoff.",
    tone: "bg-[#DBEAFE] text-[#1D4ED8]",
  },
  {
    id: "request-proof",
    label: "Minta bukti foto",
    hint: "Minta before/after agar approval lebih cepat.",
    tone: "bg-[#DCFCE7] text-[#166534]",
  },
  {
    id: "raise-revision",
    label: "Ajukan revisi",
    hint: "Tambahkan revisi singkat sebelum masuk dispute.",
    tone: "bg-[#FEF3C7] text-[#92400E]",
  },
  {
    id: "escalate-dispute",
    label: "Escalate dispute",
    hint: "Aktifkan mediasi jika brief dan hasil tidak sinkron.",
    tone: "bg-[#FECACA] text-[#991B1B]",
  },
];

export const chatThreads: ChatThread[] = [
  {
    id: "chat-qst-901",
    name: "Neira",
    role: "Quest Runner",
    location: "Cilandak",
    message: "Siap, nanti aku upload before-after biar langsung bisa approve.",
    time: "09:12",
    unreadCount: 2,
    status: "IN_PROGRESS",
    context: {
      questId: "QST-2026-0412-901",
      mode: "Per-Individu",
      radius: "< 2 km",
      wageBand: "Rp150.000 - Rp250.000",
      deadline: "12 Apr 2026, 13:30",
      escrowState: "IN_PROGRESS",
    },
    timeline: [
      { state: "LOCKED", time: "09:01", note: "Escrow terkunci, runner siap eksekusi." },
      { state: "IN_PROGRESS", time: "09:07", note: "Runner mulai kerja di lokasi." },
      { state: "PENDING_CONFIRMATION", time: "-", note: "Menunggu hasil akhir dan approval giver." },
    ],
    sla: [
      { label: "First Response", value: "1m 12s", tone: "bg-[#DCFCE7] text-[#166534]" },
      { label: "Avg Reply", value: "2m 48s", tone: "bg-[#DBEAFE] text-[#1D4ED8]" },
      { label: "Last Active", value: "15 detik lalu", tone: "bg-[#E9D5FF] text-[#6D28D9]" },
      { label: "Delay Risk", value: "Low", tone: "bg-[#DCFCE7] text-[#166534]" },
    ],
    trust: [
      { label: "Verified", value: "Giver + Runner", tone: "text-[#166534]" },
      { label: "Completion Rate", value: "97.2%", tone: "text-[#1D4ED8]" },
      { label: "Dispute Ratio", value: "0.8%", tone: "text-[#9D174D]" },
    ],
    messages: [
      { id: "m-901-1", role: "runner", text: "Lokasi udah aman, aku mulai dari area depan dulu ya.", time: "09:07" },
      { id: "m-901-2", role: "giver", text: "Gas, lanjut. Habis itu cek stok rak kanan juga.", time: "09:08" },
      { id: "m-901-3", role: "runner", text: "Siap, nanti aku upload before-after biar langsung bisa approve.", time: "09:12" },
      { id: "m-901-4", role: "system", text: "System: Escrow state aktif di IN_PROGRESS.", time: "09:12" },
    ],
    attachments: [
      { id: "a-901-0", type: "Location Pin", title: "Target Lokasi Tugas", detail: "Pontianak (Mocked Khatulistiwa)", status: "Uploaded" },
      { id: "a-901-1", type: "Before Photo", title: "Kondisi rak awal", detail: "IMG_20260412_0905.jpg", status: "Uploaded" },
      { id: "a-901-2", type: "After Photo", title: "Rak sesudah dirapikan", detail: "Belum diunggah", status: "Pending" },
      { id: "a-901-3", type: "Brief File", title: "Brief Restock Area A", detail: "brief-restock-v2.pdf", status: "Reviewed" },
      { id: "a-901-4", type: "Delivery Proof", title: "Checklist item masuk", detail: "proof-scan-12apr.pdf", status: "Pending" },
    ],
  },
  {
    id: "chat-qst-882",
    name: "Miska",
    role: "Quest Runner",
    location: "Depok",
    message: "Foto final display sudah lengkap, tinggal konfirmasi release.",
    time: "10:33",
    unreadCount: 0,
    status: "MATCH",
    context: {
      questId: "QST-2026-0412-882",
      mode: "Per-Individu",
      radius: ">= 2 km",
      wageBand: "Rp200.000 - Rp300.000",
      deadline: "12 Apr 2026, 16:00",
      escrowState: "PENDING_CONFIRMATION",
    },
    timeline: [
      { state: "LOCKED", time: "10:02", note: "Escrow lock berhasil." },
      { state: "IN_PROGRESS", time: "10:10", note: "Runner mulai penataan display." },
      { state: "PENDING_CONFIRMATION", time: "10:31", note: "Dokumentasi terkirim, tunggu approval." },
    ],
    sla: [
      { label: "First Response", value: "2m 03s", tone: "bg-[#DCFCE7] text-[#166534]" },
      { label: "Avg Reply", value: "4m 10s", tone: "bg-[#DBEAFE] text-[#1D4ED8]" },
      { label: "Last Active", value: "2 menit lalu", tone: "bg-[#E9D5FF] text-[#6D28D9]" },
      { label: "Delay Risk", value: "Medium", tone: "bg-[#FEF3C7] text-[#92400E]" },
    ],
    trust: [
      { label: "Verified", value: "Runner Verified", tone: "text-[#166534]" },
      { label: "Completion Rate", value: "95.8%", tone: "text-[#1D4ED8]" },
      { label: "Dispute Ratio", value: "1.1%", tone: "text-[#9D174D]" },
    ],
    messages: [
      { id: "m-882-1", role: "giver", text: "Kak, foto sisi kiri display bisa ditambah close-up?", time: "10:18" },
      { id: "m-882-2", role: "runner", text: "Siap, ini aku kirim close-up produk promo.", time: "10:22" },
      { id: "m-882-3", role: "runner", text: "Foto final display sudah lengkap, tinggal konfirmasi release.", time: "10:33" },
      { id: "m-882-4", role: "system", text: "System: Status pindah ke PENDING_CONFIRMATION.", time: "10:33" },
    ],
    attachments: [
      { id: "a-882-1", type: "Before Photo", title: "Display sebelum revisi", detail: "display-before.png", status: "Uploaded" },
      { id: "a-882-2", type: "After Photo", title: "Display final", detail: "display-final.png", status: "Uploaded" },
      { id: "a-882-3", type: "Brief File", title: "Planogram UMKM", detail: "planogram-weekly.pdf", status: "Reviewed" },
      { id: "a-882-4", type: "Delivery Proof", title: "Konfirmasi stok promo", detail: "proof-stock.xlsx", status: "Reviewed" },
    ],
  },
  {
    id: "chat-qst-857",
    name: "Giver A",
    role: "Quest Giver",
    location: "Kuningan",
    message: "Budget tambahan buat pickup bisa dinaikin nggak?",
    time: "12:05",
    unreadCount: 1,
    status: "RISK",
    context: {
      questId: "QST-2026-0412-857",
      mode: "Ber-Kelompok",
      radius: ">= 2 km",
      wageBand: "Rp300.000 - Rp520.000",
      deadline: "12 Apr 2026, 17:00",
      escrowState: "LOCKED",
    },
    timeline: [
      { state: "LOCKED", time: "11:41", note: "Escrow lock aktif untuk 3 slot runner." },
      { state: "IN_PROGRESS", time: "-", note: "Belum start, menunggu kesepakatan update budget." },
      { state: "DISPUTED", time: "-", note: "Akan aktif jika negosiasi gagal dan brief berubah." },
    ],
    sla: [
      { label: "First Response", value: "6m 20s", tone: "bg-[#FEF3C7] text-[#92400E]" },
      { label: "Avg Reply", value: "9m 42s", tone: "bg-[#FECACA] text-[#991B1B]" },
      { label: "Last Active", value: "4 menit lalu", tone: "bg-[#E9D5FF] text-[#6D28D9]" },
      { label: "Delay Risk", value: "High", tone: "bg-[#FECACA] text-[#991B1B]" },
    ],
    trust: [
      { label: "Verified", value: "Giver Unverified", tone: "text-[#991B1B]" },
      { label: "Completion Rate", value: "88.4%", tone: "text-[#1D4ED8]" },
      { label: "Dispute Ratio", value: "3.6%", tone: "text-[#9D174D]" },
    ],
    messages: [
      { id: "m-857-1", role: "giver", text: "Budget tambahan buat pickup bisa dinaikin nggak?", time: "12:05" },
      { id: "m-857-2", role: "system", text: "System: Brief berubah setelah escrow lock. Sarankan revisi formal.", time: "12:06" },
      { id: "m-857-3", role: "runner", text: "Bisa, tapi mohon update nominal dan scope biar aman buat semua runner.", time: "12:08" },
    ],
    attachments: [
      { id: "a-857-1", type: "Before Photo", title: "Kondisi gudang awal", detail: "gudang-before.jpg", status: "Uploaded" },
      { id: "a-857-2", type: "After Photo", title: "Foto akhir pekerjaan", detail: "Belum ada upload", status: "Pending" },
      { id: "a-857-3", type: "Brief File", title: "Brief Pickup Gudang", detail: "pickup-brief-draft.docx", status: "Pending" },
      { id: "a-857-4", type: "Delivery Proof", title: "Tanda terima barang", detail: "Belum tersedia", status: "Pending" },
    ],
  },
];

// â”€â”€â”€ GIVER MODE DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ESVMC Point 13: Semua teks/data tampilan disimpan di service.ts

export const chatGiverViewCopySeed: ChatViewCopy = {
  hero: {
    eyebrow: "QQM Giver Dispatch",
    badge: "Thread Runner Aktif di Questmu",
    listFilterLabels: {
      ALL: "SEMUA",
      ACTION: "PERLU AKSI",
      RISK: "RISIKO",
    },
    searchPlaceholder: "Cari thread by nama runner / quest id...",
    emptyThreadMessage:
      "Tidak ada thread aktif. Buat quest baru untuk mulai terima runner.",
  },
  threadItem: {
    unreadSuffix: "belum dibaca",
  },
  panel: {
    eyebrow: "Panel Thread Runner",
    closeButton: "Tutup",
    contextEyebrow: "Konteks Quest",
    timelineEyebrow: "Timeline System",
    timelineTitle: "Escrow Flow: LOCKED -> IN_PROGRESS -> PENDING_CONFIRMATION",
    conversationEyebrow: "Percakapan Live",
    actionChipsEyebrow: "Aksi Cepat Giver",
    slaEyebrow: "SLA Widget",
    trustEyebrow: "Sinyal Kepercayaan",
    attachmentEyebrow: "Bukti & Dokumen",
  },
};

export const chatGiverActionChips: ChatActionChip[] = [
  {
    id: "request-proof",
    label: "Minta bukti foto",
    hint: "Minta runner kirim before/after agar kamu bisa review dan approve.",
    tone: "bg-[#DCFCE7] text-[#166534]",
  },
  {
    id: "raise-revision",
    label: "Minta revisi",
    hint: "Kirim catatan revisi ke runner sebelum kamu release escrow.",
    tone: "bg-[#FEF3C7] text-[#92400E]",
  },
  {
    id: "send-location",
    label: "Update lokasi",
    hint: "Update titik kerja jika ada perubahan dari brief awal.",
    tone: "bg-[#DBEAFE] text-[#1D4ED8]",
  },
  {
    id: "escalate-dispute",
    label: "Buka dispute",
    hint: "Aktifkan mediasi jika hasil runner tidak sesuai brief.",
    tone: "bg-[#FECACA] text-[#991B1B]",
  },
];

export const chatGiverThreads: ChatThread[] = [
  {
    id: "gchat-qst-901",
    name: "Neira",
    role: "Quest Runner",
    location: "Cilandak",
    message: "Siap, nanti aku upload before-after biar langsung bisa approve.",
    time: "09:12",
    unreadCount: 2,
    status: "IN_PROGRESS",
    context: {
      questId: "QST-2026-0412-901",
      mode: "Per-Individu",
      radius: "< 2 km",
      wageBand: "Rp150.000 - Rp250.000",
      deadline: "12 Apr 2026, 13:30",
      escrowState: "IN_PROGRESS",
    },
    timeline: [
      { state: "LOCKED", time: "09:01", note: "Kamu lock escrow â€” runner siap eksekusi." },
      { state: "IN_PROGRESS", time: "09:07", note: "Runner mulai di lokasi, menunggu hasil." },
      { state: "PENDING_CONFIRMATION", time: "-", note: "Menunggu foto bukti sebelum kamu konfirmasi." },
    ],
    sla: [
      { label: "First Response", value: "1m 12s", tone: "bg-[#DCFCE7] text-[#166534]" },
      { label: "Avg Reply", value: "2m 48s", tone: "bg-[#DBEAFE] text-[#1D4ED8]" },
      { label: "Last Active", value: "15 detik lalu", tone: "bg-[#E9D5FF] text-[#6D28D9]" },
      { label: "Delay Risk", value: "Low", tone: "bg-[#DCFCE7] text-[#166534]" },
    ],
    trust: [
      { label: "Verified", value: "Runner Verified", tone: "text-[#166534]" },
      { label: "Completion Rate", value: "97.2%", tone: "text-[#1D4ED8]" },
      { label: "Dispute Ratio", value: "0.8%", tone: "text-[#9D174D]" },
    ],
    messages: [
      { id: "gm-901-1", role: "giver", text: "Gas, lanjut. Habis itu cek stok rak kanan juga.", time: "09:08" },
      { id: "gm-901-2", role: "runner", text: "Siap, nanti aku upload before-after biar langsung bisa approve.", time: "09:12" },
      { id: "gm-901-3", role: "system", text: "System: Escrow state aktif di IN_PROGRESS.", time: "09:12" },
    ],
    attachments: [
      { id: "ga-901-0", type: "Location Pin", title: "Target Lokasi Tugas", detail: "Pontianak (Mocked Khatulistiwa)", status: "Uploaded" },
      { id: "ga-901-1", type: "Before Photo", title: "Kondisi rak awal", detail: "IMG_20260412_0905.jpg", status: "Uploaded" },
      { id: "ga-901-2", type: "After Photo", title: "Rak sesudah dirapikan", detail: "Belum diunggah oleh runner", status: "Pending" },
      { id: "ga-901-3", type: "Brief File", title: "Brief Restock Area A", detail: "brief-restock-v2.pdf", status: "Reviewed" },
      { id: "ga-901-4", type: "Delivery Proof", title: "Checklist item masuk", detail: "proof-scan-12apr.pdf", status: "Pending" },
    ],
  },
  {
    id: "gchat-qst-882",
    name: "Miska",
    role: "Quest Runner",
    location: "Depok",
    message: "Foto final display sudah lengkap, tinggal konfirmasi release.",
    time: "10:33",
    unreadCount: 1,
    status: "MATCH",
    context: {
      questId: "QST-2026-0412-882",
      mode: "Per-Individu",
      radius: ">= 2 km",
      wageBand: "Rp200.000 - Rp300.000",
      deadline: "12 Apr 2026, 16:00",
      escrowState: "PENDING_CONFIRMATION",
    },
    timeline: [
      { state: "LOCKED", time: "10:02", note: "Escrow lock â€” dana terpegang aman." },
      { state: "IN_PROGRESS", time: "10:10", note: "Runner mulai penataan display." },
      { state: "PENDING_CONFIRMATION", time: "10:31", note: "Dokumentasi diunggah â€” review dan release sekarang." },
    ],
    sla: [
      { label: "First Response", value: "2m 03s", tone: "bg-[#DCFCE7] text-[#166534]" },
      { label: "Avg Reply", value: "4m 10s", tone: "bg-[#DBEAFE] text-[#1D4ED8]" },
      { label: "Last Active", value: "2 menit lalu", tone: "bg-[#E9D5FF] text-[#6D28D9]" },
      { label: "Delay Risk", value: "Medium", tone: "bg-[#FEF3C7] text-[#92400E]" },
    ],
    trust: [
      { label: "Verified", value: "Runner Verified", tone: "text-[#166534]" },
      { label: "Completion Rate", value: "95.8%", tone: "text-[#1D4ED8]" },
      { label: "Dispute Ratio", value: "1.1%", tone: "text-[#9D174D]" },
    ],
    messages: [
      { id: "gm-882-1", role: "giver", text: "Kak, foto sisi kiri display bisa ditambah close-up?", time: "10:18" },
      { id: "gm-882-2", role: "runner", text: "Foto final display sudah lengkap, tinggal konfirmasi release.", time: "10:33" },
      { id: "gm-882-3", role: "system", text: "System: Status pindah ke PENDING_CONFIRMATION. Silakan review dan release.", time: "10:33" },
    ],
    attachments: [
      { id: "ga-882-1", type: "Before Photo", title: "Display sebelum revisi", detail: "display-before.png", status: "Uploaded" },
      { id: "ga-882-2", type: "After Photo", title: "Display final", detail: "display-final.png", status: "Uploaded" },
      { id: "ga-882-3", type: "Brief File", title: "Planogram UMKM", detail: "planogram-weekly.pdf", status: "Reviewed" },
      { id: "ga-882-4", type: "Delivery Proof", title: "Konfirmasi stok promo", detail: "proof-stock.xlsx", status: "Reviewed" },
    ],
  },
  {
    id: "gchat-qst-857",
    name: "Tim Gudang (3 Runner)",
    role: "Quest Runner Group",
    location: "Kuningan",
    message: "Bisa, tapi mohon update nominal dan scope biar aman buat semua runner.",
    time: "12:08",
    unreadCount: 0,
    status: "RISK",
    context: {
      questId: "QST-2026-0412-857",
      mode: "Ber-Kelompok",
      radius: ">= 2 km",
      wageBand: "Rp300.000 - Rp520.000",
      deadline: "12 Apr 2026, 17:00",
      escrowState: "LOCKED",
    },
    timeline: [
      { state: "LOCKED", time: "11:41", note: "Kamu lock escrow untuk 3 slot runner kelompok." },
      { state: "IN_PROGRESS", time: "-", note: "Belum start â€” menunggu klarifikasi budget dari kamu." },
      { state: "DISPUTED", time: "-", note: "Akan aktif jika tidak ada kesepakatan revisi brief." },
    ],
    sla: [
      { label: "First Response", value: "6m 20s", tone: "bg-[#FEF3C7] text-[#92400E]" },
      { label: "Avg Reply", value: "9m 42s", tone: "bg-[#FECACA] text-[#991B1B]" },
      { label: "Last Active", value: "4 menit lalu", tone: "bg-[#E9D5FF] text-[#6D28D9]" },
      { label: "Delay Risk", value: "High", tone: "bg-[#FECACA] text-[#991B1B]" },
    ],
    trust: [
      { label: "Verified", value: "Giver Belum Verified", tone: "text-[#991B1B]" },
      { label: "Completion Rate", value: "88.4%", tone: "text-[#1D4ED8]" },
      { label: "Dispute Ratio", value: "3.6%", tone: "text-[#9D174D]" },
    ],
    messages: [
      { id: "gm-857-1", role: "giver", text: "Budget tambahan buat pickup bisa dinaikin nggak?", time: "12:05" },
      { id: "gm-857-2", role: "system", text: "System: Brief berubah setelah escrow lock. Disarankan revisi formal sebelum lanjut.", time: "12:06" },
      { id: "gm-857-3", role: "runner", text: "Bisa, tapi mohon update nominal dan scope biar aman buat semua runner.", time: "12:08" },
    ],
    attachments: [
      { id: "ga-857-1", type: "Before Photo", title: "Kondisi gudang awal", detail: "gudang-before.jpg", status: "Uploaded" },
      { id: "ga-857-2", type: "After Photo", title: "Foto akhir pekerjaan", detail: "Belum ada upload", status: "Pending" },
      { id: "ga-857-3", type: "Brief File", title: "Brief Pickup Gudang", detail: "pickup-brief-draft.docx", status: "Pending" },
      { id: "ga-857-4", type: "Delivery Proof", title: "Tanda terima barang", detail: "Belum tersedia", status: "Pending" },
    ],
  },
];

// â”€â”€â”€ ROLE DATA SEED MAP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type ChatRoleDataSeed = {
  viewCopy: ChatViewCopy;
  actionChips: ChatActionChip[];
  threads: ChatThread[];
};

export const chatRoleDataSeed: Record<"runner" | "giver", ChatRoleDataSeed> = {
  runner: {
    viewCopy: chatViewCopySeed,
    actionChips: chatActionChips,
    threads: chatThreads,
  },
  giver: {
    viewCopy: chatGiverViewCopySeed,
    actionChips: chatGiverActionChips,
    threads: chatGiverThreads,
  },
};
