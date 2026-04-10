import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import { fetchUserByEmail, updateUserById } from "../../services/userService";

const TRAVEL_STYLES = [
  "Budget",
  "Comfort",
  "Luxury",
  "Adventure",
  "Nature",
  "Beach",
  "Mountains",
  "Culture",
  "Photography",
  "Food & Culinary",
  "N/A",
];

const UpdateProfile = () => {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    profileImage: "",
    travelStyle: "N/A",
    preferences: [],
  });

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!user?.email) {
        if (active) setLoading(false);
        return;
      }

      try {
        const profileData = await fetchUserByEmail(user.email);
        if (!active) return;

        if (!profileData) {
          setError("Profile not found for this account.");
          setLoading(false);
          return;
        }

        setProfile(profileData);
        setFormData({
          name: profileData.name || "",
          phoneNumber: profileData.phoneNumber || "",
          address: profileData.address || "",
          profileImage: profileData.profileImage || "",
          travelStyle: profileData.travelStyle || "N/A",
          preferences: Array.isArray(profileData.preferences)
            ? profileData.preferences
            : [],
        });
      } catch {
        if (active) setError("Failed to load profile data.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [user?.email]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceToggle = (option) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(option)
        ? prev.preferences.filter((item) => item !== option)
        : [...prev.preferences, option],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (!formData.name.trim()) {
      setError("Name is required.");
      setSubmitting(false);
      return;
    }

    const targetUserId = profile?._id || profile?.id;
    if (!targetUserId) {
      setError("Profile ID not found.");
      setSubmitting(false);
      return;
    }

    const updates = {
      name: formData.name.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      address: formData.address.trim(),
      profileImage: formData.profileImage.trim(),
      travelStyle: formData.travelStyle,
      preferences: Array.isArray(formData.preferences)
        ? formData.preferences
        : [],
    };

    try {
      const updated = await updateUserById(targetUserId, updates);
      if (!updated) {
        setError("Failed to update profile. Please try again.");
        return;
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 800);
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-xl border border-cyan-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Update Profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Complete your profile information after sign up.
        </p>

        {error ? (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              value={profile?.email || user?.email || ""}
              disabled
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-slate-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="+8801XXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Travel Style
              </label>
              <select
                name="travelStyle"
                value={formData.travelStyle}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {TRAVEL_STYLES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Address
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Your address"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Profile Image URL
            </label>
            <input
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Preferences
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {TRAVEL_STYLES.filter((item) => item !== "N/A").map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handlePreferenceToggle(item)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    formData.preferences.includes(item)
                      ? "bg-cyan-600 text-white"
                      : "border border-slate-300 text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-700 disabled:opacity-60"
            >
              {submitting ? "Updating..." : "Update Profile"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateProfile;
