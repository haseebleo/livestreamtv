export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const rows = await db.setting.findMany();
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return NextResponse.json(settings);
  } catch (err) {
    console.error("[settings GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json();

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const setting = await db.setting.upsert({
      where: { key },
      update: { value: String(value ?? "") },
      create: { key, value: String(value ?? "") },
    });

    return NextResponse.json(setting);
  } catch (err) {
    console.error("[settings POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
