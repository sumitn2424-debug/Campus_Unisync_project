import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "./Loader";

export default function AdminRoute() {
  const { userInformation, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <Loader />;
  }

  // Check if user exists and has admin role
  if (!userInformation || userInformation.role !== "admin") {
      // If not admin, redirect to home
      return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
