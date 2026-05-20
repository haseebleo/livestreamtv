"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Tv, LayoutDashboard, FileText, BookOpen, Menu as MenuIcon,
  Radio, Image, Users, Settings, Key, LogOut, ExternalLink,
  ChevronRight, X, AlignLeft,
} from "lucide-react";

const navSections = [
  {
    label: "CONTENT",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/posts", label: "Posts", icon: FileText },
      { href: "/admin/pages", label: "Pages", icon: BookOpen },
    ],
  },
  {
    label: "SITE",
    items: [
      { href: "/admin/menus", label: "Menu Editor", icon: MenuIcon },
      { href: "/admin/channels", label: "Channels", icon: Radio },
      { href: "/admin/media", label: "Media", icon: Image },
    ],
  },
  {
    label: "CONFIG",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/api-keys", label: "API Keys", icon: Key },
    ],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: "1px solid #1e1e2e" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
            <Tv className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-white leading-tight">LiveStreamTV</p>
            <p className="text-[10px]" style={{ color: "#6b7280" }}>Admin Panel</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-bold px-3 mb-2 tracking-widest" style={{ color: "#4b5563" }}>
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all group"
                    style={{
                      background: active ? "rgba(124,58,237,0.15)" : "transparent",
                      border: active ? "1px solid rgba(124,58,237,0.25)" : "1px solid transparent",
                      color: active ? "#c4b5fd" : "#9ca3af",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#9ca3af";
                      }
                    }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {active && <ChevronRight className="w-3 h-3" style={{ color: "#7c3aed" }} />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 space-y-1" style={{ borderTop: "1px solid #1e1e2e" }}>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ color: "#9ca3af" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#9ca3af";
          }}
        >
          <ExternalLink className="w-4 h-4" />
          Visit Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left"
          style={{ color: "#9ca3af" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#9ca3af";
          }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

function PageTitle() {
  const pathname = usePathname();

  const titles: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/posts": "Posts",
    "/admin/posts/new": "New Post",
    "/admin/pages": "Pages",
    "/admin/pages/new": "New Page",
    "/admin/menus": "Menu Editor",
    "/admin/channels": "Channels",
    "/admin/users": "Users",
    "/admin/settings": "Settings",
    "/admin/media": "Media",
    "/admin/api-keys": "API Keys",
  };

  if (pathname.match(/^\/admin\/posts\/[^/]+$/)) return "Edit Post";
  if (pathname.match(/^\/admin\/pages\/[^/]+$/)) return "Edit Page";

  return titles[pathname] ?? "Admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't render sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#080810" }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 z-40"
        style={{ background: "#0e0e1a", borderRight: "1px solid #1e1e2e" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="relative w-60 flex flex-col z-50"
            style={{ background: "#0e0e1a", borderRight: "1px solid #1e1e2e" }}
          >
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex items-center gap-4 px-6 h-14"
          style={{ background: "rgba(8,8,16,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e1e2e" }}
        >
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <AlignLeft className="w-5 h-5 text-gray-400" />
          </button>

          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: "#4b5563" }}>Admin</span>
            <ChevronRight className="w-3 h-3" style={{ color: "#374151" }} />
            <span className="text-white font-medium">
              <PageTitle />
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
