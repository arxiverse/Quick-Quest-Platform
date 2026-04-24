import ProfileComponent from "../profile/profile.tsx";
import { ChevronDownIcon, FilterIcon, HistoryIcon, SearchIcon } from "../../home.icons";
import { cn, Surface } from "../../home.ui";
import type { NotificationProps } from "./notification";

const EVENT_ICON_MAP: Record<string, string> = {
  Quest:    "⚡",
  Brief:    "📋",
  Insight:  "📈",
  Chat:     "💬",
  Ranking:  "🏆",
  Escrow:   "💰",
  Dispute:  "⚠️",
  Match:    "🎯",
  Release:  "✅",
  Rating:   "⭐",
};

const EVENT_TONE_MAP: Record<string, string> = {
  Quest:    "bg-[#FEE2E2] text-[#B91C1C]",
  Brief:    "bg-[#E9D5FF] text-[#6D28D9]",
  Insight:  "bg-[#DCFCE7] text-[#166534]",
  Chat:     "bg-[#DBEAFE] text-[#1D4ED8]",
  Ranking:  "bg-[#FEF3C7] text-[#92400E]",
  Escrow:   "bg-[#DCFCE7] text-[#166534]",
  Dispute:  "bg-[#FEE2E2] text-[#B91C1C]",
  Match:    "bg-[#E9D5FF] text-[#6D28D9]",
  Release:  "bg-[#DCFCE7] text-[#166534]",
  Rating:   "bg-[#FEF3C7] text-[#92400E]",
};

const GROUPS = [
  { label: "Hari Ini", ids: [1, 2, 3, 4, 5, 6] },
  { label: "Kemarin", ids: [7, 8, 9, 10] },
];

function NotificationComponent({ notifications, profile, onProfileOpen, className = "" }: NotificationProps) {
  // Deduplicate and group by time label
  const todayIds = new Set(GROUPS[0].ids);

  const today = notifications.filter((n) => todayIds.has(n.id));
  const yesterday = notifications.filter((n) => !todayIds.has(n.id));

  return (
    <div className={cn("space-y-4", className)}>
      {profile && (
        <button type="button" className="hidden w-full text-left xl:block" onClick={onProfileOpen}>
          <ProfileComponent profile={profile} className="hidden xl:flex" />
        </button>
      )}

      <Surface className="flex h-full min-h-0 flex-col p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-base-content/45">Pusat Update</p>
            <h2 className="mt-1 text-lg font-bold text-base-content/85 sm:text-2xl">Notifikasi</h2>
          </div>
          <div className="badge badge-ghost border-base-300 bg-base-100 text-base-content/60">
            {notifications.length} baru
          </div>
        </div>

        <div className="grid shrink-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] xl:grid-cols-1">
          <label className="input input-bordered flex h-12 items-center gap-2 rounded-[12px] border-base-300 bg-base-100 px-4 shadow-none transition-colors focus-within:border-primary/40 xl:h-[61px]">
            <SearchIcon className="size-4 text-base-content/50" />
            <input type="text" placeholder="Terbaru" className="grow text-sm font-semibold text-base-content/60" />
            <ChevronDownIcon className="size-4 text-base-content/50" />
          </label>
          <label className="input input-bordered flex h-12 items-center gap-2 rounded-[12px] border-base-300 bg-base-100 px-4 shadow-none transition-colors focus-within:border-primary/40 xl:h-[61px]">
            <HistoryIcon className="size-4 text-base-content/50" />
            <input type="text" placeholder="Quest" className="grow text-sm font-semibold text-base-content/60" />
            <ChevronDownIcon className="size-4 text-base-content/50" />
          </label>
          <button type="button" className="btn h-12 min-h-12 rounded-[12px] border-base-300 bg-base-100 px-4 text-base-content/60 shadow-none transition-colors hover:border-primary/30 hover:bg-base-100 xl:h-[61px] xl:min-h-[61px]">
            <FilterIcon className="size-5" />
          </button>
        </div>

        <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1 xl:mt-6">
          {/* Today group */}
          {today.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-base-content/40">
                Hari Ini
              </p>
              <div className="space-y-2.5">
                {today.map((notification) => {
                  const icon = EVENT_ICON_MAP[notification.tag] ?? "🔔";
                  const tone = EVENT_TONE_MAP[notification.tag] ?? "bg-base-200 text-base-content/70";
                  return (
                    <div
                      key={notification.id}
                      className="rounded-[14px] border border-base-300/70 bg-base-200/40 p-3 transition-colors hover:bg-base-200/65 sm:p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("mt-1 flex size-10 shrink-0 items-center justify-center rounded-[12px] text-lg shadow-sm", tone.split(" ")[0])}>
                          {icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold text-base-content">{notification.title}</p>
                            <span className={cn("badge border-0 text-[11px] font-semibold", tone)}>{notification.tag}</span>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-base-content/65">{notification.description}</p>
                          <p className="mt-2 text-xs font-medium text-base-content/45">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Yesterday group — only shows if there are extra items pushed into homeNotifications */}
          {yesterday.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-base-content/40">
                Kemarin
              </p>
              <div className="space-y-2.5">
                {yesterday.map((notification) => {
                  const icon = EVENT_ICON_MAP[notification.tag] ?? "🔔";
                  const tone = EVENT_TONE_MAP[notification.tag] ?? "bg-base-200 text-base-content/70";
                  return (
                    <div
                      key={notification.id}
                      className="rounded-[14px] border border-base-300/70 bg-base-200/40 p-3 opacity-75 transition-colors hover:opacity-100 hover:bg-base-200/65 sm:p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("mt-1 flex size-10 shrink-0 items-center justify-center rounded-[12px] text-lg shadow-sm", tone.split(" ")[0])}>
                          {icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold text-base-content">{notification.title}</p>
                            <span className={cn("badge border-0 text-[11px] font-semibold", tone)}>{notification.tag}</span>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-base-content/65">{notification.description}</p>
                          <p className="mt-2 text-xs font-medium text-base-content/45">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Surface>
    </div>
  );
}

export default NotificationComponent;
