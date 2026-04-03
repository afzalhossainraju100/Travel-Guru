import React, { useContext } from "react";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import logo from "../../assets/images/logo.png";

const Footer = () => {
  const { user } = useContext(AuthContext) || {};
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-14 overflow-hidden border-t border-cyan-100 bg-linear-to-br from-cyan-50 via-sky-50 to-white text-slate-700">
      <div className="pointer-events-none absolute -left-20 top-0 h-52 w-52 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-sky-200/35 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <img
              src={logo}
              alt="Travel Guru logo"
              className="h-10 w-auto rounded-lg bg-white/80 p-1"
            />
            <h2 className="text-xl font-extrabold text-cyan-900">
              Travel Guru
            </h2>
          </div>
          <p className="leading-7 text-slate-600">
            Turning your Bangladesh travel dreams into unforgettable journeys.
            We craft scenic, safe, and memorable tours for every traveler.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-slate-800">About Us</h3>
          <p className="text-slate-600">
            Travel Guru is a trusted local travel agency focused on beach, hill,
            tea garden, and heritage experiences across Bangladesh.
          </p>
          <p className="mt-3 text-slate-600">
            We provide curated packages, transparent pricing, and friendly
            support from booking to return.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-slate-800">Quick Links</h3>
          <ul className="space-y-2 text-slate-600">
            <li>
              <a href="/" className="transition hover:text-cyan-800">
                Home
              </a>
            </li>
            <li>
              <a href="/packages" className="transition hover:text-cyan-800">
                All Packages
              </a>
            </li>
            {!user && (
              <li>
                <a href="/login" className="transition hover:text-cyan-800">
                  Login
                </a>
              </li>
            )}
            {!user && (
              <li>
                <a href="/register" className="transition hover:text-cyan-800">
                  Register
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-slate-800">Contact</h3>
          <ul className="space-y-2 text-slate-600">
            <li>Dhaka, Bangladesh</li>
            <li>+880 1516503901</li>
            <li>rmn@travelguru.bd</li>
          </ul>

          <div className="mt-5 rounded-xl border border-cyan-100 bg-white/70 p-3">
            <p className="text-sm font-semibold text-slate-700">
              From Our Blog
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Stories, travel tips, and destination guides from Bangladesh.
            </p>
            <a
              href="#"
              className="mt-3 inline-block rounded-md bg-cyan-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-800"
            >
              Visit Blog
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-cyan-100/70 bg-white/55 px-6 py-6">
        <p className="mb-4 text-center text-sm font-semibold tracking-wide text-slate-600">
          Follow Us
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://www.facebook.com/mmafzal.raju"
            aria-label="Facebook"
            className="grid h-10 w-10 place-items-center rounded-full border border-cyan-200 bg-white/90 text-cyan-800 shadow-sm transition hover:bg-cyan-50 hover:text-cyan-900"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8v2.8h2.5v7h3z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/m.m.a.h.raju/"
            aria-label="Instagram"
            className="grid h-10 w-10 place-items-center rounded-full border border-cyan-200 bg-white/90 text-cyan-800 shadow-sm transition hover:bg-cyan-50 hover:text-cyan-900"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>
          <a
            href="https://www.youtube.com/@afzalhossainraju"
            aria-label="YouTube"
            className="grid h-10 w-10 place-items-center rounded-full border border-cyan-200 bg-white/90 text-cyan-800 shadow-sm transition hover:bg-cyan-50 hover:text-cyan-900"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8zM10 15.5V8.5L16 12l-6 3.5z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/afzal-hossain-raju/"
            aria-label="LinkedIn"
            className="grid h-10 w-10 place-items-center rounded-full border border-cyan-200 bg-white/90 text-cyan-800 shadow-sm transition hover:bg-cyan-50 hover:text-cyan-900"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6.9 8.5a1.8 1.8 0 1 1 0-3.5 1.8 1.8 0 0 1 0 3.5zM5.3 9.8h3.2V19H5.3V9.8zM10.5 9.8h3.1v1.3h.1c.4-.8 1.5-1.6 3.1-1.6 3.3 0 3.9 2.2 3.9 5v4.5h-3.2v-4c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.1h-3.2V9.8z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="relative z-10 border-t border-cyan-100/70 bg-white/60 px-6 py-4 text-center text-sm text-slate-600">
        Copyright {currentYear} Travel Guru. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
