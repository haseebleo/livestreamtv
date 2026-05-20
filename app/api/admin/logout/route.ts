export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[logout]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
