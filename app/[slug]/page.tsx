import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const pages = await db.page.findMany({
      where: { status: "published" },
      select: { slug: true },
    });
    return pages.map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await db.page.findUnique({
      where: { slug, status: "published" },
    });
    if (!page) return { title: "Page Not Found" };
    return {
      title: page.metaTitle ?? page.title,
      description: page.metaDesc ?? undefined,
    };
  } catch {
    return { title: "Page Not Found" };
  }
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;

  let page;
  try {
    page = await db.page.findUnique({
      where: { slug, status: "published" },
    });
  } catch {
    notFound();
  }

  if (!page) {
    notFound();
  }

  const paragraphs = page.content
    ? page.content.split("\n").filter((p: string) => p.trim().length > 0)
    : [];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{page.title}</h1>
          {page.metaDesc && (
            <p className="max-w-xl mx-auto text-base" style={{ color: "#9ca3af" }}>
              {page.metaDesc}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <div
          className="rounded-xl p-8"
          style={{ background: "#141422", border: "1px solid #1e1e2e" }}
        >
          {paragraphs.length > 0 ? (
            <div className="space-y-4">
              {paragraphs.map((para: string, i: number) => (
                <p
                  key={i}
                  className="text-base leading-relaxed"
                  style={{ color: "#d1d5db" }}
                >
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-base" style={{ color: "#9ca3af" }}>
              No content available yet.
            </p>
          )}
        </div>

        {/* Last updated */}
        <p
          className="text-xs mt-6 text-center"
          style={{ color: "rgba(156,163,175,0.5)" }}
        >
          Last updated:{" "}
          {new Date(page.updatedAt).toLocaleDateString("en-PK", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
