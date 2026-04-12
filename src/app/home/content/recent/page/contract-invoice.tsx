import { ArrowLeftIcon } from "../../../home.icons";
import { Surface } from "../../../home.ui";
import { contractArchiveRows } from "../recent";

export function ContractInvoice({ contractId, onBack }: { contractId: string; onBack: () => void }) {
  const contract = contractArchiveRows.find((c) => c.contractId === contractId) || contractArchiveRows[0];
  const fee = parseInt(contract.value.replace(/[^0-9]/g, '')) * 0.05;
  const netAmount = parseInt(contract.value.replace(/[^0-9]/g, '')) - fee;
  
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onBack}
        className="btn btn-sm border-base-300 bg-base-100/50 hover:bg-base-200 self-start gap-2 h-10 px-4 rounded-[10px] text-base-content/80 shadow-sm"
      >
        <ArrowLeftIcon className="size-4" />
        Kembali ke Arsip
      </button>

      <Surface className="p-0 sm:overflow-hidden relative max-w-3xl mx-auto w-full bg-white text-black border border-base-300 shadow-xl">
         <div className="p-6 sm:p-10">
            <div className="flex justify-between items-start border-b border-gray-200 pb-6">
               <div>
                  <h1 className="text-3xl font-black tracking-tighter text-[#A046FF]">Q-INVOICE</h1>
                  <p className="text-sm font-semibold tracking-wide text-gray-500 mt-1 uppercase">Official E-Receipt</p>
               </div>
               <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">No: {contract.contractId}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Tanggal: {contract.endDate === "-" ? contract.startDate : contract.endDate}</p>
                  <p className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded mt-1 inline-block">LUNAS / COMPLETED</p>
               </div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-8">
               <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dibayarkan Oleh (Giver)</p>
                  <p className="mt-1 text-base font-bold text-gray-800">{contract.giver}</p>
                  <p className="text-xs text-gray-500">Neiraverse Verified Account</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dibayarkan Kepada (Runner)</p>
                  <p className="mt-1 text-base font-bold text-gray-800">{contract.runner}</p>
                  <p className="text-xs text-gray-500">Gig Economy Contractor</p>
               </div>
            </div>
            
            <div className="mt-10">
               <p className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2">Rincian Transaksi</p>
               <div className="mt-4 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                     <span className="font-medium text-gray-600">Quest: {contract.questTitle} ({contract.type})</span>
                     <span className="font-bold text-gray-800">{contract.value}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="font-medium text-gray-500 line-through">System Fee Escrow (5%)</span>
                     <span className="font-bold text-error">-Rp {fee.toLocaleString('id-ID')}</span>
                  </div>
               </div>
            </div>
            
            <div className="mt-8 border-t-2 border-gray-800 pt-4 flex justify-between items-end">
               <div className="opacity-50 grayscale">
                  <div className="h-10 w-32 bg-gray-200 rounded"></div>
                  <p className="text-[8px] font-mono mt-1">Escrow System Validated</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Net Bersih (Ke Runner)</p>
                  <p className="text-3xl font-black text-[#A046FF] mt-1">Rp {netAmount.toLocaleString('id-ID')}</p>
               </div>
            </div>
            
            <div className="mt-12 bg-gray-50 p-4 rounded-lg text-[10px] text-gray-500 text-center font-medium">
               Dokumen ini adalah bukti transaksi digital yang sah dari sistem Escrow Platform Quick Quest.
            </div>
         </div>
         
         <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end gap-3 hidden-print">
            <button className="btn btn-sm bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm" onClick={() => window.print()}>
               Cetak / PDF
            </button>
         </div>
      </Surface>
    </div>
  );
}
