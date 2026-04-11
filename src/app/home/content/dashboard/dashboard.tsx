import type { ReactNode } from "react";
import { ArrowUpIcon, DollarIcon, LiveIcon, StarIcon, TagIcon } from "../../home.icons";
import { cn, Surface } from "../../home.ui";
import {
  dashboardActivityItems,
  dashboardCarouselItems,
  dashboardQuickFilters,
  dashboardSnapshotItems,
  liveQuestItems,
  type DashboardQuestItem,
} from "./dashboard";

function questStatusClass(status: DashboardQuestItem["status"]) {
  if (status === "LIVE") {
    return "bg-[#FEE2E2] text-[#B91C1C]";
  }
  if (status === "MATCH") {
    return "bg-[#DBEAFE] text-[#1D4ED8]";
  }
  return "bg-[#DCFCE7] text-[#166534]";
}

function MetricPill({ icon, children, className = "" }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-6 items-center justify-center">{icon}</div>
      <span className={cn("inline-flex rounded-[8px] px-3 py-1 text-xs font-bold text-black sm:text-sm", className)}>{children}</span>
    </div>
  );
}

function QuestCard({ quest, featured = false }: { quest: DashboardQuestItem; featured?: boolean }) {
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
        <div className="flex items-center gap-3 text-sm font-semibold text-base-content/80 sm:text-lg">
          <TagIcon className="size-5 text-[#FF27C8] sm:size-6" />
          <span>{quest.category}</span>
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
        <button type="button" className={cn("btn border-none bg-primary text-primary-content shadow-none hover:opacity-90", featured ? "h-12 min-h-12 rounded-[8px] px-10 text-lg" : "h-10 min-h-10 rounded-[8px] px-6 text-sm sm:h-11 sm:min-h-11")}>
          Detail
        </button>
      </div>
    </Surface>
  );
}

function DashboardComponent() {
  const dashboardKpis = [
    { label: "Quest Aktif", value: "24", hint: "7 prioritas", tone: "bg-[#DBEAFE]" },
    { label: "Runner Online", value: "12", hint: "3 standby", tone: "bg-[#DCFCE7]" },
    { label: "Avg Response", value: "14m", hint: "-3m minggu ini", tone: "bg-[#FCE7F3]" },
    { label: "Issue Open", value: "5", hint: "2 baru hari ini", tone: "bg-[#FEE2E2]" },
  ];

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
        <div className="inline-flex rounded-[10px] bg-base-200 p-1 gap-1 mt-2 sm:mt-4">
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
                <div className={cn("relative flex h-full w-full flex-col justify-between p-5 sm:p-7", "bg-info/15 hover:bg-to-br", item.accent)}>
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
        <div className="mb-4 flex items-center gap-3 sm:mb-5">
          <LiveIcon className="size-5 text-[#FF1616] sm:size-6" />
          <h2 className="text-base font-bold text-base-content sm:text-2xl">Sedang Berlangsung</h2>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {dashboardQuickFilters.map((filter) => (
            <button
              key={filter.label}
              type="button"
              className={cn(
                "btn h-9 min-h-9 rounded-[999px] border-none px-4 text-xs shadow-none sm:text-sm",
                filter.active ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/80 hover:bg-base-300"
              )}
            >
              {filter.label}: {filter.value}
            </button>
          ))}
        </div>

        <div className="space-y-4 xl:hidden">
          {liveQuestItems.map((quest, index) => (
            <QuestCard key={quest.title} quest={quest} featured={index === 0} />
          ))}
        </div>

        <div className="hidden xl:block">
          <div className="overflow-x-auto pb-1">
            <div className="grid grid-flow-col grid-rows-2 gap-4 [grid-auto-columns:minmax(340px,1fr)]">
              {liveQuestItems.map((quest) => (
                <QuestCard key={quest.title} quest={quest} />
              ))}
            </div>
          </div>
        </div>
      </Surface>
    </div>
  );
}

export default DashboardComponent;
