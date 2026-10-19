import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // wait until we know if the saved token is valid
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-muted">
        Loading...
      </div>
    );
  }

  // logged in: show the page, otherwise go to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;