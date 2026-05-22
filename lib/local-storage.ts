// Shared localStorage helpers — safe (try/catch), browser-only

export interface ContinueItem {
  id: string;
  title: string;
  posterUrl: string | null;
  href: string;
  type: "movie" | "drama";
  episode?: number;
  progress: number; // 0-100
  lastWatched: string; // ISO date
}

export interface WatchlistItem {
  id: string;
  title: string;
  posterUrl: string | null;
  href: string;
  type: string;
  addedAt: string;
}

const CW_KEY  = "lstv_continue_watching";
const WL_KEY  = "lstv_watchlist";

// ── CONTINUE WATCHING ─────────────────────────────────────────────────────────

export function getContinueWatching(): ContinueItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CW_KEY) ?? "[]"); } catch { return []; }
}

export function saveContinueWatching(item: Omit<ContinueItem, "lastWatched">) {
  if (typeof window === "undefined") return;
  try {
    const list = getContinueWatching().filter((i) => i.id !== item.id);
    const updated = [{ ...item, lastWatched: new Date().toISOString() }, ...list].slice(0, 24);
    localStorage.setItem(CW_KEY, JSON.stringify(updated));
  } catch {}
}

export function removeContinueItem(id: string) {
  if (typeof window === "undefined") return;
  try {
    const updated = getContinueWatching().filter((i) => i.id !== id);
    localStorage.setItem(CW_KEY, JSON.stringify(updated));
  } catch {}
}

export function clearContinueWatching() {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(CW_KEY); } catch {}
}

// ── WATCHLIST ─────────────────────────────────────────────────────────────────

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(WL_KEY) ?? "[]"); } catch { return []; }
}

export function isInWatchlist(id: string): boolean {
  return getWatchlist().some((i) => i.id === id);
}

export function addToWatchlist(item: Omit<WatchlistItem, "addedAt">) {
  if (typeof window === "undefined") return;
  try {
    const list = getWatchlist();
    if (list.some((i) => i.id === item.id)) return;
    localStorage.setItem(WL_KEY, JSON.stringify([...list, { ...item, addedAt: new Date().toISOString() }]));
  } catch {}
}

export function removeFromWatchlist(id: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WL_KEY, JSON.stringify(getWatchlist().filter((i) => i.id !== id)));
  } catch {}
}
