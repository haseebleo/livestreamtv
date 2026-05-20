import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const key = new TextEncoder().encode(process.env.JWT_SECRET ?? "lstv-secret-key-change-in-production");

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("lstv_session")?.value;
    if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));
    try {
      await jwtVerify(token, key);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
