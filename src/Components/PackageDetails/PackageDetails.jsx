import React, { useContext, useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import {
  addWishlistForUser,
  isPackageWishlisted,
  removeWishlistForUser,
} from "../../services/wishlistService";
import AuthContext from "../../Contextx/AuthContext/AuthContext";

const PackageDetails = () => {
  const { id } = useParams();
  const selectedPackage = useLoaderData();
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [bookingMessage, setBookingMessage] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const userIdentifier = user?.email || "";

  //console.log('token',user.accessToken)

  useEffect(() => {
    const loadWishlistState = async () => {
      const saved = await isPackageWishlisted(userIdentifier, id);
      setIsWishlisted(saved);
    };

    loadWishlistState();
  }, [id, userIdentifier]);

  const bdtFormatter = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  });

  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const getTransportText = (transport) => {
    if (!transport) return "Transport information not set";
    if (typeof transport === "string") return transport;

    const parts = [transport.type, transport.departure, transport.return]
      .filter(Boolean)
      .join(" | ");

    return parts || "Transport information not set";
  };

  const getHotelText = (hotel) => {
    if (!hotel) return "Hotel information not set";
    if (typeof hotel === "string") return hotel;

    const amenityText = Array.isArray(hotel.amenities)
      ? hotel.amenities.join(", ")
      : "";

    const parts = [hotel.name, hotel.type, amenityText]
      .filter(Boolean)
      .join(" | ");

    return parts || "Hotel information not set";
  };

  const handleBookNow = () => {
    if (!userIdentifier || !selectedPackage) {
      setBookingMessage(
        "Unable to open booking form right now. Please login again.",
      );
      return;
    }

    navigate(`/ledger/${selectedPackage._id}`, {
      state: { package: selectedPackage },
    });
  };

  const handleWishlist = async () => {
    if (!userIdentifier || !selectedPackage) {
      setWishlistMessage("Please login to save this package for future tours.");
      return;
    }

    if (isWishlisted) {
      await removeWishlistForUser(userIdentifier, selectedPackage._id);
      setIsWishlisted(false);
      setWishlistMessage("Removed from your wishlist.");
      return;
    }

    await addWishlistForUser(userIdentifier, selectedPackage);
    setIsWishlisted(true);
    setWishlistMessage("Added to your wishlist for future tours.");
  };

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

  const startDateLabel = selectedPackage.startDate
    ? dateFormatter.format(new Date(selectedPackage.startDate))
    : "Not set";

  const endDateLabel = selectedPackage.endDate
    ? dateFormatter.format(new Date(selectedPackage.endDate))
    : "Not set";

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

          <div className="mt-6 grid gap-4 rounded-xl border border-cyan-100 bg-cyan-50/60 p-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tour Start Date
              </p>
              <p className="mt-1 text-base font-bold text-slate-800">
                {startDateLabel}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tour End Date
              </p>
              <p className="mt-1 text-base font-bold text-slate-800">
                {endDateLabel}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                Transport
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-800">
                {getTransportText(selectedPackage.transport)}
              </h3>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Hotel
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-800">
                {getHotelText(selectedPackage.hotel)}
              </h3>
            </div>
          </div>

          {selectedPackage.spots?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-slate-800">
                Spots You Will Visit With My Team
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedPackage.spots.map((spot, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
                  >
                    {spot}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedPackage.spotImages?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-800">Spot Images</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {selectedPackage.spotImages.slice(0, 3).map((spot) => (
                  <div
                    key={spot.name}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="h-44 w-full object-cover"
                    />
                    <p className="px-3 py-2 text-sm font-semibold text-slate-700">
                      {spot.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {(selectedPackage.features || []).map((feature, index) => (
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
