import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import {
  getAllBookings,
  getBookingsByUser,
  removeBookingForUser,
} from "../../services/bookingService";
import { fetchUserByEmail } from "../../services/userService";
import {
  getWishlistByUser,
  removeWishlistForUser,
} from "../../services/wishlistService";

const Booking = () => {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const userIdentifier = user?.email || user?.uid;
  const [viewerRole, setViewerRole] = useState("user");
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const bdtFormatter = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  });

  const loadTravelLists = async () => {
    try {
      setLoading(true);
      setError("");

      const viewerProfile = user?.email
        ? await fetchUserByEmail(user.email)
        : null;
      const normalizedRole = String(viewerProfile?.role || "user")
        .trim()
        .toLowerCase();
      const isAdminViewer =
        normalizedRole === "admin" || normalizedRole === "administrator";

      setViewerRole(isAdminViewer ? "admin" : "user");

      const [nextBookings, nextWishlist] = await Promise.all([
        isAdminViewer ? getAllBookings() : getBookingsByUser(userIdentifier),
        getWishlistByUser(userIdentifier),
      ]);

      setBookings(nextBookings || []);
      setWishlist(nextWishlist || []);
    } catch (loadError) {
      setError(loadError?.message || "Failed to load travel lists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTravelLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdentifier]);

  const handleRemoveWish = async (packageId) => {
    await removeWishlistForUser(userIdentifier, packageId);
    await loadTravelLists();
  };

  const handleRemoveBooking = async (bookingId) => {
    if (viewerRole !== "admin") {
      setError("Only admin can remove booking information.");
      return;
    }

    await removeBookingForUser(bookingId);
    setBookingToDelete(null);
    await loadTravelLists();
  };

  const handleGoToPayment = (booking) => {
    navigate("/payment", {
      state: { booking },
    });
  };

  const renderBookingCard = (item, type) => (
    <article
      key={item._id || item.bookingId || item.wishlistId || item.id}
      className="overflow-hidden rounded-2xl border border-cyan-100 bg-white/95 shadow-md"
    >
      <img
        src={item.packageImage || item.image || item.image2}
        alt={item.packageName || item.title}
        className="h-44 w-full object-cover"
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {item.packageName || item.title}
            </h2>
            <p className="mt-1 text-slate-600">
              {item.packageLocation || item.location}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                type === "booking"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {type === "booking" ? "Booked" : "Wishlist"}
            </span>
            {(type === "wishlist" || viewerRole === "admin") && (
              <button
                type="button"
                onClick={() =>
                  type === "booking"
                    ? setBookingToDelete(item)
                    : handleRemoveWish(item._id || item.id)
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                aria-label={`Remove from ${type}`}
                title="Remove"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 6h18"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 6V4h8v2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 6l-1 14H6L5 6"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 11v6M14 11v6"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          {type === "booking"
            ? `Booked on ${new Date(item.bookingDate).toLocaleDateString("en-GB")}`
            : item.duration || "Saved for later"}
        </p>
        <p className="mt-3 text-lg font-bold text-emerald-700">
          {bdtFormatter.format(
            Number(item.totalPrice || item.packagePrice || item.priceBdt || 0),
          )}
        </p>

        
  export default Booking;