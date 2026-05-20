import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "LiveStreamTV.pk — Live Cricket, Football Scores & Streaming Guide",
  description: "Watch live cricket scores, football results, and find where to stream movies & TV shows online. Pakistan's #1 sports and entertainment hub.",
  keywords: "live cricket, football scores, streaming guide, where to watch, live tv, pakistan sports",
  openGraph: {
    title: "LiveStreamTV.pk",
    description: "Live sports scores and streaming guide for movies & TV shows",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050511] text-white antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
