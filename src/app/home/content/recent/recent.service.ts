import type {
  ContractArchiveRow,
  PpLedgerRow,
  QuestHistoryRow,
  RecentSummaryMetric,
  TransactionHistoryRow,
} from "./recent";

export const recentSummaryMetrics: RecentSummaryMetric[] = [
  { label: "Total Kontrak", value: "126", hint: "28 aktif saat ini", tone: "bg-[#DBEAFE]" },
  { label: "Quest Selesai", value: "394", hint: "86.9% completion", tone: "bg-[#DCFCE7]" },
  { label: "Transaksi Sukses", value: "Rp18.6jt", hint: "escrow release bersih", tone: "bg-[#FEF3C7]" },
  { label: "Perubahan PP", value: "+412", hint: "30 hari terakhir", tone: "bg-[#E9D5FF]" },
];

export const contractArchiveRows: ContractArchiveRow[] = [
  {
    contractId: "CTR-2026-0411-001",
    questTitle: "Bersihkan Toko Sembako",
    giver: "Toko Aulia",
    runner: "Neira",
    type: "Per-Individu",
    status: "Completed",
    startDate: "2026-04-10 08:20",
    endDate: "2026-04-10 11:12",
    value: "Rp250.000",
  },
  {
    contractId: "CTR-2026-0411-002",
    questTitle: "Membersihkan Kandang Ayam",
    giver: "Pak Rijal",
    runner: "Tim Kebersihan 3/5",
    type: "Ber-Kelompok",
    status: "In Progress",
    startDate: "2026-04-11 09:00",
    endDate: "-",
    value: "Rp350.000",
  },
  {
    contractId: "CTR-2026-0411-003",
    questTitle: "Pickup Dokumen Kantor",
    giver: "PT Nabiru",
    runner: "Farel",
    type: "Per-Individu",
    status: "Pending Confirmation",
    startDate: "2026-04-11 12:45",
    endDate: "-",
    value: "Rp180.000",
  },
  {
    contractId: "CTR-2026-0411-004",
    questTitle: "Rapikan Booth Event",
    giver: "Eventoria",
    runner: "Miska",
    type: "Per-Individu",
    status: "Disputed",
    startDate: "2026-04-09 16:10",
    endDate: "2026-04-09 20:30",
    value: "Rp300.000",
  },
  {
    contractId: "CTR-2026-0412-001",
    questTitle: "Restock Minimarket",
    giver: "MiniMart Sejahtera",
    runner: "Raka",
    type: "Per-Individu",
    status: "Open",
    startDate: "2026-04-12 07:30",
    endDate: "-",
    value: "Rp140.000",
  },
];

export const questHistoryRows: QuestHistoryRow[] = [
  { questId: "QST-001", title: "Bersihkan Toko Sembako", category: "Cleaning", status: "Completed", progress: "100%", updatedAt: "2026-04-10 11:12" },
  { questId: "QST-002", title: "Membersihkan Kandang Ayam", category: "Cleaning", status: "In Progress", progress: "62%", updatedAt: "2026-04-11 14:21" },
  { questId: "QST-003", title: "Pickup Dokumen Kantor", category: "Delivery", status: "Pending Confirmation", progress: "88%", updatedAt: "2026-04-11 13:53" },
  { questId: "QST-004", title: "Rapikan Booth Event", category: "Retail", status: "Disputed", progress: "100%", updatedAt: "2026-04-09 20:40" },
  { questId: "QST-005", title: "Restock Minimarket", category: "Retail", status: "Open", progress: "0%", updatedAt: "2026-04-12 07:30" },
];

export const transactionHistoryRows: TransactionHistoryRow[] = [
  { transactionId: "TX-9011", questTitle: "Bersihkan Toko Sembako", type: "Escrow Lock", amount: "Rp250.000", status: "Success", createdAt: "2026-04-10 08:25" },
  { transactionId: "TX-9012", questTitle: "Bersihkan Toko Sembako", type: "Escrow Release", amount: "Rp235.000", status: "Success", createdAt: "2026-04-10 11:20" },
  { transactionId: "TX-9013", questTitle: "Bersihkan Toko Sembako", type: "Platform Fee", amount: "Rp15.000", status: "Success", createdAt: "2026-04-10 11:20" },
  { transactionId: "TX-9021", questTitle: "Membersihkan Kandang Ayam", type: "Escrow Lock", amount: "Rp350.000", status: "Success", createdAt: "2026-04-11 09:02" },
  { transactionId: "TX-9031", questTitle: "Rapikan Booth Event", type: "Refund", amount: "Rp300.000", status: "Pending", createdAt: "2026-04-09 21:05" },
];

export const ppLedgerRows: PpLedgerRow[] = [
  { ledgerId: "PP-6701", skill: "Cleaning", change: "+32", reason: "Quest selesai tepat waktu", balanceAfter: "6,120", createdAt: "2026-04-10 11:25" },
  { ledgerId: "PP-6702", skill: "Delivery", change: "+14", reason: "Dokumen diterima sesuai SLA", balanceAfter: "6,134", createdAt: "2026-04-11 13:59" },
  { ledgerId: "PP-6703", skill: "Retail", change: "-5", reason: "Cancel penalty (brief berubah)", balanceAfter: "6,129", createdAt: "2026-04-11 14:10" },
  { ledgerId: "PP-6704", skill: "Cleaning", change: "+24", reason: "Quality review > 4.8", balanceAfter: "6,153", createdAt: "2026-04-11 19:02" },
  { ledgerId: "PP-6705", skill: "Retail", change: "+18", reason: "Inventory task selesai tanpa issue", balanceAfter: "6,171", createdAt: "2026-04-12 08:04" },
];
