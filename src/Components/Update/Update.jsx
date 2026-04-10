import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import { fetchUserByEmail, updateUserById } from "../../services/userService";

const TRAVEL_STYLES = [
  "",
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

const PREFERENCES = [
  "Rivers",
  "Photography",
  "Nature",
  "Beach",
  "Mountains",
  "Culture",
  "Food",
  "Adventure",
];

const Update = () => {
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
    travelStyle: "",
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
        const data = await fetchUserByEmail(user.email);
        if (!active) return;

        if (!data) {
          setError("Profile not found for this account.");
          setLoading(false);
          return;
        }

        setProfile(data);
        setFormData({
          name: data.name || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          profileImage: data.profileImage || "",
          travelStyle: data.travelStyle || "",
          preferences: Array.isArray(data.preferences) ? data.preferences : [],
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

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePreference = (item) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(item)
        ? prev.preferences.filter((p) => p !== item)
        : [...prev.preferences, item],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (!formData.name.trim()) {
      setError("Name is required.");
      setSubmitting(false);
      return;
    }

    const userId = profile?._id || profile?.id;
    if (!userId) {
      setError("User ID not found.");
      setSubmitting(false);
      return;
    }

    try {
      const updated = await updateUserById(userId, {
        name: formData.name.trim(),
        email: profile?.email || user?.email || "",
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        profileImage: formData.profileImage.trim(),
        travelStyle: formData.travelStyle,
        preferences: Array.isArray(formData.preferences)
          ? formData.preferences
          : [],
      });

      if (!updated) {
        setError("Failed to update profile. Please try again.");
        return;
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 900);
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-cyan-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Update Profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Update your profile information and save it to database.
        </p>

        {error ? (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {success}
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-black"
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
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-black"
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
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-black"
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
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-black"
              >
                {TRAVEL_STYLES.map((item) => (
                  <option key={item || "empty"} value={item}>
                    {item || "Select travel style"}
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
              onChange={onChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-black"
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
              onChange={onChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-black"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Preferences
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PREFERENCES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => togglePreference(item)}
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

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white hover:bg-cyan-800 disabled:opacity-60"
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

export default Update;
