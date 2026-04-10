import LoginComponent from "./login/login.tsx";
import RegisterComponent from "./register/register.tsx";
import HomeComponent from "./home/home.tsx";

import { Navigate } from "react-router-dom";
import { AuthGuard, GuestGuard } from "./auth.guard.tsx";

export const RoutesComponent = [
  {
    path: "/login",
    element: (
      <GuestGuard>
        <LoginComponent />
      </GuestGuard>
    )
  },
  {
    path: "/register",
    element: (
      <GuestGuard>
        <RegisterComponent />
      </GuestGuard>
    )
  },
  {
    path: "/home",
    element: (
      <AuthGuard>
        <HomeComponent />
      </AuthGuard>
    )
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />
  }
];
