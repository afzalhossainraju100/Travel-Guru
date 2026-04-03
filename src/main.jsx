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
import Booking from "./Components/Booking/Booking.jsx";
import Blog from "./Components/Blog/Blog.jsx";
import PrivateRoutes from "./Routes/PrivateRoutes.jsx";
import Packages from "./Components/Packages/Packages.jsx";
import PackageDetails from "./Components/PackageDetails/PackageDetails.jsx";
import Ledger from "./Components/Ledger/Ledger.jsx";
import Payment from "./Components/Payment/Payment.jsx";
import Profile from "./Components/Profile/Profile.jsx";

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
        path: "/booking",
        Component: () => (
          <PrivateRoutes>
            <Booking />
          </PrivateRoutes>
        ),
      },
      {
        path: "/ledger/:id",
        Component: () => (
          <PrivateRoutes>
            <Ledger />
          </PrivateRoutes>
        ),
      },
      {
        path: "/payment",
        Component: () => (
          <PrivateRoutes>
            <Payment />
          </PrivateRoutes>
        ),
      },
      {
        path: "/blog",
        Component: () => (
          <PrivateRoutes>
            <Blog />
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
