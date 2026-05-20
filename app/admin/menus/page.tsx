"use client";

import { useEffect, useState } from "react";
import { Menu, Trash2, PlusCircle, GripVertical, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  order: number;
  menuName: string;
  parent: string;
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

export default function MenusPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const [form, setForm] = useState({ label: "", href: "", order: "0" });

  function showToast(t: Toast) {
    setToast(t);
    setTimeout(() => setToast(null), 3500);
  }

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/menus");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label.trim() || !form.href.trim()) {
      showToast({ type: "error", message: "Label and URL are required." });
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/admin/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: form.label,
          href: form.href,
          order: parseInt(form.order, 10) || 0,
          menuName: "main",
          parent: "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast({ type: "error", message: data.error ?? "Failed to add item." });
        return;
      }
      setItems((prev) => [...prev, data].sort((a, b) => a.order - b.order));
      setForm({ label: "", href: "", order: "0" });
      showToast({ type: "success", message: "Menu item added!" });
    } catch {
      showToast({ type: "error", message: "Network error." });
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string, label: string) {
    if (!window.confirm(`Remove "${label}" from menu?`)) return;
    try {
      await fetch(`/api/admin/menus/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast({ type: "success", message: "Menu item removed." });
    } catch {
      showToast({ type: "error", message: "Failed to delete item." });
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Menu Editor</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>Manage navigation links for your site</p>
      </div>

      {toast && <ToastBanner toast={toast} />}

      {/* Current Menu */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#0e0e1a", border: "1px solid #1e1e2e" }}>
        <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid #1e1e2e" }}>
          <Menu className="w-4 h-4" style={{ color: "#7c3aed" }} />
          <h2 className="font-bold text-white text-sm">Main Navigation</h2>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "#141422", color: "#6b7280", border: "1px solid #1e1e2e" }}>
            {items.length} items
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-sm" style={{ color: "#6b7280" }}>
            No menu items yet. Add your first link below.
          </div>
        ) : (
          <div>
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors group"
                style={{ borderBottom: idx < items.length - 1 ? "1px solid rgba(30,30,46,0.5)" : "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a2a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <GripVertical className="w-4 h-4 flex-shrink-0" style={{ color: "#374151" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs truncate" style={{ color: "#6b7280" }}>{item.href}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded hidden sm:inline-block" style={{ background: "#141422", color: "#4b5563", border: "1px solid #1e1e2e" }}>
                  Order: {item.order}
                </span>
                <button
                  onClick={() => handleDelete(item.id, item.label)}
                  className="p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  style={{ color: "#9ca3af" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#f87171"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Form */}
      <div className="rounded-xl p-5 space-y-4" style={{ background: "#141422", border: "1px solid #1e1e2e" }}>
        <h2 className="font-bold text-white text-sm flex items-center gap-2">
          <PlusCircle className="w-4 h-4" style={{ color: "#7c3aed" }} />
          Add Menu Item
        </h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Label *</label>
              <FocusInput
                type="text"
                placeholder="e.g. Cricket"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>URL *</label>
              <FocusInput
                type="text"
                placeholder="e.g. /cricket"
                value={form.href}
                onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="max-w-32">
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Order</label>
            <FocusInput
              type="number"
              min="0"
              placeholder="0"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
            />
          </div>
          <button
            type="submit"
            disabled={adding}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60"
            style={{ background: "#7c3aed" }}
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
            {adding ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
