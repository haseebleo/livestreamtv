export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

// Hardcoded super-admin fallback — works even when DB is unavailable.
// Override via ADMIN_EMAIL / ADMIN_PASSWORD env vars.
const SUPER_EMAIL    = process.env.ADMIN_EMAIL    ?? "admin@livestreamtv.pk";
const SUPER_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@2026!";
const SUPER_ID       = "super-admin";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // ── 1. Check hardcoded super-admin first (no DB needed) ──
    if (email === SUPER_EMAIL && password === SUPER_PASSWORD) {
      await createSession(SUPER_ID, "admin");
      return NextResponse.json({ ok: true });
    }

    // ── 2. Fallback: check DB users ──
    try {
      const user = await db.user.findUnique({ where: { email } });
      if (user) {
        const valid = await bcrypt.compare(password, user.password);
        if (valid) {
          await createSession(user.id, user.role);
          return NextResponse.json({ ok: true });
        }
      }
    } catch {
      // DB unavailable — super-admin check above already handled the valid case
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
