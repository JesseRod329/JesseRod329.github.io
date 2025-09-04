import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-[200px] py-15 px-20">
          <div className="max-w-[900px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
