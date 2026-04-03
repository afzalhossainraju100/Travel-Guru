import React from "react";
import Navbar from "../Components/Navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer/Footer.jsx";

const Roots = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar></Navbar>
      <div className="grow pt-16">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Roots;
