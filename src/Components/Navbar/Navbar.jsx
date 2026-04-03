import React, { use } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import HomeBg from "../../assets/images/Rectangle1.png";

const Navbar = () => {
  const { user, signOutUser } = use(AuthContext);
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
          className={({ isActive }) => {
            return isActive
              ? "font-semibold text-blue-900 underline decoration-2 underline-offset-4"
              : "text-slate-700 transition-colors hover:text-blue-900";
          }}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/login"
          className={({ isActive }) => {
            return isActive
              ? "font-semibold text-blue-900 underline decoration-2 underline-offset-4"
              : "text-slate-700 transition-colors hover:text-blue-900";
          }}
        >
          Login
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/register"
          className={({ isActive }) => {
            return isActive
              ? "font-semibold text-blue-900 underline decoration-2 underline-offset-4"
              : "text-slate-700 transition-colors hover:text-blue-900";
          }}
        >
          Signup
        </NavLink>
      </li>
      <li>
        <NavLink
          to={user ? "/packages" : "/login"}
          className={({ isActive }) => {
            return isActive
              ? "font-semibold text-blue-900 underline decoration-2 underline-offset-4"
              : "text-slate-700 transition-colors hover:text-blue-900";
          }}
        >
          All Packages
        </NavLink>
      </li>

      {user && (
        <>
          <li>
            <NavLink to="/orders">Orders</NavLink>
          </li>
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
        </>
      )}
    </>
  );
  return (
    <div className="navbar fixed top-0 left-0 z-50 w-full overflow-hidden border-b border-sky-100/80 shadow-lg shadow-sky-950/10">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-18"
          style={{ backgroundImage: `url(${HomeBg})` }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-sky-100/92 via-white/88 to-cyan-100/84" />
        <div className="absolute inset-0 bg-linear-to-b from-white/35 via-transparent to-sand-100/35" />
      </div>

      <div className="navbar-start relative z-10">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost text-sky-950 hover:bg-white/45 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content rounded-box z-1 mt-3 w-52 border border-sky-100/70 bg-white/92 p-2 shadow-lg backdrop-blur-md"
          >
            {Links}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl hover:bg-white/45">
          <img
            className="w-25 h-10 rounded-xl bg-white/90 p-1"
            src={logo}
            alt="Logo"
          />
        </a>
      </div>
      <div className="navbar-center relative z-10 hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-6">{Links}</ul>
      </div>
      <div className="navbar-end relative z-10">
        {user ? (
          <a
            className="btn border-none bg-cyan-950 text-white hover:bg-cyan-900"
            onClick={handleSignOut}
          >
            Sign Out
          </a>
        ) : (
          <Link
            to="/login"
            className="rounded-lg bg-cyan-950 px-4 py-2 font-semibold text-white hover:bg-cyan-900"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
