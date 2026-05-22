import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LiveStreamTV.pk",
    short_name: "LiveStreamTV",
    description: "Pakistan's #1 Sports & Entertainment Hub — Live Cricket, Football & Streaming",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#e50914",
    orientation: "portrait-primary",
    categories: ["sports", "entertainment", "news"],
    icons: [
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    screenshots: [
      { src: "/screenshot-home.png", sizes: "1280x800", type: "image/png", label: "Home" },
    ],
    shortcuts: [
      { name: "Live Cricket", short_name: "Cricket", url: "/cricket", description: "Live cricket scores" },
      { name: "Football Scores", short_name: "Football", url: "/football", description: "Live football results" },
      { name: "Live TV", short_name: "Live TV", url: "/live-tv", description: "Watch live TV channels" },
      { name: "Movies", short_name: "Movies", url: "/movies", description: "Browse movies" },
    ],
  };
}
