import { Surface } from "../../../../home.ui";

export function RunnerSnapshootDetail({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Surface className="p-5 sm:p-6 relative bg-base-100 border border-base-300 shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-base-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/70 mb-1">
              Peformance Matrix
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-base-content">
              Runner KPI Snapshoot
            </h2>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="btn h-10 min-h-10 px-5 cursor-pointer rounded-[8px] bg-base-200 text-base-content/70 border-none hover:bg-base-300 shadow-none transition-transform active:scale-95"
          >
            Kembali
          </button>
        </div>
        
        <div className="min-h-[400px] flex flex-col items-center justify-center rounded-[12px] bg-base-200/50 border-2 border-dashed border-base-300 p-8 text-center gap-3">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl mb-2">
            📸
          </div>
          <h3 className="font-bold text-lg text-base-content">
            Lapis Kedalaman Runner Snapshoot
          </h3>
          <p className="text-sm font-medium text-base-content/60 max-w-md">
            (Mode Runner) Sentral analisa tingkat dewa buat mereview perjalanan karir Runner lu. Total komisi, rata-rata penilaian, sama jejak penyelesaian quest bakal dirakit jadi laporan super memuaskan di sini.
          </p>
        </div>
      </Surface>
    </div>
  );
}
