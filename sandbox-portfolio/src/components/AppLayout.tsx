import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Layout from "./Layout";

export default function AppLayout() {
  const location = useLocation();
  const isProjectsPage = location.pathname === "/projects" || location.pathname === "/";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {isProjectsPage ? (
        <div className="max-w-[1200px] mx-auto p-8">
          <Outlet />
        </div>
      ) : (
        <Layout>
          <Outlet />
        </Layout>
      )}
    </div>
  );
}
