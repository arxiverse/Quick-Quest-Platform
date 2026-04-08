import { useEffect, useState, type CSSProperties, type ComponentType } from "react";
import NavbarComponent from "./component/navbar/navbar.tsx";
import HeaderComponent from "./component/header/header.tsx";
import NotificationComponent from "./component/notification/notification.tsx";
import ProfileComponent, { ProfileContent } from "./component/profile/profile.tsx";
import DashboardComponent from "./content/dashboard/dashboard.tsx";
import AnalysisComponent from "./content/analysis/analysis.tsx";
import RunnerComponent from "./content/runner/runner.tsx";
import RecentComponent from "./content/recent/recent.tsx";
import LeaderboardComponent from "./content/leaderboard/leaderboard.tsx";
import ChatComponent from "./content/chat/chat.tsx";
import GiverComponent from "./content/giver/giver.tsx";
import ElementComponent from "./content/element/element.tsx";
import { homeIconRegistry } from "./home.icons";
import {
  HOME_ACTIVE_VIEW_STORAGE_KEY,
  desktopNavItems,
  getHomeViewMeta,
  homeActionItems,
  homeNotifications,
  homeProfile,
  initialHomeView,
  mobileNavItems,
  mobileShortcutItems,
} from "./home.service";
import { cn, Surface } from "./home.ui";
import { isHomeView, type HomeNavItem, type HomeView } from "./home";

type ContentComponent = ComponentType;

const contentRegistry: Record<HomeView, ContentComponent> = {
  dashboard: DashboardComponent,
  analysis: AnalysisComponent,
  runner: RunnerComponent,
  recent: RecentComponent,
  leaderboard: LeaderboardComponent,
  chat: ChatComponent,
  giver: GiverComponent,
  element: ElementComponent,
  profile: () => <ProfileContent profile={homeProfile} />,
};

function getInitialActiveView(): HomeView {
  if (typeof window === "undefined") {
    return initialHomeView;
  }

  const storedView = window.localStorage.getItem(HOME_ACTIVE_VIEW_STORAGE_KEY);
  return storedView && isHomeView(storedView) ? storedView : initialHomeView;
}

function MobileShortcutNav({
  items,
  activeView,
  onViewChange,
}: {
  items: HomeNavItem[];
  activeView: HomeView;
  onViewChange: (view: HomeView) => void;
}) {
  return (
    <Surface className="p-3 xl:hidden">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((item) => {
          const Icon = homeIconRegistry[item.iconKey];
          const active = item.view === activeView;
          return (
            <button
              key={item.key}
              type="button"
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-[14px] border px-3 py-2 text-sm font-semibold transition-colors",
                active
                  ? "border-[#8B3DFF] bg-[#A046FF] text-white"
                  : "border-base-300 bg-base-100 text-base-content/70 hover:border-primary/25 hover:bg-base-200/60"
              )}
              onClick={() => item.view && onViewChange(item.view)}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </Surface>
  );
}

function HomeHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <Surface className="hidden overflow-hidden p-4 sm:p-5 xl:block">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-base-content/45">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-base-content sm:text-3xl xl:max-w-[15ch] xl:text-[2.15rem]">{title}</h1>
        <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-base-content/65 sm:text-base">{description}</p>
      </div>
    </Surface>
  );
}

function HomeComponent() {
  const [activeView, setActiveView] = useState<HomeView>(getInitialActiveView);
  const ActiveContent = contentRegistry[activeView];
  const activeMeta = getHomeViewMeta(activeView);
  const isProfileView = activeView === "profile";
  const desktopShellStyle = {
    "--desktop-left-offset": "calc(clamp(15rem,16vw,18rem) + 1.25rem)",
    "--desktop-right-offset": isProfileView ? "0rem" : "calc(clamp(18rem,19vw,24rem) + 1.25rem)",
    "--desktop-page-pad": "1rem",
  } as CSSProperties;

  useEffect(() => {
    window.localStorage.setItem(HOME_ACTIVE_VIEW_STORAGE_KEY, activeView);
  }, [activeView]);

  return (
    <div
      style={desktopShellStyle}
      className="theme-bg min-h-screen bg-base-200 px-2 py-3 text-base-content sm:px-4 sm:py-4 2xl:px-6"
    >
      <NavbarComponent
        items={desktopNavItems}
        mobileItems={mobileNavItems}
        actions={homeActionItems}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {!isProfileView && (
        <aside className="hidden xl:fixed xl:right-4 xl:top-4 xl:z-20 xl:block xl:h-[calc(100vh-2rem)] xl:w-[clamp(18rem,19vw,24rem)]">
          <NotificationComponent
            notifications={homeNotifications}
            profile={homeProfile}
            onProfileOpen={() => setActiveView("profile")}
            className="h-full"
          />
        </aside>
      )}

      <div className="w-full min-w-0 xl:pl-[var(--desktop-left-offset)] xl:pr-[var(--desktop-right-offset)]">
        {!isProfileView && (
          <>
            <div className="xl:hidden">
              <HeaderComponent meta={activeMeta} profile={homeProfile} onProfileOpen={() => setActiveView("profile")} />
            </div>
            <div className="hidden xl:block">
              <div className="fixed left-[calc(var(--desktop-page-pad)+var(--desktop-left-offset))] right-[calc(var(--desktop-page-pad)+var(--desktop-right-offset))] top-4 z-30">
                <HeaderComponent
                  meta={activeMeta}
                  profile={homeProfile}
                  onProfileOpen={() => setActiveView("profile")}
                  variant="toolbar"
                />
              </div>
            </div>
            <div className="mt-4">
              <MobileShortcutNav items={mobileShortcutItems} activeView={activeView} onViewChange={setActiveView} />
            </div>
          </>
        )}

        <main className={cn("min-w-0 pb-24", !isProfileView && "mt-4 xl:mt-[6.75rem]")}>
          <div className="flex flex-col gap-5">
            {isProfileView && (
              <div className="xl:hidden">
                <ProfileComponent profile={homeProfile} className="w-full" />
              </div>
            )}
            {!isProfileView && <HomeHero eyebrow={activeMeta.eyebrow} title={activeMeta.title} description={activeMeta.description} />}
            <ActiveContent />
            {!isProfileView && <NotificationComponent notifications={homeNotifications} className="xl:hidden" />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomeComponent;
