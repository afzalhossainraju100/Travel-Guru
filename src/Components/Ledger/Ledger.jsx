import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import { saveBookingForUser } from "../../services/bookingService";
import {
  appendBookingHistoryToUser,
  fetchUserByEmail,
} from "../../services/userService";

const Ledger = () => {
  const { user } = useContext(AuthContext) || {};
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const routePackage = location.state?.package;
  const loaderPackage = useLoaderData();
  const selectedPackage = routePackage || loaderPackage;
  const [profileLoading, setProfileLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    travelDate: selectedPackage?.startDate || "",
    numberOfTravelers: 1,
    specialRequests: "",
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setProfileLoading(true);
        const authEmail = user?.email;
        const profile = authEmail ? await fetchUserByEmail(authEmail) : null;
        const fallbackName = user?.displayName || user?.email || "";

        setUserProfile(profile);
        setFormData((current) => ({
          ...current,
          fullName: profile?.name || fallbackName,
          email: profile?.email || authEmail || "",
          phoneNumber: profile?.phoneNumber || "",
          address: profile?.address || "",
          travelDate: selectedPackage?.startDate || current.travelDate || "",
        }));
      } catch (fetchError) {
        setError(fetchError?.message || "Failed to load user profile.");
      } finally {
        setProfileLoading(false);
      }
    };

    loadUserProfile();
  }, [selectedPackage, user]);

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-linear-to-b from-sky-100 via-cyan-50 to-white px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-cyan-100 bg-white/90 p-8 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-slate-800">
            Ledger Not Found
          </h1>
          <p className="mt-3 text-slate-600">
            No package was selected for booking.
          </p>
          <Link
            to="/packages"
            className="mt-6 inline-block rounded-lg bg-cyan-900 px-5 py-2.5 font-semibold text-white hover:bg-cyan-800"
          >
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  const travelerCount = Number(formData.numberOfTravelers) || 1;
  const perPerson = selectedPackage.priceBdt;
  const totalPrice = perPerson * travelerCount;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === "numberOfTravelers" ? Number(value) : value,
    }));
  };

  const handleBooking = async (event) => {
    event.preventDefault();

    if (!userProfile?._id) {
      setError("We could not resolve your user profile from the API.");
      return;
    }

    if (!formData.travelDate) {
      setError("Please choose a travel date.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const bookingPayload = {
        userId: userProfile._id,
        packageId: selectedPackage._id,
        packageName: selectedPackage.title,
        packageLocation: selectedPackage.location || "",
        packageImage: selectedPackage.image || "",
        packageTransport: selectedPackage.transport || "",
        packagePrice: selectedPackage.priceBdt,
        userName: formData.fullName || userProfile.name,
        userPhoneNumber: formData.phoneNumber || userProfile.phoneNumber || "",
        totalPrice,
        bookingDate: new Date().toISOString(),
        travelDate: formData.travelDate,
        status: "confirmed",
        paymentStatus: "pending",
        transactionId: "",
        numberOfTravelers: travelerCount,
        specialRequests: formData.specialRequests || "",
      };

      const createdBooking = await saveBookingForUser(
        userProfile._id,
        bookingPayload,
      );

      if (!createdBooking?._id) {
        throw new Error("Booking could not be created.");
      }

      await appendBookingHistoryToUser(userProfile._id, createdBooking._id);

      navigate("/payment", {
        state: { booking: createdBooking },
      });
    } catch (submitError) {
      setError(submitError?.message || "Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-100 via-cyan-50 to-white px-4 py-12">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-cyan-100 bg-white/95 shadow-xl">
        <img
          src={selectedPackage.image}
          alt={selectedPackage.title}
          className="h-72 w-full object-cover md:h-96"
        />

        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-extrabold text-slate-800 md:text-4xl">
            Booking Form
          </h1>
          <p className="mt-2 text-slate-600">{selectedPackage.location}</p>

          <div className="mt-6 grid gap-4 rounded-2xl border border-cyan-100 bg-cyan-50 p-5 md:grid-cols-3 md:items-center">
            <div>
              <p className="text-sm text-slate-500">Per person</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">
                {new Intl.NumberFormat("en-BD", {
                  style: "currency",
                  currency: "BDT",
                  maximumFractionDigits: 0,
                }).format(perPerson)}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Travelers</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">
                {travelerCount}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-bold text-cyan-900">
                {new Intl.NumberFormat("en-BD", {
                  style: "currency",
                  currency: "BDT",
                  maximumFractionDigits: 0,
                }).format(totalPrice)}
              </p>
            </div>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleBooking}>
            {profileLoading ? (
              <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 text-slate-700">
                Loading user profile...
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Full Name
                </span>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black placeholder:text-slate-400 outline-none focus:border-cyan-500"
                  placeholder="Your full name"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Email
                </span>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black placeholder:text-slate-400 outline-none focus:border-cyan-500"
                  placeholder="Your email"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Phone Number
                </span>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black placeholder:text-slate-400 outline-none focus:border-cyan-500"
                  placeholder="+880..."
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Number of Travelers
                </span>
                <input
                  name="numberOfTravelers"
                  type="number"
                  min="1"
                  value={formData.numberOfTravelers}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black placeholder:text-slate-400 outline-none focus:border-cyan-500"
                />
              </label>
            </div>

            <label className="space-y-2 block">
              <span className="text-sm font-semibold text-slate-700">
                Address
              </span>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black placeholder:text-slate-400 outline-none focus:border-cyan-500"
                placeholder="Your address"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Travel Date
                </span>
                <input
                  name="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black outline-none focus:border-cyan-500"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Special Requests
                </span>
                <input
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black placeholder:text-slate-400 outline-none focus:border-cyan-500"
                  placeholder="Window seat, vegetarian meals, etc."
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Booking..." : "Booking"}
              </button>
              <Link
                to={`/packages/${id}`}
                className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Back to Package Details
              </Link>
            </div>
          </form>

          {error && <p className="mt-4 font-medium text-rose-700">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Ledger;
