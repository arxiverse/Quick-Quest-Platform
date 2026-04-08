import { useEffect, useState, type ComponentType } from "react";
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
import {
  HOME_ACTIVE_VIEW_STORAGE_KEY,
  desktopNavItems,
  getHomeViewMeta,
  homeActionItems,
  homeNotifications,
  homeProfile,
  initialHomeView,
  mobileNavItems,
} from "./home.service";
import { isHomeView, type HomeView } from "./home";

type ContentComponent = ComponentType;

const contentRegistry: Record<HomeView, ContentComponent> = {
  dashboard: DashboardComponent,
  analysis: AnalysisComponent,
  runner: RunnerComponent,
  recent: RecentComponent,
  leaderboard: LeaderboardComponent,
  chat: ChatComponent,
  giver: GiverComponent,
  profile: () => <ProfileContent profile={homeProfile} />,
};

function getInitialActiveView(): HomeView {
  if (typeof window === "undefined") {
    return initialHomeView;
  }

  const storedView = window.localStorage.getItem(HOME_ACTIVE_VIEW_STORAGE_KEY);
  return storedView && isHomeView(storedView) ? storedView : initialHomeView;
}

function HomeComponent() {
  const [activeView, setActiveView] = useState<HomeView>(getInitialActiveView);
  const ActiveContent = contentRegistry[activeView];
  const activeMeta = getHomeViewMeta(activeView);
  const isProfileView = activeView === "profile";

  useEffect(() => {
    window.localStorage.setItem(HOME_ACTIVE_VIEW_STORAGE_KEY, activeView);
  }, [activeView]);

  return (
    <div className="theme-bg min-h-screen bg-base-200 px-2 py-3 text-base-content sm:px-4 sm:py-4">
      <div className={isProfileView ? "mx-auto max-w-[1720px] xl:grid xl:grid-cols-[17rem_minmax(0,1fr)] xl:gap-4" : "mx-auto max-w-[1720px] xl:grid xl:grid-cols-[17rem_minmax(0,1fr)_21rem] xl:gap-4"}>
        <NavbarComponent
          items={desktopNavItems}
          mobileItems={mobileNavItems}
          actions={homeActionItems}
          activeView={activeView}
          onViewChange={setActiveView}
        />

        <main className="min-w-0 pb-24 xl:pb-0">
          <div className="flex flex-col gap-4">
            {!isProfileView && <HeaderComponent meta={activeMeta} profile={homeProfile} onProfileOpen={() => setActiveView("profile")} />}
            {isProfileView && (
              <div className="xl:hidden">
                <ProfileComponent profile={homeProfile} className="w-full" />
              </div>
            )}
            <ActiveContent />
            {!isProfileView && <NotificationComponent notifications={homeNotifications} className="xl:hidden" />}
          </div>
        </main>

        {!isProfileView && (
          <aside className="hidden xl:block">
            <div className="sticky top-3">
              <NotificationComponent notifications={homeNotifications} profile={homeProfile} onProfileOpen={() => setActiveView("profile")} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default HomeComponent;
