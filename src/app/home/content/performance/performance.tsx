import { useState } from "react";
import type {
  PerformanceView,
  PerformanceSummary,
  RatingEntry,
  SkillPP,
} from "./performance";
import {
  performanceViews,
  performanceSummarySeed,
  performanceViewCopy,
} from "./performance";
import { performanceTabCopy } from "./page/performance-pages.service";
import PpOverviewPage from "./page/pp-overview/pp-overview.tsx";
import RatingHistoryPage from "./page/rating-history/rating-history.tsx";
import SkillBoardPage from "./page/skill-board/skill-board.tsx";

// ─── Stub data — wire ke backend saat rating endpoint siap ───────────────────

const stubSummary: PerformanceSummary = performanceSummarySeed;
const stubRatings: RatingEntry[] = [];
const stubSkills: SkillPP[] = [];

// ─── Tab Nav ─────────────────────────────────────────────────────────────────

function PerformanceTabNav({
  active,
  onChange,
}: {
  active: PerformanceView;
  onChange: (v: PerformanceView) => void;
}) {
  return (
    <div className="flex overflow-x-auto rounded-2xl border border-base-200 bg-base-100 p-1">
      {performanceViews.map((v) => {
        const isActive = v === active;
        const { label } = performanceTabCopy[v];
        return (
          <button
            key={v}
            type="button"
            id={`performance-tab-${v}`}
            onClick={() => onChange(v)}
            className={[
              "flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all sm:text-sm",
              isActive
                ? "bg-[#2563EB] text-white shadow-sm"
                : "text-base-content/55 hover:text-base-content",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Page Resolver ───────────────────────────────────────────────────────────

function PerformancePageContent({
  view,
  summary,
  ratings,
  skills,
}: {
  view: PerformanceView;
  summary: PerformanceSummary;
  ratings: RatingEntry[];
  skills: SkillPP[];
}) {
  if (view === "pp-overview") return <PpOverviewPage summary={summary} />;
  if (view === "rating-history")
    return <RatingHistoryPage summary={summary} ratings={ratings} />;
  if (view === "skill-board") return <SkillBoardPage skills={skills} />;
  return null;
}

// ─── Main Shell ───────────────────────────────────────────────────────────────

export default function PerformanceComponent() {
  const copy = performanceViewCopy;
  const [activeView, setActiveView] = useState<PerformanceView>("pp-overview");

  // Nanti: hydrate dari backend saat rating endpoint siap
  const summary = stubSummary;
  const ratings = stubRatings;
  const skills = stubSkills;

  return (
    <div className="flex flex-col gap-4">
      {/* Header badge */}
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-bold text-[#1d4ed8]">
          {copy.eyebrow}
        </span>
        <p className="text-xs text-base-content/45">{copy.title}</p>
      </div>

      {/* Tab navigation */}
      <PerformanceTabNav active={activeView} onChange={setActiveView} />

      {/* Nested SPA content */}
      <PerformancePageContent
        view={activeView}
        summary={summary}
        ratings={ratings}
        skills={skills}
      />
    </div>
  );
}
