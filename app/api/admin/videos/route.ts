export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contentId   = searchParams.get("contentId");
  const contentType = searchParams.get("contentType");
  const episode     = searchParams.get("episode");
  const season      = searchParams.get("season");

  const where: Record<string, unknown> = {};
  if (contentId)   where.contentId   = contentId;
  if (contentType) where.contentType = contentType;
  if (episode)     where.episode     = parseInt(episode);
  if (season)      where.season      = parseInt(season);

  const videos = await db.videoLink.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { contentId, contentType, season = 1, episode = 0, serverName, embedUrl, quality, lang } = body;

  if (!contentId || !contentType || !serverName || !embedUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const link = await db.videoLink.create({
    data: {
      contentId,
      contentType,
      season: Number(season),
      episode: Number(episode),
      serverName,
      embedUrl,
      quality: quality ?? "HD",
      lang:    lang    ?? "Urdu",
    },
  });
  return NextResponse.json(link, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await db.videoLink.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
