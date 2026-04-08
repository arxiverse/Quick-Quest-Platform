import type { ReactNode } from "react";
import { ArrowUpIcon, DollarIcon, LiveIcon, StarIcon, TagIcon } from "../../home.icons";
import { cn, Surface } from "../../home.ui";
import { dashboardCarouselItems, liveQuestItems } from "./dashboard.service";
import type { DashboardQuestItem } from "./dashboard";

function MetricPill({ icon, children, className = "" }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-6 items-center justify-center">{icon}</div>
      <span className={cn("inline-flex rounded-[10px] px-3 py-1 text-xs font-bold text-black sm:text-sm", className)}>{children}</span>
    </div>
  );
}

function QuestCard({ quest, featured = false }: { quest: DashboardQuestItem; featured?: boolean }) {
  return (
    <Surface className={cn(featured ? "p-5 sm:p-7" : "p-4 sm:p-5")}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={cn("font-bold text-base-content", featured ? "text-[clamp(1.6rem,3vw,2.25rem)]" : "text-lg sm:text-2xl")}>{quest.title}</h3>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-right">
            <p className={cn("font-bold text-base-content", featured ? "text-xl sm:text-2xl" : "text-sm sm:text-lg")}>{quest.owner}</p>
            <p className={cn("font-medium text-base-content/50", featured ? "text-sm sm:text-lg" : "text-xs sm:text-sm")}>{quest.role}</p>
          </div>
          <div className={cn("shrink-0 rounded-[14px] bg-base-300", featured ? "size-16 sm:size-[75px]" : "size-12 sm:size-14")} />
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
        <button type="button" className={cn("btn border-none bg-primary text-primary-content shadow-none hover:opacity-90", featured ? "h-12 min-h-12 rounded-[14px] px-10 text-lg" : "h-10 min-h-10 rounded-[10px] px-6 text-sm sm:h-11 sm:min-h-11")}>
          Detail
        </button>
      </div>
    </Surface>
  );
}

function DashboardComponent() {
  return (
    <div className="flex flex-col gap-4">
      <Surface className="overflow-hidden p-3 sm:p-4">
        <div className="carousel w-full gap-3 overflow-x-auto rounded-[16px]">
          {dashboardCarouselItems.map((item, index) => (
            <div
              key={item.title}
              className={cn(
                "carousel-item relative overflow-hidden rounded-[16px] border border-base-300/60",
                index === 0 ? "h-44 w-[84%] sm:h-56 md:w-[72%] lg:h-72 xl:h-[392px] xl:w-[64%]" : "h-44 w-[56%] sm:h-56 md:w-[46%] lg:h-72 xl:h-[392px] xl:w-[36%]"
              )}
            >
              <div className={cn("relative flex h-full w-full flex-col justify-between p-5 sm:p-7", "bg-gradient-to-br", item.accent)}>
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
            <span key={item.title} className={cn("h-2.5 w-2.5 rounded-full", index === 0 ? "bg-base-content" : "bg-base-300")} />
          ))}
        </div>
      </Surface>

      <Surface className="bg-base-200/60 p-4 sm:p-5 xl:p-6">
        <div className="mb-4 flex items-center gap-3 sm:mb-5">
          <LiveIcon className="size-5 text-[#FF1616] sm:size-6" />
          <h2 className="text-base font-bold text-base-content sm:text-2xl">Sedang Berlangsung</h2>
        </div>

        <div className="space-y-4 xl:hidden">
          {liveQuestItems.map((quest) => (
            <QuestCard key={quest.title} quest={quest} />
          ))}
        </div>

        <div className="hidden xl:block">
          <QuestCard quest={liveQuestItems[0]} featured />
        </div>
      </Surface>
    </div>
  );
}

export default DashboardComponent;

