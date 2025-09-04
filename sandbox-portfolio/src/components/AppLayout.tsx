import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="grid grid-cols-[minmax(240px,280px)_1fr]">
        <aside className="fixed left-0 top-0 bottom-0 w-[240px] p-6">
          <Sidebar />
        </aside>

        <main className="ml-[240px] p-8 min-h-screen">
          <div className="max-w-[1100px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
