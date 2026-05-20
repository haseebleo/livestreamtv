import Hero from "@/components/home/hero";
import LiveMatches from "@/components/home/live-matches";
import TrendingContent from "@/components/home/trending-content";
import FeaturesBanner from "@/components/home/features-banner";

export default function Home() {
  return (
    <>
      <Hero />
      <LiveMatches />
      <FeaturesBanner />
      <TrendingContent />
    </>
  );
}
