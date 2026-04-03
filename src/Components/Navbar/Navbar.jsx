import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import HomeBg from "../../assets/images/Rectangle1.png";

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        //sign-out successful
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };
  const Links = (
    <>
      <li>
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className={({ isActive }) => {
            return isActive
              ? "font-semibold text-cyan-950 underline decoration-2 underline-offset-4"
              : "text-slate-700 transition-colors hover:text-cyan-950";
          }}
        >
          Home
        </NavLink>
      </li>
      {!user && (
        <li>
          <NavLink
            to="/login"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => {
              return isActive
                ? "font-semibold text-cyan-950 underline decoration-2 underline-offset-4"
                : "text-slate-700 transition-colors hover:text-cyan-950";
            }}
          >
            Login
          </NavLink>
        </li>
      )}
      {!user && (
        <li>
          <NavLink
            to="/register"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => {
              return isActive
                ? "font-semibold text-cyan-950 underline decoration-2 underline-offset-4"
                : "text-slate-700 transition-colors hover:text-cyan-950";
            }}
          >
            Signup
          </NavLink>
        </li>
      )}
      <li>
        <NavLink
          to={user ? "/packages" : "/login"}
          onClick={() => setMenuOpen(false)}
          className={({ isActive }) => {
            return isActive
              ? "font-semibold text-cyan-950 underline decoration-2 underline-offset-4"
              : "text-slate-700 transition-colors hover:text-cyan-950";
          }}
        >
          All Packages
        </NavLink>
      </li>

      {user && (
        <>
          <li>
            <NavLink
              to="/booking"
              onClick={() => setMenuOpen(false)}
              className="text-black transition-colors hover:text-cyan-950"
            >
              Booking Info
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="text-black transition-colors hover:text-cyan-950"
            >
              Profile
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  const handleMenuAction = () => {
    setMenuOpen(false);
  };

  return (
    <div className="navbar fixed top-0 left-0 z-50 w-full overflow-visible border-b border-sky-100/80 shadow-lg shadow-sky-950/10">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-18"
          style={{ backgroundImage: `url(${HomeBg})` }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-sky-100/92 via-white/88 to-cyan-100/84" />
        <div className="absolute inset-0 bg-linear-to-b from-white/35 via-transparent to-sand-100/35" />
      </div>

      <div className="navbar-start relative z-10 gap-2">
        <div className="dropdown dropdown-end lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="btn btn-ghost border border-transparent text-sky-950 hover:border-sky-200 hover:bg-white/55"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </button>
          {menuOpen && (
            <ul
              className="menu menu-sm absolute left-0 top-full z-50 mt-3 w-64 rounded-box border border-sky-100/70 bg-white/95 p-3 shadow-xl backdrop-blur-md sm:w-72"
              onClick={handleMenuAction}
            >
              {Links}
            </ul>
          )}
        </div>

        <Link to="/" className="btn btn-ghost px-2 hover:bg-white/45 sm:px-3">
          <img
            className="h-9 w-auto rounded-xl bg-white/90 p-1 sm:h-10"
            src={logo}
            alt="Logo"
          />
        </Link>
      </div>

      <div className="navbar-center relative z-10 hidden xl:flex">
        <ul className="menu menu-horizontal items-center gap-4 px-1 text-[15px] 2xl:gap-6">
          {Links}
        </ul>
      </div>

      <div className="navbar-end relative z-10 gap-2 sm:gap-3">
        <div className="hidden md:flex xl:hidden">
          <ul className="menu menu-horizontal items-center gap-3 px-1 text-sm">
            {Links}
          </ul>
        </div>
        {user ? (
          <button
            type="button"
            className="btn border-none bg-cyan-950 px-4 text-white hover:bg-cyan-900"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/login"
            onClick={handleMenuAction}
            className="rounded-lg bg-cyan-950 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-900 sm:text-base"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
