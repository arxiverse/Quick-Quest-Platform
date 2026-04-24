import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RoutesComponent } from "./app/app.routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RoleProvider } from "./app/home/role.context";
import "./index.css";
const router = createBrowserRouter(RoutesComponent);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RoleProvider>
      <RouterProvider router={router}></RouterProvider>
    </RoleProvider>
  </StrictMode>,
);
