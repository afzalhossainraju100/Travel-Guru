import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import {
  getCheckoutDraft,
  saveCheckoutDraft,
} from "../../services/checkoutService";

const Ledger = () => {
  const { user } = useContext(AuthContext) || {};
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userIdentifier = user?.uid || user?.email;
  const routePackage = location.state?.package;
  const routeTravelers = location.state?.travelers;
  const storedDraft = getCheckoutDraft(userIdentifier);

  const checkoutDraft =
    storedDraft?.package?.id === Number(id)
      ? storedDraft
      : routePackage?.id === Number(id)
        ? { package: routePackage, travelers: routeTravelers || 1 }
        : null;

  const [travelerCount, setTravelerCount] = useState(
    checkoutDraft?.travelers || 1,
  );

  if (!checkoutDraft?.package) {
    return (
      <div className="min-h-screen bg-linear-to-b from-sky-100 via-cyan-50 to-white px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-cyan-100 bg-white/90 p-8 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-slate-800">
            Ledger Not Found
          </h1>
          <p className="mt-3 text-slate-600">
            No active checkout was found for this package.
          </p>
          <Link
            to={`/packages/${id}`}
            className="mt-6 inline-block rounded-lg bg-cyan-900 px-5 py-2.5 font-semibold text-white hover:bg-cyan-800"
          >
            Back to Package Details
          </Link>
        </div>
      </div>
    );
  }

  const { package: selectedPackage } = checkoutDraft;
  const perPerson = selectedPackage.priceBdt;
  const totalPrice = perPerson * travelerCount;

  const handleDecrease = () => {
    setTravelerCount((current) => {
      const nextCount = Math.max(1, current - 1);
      saveCheckoutDraft(userIdentifier, {
        package: selectedPackage,
        travelers: nextCount,
      });
      return nextCount;
    });
  };

  const handleIncrease = () => {
    setTravelerCount((current) => {
      const nextCount = current + 1;
      saveCheckoutDraft(userIdentifier, {
        package: selectedPackage,
        travelers: nextCount,
      });
      return nextCount;
    });
  };

  const handlePayment = () => {
    navigate("/payment", {
      state: {
        package: selectedPackage,
        travelers: travelerCount,
      },
    });
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
            {selectedPackage.title}
          </h1>
          <p className="mt-2 text-slate-600">{selectedPackage.location}</p>

          <div className="mt-6 grid gap-4 rounded-2xl border border-cyan-100 bg-cyan-50 p-5 md:grid-cols-3 md:items-center">
            <div>
              <p className="text-sm text-slate-500">Travelers</p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={handleDecrease}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white text-xl font-bold text-cyan-900 shadow-sm hover:bg-cyan-100"
                >
                  -
                </button>
                <span className="min-w-10 text-center text-2xl font-extrabold text-slate-800">
                  {travelerCount}
                </span>
                <button
                  onClick={handleIncrease}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white text-xl font-bold text-cyan-900 shadow-sm hover:bg-cyan-100"
                >
                  +
                </button>
              </div>
            </div>

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

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handlePayment}
              className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Payment
            </button>
            <Link
              to={`/packages/${id}`}
              className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Back to Package Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
