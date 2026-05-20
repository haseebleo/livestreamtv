const features = [
  {
    icon: "🏏",
    title: "Live Cricket Scores",
    description: "Ball-by-ball updates, live scorecard, and match commentary from every major tournament worldwide.",
    color: "from-green-500/20 to-emerald-500/5",
    border: "border-green-500/20 hover:border-green-500/40",
    accent: "text-green-400",
  },
  {
    icon: "⚽",
    title: "Football Live Scores",
    description: "Real-time scores from Premier League, La Liga, Champions League, and 100+ other competitions.",
    color: "from-amber-500/20 to-yellow-500/5",
    border: "border-amber-500/20 hover:border-amber-500/40",
    accent: "text-amber-400",
  },
  {
    icon: "🎬",
    title: "Where to Watch Guide",
    description: "Find any movie or show and instantly see which streaming platform has it in your country.",
    color: "from-pink-500/20 to-rose-500/5",
    border: "border-pink-500/20 hover:border-pink-500/40",
    accent: "text-pink-400",
  },
  {
    icon: "📡",
    title: "100+ Live TV Channels",
    description: "Stream free live TV from around the world — sports, news, entertainment, and more.",
    color: "from-blue-500/20 to-sky-500/5",
    border: "border-blue-500/20 hover:border-blue-500/40",
    accent: "text-blue-400",
  },
];

export default function FeaturesBanner() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-white mb-3">Everything in One Place</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          From live match scores to streaming guides — LiveStreamTV.pk is your one-stop entertainment hub.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${f.color} border ${f.border} rounded-2xl p-6 card-hover transition-all`}
          >
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className={`text-base font-bold mb-2 ${f.accent}`}>{f.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
