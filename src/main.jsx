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


const PACKAGES_API_URL = "http://localhost:3000/packages";

const resolvePackageId = (idValue) => {
  if (typeof idValue === "string") return idValue;
  if (idValue && typeof idValue === "object") {
    if (typeof idValue.$oid === "string") return idValue.$oid;
    if (typeof idValue.toString === "function") {
      const parsed = idValue.toString();
      if (parsed && parsed !== "[object Object]") return parsed;
    }
  }

  return "";
};

const formatDuration = (duration) => {
  if (typeof duration === "string") return duration;

  if (duration && typeof duration === "object") {
    const days = Number(duration.days || 0);
    const nights = Number(duration.nights || 0);

    if (days > 0 || nights > 0) {
      return `${days} Days / ${nights} Nights`;
    }
  }

  return "Duration not set";
};

const normalizeSpots = (spots) => {
  if (!Array.isArray(spots)) return [];

  return spots
    .map((spot) => {
      if (typeof spot === "string") return spot;
      if (spot && typeof spot === "object") return spot.name || "";
      return "";
    })
    .filter(Boolean);
};

const normalizeSpotImages = (pkg) => {
  if (Array.isArray(pkg?.spotImages)) {
    return pkg.spotImages;
  }

  if (!Array.isArray(pkg?.spots)) return [];

  return pkg.spots
    .filter((spot) => spot && typeof spot === "object" && spot.image)
    .map((spot) => ({
      name: spot.name || "Spot",
      image: spot.image,
    }));
};

const normalizePackage = (pkg) => ({
  ...pkg,
  _id: resolvePackageId(pkg?._id),
  duration: formatDuration(pkg?.duration),
  features: Array.isArray(pkg?.features) ? pkg.features : [],
  spots: normalizeSpots(pkg?.spots),
  spotImages: normalizeSpotImages(pkg),
});

const loadPackages = async () => {
  const response = await fetch(PACKAGES_API_URL);

  if (!response.ok) {
    throw new Error("Failed to load packages from API.");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizePackage) : [];
};

const loadPackageById = async ({ params }) => {
  const packages = await loadPackages();
  return packages.find((pkg) => String(pkg._id) === String(params.id)) || null;
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: Roots,
    children: [
      {
        index: true,
        path: "/",
        Component: Home,
        loader: loadPackages,
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
        loader: loadPackageById,
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
        path: "/Profile",
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
        loader: loadPackages,
      },
      {
        path: "/allPackage",
        element: (
          <PrivateRoutes>
            <Packages />
          </PrivateRoutes>
        ),
        loader: loadPackages,
      },
      {
        path: "/allPackages",
        element: (
          <PrivateRoutes>
            <Packages />
          </PrivateRoutes>
        ),
        loader: loadPackages,
      },
      {
        path: "/packages/:id",
        Component: () => (
          <PrivateRoutes>
            <PackageDetails />
          </PrivateRoutes>
        ),
        loader: loadPackageById,
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
