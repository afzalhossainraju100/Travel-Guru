import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPackageById } from "../../services/packagesService";

const PackageDetails = () => {
  const { id } = useParams();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const bdtFormatter = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  });

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
            <button className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700">
              Book Now
            </button>
            <Link
              to="/packages"
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Back to Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
