import React from "react";
import { Link } from "react-router-dom";

const AdminProfile = ({ profile }) => {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-xl border border-cyan-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={profile?.profileImage || "https://i.pravatar.cc/120?u=admin"}
              alt={profile?.name || "Admin"}
              className="h-14 w-14 rounded-xl object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {profile?.name || "Administrator"}
              </h1>
              <p className="text-sm text-slate-600">{profile?.email || ""}</p>
            </div>
          </div>
          <Link
            to="/update-profile"
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            Edit Profile
          </Link>
        </div>

        <div className="mt-6 space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold">Role:</span>{" "}
            {profile?.role || "admin"}
          </p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {profile?.phoneNumber || "Not provided"}
          </p>
          <p>
            <span className="font-semibold">Address:</span>{" "}
            {profile?.address || "Not provided"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminProfile;
