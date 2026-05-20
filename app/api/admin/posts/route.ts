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
    const posts = await db.post.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error("[posts GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, slug, excerpt, content, category, status, featured, metaTitle, metaDesc } =
      await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const finalSlug = slug ? slugify(slug) : slugify(title);

    const post = await db.post.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt ?? null,
        content: content ?? "",
        category: category ?? "general",
        status: status ?? "draft",
        featured: featured ?? false,
        metaTitle: metaTitle ?? null,
        metaDesc: metaDesc ?? null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err: unknown) {
    console.error("[posts POST]", err);
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
