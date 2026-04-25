import type { RatingEntry, PerformanceSummary } from "../../performance";
import { ratingHistoryCopy } from "./rating-history";

type Props = {
  summary: PerformanceSummary;
  ratings: RatingEntry[];
};

function StarDisplay({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${s <= score ? "fill-[#f59e0b]" : "fill-base-300"}`}
        >
          <path d="M12 3.75L14.47 8.76L20 9.56L16 13.46L16.94 19L12 16.4L7.06 19L8 13.46L4 9.56L9.53 8.76L12 3.75Z" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-bold text-base-content/70">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

function RoleBadge({ role }: { role: RatingEntry["role"] }) {
  const copy = ratingHistoryCopy;
  const isRunner = role === "as_runner";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
        isRunner
          ? "bg-[#DBEAFE] text-[#1d4ed8]"
          : "bg-[#D1FAE5] text-[#065f46]"
      }`}
    >
      {isRunner ? copy.asRunnerBadge : copy.asGiverBadge}
    </span>
  );
}

export default function RatingHistoryPage({ summary, ratings }: Props) {
  const copy = ratingHistoryCopy;

  return (
    <div className="flex flex-col gap-5">
      {/* Avg Rating Summary */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-2xl border border-base-200 bg-base-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-base-content/45">
            {copy.avgAsRunnerLabel}
          </p>
          {summary.avgRatingAsRunner !== null ? (
            <StarDisplay score={summary.avgRatingAsRunner} />
          ) : (
            <p className="text-sm font-medium text-base-content/40">—</p>
          )}
        </div>
        <div className="flex flex-col gap-2 rounded-2xl border border-base-200 bg-base-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-base-content/45">
            {copy.avgAsGiverLabel}
          </p>
          {summary.avgRatingAsGiver !== null ? (
            <StarDisplay score={summary.avgRatingAsGiver} />
          ) : (
            <p className="text-sm font-medium text-base-content/40">—</p>
          )}
        </div>
        <div className="flex flex-col gap-2 rounded-2xl border border-base-200 bg-base-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-base-content/45">
            {copy.totalRatingsLabel}
          </p>
          <p className="text-2xl font-black text-base-content">
            {summary.totalRatingsReceived}
          </p>
        </div>
      </div>

      {/* Rating List */}
      <div className="flex flex-col gap-3">
        {ratings.length === 0 ? (
          <div className="rounded-2xl border border-base-200 bg-base-100 p-8 text-center">
            <p className="text-sm font-medium text-base-content/40">
              {copy.noRatingsText}
            </p>
          </div>
        ) : (
          ratings.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col gap-3 rounded-2xl border border-base-200 bg-base-100 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-base-content/45">
                    {copy.questLabel}
                  </p>
                  <p className="text-sm font-semibold text-base-content">
                    {entry.questTitle}
                  </p>
                </div>
                <RoleBadge role={entry.role} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-base-content/45">
                    {copy.fromLabel}
                  </p>
                  <p className="text-sm font-semibold text-base-content">
                    {entry.raterName}
                  </p>
                </div>
                <StarDisplay score={entry.score} />
              </div>
              {entry.comment && (
                <div className="rounded-xl bg-base-200/60 px-3 py-2">
                  <p className="text-xs font-medium italic text-base-content/65">
                    "{entry.comment}"
                  </p>
                </div>
              )}
              <p className="text-right text-xs text-base-content/35">
                {new Date(entry.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
