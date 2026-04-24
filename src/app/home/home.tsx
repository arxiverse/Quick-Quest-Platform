import {
  useEffect,
  useState,
  type CSSProperties,
  type ComponentType,
} from "react";
import NavbarComponent from "./component/navbar/navbar.tsx";
import HeaderComponent from "./component/header/header.tsx";
import NotificationComponent from "./component/notification/notification.tsx";
import ProfileComponent, {
  ProfileContent,
} from "./component/profile/profile.tsx";
import DashboardComponent from "./content/dashboard/dashboard.tsx";
import AnalysisComponent from "./content/analysis/analysis.tsx";
import RunnerComponent from "./content/runner/runner.tsx";
import RecentComponent from "./content/recent/recent.tsx";
import LeaderboardComponent from "./content/leaderboard/leaderboard.tsx";
import ChatComponent from "./content/chat/chat.tsx";
import GiverComponent from "./content/giver/giver.tsx";
import DisputeComponent from "./content/dispute/dispute.tsx";
import ElementComponent from "./content/element/element.tsx";
import PromotionComponent from "./content/promotion/promotion.tsx";
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
} from "./home";
import { cn, Surface } from "./home.ui";
import { isHomeView, type HomeNavItem, type HomeView } from "./home";
import { useAnimationTheme } from "../global.theme";
import TargetCursor from "../../Animation/TargetCursor";
import { useRole } from "./role.context";

type ContentComponent = ComponentType;

const contentRegistry: Record<HomeView, ContentComponent> = {
  dashboard: DashboardComponent,
  analysis: AnalysisComponent,
  runner: RunnerComponent,
  recent: RecentComponent,
  leaderboard: LeaderboardComponent,
  chat: ChatComponent,
  giver: GiverComponent,
  dispute: DisputeComponent,
  element: ElementComponent,
  promotion: PromotionComponent,
  profile: () => <ProfileContent profile={homeProfile} />,
};

function getInitialActiveView(): HomeView {
  if (typeof window === "undefined") {
    return initialHomeView;
  }

  const searchParams = new URLSearchParams(window.location.search);
  if (
    searchParams.get("lbPanel") === "profile" ||
    searchParams.get("lbRunner")
  ) {
    return "leaderboard";
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
                  ? "border-[#2563EB] bg-[#2563EB] text-white"
                  : "border-base-300 bg-base-100 text-base-content/70 hover:border-primary/25 hover:bg-base-200/60",
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

function HomeHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Surface className="hidden overflow-hidden p-4 sm:p-5 xl:block">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-base-content/45">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-base-content sm:text-3xl xl:max-w-[15ch] xl:text-[2.15rem]">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-base-content/65 sm:text-base">
          {description}
        </p>
      </div>
    </Surface>
  );
}

function HomeComponent() {
  const { animationsEnabled } = useAnimationTheme();
  const { role, isGiverVerified, isRoleReady } = useRole();
  const [activeView, setActiveView] = useState<HomeView>(getInitialActiveView);

  function isModeLockedRunnerOnly() {
    return !isGiverVerified;
  }

  function shouldShowNavItem(item: HomeNavItem): boolean {
    if (item.key === "giver") {
      return isGiverVerified && role === "giver";
    }
    if (item.key === "runner") {
      return isModeLockedRunnerOnly() || role === "runner";
    }
    return true;
  }

  const filteredDesktopNavItems = desktopNavItems.filter(shouldShowNavItem);
  const roleAwareMobileNavItems = mobileNavItems.map((item) => {
    if (item.key !== "giver") {
      return item;
    }

    if (isGiverVerified && role === "giver") {
      return item;
    }

    return {
      ...item,
      key: "runner-mobile",
      label: "Runner",
      mobileLabel: "Runner",
      iconKey: "briefcase",
      view: "runner",
    } satisfies HomeNavItem;
  });
  const filteredMobileNavItems = roleAwareMobileNavItems.filter((item) =>
    item.key === "runner-mobile" ? true : shouldShowNavItem(item),
  );
  const filteredShortcutItems = mobileShortcutItems.filter(shouldShowNavItem);

  useEffect(() => {
    let nextView: HomeView | null = null;

    if (!isGiverVerified && activeView === "giver") {
      nextView = "dashboard";
    } else if (isGiverVerified && role === "runner" && activeView === "giver") {
      nextView = "dashboard";
    } else if (isGiverVerified && role === "giver" && activeView === "runner") {
      nextView = "dashboard";
    }

    if (!nextView) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveView(nextView as HomeView);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [role, isGiverVerified, activeView]);

  const ActiveContent = contentRegistry[activeView];
  const activeMeta = getHomeViewMeta(activeView);
  const isProfileView = activeView === "profile";
  const desktopShellStyle = {
    "--desktop-left-offset": "calc(clamp(14.5rem,15vw,17rem) + 1rem)",
    "--desktop-right-offset": isProfileView
      ? "0rem"
      : "calc(clamp(17rem,18vw,22rem) + 1rem)",
    "--desktop-page-pad": "1rem",
  } as CSSProperties;

  useEffect(() => {
    window.localStorage.setItem(HOME_ACTIVE_VIEW_STORAGE_KEY, activeView);
  }, [activeView]);

  if (!isRoleReady) {
    return (
      <div className="theme-bg home-shell flex min-h-screen items-center justify-center bg-base-100 px-4 py-6 text-base-content">
        <Surface className="px-5 py-4">
          <p className="text-sm font-semibold text-base-content/70">
            Memuat Data...
          </p>
        </Surface>
      </div>
    );
  }

  return (
    <div
      style={desktopShellStyle}
      className="theme-bg home-shell min-h-screen bg-base-100 px-2 py-3 text-base-content sm:px-4 sm:py-4 2xl:px-5"
    >
      <NavbarComponent
        items={filteredDesktopNavItems}
        mobileItems={filteredMobileNavItems}
        actions={homeActionItems}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {!isProfileView && (
        <aside className="hidden xl:fixed xl:right-4 xl:top-4 xl:z-20 xl:block xl:h-[calc(100vh-2rem)] xl:w-[clamp(17rem,18vw,22rem)]">
          <NotificationComponent
            notifications={homeNotifications}
            profile={homeProfile}
            onProfileOpen={() => setActiveView("profile")}
            className="h-full"
          />
        </aside>
      )}

      <div className="w-full min-w-0 xl:pl-(--desktop-left-offset) xl:pr-(--desktop-right-offset)">
        {!isProfileView && (
          <>
            <div className="xl:hidden">
              <HeaderComponent
                meta={activeMeta}
                profile={homeProfile}
                onProfileOpen={() => setActiveView("profile")}
              />
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
            <div className="mt-3">
              <MobileShortcutNav
                items={filteredShortcutItems}
                activeView={activeView}
                onViewChange={setActiveView}
              />
            </div>
          </>
        )}

        <main
          className={cn("min-w-0 pb-24", !isProfileView && "mt-3 xl:mt-25")}
        >
          <div className="flex flex-col gap-4">
            {isProfileView && (
              <div className="xl:hidden">
                <ProfileComponent profile={homeProfile} className="w-full" />
              </div>
            )}
            {!isProfileView && (
              <HomeHero
                eyebrow={activeMeta.eyebrow}
                title={activeMeta.title}
                description={activeMeta.description}
              />
            )}
            <ActiveContent />
            {!isProfileView && (
              <NotificationComponent
                notifications={homeNotifications}
                className="xl:hidden"
              />
            )}
          </div>
        </main>
      </div>
      {animationsEnabled && (
        <TargetCursor
          targetSelector=".magnet-btn, .btn, a, button"
          spinDuration={2}
          hideDefaultCursor={true}
        />
      )}

      
    </div>
  );
}

export default HomeComponent;
