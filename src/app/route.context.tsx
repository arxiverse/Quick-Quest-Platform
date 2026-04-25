import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type RouteView = "login" | "register" | "home";
export const ROUTE_VIEW_STORAGE_KEY = "qqm-route-view";

function isRouteView(value: string | null): value is RouteView {
  return value === "login" || value === "register" || value === "home";
}

function resolveInitialRouteView(defaultView: RouteView): RouteView {
  if (typeof window === "undefined") {
    return defaultView;
  }

  const storedView = window.localStorage.getItem(ROUTE_VIEW_STORAGE_KEY);
  return isRouteView(storedView) ? storedView : defaultView;
}

interface RouteContextType {
  currentView: RouteView;
  navigate: (view: RouteView) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function RouteProvider({
  children,
  initialView = "login",
}: {
  children: ReactNode;
  initialView?: RouteView;
}) {
  const [currentView, setCurrentView] = useState<RouteView>(() =>
    resolveInitialRouteView(initialView),
  );

  const contextValue = useMemo<RouteContextType>(
    () => ({
      currentView,
      navigate: (view: RouteView) => {
        setCurrentView(view);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(ROUTE_VIEW_STORAGE_KEY, view);
        }
      },
    }),
    [currentView],
  );

  return (
    <RouteContext.Provider value={contextValue}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  const context = useContext(RouteContext);
  if (!context)
    throw new Error("useRoute harus digunakan di dalam RouteProvider");
  return context;
}
