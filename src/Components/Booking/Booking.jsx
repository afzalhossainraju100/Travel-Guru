import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import { getBookingsByUser } from "../../services/bookingService";
import { getWishlistByUser } from "../../services/wishlistService";

const Booking = () => {
  const { user } = useContext(AuthContext) || {};
  const userIdentifier = user?.uid || user?.email;

  const bdtFormatter = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  });

  const bookings = getBookingsByUser(userIdentifier);
  const wishlist = getWishlistByUser(userIdentifier);

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
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              type === "booking"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {type === "booking" ? "Booked" : "Wishlist"}
          </span>
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
          </div>
        )}

        {type === "wishlist" && item.id && (
          <Link
            to={`/packages/${item.id}`}
            className="mt-4 inline-flex rounded-lg bg-cyan-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            Package Details
          </Link>
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
      </div>
    </div>
  );
};

export default Booking;
