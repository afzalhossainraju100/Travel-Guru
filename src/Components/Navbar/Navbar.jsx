import React, { use } from "react";
import Home from "../Home/Home";
import { NavLink } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const {user, signOutUser} = use(AuthContext);
  const handleSignOut = ()=>{
    signOutUser()
    .then(()=>{
      //sign-out successful
    })
    .catch((error)=>{
      console.error("Error signing out:", error);
    });
  }
  const Links = (
    <>
      <li>
        <NavLink to="/"
        className={({isActive})=>{
          return isActive? "text-blue-500 underline hover:text-blue-700":"";
        }}>Home</NavLink>
      </li>
      <li>
        <NavLink to="/login" className={({ isActive }) => {
          return isActive ? "text-blue-500 underline hover:text-blue-700" : "";
        }}>Login</NavLink>
      </li>
      <li>
        <NavLink to="/register" className={({isActive})=>{
          return isActive ? "text-blue-500 underline hover:text-blue-700": "";
        }}>Signup</NavLink>
      </li>
      {
        user && <>
        <li><NavLink to='/orders'>Orders</NavLink></li>
        <li><NavLink to='/profile'>Profile</NavLink></li>

        </>
      }
    </>
  );
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {Links}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-6">{Links}</ul>
      </div>
      <div className="navbar-end">
        
        {
          user? <a className="btn" onClick={handleSignOut}>Sign Out</a>: <Link to="/login">Login</Link>
        }
      </div>
    </div>
  );
};

export default Navbar;
