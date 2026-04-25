import AdminLoginComponent from "./admin-login/admin-login.tsx";
import AdministratorComponent from "./administrator/administrator.tsx";
import { useAdminRoute } from "./route.context.tsx";

export function AdministratorRoot() {
  const { currentView } = useAdminRoute();

  if (currentView === "login") {
    return <AdminLoginComponent />;
  }

  if (currentView === "administrator") {
    return <AdministratorComponent />;
  }

  return null;
}
