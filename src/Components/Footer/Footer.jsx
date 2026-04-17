import React, { useContext } from "react";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import logo from "../../assets/images/logo.png";

const Footer = () => {
  const { user } = useContext(AuthContext) || {};
  const currentYear = new Date().getFullYear();