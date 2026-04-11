import { cn, Surface } from "../../home.ui";
import {
  contractArchiveRows,
  ppLedgerRows,
  questHistoryRows,
  recentSummaryMetrics,
  transactionHistoryRows,
  type ContractArchiveRow,
  type QuestHistoryRow,
  type TransactionHistoryRow,
} from "./recent";

function statusTone(status: ContractArchiveRow["status"] | QuestHistoryRow["status"]) {
  if (status === "Completed") {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  if (status === "In Progress") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  if (status === "Pending Confirmation") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  if (status === "Disputed") {
    return "bg-[#FECACA] text-[#991B1B]";
  }
  return "bg-base-200 text-base-content/70";
}

function transactionTone(status: TransactionHistoryRow["status"]) {
  if (status === "Success") {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  if (status === "Pending") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }
  return "bg-[#FECACA] text-[#991B1B]";
}

function ppChangeTone(change: string) {
  return change.startsWith("-") ? "text-[#991B1B]" : "text-[#166534]";
}

function RecentComponent() {
  return (
    <div className="min-w-0 space-y-4">
      <Surface className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/45">Riwayat Engine</p>
            <h1 className="mt-1 text-xl font-bold text-base-content sm:text-2xl">Contract Archive, Quest Lifecycle, Transaksi, dan PP Ledger</h1>
          </div>
          <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/70">Full history simulation</span>
        </div>
      </Surface>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {recentSummaryMetrics.map((metric) => (
          <Surface key={metric.label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content/55">{metric.label}</p>
            <p className="mt-2 text-xl font-bold text-base-content">{metric.value}</p>
            <span className={cn("mt-2 inline-flex rounded-[8px] px-2.5 py-1 text-[11px] font-semibold text-black", metric.tone)}>{metric.hint}</span>
          </Surface>
        ))}
      </div>

      <Surface className="p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Contract Archive</p>
        <h2 className="mt-1 text-lg font-bold text-base-content">Arsip Kontrak Kerja (Open, In Progress, Completed, Disputed)</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="table table-zebra table-sm min-w-[980px]">
            <thead>
              <tr>
                <th>Contract ID</th>
                <th>Quest</th>
                <th>Giver</th>
                <th>Runner</th>
                <th>Tipe</th>
                <th>Status</th>
                <th>Mulai</th>
                <th>Selesai</th>
                <th>Nilai</th>
              </tr>
            </thead>
            <tbody>
              {contractArchiveRows.map((row) => (
                <tr key={row.contractId}>
                  <td className="font-semibold">{row.contractId}</td>
                  <td>{row.questTitle}</td>
                  <td>{row.giver}</td>
                  <td>{row.runner}</td>
                  <td>{row.type}</td>
                  <td>
                    <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", statusTone(row.status))}>{row.status}</span>
                  </td>
                  <td>{row.startDate}</td>
                  <td>{row.endDate}</td>
                  <td className="font-semibold">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>

      <div className="grid gap-4 2xl:grid-cols-[1fr_1fr]">
        <Surface className="min-w-0 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Quest History</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Riwayat Quest dari Open sampai Completed</h2>

          <div className="mt-3 md:hidden space-y-2.5">
            {questHistoryRows.map((row) => (
              <div key={row.questId} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-base-content">{row.questId}</p>
                    <p className="text-xs text-base-content/60">{row.category}</p>
                  </div>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", statusTone(row.status))}>{row.status}</span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-base-content">{row.title}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-base-content/65">
                  <span>Progress {row.progress}</span>
                  <span>{row.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 hidden overflow-x-auto md:block">
            <table className="table table-zebra table-sm min-w-[640px]">
              <thead>
                <tr>
                  <th>Quest ID</th>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {questHistoryRows.map((row) => (
                  <tr key={row.questId}>
                    <td className="font-semibold">{row.questId}</td>
                    <td>{row.title}</td>
                    <td>{row.category}</td>
                    <td>
                      <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", statusTone(row.status))}>{row.status}</span>
                    </td>
                    <td>{row.progress}</td>
                    <td>{row.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>

        <Surface className="min-w-0 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Transaction History</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Riwayat Transaksi Escrow, Fee, dan Refund</h2>

          <div className="mt-3 md:hidden space-y-2.5">
            {transactionHistoryRows.map((row) => (
              <div key={row.transactionId} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-base-content">{row.transactionId}</p>
                    <p className="text-xs text-base-content/60">{row.type}</p>
                  </div>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", transactionTone(row.status))}>{row.status}</span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-base-content">{row.questTitle}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-base-content/65">
                  <span className="font-semibold">{row.amount}</span>
                  <span>{row.createdAt}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 hidden overflow-x-auto md:block">
            <table className="table table-zebra table-sm min-w-[660px]">
              <thead>
                <tr>
                  <th>Tx ID</th>
                  <th>Quest</th>
                  <th>Tipe</th>
                  <th>Nominal</th>
                  <th>Status</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistoryRows.map((row) => (
                  <tr key={row.transactionId}>
                    <td className="font-semibold">{row.transactionId}</td>
                    <td>{row.questTitle}</td>
                    <td>{row.type}</td>
                    <td className="font-semibold">{row.amount}</td>
                    <td>
                      <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", transactionTone(row.status))}>{row.status}</span>
                    </td>
                    <td>{row.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      </div>

      <Surface className="p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">PP Ledger</p>
        <h2 className="mt-1 text-lg font-bold text-base-content">Change Log Performance Point (Credit/Penalty)</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="table table-zebra table-sm min-w-[900px]">
            <thead>
              <tr>
                <th>Ledger ID</th>
                <th>Skill</th>
                <th>Perubahan</th>
                <th>Alasan</th>
                <th>Saldo Setelah</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {ppLedgerRows.map((row) => (
                <tr key={row.ledgerId}>
                  <td className="font-semibold">{row.ledgerId}</td>
                  <td>{row.skill}</td>
                  <td className={cn("font-bold", ppChangeTone(row.change))}>{row.change}</td>
                  <td>{row.reason}</td>
                  <td>{row.balanceAfter}</td>
                  <td>{row.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  );
}

export default RecentComponent;
