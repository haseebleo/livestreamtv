export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const items = await db.menuItem.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (err) {
    console.error("[menus GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { label, href, order, parent, menuName } = await req.json();

    if (!label || !href) {
      return NextResponse.json({ error: "Label and href are required" }, { status: 400 });
    }

    const item = await db.menuItem.create({
      data: {
        label,
        href,
        order: order ?? 0,
        parent: parent ?? "",
        menuName: menuName ?? "main",
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("[menus POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
