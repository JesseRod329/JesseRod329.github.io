import { PoliticianCard } from "@/components/PoliticianCard";
import { prisma } from "@/lib/prisma";

export default async function PoliticiansPage() {
  const politicians = await prisma.politician.findMany({ orderBy: { fullName: "asc" } });
  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Politicians</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {politicians.map((p) => (
          <PoliticianCard key={p.id} politician={p} />
        ))}
      </div>
    </main>
  );
}
