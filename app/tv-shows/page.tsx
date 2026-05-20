import { getMockShows } from "@/lib/api/sports";
import { Star, ExternalLink } from "lucide-react";

export const metadata = {
  title: "TV Shows Streaming Guide | LiveStreamTV.pk",
  description: "Find the best TV shows streaming on Netflix, HBO Max, Disney+, and Amazon Prime. Updated weekly.",
};

const streamingColors: Record<string, string> = {
  Netflix: "bg-red-600",
  "Disney+": "bg-blue-600",
  "Amazon Prime": "bg-amber-600",
  "HBO Max": "bg-purple-700",
  BBC: "bg-gray-600",
};

const posterGradients = [
  "from-indigo-900 to-purple-900",
  "from-red-900 to-rose-900",
  "from-teal-900 to-green-900",
  "from-orange-900 to-amber-900",
  "from-blue-900 to-cyan-900",
  "from-pink-900 to-fuchsia-900",
];

const genres = ["All", "Drama", "Sci-Fi", "Action", "Comedy", "Crime", "Fantasy", "Horror"];

export default function TvShowsPage() {
  const shows = getMockShows();

  return (
    <div className="min-h-screen pt-20">
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(14,165,233,0.12) 0%, transparent 70%)" }} />
        <div className="relative">
          <span className="text-5xl block mb-4">📺</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Best <span className="gradient-text">TV Shows</span> to Stream
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Top-rated shows across Netflix, HBO Max, Disney+, Amazon Prime and more
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Genre filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {genres.map((g) => (
            <button
              key={g}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                g === "All"
                  ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-400"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Ad slot */}
        <div className="ad-slot h-16 mb-8 rounded-xl">Advertisement</div>

        {/* Shows grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {shows.map((show, i) => (
            <div key={show.id} className="glass rounded-2xl overflow-hidden card-hover border border-transparent hover:border-blue-500/20 group">
              <div className={`h-32 bg-gradient-to-br ${posterGradients[i % posterGradients.length]} flex items-center justify-center relative`}>
                <span className="text-5xl">📺</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-white">{show.vote_average}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-1 truncate">{show.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{show.genre} · {new Date(show.first_air_date).getFullYear()}</p>
                <div className="flex flex-wrap gap-1.5">
                  {show.streaming.map((s) => (
                    <span key={s} className={`text-xs font-bold px-2 py-0.5 rounded ${streamingColors[s] || "bg-gray-700"} text-white flex items-center gap-1`}>
                      {s}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ad slot */}
        <div className="ad-slot h-16 rounded-xl">Advertisement</div>
      </div>
    </div>
  );
}
