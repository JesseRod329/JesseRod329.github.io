import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 min-h-screen">
      {/* Left nav */}
      <aside className="hidden md:block md:col-span-3 border-r border-muted">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="col-span-12 md:col-span-9 p-8">{children}</div>
    </div>
  );
}
