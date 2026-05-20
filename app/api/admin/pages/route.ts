export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  try {
    const pages = await db.page.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(pages);
  } catch (err) {
    console.error("[pages GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, slug, content, metaTitle, metaDesc, status } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const finalSlug = slug ? slugify(slug) : slugify(title);

    const page = await db.page.create({
      data: {
        title,
        slug: finalSlug,
        content: content ?? "",
        metaTitle: metaTitle ?? null,
        metaDesc: metaDesc ?? null,
        status: status ?? "draft",
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (err: unknown) {
    console.error("[pages POST]", err);
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
