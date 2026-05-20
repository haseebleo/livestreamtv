"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2, Search, FileText } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  updatedAt: string;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "published") {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
        style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
        Published
      </span>
    );
  }
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "#fbbf24" }}>
      Draft
    </span>
  );
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete post "${title}"? This cannot be undone.`)) return;
    try {
      await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete post.");
    }
  }

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white">Posts</h1>
          <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
            {posts.length} post{posts.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "#7c3aed" }}
        >
          <PlusCircle className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#4b5563" }} />
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
          style={{ background: "#0e0e1a", border: "1px solid #1e1e2e" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#0e0e1a", border: "1px solid #1e1e2e" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <FileText className="w-10 h-10" style={{ color: "#374151" }} />
            <p className="text-sm" style={{ color: "#6b7280" }}>
              {search ? "No posts match your search" : "No posts yet"}
            </p>
            {!search && (
              <Link href="/admin/posts/new" className="text-sm font-medium" style={{ color: "#7c3aed" }}>
                Create your first post
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #1e1e2e" }}>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide hidden md:table-cell" style={{ color: "#6b7280" }}>Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell" style={{ color: "#6b7280" }}>Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell" style={{ color: "#6b7280" }}>Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr
                  key={post.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid rgba(30,30,46,0.5)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a2a")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium text-white truncate max-w-[250px]">{post.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>/{post.slug}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: "#141422", color: "#9ca3af", border: "1px solid #1e1e2e" }}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-5 py-3 text-xs hidden lg:table-cell" style={{ color: "#6b7280" }}>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "#9ca3af" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.15)"; e.currentTarget.style.color = "#a78bfa"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "#9ca3af" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#f87171"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
