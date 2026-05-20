export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const item = await db.menuItem.update({
      where: { id },
      data: {
        ...(body.label !== undefined && { label: body.label }),
        ...(body.href !== undefined && { href: body.href }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.parent !== undefined && { parent: body.parent }),
        ...(body.menuName !== undefined && { menuName: body.menuName }),
      },
    });

    return NextResponse.json(item);
  } catch (err: unknown) {
    console.error("[menus/[id] PATCH]", err);
    if ((err as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.menuItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[menus/[id] DELETE]", err);
    if ((err as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
