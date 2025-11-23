import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Public Trade Transparency",
  description:
    "Track and analyze public stock and options trades disclosed by U.S. politicians. Transparency focused; not investment advice."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Public Trade Transparency</h1>
              <p className="text-sm text-slate-600">
                Research tool for monitoring trades disclosed by U.S. politicians. This is not investment, legal, or tax
                advice. Data is derived from public filings and may be delayed or estimated.
              </p>
            </div>
            <nav className="flex gap-3 text-sm font-medium text-slate-700">
              <a href="/">Dashboard</a>
              <a href="/politicians">Politicians</a>
              <a href="/watchlist">Watchlist</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
