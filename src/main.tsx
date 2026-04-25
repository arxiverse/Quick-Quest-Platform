import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { AppRoot } from "./app/app.tsx"; // ClientSide
import { AdministratorRoot } from "./admin/app.tsx"; // AdminSide
import { AdminRouteProvider } from "./admin/route.context.tsx";
import { RouteProvider } from "./app/route.context.tsx";
import { AuthProvider } from "./app/auth.context.tsx";
import { initializeTheme } from "./app/global.theme";
import GlobalEndpoint, {
  clearAccessToken,
  requestJson,
} from "./app/global.service";
import "./index.css";

// Inisialisasi theme secara global SEBELUM render apapun untuk mencegah reverting ke default DaisyUI
initializeTheme();

// Extreme Single URL Architecture Enforcement
// Jika ada user iseng ngetik /login atau /home di address bar, kita putar balik secara siluman (tanpa reload) ke "/"
if (window.location.pathname !== "/") {
  window.history.replaceState(null, "", "/");
}

// main.tsx

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

type RootMode = "app" | "admin";
const ROOT_MODE_STORAGE_KEY = "qqm-root-shell-mode";
const ROOT_PAGE_STORAGE_KEY = "qqm-root-shell-page";
const ADMIN_ROOT_PAGE = "admin-side";

function readPersistedRootMode(): RootMode {
  if (typeof window === "undefined") {
    return "app";
  }

  const storedMode = window.localStorage.getItem(ROOT_MODE_STORAGE_KEY)?.trim();
  return storedMode === "admin" ? "admin" : "app";
}

function persistAdminRootState(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ROOT_MODE_STORAGE_KEY, "admin");
  window.localStorage.setItem(ROOT_PAGE_STORAGE_KEY, ADMIN_ROOT_PAGE);
}

function RootShell() {
  const [rootMode, setRootMode] = useState<RootMode>(readPersistedRootMode);

  useEffect(() => {
    function handleEnterAdminPanel() {
      void (async () => {
        try {
          await requestJson(GlobalEndpoint().auth.logout, { method: "POST" });
        } catch {
          // Best effort only. Admin-side entry tetap lanjut walau logout backend gagal.
        }

        clearAccessToken();

        if (typeof window !== "undefined") {
          window.sessionStorage.clear();
          window.localStorage.clear();
          persistAdminRootState();
        }

        setRootMode("admin");
      })();
    }

    window.addEventListener("qqm-enter-admin-panel", handleEnterAdminPanel);
    return () => {
      window.removeEventListener(
        "qqm-enter-admin-panel",
        handleEnterAdminPanel,
      );
    };
  }, []);

  if (rootMode === "admin") {
    return (
      <AdminRouteProvider>
        <AdministratorRoot />
      </AdminRouteProvider>
    );
  }

  return (
    <RouteProvider>
      <AuthProvider>
        <AppRoot />
      </AuthProvider>
    </RouteProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootShell />
  </StrictMode>,
);
