import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const [slow, setSlow] = useState(false);

  // free hosting sleeps when nobody uses it, so the first request can take a while
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, [loading]);

  // wait until we know if the saved token is valid
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center px-5 text-center">
        <div aria-live="polite">
          <span className="mx-auto block h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="mt-4 text-muted">Loading...</p>
          {slow && (
            <p className="mt-2 max-w-xs text-sm text-muted">
              Waking up the server. This can take up to a minute on free hosting.
            </p>
          )}
        </div>
      </div>
    );
  }

  // logged in: show the page, otherwise go to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;