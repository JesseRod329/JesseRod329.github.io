import { Politician } from "@prisma/client";

export function PoliticianCard({ politician }: { politician: Politician }) {
  return (
    <div className="border border-slate-200 bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{politician.fullName}</h3>
          <p className="text-sm text-slate-600">
            {politician.chamber} · {politician.party} {politician.state ? `· ${politician.state}` : ""}
          </p>
        </div>
        <a className="text-sm text-brand-700" href={`/politicians/${politician.id}`}>
          View
        </a>
      </div>
      {politician.committees && (
        <p className="mt-2 text-xs text-slate-600">Committees: {politician.committees}</p>
      )}
    </div>
  );
}
