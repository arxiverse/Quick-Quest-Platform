import { Surface } from "../../home.ui";
import { runnerMembers } from "./runner";

function RunnerComponent() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <Surface className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/45">Runner Pool</p>
        <h2 className="mt-2 text-xl font-bold text-base-content">Ketersediaan Hari Ini</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="badge border-none bg-[#D9F99D] px-4 py-3 text-black">Ready 12</span>
          <span className="badge border-none bg-[#BFDBFE] px-4 py-3 text-black">On Quest 07</span>
          <span className="badge border-none bg-[#FDE68A] px-4 py-3 text-black">Standby 05</span>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-base-content/65">Halaman ini enak buat ngebagi runner sesuai skill dan ngecek siapa yang masih butuh brief sebelum dilempar ke quest berikutnya.</p>
      </Surface>

      <div className="space-y-4">
        {runnerMembers.map((runner) => (
          <Surface key={runner.name} className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-base-content">{runner.name}</h3>
                <p className="mt-1 text-sm text-base-content/60">{runner.skill}</p>
              </div>
              <span className="badge badge-ghost border-base-300 bg-base-200 px-3 py-3 text-base-content">{runner.status}</span>
            </div>
            <p className="mt-4 text-sm font-medium text-base-content/55">Area tugas: {runner.location}</p>
          </Surface>
        ))}
      </div>
    </div>
  );
}

export default RunnerComponent;

