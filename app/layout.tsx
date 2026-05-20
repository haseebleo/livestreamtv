import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const GA_ID = "G-PLR2SYR3WE";
const ADSENSE_ID = "ca-pub-6060748329413564";

export const metadata: Metadata = {
  title: {
    default: "LiveStreamTV.pk — Live Cricket, Football Scores & Streaming Guide",
    template: "%s | LiveStreamTV.pk",
  },
  description:
    "Watch live cricket scores, football results, and find where to stream movies & TV shows online. Pakistan's #1 sports and entertainment hub.",
  keywords: [
    "live cricket", "football scores", "streaming guide",
    "where to watch", "live tv", "pakistan sports", "live matches",
  ],
  openGraph: {
    title: "LiveStreamTV.pk — Live Sports & Streaming Guide",
    description: "Live cricket scores, football results, and streaming guides for movies & TV shows.",
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
  other: {
    "google-adsense-account": ADSENSE_ID,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080810",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* AdSense Auto Ads — Google places ads automatically site-wide */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        {/* Google Analytics — loads after page is interactive, no Vitals impact */}
        <GoogleAnalytics gaId={GA_ID} />
      </body>
    </html>
  );
}
