"use client";

import { useEffect } from "react";
import { saveContinueWatching } from "@/lib/local-storage";

interface WatchTrackerProps {
  id: string;
  title: string;
  posterUrl?: string | null;
  href: string;
  type: "movie" | "drama";
  episode?: number;
}

// Silently saves to "Continue Watching" after the user has been on the page for 4 seconds.
export function WatchTracker({ id, title, posterUrl, href, type, episode }: WatchTrackerProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      saveContinueWatching({
        id,
        title,
        posterUrl: posterUrl ?? null,
        href,
        type,
        episode,
        progress: 5,
      });
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, title, posterUrl, href, type, episode]);

  return null;
}
