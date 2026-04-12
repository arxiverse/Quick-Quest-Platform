import { ArrowLeftIcon } from "../../../home.icons";
import { Surface, cn } from "../../../home.ui";
import { giverCandidates } from "../giver";

export function CandidateReview({ candidateId, onBack }: { candidateId: string; onBack: () => void }) {
  const candidate = giverCandidates.find((c) => c.id === candidateId) || giverCandidates[0];
  
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onBack}
        className="btn btn-sm border-base-300 bg-base-100/50 hover:bg-base-200 self-start gap-2 h-10 px-4 rounded-[10px] text-base-content/80 shadow-sm"
      >
        <ArrowLeftIcon className="size-4" />
        Kembali ke Candidate Pool
      </button>

      <Surface className="p-5 sm:p-7 relative overflow-hidden">
         <div className="absolute top-0 right-0 h-40 w-40 bg-[#2563EB]/10 rounded-bl-[100px] blur-2xl pointer-events-none" />
         <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB]">Candidate Examination</p>
         
         <div className="mt-6 flex flex-col md:flex-row gap-6 relative z-10">
            <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 border border-base-300/70 rounded-[16px] bg-base-100">
               <div className="size-24 rounded-full bg-gradient-to-br from-[#2563EB] to-[#60A5FA] p-1 shadow-lg">
                 <div className="size-full rounded-full bg-base-100 flex items-center justify-center text-3xl">😎</div>
               </div>
               <h1 className="mt-4 text-xl font-bold text-base-content">{candidate.name}</h1>
               <span className="mt-1.5 inline-flex rounded-[8px] bg-[#E0F2FE] px-2.5 py-0.5 text-[11px] font-bold text-[#0369A1] ring-1 ring-[#0369A1]/20">
                 {candidate.reliabilityBadge}
               </span>
            </div>
            
            <div className="flex-1 grid sm:grid-cols-2 gap-4">
               <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">Tracking Locator</p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                     <p className="text-2xl font-bold text-base-content">{candidate.distanceKm}</p>
                     <span className="text-sm font-semibold text-base-content/60">KM Jarak</span>
                  </div>
                  <p className="text-xs text-base-content/60 mt-1"><span className="text-success font-semibold px-1.5 py-0.5 text-[10px] bg-success/10 rounded">LIVE ETA</span> ±{candidate.etaMinutes} Menit ke Lokasi Anda</p>
               </div>
               <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">Skill Matrix Match</p>
                  <p className="mt-2 text-2xl font-bold text-[#10B981]">{candidate.matchScore}% Valid</p>
                  <p className="text-xs text-base-content/60 mt-1 font-medium">{candidate.skill}</p>
               </div>
               <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-4 sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">Histori & Track Record Platform</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                     <div className="p-3 bg-base-200/50 rounded-[8px]">
                        <p className="text-3xl font-bold text-base-content tracking-tight">{candidate.completionRate}</p>
                        <p className="text-[11px] font-semibold text-base-content/60 mt-1 uppercase">Selesai Berhasil</p>
                     </div>
                     <div className="p-3 bg-error/5 rounded-[8px]">
                        <p className="text-3xl font-bold text-error tracking-tight">{candidate.disputeRatio}</p>
                        <p className="text-[11px] font-semibold text-base-content/60 mt-1 uppercase">Kasus Dispute</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="mt-8 flex flex-col sm:flex-row gap-3 border-t border-base-200 pt-6">
            <button type="button" className="btn h-12 flex-1 rounded-[10px] border-none bg-[#2563EB] text-white hover:bg-[#2563EB]/90 text-sm sm:text-base font-bold shadow-lg shadow-[#2563EB]/30 transition-transform active:scale-95">
               Pilih & Tugaskan Kandidat
            </button>
            <button type="button" className="btn h-12 flex-1 rounded-[10px] border border-error/30 bg-error/5 text-error hover:bg-error/10 text-sm sm:text-base font-bold transition-transform active:scale-95">
               Tolak Pelamar Ini
            </button>
         </div>
      </Surface>
    </div>
  );
}
