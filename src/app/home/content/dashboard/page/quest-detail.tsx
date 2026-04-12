import { ArrowLeftIcon } from "../../../home.icons";
import { Surface } from "../../../home.ui";
import { liveQuestItems } from "../dashboard";

export function QuestDetail({ questId, onBack }: { questId: string; onBack: () => void }) {
  // Mock quest lookup based on title since we don't have true entity IDs in the dummy
  const quest = liveQuestItems.find((q) => q.title === questId) || liveQuestItems[0];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onBack}
        className="btn btn-sm border-base-300 bg-base-100/50 hover:bg-base-200 self-start gap-2 h-10 px-4 rounded-[10px] text-base-content/80 shadow-sm"
      >
        <ArrowLeftIcon className="size-4" />
        Kembali ke Dashboard
      </button>

      <Surface className="p-5 sm:p-7 overflow-hidden relative">
        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 rounded-bl-[100px] blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <span className="inline-flex rounded-[999px] px-3 py-1.5 text-[10px] sm:text-xs font-bold tracking-[0.15em] bg-[#FEE2E2] text-[#B91C1C]">
            LIVE MATCHING
          </span>
          <span className="rounded-[8px] bg-base-200 px-3 py-1.5 text-xs font-bold text-base-content/80 font-mono tracking-wider">
            REF: {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </span>
        </div>

        <h1 className="mt-4 text-2xl sm:text-4xl font-bold text-base-content tracking-tight">{quest.title}</h1>

        <div className="mt-6 grid sm:grid-cols-2 gap-4 relative z-10">
          <div className="rounded-[12px] border border-base-300/70 bg-base-100 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">Giver Information</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="size-12 rounded-[10px] bg-base-300" />
              <div>
                <p className="text-base font-bold text-base-content">{quest.owner}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="size-2 rounded-full bg-[#166534]" />
                   <p className="text-[11px] font-bold text-[#166534]">Verified Employer</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[12px] border border-[#10B981]/20 bg-gradient-to-br from-[#10B981]/5 to-transparent p-4 flex flex-col justify-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">Estimasi Upah Dasar</p>
            <p className="mt-1 text-3xl font-bold text-[#10B981]">{quest.reward}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-bold text-base-content border-b border-base-200 pb-2">Persyaratan Khusus</h2>
          <ul className="list-disc pl-5 text-sm text-base-content/70 space-y-2.5">
            <li>Diutamakan bagi Runner dengan score Performance Points (PP) minimal <strong className="text-base-content font-bold">{quest.ppDelta} PP</strong>.</li>
            <li>Wajib hadir di lokasi maksimal <strong className="text-base-content font-bold">{quest.distanceKm.toFixed(1)} km</strong> dalam waktu <strong className="text-base-content font-bold">{quest.countdown}</strong>.</li>
            <li>Tugas membutuhkan skill fisik untuk tipe quest <strong className="text-base-content font-bold">{quest.mode}</strong> dengan target kategori <strong className="text-base-content font-bold">{quest.category}</strong>.</li>
            <li><span className="bg-[#DCFCE7] text-[#166534] px-1.5 py-0.5 rounded font-bold">Escrow Secured:</span> Pihak Giver ({quest.owner}) sudah menahan dana sebesar nilai upah di dalam brankas sistem.</li>
          </ul>
        </div>

        <div className="mt-6 rounded-[16px] border border-base-300/70 bg-[#0F172A] p-4 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <p className="relative z-10 text-[11px] font-bold uppercase tracking-wider text-[#38BDF8]">Mode Radar Target Lokasi</p>
          <div className="relative z-10 mt-4 flex h-40 sm:h-48 items-center justify-center">
            <div className="size-5 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,1)] z-20 flex items-center justify-center">
              <div className="size-2.5 rounded-full bg-red-600" />
            </div>
            <div className="absolute size-32 sm:size-40 rounded-full border-2 border-red-500/50 animate-ping" style={{ animationDuration: '2.5s' }} />
          </div>
          <div className="absolute bottom-4 left-4 z-10 bg-[#0F172A]/80 px-2 py-1 rounded text-[10px] font-mono text-slate-300 backdrop-blur-sm border border-slate-700">
             LAT: -6.200000, LNG: 106.816666
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 border-t border-base-200 pt-6">
          <button type="button" className="btn h-12 flex-1 rounded-[10px] border-none bg-[#6B21FF] text-white hover:bg-[#6B21FF]/90 text-sm sm:text-base font-bold shadow-lg shadow-[#6B21FF]/30 transition-transform active:scale-95">
            Terima & Mulai Quest
          </button>
          <button type="button" className="btn h-12 flex-1 rounded-[10px] border border-base-300 bg-base-100 text-base-content hover:bg-base-200 text-sm sm:text-base transition-transform active:scale-95">
            Nego / Ajukan Penawaran
          </button>
        </div>
      </Surface>
    </div>
  );
}
