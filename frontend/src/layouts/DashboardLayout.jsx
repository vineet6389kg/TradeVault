import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  // controls the mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // leaves the demo account and goes to another page
  const leaveDemo = (path) => {
    logout();
    navigate(path);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* shown only on the shared demo account */}
        {user.isDemo && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-primary px-4 py-2 text-sm text-primary-fg">
            <span>You are viewing the demo account with sample data.</span>
            <button
              onClick={() => leaveDemo("/register")}
              className="font-bold underline"
            >
              Create your free account
            </button>
            <button onClick={() => leaveDemo("/")} className="underline">
              Exit demo
            </button>
          </div>
        )}

        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* each page shows up here (Outlet) while the sidebar stays */}
        <main className="flex-1 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;