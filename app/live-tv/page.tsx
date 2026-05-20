export const metadata = {
  title: "Free Live TV Channels Online | LiveStreamTV.pk",
  description: "Watch 100+ free live TV channels online from Pakistan, UK, US, India and worldwide.",
};

const channels = [
  { name: "Geo News", country: "🇵🇰", category: "News", status: "live" },
  { name: "ARY News", country: "🇵🇰", category: "News", status: "live" },
  { name: "PTV Sports", country: "🇵🇰", category: "Sports", status: "live" },
  { name: "A Sports", country: "🇵🇰", category: "Sports", status: "live" },
  { name: "BBC World", country: "🇬🇧", category: "News", status: "live" },
  { name: "CNN International", country: "🇺🇸", category: "News", status: "live" },
  { name: "Al Jazeera", country: "🇶🇦", category: "News", status: "live" },
  { name: "Aaj Entertainment", country: "🇵🇰", category: "Entertainment", status: "live" },
  { name: "Hum TV", country: "🇵🇰", category: "Entertainment", status: "live" },
  { name: "Star Sports 1", country: "🇮🇳", category: "Sports", status: "live" },
  { name: "Sky Sports", country: "🇬🇧", category: "Sports", status: "live" },
  { name: "beIN Sports", country: "🇶🇦", category: "Sports", status: "live" },
  { name: "ESPN", country: "🇺🇸", category: "Sports", status: "live" },
  { name: "Discovery Channel", country: "🌍", category: "Documentary", status: "live" },
  { name: "National Geographic", country: "🌍", category: "Documentary", status: "live" },
  { name: "Cartoon Network", country: "🌍", category: "Kids", status: "live" },
];

const categories = ["All", "Sports", "News", "Entertainment", "Documentary", "Kids"];

const categoryColors: Record<string, string> = {
  Sports: "text-green-400 bg-green-500/10 border-green-500/20",
  News: "text-red-400 bg-red-500/10 border-red-500/20",
  Entertainment: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Documentary: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Kids: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

export default function LiveTvPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(239,68,68,0.12) 0%, transparent 70%)" }} />
        <div className="relative">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-5xl">📡</span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">
              <span className="w-2 h-2 bg-red-400 rounded-full live-dot" />
              LIVE
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Free <span className="gradient-text">Live TV</span> Channels
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            100+ free live TV channels — Sports, News, Entertainment, Documentary and more
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                c === "All"
                  ? "bg-red-500/20 border-red-500/30 text-red-400"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Ad slot */}
        <div className="ad-slot h-16 mb-8 rounded-xl">Advertisement</div>

        {/* Channels grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {channels.map((ch, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-5 card-hover cursor-pointer border border-transparent hover:border-red-500/20 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/40 to-blue-600/40 flex items-center justify-center text-xl border border-purple-500/20">
                  📺
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full live-dot" />
                  <span className="text-[10px] font-bold text-red-400">LIVE</span>
                </div>
              </div>
              <h3 className="font-bold text-white text-sm mb-1 truncate">{ch.name}</h3>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryColors[ch.category] || "text-gray-400"}`}>
                  {ch.category}
                </span>
                <span className="text-sm">{ch.country}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5">
                <button className="w-full py-1.5 rounded-lg bg-gradient-to-r from-red-600/80 to-orange-600/80 text-white text-xs font-bold hover:opacity-90 transition-opacity group-hover:from-red-600 group-hover:to-orange-600">
                  ▶ Watch Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Ad slot */}
        <div className="ad-slot h-20 mt-8 rounded-xl">Advertisement</div>
      </div>
    </div>
  );
}
