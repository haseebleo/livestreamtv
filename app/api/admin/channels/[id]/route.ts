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

    const channel = await db.channel.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.country !== undefined && { country: body.country }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });

    return NextResponse.json(channel);
  } catch (err: unknown) {
    console.error("[channels/[id] PATCH]", err);
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
    await db.channel.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[channels/[id] DELETE]", err);
    if ((err as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
