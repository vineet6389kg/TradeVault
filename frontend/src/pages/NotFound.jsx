import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="grid min-h-screen place-items-center bg-linear-to-br from-primary/5 via-white to-accent/10 px-5 text-center">
      <div>
        <p className="text-7xl font-extrabold text-primary">404</p>
        <h1 className="mt-3 text-2xl font-extrabold text-fg">Page not found</h1>
        <p className="mt-2 text-muted">
          The page you are looking for does not exist or was moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-fg hover:bg-primary-hover"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;