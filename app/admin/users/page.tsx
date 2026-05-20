"use client";

import { useEffect, useState } from "react";
import { Users, Trash2, PlusCircle, Loader2, CheckCircle, AlertCircle, ShieldCheck, Edit2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
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

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "admin";
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
      style={{
        background: isAdmin ? "rgba(124,58,237,0.1)" : "rgba(59,130,246,0.1)",
        border: `1px solid ${isAdmin ? "rgba(124,58,237,0.3)" : "rgba(59,130,246,0.3)"}`,
        color: isAdmin ? "#a78bfa" : "#60a5fa",
      }}>
      <ShieldCheck className="w-3 h-3" />
      {role}
    </span>
  );
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });

  function showToast(t: Toast) {
    setToast(t);
    setTimeout(() => setToast(null), 3500);
  }

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      showToast({ type: "error", message: "Name, email, and password are required." });
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast({ type: "error", message: data.error ?? "Failed to add user." });
        return;
      }
      setUsers((prev) => [data, ...prev]);
      setForm({ name: "", email: "", password: "", role: "admin" });
      setShowForm(false);
      showToast({ type: "success", message: "User added successfully!" });
    } catch {
      showToast({ type: "error", message: "Network error." });
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast({ type: "success", message: "User deleted." });
    } catch {
      showToast({ type: "error", message: "Failed to delete user." });
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white">Users</h1>
          <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
            {users.length} user{users.length !== 1 ? "s" : ""} with admin access
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "#7c3aed" }}
        >
          <PlusCircle className="w-4 h-4" />
          Add User
        </button>
      </div>

      {toast && <ToastBanner toast={toast} />}

      {/* Add User Form */}
      {showForm && (
        <div className="rounded-xl p-5 space-y-4" style={{ background: "#141422", border: "1px solid #1e1e2e" }}>
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            <Edit2 className="w-4 h-4" style={{ color: "#7c3aed" }} />
            New User
          </h2>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Full Name *</label>
                <FocusInput
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Email *</label>
                <FocusInput
                  type="email"
                  placeholder="user@livestreamtv.pk"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Password *</label>
                <FocusInput
                  type="password"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none transition-colors appearance-none"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={adding}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60"
                style={{ background: "#7c3aed" }}
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                {adding ? "Creating..." : "Create User"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: "#9ca3af", border: "1px solid #1e1e2e" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a2a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#0e0e1a", border: "1px solid #1e1e2e" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Users className="w-10 h-10" style={{ color: "#374151" }} />
            <p className="text-sm" style={{ color: "#6b7280" }}>No users yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #1e1e2e" }}>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide hidden md:table-cell" style={{ color: "#6b7280" }}>Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell" style={{ color: "#6b7280" }}>Joined</th>
                <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid rgba(30,30,46,0.5)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a2a")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
                        {getInitials(user.name)}
                      </div>
                      <span className="font-medium text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell" style={{ color: "#9ca3af" }}>
                    {user.email}
                  </td>
                  <td className="px-5 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-5 py-3 text-xs hidden lg:table-cell" style={{ color: "#6b7280" }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "#9ca3af" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#f87171"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
                        title="Delete user"
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
