import React, { useEffect, useMemo, useState } from "react";

const USERS_API_URL = "http://localhost:3000/users";
const BOOKINGS_API_URL = "http://localhost:3000/bookings";
const PACKAGES_API_URL = "http://localhost:3000/packages";

const resolveId = (value) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    if (typeof value.$oid === "string") return value.$oid;
    if (typeof value.$id === "string") return value.$id;
    if (value._id) return resolveId(value._id);
    if (value.id) return resolveId(value.id);
  }

  return "";
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatMoney = (amount) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(toNumber(amount));
};

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [usersRes, bookingsRes, packagesRes] = await Promise.all([
        fetch(USERS_API_URL),
        fetch(BOOKINGS_API_URL),
        fetch(PACKAGES_API_URL),
      ]);

      if (!usersRes.ok || !bookingsRes.ok || !packagesRes.ok) {
        throw new Error("Failed to load analytics data from API.");
      }

      const [usersData, bookingsData, packagesData] = await Promise.all([
        usersRes.json(),
        bookingsRes.json(),
        packagesRes.json(),
      ]);

      setUsers(Array.isArray(usersData) ? usersData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setPackages(Array.isArray(packagesData) ? packagesData : []);
    } catch {
      setError("Could not load business analytics now. Please try again.");
      setUsers([]);
      setBookings([]);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const analytics = useMemo(() => {
    const totalUsers = users.length;
    const totalBookings = bookings.length;

    const paidBookings = bookings.filter(
      (booking) =>
        String(booking?.paymentStatus || "").toLowerCase() === "paid",
    );
    const confirmedBookings = bookings.filter(
      (booking) => String(booking?.status || "").toLowerCase() === "confirmed",
    );

    const totalRevenue = paidBookings.reduce(
      (sum, booking) => sum + toNumber(booking?.totalPrice),
      0,
    );

    const avgBookingValue =
      paidBookings.length > 0 ? totalRevenue / paidBookings.length : 0;
    const bookingsPerUser = totalUsers > 0 ? totalBookings / totalUsers : 0;
    const conversionRate =
      totalUsers > 0 ? (totalBookings / totalUsers) * 100 : 0;

    const packageNameMap = new Map(
      packages.map((pkg) => [
        resolveId(pkg?._id || pkg?.id),
        pkg?.title || pkg?.name || "Unnamed Package",
      ]),
    );

    const packageStats = new Map();

    bookings.forEach((booking) => {
      const packageId = resolveId(booking?.packageId);
      const fallbackName = booking?.packageName || "Unknown Package";
      const packageName = packageNameMap.get(packageId) || fallbackName;
      const key = packageId || packageName;

      const current = packageStats.get(key) || {
        name: packageName,
        bookings: 0,
        paidRevenue: 0,
      };

      current.bookings += 1;
      if (String(booking?.paymentStatus || "").toLowerCase() === "paid") {
        current.paidRevenue += toNumber(booking?.totalPrice);
      }

      packageStats.set(key, current);
    });

    const topPackages = Array.from(packageStats.values())
      .sort((a, b) => b.paidRevenue - a.paidRevenue || b.bookings - a.bookings)
      .slice(0, 5);

    const recommendations = [];

    if (conversionRate < 60) {
      recommendations.push(
        "User-to-booking conversion is low. Improve landing and package detail CTAs.",
      );
    }

    if (paidBookings.length < totalBookings) {
      recommendations.push(
        "Many bookings are unpaid. Add payment reminders and faster checkout nudges.",
      );
    }

    if (topPackages[0] && topPackages[0].paidRevenue > 0) {
      recommendations.push(
        `Top earner is ${topPackages[0].name}. Increase visibility and upsell similar packages.`,
      );
    }

    if (!recommendations.length) {
      recommendations.push(
        "Performance is stable. Test seasonal campaigns to increase average booking value.",
      );
    }

    return {
      totalUsers,
      totalBookings,
      paidBookings: paidBookings.length,
      confirmedBookings: confirmedBookings.length,
      totalRevenue,
      avgBookingValue,
      bookingsPerUser,
      conversionRate,
      topPackages,
      recommendations,
    };
  }, [bookings, packages, users]);

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur-sm sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Business Analytics Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Data-driven insights from users, bookings, and packages for better
            revenue decisions.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDashboardData}
          className="inline-flex w-fit items-center rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="mt-5 text-sm text-slate-600">Loading analytics...</p>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {!loading && !error ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Total Users
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {analytics.totalUsers}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Total Bookings
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {analytics.totalBookings}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold text-emerald-700 uppercase">
                Paid Bookings
              </p>
              <p className="mt-1 text-2xl font-black text-emerald-900">
                {analytics.paidBookings}
              </p>
            </div>
            <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">
              <p className="text-xs font-semibold text-cyan-700 uppercase">
                Confirmed Bookings
              </p>
              <p className="mt-1 text-2xl font-black text-cyan-900">
                {analytics.confirmedBookings}
              </p>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-xs font-semibold text-indigo-700 uppercase">
                Total Revenue
              </p>
              <p className="mt-1 text-xl font-black text-indigo-900">
                {formatMoney(analytics.totalRevenue)}
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold text-amber-700 uppercase">
                Avg Booking Value
              </p>
              <p className="mt-1 text-xl font-black text-amber-900">
                {formatMoney(analytics.avgBookingValue)}
              </p>
            </div>
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
              <p className="text-xs font-semibold text-sky-700 uppercase">
                Bookings Per User
              </p>
              <p className="mt-1 text-xl font-black text-sky-900">
                {analytics.bookingsPerUser.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
              <p className="text-xs font-semibold text-violet-700 uppercase">
                Conversion Rate
              </p>
              <p className="mt-1 text-xl font-black text-violet-900">
                {analytics.conversionRate.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-bold tracking-wide text-slate-800 uppercase">
                Top Performing Packages
              </h3>
              {analytics.topPackages.length ? (
                <div className="mt-3 space-y-3">
                  {analytics.topPackages.map((pkg, index) => (
                    <div
                      key={`${pkg.name}-${index}`}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {pkg.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Bookings: {pkg.bookings}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-emerald-700">
                        {formatMoney(pkg.paidRevenue)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  No booking/package data available yet.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4">
              <h3 className="text-sm font-bold tracking-wide text-cyan-900 uppercase">
                Decision Support
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {analytics.recommendations.map((item, index) => (
                  <li key={`rec-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
};

export default Dashboard;
