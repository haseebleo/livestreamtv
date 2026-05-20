"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, BookOpen, Radio, BarChart2, PlusCircle, Settings,
  Pencil, Tv, TrendingUp,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  status: string;
  category: string;
  updatedAt: string;
}

interface StatsState {
  posts: number;
  pages: number;
  channels: number;
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

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<StatsState>({ posts: 0, pages: 0, channels: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [postsRes, pagesRes, channelsRes] = await Promise.all([
          fetch("/api/admin/posts"),
          fetch("/api/admin/pages"),
          fetch("/api/admin/channels"),
        ]);
        const postsData = await postsRes.json();
        const pagesData = await pagesRes.json();
        const channelsData = await channelsRes.json();

        setPosts(Array.isArray(postsData) ? postsData.slice(0, 5) : []);
        setStats({
          posts: Array.isArray(postsData) ? postsData.length : 0,
          pages: Array.isArray(pagesData) ? pagesData.length : 0,
          channels: Array.isArray(channelsData) ? channelsData.length : 0,
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    { label: "Total Posts", value: stats.posts, icon: FileText, color: "#7c3aed", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.2)" },
    { label: "Total Pages", value: stats.pages, icon: BookOpen, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
    { label: "Channels", value: stats.channels, icon: Radio, color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
    { label: "Site Visits", value: "12,450", icon: BarChart2, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
  ];

  const quickActions = [
    { label: "New Post", icon: PlusCircle, href: "/admin/posts/new", color: "#7c3aed" },
    { label: "New Page", icon: BookOpen, href: "/admin/pages/new", color: "#3b82f6" },
    { label: "Edit Menu", icon: Pencil, href: "/admin/menus", color: "#10b981" },
    { label: "Settings", icon: Settings, href: "/admin/settings", color: "#f59e0b" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>Welcome back — here&apos;s your site overview</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
        >
          <PlusCircle className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl p-5"
              style={{ background: "#141422", border: `1px solid ${card.border}` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: card.bg }}>
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-2xl font-black text-white mb-0.5">{card.value}</p>
              <p className="text-xs" style={{ color: "#6b7280" }}>{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden" style={{ background: "#0e0e1a", border: "1px solid #1e1e2e" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #1e1e2e" }}>
            <h2 className="font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: "#7c3aed" }} />
              Recent Posts
            </h2>
            <Link href="/admin/posts" className="text-xs font-medium transition-colors"
              style={{ color: "#7c3aed" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7c3aed")}>
              View all
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center text-sm" style={{ color: "#6b7280" }}>No posts yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #1e1e2e" }}>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>Title</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell" style={{ color: "#6b7280" }}>Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide hidden md:table-cell" style={{ color: "#6b7280" }}>Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="transition-colors" style={{ borderBottom: "1px solid rgba(30,30,46,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a2a")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td className="px-5 py-3 font-medium text-white truncate max-w-[200px]">{post.title}</td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-5 py-3 text-xs hidden md:table-cell" style={{ color: "#6b7280" }}>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/posts/${post.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                        style={{ color: "#7c3aed" }}>
                        <Pencil className="w-3 h-3" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl p-5" style={{ background: "#141422", border: "1px solid #1e1e2e" }}>
          <h2 className="font-bold text-white flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4" style={{ color: "#10b981" }} />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-center transition-all"
                  style={{ background: "#0e0e1a", border: "1px solid #1e1e2e" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1a1a2a";
                    e.currentTarget.style.borderColor = action.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0e0e1a";
                    e.currentTarget.style.borderColor = "#1e1e2e";
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${action.color}1a` }}>
                    <Icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <span className="text-xs font-semibold text-white">{action.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Site status */}
          <div className="mt-4 p-3 rounded-xl" style={{ background: "#0e0e1a", border: "1px solid #1e1e2e" }}>
            <div className="flex items-center gap-2 mb-2">
              <Tv className="w-4 h-4" style={{ color: "#7c3aed" }} />
              <span className="text-sm font-semibold text-white">Site Status</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs" style={{ color: "#34d399" }}>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
