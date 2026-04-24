import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getValidAuthSession } from "./auth.guard";

export function AuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const session = getValidAuthSession();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: { children: ReactNode }) {
  const session = getValidAuthSession();

  if (session) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
