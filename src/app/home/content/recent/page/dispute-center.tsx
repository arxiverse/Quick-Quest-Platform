import { ArrowLeftIcon } from "../../../home.icons";
import { Surface } from "../../../home.ui";
import { questHistoryRows } from "../recent";

export function DisputeCenter({ questId, onBack }: { questId: string; onBack: () => void }) {
  const quest = questHistoryRows.find((q) => q.questId === questId) || questHistoryRows[0];
  
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onBack}
        className="btn btn-sm border-error/30 bg-base-100/50 hover:bg-error/10 self-start gap-2 h-10 px-4 rounded-[10px] text-base-content/80 shadow-sm"
      >
        <ArrowLeftIcon className="size-4" />
        Kembali ke Riwayat Escrow
      </button>

      <Surface className="p-5 sm:p-7 relative overflow-hidden border border-error/30">
         <div className="absolute top-0 right-0 h-40 w-40 bg-error/10 rounded-bl-[100px] blur-2xl pointer-events-none" />
         
         <div className="relative z-10 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
               <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-error/10 px-2.5 py-1 text-[10px] font-bold text-error">
                  <span className="size-2 rounded-full bg-error animate-pulse" />
                  DANA DIBEKUKAN
               </span>
               <h1 className="mt-3 text-2xl font-bold text-base-content">Laporan Kejanggalan Quest</h1>
               <p className="text-sm text-base-content/60 mt-1">Ref ID: {quest.questId} • {quest.title}</p>
               
               <div className="mt-6 p-4 rounded-[12px] bg-base-200 border border-base-300">
                  <p className="text-xs font-bold text-base-content/70">Pilih Alasan Laporan</p>
                  <select className="select select-bordered w-full mt-2 font-medium bg-base-100">
                     <option>Runner tidak datang / No Show</option>
                     <option>Hasil pekerjaan tidak sesuai dengan spesifikasi form</option>
                     <option>Sikap / Attitude Runner buruk (Pelanggaran kode etik)</option>
                     <option>Permasalahan Escrow (Nominal tidak sesuai)</option>
                  </select>
                  
                  <p className="text-xs font-bold text-base-content/70 mt-4">Jelaskan Kronologi (Dengan Bukti)</p>
                  <textarea className="textarea textarea-bordered w-full mt-2 h-24 bg-base-100 focus:border-error" placeholder="Ceritakan yang terjadi..."></textarea>
                  
                  <div className="mt-3 flex items-center justify-center p-6 border-2 border-dashed border-base-300 rounded-[10px] bg-base-100/50 cursor-pointer hover:bg-base-200">
                     <p className="text-xs font-bold text-base-content/50">+ Unggah Bukti Tangkap Layar / Foto Lokasi</p>
                  </div>
               </div>
               
               <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button className="btn h-12 flex-1 rounded-[10px] border-none bg-error text-white font-bold shadow-lg shadow-error/20 hover:bg-error/90">
                     Kirim Laporan & Tahan Dana
                  </button>
               </div>
            </div>
            
            <div className="md:w-[350px]">
               <div className="p-4 rounded-[12px] bg-[#FEF3C7] border border-[#F59E0B]/30 text-[#92400E]">
                  <p className="font-bold text-sm">Escrow Dispute Policy</p>
                  <ul className="list-disc pl-4 mt-2 text-xs space-y-1.5 opacity-80">
                     <li>Admin Neiraverse akan menengahi kasus dalam kurun waktu maks 2x24 Jam.</li>
                     <li>Dana tertahan di Escrow tidak dapat ditarik pihak manapun selama status "Disputed".</li>
                     <li>Memberikan laporan palsu akan dikenakan sanksi pinalti Penurunan PP (Performance Points).</li>
                  </ul>
               </div>
               
               <div className="mt-4 p-4 rounded-[12px] border border-base-300 bg-base-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">Histori Percakapan Dispute (Mock)</p>
                  <div className="mt-3 space-y-3">
                     <div className="text-[11px] text-base-content/70 border-l-2 border-base-300 pl-2">
                        <p className="font-bold text-base-content">Laporan Masuk</p>
                        <p>Menunggu tanggapan dari kedua belah pihak...</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </Surface>
    </div>
  );
}
