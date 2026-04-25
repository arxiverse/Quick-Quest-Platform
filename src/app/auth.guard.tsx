import { useEffect, type ReactNode } from "react";
import { useRoute } from "./route.context";
import { useAuth } from "./auth.context";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { navigate } = useRoute();
  const { isAuthenticated, isAuthReady } = useAuth();

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }
    if (!isAuthenticated) {
      navigate("login");
    }
  }, [isAuthenticated, isAuthReady, navigate]);

  if (!isAuthReady || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: { children: ReactNode }) {
  const { navigate } = useRoute();
  const { isAuthenticated, isAuthReady } = useAuth();

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }
    if (isAuthenticated) {
      navigate("home");
    }
  }, [isAuthenticated, isAuthReady, navigate]);

  if (!isAuthReady || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
