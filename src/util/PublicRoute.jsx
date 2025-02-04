import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const isUserLoggedIn = localStorage.getItem("token");
  return <div>{isUserLoggedIn ? <Navigate to="/home" /> : <Outlet />}</div>;
};

export default PublicRoute;
