export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const channels = await db.channel.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(channels);
  } catch (err) {
    console.error("[channels GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, country, category, active, order } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const channel = await db.channel.create({
      data: {
        name,
        country: country ?? "PK",
        category: category ?? "Sports",
        active: active ?? true,
        order: order ?? 0,
      },
    });

    return NextResponse.json(channel, { status: 201 });
  } catch (err) {
    console.error("[channels POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
