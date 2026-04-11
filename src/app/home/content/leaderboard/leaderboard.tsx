import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSearchParams } from "react-router-dom";
import { cn, Surface } from "../../home.ui";
import {
  leaderboardGroups,
  leaderboardInsightByPeriod,
  leaderboardPeriods,
  leaderboardPublicFeed,
  leaderboardRankHistories,
  leaderboardScopes,
  leaderboardSummaryMetricMap,
  leaderboardTopProfiles,
  type LeaderboardPeriod,
  type LeaderboardRunnerProfile,
  type LeaderboardScope,
  type LeaderboardTableRow,
} from "./leaderboard";

type TooltipRow = { color?: string; dataKey?: string | number; name?: string; value?: string | number };
type HistoryPoint = { period: string; Lokal: number; Regional: number; Nasional: number };

const ALL_SKILL = "Semua Skill";
const PROFILE_QUERY_KEYS = ["lbPanel", "lbRunner", "lbScope", "lbPeriod"] as const;
const PERIOD_CONFIG: Record<LeaderboardPeriod, { pp: number; shift: number; prefix: string }> = {
  Weekly: { pp: 1, shift: 0, prefix: "W" },
  Monthly: { pp: 1.35, shift: 1, prefix: "M" },
  "All-Time": { pp: 2.2, shift: 2, prefix: "Q" },
};

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipRow[]; label?: string }) {
  if (!active || !payload?.length) {
    return null;
  }
  return (
    <div className="rounded-[10px] border border-base-300/70 bg-base-100/95 px-3 py-2 shadow-lg backdrop-blur">
      {label && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">{label}</p>}
      {payload.map((entry) => (
        <div key={`${entry.dataKey}-${entry.name}`} className="flex items-center gap-2 text-sm">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.color ?? "#A046FF" }} />
          <span className="font-medium text-base-content/65">{entry.name}</span>
          <span className="font-bold text-base-content">Rank {entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function levelTone(level: LeaderboardTableRow["level"]) {
  if (level === "Q1") return "bg-[#DBEAFE] text-[#1D4ED8]";
  if (level === "Q2") return "bg-[#FEF3C7] text-[#92400E]";
  return "bg-[#DCFCE7] text-[#166534]";
}

function trendTone(value: number) {
  if (value > 0) return "bg-[#DCFCE7] text-[#166534]";
  if (value < 0) return "bg-[#FECACA] text-[#991B1B]";
  return "bg-base-200 text-base-content/70";
}

function trendLabel(value: number) {
  if (value > 0) return `Naik ${value}`;
  if (value < 0) return `Turun ${Math.abs(value)}`;
  return "Tetap";
}

function isScope(value: string | null): value is LeaderboardScope {
  return !!value && leaderboardScopes.some((scope) => scope === value);
}

function isPeriod(value: string | null): value is LeaderboardPeriod {
  return !!value && leaderboardPeriods.some((period) => period === value);
}

function parseNumber(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || 0;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function buildRowsByPeriod(rows: LeaderboardTableRow[], period: LeaderboardPeriod) {
  const config = PERIOD_CONFIG[period];
  return rows
    .map((row, index) => ({
      ...row,
      ppTotal: formatNumber(Math.round(parseNumber(row.ppTotal) * config.pp + (rows.length - index) * 12)),
      trend: row.trend + (period === "Weekly" ? 0 : 1),
    }))
    .sort((left, right) => parseNumber(right.ppTotal) - parseNumber(left.ppTotal))
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

function buildHistoryByPeriod(points: HistoryPoint[], period: LeaderboardPeriod) {
  const config = PERIOD_CONFIG[period];
  return points.map((point, index) => ({
    period: `${config.prefix}${index + 1}`,
    Lokal: point.Lokal + config.shift,
    Regional: point.Regional + config.shift,
    Nasional: point.Nasional + config.shift,
  }));
}

function resolveProfile(row: LeaderboardTableRow): LeaderboardRunnerProfile {
  const found = leaderboardTopProfiles.find((entry) => entry.id === row.id);
  if (found) return found;
  return {
    id: row.id,
    name: row.name,
    handle: `@${row.name.toLowerCase().replaceAll(" ", ".")}`,
    location: row.city,
    joinedAt: "2025-10-01",
    headline: `${row.name} menjaga performa stabil untuk ${row.primarySkill}.`,
    badges: ["Public Profile"],
    reliability: { onTimeRate: row.completionRate, cancelRate: "1.6%", avgRating: "4.80", responseSpeed: "5m 30s" },
    skills: [{ skill: row.primarySkill, level: row.level, pp: row.ppTotal, share: 100 }],
    percentile: "Top 15%",
    nextRankGap: "140 PP ke rank berikutnya",
    momentum: "+90 PP (7D)",
    milestones: [{ label: "Streak", value: "5 quest", note: "On-time stabil" }],
    recentActivities: [{ id: `${row.id}-1`, tag: "Quest", title: "Quest selesai", note: "Konfirmasi giver diterima", time: "35 menit lalu" }],
  };
}

function LeaderboardComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scope, setScope] = useState<LeaderboardScope>("Lokal");
  const [period, setPeriod] = useState<LeaderboardPeriod>("Weekly");
  const [skillFilter, setSkillFilter] = useState(ALL_SKILL);
  const [query, setQuery] = useState("");
  const [selectedRunnerId, setSelectedRunnerId] = useState(searchParams.get("lbRunner") ?? "");

  const activeGroup = useMemo(() => leaderboardGroups.find((group) => group.scope === scope) ?? leaderboardGroups[0], [scope]);
  const allRows = useMemo(() => leaderboardGroups.flatMap((group) => group.rows), []);
  const periodRows = useMemo(() => buildRowsByPeriod(activeGroup.rows, period), [activeGroup.rows, period]);
  const skillOptions = useMemo(() => [ALL_SKILL, ...new Set(periodRows.map((row) => row.primarySkill))], [periodRows]);
  const metrics = useMemo(() => leaderboardSummaryMetricMap[period], [period]);
  const insights = useMemo(() => leaderboardInsightByPeriod[period], [period]);

  const filteredRows = useMemo(() => {
    const bySkill = skillFilter === ALL_SKILL ? periodRows : periodRows.filter((row) => row.primarySkill === skillFilter);
    const keyword = query.trim().toLowerCase();
    if (!keyword) return bySkill;
    return bySkill.filter((row) => `${row.name} ${row.city} ${row.primarySkill}`.toLowerCase().includes(keyword));
  }, [periodRows, query, skillFilter]);

  useEffect(() => {
    const scopedParam = searchParams.get("lbScope");
    const periodParam = searchParams.get("lbPeriod");
    if (isScope(scopedParam) && scopedParam !== scope) setScope(scopedParam);
    if (isPeriod(periodParam) && periodParam !== period) setPeriod(periodParam);
  }, [period, scope, searchParams]);

  useEffect(() => {
    if (!skillOptions.includes(skillFilter)) setSkillFilter(ALL_SKILL);
  }, [skillFilter, skillOptions]);

  useEffect(() => {
    const fromQuery = searchParams.get("lbRunner");
    const available = new Set(periodRows.map((row) => row.id));
    if (fromQuery && available.has(fromQuery) && selectedRunnerId !== fromQuery) {
      setSelectedRunnerId(fromQuery);
      return;
    }
    if (!selectedRunnerId || !available.has(selectedRunnerId)) {
      setSelectedRunnerId(filteredRows[0]?.id ?? periodRows[0]?.id ?? "");
    }
  }, [filteredRows, periodRows, searchParams, selectedRunnerId]);

  const selectedRow = periodRows.find((row) => row.id === selectedRunnerId) ?? filteredRows[0] ?? periodRows[0] ?? null;
  const selectedProfile = selectedRow ? resolveProfile(selectedRow) : null;
  const selectedHistory = useMemo(() => {
    const source = leaderboardRankHistories.find((entry) => entry.runnerId === selectedRow?.id)?.points ?? [];
    return buildHistoryByPeriod(source, period);
  }, [period, selectedRow?.id]);
  const maxRank = Math.max(...selectedHistory.flatMap((point) => [point.Lokal, point.Regional, point.Nasional]), 10);

  const panelRunnerId = searchParams.get("lbRunner") ?? "";
  const isPanelOpen = searchParams.get("lbPanel") === "profile";
  const panelRow = panelRunnerId ? allRows.find((row) => row.id === panelRunnerId) ?? null : null;
  const panelProfile = panelRow ? resolveProfile(panelRow) : null;

  function openProfilePanel(runnerId: string) {
    setSelectedRunnerId(runnerId);
    const next = new URLSearchParams(searchParams);
    next.set("lbPanel", "profile");
    next.set("lbRunner", runnerId);
    next.set("lbScope", scope);
    next.set("lbPeriod", period);
    setSearchParams(next);
  }

  function closeProfilePanel() {
    const next = new URLSearchParams(searchParams);
    PROFILE_QUERY_KEYS.forEach((key) => next.delete(key));
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="min-w-0 space-y-4">
      <Surface className="p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/45">Public Leaderboard</p>
        <h1 className="mt-1 text-xl font-bold text-base-content sm:text-2xl">Ranking Runner Terbuka + Segmented Filter + View Profile Panel</h1>
      </Surface>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Surface key={`${period}-${metric.label}`} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content/55">{metric.label}</p>
            <p className="mt-2 text-xl font-bold text-base-content">{metric.value}</p>
            <span className={cn("mt-2 inline-flex rounded-[8px] px-2.5 py-1 text-[11px] font-semibold text-black", metric.tone)}>{metric.hint}</span>
          </Surface>
        ))}
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Surface className="min-w-0 p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {insights.map((insight) => (
              <span key={insight.id} className={cn("rounded-[8px] bg-gradient-to-br px-2.5 py-1 text-xs font-semibold text-black", insight.tone)}>
                {insight.title}: {insight.value}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="inline-flex rounded-[10px] bg-base-200 p-1 justify-start">
                {leaderboardScopes.map((option) => (
                  <button key={option} type="button" onClick={() => setScope(option)} className={cn("btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none", scope === option ? "bg-primary text-primary-content" : "bg-transparent text-base-content/75")}>
                    {option}
                  </button>
                ))}
              </div>
              <div className="inline-flex rounded-[10px] bg-base-200 justify-end p-1">
                {leaderboardPeriods.map((option) => (
                  <button key={option} type="button" onClick={() => setPeriod(option)} className={cn("btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none", period === option ? "bg-primary text-primary-content" : "bg-transparent text-base-content/75")}>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-[11rem_minmax(0,1fr)]">
              <select className="select select-sm h-8 min-h-8 w-full min-w-0 rounded-[8px] border-base-300 bg-base-100 text-xs" value={skillFilter} onChange={(event) => setSkillFilter(event.target.value)}>
                {skillOptions.map((skill) => <option key={skill} value={skill}>{skill}</option>)}
              </select>
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="input input-sm h-8 min-h-8 w-full min-w-0 rounded-[8px] border-base-300 bg-base-100 text-xs" placeholder="Cari runner publik..." />
            </div>
          </div>

          <div className="mt-3 hidden min-w-0 overflow-x-auto overflow-y-hidden [overscroll-behavior-x:contain] [-webkit-overflow-scrolling:touch] md:block">
            <table className="table table-zebra table-sm min-w-[1040px] table-auto [&_th]:align-middle [&_td]:align-middle [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap">
              <thead>
                <tr>
                  <th className="font-bold">Rank</th>
                  <th className="font-bold">Runner</th>
                  <th className="font-bold">Kota</th>
                  <th className="font-bold">Skill</th>
                  <th className="font-bold">Level</th>
                  <th className="font-bold">PP</th>
                  <th className="font-bold">Completion</th>
                  <th className="font-bold">Dispute</th>
                  <th className="font-bold">Trend</th>
                  <th className="font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={`${scope}-${period}-${row.id}`} onClick={() => setSelectedRunnerId(row.id)} className={cn("cursor-pointer", selectedRunnerId === row.id && "bg-primary/10")}>
                    <td className="font-semibold">#{row.rank}</td>
                    <td className="font-semibold">{row.name}</td>
                    <td className="whitespace-normal">{row.city}</td>
                    <td className="whitespace-normal">{row.primarySkill}</td>
                    <td>
                      <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", levelTone(row.level))}>{row.level}</span>
                    </td>
                    <td>{row.ppTotal}</td>
                    <td>{row.completionRate}</td>
                    <td>{row.disputeRatio}</td>
                    <td>
                      <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", trendTone(row.trend))}>{trendLabel(row.trend)}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-xs h-7 min-h-7 rounded-[7px] border-none bg-primary text-primary-content"
                        onClick={(event) => {
                          event.stopPropagation();
                          openProfilePanel(row.id);
                        }}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 space-y-2 md:hidden">
            {filteredRows.map((row) => (
              <div key={`${scope}-${period}-${row.id}-mobile`} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <p className="text-sm font-semibold">#{row.rank} {row.name}</p>
                <p className="text-xs text-base-content/60">{row.city} | {row.primarySkill} | {row.ppTotal} PP</p>
                <button type="button" className="btn btn-sm mt-2 h-8 min-h-8 rounded-[8px] border-none bg-primary px-3 text-xs text-primary-content" onClick={() => openProfilePanel(row.id)}>View Profile</button>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="min-w-0 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Runner Snapshot</p>
          {selectedProfile ? (
            <div>
              <h2 className="mt-1 text-lg font-bold text-base-content">{selectedProfile.name}</h2>
              <p className="text-sm text-base-content/60">{selectedProfile.handle} | {selectedProfile.location}</p>
              <p className="mt-2 text-sm text-base-content/75">{selectedProfile.headline}</p>
              <div className="mt-3 flex flex-wrap gap-2">{selectedProfile.badges.map((badge) => <span key={badge} className="rounded-[999px] bg-[#DBEAFE] px-2.5 py-1 text-[11px] font-semibold text-[#1D4ED8]">{badge}</span>)}</div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-[9px] border border-base-300/70 bg-base-100 p-2.5"><p className="text-[11px] text-base-content/55">On-time</p><p className="text-sm font-bold">{selectedProfile.reliability.onTimeRate}</p></div>
                <div className="rounded-[9px] border border-base-300/70 bg-base-100 p-2.5"><p className="text-[11px] text-base-content/55">Rating</p><p className="text-sm font-bold">{selectedProfile.reliability.avgRating}</p></div>
              </div>
              <button type="button" className="btn btn-sm mt-4 h-9 min-h-9 rounded-[8px] border-none bg-primary px-4 text-xs font-semibold text-primary-content" onClick={() => openProfilePanel(selectedProfile.id)}>View Profile Deep Panel</button>
            </div>
          ) : <p className="mt-2 text-sm text-base-content/60">Runner tidak ditemukan.</p>}
        </Surface>
      </div>

      <Surface className="p-4 sm:p-5">
        <div className="h-[330px] min-h-[330px] w-full min-w-0">
          <ResponsiveContainer width="100%" height={330}>
            <LineChart data={selectedHistory} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
              <YAxis reversed domain={[maxRank + 1, 1]} allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
              <Tooltip content={<ChartTooltip />} /><Legend wrapperStyle={{ paddingTop: 10 }} />
              <Line type="monotone" dataKey="Lokal" stroke="#38BDF8" strokeWidth={3} dot={{ r: 4, fill: "#38BDF8" }} />
              <Line type="monotone" dataKey="Regional" stroke="#A046FF" strokeWidth={3} dot={{ r: 4, fill: "#A046FF" }} />
              <Line type="monotone" dataKey="Nasional" stroke="#84CC16" strokeWidth={3} dot={{ r: 4, fill: "#84CC16" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Surface>

      <Surface className="p-4 sm:p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Public Feed</p>
        <div className="grid gap-2 md:grid-cols-2">
          {leaderboardPublicFeed.map((event) => (
            <div key={event.id} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
              <div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold">{event.title}</p><span className="rounded-[8px] bg-base-200 px-2 py-0.5 text-[11px] font-semibold text-base-content/70">{event.tag}</span></div>
              <p className="mt-1 text-xs text-base-content/65">{event.note}</p><p className="mt-1 text-[11px] text-base-content/55">{event.time}</p>
            </div>
          ))}
        </div>
      </Surface>

      {isPanelOpen && panelProfile && (
        <div className="fixed inset-0 z-50 bg-black/35" onClick={closeProfilePanel}>
          <aside className="ml-auto h-full w-full max-w-[30rem] overflow-y-auto border-l border-base-300/70 bg-base-100 p-4 sm:p-5" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Runner Public Profile</p>
                <h2 className="mt-1 text-xl font-bold">{panelProfile.name}</h2>
                <p className="text-sm text-base-content/60">{panelProfile.handle} | {panelProfile.location}</p>
              </div>
              <button type="button" className="btn btn-sm h-8 min-h-8 rounded-[8px] border-base-300 bg-base-100 text-xs" onClick={closeProfilePanel}>Tutup</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-[8px] bg-base-200 px-2 py-0.5 font-semibold text-base-content/70">Scope: {scope}</span>
              <span className="rounded-[8px] bg-base-200 px-2 py-0.5 font-semibold text-base-content/70">Period: {period}</span>
              <span className="rounded-[8px] bg-base-200 px-2 py-0.5 font-semibold text-base-content/70">{panelProfile.percentile ?? "Top 20%"}</span>
            </div>
            <p className="mt-3 text-sm text-base-content/75">{panelProfile.headline}</p>
            <div className="mt-4 space-y-2">
              {panelProfile.skills.map((skill) => (
                <div key={`${panelProfile.id}-${skill.skill}`} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                  <div className="mb-1.5 flex items-center justify-between gap-2"><p className="text-xs font-semibold">{skill.skill}</p><span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", levelTone(skill.level))}>{skill.level}</span></div>
                  <div className="h-2 rounded-full bg-base-200"><div className="h-2 rounded-full bg-[#6B21FF]" style={{ width: `${skill.share}%` }} /></div>
                  <p className="mt-1 text-[11px] text-base-content/60">{skill.pp} PP | Share {skill.share}%</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {(panelProfile.recentActivities ?? []).map((activity) => (
                <div key={activity.id} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                  <div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold">{activity.title}</p><span className="rounded-[8px] bg-base-200 px-2 py-0.5 text-[11px] font-semibold text-base-content/70">{activity.tag}</span></div>
                  <p className="mt-1 text-xs text-base-content/65">{activity.note}</p><p className="mt-1 text-[11px] text-base-content/55">{activity.time}</p>
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
