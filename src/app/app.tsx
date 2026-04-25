import { useRoute } from "./route.context";
import { AuthGuard, GuestGuard } from "./auth.guard.tsx";
import LoginComponent from "./login/login.tsx";
import RegisterComponent from "./register/register.tsx";
import HomeComponent from "./home/home.tsx";
import { RoleProvider } from "./home/role.context.tsx";

export function AppRoot() {
  const { currentView } = useRoute();

  if (currentView === "login") {
    return (
      <GuestGuard>
        <LoginComponent />
      </GuestGuard>
    );
  }

  if (currentView === "register") {
    return (
      <GuestGuard>
        <RegisterComponent />
      </GuestGuard>
    );
  }

  if (currentView === "home") {
    return (
      <AuthGuard>
        <RoleProvider>
          <HomeComponent />
        </RoleProvider>
      </AuthGuard>
    );
  }

  return null;
}
