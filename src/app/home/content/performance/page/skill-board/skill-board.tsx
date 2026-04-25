import type { SkillPP } from "../../performance";
import { skillBoardCopy } from "./skill-board";

type Props = { skills: SkillPP[] };

function SkillBar({ pp, maxPP }: { pp: number; maxPP: number }) {
  const pct = maxPP > 0 ? (pp / maxPP) * 100 : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-base-200">
      <div
        className="h-full rounded-full bg-[#2563EB] transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function SkillBoardPage({ skills }: Props) {
  const copy = skillBoardCopy;
  const maxPP = skills.reduce((max, s) => Math.max(max, s.pp), 0);
  const topSkills = [...skills].sort((a, b) => b.pp - a.pp).slice(0, 3);

  return (
    <div className="flex flex-col gap-5">
      {/* Top Skills Podium */}
      {topSkills.length > 0 && (
        <div className="rounded-2xl border border-base-200 bg-base-100 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-base-content/45">
            {copy.topSkillLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {topSkills.map((s, i) => (
              <div
                key={s.skill}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${
                  i === 0
                    ? "bg-[#fef3c7] text-[#92400e]"
                    : i === 1
                      ? "bg-[#e5e7eb] text-[#374151]"
                      : "bg-[#f3e3d5] text-[#7a4a28]"
                }`}
              >
                <span>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
                <span>{s.skill}</span>
                <span className="opacity-70">·</span>
                <span>
                  {s.pp} {copy.ppLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Skills List */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/45">
          {copy.allSkillsLabel}
        </p>

        {skills.length === 0 ? (
          <div className="rounded-2xl border border-base-200 bg-base-100 p-8 text-center">
            <p className="text-sm font-medium text-base-content/40">
              {copy.noSkillsText}
            </p>
          </div>
        ) : (
          skills.map((s) => (
            <div
              key={s.skill}
              className="flex flex-col gap-2 rounded-2xl border border-base-200 bg-base-100 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-base-content">{s.skill}</p>
                <div className="flex items-center gap-3">
                  {s.cityRank && (
                    <span className="rounded-full bg-[#DBEAFE] px-2 py-0.5 text-xs font-semibold text-[#1d4ed8]">
                      {copy.cityRankLabel} #{s.cityRank}
                    </span>
                  )}
                  <span className="text-sm font-bold text-base-content/70">
                    {s.pp} {copy.ppLabel}
                  </span>
                </div>
              </div>
              <SkillBar pp={s.pp} maxPP={maxPP} />
              <p className="text-xs text-base-content/45">
                {s.questCount} {copy.questCountLabel}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
