import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Roots from "./Layouts/Roots.jsx";
import Home from "./Components/Home/Home.jsx";
import Login from "./Components/Login/Login.jsx";
import Register from "./Components/Register/Register.jsx";
import AuthProvider from "./Contextx/AuthContext/AuthProvider.jsx";
import Orders from "./Components/Orders/Orders.jsx";
import Profile from "./Components/Profile/Profile.jsx";
import PrivateRoutes from "./Routes/PrivateRoutes.jsx";
import Packages from "./Components/Packages/Packages.jsx";
import PackageDetails from "./Components/PackageDetails/PackageDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Roots,
    children: [
      {
        index: true,
        path: "/",
        Component: Home,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/orders",
        Component: () => (
          <PrivateRoutes>
            <Orders />
          </PrivateRoutes>
        ),
      },
      {
        path: "/profile",
        Component: () => (
          <PrivateRoutes>
            <Profile />
          </PrivateRoutes>
        ),
      },
      {
        path: "/packages",
        element: (
          <PrivateRoutes>
            <Packages />
          </PrivateRoutes>
        ),
      },
      {
        path: "/packages/:id",
        Component: () => (
          <PrivateRoutes>
            <PackageDetails />
          </PrivateRoutes>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
