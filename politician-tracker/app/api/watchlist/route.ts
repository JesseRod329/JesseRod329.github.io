import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEMO_USER_ID = "demo-user";

async function ensureDemoUser() {
  return prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {},
    create: { id: DEMO_USER_ID }
  });
}

export async function GET() {
  await ensureDemoUser();
  const watchlist = await prisma.watchlist.findFirst({
    where: { userId: DEMO_USER_ID },
    include: { items: { include: { politician: true } } }
  });
  return NextResponse.json(watchlist);
}

export async function POST(req: NextRequest) {
  await ensureDemoUser();
  const body = await req.json();
  const { type, ticker, politicianId } = body;
  const watchlist = await prisma.watchlist.upsert({
    where: { userId_name: { userId: DEMO_USER_ID, name: "My Watchlist" } },
    update: {},
    create: { userId: DEMO_USER_ID, name: "My Watchlist" }
  });

  const item = await prisma.watchlistItem.create({
    data: {
      watchlistId: watchlist.id,
      type,
      ticker: ticker?.toUpperCase() ?? null,
      politicianId: politicianId ?? null
    }
  });
  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
  await prisma.watchlistItem.delete({ where: { id } });
  return NextResponse.json({ status: "removed" });
}
