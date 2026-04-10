import React from "react";
import { Link } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";

const AdminProfile = ({ profile }) => {
  const bookingCount = Array.isArray(profile?.bookingHistory)
    ? profile.bookingHistory.length
    : 0;
  const wishlistCount = Array.isArray(profile?.wishlist)
    ? profile.wishlist.length
    : 0;
  const preferencesCount = Array.isArray(profile?.preferences)
    ? profile.preferences.length
    : 0;

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-cyan-50 via-sky-50 to-emerald-50 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="absolute -left-24 top-0 h-60 w-60 rounded-full bg-cyan-200 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-60 w-60 rounded-full bg-emerald-200 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4">
        <div className="rounded-3xl border border-cyan-100/80 bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={
                  profile?.profileImage || "https://i.pravatar.cc/120?u=admin"
                }
                alt={profile?.name || "Admin"}
                className="h-16 w-16 rounded-xl border-2 border-cyan-200 object-cover"
              />
              <div>
                <p className="text-xs font-semibold tracking-wide text-cyan-700 uppercase">
                  Admin Profile
                </p>
                <h1 className="text-2xl font-black text-slate-900">
                  {profile?.name || "Administrator"}
                </h1>
                <p className="text-sm text-slate-600">{profile?.email || ""}</p>
              </div>
            </div>
            <span className="rounded-full bg-cyan-800 px-4 py-2 text-xs font-bold tracking-wide text-white uppercase">
              {profile?.role || "admin"}
            </span>
          </div>

          <div className="mt-4">
            <Link
              to="/update-profile"
              className="inline-flex items-center rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
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
                Bookings
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {bookingCount}
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
          </div>

          <div className="mt-6 rounded-xl border border-cyan-100 bg-cyan-50 p-4">
            <p className="text-xs font-semibold tracking-wide text-cyan-800 uppercase">
              Admin Insights
            </p>
            <div className="mt-2 space-y-1 text-sm text-slate-700">
              <p>Travel Style: {profile?.travelStyle || "Not set"}</p>
              <p>Preferences Count: {preferencesCount}</p>
              <p>
                Member Since:{" "}
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <Dashboard />
      </div>
    </section>
  );
};

export default AdminProfile;
