import React from "react";
import { Link, useLoaderData } from "react-router-dom";

const Packages = () => {
  const packagesData = useLoaderData() || [];

  const bdtFormatter = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-sky-200 via-cyan-100 to-emerald-100 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-blue-300/35 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-emerald-300/35 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto mb-6 max-w-6xl px-4 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 md:text-5xl">
          Bangladesh Packages
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-700">
          Beach, hills, tea gardens and forest adventures curated for your next
          trip.
        </p>
      </div>

      {packagesData.map((pkg) => (
        <div key={pkg._id} className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/60 transition-transform hover:scale-[1.01]">
            <div className="grid md:grid-cols-3">
              <div className="md:col-span-1 h-64 md:h-full">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {pkg.title}
                      </h2>
                      <p className="text-gray-500 mt-1">{pkg.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-emerald-600">
                        {bdtFormatter.format(pkg.priceBdt)}
                      </p>
                      <p className="text-sm text-gray-500">{pkg.duration}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {(pkg.features || []).map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to={`/packages/${pkg._id}`}
                    className="inline-block px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Packages;
