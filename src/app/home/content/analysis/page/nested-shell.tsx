import type { ReactNode } from "react";
import { Surface, cn } from "../../../home.ui";

type NestedChip = {
  label: string;
  toneClass?: string;
};

type NestedPoint = {
  title: string;
  detail: string;
  toneClass?: string;
};

export function AnalysisNestedShell({
  eyebrow,
  title,
  description,
  chips = [],
  onBack,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  chips?: NestedChip[];
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Surface className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
              {eyebrow}
            </p>
            <h2 className="mt-1 text-xl font-bold text-base-content sm:text-2xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 max-w-3xl text-sm text-base-content/70">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onBack}
            className="btn h-9 min-h-9 rounded-[8px] border-base-300 bg-base-100 px-4 text-xs text-base-content shadow-none hover:bg-base-200"
          >
            Kembali
          </button>
        </div>

        {chips.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className={cn(
                  "rounded-[8px] px-2.5 py-1 text-xs font-semibold",
                  chip.toneClass ?? "bg-base-200 text-base-content/80",
                )}
              >
                {chip.label}
              </span>
            ))}
          </div>
        ) : null}

        {children}
      </Surface>
    </div>
  );
}

export function AnalysisNestedPointList({
  points,
}: {
  points: NestedPoint[];
}) {
  return (
    <div className="space-y-2.5">
      {points.map((point) => (
        <div
          key={point.title}
          className="rounded-[10px] border border-base-300/70 bg-base-100 p-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-sm font-semibold text-base-content">{point.title}</p>
            <span
              className={cn(
                "rounded-[8px] px-2 py-0.5 text-[11px] font-semibold",
                point.toneClass ?? "bg-base-200 text-base-content/70",
              )}
            >
              Detail
            </span>
          </div>
          <p className="mt-1 text-xs text-base-content/65">{point.detail}</p>
        </div>
      ))}
    </div>
  );
}

export function AnalysisNestedStatGrid({
  stats,
}: {
  stats: Array<{ label: string; value: string; hint: string; toneClass?: string }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[10px] border border-base-300/70 bg-base-100 p-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content/55">
            {stat.label}
          </p>
          <p className="mt-1 text-xl font-bold text-base-content">{stat.value}</p>
          <span
            className={cn(
              "mt-2 inline-flex rounded-[8px] px-2 py-0.5 text-[11px] font-semibold",
              stat.toneClass ?? "bg-base-200 text-base-content/70",
            )}
          >
            {stat.hint}
          </span>
        </div>
      ))}
    </div>
  );
}
