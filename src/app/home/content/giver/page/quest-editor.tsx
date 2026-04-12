import { ArrowLeftIcon } from "../../../home.icons";
import { Surface } from "../../../home.ui";

export function QuestEditor({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onBack}
        className="btn btn-sm border-base-300 bg-base-100/50 hover:bg-base-200 self-start gap-2 h-10 px-4 rounded-[10px] text-base-content/80 shadow-sm"
      >
        <ArrowLeftIcon className="size-4" />
        Kembali ke Giver Center
      </button>

      <Surface className="p-5 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-[#38BDF8]/10 rounded-bl-[100px] blur-2xl pointer-events-none" />
        
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#38BDF8]">Quest Editor</p>
        <h1 className="mt-1 text-2xl font-bold text-base-content">Buat Lapangan Pekerjaan Baru</h1>
        
        <div className="mt-6 grid gap-6 md:grid-cols-2 relative z-10">
           <div className="space-y-4">
              <div>
                 <label className="text-xs font-bold text-base-content/70">Judul Quest</label>
                 <input type="text" className="input input-bordered w-full mt-1.5 focus:border-[#38BDF8] bg-base-100" placeholder="e.g. Bongkar Muat Barang Gudang" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="text-xs font-bold text-base-content/70">Mode</label>
                    <select className="select select-bordered w-full mt-1.5 focus:border-[#38BDF8] bg-base-100">
                      <option>Fisik (On-Site)</option>
                      <option>Digital (Remote)</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-base-content/70">Kategori</label>
                    <select className="select select-bordered w-full mt-1.5 focus:border-[#38BDF8] bg-base-100">
                      <option>Event Organizer</option>
                      <option>Gudang & Logistik</option>
                      <option>IT & Jaringan</option>
                    </select>
                 </div>
              </div>
              <div>
                 <label className="text-xs font-bold text-base-content/70">Deskripsi Pekerjaan</label>
                 <textarea className="textarea textarea-bordered w-full mt-1.5 h-24 focus:border-[#38BDF8] bg-base-100" placeholder="Jelaskan secara rinci tugas runner..."></textarea>
              </div>
           </div>
           
           <div className="space-y-4 rounded-[12px] border border-base-300/70 bg-base-100 p-4 shadow-sm">
              <div>
                 <label className="text-xs font-bold text-base-content/70">Pilih Radius Base (KM)</label>
                 <input type="range" min="1" max="10" className="range range-xs range-info mt-3" step="1" defaultValue="2" />
                 <div className="flex justify-between text-[10px] font-bold mt-1 text-base-content/50">
                    <span>1 KM</span><span>5 KM</span><span>10 KM</span>
                 </div>
              </div>
              <div className="pt-2">
                 <label className="text-xs font-bold text-base-content/70">Jumlah Slot Kebutuhan Runner</label>
                 <input type="number" className="input input-bordered w-full mt-1.5 focus:border-[#38BDF8] bg-base-100" defaultValue={1} />
              </div>
              <div className="pt-2">
                 <label className="text-xs font-bold text-base-content/70">Upah Final / Runner (Rp)</label>
                 <div className="relative mt-1.5">
                   <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                     <span className="text-sm font-bold text-base-content/50">Rp</span>
                   </div>
                   <input type="text" className="input input-bordered w-full bg-base-100 pl-10 focus:border-[#38BDF8] font-bold" placeholder="150.000" />
                 </div>
                 <p className="text-[10px] text-base-content/50 mt-1.5">Sistem Escrow akan memotong 5% Fee dari nilai ini.</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-base-200">
                 <button type="button" className="btn h-12 w-full rounded-[10px] border-none bg-gradient-to-r from-[#38BDF8] to-[#A046FF] text-white font-bold shadow-lg shadow-[#38BDF8]/20 transition-transform active:scale-95">
                    Deposit Escrow & Broadcast Live
                 </button>
              </div>
           </div>
        </div>
      </Surface>
    </div>
  );
}
