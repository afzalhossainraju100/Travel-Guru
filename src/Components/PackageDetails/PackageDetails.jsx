import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPackageById } from "../../services/packagesService";
import { saveCheckoutDraft } from "../../services/checkoutService";
import {
  addWishlistForUser,
  isPackageWishlisted,
  removeWishlistForUser,
} from "../../services/wishlistService";
import AuthContext from "../../Contextx/AuthContext/AuthContext";

const PackageDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const loadPackage = async () => {
      try {
        setLoading(true);
        const data = await getPackageById(id);
        setSelectedPackage(data);
      } catch (err) {
        setError(err?.message || "Failed to load package details.");
      } finally {
        setLoading(false);
      }
    };

    loadPackage();
  }, [id]);

  useEffect(() => {
    const userIdentifier = user?.uid || user?.email;
    setIsWishlisted(isPackageWishlisted(userIdentifier, id));
  }, [id, user]);

  const bdtFormatter = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  });

  const handleBookNow = () => {
    const userIdentifier = user?.uid || user?.email;

    if (!userIdentifier || !selectedPackage) {
      setBookingMessage(
        "Unable to save booking right now. Please login again.",
      );
      return;
    }

    saveCheckoutDraft(userIdentifier, {
      package: selectedPackage,
      travelers: 1,
    });
    navigate(`/ledger/${selectedPackage.id}`, {
      state: { package: selectedPackage, travelers: 1 },
    });
  };

  const handleWishlist = () => {
    const userIdentifier = user?.uid || user?.email;

    if (!userIdentifier || !selectedPackage) {
      setWishlistMessage("Please login to save this package for future tours.");
      return;
    }

    if (isWishlisted) {
      removeWishlistForUser(userIdentifier, selectedPackage.id);
      setIsWishlisted(false);
      setWishlistMessage("Removed from your wishlist.");
      return;
    }

    addWishlistForUser(userIdentifier, selectedPackage);
    setIsWishlisted(true);
    setWishlistMessage("Added to your wishlist for future tours.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-sky-100 via-cyan-50 to-white px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-cyan-100 bg-white/90 p-8 text-center shadow-lg">
          <p className="text-lg font-semibold text-slate-700">
            Loading package details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-sky-100 via-cyan-50 to-white px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white/90 p-8 text-center shadow-lg">
          <p className="text-lg font-semibold text-red-600">{error}</p>
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

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-linear-to-b from-sky-100 via-cyan-50 to-white px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-cyan-100 bg-white/90 p-8 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-slate-800">
            Package Not Found
          </h1>
          <p className="mt-3 text-slate-600">
            The package you are looking for does not exist.
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

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-100 via-cyan-50 to-white px-4 py-12">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-cyan-100 bg-white/95 shadow-xl">
        <img
          src={selectedPackage.image}
          alt={selectedPackage.title}
          className="h-72 w-full object-cover md:h-96"
        />

        <div className="p-6 md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 md:text-4xl">
                {selectedPackage.title}
              </h1>
              <p className="mt-2 text-slate-600">{selectedPackage.location}</p>
            </div>

            <div className="rounded-xl bg-emerald-50 px-5 py-3 text-right">
              <p className="text-2xl font-extrabold text-emerald-700">
                {bdtFormatter.format(selectedPackage.priceBdt)}
              </p>
              <p className="text-sm text-slate-500">
                {selectedPackage.duration}
              </p>
            </div>
          </div>

          <p className="mt-6 leading-7 text-slate-700">
            {selectedPackage.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {selectedPackage.features.map((feature, index) => (
              <span
                key={index}
                className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-900"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleWishlist}
              className={`rounded-lg border px-5 py-2.5 font-semibold transition ${
                isWishlisted
                  ? "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  : "border-rose-300 bg-white text-rose-600 hover:bg-rose-50"
              }`}
            >
              {isWishlisted ? "Remove Wish" : "Add to Wish"}
            </button>
            <button
              onClick={handleBookNow}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700"
            >
              Book Now
            </button>
            <Link
              to="/booking"
              className="rounded-lg border border-emerald-300 px-5 py-2.5 font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Go to Booking
            </Link>
            <Link
              to="/packages"
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Back to Packages
            </Link>
          </div>

          {bookingMessage && (
            <p className="mt-4 font-medium text-emerald-700">
              {bookingMessage}
            </p>
          )}

          {wishlistMessage && (
            <p className="mt-2 font-medium text-rose-700">{wishlistMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
