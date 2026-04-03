import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import { saveBookingForUser } from "../../services/bookingService";
import {
  clearCheckoutDraft,
  getCheckoutDraft,
} from "../../services/checkoutService";

const Payment = () => {
  const { user } = useContext(AuthContext) || {};
  const location = useLocation();
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);
  const userIdentifier = user?.uid || user?.email;
  const routePackage = location.state?.package;
  const routeTravelers = location.state?.travelers;
  const storedDraft = getCheckoutDraft(userIdentifier);
  const checkoutDraft = routePackage
    ? { package: routePackage, travelers: routeTravelers || 1 }
    : storedDraft;

  const bdtFormatter = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  });

  const handleCompletePayment = () => {
    const userIdentifier = user?.uid || user?.email;

    if (!userIdentifier || !checkoutDraft?.package) return;

    saveBookingForUser(userIdentifier, {
      ...checkoutDraft.package,
      travelerCount: checkoutDraft.travelers,
      totalPrice: checkoutDraft.package.priceBdt * checkoutDraft.travelers,
      paymentStatus: "Paid",
    });

    setIsPaid(true);
    clearCheckoutDraft(userIdentifier);

    setTimeout(() => {
      navigate("/booking");
    }, 900);
  };

  if (!checkoutDraft?.package) {
    return (
      <div className="min-h-screen bg-linear-to-b from-sky-100 via-cyan-50 to-white px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-cyan-100 bg-white/90 p-8 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-slate-800">
            Payment Not Found
          </h1>
          <p className="mt-3 text-slate-600">
            No package is ready for payment.
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

  const travelers = checkoutDraft.travelers || 1;
  const totalPrice = checkoutDraft.package.priceBdt * travelers;

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-100 via-cyan-50 to-white px-4 py-12">
      <div className="mx-auto max-w-4xl rounded-2xl border border-cyan-100 bg-white/95 p-6 shadow-xl md:p-10">
        <h1 className="text-3xl font-extrabold text-slate-800 md:text-4xl">
          Payment
        </h1>
        <p className="mt-2 text-slate-600">
          Complete payment to store this package in your Booking List.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-2xl border border-cyan-100 bg-cyan-50/60">
            <img
              src={checkoutDraft.package.image}
              alt={checkoutDraft.package.title}
              className="h-64 w-full object-cover"
            />
            <div className="p-5">
              <h2 className="text-2xl font-bold text-slate-800">
                {checkoutDraft.package.title}
              </h2>
              <p className="mt-1 text-slate-600">
                {checkoutDraft.package.location}
              </p>
              <p className="mt-3 text-slate-700">
                Traveler count:{" "}
                <span className="font-semibold">{travelers}</span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800">
              Payment Summary
            </h3>
            <div className="mt-4 space-y-3 text-slate-700">
              <div className="flex items-center justify-between">
                <span>Per person</span>
                <span className="font-semibold">
                  {bdtFormatter.format(checkoutDraft.package.priceBdt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Travelers</span>
                <span className="font-semibold">{travelers}</span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-emerald-700">
                  {bdtFormatter.format(totalPrice)}
                </span>
              </div>
            </div>

            {isPaid ? (
              <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-center font-semibold text-emerald-700">
                Payment completed successfully. Redirecting to Booking List...
              </div>
            ) : (
              <button
                onClick={handleCompletePayment}
                className="mt-6 w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                Complete Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
