"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tv, Mail, Lock, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        return;
      }

      router.push("/admin");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#080810" }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
            <Tv className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">LiveStreamTV.pk</h1>
          <p className="text-sm" style={{ color: "#9ca3af" }}>Admin Panel</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: "#141422", border: "1px solid #1e1e2e" }}>
          <h2 className="text-lg font-bold text-white mb-6">Sign in to continue</h2>

          {error && (
            <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-lg text-sm"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#4b5563" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@livestreamtv.pk"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
                  style={{ background: "#0e0e1a", border: "1px solid #1e1e2e" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#9ca3af" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#4b5563" }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
                  style={{ background: "#0e0e1a", border: "1px solid #1e1e2e" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "#4b5563" }}>
          LiveStreamTV.pk &mdash; Admin Panel
        </p>
      </div>
    </div>
  );
}
