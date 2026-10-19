import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-extrabold text-fg">
        Welcome back, {user.name}
      </h1>
      <p className="mt-2 text-muted">{user.email}</p>

      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-fg hover:bg-primary-hover"
      >
        Log out
      </button>

      <p className="mt-8 text-sm text-muted">
        Temporary page. The real dashboard with sidebar comes in the next step.
      </p>
    </div>
  );
};

export default Dashboard;