import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowUpIcon,
  DollarIcon,
  LiveIcon,
  StarIcon,
  TagIcon,
} from "../../home.icons";
import { cn, Surface } from "../../home.ui";
import {
  dashboardEscrowFlow,
  dashboardLeaderboardScopes,
  filterDashboardQuestItems,
  normalizeDashboardLiveFilters,
  resetDashboardLowVolumeFilters,
  resolveActiveDashboardGeoScope,
  resolveActiveDashboardLeaderboardGroup,
  resolveDashboardRoleContext,
  resolveDashboardRoleData,
  resolveDashboardQuestStatusClass,
  resolveDashboardSkillMatchTone,
  resolveDashboardViewText,
  resolveInitialDashboardSubView,
  resolveInitialLiveFilters,
  rotateDashboardFilterState,
  syncDashboardLiveFiltersStorage,
  syncDashboardSubViewStorage,
  type DashboardFilterKey,
  type DashboardGeoScopeItem,
  type DashboardLiveFilterState,
  type DashboardLeaderboardScope,
  type DashboardQuestItem,
  type DashboardSubView,
} from "./dashboard";
import { QuestDetail } from "./page/quest-detail";
import { RunnerImpactDetail } from "./runner-roles/impact-counter/impact-counter.tsx";
import { GiverBroadcastImpact } from "./giver-roles/broadcast-impact/broadcast-impact.tsx";
import { RunnerSnapshootDetail } from "./runner-roles/runner-snapshoot/runner-snapshoot.tsx";
import { GiverSnapshootDetail } from "./giver-roles/giver-snapshoot/giver-snapshoot.tsx";
import {
  RunnerMetricsDetail,
  RunnerActiveQuestDetail,
  RunnerOnlineRunnerDetail,
  RunnerAvgResponseDetail,
  RunnerOpenIssueDetail,
} from "./runner-roles/metrics/metrics.tsx";
import {
  GiverMetricsDetail,
  GiverBroadcastQuestDetail,
  GiverFillRateDetail,
  GiverMatchAvgDetail,
  GiverEscrowLockedDetail,
} from "./giver-roles/metrics/metrics.tsx";
import { RunnerRecentActivity } from "./runner-roles/recent-activity/recent-activity.tsx";
import { RunnerStateDetail } from "./runner-roles/state/state.tsx";
import { GiverActivityDetail } from "./giver-roles/giver-activity/giver-activity.tsx";
import { GiverStateDetail } from "./giver-roles/state/state.tsx";
import { RunnerMapsLive } from "../runner/page/maps-live";
import { GiverMapsLive } from "./giver-roles/maps-live/maps-live.tsx";
import Aurora from "../../../../Animation/Aurora";
import BorderGlow from "../../../../Animation/BorderGlow";
import SplitText from "../../../../Animation/SplitText";
import ShapeBlur from "../../../../Animation/ShapeBlur";
import ShinyText from "../../../../Animation/ShinyText";
import { useAnimationTheme } from "../../../global.theme";
import { useRole } from "../../role.context";

function MetricPill({
  icon,
  children,
  className = "",
}: {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-6 items-center justify-center">{icon}</div>
      <span
        className={cn(
          "inline-flex rounded-[8px] px-3 py-1 text-xs font-bold text-black sm:text-sm",
          className,
        )}
      >
        {children}
      </span>
    </div>
  );
}

function TrustSignal({
  label,
  value,
  toneClass,
}: {
  label: string;
  value: string;
  toneClass: string;
}) {
  return (
    <div className="rounded-[8px] border border-base-300/70 bg-base-100 px-2.5 py-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">
        {label}
      </p>
      <p className={cn("text-xs font-bold sm:text-sm", toneClass)}>{value}</p>
    </div>
  );
}

function EscrowTracker({
  state,
}: {
  state: DashboardQuestItem["escrowState"];
}) {
  const { role, isGiverVerified } = useRole();
  const dashboardViewText = resolveDashboardViewText(
    resolveDashboardRoleContext(role, isGiverVerified),
  );
  const activeIndex = dashboardEscrowFlow.indexOf(state);
  return (
    <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-base-content/55">
        {dashboardViewText.questCard.escrowStateLabel}
      </p>
      <div className="mt-2 grid gap-1 sm:grid-cols-5">
        {dashboardEscrowFlow.map((step, index) => {
          const isDone = activeIndex > index;
          const isActive = activeIndex === index;
          return (
            <div
              key={step}
              className={cn(
                "rounded-[7px] px-1.5 py-1 text-center text-[10px] font-semibold tracking-[0.05em]",
                isDone && "bg-[#DCFCE7] text-[#166534]",
                isActive && "bg-[#DBEAFE] text-[#1D4ED8]",
                !isDone && !isActive && "bg-base-200 text-base-content/55",
              )}
            >
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RadarMapWidget({
  activeGeoScope,
}: {
  activeGeoScope: DashboardGeoScopeItem;
}) {
  const { role, isGiverVerified } = useRole();
  const dashboardViewText = resolveDashboardViewText(
    resolveDashboardRoleContext(role, isGiverVerified),
  );
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
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-base-content/50">
            {dashboardViewText.radar.title}
          </p>
          <p className="text-sm font-bold text-base-content">
            {dashboardViewText.radar.radiusPrefix}: {radius} km
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeGeoScope.hotZones.map((zone: string) => (
            <span
              key={zone}
              className="rounded-[8px] bg-error/10 px-2 py-0.5 text-[10px] font-bold text-error ring-1 ring-error/20 shadow-sm"
            >
              {zone} 🔥
            </span>
          ))}
          <span className="rounded-[999px] bg-base-200 px-2.5 py-1 text-[11px] font-semibold text-base-content/75">
            {activeGeoScope.avgEta}
          </span>
        </div>
      </div>

      <>{/* Test */}</>

      <div className="relative mt-2 flex h-56 sm:h-72 w-full items-center justify-center overflow-hidden rounded-[12px] border border-[#38BDF8]/20 bg-[#0F172A] shadow-inner">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 opacity-40 bg-linear-to-t from-[#0F172A] to-transparent" />

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-1.5 rounded-[8px] bg-[#0F172A]/80 border border-slate-700 p-2 backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-white" />
            <span className="text-[9px] font-semibold text-slate-300">
              {dashboardViewText.radar.legendTargetLocation}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-[#10B981] shadow-[0_0_5px_#10B981]" />
            <span className="text-[9px] font-semibold text-slate-300">
              {dashboardViewText.radar.legendTopRunner}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-[#F59E0B] shadow-[0_0_5px_#F59E0B]" />
            <span className="text-[9px] font-semibold text-slate-300">
              {dashboardViewText.radar.legendBackupRunner}
            </span>
          </div>
        </div>

        {/* Radar Engine */}
        <div className="relative flex items-center justify-center">
          {/* Center Node */}
          <div className="relative z-10 flex size-5 items-center justify-center rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)]">
            <div className="size-2 rounded-full bg-primary" />
          </div>

          {/* 1 KM Pulse */}
          <div
            className={cn(
              "absolute flex items-center justify-center rounded-full border border-[#A046FF] transition-all duration-1000 ease-in-out",
              radius >= 1
                ? "size-32 bg-[#A046FF]/10 ring-4 ring-[#A046FF]/20"
                : "size-0 opacity-0",
            )}
          >
            {radius === 1 && (
              <div
                className="absolute inset-0 animate-ping rounded-full bg-[#A046FF]/50"
                style={{ animationDuration: "2s" }}
              />
            )}
          </div>

          {/* 2 KM Pulse */}
          <div
            className={cn(
              "absolute flex items-center justify-center rounded-full border border-[#38BDF8] transition-all duration-1000 ease-in-out",
              radius >= 2
                ? "size-52 sm:size-64 bg-[#38BDF8]/10 ring-4 ring-[#38BDF8]/10"
                : "size-32 opacity-0",
            )}
          >
            {radius === 2 && (
              <div
                className="absolute inset-0 animate-ping rounded-full bg-[#38BDF8]/40"
                style={{ animationDuration: "3s" }}
              />
            )}
          </div>

          {/* Mapped Entities */}
          <div
            className="absolute -top-8 left-10 size-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] transition-opacity duration-1500"
            style={{ opacity: radius >= 1 ? 1 : 0 }}
          />
          <div
            className="absolute bottom-6 right-10 size-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] transition-opacity duration-1500 delay-300"
            style={{ opacity: radius >= 1 ? 1 : 0 }}
          />
          <div
            className="absolute top-4 -left-12 size-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] transition-opacity duration-1500 delay-150"
            style={{ opacity: radius >= 1 ? 1 : 0 }}
          />

          <div
            className="absolute -top-20 -left-16 size-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B] transition-opacity duration-1500"
            style={{ opacity: radius >= 2 ? 1 : 0 }}
          />
          <div
            className="absolute bottom-24 -right-24 size-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B] transition-opacity duration-1500 delay-300"
            style={{ opacity: radius >= 2 ? 1 : 0 }}
          />
          <div
            className="absolute -bottom-16 left-8 size-2.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] transition-opacity duration-1500 delay-500"
            style={{ opacity: radius >= 2 ? 1 : 0 }}
          />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">
            {dashboardViewText.radar.candidateLabel}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-xl font-bold text-base-content">
              {activeGeoScope.estimatedRunners}
            </p>
            <span className="text-xs font-semibold text-[#10B981]">
              {dashboardViewText.radar.candidateHint}
            </span>
          </div>
        </div>
        <div className="rounded-[9px] border border-base-300/70 bg-base-100 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-base-content/55">
            {dashboardViewText.radar.runnerStatusLabel}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-xl font-bold text-base-content">
              {activeGeoScope.activeRunners}
            </p>
            <span className="text-xs font-semibold text-[#6B21FF]">
              {dashboardViewText.radar.runnerStatusHint}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestCard({
  quest,
  featured = false,
  onDetailClick,
}: {
  quest: DashboardQuestItem;
  featured?: boolean;
  onDetailClick?: () => void;
}) {
  const { role, isGiverVerified } = useRole();
  const dashboardViewText = resolveDashboardViewText(
    resolveDashboardRoleContext(role, isGiverVerified),
  );
  const slotProgress = Math.round((quest.slotFilled / quest.slotTotal) * 100);

  return (
    <Surface className={cn(featured ? "p-5 sm:p-7" : "p-4 sm:p-5")}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex rounded-[999px] px-3 py-1 text-[11px] font-bold tracking-[0.12em]",
            resolveDashboardQuestStatusClass(quest.status),
          )}
        >
          {quest.status}
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/75">
            {quest.distanceKm.toFixed(1)} km
          </span>
          <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/75">
            {quest.countdown}
          </span>
          <span className="rounded-[8px] bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/75">
            {dashboardViewText.questCard.slotPrefix} {quest.slots}
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2">
        <div>
          <h3
            className={cn(
              "font-bold text-base-content",
              featured
                ? "text-[clamp(1.6rem,3vw,2.25rem)]"
                : "text-lg sm:text-2xl",
            )}
          >
            {quest.title}
          </h3>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-right">
            <p
              className={cn(
                "font-bold text-base-content",
                featured ? "text-xl sm:text-2xl" : "text-sm sm:text-lg",
              )}
            >
              {quest.owner}
            </p>
            <p
              className={cn(
                "font-medium text-base-content/50",
                featured ? "text-sm sm:text-lg" : "text-xs sm:text-sm",
              )}
            >
              {quest.role}
            </p>
          </div>
          <div
            className={cn(
              "shrink-0 rounded-[10px] bg-base-300",
              featured ? "size-16 sm:size-[75px]" : "size-12 sm:size-14",
            )}
          />
        </div>
      </div>

      <div className={cn("mt-5 grid gap-3", featured ? "max-w-xl" : "mt-4")}>
        <div className="rounded-[10px] border border-base-300/70 bg-base-100 p-2.5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-[999px] bg-base-200 px-2.5 py-1 text-[11px] font-semibold text-base-content/75">
              {quest.mode}
            </span>
            <span
              className={cn(
                "rounded-[999px] px-2.5 py-1 text-[11px] font-semibold",
                resolveDashboardSkillMatchTone(quest.skillMatchScore),
              )}
            >
              {quest.skillMatchScore}% cocok
            </span>
          </div>
          <div className="h-2 rounded-full bg-base-200">
            <div
              className="h-2 rounded-full bg-[#6B21FF]"
              style={{ width: `${slotProgress}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-base-content/65">
            {dashboardViewText.questCard.questTypePrefix}: {quest.mode} |{" "}
            {dashboardViewText.questCard.slotFilledPrefix} {quest.slotFilled}/
            {quest.slotTotal}
          </p>
        </div>

        <EscrowTracker state={quest.escrowState} />

        <div className="flex items-center gap-3 text-sm font-semibold text-base-content/80 sm:text-lg">
          <TagIcon className="size-5 text-[#FF27C8] sm:size-6" />
          <span>{quest.category}</span>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-3">
          <TrustSignal
            label={dashboardViewText.questCard.trustVerifiedGiverLabel}
            value={
              quest.verifiedGiver
                ? dashboardViewText.questCard.trustVerifiedValue
                : dashboardViewText.questCard.trustUnverifiedValue
            }
            toneClass={
              quest.verifiedGiver ? "text-[#166534]" : "text-[#B91C1C]"
            }
          />
          <TrustSignal
            label={dashboardViewText.questCard.trustCompletionLabel}
            value={quest.completionRate}
            toneClass="text-[#1D4ED8]"
          />
          <TrustSignal
            label={dashboardViewText.questCard.trustDisputeRatioLabel}
            value={quest.disputeRatio}
            toneClass="text-[#9D174D]"
          />
        </div>

        <div className="flex items-center gap-2">
          <div
            className="tooltip tooltip-bottom"
            data-tip={dashboardViewText.questCard.ppFormulaTooltip}
          >
            <span className="inline-flex cursor-help rounded-[8px] bg-base-200 px-2.5 py-1 text-[11px] font-semibold text-base-content/70">
              {dashboardViewText.questCard.ppFormulaLabel}
            </span>
          </div>
          <span className="text-xs font-semibold text-base-content/65">
            {dashboardViewText.questCard.deltaPrefix} {quest.ppDelta}
          </span>
        </div>

        <MetricPill
          icon={<ArrowUpIcon className="size-5 text-[#6B21FF] sm:size-6" />}
          className="bg-[#8B5CF6]/75"
        >
          {quest.points}
        </MetricPill>

        <MetricPill
          icon={<DollarIcon className="size-5 text-[#00B6E7] sm:size-6" />}
          className="bg-[#8DFF2F]"
        >
          {quest.reward}
        </MetricPill>

        <MetricPill
          icon={<StarIcon className="size-5 text-[#FF9800] sm:size-6" />}
          className="bg-[#C7FF8B]"
        >
          {quest.score}
        </MetricPill>
      </div>

      <div
        className={cn("mt-6 flex justify-end", featured ? "sm:mt-8" : "mt-5")}
      >
        <button
          type="button"
          onClick={onDetailClick}
          className={cn(
            "btn border-none bg-primary text-primary-content shadow-none hover:opacity-90",
            featured
              ? "h-12 min-h-12 rounded-[8px] px-10 text-lg"
              : "h-10 min-h-10 rounded-[8px] px-6 text-sm sm:h-11 sm:min-h-11",
          )}
        >
          {dashboardViewText.questCard.detailButtonLabel}
        </button>
      </div>
    </Surface>
  );
}

function DashboardComponent() {
  const initialDashboardRoleData = resolveDashboardRoleData("runner");
  const [liveFilters, setLiveFilters] = useState<DashboardLiveFilterState>(() =>
    resolveInitialLiveFilters(initialDashboardRoleData.quickFilterMenus),
  );
  const [leaderboardScope, setLeaderboardScope] =
    useState<DashboardLeaderboardScope>(
      dashboardLeaderboardScopes[0] ?? "Lokal",
    );
  const [viewStack, setViewStack] = useState<DashboardSubView[]>(() => {
    const initial = resolveInitialDashboardSubView();
    return initial ? [initial] : [];
  });
  const activeSubView = viewStack[viewStack.length - 1] ?? null;

  function pushSubView(view: DashboardSubView) {
    setViewStack((prev) => [...prev, view]);
  }

  function popSubView() {
    setViewStack((prev) => prev.slice(0, -1));
  }

  function setSubView(view: DashboardSubView | null) {
    if (view === null) popSubView();
    else pushSubView(view);
  }
  const { animationsEnabled } = useAnimationTheme();
  const { role, isGiverVerified, switchRole } = useRole();
  const roleContext = resolveDashboardRoleContext(role, isGiverVerified);
  const isRunnerMode = roleContext === "runner";
  const dashboardRoleData = resolveDashboardRoleData(roleContext);
  const dashboardViewText = resolveDashboardViewText(roleContext);
  const dashboardActivityItems = dashboardRoleData.activityItems;
  const dashboardCarouselItems = dashboardRoleData.carouselItems;
  const dashboardGeoScopeItems = dashboardRoleData.geoScopeItems;
  const dashboardImpactCounterItems = dashboardRoleData.impactCounterItems;
  const dashboardKpiItems = dashboardRoleData.kpiItems;
  const dashboardLeaderboardGroups = dashboardRoleData.leaderboardGroups;
  const dashboardQuickFilterMenus = dashboardRoleData.quickFilterMenus;
  const dashboardSnapshotItems = dashboardRoleData.snapshotItems;
  const dashboardStatusHelpItems = dashboardRoleData.statusHelpItems;
  const liveQuestItems = dashboardRoleData.questItems;
  const normalizedLiveFilters = normalizeDashboardLiveFilters(
    liveFilters,
    dashboardQuickFilterMenus,
  );

  useEffect(() => {
    syncDashboardLiveFiltersStorage(normalizedLiveFilters);
  }, [normalizedLiveFilters]);

  useEffect(() => {
    syncDashboardSubViewStorage(activeSubView);
  }, [activeSubView]);

  if (activeSubView?.view === "QuestDetail") {
    return (
      <QuestDetail
        questId={activeSubView.payload.id}
        onBack={() => setSubView(null)}
      />
    );
  }
  if (activeSubView?.view === "RunnerImpactDetail") {
    return <RunnerImpactDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "GiverBroadcastImpact") {
    return <GiverBroadcastImpact onBack={() => setSubView(null)} />;
  }

  if (activeSubView?.view === "RunnerSnapshootDetail") {
    return <RunnerSnapshootDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "GiverSnapshootDetail") {
    return <GiverSnapshootDetail onBack={() => setSubView(null)} />;
  }

  if (activeSubView?.view === "RunnerMetricsDetail") {
    return <RunnerMetricsDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "GiverMetricsDetail") {
    return <GiverMetricsDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "RunnerActiveQuestDetail") {
    return <RunnerActiveQuestDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "RunnerOnlineRunnerDetail") {
    return <RunnerOnlineRunnerDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "RunnerAvgResponseDetail") {
    return <RunnerAvgResponseDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "RunnerOpenIssueDetail") {
    return <RunnerOpenIssueDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "GiverBroadcastQuestDetail") {
    return <GiverBroadcastQuestDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "GiverFillRateDetail") {
    return <GiverFillRateDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "GiverMatchAvgDetail") {
    return <GiverMatchAvgDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "GiverEscrowLockedDetail") {
    return <GiverEscrowLockedDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "RunnerRecentActivity") {
    return <RunnerRecentActivity onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "RunnerStateDetail") {
    return <RunnerStateDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "GiverActivityDetail") {
    return <GiverActivityDetail onBack={() => setSubView(null)} />;
  }
  if (activeSubView?.view === "GiverStateDetail") {
    return <GiverStateDetail onBack={() => setSubView(null)} />;
  }
  // Singleton Pattern UI logic diletakkan di bagian return utama dashboard.

  const filteredQuestItems = filterDashboardQuestItems(
    liveQuestItems,
    normalizedLiveFilters,
  );

  const activeLeaderboardGroup = resolveActiveDashboardLeaderboardGroup(
    dashboardLeaderboardGroups,
    leaderboardScope,
  );
  const activeGeoScope = resolveActiveDashboardGeoScope(
    dashboardGeoScopeItems,
    normalizedLiveFilters.radius,
  );
  const isQuestEmpty = filteredQuestItems.length === 0;
  const isQuestSparse = filteredQuestItems.length <= 1;

  function rotateFilter(key: DashboardFilterKey) {
    setLiveFilters((prev) =>
      rotateDashboardFilterState(
        normalizeDashboardLiveFilters(prev, dashboardQuickFilterMenus),
        key,
        dashboardQuickFilterMenus,
      ),
    );
  }

  function resetLowVolumeFilters() {
    setLiveFilters((prev) =>
      resetDashboardLowVolumeFilters(
        normalizeDashboardLiveFilters(prev, dashboardQuickFilterMenus),
      ),
    );
  }

  const isMapActive =
    activeSubView?.view === "RunnerMapsLiveDetail" ||
    activeSubView?.view === "GiverMapsLiveDetail";

  return (
    <>
      {/* 🚀 STRATEGI 1: SINGLETON MAPS (Anti Zombie Load & Anti Tagihan Bengkak) */}
      <div className={isMapActive ? "block w-full h-full" : "hidden"}>
        {activeSubView?.view === "RunnerMapsLiveDetail" && (
          <RunnerMapsLive onBack={() => setSubView(null)} />
        )}
        {activeSubView?.view === "GiverMapsLiveDetail" && (
          <GiverMapsLive onBack={() => setSubView(null)} />
        )}
      </div>
      <div
        className={
          isMapActive
            ? "hidden"
            : "flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
        }
      >
        <Surface className="p-5 sm:p-6 relative overflow-hidden bg-base-100 border border-base-300">
          {animationsEnabled && (
            <>
              <div className="absolute inset-0 pointer-events-none opacity-40 z-0 mix-blend-screen">
                <Aurora blend={0.6} amplitude={1.2} speed={0.5} />
              </div>
              <div className="absolute -top-[50%] -right-[20%] w-[150%] h-[200%] opacity-20 pointer-events-none z-0">
                <ShapeBlur
                  variation={0}
                  pixelRatioProp={2}
                  shapeSize={1}
                  roundness={0.5}
                  borderSize={0.05}
                  circleSize={0.25}
                  circleEdge={1}
                />
              </div>
            </>
          )}
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              {animationsEnabled ? (
                <ShinyText
                  text={dashboardViewText.hero.eyebrow}
                  speed={2.5}
                  color="#64748b"
                  shineColor="#a855f7"
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                />
              ) : (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/50">
                  {dashboardViewText.hero.eyebrow}
                </p>
              )}

              {animationsEnabled ? (
                <SplitText
                  text={dashboardViewText.hero.title}
                  className="mt-2 text-2xl font-bold text-base-content sm:text-[2rem]"
                  delay={50}
                  from={{ opacity: 0, y: 25 }}
                  to={{ opacity: 1, y: 0 }}
                />
              ) : (
                <h1 className="mt-2 text-2xl font-bold text-base-content sm:text-[2rem]">
                  {dashboardViewText.hero.title}
                </h1>
              )}
              <p className="mt-2 text-sm text-base-content/70 sm:text-base">
                {dashboardViewText.hero.description}
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-2 flex flex-wrap items-center gap-2 sm:mt-4">
            {isGiverVerified ? (
              <div className="inline-flex gap-1 rounded-[10px] bg-base-200 p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => switchRole("runner")}
                  className={cn(
                    "btn h-9 min-h-9 rounded-[8px] border-none px-4 text-xs shadow-none sm:text-sm",
                    isRunnerMode
                      ? "bg-primary text-primary-content"
                      : "bg-transparent text-base-content/70 hover:bg-base-100",
                  )}
                >
                  {dashboardViewText.mode.runnerLabel}
                </button>
                <button
                  type="button"
                  onClick={() => switchRole("giver")}
                  className={cn(
                    "btn h-9 min-h-9 rounded-[8px] border-none px-4 text-xs shadow-none sm:text-sm",
                    !isRunnerMode
                      ? "bg-primary text-primary-content"
                      : "bg-transparent text-base-content/70 hover:bg-base-100",
                  )}
                >
                  {dashboardViewText.mode.giverLabel}
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-[10px] bg-base-200 p-1.5 shadow-sm">
                <span className="rounded-[8px] bg-primary px-3 py-1.5 text-xs font-semibold text-primary-content">
                  {dashboardViewText.mode.runnerLabel}
                </span>
                <span className="text-xs font-medium text-base-content/65">
                  {dashboardViewText.mode.giverLockedHint}
                </span>
              </div>
            )}
          </div>
          {!isRunnerMode && (
            <div className="relative z-10 mt-2 rounded-[10px] border border-warning/40 bg-warning/10 px-3 py-2 text-xs font-semibold text-base-content/80">
              {dashboardViewText.mode.giverWarning}
            </div>
          )}
        </Surface>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardKpiItems.map((kpi) => {
            const InnerKpi = () => (
              <div className="p-5 flex flex-col h-full w-full">
                <p className="text-sm font-semibold text-base-content/55">
                  {kpi.label}
                </p>
                <p className="mt-2 text-[1.8rem] font-bold leading-tight text-base-content">
                  {kpi.value}
                </p>
                <span
                  className={cn(
                    "mt-auto self-start inline-flex rounded-[8px] px-3 py-1 text-xs font-semibold text-black",
                    kpi.tone,
                  )}
                >
                  {kpi.hint}
                </span>
              </div>
            );

            return animationsEnabled ? (
              <BorderGlow
                key={kpi.label}
                className="bg-base-100 w-full h-full rounded-[16px] border border-base-300 group hover:shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
                borderRadius={16}
                edgeSensitivity={20}
                glowIntensity={0.6}
                animated={false}
                glowRadius={20}
                onClick={() => {
                  const runnerMap: Record<string, DashboardSubView["view"]> = {
                    "Quest Aktif": "RunnerActiveQuestDetail",
                    "Runner Online": "RunnerOnlineRunnerDetail",
                    "Avg Response": "RunnerAvgResponseDetail",
                    "Issue Open": "RunnerOpenIssueDetail",
                  };
                  const giverMap: Record<string, DashboardSubView["view"]> = {
                    "Quest Dibroadcast": "GiverBroadcastQuestDetail",
                    "Fill Rate": "GiverFillRateDetail",
                    "Avg Match": "GiverMatchAvgDetail",
                    "Escrow Locked": "GiverEscrowLockedDetail",
                  };
                  const map = isRunnerMode ? runnerMap : giverMap;
                  const view = (map[kpi.label] ??
                    (isRunnerMode
                      ? "RunnerMetricsDetail"
                      : "GiverMetricsDetail")) as DashboardSubView["view"];
                  setSubView({ view } as DashboardSubView);
                }}
              >
                <div className="h-full relative z-1">
                  <InnerKpi />
                </div>
              </BorderGlow>
            ) : (
              <Surface
                key={kpi.label}
                className="p-0 border border-base-300/70 shrink-0 cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => {
                  const runnerMap: Record<string, DashboardSubView["view"]> = {
                    "Quest Aktif": "RunnerActiveQuestDetail",
                    "Runner Online": "RunnerOnlineRunnerDetail",
                    "Avg Response": "RunnerAvgResponseDetail",
                    "Issue Open": "RunnerOpenIssueDetail",
                  };
                  const giverMap: Record<string, DashboardSubView["view"]> = {
                    "Quest Dibroadcast": "GiverBroadcastQuestDetail",
                    "Fill Rate": "GiverFillRateDetail",
                    "Avg Match": "GiverMatchAvgDetail",
                    "Escrow Locked": "GiverEscrowLockedDetail",
                  };
                  const map = isRunnerMode ? runnerMap : giverMap;
                  const view = (map[kpi.label] ??
                    (isRunnerMode
                      ? "RunnerMetricsDetail"
                      : "GiverMetricsDetail")) as DashboardSubView["view"];
                  setSubView({ view } as DashboardSubView);
                }}
              >
                <InnerKpi />
              </Surface>
            );
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Surface className="p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
              {dashboardViewText.impact.eyebrow}
            </p>
            <h2 className="mt-1 text-lg font-bold text-base-content sm:text-xl">
              {dashboardViewText.impact.title}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {dashboardImpactCounterItems.map((item) => (
                <div
                  key={item.label}
                  onClick={() =>
                    setSubView({
                      view: isRunnerMode
                        ? "RunnerImpactDetail"
                        : "GiverBroadcastImpact",
                    })
                  }
                  className="group cursor-pointer rounded-[10px] border border-base-300/70 bg-base-100 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-base-200 hover:shadow-md"
                >
                  <p className="text-xs font-semibold text-base-content/55">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xl font-bold text-base-content">
                    {item.value}
                  </p>
                  <span
                    className={cn(
                      "mt-2 inline-flex rounded-[8px] px-2 py-0.5 text-[11px] font-semibold text-black",
                      item.toneClass,
                    )}
                  >
                    {item.hint}
                  </span>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                  {dashboardViewText.leaderboard.eyebrow}
                </p>
                <h2 className="mt-1 text-lg font-bold text-base-content sm:text-xl">
                  {dashboardViewText.leaderboard.title}
                </h2>
              </div>
              <div className="inline-flex rounded-[10px] bg-base-200 p-1">
                {dashboardLeaderboardScopes.map((scope) => (
                  <button
                    key={scope}
                    type="button"
                    onClick={() => setLeaderboardScope(scope)}
                    className={cn(
                      "btn h-8 min-h-8 rounded-[8px] border-none px-3 text-xs shadow-none",
                      leaderboardScope === scope
                        ? "bg-primary text-primary-content"
                        : "bg-transparent text-base-content/75 hover:bg-base-100",
                    )}
                  >
                    {scope}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2.5">
              {activeLeaderboardGroup.items.map((entry, index) => {
                const isTop3 = index < 3;
                const glowColor =
                  index === 0
                    ? "45 100 60"
                    : index === 1
                      ? "0 0 70"
                      : index === 2
                        ? "25 60 40"
                        : "40 80 80";

                const InnerEntry = () => (
                  <div className="flex items-center justify-between px-3 py-2.5 w-full">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "inline-flex size-6 items-center justify-center rounded-full text-xs font-bold",
                          isTop3 && animationsEnabled
                            ? "bg-base-100/50 text-base-content"
                            : "bg-base-200 text-base-content/80",
                        )}
                      >
                        {entry.rank}
                      </span>
                      <p className="text-sm font-semibold text-base-content">
                        {entry.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-base-content">
                        {entry.pp} PP
                      </p>
                      <p className="text-xs font-semibold text-[#166534]">
                        {entry.trend}
                      </p>
                    </div>
                  </div>
                );

                return animationsEnabled && isTop3 ? (
                  <BorderGlow
                    key={`${activeLeaderboardGroup.scope}-${entry.rank}-${entry.name}`}
                    glowColor={glowColor}
                    className="w-full bg-base-100/90 shadow-sm border border-base-300/50 group hover:-translate-y-0.5 transition-transform"
                    borderRadius={10}
                    edgeSensitivity={15}
                    glowIntensity={0.6}
                    glowRadius={8}
                    animated={false}
                  >
                    <div className="relative z-1 w-full">
                      <InnerEntry />
                    </div>
                  </BorderGlow>
                ) : (
                  <div
                    key={`${activeLeaderboardGroup.scope}-${entry.rank}-${entry.name}`}
                    className="rounded-[10px] border border-base-300/70 bg-base-100 p-0"
                  >
                    <InnerEntry />
                  </div>
                );
              })}
            </div>
          </Surface>
        </div>

        <Surface className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                {dashboardViewText.snapshot.eyebrow}
              </p>
              <h2 className="mt-1 text-lg font-bold text-base-content sm:text-xl">
                {dashboardViewText.snapshot.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                setSubView({
                  view: isRunnerMode
                    ? "RunnerSnapshootDetail"
                    : "GiverSnapshootDetail",
                })
              }
              className="btn h-9 min-h-9 rounded-[8px] border-base-300 bg-base-100 px-4 text-xs text-base-content shadow-none hover:bg-base-200 sm:text-sm"
            >
              {dashboardViewText.snapshot.detailButtonLabel}
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardSnapshotItems.map((item) => (
              <div
                key={item.label}
                onClick={() =>
                  setSubView({
                    view: isRunnerMode
                      ? "RunnerSnapshootDetail"
                      : "GiverSnapshootDetail",
                  })
                }
                className="group cursor-pointer rounded-[12px] border border-base-300/70 bg-base-100 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-base-content/50">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold leading-tight text-base-content">
                  {item.value}
                </p>
                <span
                  className={cn(
                    "mt-2 inline-flex rounded-[8px] px-2.5 py-1 text-xs font-semibold text-black",
                    item.toneClass,
                  )}
                >
                  {item.hint}
                </span>
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
                    index === 0
                      ? "h-44 w-[84%] sm:h-56 md:w-[72%] lg:h-72 xl:h-[392px] xl:w-[64%]"
                      : "h-44 w-[56%] sm:h-56 md:w-[46%] lg:h-72 xl:h-[392px] xl:w-[36%]",
                  )}
                >
                  <div
                    className={cn(
                      "relative flex h-full w-full flex-col justify-between bg-linear-to-br p-5 sm:p-7",
                      item.accent,
                    )}
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-base-100/60 blur-2xl sm:size-40" />
                    <div className="pointer-events-none absolute bottom-0 right-0 h-28 w-28 rounded-tl-[42px] bg-base-content/5 sm:h-40 sm:w-40" />
                    <div className="max-w-[20rem]">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-base-content/50 sm:text-sm">
                        {dashboardViewText.carousel.itemEyebrow}
                      </p>
                      <h2 className="text-xl font-bold text-base-content sm:text-3xl">
                        {item.title}
                      </h2>
                    </div>
                    <p className="max-w-[18rem] text-sm font-medium leading-relaxed text-base-content/70 sm:max-w-88 sm:text-base">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {dashboardCarouselItems.map((item, index) => (
                <span
                  key={item.title}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    index === 0 ? "bg-base-content" : "bg-base-100",
                  )}
                />
              ))}
            </div>
          </Surface>

          <Surface className="p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                  {dashboardViewText.activity.eyebrow}
                </p>
                <h2 className="mt-1 text-lg font-bold text-base-content sm:text-xl">
                  {dashboardViewText.activity.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSubView({
                    view: isRunnerMode
                      ? "RunnerRecentActivity"
                      : "GiverActivityDetail",
                  })
                }
                className="btn h-8 min-h-8 rounded-[8px] border-base-300 bg-base-100 px-3 text-xs text-base-content shadow-none hover:bg-base-200"
              >
                Lihat Semua
              </button>
            </div>
            <div className="space-y-2.5">
              {dashboardActivityItems.slice(0, 4).map((activity) => (
                <div
                  key={`${activity.title}-${activity.time}`}
                  onClick={() =>
                    setSubView({
                      view: isRunnerMode
                        ? "RunnerRecentActivity"
                        : "GiverActivityDetail",
                    })
                  }
                  className="group cursor-pointer rounded-[10px] border border-base-300/70 bg-base-100 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-base-content">
                      {activity.title}
                    </p>
                    <span
                      className={cn(
                        "inline-flex rounded-[8px] px-2 py-0.5 text-[11px] font-semibold",
                        activity.toneClass,
                      )}
                    >
                      {activity.time}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-base-content/70 sm:text-sm">
                    {activity.detail}
                  </p>
                </div>
              ))}
            </div>
          </Surface>

          {/* State / Reputation Section */}
          <Surface
            className="p-4 sm:p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md group"
            onClick={() =>
              setSubView({
                view: isRunnerMode ? "RunnerStateDetail" : "GiverStateDetail",
              })
            }
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                  {isRunnerMode ? "Runner" : "Giver"} · Reputasi
                </p>
                <h2 className="mt-1 text-lg font-bold text-base-content sm:text-xl">
                  {isRunnerMode ? "Status & Lencana" : "Trust Score & Reputasi"}
                </h2>
              </div>
              <span className="text-2xl">{isRunnerMode ? "🎖️" : "🏅"}</span>
            </div>
            <p className="mt-2 text-sm text-base-content/60">
              {isRunnerMode
                ? "Level, PP, reliabilitas, lencana, dan jalur naik level kamu."
                : "Trust score, lencana kepercayaan, dan riwayat pembayaran escrow."}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary">
              <span>Lihat Detail</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </div>
          </Surface>
        </div>

        <Surface className="p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
            <div className="flex items-center gap-3">
              <LiveIcon className="size-5 text-[#FF1616] sm:size-6" />
              <h2 className="text-base font-bold text-base-content sm:text-2xl">
                {dashboardViewText.liveQuest.title}
              </h2>
              <button
                onClick={() =>
                  setSubView({
                    view: isRunnerMode
                      ? "RunnerMapsLiveDetail"
                      : "GiverMapsLiveDetail",
                  })
                }
                className="btn btn-sm ml-2 h-8 rounded-[8px] bg-primary/10 text-primary border-none hover:bg-primary hover:text-primary-content"
              >
                🗺️ Buka Peta
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {dashboardStatusHelpItems.map((item) => (
                <div
                  key={item.status}
                  className="tooltip tooltip-bottom"
                  data-tip={item.description}
                >
                  <span
                    className={cn(
                      "inline-flex rounded-[999px] px-2.5 py-1 text-[10px] font-bold tracking-widest sm:text-[11px]",
                      resolveDashboardQuestStatusClass(item.status),
                    )}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {dashboardQuickFilterMenus.map((menu) => {
              const activeValue = normalizedLiveFilters[menu.key];
              const activeOption =
                menu.options.find((option) => option.value === activeValue) ??
                menu.options[0];
              const isActive = activeOption.value !== "ALL";
              return (
                <button
                  key={menu.key}
                  type="button"
                  onClick={() => rotateFilter(menu.key)}
                  className={cn(
                    "btn h-9 min-h-9 rounded-[999px] border-none px-4 text-xs shadow-none sm:text-sm",
                    isActive
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 text-base-content/80 hover:bg-base-300",
                  )}
                  title={`${dashboardViewText.liveQuest.filterRotateButtonTitlePrefix} ${menu.label}`}
                >
                  {menu.label}: {activeOption.label}
                </button>
              );
            })}
          </div>

          <RadarMapWidget activeGeoScope={activeGeoScope} />

          {isQuestEmpty ? (
            <div className="mb-4 rounded-[12px] border border-dashed border-base-300 bg-base-100 p-4 sm:p-5">
              <p className="text-sm font-bold text-base-content sm:text-base">
                {dashboardViewText.liveQuest.emptyTitle}
              </p>
              <p className="mt-1 text-xs text-base-content/70 sm:text-sm">
                {dashboardViewText.liveQuest.emptyHint}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={resetLowVolumeFilters}
                  className="btn h-9 min-h-9 rounded-[8px] border-none bg-primary px-4 text-xs text-primary-content shadow-none sm:text-sm"
                >
                  {dashboardViewText.liveQuest.expandRadiusButton}
                </button>
                <button
                  type="button"
                  onClick={resetLowVolumeFilters}
                  className="btn h-9 min-h-9 rounded-[8px] border-base-300 bg-base-100 px-4 text-xs text-base-content shadow-none sm:text-sm"
                >
                  {dashboardViewText.liveQuest.completeSkillButton}
                </button>
              </div>
            </div>
          ) : null}

          {!isQuestEmpty && isQuestSparse ? (
            <div className="mb-4 rounded-[12px] border border-base-300/70 bg-base-100 p-3.5 sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-base-content/50">
                {dashboardViewText.liveQuest.lowVolumeEyebrow}
              </p>
              <p className="mt-1 text-sm font-medium text-base-content/80">
                {dashboardViewText.liveQuest.lowVolumeHint}
              </p>
            </div>
          ) : null}

          <div className="space-y-4 xl:hidden">
            {filteredQuestItems.map((quest, index) => (
              <QuestCard
                key={quest.title}
                quest={quest}
                featured={index === 0}
                onDetailClick={() =>
                  setSubView({
                    view: "QuestDetail",
                    payload: { id: quest.title },
                  })
                }
              />
            ))}
          </div>

          <div className={cn("hidden xl:block", isQuestEmpty && "xl:hidden")}>
            <div className="overflow-x-auto pb-1">
              <div className="grid grid-flow-col grid-rows-2 gap-4 auto-cols-[minmax(340px,1fr)]">
                {filteredQuestItems.map((quest) => (
                  <QuestCard
                    key={quest.title}
                    quest={quest}
                    onDetailClick={() =>
                      setSubView({
                        view: "QuestDetail",
                        payload: { id: quest.title },
                      })
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </Surface>
      </div>
    </>
  );
}

export default DashboardComponent;
