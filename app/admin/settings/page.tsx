"use client";

import { useEffect, useState } from "react";
import {
  Settings, Globe, Key, BarChart2, Search,
  Save, CheckCircle, AlertCircle, Loader2,
} from "lucide-react";

type Toast = { type: "success" | "error"; message: string; section: string } | null;

function ToastBanner({ toast, section }: { toast: Toast; section: string }) {
  if (!toast || toast.section !== section) return null;
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

type SettingsMap = Record<string, string>;

const TABS = [
  { id: "general", label: "General", icon: Globe },
  { id: "api", label: "API Keys", icon: Key },
  { id: "ads", label: "Ads", icon: BarChart2 },
  { id: "seo", label: "SEO", icon: Search },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  function showToast(t: Toast) {
    setToast(t);
    setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (typeof data === "object" && !Array.isArray(data)) {
          setSettings(data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function get(key: string) {
    return settings[key] ?? "";
  }

  function setKey(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function saveKeys(section: string, keys: string[]) {
    setSaving(section);
    try {
      await Promise.all(
        keys.map((key) =>
          fetch("/api/admin/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value: settings[key] ?? "" }),
          })
        )
      );
      showToast({ type: "success", message: "Settings saved!", section });
    } catch {
      showToast({ type: "error", message: "Failed to save settings.", section });
    } finally {
      setSaving(null);
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>Configure your site preferences and integrations</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#0e0e1a", border: "1px solid #1e1e2e" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center"
            style={{
              background: activeTab === id ? "#141422" : "transparent",
              color: activeTab === id ? "#ffffff" : "#6b7280",
              border: activeTab === id ? "1px solid #1e1e2e" : "1px solid transparent",
            }}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="rounded-xl p-6 space-y-5" style={{ background: "#141422", border: "1px solid #1e1e2e" }}>
          <div className="flex items-center gap-2 pb-4" style={{ borderBottom: "1px solid #1e1e2e" }}>
            <Globe className="w-4 h-4" style={{ color: "#3b82f6" }} />
            <h2 className="font-bold text-white">General Settings</h2>
          </div>

          <ToastBanner toast={toast} section="general" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Site Name</label>
              <FocusInput
                type="text"
                placeholder="LiveStreamTV.pk"
                value={get("site_name")}
                onChange={(e) => setKey("site_name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Tagline</label>
              <FocusInput
                type="text"
                placeholder="Pakistan's #1 Sports Hub"
                value={get("site_tagline")}
                onChange={(e) => setKey("site_tagline", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Contact Email</label>
              <FocusInput
                type="email"
                placeholder="admin@livestreamtv.pk"
                value={get("contact_email")}
                onChange={(e) => setKey("contact_email", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Twitter Handle</label>
              <FocusInput
                type="text"
                placeholder="@livestreamtv_pk"
                value={get("twitter_handle")}
                onChange={(e) => setKey("twitter_handle", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Footer Text</label>
            <FocusTextarea
              rows={3}
              placeholder="© 2025 LiveStreamTV.pk — All rights reserved."
              value={get("footer_text")}
              onChange={(e) => setKey("footer_text", e.target.value)}
            />
          </div>

          <button
            onClick={() => saveKeys("general", ["site_name", "site_tagline", "contact_email", "twitter_handle", "footer_text"])}
            disabled={saving === "general"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60"
            style={{ background: "#7c3aed" }}
          >
            {saving === "general" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving === "general" ? "Saving..." : "Save General Settings"}
          </button>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === "api" && (
        <div className="rounded-xl p-6 space-y-5" style={{ background: "#141422", border: "1px solid #1e1e2e" }}>
          <div className="flex items-center gap-2 pb-4" style={{ borderBottom: "1px solid #1e1e2e" }}>
            <Key className="w-4 h-4" style={{ color: "#7c3aed" }} />
            <h2 className="font-bold text-white">API Keys</h2>
          </div>

          <ToastBanner toast={toast} section="api" />

          <div className="space-y-5">
            {[
              {
                label: "TMDB API Key",
                key: "tmdb_api_key",
                placeholder: "Get free key at themoviedb.org",
                hint: "Used to fetch movies and TV show data",
                type: "password",
              },
              {
                label: "CricAPI Key",
                key: "cricapi_key",
                placeholder: "Get key at cricapi.com",
                hint: "Used for live cricket scores and match data",
                type: "password",
              },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>{field.label}</label>
                <FocusInput
                  type={field.type as "text" | "password"}
                  placeholder={field.placeholder}
                  value={get(field.key)}
                  onChange={(e) => setKey(field.key, e.target.value)}
                />
                <p className="text-xs mt-1.5 flex items-start gap-1" style={{ color: "#4b5563" }}>
                  <span style={{ color: "#7c3aed" }}>i</span>
                  {field.hint}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => saveKeys("api", ["tmdb_api_key", "cricapi_key"])}
            disabled={saving === "api"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60"
            style={{ background: "#7c3aed" }}
          >
            {saving === "api" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving === "api" ? "Saving..." : "Save API Keys"}
          </button>
        </div>
      )}

      {/* Ads Tab */}
      {activeTab === "ads" && (
        <div className="rounded-xl p-6 space-y-5" style={{ background: "#141422", border: "1px solid #1e1e2e" }}>
          <div className="flex items-center gap-2 pb-4" style={{ borderBottom: "1px solid #1e1e2e" }}>
            <BarChart2 className="w-4 h-4" style={{ color: "#f59e0b" }} />
            <h2 className="font-bold text-white">Ads & Analytics</h2>
          </div>

          <ToastBanner toast={toast} section="ads" />

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>AdSense Publisher ID</label>
              <FocusInput
                type="text"
                placeholder="ca-pub-XXXXXXXXXXXXXXXXX"
                value={get("adsense_publisher_id")}
                onChange={(e) => setKey("adsense_publisher_id", e.target.value)}
              />
              <p className="text-xs mt-1.5" style={{ color: "#4b5563" }}>
                Found in your Google AdSense dashboard under Account &rsaquo; Account information
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Google Analytics ID</label>
              <FocusInput
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={get("ga_id")}
                onChange={(e) => setKey("ga_id", e.target.value)}
              />
              <p className="text-xs mt-1.5" style={{ color: "#4b5563" }}>
                Google Analytics 4 measurement ID. Required before applying for AdSense.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl text-sm" style={{ background: "#0e0e1a", border: "1px solid rgba(245,158,11,0.2)" }}>
            <p className="font-semibold mb-2" style={{ color: "#fbbf24" }}>AdSense Checklist</p>
            <ul className="space-y-1 text-xs" style={{ color: "#9ca3af" }}>
              {[
                "Add Privacy Policy, Terms, About, Contact pages",
                "Connect Google Analytics",
                "Submit to Google Search Console",
                "Verify site has enough content",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#7c3aed" }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => saveKeys("ads", ["adsense_publisher_id", "ga_id"])}
            disabled={saving === "ads"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60"
            style={{ background: "#7c3aed" }}
          >
            {saving === "ads" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving === "ads" ? "Saving..." : "Save Ads Settings"}
          </button>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === "seo" && (
        <div className="rounded-xl p-6 space-y-5" style={{ background: "#141422", border: "1px solid #1e1e2e" }}>
          <div className="flex items-center gap-2 pb-4" style={{ borderBottom: "1px solid #1e1e2e" }}>
            <Search className="w-4 h-4" style={{ color: "#10b981" }} />
            <h2 className="font-bold text-white">SEO Defaults</h2>
          </div>

          <ToastBanner toast={toast} section="seo" />

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Default Meta Title</label>
              <FocusInput
                type="text"
                placeholder="LiveStreamTV.pk — Watch Live Sports & TV"
                value={get("seo_default_title")}
                onChange={(e) => setKey("seo_default_title", e.target.value)}
              />
              <p className="text-xs mt-1.5" style={{ color: "#4b5563" }}>
                {get("seo_default_title").length}/60 characters recommended
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Default Meta Description</label>
              <FocusTextarea
                rows={3}
                placeholder="Watch live cricket, football, and TV channels online. Pakistan's #1 streaming platform."
                value={get("seo_default_desc")}
                onChange={(e) => setKey("seo_default_desc", e.target.value)}
              />
              <p className="text-xs mt-1.5" style={{ color: "#4b5563" }}>
                {get("seo_default_desc").length}/160 characters recommended
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Open Graph Image URL</label>
              <FocusInput
                type="text"
                placeholder="https://livestreamtv.pk/og-image.jpg"
                value={get("og_image")}
                onChange={(e) => setKey("og_image", e.target.value)}
              />
              <p className="text-xs mt-1.5" style={{ color: "#4b5563" }}>
                Recommended size: 1200 &times; 630px
              </p>
            </div>
          </div>

          <button
            onClick={() => saveKeys("seo", ["seo_default_title", "seo_default_desc", "og_image"])}
            disabled={saving === "seo"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60"
            style={{ background: "#7c3aed" }}
          >
            {saving === "seo" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving === "seo" ? "Saving..." : "Save SEO Settings"}
          </button>
        </div>
      )}

      {/* Bottom info card */}
      <div className="rounded-xl p-4 text-xs flex items-start gap-3" style={{ background: "#0e0e1a", border: "1px solid #1e1e2e" }}>
        <Settings className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#6b7280" }} />
        <div style={{ color: "#4b5563" }}>
          Settings are saved to the database and take effect immediately. API keys are stored encrypted-at-rest. Restart the server after changing environment-dependent settings.
        </div>
      </div>
    </div>
  );
}
