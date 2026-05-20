"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type Toast = { type: "success" | "error"; message: string } | null;

function ToastBanner({ toast }: { toast: Toast }) {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm mb-4"
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

function FocusTextarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`${baseInputClass} resize-none ${className ?? ""}`}
      style={inputStyle}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
      {...props}
    />
  );
}

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  category: string;
  featured: boolean;
  metaTitle: string;
  metaDesc: string;
}

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<PostForm>({
    title: "", slug: "", excerpt: "", content: "",
    status: "draft", category: "general", featured: false,
    metaTitle: "", metaDesc: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/posts/${id}`);
        if (!res.ok) { router.push("/admin/posts"); return; }
        const data = await res.json();
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          status: data.status ?? "draft",
          category: data.category ?? "general",
          featured: data.featured ?? false,
          metaTitle: data.metaTitle ?? "",
          metaDesc: data.metaDesc ?? "",
        });
      } catch {
        router.push("/admin/posts");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  function set(field: keyof PostForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleTitleChange(val: string) {
    set("title", val);
    if (!slugManual) set("slug", slugify(val));
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setToast({ type: "error", message: "Title is required." });
      return;
    }
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({ type: "error", message: data.error ?? "Failed to save." });
        return;
      }
      setToast({ type: "success", message: "Post saved successfully!" });
    } catch {
      setToast({ type: "error", message: "Network error." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${form.title}"? This cannot be undone.`)) return;
    try {
      await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      router.push("/admin/posts");
    } catch {
      alert("Failed to delete post.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">Edit Post</h1>
            <p className="text-sm mt-0.5 truncate max-w-xs" style={{ color: "#9ca3af" }}>{form.title}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      <ToastBanner toast={toast} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#141422", border: "1px solid #1e1e2e" }}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#9ca3af" }}>Title *</label>
              <FocusInput
                type="text"
                placeholder="Enter post title..."
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-lg font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#9ca3af" }}>Slug</label>
              <FocusInput
                type="text"
                placeholder="post-url-slug"
                value={form.slug}
                onChange={(e) => { setSlugManual(true); set("slug", e.target.value); }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#9ca3af" }}>Excerpt</label>
              <FocusTextarea
                rows={3}
                placeholder="Short description shown in post listings..."
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#9ca3af" }}>Content</label>
              <FocusTextarea
                rows={18}
                placeholder="Write your content in Markdown..."
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                className="font-mono text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#141422", border: "1px solid #1e1e2e" }}>
            <h3 className="text-sm font-bold text-white">Publish</h3>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none transition-colors appearance-none"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none transition-colors appearance-none"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
              >
                <option value="general">General</option>
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
                <option value="movies">Movies</option>
                <option value="tv-shows">TV Shows</option>
              </select>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="w-4 h-4 rounded accent-purple-600"
              />
              <span className="text-sm text-white">Featured post</span>
            </label>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              style={{ background: "#7c3aed" }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* SEO */}
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#141422", border: "1px solid #1e1e2e" }}>
            <h3 className="text-sm font-bold text-white">SEO</h3>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Meta Title</label>
              <FocusInput
                type="text"
                placeholder="SEO title..."
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Meta Description</label>
              <FocusTextarea
                rows={3}
                placeholder="SEO description..."
                value={form.metaDesc}
                onChange={(e) => set("metaDesc", e.target.value)}
              />
              <p className="text-xs mt-1" style={{ color: "#4b5563" }}>
                {form.metaDesc.length}/160 characters
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
