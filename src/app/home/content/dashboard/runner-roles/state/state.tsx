import { Surface } from "../../../../home.ui";
import {
  runnerBadges,
  runnerSkillStats,
  runnerStateWarnings,
  runnerStateSummary,
  resolveBadgeTierClass,
  resolveSkillLevelBar,
  resolveWarningClass,
} from "./state";

function PageShell({
  title,
  eyebrow,
  onBack,
  children,
}: {
  title: string;
  eyebrow: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Surface className="p-5 sm:p-6 bg-base-100 border border-base-300">
        <div className="flex items-center justify-between mb-6 border-b border-base-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/70 mb-1">
              {eyebrow}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-base-content">
              {title}
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
        {children}
      </Surface>
    </div>
  );
}

export function RunnerStateDetail({ onBack }: { onBack: () => void }) {
  return (
    <PageShell
      title="Status & Reputasi Runner"
      eyebrow="Runner Analytics"
      onBack={onBack}
    >
      {/* Account Summary */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 mb-5">
        {[
          { label: "Level", value: runnerStateSummary.level },
          { label: "PP Total", value: runnerStateSummary.pp },
          { label: "Peringkat", value: runnerStateSummary.rank },
          { label: "Reliabilitas", value: runnerStateSummary.reliability },
          { label: "Cancel Rate", value: runnerStateSummary.cancelRate },
          { label: "Bergabung", value: runnerStateSummary.joinedAt },
        ].map((item) => (
          <div key={item.label} className="rounded-[10px] bg-base-200 p-3">
            <p className="text-[10px] font-semibold text-base-content/50">
              {item.label}
            </p>
            <p className="text-sm font-bold text-base-content mt-0.5">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Warnings */}
      {runnerStateWarnings.length > 0 && (
        <div className="flex flex-col gap-2 mb-5">
          {runnerStateWarnings.map((w) => (
            <div
              key={w.id}
              className={`rounded-[10px] border p-3 text-xs font-semibold ${resolveWarningClass(w.type)}`}
            >
              {w.type === "warning" ? "⚠️" : w.type === "danger" ? "🚨" : "💡"}{" "}
              {w.message}
            </div>
          ))}
        </div>
      )}

      {/* Skill Breakdown */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-base-content/50 mb-3">
          Kemampuan Per Kategori
        </p>
        <div className="flex flex-col gap-3">
          {runnerSkillStats.map((skill) => (
            <div key={skill.skill}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-base-content">
                    {skill.skill}
                  </p>
                  <span className="text-[10px] bg-base-200 px-2 py-0.5 rounded-[5px] text-base-content/60">
                    Lv {skill.level}/{skill.maxLevel}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-base-content/50">
                  {skill.completedQuest} Quest · {skill.ppShare}
                </span>
              </div>
              <div className="h-2 rounded-full bg-base-200">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${resolveSkillLevelBar(skill.level, skill.maxLevel)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-base-content/50 mb-3">
          Lencana Diperoleh
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {runnerBadges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-[12px] p-3 flex items-start gap-3 ${resolveBadgeTierClass(badge.tier)}`}
            >
              <div className="shrink-0 text-2xl">🎖️</div>
              <div>
                <p className="text-sm font-bold">{badge.label}</p>
                <p className="text-[11px] opacity-75 mt-0.5">{badge.description}</p>
                <p className="text-[10px] mt-1 opacity-60">✅ {badge.earnedAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collapse: Growth Path */}
      <div className="mt-5">
        <div className="collapse collapse-arrow rounded-[12px] border border-base-300/70 bg-base-100">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-sm font-semibold text-base-content peer-checked:text-primary">
            🚀 Jalur Naik Level — Q3 Target
          </div>
          <div className="collapse-content text-sm text-base-content/70 flex flex-col gap-2">
            <p>• Selesaikan <strong>9 quest lagi</strong> untuk mencapai Q3 Runner Elite.</p>
            <p>• Pertahankan response time di bawah <strong>12 menit</strong> selama 14 hari.</p>
            <p>• Rating rata-rata harus tetap <strong>≥ 4.7</strong>.</p>
            <p>• Kurangi cancel rate ke <strong>bawah 4%</strong>.</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
