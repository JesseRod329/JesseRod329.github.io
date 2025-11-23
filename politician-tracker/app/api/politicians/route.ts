import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") ?? undefined;
  const chamber = searchParams.get("chamber") ?? undefined;
  const party = searchParams.get("party") ?? undefined;
  const state = searchParams.get("state") ?? undefined;

  const where: any = {};
  if (name) where.fullName = { contains: name, mode: "insensitive" };
  if (chamber) where.chamber = chamber;
  if (party) where.party = party;
  if (state) where.state = state;

  const data = await prisma.politician.findMany({
    where,
    orderBy: { fullName: "asc" },
    include: { trades: { take: 5, orderBy: { reportedTransactionDate: "desc" } } }
  });

  return NextResponse.json(data);
}
