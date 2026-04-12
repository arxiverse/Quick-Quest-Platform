import { ArrowLeftIcon } from "../../../home.icons";
import { Surface, cn } from "../../../home.ui";

export function PartyLobbyRoom({ partyId, onBack }: { partyId: string; onBack: () => void }) {
  // Mock party data
  const partyInfo = {
     id: partyId,
     title: partyId === "P-101" ? "Event Organizer Staff" : "Bongkar Muat Gudang",
     giver: partyId === "P-101" ? "Neo Comm" : "Sinar Jaya",
     reward: partyId === "P-101" ? "Rp 350.000" : "Rp 210.000",
     slotTotal: partyId === "P-101" ? 5 : 4,
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onBack}
        className="btn btn-sm border-[#A046FF]/30 bg-base-100/50 hover:bg-[#A046FF]/10 self-start gap-2 h-10 px-4 rounded-[10px] text-base-content/80 shadow-sm"
      >
        <ArrowLeftIcon className="size-4" />
        Leave Lobby Room
      </button>

      <div className="grid gap-4 lg:grid-cols-[1fr_350px]">
         <div className="space-y-4">
            <Surface className="p-5 sm:p-7 relative overflow-hidden border border-[#A046FF]/30">
              <div className="absolute top-0 right-0 h-40 w-40 bg-[#A046FF]/10 rounded-bl-[100px] blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start gap-4 relative z-10">
                 <div>
                    <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-base-200 px-2.5 py-1 text-[10px] font-bold text-base-content/70">
                       <span className="size-2 rounded-full bg-success animate-pulse" />
                       LOBBY ACTIVE
                    </span>
                    <h1 className="mt-3 text-2xl font-bold text-base-content">{partyInfo.title}</h1>
                    <p className="text-sm text-base-content/60 mt-1">{partyInfo.giver} • ID: {partyInfo.id}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">Total Upah Grup</p>
                    <p className="mt-1 text-xl font-bold text-[#10B981]">{partyInfo.reward}</p>
                 </div>
              </div>
              
              <div className="mt-8 relative z-10">
                 <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-4">Slot Anggota Tim ({partyInfo.slotTotal})</p>
                 <div className="flex flex-wrap gap-4">
                    {Array.from({ length: partyInfo.slotTotal }).map((_, i) => (
                       <div key={i} className="flex flex-col items-center gap-2">
                          <div className={cn("size-16 rounded-full flex items-center justify-center text-xl shadow-inner", 
                                i === 0 ? "bg-gradient-to-tr from-[#A046FF] to-[#38BDF8] text-white ring-4 ring-[#A046FF]/30" : 
                                i === 1 ? "bg-base-200 text-base-content/80" : 
                                "border-2 border-dashed border-base-300 bg-base-100/50 text-base-content/20")}>
                             {i === 0 ? "⚡" : i === 1 ? "😎" : "+"}
                          </div>
                          <span className="text-[10px] font-bold text-base-content/70">
                             {i === 0 ? "You" : i === 1 ? "Runner 2" : "Waiting..."}
                          </span>
                       </div>
                    ))}
                 </div>
              </div>
              
              <div className="mt-8 border-t border-base-200 pt-6 relative z-10">
                 <div className="bg-[#FEF3C7] text-[#92400E] p-3 rounded-[10px] text-xs font-medium">
                    Info: Quest grup hanya bisa dimulai secara serentak ketika Giver menekan tombol "Start Quest" atau slot telah penuh.
                 </div>
                 <button className="mt-4 btn h-12 w-full rounded-[10px] border-none bg-gradient-to-r from-[#A046FF] to-[#38BDF8] text-white font-bold shadow-lg shadow-[#A046FF]/20 hover:opacity-90">
                    Sinyalkan "Ready" ke Giver
                 </button>
              </div>
            </Surface>
         </div>

         <Surface className="p-0 flex flex-col h-[500px] border border-base-300">
             <div className="p-4 border-b border-base-200">
                <p className="text-sm font-bold text-base-content">Papan Diskusi Tim</p>
             </div>
             <div className="flex-1 p-4 overflow-y-auto bg-base-100/30 flex flex-col gap-3">
                <div className="text-center">
                   <span className="text-[10px] bg-base-200 px-2 py-0.5 rounded text-base-content/50">Lobby Dibuat • 10:45 AM</span>
                </div>
                <div className="self-start max-w-[85%]">
                   <p className="text-[10px] text-base-content/50 ml-1 mb-0.5">Sinar Jaya (Giver)</p>
                   <div className="bg-base-200 p-2.5 rounded-[12px] rounded-tl-none text-xs text-base-content">
                      Pastikan yang gabung bawa perlengkapan safety ya!
                   </div>
                </div>
                <div className="self-end max-w-[85%]">
                   <div className="bg-[#A046FF] text-white p-2.5 rounded-[12px] rounded-tr-none text-xs">
                      Siaap pak, saya meluncur 5 menit lagi.
                   </div>
                </div>
             </div>
             <div className="p-3 border-t border-base-200 bg-base-100 mt-auto">
                <div className="flex gap-2">
                   <input type="text" placeholder="Ketik pesan..." className="input input-sm input-bordered flex-1 focus:border-[#A046FF] h-9 text-xs" />
                   <button className="btn btn-sm h-9 px-4 bg-[#A046FF] text-white hover:bg-[#A046FF]/90 border-none font-bold text-xs">Kirim</button>
                </div>
             </div>
         </Surface>
      </div>
    </div>
  );
}
