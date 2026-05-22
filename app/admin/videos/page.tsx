"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface VideoLink {
  id: string;
  contentId: string;
  contentType: string;
  season: number;
  episode: number;
  serverName: string;
  embedUrl: string;
  quality: string;
  lang: string;
  isActive: boolean;
  createdAt: string;
}

const CONTENT_TYPES = ["movie", "show", "drama"];
const QUALITIES = ["1080p", "720p", "480p", "HD", "CAM"];
const LANGS = ["Urdu", "English", "Hindi", "Urdu Dubbed", "With Subtitles"];

const QUICK_DRAMAS = [
  "hatim", "tere-bin", "mere-humsafar", "kabhi-main-kabhi-tum",
  "jaan-e-jahan", "ishq-murshid", "humsafar", "zindagi-gulzar-hai",
];

export default function AdminVideosPage() {
  const [links, setLinks]         = useState<VideoLink[]>([]);
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Filter state
  const [filterType, setFilterType] = useState("drama");
  const [filterId, setFilterId]     = useState("hatim");

  // Form state
  const [form, setForm] = useState({
    contentId:   "hatim",
    contentType: "drama",
    season:      "1",
    episode:     "1",
    serverName:  "Server 1",
    embedUrl:    "",
    quality:     "HD",
    lang:        "Urdu",
  });

  const fetchLinks = useCallback(async () => {
    if (!filterId) return;
    setLoading(true);
    const res = await fetch(`/api/admin/videos?contentId=${encodeURIComponent(filterId)}&contentType=${filterType}`);
    const data = await res.json();
    setLinks(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [filterId, filterType]);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.embedUrl.trim()) return;
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        season:  parseInt(form.season),
        episode: parseInt(form.episode),
      }),
    });
    if (res.ok) {
      setMsg({ type: "ok", text: "Video link added!" });
      setForm((f) => ({ ...f, embedUrl: "", serverName: "Server 1" }));
      fetchLinks();
    } else {
      setMsg({ type: "err", text: "Failed to save. Check all fields." });
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this video link?")) return;
    await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" });
    setLinks((l) => l.filter((v) => v.id !== id));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "80px 1rem 5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>🎬 Video Links Manager</h1>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              Add Google Drive, YouTube, Dailymotion or any embed URL for movies, dramas, and shows
            </p>
          </div>
          <Link href="/admin" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>← Admin</Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 28, alignItems: "start" }}>

          {/* ── ADD FORM ── */}
          <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 14, padding: 24, position: "sticky", top: 80 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 20 }}>➕ Add Video Link</h2>
            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Content type */}
              <div>
                <label style={labelStyle}>Content Type</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {CONTENT_TYPES.map((t) => (
                    <button key={t} type="button"
                      onClick={() => setForm((f) => ({ ...f, contentType: t }))}
                      style={{ flex: 1, padding: "7px 0", borderRadius: 6, border: form.contentType === t ? "1px solid rgba(229,9,20,0.4)" : "1px solid #2a2a2a", background: form.contentType === t ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.04)", color: form.contentType === t ? "#f87171" : "#9ca3af", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content ID */}
              <div>
                <label style={labelStyle}>
                  {form.contentType === "movie" ? "TMDB Movie ID" : form.contentType === "show" ? "TMDB Show ID" : "Drama Slug"}
                </label>
                {form.contentType === "drama" ? (
                  <>
                    <select value={form.contentId} onChange={(e) => setForm((f) => ({ ...f, contentId: e.target.value }))} style={inputStyle}>
                      {QUICK_DRAMAS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input style={{ ...inputStyle, marginTop: 6 }} placeholder="Or type slug manually..." value={form.contentId} onChange={(e) => setForm((f) => ({ ...f, contentId: e.target.value }))} />
                  </>
                ) : (
                  <input style={inputStyle} placeholder={form.contentType === "movie" ? "e.g. 569094" : "e.g. 1396"} value={form.contentId} onChange={(e) => setForm((f) => ({ ...f, contentId: e.target.value }))} />
                )}
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                  {form.contentType !== "drama" ? "Find the ID from the movie/show URL on TMDB.org" : "Use the slug from /dramas/[slug]"}
                </p>
              </div>

              {/* Episode (hide for movies) */}
              {form.contentType !== "movie" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {form.contentType === "show" && (
                    <div>
                      <label style={labelStyle}>Season</label>
                      <input type="number" min={1} style={inputStyle} value={form.season} onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))} />
                    </div>
                  )}
                  <div>
                    <label style={labelStyle}>Episode</label>
                    <input type="number" min={1} style={inputStyle} value={form.episode} onChange={(e) => setForm((f) => ({ ...f, episode: e.target.value }))} />
                  </div>
                </div>
              )}

              {/* Server name */}
              <div>
                <label style={labelStyle}>Server Name</label>
                <input style={inputStyle} placeholder="Server 1, Google Drive, Dailymotion..." value={form.serverName} onChange={(e) => setForm((f) => ({ ...f, serverName: e.target.value }))} />
              </div>

              {/* Embed URL — most important field */}
              <div>
                <label style={labelStyle}>Video / Embed URL ✱</label>
                <textarea
                  style={{ ...inputStyle, height: 72, resize: "vertical", fontFamily: "monospace", fontSize: 11 }}
                  placeholder={`Google Drive: https://drive.google.com/file/d/FILE_ID/view\nYouTube: https://youtu.be/VIDEO_ID\nDailymotion: https://www.dailymotion.com/embed/video/VIDEO_ID\nAny iframe src URL`}
                  value={form.embedUrl}
                  onChange={(e) => setForm((f) => ({ ...f, embedUrl: e.target.value }))}
                  required
                />
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                  Paste any video URL — Google Drive share links are auto-converted to embed format.
                </p>
              </div>

              {/* Quality + Lang */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Quality</label>
                  <select style={inputStyle} value={form.quality} onChange={(e) => setForm((f) => ({ ...f, quality: e.target.value }))}>
                    {QUALITIES.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Language</label>
                  <select style={inputStyle} value={form.lang} onChange={(e) => setForm((f) => ({ ...f, lang: e.target.value }))}>
                    {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {msg && (
                <div style={{ padding: "10px 14px", borderRadius: 8, background: msg.type === "ok" ? "rgba(16,185,129,0.1)" : "rgba(229,9,20,0.1)", border: `1px solid ${msg.type === "ok" ? "rgba(16,185,129,0.3)" : "rgba(229,9,20,0.3)"}`, color: msg.type === "ok" ? "#34d399" : "#f87171", fontSize: 13, fontWeight: 600 }}>
                  {msg.text}
                </div>
              )}

              <button type="submit" disabled={saving} style={{ padding: "11px 0", background: saving ? "#333" : "#e50914", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Saving..." : "Add Video Link"}
              </button>
            </form>
          </div>

          {/* ── LINKS TABLE ── */}
          <div>
            {/* Filter */}
            <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 12, padding: 16, marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>Filter:</span>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ ...inputStyle, width: "auto", padding: "6px 10px" }}>
                {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input placeholder="Content ID or drama slug..." value={filterId} onChange={(e) => setFilterId(e.target.value)} style={{ ...inputStyle, flex: 1, padding: "6px 10px" }} />
            </div>

            {loading ? (
              <div style={{ textAlign: "center", color: "#6b7280", padding: "3rem 0" }}>Loading…</div>
            ) : links.length === 0 ? (
              <div style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 12, padding: 32, textAlign: "center" }}>
                <p style={{ fontSize: 32, marginBottom: 12 }}>🎬</p>
                <p style={{ color: "#6b7280", fontSize: 14 }}>No video links yet for this content.</p>
                <p style={{ color: "#4b5563", fontSize: 12, marginTop: 6 }}>Add the first one using the form on the left.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((link) => (
                  <div key={link.id} style={{ background: "#141422", border: "1px solid #1e1e2e", borderRadius: 12, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(229,9,20,0.12)", border: "1px solid rgba(229,9,20,0.25)", color: "#f87171", borderRadius: 4, padding: "1px 6px" }}>{link.serverName}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.06)", border: "1px solid #2a2a2a", color: "#9ca3af", borderRadius: 4, padding: "1px 6px" }}>{link.quality}</span>
                          <span style={{ fontSize: 11, color: "#6b7280" }}>{link.lang}</span>
                          {link.contentType !== "movie" && <span style={{ fontSize: 11, color: "#6b7280" }}>Ep {link.episode}</span>}
                        </div>
                        <p style={{ fontSize: 11, color: "#4b5563", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {link.embedUrl}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <a
                          href={link.embedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ padding: "5px 12px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399", borderRadius: 6, fontSize: 11, fontWeight: 700, textDecoration: "none" }}
                        >
                          Test
                        </a>
                        <button onClick={() => handleDelete(link.id)} style={{ padding: "5px 12px", background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.25)", color: "#f87171", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0d0d1a",
  border: "1px solid #2a2a2a",
  borderRadius: 6,
  padding: "8px 10px",
  color: "#fff",
  fontSize: 13,
  outline: "none",
};
