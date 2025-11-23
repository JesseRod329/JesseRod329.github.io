import { NextResponse } from "next/server";
import { ingestRecentTrades } from "@/lib/ingestion";

export async function POST() {
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
  const result = await ingestRecentTrades({ since });
  return NextResponse.json({ status: "ok", ingested: result.count });
}
