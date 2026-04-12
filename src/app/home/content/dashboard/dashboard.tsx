import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpIcon, DollarIcon, LiveIcon, StarIcon, TagIcon } from "../../home.icons";
import { cn, Surface } from "../../home.ui";
import {
  dashboardActivityItems,
  dashboardCarouselItems,
  dashboardGeoScopeItems,
  dashboardImpactCounterItems,
  dashboardLeaderboardGroups,
  dashboardQuickFilterMenus,
  dashboardSnapshotItems,
  dashboardStatusHelpItems,
  liveQuestItems,
  type DashboardFilterKey,
  type DashboardLeaderboardScope,
  type DashboardQuestItem,
  type DashboardQuickFilterMenu,
} from "./dashboard";
import { QuestDetail } from "./page/quest-detail";

const DASHBOARD_FILTER_STORAGE_KEY = "nvrs-qqm-dashboard-live-filters-v1";
const DASHBOARD_SUBVIEW_STORAGE_KEY = "nvrs-qqm-dashboard-subview-v1";
const PP_FORMULA_TOOLTIP = "PP = (Rating x Difficulty x Value) x TimeDecay";
const ESCROW_FLOW: DashboardQuestItem["escrowState"][] = ["UNPAID", "LOCKED", "IN_PROGRESS", "PENDING_CONFIRMATION", "RELEASED"];

type DashboardLiveFilterState = Record<DashboardFilterKey, string>;

function createDefaultLiveFilters(menus: DashboardQuickFilterMenu[]): DashboardLiveFilterState {
  return menus.reduce(
    (acc, menu) => ({
      ...acc,
      [menu.key]: menu.options[0]?.value ?? "ALL",
    }),
    {} as DashboardLiveFilterState
  );
}

function resolveInitialLiveFilters(menus: DashboardQuickFilterMenu[]): DashboardLiveFilterState {
  const defaults = createDefaultLiveFilters(menus);
  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const raw = window.localStorage.getItem(DASHBOARD_FILTER_STORAGE_KEY);
    if (!raw) {
      return defaults;
    }

    const parsed = JSON.parse(raw) as Partial<DashboardLiveFilterState>;
    const normalized = { ...defaults };
    for (const menu of menus) {
      const candidate = parsed[menu.key];
      const isValid = menu.options.some((option) => option.value === candidate);
      if (typeof candidate === "string" && isValid) {
        normalized[menu.key] = candidate;
      }
    }
    return normalized;
  } catch {
    return defaults;
  }
}

type DashboardSubView = {
  view: "QuestDetail";
  payload: { id: string };
};

function resolveInitialSubView(): DashboardSubView | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DASHBOARD_SUBVIEW_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DashboardSubView;
  } catch {
    return null;
  }
}

function questStatusClass(status: DashboardQuestItem["status"]) {
  if (status === "LIVE") {
    return "bg-[#FEE2E2] text-[#B91C1C]";
  }
  if (status === "MATCH") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  return "bg-[#DCFCE7] text-[#166534]";
}

function skillMatchTone(score: number) {
  if (score >= 90) {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  if (score >= 80) {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  return "bg-[#FEF3C7] text-[#92400E]";
}

function MetricPill({ icon, children, className = "" }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-6 items-center justify-center">{icon}</div>
      <span className={cn("inline-flex rounded-[8px] px-3 py-1 text-xs font-bold text-black sm:text-sm", className)}>{children}</span>
    </div>
  );
}

function TrustSignal({ label, value, toneClass }: { label: string; value: string; toneClass: string }) {
  return (
    <div className="rounded-[8px] border border-base-300/70 bg-base-100 px-2.5 py-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">{label}</p>
      <p className={cn("text-xs font-bold sm:text-sm", toneClass)}>{value}</p>
    </div>
  );
}

function EscrowTracker({ state }: { state: DashboardQuestItem["escrowState"] }) {
  const activeIndex = ESCROW_FLOW.indexOf(state);
  return (
    <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-base-content/55">Escrow State</p>
      <div className="mt-2 grid gap-1 sm:grid-cols-5">
        {ESCROW_FLOW.map((step, index) => {
          const isDone = activeIndex > index;
          const isActive = activeIndex === index;
          return (
            <div key={step} className={cn("rounded-[7px] px-1.5 py-1 text-center text-[10px] font-semibold tracking-[0.05em]", isDone && "bg-[#DCFCE7] text-[#166534]", isActive && "bg-[#DBEAFE] text-[#1D4ED8]", !isDone && !isActive && "bg-base-200 text-base-content/55")}>
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RadarMapWidget({ activeGeoScope }: { activeGeoScope: any }) {
  const [radius, setRadius] = useState(1);
  
  useEffect(() => {
    // Simulator radar expand 1km -> 2km
    const timer = window.setInterval(() => {
      setRadius((prev) => (prev === 1 ? 2 : 1));
    }, 3500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-[12px] border border-base-300/70 bg-base-100 p-3.5 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
           <p className="text-xs font-semibold uppercase tracking-[0.12em] text-base-content/50">Live Sonar Mapping</p>
           <p className="text-sm font-bold text-base-content">Radius Aktif: {radius} km</p>
        </div>
        <div className="flex items-center gap-2">
          {activeGeoScope.hotZones.map((zone: string) => (
             <span key={zone} className="rounded-[8px] bg-error/10 px-2 py-0.5 text-[10px] font-bold text-error ring-1 ring-error/20 shadow-sm">{zone} 🔥</span>
          ))}
          <span className="rounded-[999px] bg-base-200 px-2.5 py-1 text-[11px] font-semibold text-base-content/75">{activeGeoScope.avgEta}</span>
        </div>
      </div>
      
      <div className="relative mt-2 flex h-56 sm:h-72 w-full items-center justify-center overflow-hidden rounded-[12px] border border-[#38BDF8]/20 bg-[#0F172A] shadow-inner">
         {/* Grid Background */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
         <div className="absolute inset-0 opacity-40 bg-gradient-to-t from-[#0F172A] to-transparent" />
         
         {/* Legend */}
         <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-1.5 rounded-[8px] bg-[#0F172A]/80 border border-slate-700 p-2 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
               <div className="size-2 rounded-full bg-white" />
               <span className="text-[9px] font-semibold text-slate-300">Target Lokasi (Giver)</span>
            </div>
            <div className="flex items-center gap-1.5">
               <div className="size-2 rounded-full bg-[#10B981] shadow-[0_0_5px_#10B981]" />
               <span className="text-[9px] font-semibold text-slate-300">Top Runner (1km)</span>
            </div>
            <div className="flex items-center gap-1.5">
               <div className="size-2 rounded-full bg-[#F59E0B] shadow-[0_0_5px_#F59E0B]" />
               <span className="text-[9px] font-semibold text-slate-300">Backup Runner (2km)</span>
            </div>
         </div>

         {/* Radar Engine */}
         <div className="relative flex items-center justify-center">
           {/* Center Node */}
           <div className="relative z-10 flex size-5 items-center justify-center rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)]">
             <div className="size-2 rounded-full bg-primary" />
           </div>

           {/* 1 KM Pulse */}
           <div className={cn("absolute flex items-center justify-center rounded-full border border-[#A046FF] transition-all duration-1000 ease-in-out", radius >= 1 ? "size-32 bg-[#A046FF]/10 ring-4 ring-[#A046FF]/20" : "size-0 opacity-0")}>
             {radius === 1 && <div className="absolute inset-0 animate-ping rounded-full bg-[#A046FF]/50" style={{ animationDuration: '2s' }} />}
           </div>

           {/* 2 KM Pulse */}
           <div className={cn("absolute flex items-center justify-center rounded-full border border-[#38BDF8] transition-all duration-1000 ease-in-out", radius >= 2 ? "size-52 sm:size-64 bg-[#38BDF8]/10 ring-4 ring-[#38BDF8]/10" : "size-32 opacity-0")}>
             {radius === 2 && <div className="absolute inset-0 animate-ping rounded-full bg-[#38BDF8]/40" style={{ animationDuration: '3s' }} />}
           </div>
           
           {/* Mapped Entities */}
           <div className="absolute -top-8 left-10 size-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] transition-opacity duration-[1500ms]" style={{ opacity: radius >= 1 ? 1 : 0 }} />
           <div className="absolute bottom-6 right-10 size-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] transition-opacity duration-[1500ms] delay-300" style={{ opacity: radius >= 1 ? 1 : 0 }} />
           <div className="absolute top-4 -left-12 size-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] transition-opacity duration-[1500ms] delay-150" style={{ opacity: radius >= 1 ? 1 : 0 }} />
           
           <div className="absolute -top-20 -left-16 size-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B] transition-opacity duration-[1500ms]" style={{ opacity: radius >= 2 ? 1 : 0 }} />
           <div className="absolute bottom-24 -right-24 size-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B] transition-opacity duration-[1500ms] delay-300" style={{ opacity: radius >= 2 ? 1 : 0 }} />
           <div className="absolute -bottom-16 left-8 size-2.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] transition-opacity duration-[1500ms] delay-500" style={{ opacity: radius >= 2 ? 1 : 0 }} />
         </div>
      </div>
      
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">Estimasi Kandidat</p>
          <div className="mt-1 flex items-baseline gap-2">
             <p className="text-xl font-bold text-base-content">{activeGeoScope.estimatedRunners}</p>
             <span className="text-xs font-semibold text-[#10B981]">Runner valid siap meluncur</span>
          </div>
        </div>
        <div className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">Runner Status</p>
          <div className="mt-1 flex items-baseline gap-2">
             <p className="text-xl font-bold text-base-content">{activeGeoScope.activeRunners}</p>
             <span className="text-xs font-semibold text-[#6B21FF]">Aktif dalam radius ini</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestCard({ quest, featured = false, onDetailClick }: { quest: DashboardQuestItem; featured?: boolean; onDetailClick?: () => void }) {
  const slotProgress = Math.round((quest.slotFilled / quest.slotTotal) * 100);

  return (
    <Surface className={cn(featured ? "p-5 sm:p-7" : "p-4 sm:p-5")}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className={cn("inline-flex rounded-[999px] px-3 py-1 text-[11px] font-bold tracking-[0.12em]", questStatusClass(quest.status))}>{quest.status}</span>
        <div className="flex items-center gap-2">
          <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/75">{quest.distanceKm.toFixed(1)} km</span>
          <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/75">{quest.countdown}</span>
          <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/75">Slot {quest.slots}</span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className={cn("font-bold text-base-content", featured ? "text-[clamp(1.6rem,3vw,2.25rem)]" : "text-lg sm:text-2xl")}>{quest.title}</h3>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-right">
            <p className={cn("font-bold text-base-content", featured ? "text-xl sm:text-2xl" : "text-sm sm:text-lg")}>{quest.owner}</p>
            <p className={cn("font-medium text-base-content/50", featured ? "text-sm sm:text-lg" : "text-xs sm:text-sm")}>{quest.role}</p>
          </div>
          <div className={cn("shrink-0 rounded-[10px] bg-base-300", featured ? "size-16 sm:size-[75px]" : "size-12 sm:size-14")} />
        </div>
      </div>

      <div className={cn("mt-5 grid gap-3", featured ? "max-w-xl" : "mt-4")}>
        <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-2.5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-[999px] bg-base-200 px-2.5 py-1 text-[11px] font-semibold text-base-content/75">{quest.mode}</span>
            <span className={cn("rounded-[999px] px-2.5 py-1 text-[11px] font-semibold", skillMatchTone(quest.skillMatchScore))}>{quest.skillMatchScore}% cocok</span>
          </div>
          <div className="h-2 rounded-full bg-base-200">
            <div className="h-2 rounded-full bg-[#6B21FF]" style={{ width: `${slotProgress}%` }} />
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-base-content/65">Tipe Quest: {quest.mode} | Slot terisi {quest.slotFilled}/{quest.slotTotal}</p>
        </div>

        <EscrowTracker state={quest.escrowState} />

        <div className="flex items-center gap-3 text-sm font-semibold text-base-content/80 sm:text-lg">
          <TagIcon className="size-5 text-[#FF27C8] sm:size-6" />
          <span>{quest.category}</span>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-3">
          <TrustSignal label="Verified Giver" value={quest.verifiedGiver ? "Verified" : "Unverified"} toneClass={quest.verifiedGiver ? "text-[#166534]" : "text-[#B91C1C]"} />
          <TrustSignal label="Completion" value={quest.completionRate} toneClass="text-[#1D4ED8]" />
          <TrustSignal label="Dispute Ratio" value={quest.disputeRatio} toneClass="text-[#9D174D]" />
        </div>

        <div className="flex items-center gap-2">
          <div className="tooltip tooltip-bottom" data-tip={PP_FORMULA_TOOLTIP}>
            <span className="inline-flex cursor-help rounded-[8px] bg-base-200 px-2.5 py-1 text-[11px] font-semibold text-base-content/70">Rumus PP</span>
          </div>
          <span className="text-xs font-semibold text-base-content/65">Delta {quest.ppDelta}</span>
        </div>

        <MetricPill icon={<ArrowUpIcon className="size-5 text-[#6B21FF] sm:size-6" />} className="bg-[#8B5CF6]/75">
          {quest.points}
        </MetricPill>

        <MetricPill icon={<DollarIcon className="size-5 text-[#00B6E7] sm:size-6" />} className="bg-[#8DFF2F]">
          {quest.reward}
        </MetricPill>

        <MetricPill icon={<StarIcon className="size-5 text-[#FF9800] sm:size-6" />} className="bg-[#C7FF8B]">
          {quest.score}
        </MetricPill>
      </div>

      <div className={cn("mt-6 flex justify-end", featured ? "sm:mt-8" : "mt-5")}>
        <button type="button" onClick={onDetailClick} className={cn("btn border-none bg-primary text-primary-content shadow-none hover:opacity-90", featured ? "h-12 min-h-12 rounded-[8px] px-10 text-lg" : "h-10 min-h-10 rounded-[8px] px-6 text-sm sm:h-11 sm:min-h-11")}>
          Detail
        </button>
      </div>
    </Surface>
  );
}

function DashboardComponent() {
  const [liveFilters, setLiveFilters] = useState<DashboardLiveFilterState>(() => resolveInitialLiveFilters(dashboardQuickFilterMenus));
  const [leaderboardScope, setLeaderboardScope] = useState<DashboardLeaderboardScope>("Lokal");
  const [subView, setSubView] = useState<DashboardSubView | null>(resolveInitialSubView);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(DASHBOARD_FILTER_STORAGE_KEY, JSON.stringify(liveFilters));
  }, [liveFilters]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (subView) {
      window.localStorage.setItem(DASHBOARD_SUBVIEW_STORAGE_KEY, JSON.stringify(subView));
    } else {
      window.localStorage.removeItem(DASHBOARD_SUBVIEW_STORAGE_KEY);
    }
  }, [subView]);

  if (subView?.view === "QuestDetail") {
    return <QuestDetail questId={subView.payload.id} onBack={() => setSubView(null)} />;
  }

  const dashboardKpis = [
    { label: "Quest Aktif", value: "24", hint: "7 prioritas", tone: "bg-[#DBEAFE]" },
    { label: "Runner Online", value: "12", hint: "3 standby", tone: "bg-[#DCFCE7]" },
    { label: "Avg Response", value: "14m", hint: "-3m minggu ini", tone: "bg-[#FCE7F3]" },
    { label: "Issue Open", value: "5", hint: "2 baru hari ini", tone: "bg-[#FEE2E2]" },
  ];

  const filteredQuestItems = liveQuestItems.filter((quest) => {
    if (liveFilters.status !== "ALL" && quest.status !== liveFilters.status) {
      return false;
    }
    if (liveFilters.radius === "LT_2" && quest.distanceKm >= 2) {
      return false;
    }
    if (liveFilters.radius === "GTE_2" && quest.distanceKm < 2) {
      return false;
    }
    if (liveFilters.upah !== "ALL" && quest.wageBand !== liveFilters.upah) {
      return false;
    }
    if (liveFilters.skill !== "ALL" && quest.skill !== liveFilters.skill) {
      return false;
    }
    if (liveFilters.mode !== "ALL" && quest.mode !== liveFilters.mode) {
      return false;
    }
    return true;
  });

  const activeLeaderboardGroup = dashboardLeaderboardGroups.find((group) => group.scope === leaderboardScope) ?? dashboardLeaderboardGroups[0];
  const activeGeoScope = dashboardGeoScopeItems.find((item) => item.radiusValue === liveFilters.radius) ?? dashboardGeoScopeItems[0];
  const isQuestEmpty = filteredQuestItems.length === 0;
  const isQuestSparse = filteredQuestItems.length <= 1;

  function rotateFilter(key: DashboardFilterKey) {
    setLiveFilters((prev) => {
      const menu = dashboardQuickFilterMenus.find((entry) => entry.key === key);
      if (!menu) {
        return prev;
      }
      const currentIndex = menu.options.findIndex((option) => option.value === prev[key]);
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % menu.options.length;
      return {
        ...prev,
        [key]: menu.options[nextIndex].value,
      };
    });
  }

  function resetLowVolumeFilters() {
    setLiveFilters((prev) => ({
      ...prev,
      radius: "ALL",
      skill: "ALL",
      mode: "ALL",
    }));
  }

  return (
    <div className="flex flex-col gap-4">
      <Surface className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/50">Quick Quest Model</p>
            <h1 className="mt-2 text-2xl font-bold text-base-content sm:text-[2rem]">Kompetisi Kontribusi Nyata, Bukan Sekadar Aktivitas</h1>
            <p className="mt-2 text-sm text-base-content/70 sm:text-base">
              QQM mengubah pola tolong-menolong jadi pasar micro-task yang aman, cepat, dan merit-based lewat status live, trust score, dan progress yang transparan.
            </p>
          </div>
        </div>
        <div className="mt-2 inline-flex gap-1 rounded-[10px] bg-base-200 p-1 sm:mt-4">
          <button type="button" className="btn h-9 min-h-9 rounded-[8px] border-none bg-primary px-4 text-xs text-primary-content shadow-none sm:text-sm">
            Mode Runner
          </button>
          <button type="button" className="btn h-9 min-h-9 rounded-[8px] border-none bg-transparent px-4 text-xs text-base-content/70 shadow-none hover:bg-base-100 sm:text-sm">
            Mode Giver
          </button>
        </div>
      </Surface>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardKpis.map((kpi) => (
          <Surface key={kpi.label} className="p-5">
            <p className="text-sm font-semibold text-base-content/55">{kpi.label}</p>
            <p className="mt-2 text-[1.8rem] font-bold leading-tight text-base-content">{kpi.value}</p>
            <span className={cn("mt-3 inline-flex rounded-[8px] px-3 py-1 text-xs font-semibold text-black", kpi.tone)}>{kpi.hint}</span>
          </Surface>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface className="p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">Impact Counter</p>
          <h2 className="mt-1 text-lg font-bold text-base-content sm:text-xl">Dampak Ekosistem Mingguan</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboardImpactCounterItems.map((item) => (
              <div key={item.label} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <p className="text-xs font-semibold text-base-content/55">{item.label}</p>
                <p className="mt-1 text-xl font-bold text-base-content">{item.value}</p>
                <span className={cn("mt-2 inline-flex rounded-[8px] px-2 py-0.5 text-[11px] font-semibold text-black", item.toneClass)}>{item.hint}</span>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">Leaderboard</p>
              <h2 className="mt-1 text-lg font-bold text-base-content sm:text-xl">Scope Rank</h2>
            </div>
            <div className="inline-flex rounded-[10px] bg-base-200 p-1">
              {(["Lokal", "Provinsi", "Nasional"] as DashboardLeaderboardScope[]).map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => setLeaderboardScope(scope)}
                  className={cn(
                    "btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none",
                    leaderboardScope === scope ? "bg-primary text-primary-content" : "bg-transparent text-base-content/75 hover:bg-base-100"
                  )}
                >
                  {scope}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2.5">
            {activeLeaderboardGroup.items.map((entry) => (
              <div key={`${activeLeaderboardGroup.scope}-${entry.rank}-${entry.name}`} className="flex items-center justify-between rounded-[10px] border border-base-300/70 bg-base-100 px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-base-200 text-xs font-bold text-base-content/80">{entry.rank}</span>
                  <p className="text-sm font-semibold text-base-content">{entry.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-base-content">{entry.pp} PP</p>
                  <p className="text-xs font-semibold text-[#166534]">{entry.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <Surface className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">Today Snapshot</p>
            <h2 className="mt-1 text-lg font-bold text-base-content sm:text-xl">Ringkasan Performa Hari Ini</h2>
          </div>
          <button type="button" className="btn h-9 min-h-9 rounded-[8px] border-base-300 bg-base-100 px-4 text-xs text-base-content shadow-none hover:bg-base-200 sm:text-sm">
            Lihat Detail
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardSnapshotItems.map((item) => (
            <div key={item.label} className="rounded-[12px] border border-base-300/70 bg-base-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-base-content/50">{item.label}</p>
              <p className="mt-2 text-2xl font-bold leading-tight text-base-content">{item.value}</p>
              <span className={cn("mt-2 inline-flex rounded-[8px] px-2.5 py-1 text-xs font-semibold text-black", item.toneClass)}>{item.hint}</span>
            </div>
          ))}
        </div>
      </Surface>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Surface className="overflow-hidden p-3 sm:p-4">
          <div className="carousel w-full gap-3 overflow-x-auto rounded-[12px]">
            {dashboardCarouselItems.map((item, index) => (
              <div
                key={item.title}
                className={cn(
                  "carousel-item relative overflow-hidden rounded-[12px] border border-base-100/60",
                  index === 0 ? "h-44 w-[84%] sm:h-56 md:w-[72%] lg:h-72 xl:h-[392px] xl:w-[64%]" : "h-44 w-[56%] sm:h-56 md:w-[46%] lg:h-72 xl:h-[392px] xl:w-[36%]"
                )}
              >
                <div className={cn("relative flex h-full w-full flex-col justify-between bg-gradient-to-br p-5 sm:p-7", item.accent)}>
                  <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-base-100/60 blur-2xl sm:size-40" />
                  <div className="pointer-events-none absolute bottom-0 right-0 h-28 w-28 rounded-tl-[42px] bg-base-content/5 sm:h-40 sm:w-40" />
                  <div className="max-w-[20rem]">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-base-content/50 sm:text-sm">Carousel</p>
                    <h2 className="text-xl font-bold text-base-content sm:text-3xl">{item.title}</h2>
                  </div>
                  <p className="max-w-[18rem] text-sm font-medium leading-relaxed text-base-content/70 sm:max-w-[22rem] sm:text-base">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {dashboardCarouselItems.map((item, index) => (
              <span key={item.title} className={cn("h-2.5 w-2.5 rounded-full", index === 0 ? "bg-base-content" : "bg-base-100")} />
            ))}
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">Recent Activity</p>
            <h2 className="mt-1 text-lg font-bold text-base-content sm:text-xl">Aktivitas Terbaru</h2>
          </div>
          <div className="space-y-2.5">
            {dashboardActivityItems.map((activity) => (
              <div key={`${activity.title}-${activity.time}`} className="rounded-[10px] border border-base-300/70 bg-base-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-base-content">{activity.title}</p>
                  <span className={cn("inline-flex rounded-[8px] px-2 py-0.5 text-[11px] font-semibold", activity.toneClass)}>{activity.time}</span>
                </div>
                <p className="mt-1 text-xs text-base-content/70 sm:text-sm">{activity.detail}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <Surface className="p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
          <div className="flex items-center gap-3">
            <LiveIcon className="size-5 text-[#FF1616] sm:size-6" />
            <h2 className="text-base font-bold text-base-content sm:text-2xl">Sedang Berlangsung</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {dashboardStatusHelpItems.map((item) => (
              <div key={item.status} className="tooltip tooltip-bottom" data-tip={item.description}>
                <span className={cn("inline-flex rounded-[999px] px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] sm:text-[11px]", questStatusClass(item.status))}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {dashboardQuickFilterMenus.map((menu) => {
            const activeValue = liveFilters[menu.key];
            const activeOption = menu.options.find((option) => option.value === activeValue) ?? menu.options[0];
            const isActive = activeOption.value !== "ALL";
            return (
              <button
                key={menu.key}
                type="button"
                onClick={() => rotateFilter(menu.key)}
                className={cn(
                  "btn h-9 min-h-9 rounded-[999px] border-none px-4 text-xs shadow-none sm:text-sm",
                  isActive ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/80 hover:bg-base-300"
                )}
                title={`Klik untuk ganti filter ${menu.label}`}
              >
                {menu.label}: {activeOption.label}
              </button>
            );
          })}
        </div>

        <RadarMapWidget activeGeoScope={activeGeoScope} />

        {isQuestEmpty ? (
          <div className="mb-4 rounded-[12px] border border-dashed border-base-300 bg-base-100 p-4 sm:p-5">
            <p className="text-sm font-bold text-base-content sm:text-base">Belum ada quest yang cocok untuk filter sekarang.</p>
            <p className="mt-1 text-xs text-base-content/70 sm:text-sm">Coba rekomendasi ini dulu untuk memperluas peluang match.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={resetLowVolumeFilters} className="btn h-9 min-h-9 rounded-[8px] border-none bg-primary px-4 text-xs text-primary-content shadow-none sm:text-sm">
                Perluas Radius
              </button>
              <button type="button" onClick={resetLowVolumeFilters} className="btn h-9 min-h-9 rounded-[8px] border-base-300 bg-base-100 px-4 text-xs text-base-content shadow-none sm:text-sm">
                Lengkapi Skill
              </button>
            </div>
          </div>
        ) : null}

        {!isQuestEmpty && isQuestSparse ? (
          <div className="mb-4 rounded-[12px] border border-base-300/70 bg-base-100 p-3.5 sm:p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-base-content/50">Low Volume Suggestion</p>
            <p className="mt-1 text-sm font-medium text-base-content/80">Data quest masih tipis. Rekomendasi: perluas radius 1-2 km atau tambahkan skill baru agar feed lebih ramai.</p>
          </div>
        ) : null}

        <div className="space-y-4 xl:hidden">
          {filteredQuestItems.map((quest, index) => (
            <QuestCard key={quest.title} quest={quest} featured={index === 0} onDetailClick={() => setSubView({ view: "QuestDetail", payload: { id: quest.title } })} />
          ))}
        </div>

        <div className={cn("hidden xl:block", isQuestEmpty && "xl:hidden")}>
          <div className="overflow-x-auto pb-1">
            <div className="grid grid-flow-col grid-rows-2 gap-4 [grid-auto-columns:minmax(340px,1fr)]">
              {filteredQuestItems.map((quest) => (
                <QuestCard key={quest.title} quest={quest} onDetailClick={() => setSubView({ view: "QuestDetail", payload: { id: quest.title } })} />
              ))}
            </div>
          </div>
        </div>
      </Surface>
    </div>
  );
}

export default DashboardComponent;
