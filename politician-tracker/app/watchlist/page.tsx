import { WatchlistCard } from "@/components/WatchlistCard";
import { prisma } from "@/lib/prisma";

const DEMO_USER_ID = "demo-user";

async function getWatchlist() {
  await prisma.user.upsert({ where: { id: DEMO_USER_ID }, update: {}, create: { id: DEMO_USER_ID } });
  const list = await prisma.watchlist.findFirst({
    where: { userId: DEMO_USER_ID },
    include: { items: { include: { politician: true } } }
  });
  if (!list) {
    return {
      id: "temp",
      name: "My Watchlist",
      politicians: [],
      tickers: []
    };
  }

  return {
    id: list.id,
    name: list.name,
    politicians: list.items.filter((i) => i.politician).map((i) => i.politician!).map((p) => ({
      id: p.id,
      fullName: p.fullName,
      party: p.party as any,
      chamber: p.chamber as any,
      state: p.state ?? null
    })),
    tickers: list.items.filter((i) => i.ticker).map((i) => i.ticker!)
  };
}

export default async function WatchlistPage() {
  const entry = await getWatchlist();
  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Watchlist</h2>
          <p className="text-sm text-slate-600">Demo watchlist scoped to a single user.</p>
        </div>
        <a className="text-sm text-brand-700" href="/politicians">
          Add items
        </a>
      </div>
      <WatchlistCard entry={entry} />
    </main>
  );
}
