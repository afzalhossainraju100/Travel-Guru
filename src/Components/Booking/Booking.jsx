import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import {
  getBookingsByUser,
  removeBookingForUser,
} from "../../services/bookingService";
import {
  getWishlistByUser,
  removeWishlistForUser,
} from "../../services/wishlistService";

const Booking = () => {
  const { user } = useContext(AuthContext) || {};
  const userIdentifier = user?.uid || user?.email;
  const [, setRefreshTick] = useState(0);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const bdtFormatter = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  });

  const bookings = getBookingsByUser(userIdentifier);
  const wishlist = getWishlistByUser(userIdentifier);

  const handleRemoveWish = (packageId) => {
    removeWishlistForUser(userIdentifier, packageId);
    setRefreshTick((current) => current + 1);
  };

  const handleRemoveBooking = (bookingId) => {
    removeBookingForUser(userIdentifier, bookingId);
    setRefreshTick((current) => current + 1);
    setBookingToDelete(null);
  };

  const requestRemoveBooking = (booking) => {
    setBookingToDelete(booking);
  };

  const cancelRemoveBooking = () => {
    setBookingToDelete(null);
  };

  const renderPackageCard = (item, type) => (
    <article
      key={item.bookingId || item.wishlistId || item.id}
      className="overflow-hidden rounded-2xl border border-cyan-100 bg-white/95 shadow-md"
    >
      <img
        src={item.image}
        alt={item.title}
        className="h-44 w-full object-cover"
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{item.title}</h2>
            <p className="mt-1 text-slate-600">{item.location}</p>
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
            <button
              type="button"
              onClick={() =>
                type === "booking"
                  ? requestRemoveBooking(item)
                  : handleRemoveWish(item.id)
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
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-500">{item.duration}</p>
        <p className="mt-3 text-lg font-bold text-emerald-700">
          {bdtFormatter.format(item.priceBdt)}
        </p>

        {type === "booking" && (
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <p>
              Travelers:{" "}
              <span className="font-semibold">{item.travelerCount || 1}</span>
            </p>
            {item.totalPrice && (
              <p>
                Total Paid:{" "}
                <span className="font-semibold">
                  {bdtFormatter.format(item.totalPrice)}
                </span>
              </p>
            )}
            {item.paymentStatus && (
              <p>
                Status:{" "}
                <span className="font-semibold text-emerald-700">
                  {item.paymentStatus}
                </span>
              </p>
            )}
            <p>
              Agency Contact:{" "}
              <span className="font-semibold text-cyan-900">
                +880 1516503901
              </span>
            </p>
          </div>
        )}

        {type === "wishlist" && item.id && (
          <div className="mt-4 flex items-center gap-2">
            <Link
              to={`/packages/${item.id}`}
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
          My Travel Lists
        </h1>
        <p className="mb-8 text-slate-600">
          View both your confirmed bookings and the packages you saved for the
          future.
        </p>

        <section className="mb-12">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-800">Booking List</h2>
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
              {bookings.map((booking) => renderPackageCard(booking, "booking"))}
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
                Use the wish button on package details to save a location for
                future tours.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((item) => renderPackageCard(item, "wishlist"))}
            </div>
          )}
        </section>

        {bookingToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-800">
                Confirm Delete
              </h3>
              <p className="mt-3 text-slate-600">
                Are you sure you want to remove
                <span className="font-semibold text-slate-800">
                  {` ${bookingToDelete.title}`}
                </span>
                from your booking list?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelRemoveBooking}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveBooking(bookingToDelete.bookingId)}
                  className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
