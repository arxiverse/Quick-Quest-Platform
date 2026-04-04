import LoginComponent from "./login/login.tsx";
import RegisterComponent from "./register/register.tsx";
import { Navigate } from "react-router-dom";
import HomeComponent from "./home/home.tsx";


export const RoutesComponent = [
    { path: "/login",element: <LoginComponent />},
    { path: "/register",element: <RegisterComponent />},
    { path: "*", element: <Navigate to="/login" /> }
]