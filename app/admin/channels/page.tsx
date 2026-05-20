"use client";

import { useEffect, useState } from "react";
import { Radio, Trash2, PlusCircle, Loader2, CheckCircle, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";

interface Channel {
  id: string;
  name: string;
  country: string;
  category: string;
  active: boolean;
  order: number;
}

type Toast = { type: "success" | "error"; message: string } | null;

function ToastBanner({ toast }: { toast: Toast }) {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
      style={{
        background: isSuccess ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
        border: `1px solid ${isSuccess ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
        color: isSuccess ? "#34d399" : "#f87171",
      }}>
      {isSuccess ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      {toast.message}
    </div>
  );
}

const inputStyle = { background: "#0e0e1a", border: "1px solid #1e1e2e" };
const baseInputClass = "w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none transition-colors";

function FocusInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={baseInputClass}
      style={inputStyle}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
      {...props}
    />
  );
}

const CATEGORIES = ["Sports", "News", "Entertainment", "Kids", "Movies", "Music", "Documentary"];

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const [form, setForm] = useState({
    name: "",
    country: "🇵🇰 PK",
    category: "Sports",
    order: "0",
  });

  function showToast(t: Toast) {
    setToast(t);
    setTimeout(() => setToast(null), 3500);
  }

  async function fetchChannels() {
    try {
      const res = await fetch("/api/admin/channels");
      const data = await res.json();
      setChannels(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchChannels(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast({ type: "error", message: "Channel name is required." });
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/admin/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          country: form.country,
          category: form.category,
          active: true,
          order: parseInt(form.order, 10) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast({ type: "error", message: data.error ?? "Failed to add channel." });
        return;
      }
      setChannels((prev) => [...prev, data].sort((a, b) => a.order - b.order));
      setForm({ name: "", country: "🇵🇰 PK", category: "Sports", order: "0" });
      showToast({ type: "success", message: "Channel added!" });
    } catch {
      showToast({ type: "error", message: "Network error." });
    } finally {
      setAdding(false);
    }
  }

  async function handleToggleActive(channel: Channel) {
    try {
      const res = await fetch(`/api/admin/channels/${channel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !channel.active }),
      });
      if (res.ok) {
        setChannels((prev) => prev.map((c) => c.id === channel.id ? { ...c, active: !c.active } : c));
      }
    } catch {
      // ignore
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete channel "${name}"?`)) return;
    try {
      await fetch(`/api/admin/channels/${id}`, { method: "DELETE" });
      setChannels((prev) => prev.filter((c) => c.id !== id));
      showToast({ type: "success", message: "Channel deleted." });
    } catch {
      showToast({ type: "error", message: "Failed to delete channel." });
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Channels</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>Manage live TV channels</p>
      </div>

      {toast && <ToastBanner toast={toast} />}

      {/* Add Form */}
      <div className="rounded-xl p-5 space-y-4" style={{ background: "#141422", border: "1px solid #1e1e2e" }}>
        <h2 className="font-bold text-white text-sm flex items-center gap-2">
          <PlusCircle className="w-4 h-4" style={{ color: "#7c3aed" }} />
          Add New Channel
        </h2>
        <form onSubmit={handleAdd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Channel Name *</label>
              <FocusInput
                type="text"
                placeholder="e.g. PTV Sports"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Country</label>
              <FocusInput
                type="text"
                placeholder="🇵🇰 PK"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none transition-colors appearance-none"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Order</label>
              <FocusInput
                type="number"
                min="0"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={adding}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60"
            style={{ background: "#7c3aed" }}
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
            {adding ? "Adding..." : "Add Channel"}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#0e0e1a", border: "1px solid #1e1e2e" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
          </div>
        ) : channels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Radio className="w-10 h-10" style={{ color: "#374151" }} />
            <p className="text-sm" style={{ color: "#6b7280" }}>No channels yet. Add one above.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #1e1e2e" }}>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell" style={{ color: "#6b7280" }}>Country</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide hidden md:table-cell" style={{ color: "#6b7280" }}>Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>Active</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell" style={{ color: "#6b7280" }}>Order</th>
                <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((ch) => (
                <tr
                  key={ch.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid rgba(30,30,46,0.5)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a2a")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(124,58,237,0.15)" }}>
                        <Radio className="w-4 h-4" style={{ color: "#7c3aed" }} />
                      </div>
                      <span className="font-medium text-white">{ch.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm hidden sm:table-cell" style={{ color: "#9ca3af" }}>
                    {ch.country}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#141422", color: "#9ca3af", border: "1px solid #1e1e2e" }}>
                      {ch.category}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleToggleActive(ch)}
                      className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                      style={{ color: ch.active ? "#34d399" : "#6b7280" }}
                    >
                      {ch.active
                        ? <ToggleRight className="w-5 h-5" style={{ color: "#34d399" }} />
                        : <ToggleLeft className="w-5 h-5" style={{ color: "#6b7280" }} />}
                      {ch.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-sm hidden lg:table-cell" style={{ color: "#6b7280" }}>
                    {ch.order}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleDelete(ch.id, ch.name)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "#9ca3af" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#f87171"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
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
