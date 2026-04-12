import { useEffect, useMemo, useState } from "react";
import { cn, Surface } from "../../home.ui";
import {
  giverBriefChecklistItems,
  giverBroadcastQuests,
  giverBudgetCards,
  giverCandidates,
  giverEscrowEntries,
  giverKpiCards,
  giverPostQuestInsights,
  type GiverBroadcastQuest,
  type GiverBroadcastStatus,
  type GiverCandidate,
} from "./giver";
import { QuestEditor } from "./page/quest-editor";
import { CandidateReview } from "./page/candidate-review";

type BroadcastFilter = "ALL" | GiverBroadcastStatus;
type CandidateSort = "MATCH" | "DISTANCE" | "ETA";

function broadcastStatusClass(status: GiverBroadcastStatus) {
  if (status === "LIVE") return "bg-[#DBEAFE] text-[#1D4ED8]";
  if (status === "MATCH") return "bg-[#E9D5FF] text-[#6D28D9]";
  if (status === "WAITING_RUNNER") return "bg-[#FEF3C7] text-[#92400E]";
  return "bg-[#FECACA] text-[#991B1B]";
}

function escrowClass(state: GiverBroadcastQuest["escrowState"]) {
  if (state === "IN_PROGRESS") return "bg-[#DCFCE7] text-[#166534]";
  if (state === "PENDING_CONFIRMATION") return "bg-[#E9D5FF] text-[#6D28D9]";
  return "bg-[#DBEAFE] text-[#1D4ED8]";
}

function candidateStatusClass(status: GiverCandidate["status"]) {
  if (status === "Ready") return "bg-[#DCFCE7] text-[#166534]";
  if (status === "On Quest") return "bg-[#DBEAFE] text-[#1D4ED8]";
  return "bg-[#FEF3C7] text-[#92400E]";
}

function escrowTypeClass(type: (typeof giverEscrowEntries)[number]["type"]) {
  if (type === "RELEASED") return "bg-[#DCFCE7] text-[#166534]";
  if (type === "PENDING_RELEASE") return "bg-[#FEF3C7] text-[#92400E]";
  if (type === "LOCKED") return "bg-[#DBEAFE] text-[#1D4ED8]";
  if (type === "REFUND") return "bg-[#E9D5FF] text-[#6D28D9]";
  return "bg-[#FECACA] text-[#991B1B]";
}

function formatCountdown(seconds: number) {
  const safe = Math.max(0, seconds);
  const minute = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const second = Math.floor(safe % 60)
    .toString()
    .padStart(2, "0");
  return `${minute}:${second}`;
}

function resolveRadiusRuntime(quest: GiverBroadcastQuest, tickSeconds: number) {
  const elapsed = quest.elapsedSeedSeconds + tickSeconds;
  const expansionStep = Math.floor(elapsed / 300);
  const currentRadius = Math.min(quest.baseRadiusKm + expansionStep, quest.maxRadiusKm);
  const maxReached = currentRadius >= quest.maxRadiusKm;
  const modulo = elapsed % 300;
  const nextExpandIn = maxReached ? 0 : modulo === 0 ? 300 : 300 - modulo;
  const nextRadius = Math.min(currentRadius + 1, quest.maxRadiusKm);

  return {
    currentRadius,
    nextRadius,
    nextExpandIn,
    maxReached,
  };
}

type GiverSubView =
  | { view: "QuestEditor" }
  | { view: "CandidateReview"; payload: { id: string } };

const GIVER_SUBVIEW_STORAGE_KEY = "nvrs-qqm-giver-subview-v1";

function resolveInitialSubView(): GiverSubView | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(GIVER_SUBVIEW_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GiverSubView;
  } catch {
    return null;
  }
}

function PartyLobbyWidget({ slotFilled, slotTotal, status, candidates }: { slotFilled: number; slotTotal: number; status: GiverBroadcastStatus; candidates: number }) {
  const slots = Array.from({ length: slotTotal }, (_, i) => i < slotFilled);
  const canStart = slotFilled >= slotTotal;
  
  return (
    <div className="mt-3 rounded-[9px] border border-[#A046FF]/30 bg-gradient-to-br from-[#A046FF]/5 to-transparent p-3 ring-1 ring-inset ring-white/10 shadow-inner">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="flex size-4 items-center justify-center rounded-full bg-[#A046FF] text-[8px] text-white shadow-sm shadow-[#A046FF]/40">🎉</span>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#A046FF]">Party Lobby</p>
        </div>
        <span className="rounded-full bg-base-100 px-2 py-0.5 text-[10px] font-bold text-base-content/70 shadow-sm">{slotFilled}/{slotTotal} Ready</span>
      </div>
      
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {slots.map((filled, i) => (
          <div key={i} className="relative transition-all hover:-translate-y-0.5">
             {filled ? (
               <div className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#A046FF] to-[#38BDF8] text-white shadow-md ring-2 ring-base-100 animate-in zoom-in duration-300">
                 <span className="text-xs font-bold">R{i + 1}</span>
                 {i === slotFilled - 1 && status === "LIVE" && (
                   <span className="absolute -top-1 -right-1 flex size-3">
                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                     <span className="relative inline-flex size-3 rounded-full bg-success ring-1 ring-white"></span>
                   </span>
                 )}
               </div>
             ) : (
               <div className="flex size-9 sm:size-10 items-center justify-center rounded-full border border-dashed border-base-300 bg-base-100/50 text-base-content/20">
                 +
               </div>
             )}
          </div>
        ))}
      </div>
      
      {canStart ? (
        <button type="button" className="btn btn-sm mt-4 h-9 min-h-9 w-full rounded-[8px] border-none bg-gradient-to-r from-[#A046FF] to-[#38BDF8] px-4 font-bold text-white shadow-lg shadow-[#A046FF]/20 hover:opacity-90">🚀 Start Group Quest</button>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-base-300/50 pt-2">
          <p className="text-[10px] font-medium text-base-content/50">Tunggu slot penuh. Estimasi {candidates} kandidat aktif di area.</p>
          <button type="button" className="btn btn-xs rounded bg-base-200 text-[10px] text-base-content/70 hover:bg-base-300 border-none shadow-none">Force Start</button>
        </div>
      )}
    </div>
  );
}

function GiverComponent() {
  const [tickSeconds, setTickSeconds] = useState(0);
  const [broadcastFilter, setBroadcastFilter] = useState<BroadcastFilter>("ALL");
  const [candidateSort, setCandidateSort] = useState<CandidateSort>("MATCH");
  const [briefState, setBriefState] = useState<Record<string, boolean>>(() =>
    giverBriefChecklistItems.reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: item.defaultChecked,
      }),
      {} as Record<string, boolean>
    )
  );
  const [subView, setSubView] = useState<GiverSubView | null>(resolveInitialSubView);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTickSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (subView) {
      window.localStorage.setItem(GIVER_SUBVIEW_STORAGE_KEY, JSON.stringify(subView));
    } else {
      window.localStorage.removeItem(GIVER_SUBVIEW_STORAGE_KEY);
    }
  }, [subView]);

  if (subView?.view === "QuestEditor") {
    return <QuestEditor onBack={() => setSubView(null)} />;
  }
  if (subView?.view === "CandidateReview") {
    return <CandidateReview candidateId={subView.payload.id} onBack={() => setSubView(null)} />;
  }

  const filteredBroadcasts = useMemo(() => {
    if (broadcastFilter === "ALL") return giverBroadcastQuests;
    return giverBroadcastQuests.filter((item) => item.status === broadcastFilter);
  }, [broadcastFilter]);

  const sortedCandidates = useMemo(() => {
    const base = [...giverCandidates];
    if (candidateSort === "MATCH") {
      return base.sort((left, right) => right.matchScore - left.matchScore);
    }
    if (candidateSort === "DISTANCE") {
      return base.sort((left, right) => left.distanceKm - right.distanceKm);
    }
    return base.sort((left, right) => left.etaMinutes - right.etaMinutes);
  }, [candidateSort]);

  const totalBriefWeight = useMemo(() => giverBriefChecklistItems.reduce((sum, item) => sum + item.weight, 0), []);
  const achievedWeight = useMemo(
    () => giverBriefChecklistItems.reduce((sum, item) => (briefState[item.id] ? sum + item.weight : sum), 0),
    [briefState]
  );
  const briefScore = Math.round((achievedWeight / totalBriefWeight) * 100);
  const missingRequired = giverBriefChecklistItems.filter((item) => item.required && !briefState[item.id]);
  const isBriefReady = briefScore >= 85 && missingRequired.length === 0;

  function toggleBriefItem(itemId: string) {
    setBriefState((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }

  return (
    <div className="min-w-0 space-y-4">
      <Surface className="p-4 sm:p-5 flex flex-col gap-3 sm:flex-row justify-between items-start sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
             <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/45">Giver Command Center</p>
             <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-[10px] font-semibold text-base-content/70 hidden sm:inline-block">QQM Mode • Dummy Data</span>
          </div>
          <h1 className="mt-1.5 text-xl font-bold text-base-content sm:text-2xl">Buat Quest, Broadcast Cerdas, dan Kelola Escrow</h1>
        </div>
        <button type="button" onClick={() => setSubView({ view: "QuestEditor" })} className="btn h-10 w-full sm:w-auto px-6 rounded-[10px] bg-[#6B21FF] hover:bg-[#6B21FF]/90 text-white border-none font-bold shadow-lg shadow-[#6B21FF]/30 transition-transform active:scale-95 text-sm">
           + Buat Quest Baru
        </button>
      </Surface>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {giverKpiCards.map((item) => (
          <Surface key={item.label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content/55">{item.label}</p>
            <p className="mt-2 text-xl font-bold text-base-content">{item.value}</p>
            <span className={cn("mt-2 inline-flex rounded-[8px] px-2.5 py-1 text-[11px] font-semibold text-black", item.tone)}>{item.hint}</span>
          </Surface>
        ))}
      </div>

      <Surface className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Broadcast Monitor</p>
            <h2 className="mt-1 text-lg font-bold text-base-content">Status Quest Live, Slot, Countdown, Auto-Expand Radius Tiap 5 Menit</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["ALL", "LIVE", "MATCH", "WAITING_RUNNER", "FROZEN"] as BroadcastFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setBroadcastFilter(filter)}
                className={cn(
                  "btn h-8 min-h-8 rounded-[999px] border-none px-3 text-xs shadow-none",
                  broadcastFilter === filter ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/75 hover:bg-base-300"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          {filteredBroadcasts.map((quest) => {
            const slotProgress = Math.round((quest.slotFilled / quest.slotTotal) * 100);
            const runtime = resolveRadiusRuntime(quest, tickSeconds);
            return (
              <div key={quest.id} className="rounded-[12px] border border-base-300/70 bg-base-100 p-3.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-base-content/55">{quest.id}</p>
                    <h3 className="text-base font-bold text-base-content">{quest.title}</h3>
                    <p className="text-xs text-base-content/65">{quest.location} • {quest.mode} • {quest.skillTag}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", broadcastStatusClass(quest.status))}>{quest.status}</span>
                    <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", escrowClass(quest.escrowState))}>{quest.escrowState}</span>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">Wage Band</p>
                    <p className="text-sm font-bold text-base-content">{quest.wageBand}</p>
                  </div>
                  <div className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">Deadline</p>
                    <p className="text-sm font-bold text-base-content">{quest.deadline}</p>
                  </div>
                </div>

                {quest.slotTotal > 1 ? (
                  <PartyLobbyWidget slotFilled={quest.slotFilled} slotTotal={quest.slotTotal} status={quest.status} candidates={quest.estimatedCandidates} />
                ) : (
                  <div className="mt-3 rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2.5">
                    <div className="mb-1.5 flex items-center justify-between gap-2 text-xs font-semibold">
                      <span className="text-base-content/70">Slot Terisi {quest.slotFilled}/{quest.slotTotal}</span>
                      <span className="text-base-content">{slotProgress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-base-200">
                      <div className="h-2 rounded-full bg-[#6B21FF]" style={{ width: `${slotProgress}%` }} />
                    </div>
                    <p className="mt-1.5 text-[11px] text-base-content/65">Estimasi kandidat aktif: {quest.estimatedCandidates} runner</p>
                  </div>
                )}

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">Radius Aktif</p>
                    <p className="text-sm font-bold text-base-content">{runtime.currentRadius} km</p>
                  </div>
                  <div className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">Next Radius</p>
                    <p className="text-sm font-bold text-base-content">{runtime.nextRadius} km</p>
                  </div>
                  <div className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">Auto Expand</p>
                    <p className="text-sm font-bold text-base-content">
                      {runtime.maxReached ? "Max Radius" : formatCountdown(runtime.nextExpandIn)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Surface>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Candidate Pool</p>
              <h2 className="mt-1 text-lg font-bold text-base-content">Top Runner Terdekat + Skill Match + Reliability Badge</h2>
            </div>
            <div className="inline-flex rounded-[10px] bg-base-200 p-1">
              {(["MATCH", "DISTANCE", "ETA"] as CandidateSort[]).map((sort) => (
                <button
                  key={sort}
                  type="button"
                  onClick={() => setCandidateSort(sort)}
                  className={cn(
                    "btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none",
                    candidateSort === sort ? "bg-primary text-primary-content" : "bg-transparent text-base-content/75 hover:bg-base-100"
                  )}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {sortedCandidates.map((candidate) => (
              <div key={candidate.id} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{candidate.name}</p>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", candidateStatusClass(candidate.status))}>{candidate.status}</span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">{candidate.skill}</p>
                <div className="mt-2 grid grid-cols-3 gap-1.5 text-[11px]">
                  <span className="rounded-[8px] bg-base-200 px-2 py-1 text-center font-semibold text-base-content/70">{candidate.distanceKm} km</span>
                  <span className="rounded-[8px] bg-base-200 px-2 py-1 text-center font-semibold text-base-content/70">{candidate.etaMinutes}m ETA</span>
                  <span className="rounded-[8px] bg-base-200 px-2 py-1 text-center font-semibold text-base-content/70">{candidate.matchScore}% match</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-base-200">
                  <div className="h-2 rounded-full bg-[#2563EB]" style={{ width: `${candidate.matchScore}%` }} />
                </div>
                <p className="mt-1.5 text-[11px] text-base-content/65">Completion {candidate.completionRate} • Dispute {candidate.disputeRatio}</p>
                <div className="mt-3 border-t border-base-200 pt-3 flex items-center justify-between">
                   <span className="inline-flex rounded-[8px] bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-bold text-[#0369A1]">{candidate.reliabilityBadge}</span>
                   <button type="button" onClick={() => setSubView({ view: "CandidateReview", payload: { id: candidate.id } })} className="btn btn-xs rounded bg-base-200 text-[10px] font-bold text-base-content/80 hover:bg-base-300 border-none shadow-none">
                     Review Data
                   </button>
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Budget & Escrow</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Alokasi Budget, Fee, Pending Release, Refund/Dispute</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {giverBudgetCards.map((item) => (
              <div key={item.label} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-base-content">{item.value}</p>
                <span className={cn("mt-2 inline-flex rounded-[8px] px-2 py-0.5 text-[11px] font-semibold text-black", item.tone)}>{item.hint}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            {giverEscrowEntries.map((entry) => (
              <div key={entry.id} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{entry.questId}</p>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", escrowTypeClass(entry.type))}>{entry.type}</span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">{entry.note}</p>
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="font-bold text-base-content">{entry.amount}</span>
                  <span className="font-medium text-base-content/60">{entry.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Brief Quality Score</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Checklist Brief Siap Publish</h2>
          <div className="mt-3 rounded-[10px] border border-base-300/70 bg-base-100 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-base-content">Skor Kualitas Brief</p>
              <span className={cn("rounded-[8px] px-2 py-0.5 text-xs font-bold", isBriefReady ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEF3C7] text-[#92400E]")}>
                {briefScore}%
              </span>
            </div>
            <div className="mt-2 h-2.5 rounded-full bg-base-200">
              <div className={cn("h-2.5 rounded-full", isBriefReady ? "bg-[#16A34A]" : "bg-[#D97706]")} style={{ width: `${briefScore}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-base-content/65">
              {isBriefReady ? "Brief siap dibroadcast ke runner." : "Masih ada item penting yang perlu dilengkapi sebelum publish."}
            </p>
          </div>

          <div className="mt-3 space-y-2">
            {giverBriefChecklistItems.map((item) => (
              <label key={item.id} className="flex items-start gap-3 rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm mt-0.5"
                  checked={briefState[item.id]}
                  onChange={() => toggleBriefItem(item.id)}
                />
                <div>
                  <p className="text-sm font-semibold text-base-content">
                    {item.label}{" "}
                    {item.required ? (
                      <span className="rounded-[6px] bg-[#FEE2E2] px-1.5 py-0.5 text-[10px] font-bold text-[#991B1B]">Required</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-base-content/65">{item.description}</p>
                  <p className="mt-1 text-[11px] font-semibold text-base-content/55">Weight {item.weight}%</p>
                </div>
              </label>
            ))}
          </div>

          {missingRequired.length ? (
            <div className="mt-3 rounded-[10px] border border-[#FCA5A5] bg-[#FFF1F2] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#991B1B]">Required Missing</p>
              <p className="mt-1 text-sm text-[#7F1D1D]">{missingRequired.map((item) => item.label).join(", ")}</p>
            </div>
          ) : null}
        </Surface>

        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">Post-Quest Insight</p>
          <h2 className="mt-1 text-lg font-bold text-base-content">Rekomendasi Upah/Radius dari Histori Conversion</h2>
          <div className="mt-3 space-y-2.5">
            {giverPostQuestInsights.map((insight) => (
              <div key={insight.id} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-content">{insight.title}</p>
                  <span className={cn("rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", insight.tone)}>{insight.impact}</span>
                </div>
                <p className="mt-1 text-xs text-base-content/65">{insight.recommendation}</p>
                <p className="mt-1.5 text-[11px] font-semibold text-base-content/55">Confidence {insight.confidence}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}

export default GiverComponent;
