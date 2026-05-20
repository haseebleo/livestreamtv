import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LiveStreamTV.pk — Live Cricket, Football Scores & Streaming Guide",
    template: "%s | LiveStreamTV.pk",
  },
  description:
    "Watch live cricket scores, football results, and find where to stream movies & TV shows online. Pakistan's #1 sports and entertainment hub.",
  keywords: [
    "live cricket",
    "football scores",
    "streaming guide",
    "where to watch",
    "live tv",
    "pakistan sports",
    "live matches",
  ],
  openGraph: {
    title: "LiveStreamTV.pk — Live Sports & Streaming Guide",
    description:
      "Live cricket scores, football results, and streaming guides for movies & TV shows.",
    type: "website",
    url: "https://livestreamtv.pk",
    siteName: "LiveStreamTV.pk",
  },
  twitter: {
    card: "summary_large_image",
    title: "LiveStreamTV.pk",
    description: "Live sports scores and streaming guide — Pakistan's #1 hub.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080810",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
