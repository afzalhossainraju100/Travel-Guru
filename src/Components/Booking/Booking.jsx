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

        {type === "booking" && (
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            {viewerRole === "admin" ? (
              <p>
                Customer:{" "}
                <span className="font-semibold">
                  {item.userName || item.userId || "Unknown"}
                </span>
              </p>
            ) : null}
            <p>
              Travelers:{" "}
              <span className="font-semibold">
                {item.numberOfTravelers || 1}
              </span>
            </p>
            <p>
              Travel Date:{" "}
              <span className="font-semibold">
                {item.travelDate || "Not set"}
              </span>
            </p>
            <p>
              Status:{" "}
              <span className="font-semibold text-emerald-700">
                {item.status || "confirmed"}
              </span>
            </p>
            <p>
              Payment Status:{" "}
              <span className="font-semibold text-cyan-900">
                {item.paymentStatus || "pending"}
              </span>
            </p>
            {item.transactionId && (
              <p>
                Transaction:{" "}
                <span className="font-semibold">{item.transactionId}</span>
              </p>
            )}
            {item.specialRequests && (
              <p>
                Requests:{" "}
                <span className="font-semibold">{item.specialRequests}</span>
              </p>
            )}

            {String(item.paymentStatus || "pending").toLowerCase() ===
              "pending" && (
              <button
                type="button"
                onClick={() => handleGoToPayment(item)}
                className="mt-3 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Payment
              </button>
            )}
          </div>
        )}

        {type === "wishlist" && (item._id || item.id) && (
          <div className="mt-4 flex items-center gap-2">
            <Link
              to={`/packages/${item._id || item.id}`}
              className="inline-flex rounded-lg bg-cyan-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
            >
              Package Details
            </Link>
          </div>
        )}
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-100 via-cyan-50 to-white px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-3 text-3xl font-extrabold text-slate-800 md:text-4xl">
          {viewerRole === "admin" ? "All Booking Records" : "My Travel Lists"}
        </h1>
        <p className="mb-8 text-slate-600">
          {viewerRole === "admin"
            ? "Review all customer bookings for operational and revenue decisions."
            : "View your confirmed bookings and the packages you saved for the future."}
        </p>

        {loading ? (
          <div className="rounded-2xl border border-cyan-100 bg-white/95 p-8 text-center shadow-lg">
            <p className="text-lg font-semibold text-slate-700">
              Loading your travel lists...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white/95 p-8 text-center shadow-lg">
            <p className="text-lg font-semibold text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <section className="mb-12">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-slate-800">
                  {viewerRole === "admin" ? "All Bookings" : "Booking List"}
                </h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  {bookings.length} items
                </span>
              </div>

              {!bookings.length ? (
                <div className="rounded-2xl border border-cyan-100 bg-white/95 p-8 text-center shadow-lg">
                  <p className="text-lg font-semibold text-slate-700">
                    No bookings found yet.
                  </p>
                  <p className="mt-2 text-slate-600">
                    Book a package from the package details page to see it here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {bookings.map((booking) =>
                    renderBookingCard(booking, "booking"),
                  )}
                </div>
              )}
            </section>

            <section>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-slate-800">Wish List</h2>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
                  {wishlist.length} items
                </span>
              </div>

              {!wishlist.length ? (
                <div className="rounded-2xl border border-rose-100 bg-white/95 p-8 text-center shadow-lg">
                  <p className="text-lg font-semibold text-slate-700">
                    No wishlist packages yet.
                  </p>
                  <p className="mt-2 text-slate-600">
                    Use the wish button on package details to save a location
                    for future tours.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {wishlist.map((item) => renderBookingCard(item, "wishlist"))}
                </div>
              )}
            </section>
          </>
        )}

        
  export default Booking;