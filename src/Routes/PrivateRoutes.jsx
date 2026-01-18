import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Contextx/AuthContext/AuthContext";
import { useLocation } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const authInfo = useContext(AuthContext);
  const { user, loading } = authInfo || {};
  const location = useLocation();
  console.log(location);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (user) {
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoutes;
