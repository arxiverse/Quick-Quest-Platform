import { useEffect, useState } from "react";
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

type RecentSubView =
  | { view: "DisputeCenter"; payload: { questId: string } }
  | { view: "ContractInvoice"; payload: { contractId: string } };

const RECENT_SUBVIEW_STORAGE_KEY = "nvrs-qqm-recent-subview-v1";

function resolveInitialSubView(): RecentSubView | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(RECENT_SUBVIEW_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RecentSubView;
  } catch {
    return null;
  }
}

function EscrowTrackerPipeline({ status, questId, onDispute }: { status: QuestHistoryRow["status"]; questId: string; onDispute?: (id: string) => void }) {
  const isStarted = status !== "Pending Confirmation"; // Assuming pending means not started yet, or rather Pending Confirmation in this app context means waiting giver validation? Wait, in QQM contract it usually means pending payment or wait. We will assume Uang Ditahan is always True for all of these.
  const isWip = status === "In Progress" || status === "Completed" || status === "Pending Confirmation";
  const isDone = status === "Completed";
  const isDisputed = status === "Disputed";

  const steps = [
    { label: "Uang Ditahan", active: true, icon: "🔒" },
    { label: "Selesai", active: isDone, icon: "✅" },
    { label: "Potong Fee 5%", active: isDone, icon: "💸" },
    { label: "Dana Cair", active: isDone, icon: "🏦" },
  ];

  return (
    <div className="mt-3 w-full border-t border-base-300/50 pt-2">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-base-content/50">Escrow Tracker Pipeline</p>
      
      {isDisputed ? (
        <div className="flex w-full items-center justify-between rounded bg-error/10 px-3 py-2 text-xs text-error">
          <span className="font-semibold">⚠️ Dana Dibekukan (Dalam Investigasi Dispute)</span>
          <button type="button" onClick={() => onDispute?.(questId)} className="btn btn-xs h-6 min-h-6 border-none bg-error px-2 text-[10px] text-error-content shadow-none hover:bg-error/80">Detail Kasus</button>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full items-center justify-between gap-1">
            {steps.map((step, idx) => (
              <div key={step.label} className="flex flex-1 flex-col items-center text-center">
                <div className={cn("flex size-6 sm:size-7 items-center justify-center rounded-full text-xs shadow-sm transition-colors", step.active ? "bg-gradient-to-tr from-[#A046FF] to-[#38BDF8] text-white" : "bg-base-200 text-base-content/40")}>
                  {step.icon}
                </div>
                <p className={cn("mt-1.5 text-[9px] sm:text-[10px] font-semibold leading-tight", step.active ? "text-base-content" : "text-base-content/40")}>{step.label}</p>
              </div>
            ))}
          </div>

          {!isDone && (
            <div className="flex justify-end">
              <button type="button" onClick={() => onDispute?.(questId)} className="btn btn-xs h-6 min-h-6 border-none bg-error/20 px-3 text-[10px] font-bold text-error shadow-none hover:bg-error hover:text-white transition-colors">🚩 Dispute / Lapor</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { DisputeCenter } from "./page/dispute-center";
import { ContractInvoice } from "./page/contract-invoice";

function RecentComponent() {
  const [subView, setSubView] = useState<RecentSubView | null>(resolveInitialSubView);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (subView) {
      window.localStorage.setItem(RECENT_SUBVIEW_STORAGE_KEY, JSON.stringify(subView));
    } else {
      window.localStorage.removeItem(RECENT_SUBVIEW_STORAGE_KEY);
    }
  }, [subView]);

  if (subView?.view === "DisputeCenter") {
    return <DisputeCenter questId={subView.payload.questId} onBack={() => setSubView(null)} />;
  }
  if (subView?.view === "ContractInvoice") {
    return <ContractInvoice contractId={subView.payload.contractId} onBack={() => setSubView(null)} />;
  }

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
                  <td className="font-bold text-[#A046FF] cursor-pointer hover:underline" onClick={() => setSubView({ view: "ContractInvoice", payload: { contractId: row.contractId } })}>
                     {row.contractId}
                  </td>
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
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            <span className="text-xl">🛡️</span> Quest History & Escrow
          </p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Lacak Quest Aktif dan Keamanan Dana</h2>

          <div className="mt-3 space-y-3">
            {questHistoryRows.map((row) => (
              <div key={row.questId} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3 shadow-sm hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-base-content">{row.questId}</p>
                    <p className="text-xs text-base-content/60">{row.category}</p>
                  </div>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", statusTone(row.status))}>{row.status}</span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-base-content">{row.title}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-base-content/65">
                  <span className="font-semibold text-primary">Progress {row.progress}</span>
                  <span>{row.updatedAt}</span>
                </div>
                
                {/* Escrow Tracker Injection */}
                <EscrowTrackerPipeline status={row.status} questId={row.questId} onDispute={(id) => setSubView({ view: "DisputeCenter", payload: { questId: id } })} />
              </div>
            ))}
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
