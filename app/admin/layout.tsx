"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Settings, FileText, Tv,
  BarChart3, Bell, LogOut, ChevronRight
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/channels", label: "TV Channels", icon: Tv },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-56 glass-dark border-r border-purple-900/20 flex flex-col z-40 hidden md:flex">
        <div className="p-4 border-b border-purple-900/20">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Admin Panel</p>
              <p className="text-[10px] text-gray-400">LiveStreamTV.pk</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {adminNav.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto text-purple-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-purple-900/20">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-56 p-6">
        {children}
      </div>
    </div>
  );
}
