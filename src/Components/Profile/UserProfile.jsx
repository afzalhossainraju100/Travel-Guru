import React from "react";
import { Link } from "react-router-dom";

const UserProfile = ({ profile }) => {
  const wishlistCount = Array.isArray(profile?.wishlist)
    ? profile.wishlist.length
    : 0;
  const bookingCount = Array.isArray(profile?.bookingHistory)
    ? profile.bookingHistory.length
    : 0;
  const preferences = Array.isArray(profile?.preferences)
    ? profile.preferences
    : [];

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-sky-50 via-cyan-50 to-emerald-50 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-20 top-6 h-56 w-56 rounded-full bg-sky-200 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-emerald-200 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4">
        <div className="rounded-3xl border border-sky-100/80 bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={
                  profile?.profileImage || "https://i.pravatar.cc/120?u=user"
                }
                alt={profile?.name || "User"}
                className="h-16 w-16 rounded-xl border-2 border-sky-200 object-cover"
              />
              <div>
                <p className="text-xs font-semibold tracking-wide text-sky-700 uppercase">
                  Traveler Profile
                </p>
                <h1 className="text-2xl font-black text-slate-900">
                  {profile?.name || "Traveler"}
                </h1>
                <p className="text-sm text-slate-600">{profile?.email || ""}</p>
              </div>
            </div>
            <span className="rounded-full bg-sky-700 px-4 py-2 text-xs font-bold tracking-wide text-white uppercase">
              {profile?.travelStyle || "Travel Style Not Set"}
            </span>
          </div>

          <div className="mt-4">
            <Link
              to="/update-profile"
              className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Update Profile
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Phone
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {profile?.phoneNumber || "Not provided"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Address
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {profile?.address || "Not provided"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Wishlist
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {wishlistCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Bookings
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {bookingCount}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50 p-4">
            <p className="text-xs font-semibold tracking-wide text-sky-800 uppercase">
              Travel Preferences
            </p>
            {preferences.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {preferences.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-800 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                No preferences added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
