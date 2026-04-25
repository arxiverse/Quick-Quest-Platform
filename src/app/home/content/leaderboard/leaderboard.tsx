import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn, Surface } from "../../home.ui";
import {
  buildLeaderboardHistoryByPeriod,
  buildLeaderboardRowsByPeriod,
  leaderboardAllSkill,
  leaderboardGroups,
  leaderboardInsightByPeriod,
  leaderboardPeriods,
  leaderboardPublicFeed,
  leaderboardRankHistories,
  leaderboardScopes,
  leaderboardSummaryMetricMap,
  leaderboardViewText,
  resolveLeaderboardDelaySafeGroup,
  resolveLeaderboardLevelTone,
  resolveLeaderboardMaxRank,
  resolveLeaderboardRunnerProfile,
  resolveLeaderboardTrendLabel,
  resolveLeaderboardTrendTone,
  type LeaderboardHistoryChartPoint,
  type LeaderboardPeriod,
  type LeaderboardScope,
  type LeaderboardTooltipRow,
} from "./leaderboard";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: LeaderboardTooltipRow[];
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }
  return (
    <div className="rounded-[10px] border border-base-300/70 bg-base-100/95 px-3 py-2 shadow-lg backdrop-blur">
      {label && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
          {label}
        </p>
      )}
      {payload.map((entry) => (
        <div
          key={`${entry.dataKey}-${entry.name}`}
          className="flex items-center gap-2 text-sm"
        >
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: entry.color ?? "#A046FF" }}
          />
          <span className="font-medium text-base-content/65">{entry.name}</span>
          <span className="font-bold text-base-content">
            {leaderboardViewText.chart.rankValuePrefix} {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function Sparkline({
  data,
  datakey,
  color,
}: {
  data: LeaderboardHistoryChartPoint[];
  datakey: LeaderboardScope;
  color: string;
}) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data.map((d) => d[datakey]));
  const max = Math.max(...data.map((d) => d[datakey]));
  return (
    <LineChart width={56} height={20} data={data}>
      <YAxis reversed domain={[max + 1, Math.max(1, min - 1)]} hide />
      <Line
        type="monotone"
        dataKey={datakey}
        stroke={color}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  );
}

function LeaderboardComponent() {
  const [scope, setScope] = useState<LeaderboardScope>("Lokal");
  const [period, setPeriod] = useState<LeaderboardPeriod>("Weekly");
  const [skillFilter, setSkillFilter] = useState(leaderboardAllSkill);
  const [query, setQuery] = useState("");
  const [selectedRunnerId, setSelectedRunnerId] = useState("");

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelRunnerId, setPanelRunnerId] = useState("");

  const activeGroup = useMemo(
    () => resolveLeaderboardDelaySafeGroup(scope),
    [scope],
  );
  const allRows = useMemo(
    () => leaderboardGroups.flatMap((group) => group.rows),
    [],
  );
  const periodRows = useMemo(
    () => buildLeaderboardRowsByPeriod(activeGroup.rows, period),
    [activeGroup.rows, period],
  );
  const skillOptions = useMemo(
    () => [
      leaderboardAllSkill,
      ...Array.from(new Set(periodRows.map((row) => row.primarySkill))),
    ],
    [periodRows],
  );
  const activeSkillFilter = skillOptions.includes(skillFilter)
    ? skillFilter
    : leaderboardAllSkill;
  const metrics = useMemo(() => leaderboardSummaryMetricMap[period], [period]);
  const insights = useMemo(() => leaderboardInsightByPeriod[period], [period]);
  const availableRunnerIds = useMemo(
    () => new Set(periodRows.map((row) => row.id)),
    [periodRows],
  );

  const filteredRows = useMemo(() => {
    const bySkill =
      activeSkillFilter === leaderboardAllSkill
        ? periodRows
        : periodRows.filter((row) => row.primarySkill === activeSkillFilter);
    const keyword = query.trim().toLowerCase();
    if (!keyword) return bySkill;
    return bySkill.filter((row) =>
      `${row.name} ${row.city} ${row.primarySkill}`
        .toLowerCase()
        .includes(keyword),
    );
  }, [activeSkillFilter, periodRows, query]);

  const resolvedSelectedRunnerId =
    (selectedRunnerId && availableRunnerIds.has(selectedRunnerId)
      ? selectedRunnerId
      : "") ||
    filteredRows[0]?.id ||
    periodRows[0]?.id ||
    "";

  const selectedRow =
    periodRows.find((row) => row.id === resolvedSelectedRunnerId) ??
    filteredRows[0] ??
    periodRows[0] ??
    null;
  const selectedProfile = selectedRow
    ? resolveLeaderboardRunnerProfile(selectedRow)
    : null;
  const selectedHistorySource =
    leaderboardRankHistories.find((entry) => entry.runnerId === selectedRow?.id)
      ?.points ?? [];
  const selectedHistory = buildLeaderboardHistoryByPeriod(
    selectedHistorySource,
    period,
  );
  const maxRank = resolveLeaderboardMaxRank(selectedHistory);

  const panelRow = panelRunnerId
    ? (allRows.find((row) => row.id === panelRunnerId) ?? null)
    : null;
  const panelProfile = panelRow
    ? resolveLeaderboardRunnerProfile(panelRow)
    : null;

  function openProfilePanel(runnerId: string) {
    setSelectedRunnerId(runnerId);
    setPanelRunnerId(runnerId);
    setIsPanelOpen(true);
  }

  function closeProfilePanel() {
    setIsPanelOpen(false);
    setPanelRunnerId("");
  }

  return (
    <div className="min-w-0 space-y-4">
      <Surface className="p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/45">
          {leaderboardViewText.hero.eyebrow}
        </p>
        <h1 className="mt-1 text-xl font-bold text-base-content sm:text-2xl">
          {leaderboardViewText.hero.title}
        </h1>
      </Surface>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Surface key={`${period}-${metric.label}`} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content/55">
              {metric.label}
            </p>
            <p className="mt-2 text-xl font-bold text-base-content">
              {metric.value}
            </p>
            <span
              className={cn(
                "mt-2 inline-flex rounded-[8px] px-2.5 py-1 text-[11px] font-semibold text-black",
                metric.tone,
              )}
            >
              {metric.hint}
            </span>
          </Surface>
        ))}
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Surface className="min-w-0 p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {insights.map((insight) => (
              <span
                key={insight.id}
                className={cn(
                  "rounded-[8px] bg-linear-to-br px-2.5 py-1 text-xs font-semibold text-black",
                  insight.tone,
                )}
              >
                {insight.title}: {insight.value}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="inline-flex rounded-[10px] bg-base-200 p-1 justify-start">
                {leaderboardScopes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setScope(option)}
                    className={cn(
                      "btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none",
                      scope === option
                        ? "bg-primary text-primary-content"
                        : "bg-transparent text-base-content/75",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="inline-flex rounded-[10px] bg-base-200 justify-end p-1">
                {leaderboardPeriods.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPeriod(option)}
                    className={cn(
                      "btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none",
                      period === option
                        ? "bg-primary text-primary-content"
                        : "bg-transparent text-base-content/75",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-[11rem_minmax(0,1fr)]">
              <select
                className="select select-sm h-8 min-h-8 w-full min-w-0 rounded-[8px] border-base-300 bg-base-100 text-xs"
                value={skillFilter}
                onChange={(event) => setSkillFilter(event.target.value)}
              >
                {skillOptions.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="input input-sm h-8 min-h-8 w-full min-w-0 rounded-[8px] border-base-300 bg-base-100 text-xs"
                placeholder={
                  leaderboardViewText.filters.runnerSearchPlaceholder
                }
              />
            </div>
          </div>

          {/* Gamified Podium View (Top 3) */}
          {query === "" && filteredRows.length >= 3 && (
            <div
              key={`podium-${scope}-${period}`}
              className="mt-6 mb-8 flex flex-wrap lg:flex-nowrap items-end justify-center gap-4 lg:gap-6 animate-in slide-in-from-bottom-8 duration-700"
            >
              {[filteredRows[1], filteredRows[0], filteredRows[2]].map(
                (row) => {
                  if (!row) return null;
                  const isRank1 = row.rank === 1;
                  const isRank2 = row.rank === 2;

                  const podiumStyle = isRank1
                    ? "bg-linear-to-t from-[#FEF08A]/10 to-base-100 border-[#F59E0B] shadow-[0_-10px_40px_rgba(245,158,11,0.2)] h-[220px]"
                    : isRank2
                      ? "bg-linear-to-t from-base-200 to-base-100 border-[#94A3B8] shadow-sm h-[180px]"
                      : "bg-linear-to-t from-[#FFEDD5]/10 to-base-100 border-[#D97706] shadow-sm h-[160px]";

                  const crownIcon = isRank1 ? "👑" : isRank2 ? "🥈" : "🥉";
                  const rankColor = isRank1
                    ? "text-[#F59E0B]"
                    : isRank2
                      ? "text-[#94A3B8]"
                      : "text-[#D97706]";

                  return (
                    <div
                      key={`podium-${row.id}`}
                      onClick={() => {
                        setSelectedRunnerId(row.id);
                        openProfilePanel(row.id);
                      }}
                      className={cn(
                        "relative flex flex-col items-center p-4 rounded-t-2xl border-t-4 border-x border-base-300 w-full sm:w-[220px] cursor-pointer group transition-transform hover:-translate-y-2",
                        podiumStyle,
                        selectedRunnerId === row.id && "ring-2 ring-primary",
                      )}
                    >
                      {isRank1 && (
                        <div className="absolute -top-[x] inset-x-0 mx-auto w-10 h-10 animate-bounce text-3xl drop-shadow-xl text-center -translate-y-12">
                          {crownIcon}
                        </div>
                      )}
                      {!isRank1 && (
                        <div className="absolute -top-10 text-2xl drop-shadow-md">
                          {crownIcon}
                        </div>
                      )}

                      <div
                        className={cn(
                          "flex items-center justify-center rounded-full bg-base-100 shadow-inner mb-3 overflow-hidden font-bold",
                          isRank1
                            ? "size-16 border-2 border-[#F59E0B] text-2xl"
                            : "size-12 border-2 text-xl border-base-300",
                          rankColor,
                        )}
                      >
                        #{row.rank}
                      </div>

                      <h3 className="font-bold text-base-content text-lg mb-1">
                        {row.name}
                      </h3>
                      <p className="text-[11px] font-semibold tracking-wider text-base-content/60 uppercase">
                        {row.primarySkill}
                      </p>

                      <div className="mt-auto w-full bg-base-100/50 rounded-[8px] p-2 text-center backdrop-blur-sm">
                        <p
                          className={cn(
                            "font-black font-mono",
                            isRank1
                              ? "text-lg text-[#F59E0B]"
                              : "text-sm text-base-content",
                          )}
                        >
                          {row.ppTotal} PP
                        </p>
                        <p className="text-[10px] text-base-content/50">
                          Lvl {row.level} • {row.city}
                        </p>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}

          {/* Contender Card List (Rank 4+) or Full List if Searching */}
          <div
            className="mt-4 space-y-3"
            key={`list-${scope}-${period}-${query}`}
          >
            {(query !== "" || filteredRows.length < 3
              ? filteredRows
              : filteredRows.slice(3)
            ).map((row) => {
              const badges = resolveLeaderboardRunnerProfile(row)?.badges ?? [];
              const historySource =
                leaderboardRankHistories.find(
                  (entry) => entry.runnerId === row.id,
                )?.points ?? [];
              const rowHistory = buildLeaderboardHistoryByPeriod(
                historySource,
                period,
              );
              const sparklineColor =
                row.trend > 0
                  ? "#166534"
                  : row.trend < 0
                    ? "#991B1B"
                    : "#A046FF";

              return (
                <div
                  key={`contender-${row.id}`}
                  onClick={() => {
                    setSelectedRunnerId(row.id);
                    openProfilePanel(row.id);
                  }}
                  className={cn(
                    "group relative flex flex-wrap md:flex-nowrap items-center gap-3 sm:gap-4 rounded-[12px] border border-base-300/70 bg-base-100 p-3 sm:p-4 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 cursor-pointer animate-in fade-in duration-500 overflow-hidden",
                    selectedRunnerId === row.id &&
                      "bg-primary/5 border-primary",
                  )}
                >
                  <div className="flex items-center justify-center size-10 rounded-[10px] bg-base-200 font-bold text-base-content/70 shrink-0">
                    <span className="text-xs">#</span>
                    {row.rank}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-base-content leading-none truncate">
                        {row.name}
                      </h4>
                      {badges.length > 0 && (
                        <span
                          className="flex size-4 items-center justify-center rounded-full bg-linear-to-tr from-[#A046FF] to-[#38BDF8] text-[10px] text-white shadow-sm shrink-0"
                          title={badges.join(", ")}
                        >
                          🌟
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-base-content/60 mt-1 truncate">
                      {row.city} • {row.primarySkill} • Lvl {row.level}
                    </p>
                  </div>

                  <div className="hidden 2xl:flex gap-4 xl:gap-6 items-center bg-base-200/50 rounded-[10px] px-3 py-1.5 shrink-0">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-[9px] uppercase font-bold text-base-content/40 tracking-wider">
                        Metrics
                      </p>
                      <p className="text-[11px] font-semibold">
                        {row.completionRate}
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center border-l border-base-300 pl-3">
                      <p className="text-[9px] uppercase font-bold text-base-content/40 tracking-wider">
                        PP Total
                      </p>
                      <p className="text-xs font-bold text-primary">
                        {row.ppTotal}
                      </p>
                    </div>
                  </div>

                  <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
                    <div className="w-[40px] xl:w-[60px] hidden lg:block">
                      <Sparkline
                        data={rowHistory}
                        datakey={scope}
                        color={sparklineColor}
                      />
                    </div>
                    <span
                      className={cn(
                        "rounded-[8px] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold shadow-xs whitespace-nowrap",
                        resolveLeaderboardTrendTone(row.trend),
                      )}
                    >
                      {resolveLeaderboardTrendLabel(row.trend)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Surface>

        <Surface className="min-w-0 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
            {leaderboardViewText.snapshot.eyebrow}
          </p>
          {selectedProfile ? (
            <div>
              <h2 className="mt-1 text-lg font-bold text-base-content">
                {selectedProfile.name}
              </h2>
              <p className="text-sm text-base-content/60">
                {selectedProfile.handle} | {selectedProfile.location}
              </p>
              <p className="mt-2 text-sm text-base-content/75">
                {selectedProfile.headline}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedProfile.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-[999px] bg-[#DBEAFE] px-2.5 py-1 text-[11px] font-semibold text-[#1D4ED8]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-[9px] border border-base-300/70 bg-base-100 p-2.5">
                  <p className="text-[11px] text-base-content/55">On-time</p>
                  <p className="text-sm font-bold">
                    {selectedProfile.reliability.onTimeRate}
                  </p>
                </div>
                <div className="rounded-[9px] border border-base-300/70 bg-base-100 p-2.5">
                  <p className="text-[11px] text-base-content/55">Rating</p>
                  <p className="text-sm font-bold">
                    {selectedProfile.reliability.avgRating}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm mt-4 h-9 min-h-9 rounded-[8px] border-none bg-primary px-4 text-xs font-semibold text-primary-content"
                onClick={() => openProfilePanel(selectedProfile.id)}
              >
                {leaderboardViewText.snapshot.deepPanelButton}
              </button>
            </div>
          ) : (
            <p className="mt-2 text-sm text-base-content/60">
              {leaderboardViewText.snapshot.notFoundMessage}
            </p>
          )}
        </Surface>
      </div>

      <Surface className="p-4 sm:p-5">
        <div className="h-[330px] min-h-[330px] w-full min-w-0">
          <ResponsiveContainer width="100%" height={330}>
            <LineChart
              data={selectedHistory}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "currentColor", fontSize: 12 }}
              />
              <YAxis
                reversed
                domain={[maxRank + 1, 1]}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "currentColor", fontSize: 12 }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Line
                type="monotone"
                dataKey="Lokal"
                stroke="#38BDF8"
                strokeWidth={3}
                dot={{ r: 4, fill: "#38BDF8" }}
              />
              <Line
                type="monotone"
                dataKey="Regional"
                stroke="#A046FF"
                strokeWidth={3}
                dot={{ r: 4, fill: "#A046FF" }}
              />
              <Line
                type="monotone"
                dataKey="Nasional"
                stroke="#84CC16"
                strokeWidth={3}
                dot={{ r: 4, fill: "#84CC16" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Surface>

      <Surface className="p-4 sm:p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
          {leaderboardViewText.feed.eyebrow}
        </p>
        <div className="grid gap-2 md:grid-cols-2">
          {leaderboardPublicFeed.map((event) => (
            <div
              key={event.id}
              className="rounded-[10px] border border-base-300/70 bg-base-100 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold">{event.title}</p>
                <span className="rounded-[8px] bg-base-200 px-2 py-0.5 text-[11px] font-semibold text-base-content/70">
                  {event.tag}
                </span>
              </div>
              <p className="mt-1 text-xs text-base-content/65">{event.note}</p>
              <p className="mt-1 text-[11px] text-base-content/55">
                {event.time}
              </p>
            </div>
          ))}
        </div>
      </Surface>

      {isPanelOpen && panelProfile && (
        <div
          className="fixed inset-0 z-50 bg-black/35"
          onClick={closeProfilePanel}
        >
          <aside
            className="ml-auto h-full w-full max-w-120 overflow-y-auto border-l border-base-300/70 bg-base-100 p-4 sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
                  {leaderboardViewText.panel.eyebrow}
                </p>
                <h2 className="mt-1 text-xl font-bold">{panelProfile.name}</h2>
                <p className="text-sm text-base-content/60">
                  {panelProfile.handle} | {panelProfile.location}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-sm h-8 min-h-8 rounded-[8px] border-base-300 bg-base-100 text-xs"
                onClick={closeProfilePanel}
              >
                {leaderboardViewText.panel.closeButton}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-[8px] bg-base-200 px-2 py-0.5 font-semibold text-base-content/70">
                {leaderboardViewText.panel.scopePrefix} {scope}
              </span>
              <span className="rounded-[8px] bg-base-200 px-2 py-0.5 font-semibold text-base-content/70">
                {leaderboardViewText.panel.periodPrefix} {period}
              </span>
              <span className="rounded-[8px] bg-base-200 px-2 py-0.5 font-semibold text-base-content/70">
                {panelProfile.percentile ?? "Top 20%"}
              </span>
            </div>
            <p className="mt-3 text-sm text-base-content/75">
              {panelProfile.headline}
            </p>
            <div className="mt-4 space-y-2">
              {panelProfile.skills.map((skill) => (
                <div
                  key={`${panelProfile.id}-${skill.skill}`}
                  className="rounded-[10px] border border-base-300/70 bg-base-100 p-3"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold">{skill.skill}</p>
                    <span
                      className={cn(
                        "rounded-[8px] px-2 py-0.5 text-[11px] font-semibold",
                        resolveLeaderboardLevelTone(skill.level),
                      )}
                    >
                      {skill.level}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-base-200">
                    <div
                      className="h-2 rounded-full bg-[#6B21FF]"
                      style={{ width: `${skill.share}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-base-content/60">
                    {skill.pp} PP | Share {skill.share}%
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {(panelProfile.recentActivities ?? []).map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-[10px] border border-base-300/70 bg-base-100 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{activity.title}</p>
                    <span className="rounded-[8px] bg-base-200 px-2 py-0.5 text-[11px] font-semibold text-base-content/70">
                      {activity.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-base-content/65">
                    {activity.note}
                  </p>
                  <p className="mt-1 text-[11px] text-base-content/55">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default LeaderboardComponent;
