import React, { useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import { fetchUserByEmail } from "../../services/userService";
import AdminProfile from "./AdminProfile";
import UserProfile from "./UserProfile";

const Profile = () => {
  const { user } = useContext(AuthContext) || {};
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!user?.email) {
        if (active) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError("");

      try {
        const profileData = await fetchUserByEmail(user.email);

        if (!active) return;

        if (!profileData) {
          setError("Profile not found for this account.");
          setProfile(null);
        } else {
          setProfile(profileData);
        }
      } catch {
        if (!active) return;
        setError("Failed to load profile. Please try again.");
        setProfile(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [user?.email]);

  const role = useMemo(
    () => String(profile?.role || "user").toLowerCase(),
    [profile?.role],
  );

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (error) return <div className="p-6 text-rose-600">{error}</div>;
  if (!profile) return <div className="p-6">No profile data available.</div>;

  return role === "admin" ? (
    <AdminProfile profile={profile} />
  ) : (
    <UserProfile profile={profile} />
  );
};

export default Profile;
