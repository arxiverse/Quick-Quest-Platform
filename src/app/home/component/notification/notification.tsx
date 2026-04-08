import ProfileComponent from "../profile/profile.tsx";
import { ChevronDownIcon, FilterIcon, HistoryIcon, SearchIcon } from "../../home.icons";
import { cn, Surface } from "../../home.ui";
import type { NotificationProps } from "./notification";

function NotificationComponent({ notifications, profile, onProfileOpen, className = "" }: NotificationProps) {
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
          <div className="badge badge-ghost border-base-300 bg-base-100 text-base-content/60">{notifications.length} baru</div>
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

        <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 xl:mt-6">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-[14px] border border-base-300/70 bg-base-200/40 p-3 transition-colors hover:bg-base-200/65 sm:p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-base-100 shadow-sm">
                  <span className="size-2.5 rounded-full bg-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-base-content">{notification.title}</p>
                    <span className="badge badge-ghost border-base-300 bg-base-100 text-[11px] text-base-content/65">{notification.tag}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-base-content/65">{notification.description}</p>
                  <p className="mt-2 text-xs font-medium text-base-content/45">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

export default NotificationComponent;
