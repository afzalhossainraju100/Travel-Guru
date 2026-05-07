import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://travel-guru-server-seven.vercel.app"
)
  .trim()
  .replace(/\/$/, "");
const USERS_API_URL = API_BASE_URL ? `${API_BASE_URL}/users` : "";
const BOOKINGS_API_URL = API_BASE_URL ? `${API_BASE_URL}/bookings` : "";
const PACKAGES_API_URL = API_BASE_URL ? `${API_BASE_URL}/packages` : "";

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

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const buildSparklinePoints = (
  values,
  width = 220,
  height = 72,
  padding = 10,
) => {
  if (!values.length) return "";

  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const xStep =
    values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0;

  return values
    .map((value, index) => {
      const normalized =
        maxValue === minValue
          ? 0.5
          : (value - minValue) / (maxValue - minValue);
      const x = padding + xStep * index;
      const y = height - padding - normalized * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
};

const MetricCard = ({ title, value, accentClass, subtitle, children }) => {
  return (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm ${accentClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
          {subtitle ? (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    </div>
  );
};

const RingChart = ({
  value,
  color = "#0ea5e9",
  label,
  size = 88,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = clamp(value, 0, 100);
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={label}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="rgba(148, 163, 184, 0.18)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${center} ${center})`}
      />
      <text
        x="50%"
        y="48%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-slate-950 text-[15px] font-black"
      >
        {Math.round(progress)}%
      </text>
      <text
        x="50%"
        y="66%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-slate-500 text-[9px] font-semibold uppercase tracking-[0.2em]"
      >
        {label}
      </text>
    </svg>
  );
};

const SparklineChart = ({
  values,
  stroke = "#2563eb",
  fill = "rgba(37, 99, 235, 0.14)",
}) => {
  const points = buildSparklinePoints(values);

  if (!points) {
    return null;
  }

  const areaPoints = `10,62 ${points} 210,62`;

  return (
    <svg viewBox="0 0 220 72" className="h-18 w-full" aria-hidden="true">
      <polyline points={areaPoints} fill={fill} stroke="none" />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const HorizontalBars = ({ bars }) => {
  const maxValue = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <div className="space-y-3">
      {bars.map((bar) => {
        const width = clamp((bar.value / maxValue) * 100, 6, 100);

        return (
          <div key={bar.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-xs font-semibold text-slate-600">
              <span>{bar.label}</span>
              <span>{bar.displayValue}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div
                className="h-3 rounded-full"
                style={{ width: `${width}%`, background: bar.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
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

    if (!USERS_API_URL || !BOOKINGS_API_URL || !PACKAGES_API_URL) {
      setError("Backend API is not configured.");
      setUsers([]);
      setBookings([]);
      setPackages([]);
      setLoading(false);
      return;
    }

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
    const unpaidBookings = bookings.filter(
      (booking) =>
        String(booking?.paymentStatus || "").toLowerCase() !== "paid",
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
    const paymentCompletionRate =
      totalBookings > 0 ? (paidBookings.length / totalBookings) * 100 : 0;

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
      unpaidBookings: unpaidBookings.length,
      paymentCompletionRate,
      totalRevenue,
      avgBookingValue,
      bookingsPerUser,
      conversionRate,
      topPackages,
      recommendations,
    };
  }, [bookings, packages, users]);

  const revenueTrendValues = useMemo(
    () => analytics.topPackages.map((pkg) => toNumber(pkg.paidRevenue)),
    [analytics.topPackages],
  );

  const packageBars = useMemo(
    () =>
      analytics.topPackages.map((pkg, index) => ({
        label: pkg.name,
        value: toNumber(pkg.paidRevenue),
        displayValue: formatMoney(pkg.paidRevenue),
        color: ["#0f766e", "#2563eb", "#7c3aed", "#f59e0b", "#ec4899"][
          index % 5
        ],
      })),
    [analytics.topPackages],
  );

  const totalBookingMix = useMemo(
    () => [analytics.paidBookings, analytics.unpaidBookings],
    [analytics.paidBookings, analytics.unpaidBookings],
  );

  const countScale = Math.max(
    analytics.totalUsers,
    analytics.totalBookings,
    analytics.paidBookings,
    analytics.unpaidBookings,
    1,
  );
  const moneyScale = Math.max(
    analytics.totalRevenue,
    analytics.avgBookingValue,
    ...analytics.topPackages.map((pkg) => toNumber(pkg.paidRevenue)),
    1,
  );

  const userProgress = clamp((analytics.totalUsers / countScale) * 100, 8, 100);
  const bookingProgress = clamp(
    (analytics.totalBookings / countScale) * 100,
    8,
    100,
  );
  const paidProgress = analytics.totalBookings
    ? clamp((analytics.paidBookings / analytics.totalBookings) * 100, 0, 100)
    : 0;
  const revenueProgress = clamp(
    (analytics.totalRevenue / moneyScale) * 100,
    8,
    100,
  );
  const avgValueProgress = clamp(
    (analytics.avgBookingValue / moneyScale) * 100,
    8,
    100,
  );
  const bookingsPerUserProgress = clamp(
    (analytics.bookingsPerUser / 3) * 100,
    8,
    100,
  );
  const completionProgress = analytics.paymentCompletionRate;

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-sm">
      <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_42%),linear-gradient(135deg,_rgba(255,255,255,0.95),_rgba(248,250,252,0.95))] px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-700">
              AI Business Intelligence
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              Business Analytics Dashboard
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
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
      </div>

      <div className="grid gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:grid-cols-2 xl:grid-cols-4 sm:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Coverage
          </p>
          <p className="mt-2 text-lg font-black text-slate-950">
            {analytics.totalUsers} users · {analytics.totalBookings} bookings
          </p>
          <p className="mt-1 text-xs text-slate-500">Live database snapshot</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Revenue Engine
          </p>
          <p className="mt-2 text-lg font-black text-slate-950">
            {formatMoney(analytics.totalRevenue)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Paid booking revenue</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Payment Completion
          </p>
          <p className="mt-2 text-lg font-black text-slate-950">
            {analytics.paymentCompletionRate.toFixed(1)}%
          </p>
          <p className="mt-1 text-xs text-slate-500">Paid vs unpaid bookings</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Recommendation Score
          </p>
          <p className="mt-2 text-lg font-black text-slate-950">
            {analytics.recommendations.length} actions
          </p>
          <p className="mt-1 text-xs text-slate-500">Decision support queue</p>
        </div>
      </div>

      {loading ? (
        <p className="px-6 py-5 text-sm text-slate-600 sm:px-8">
          Loading analytics...
        </p>
      ) : null}

      {error ? (
        <p className="mx-6 mt-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 sm:mx-8">
          {error}
        </p>
      ) : null}

      {!loading && !error ? (
        <div className="space-y-6 px-6 py-6 sm:px-8">
          <div className="grid gap-4 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.9),rgba(255,255,255,1))] p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold tracking-[0.22em] text-slate-500 uppercase">
                      KPI Control Panel
                    </h3>
                    <p className="mt-2 text-lg font-black text-slate-950">
                      Graphical view of the key business signals
                    </p>
                  </div>
                  <div className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
                    Live analysis
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <MetricCard
                    title="Total Users"
                    value={analytics.totalUsers}
                    subtitle="Current registered audience"
                    accentClass="border-slate-200"
                  >
                    <RingChart
                      value={userProgress}
                      color="#0f172a"
                      label="Users"
                    />
                  </MetricCard>

                  <MetricCard
                    title="Total Bookings"
                    value={analytics.totalBookings}
                    subtitle="All booking requests"
                    accentClass="border-sky-200"
                  >
                    <div className="flex w-28 flex-col items-end gap-2">
                      <SparklineChart
                        values={totalBookingMix}
                        stroke="#0284c7"
                        fill="rgba(2, 132, 199, 0.16)"
                      />
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-sky-500"
                          style={{ width: `${bookingProgress}%` }}
                        />
                      </div>
                    </div>
                  </MetricCard>

                  <MetricCard
                    title="Paid Bookings"
                    value={analytics.paidBookings}
                    subtitle={`${analytics.unpaidBookings} waiting for payment`}
                    accentClass="border-emerald-200"
                  >
                    <RingChart
                      value={paidProgress}
                      color="#10b981"
                      label="Paid"
                    />
                  </MetricCard>

                  <MetricCard
                    title="Total Revenue"
                    value={formatMoney(analytics.totalRevenue)}
                    subtitle="Collected from paid bookings"
                    accentClass="border-indigo-200"
                  >
                    <div className="flex w-28 flex-col items-end gap-2">
                      <SparklineChart
                        values={
                          revenueTrendValues.length
                            ? revenueTrendValues
                            : [0, 0, 0]
                        }
                        stroke="#4f46e5"
                        fill="rgba(79, 70, 229, 0.16)"
                      />
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-indigo-500"
                          style={{ width: `${revenueProgress}%` }}
                        />
                      </div>
                    </div>
                  </MetricCard>

                  <MetricCard
                    title="Avg Booking Value"
                    value={formatMoney(analytics.avgBookingValue)}
                    subtitle="Mean value per paid booking"
                    accentClass="border-amber-200"
                  >
                    <RingChart
                      value={avgValueProgress}
                      color="#f59e0b"
                      label="Avg"
                    />
                  </MetricCard>

                  <MetricCard
                    title="Bookings Per User"
                    value={analytics.bookingsPerUser.toFixed(2)}
                    subtitle="Engagement density"
                    accentClass="border-cyan-200"
                  >
                    <RingChart
                      value={bookingsPerUserProgress}
                      color="#06b6d4"
                      label="Density"
                    />
                  </MetricCard>
                </div>
              </div>
            </div>

            <div className="xl:col-span-4">
              <div className="h-full rounded-3xl border border-cyan-100 bg-gradient-to-b from-cyan-50 to-white p-5 shadow-sm">
                <h3 className="text-sm font-bold tracking-[0.22em] text-cyan-900 uppercase">
                  Payment Completion
                </h3>
                <p className="mt-2 text-lg font-black text-slate-950">
                  {analytics.paymentCompletionRate.toFixed(1)}%
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Share of bookings that have been paid.
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <RingChart
                    value={completionProgress}
                    color="#06b6d4"
                    label="Complete"
                    size={118}
                    strokeWidth={12}
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
                        <span>Paid</span>
                        <span>{analytics.paidBookings}</span>
                      </div>
                      <div className="h-3 rounded-full bg-emerald-100">
                        <div
                          className="h-3 rounded-full bg-emerald-500"
                          style={{ width: `${completionProgress}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
                        <span>Unpaid</span>
                        <span>{analytics.unpaidBookings}</span>
                      </div>
                      <div className="h-3 rounded-full bg-sky-100">
                        <div
                          className="h-3 rounded-full bg-sky-500"
                          style={{
                            width: `${analytics.totalBookings ? 100 - completionProgress : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    AI Readout
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {analytics.recommendations.map((item, index) => (
                      <li key={`rec-${index}`} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-cyan-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-bold tracking-[0.22em] text-slate-500 uppercase">
                  Top Performing Packages
                </h3>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  Revenue ranking
                </span>
              </div>
              {packageBars.length ? (
                <div className="mt-5 space-y-4">
                  <HorizontalBars bars={packageBars} />
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-600">
                  No booking/package data available yet.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 shadow-sm">
              <h3 className="text-sm font-bold tracking-[0.22em] text-cyan-900 uppercase">
                Decision Support
              </h3>
              <div className="mt-4 grid gap-3">
                {analytics.recommendations.map((item, index) => (
                  <div
                    key={`decision-${index}`}
                    className="rounded-2xl border border-cyan-100 bg-white p-4 text-sm text-slate-700 shadow-sm"
                  >
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 text-xs font-black text-cyan-800">
                      {index + 1}
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Dashboard;
