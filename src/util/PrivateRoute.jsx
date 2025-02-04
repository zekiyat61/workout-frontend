import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isUserLoggedIn = localStorage.getItem("token");
  return <div>{isUserLoggedIn ? <Outlet /> : <Navigate to="/" />}</div>;
};

export default PrivateRoute;
