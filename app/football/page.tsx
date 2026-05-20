import { getMockFootballMatches } from "@/lib/api/sports";

export const metadata = {
  title: "Live Football Scores & Results | LiveStreamTV.pk",
  description: "Live football scores from Premier League, La Liga, Champions League, Bundesliga and more.",
};

const leagues = [
  { name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", id: "4328" },
  { name: "La Liga", flag: "🇪🇸", id: "4335" },
  { name: "Bundesliga", flag: "🇩🇪", id: "4331" },
  { name: "Serie A", flag: "🇮🇹", id: "4332" },
  { name: "Ligue 1", flag: "🇫🇷", id: "4334" },
  { name: "Champions League", flag: "🏆", id: "4346" },
];

export default function FootballPage() {
  const matches = getMockFootballMatches();
  const live = matches.filter((m) => m.status === "live");
  const upcoming = matches.filter((m) => m.status === "upcoming");
  const completed = matches.filter((m) => m.status === "completed");

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)" }} />
        <div className="relative">
          <span className="text-5xl block mb-4">⚽</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Live <span className="gradient-text-amber">Football</span> Scores
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Real-time scores from Premier League, La Liga, Champions League and 100+ competitions
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* League filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-semibold">
            All Leagues
          </button>
          {leagues.map((l) => (
            <button key={l.id} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-400 transition-all">
              {l.flag} {l.name}
            </button>
          ))}
        </div>

        {/* Ad slot */}
        <div className="ad-slot h-16 mb-8 rounded-xl">Advertisement</div>

        {/* Live */}
        {live.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2.5 h-2.5 bg-red-400 rounded-full live-dot" />
              <h2 className="text-xl font-black text-white">Live Matches</h2>
            </div>
            <div className="space-y-3">
              {live.map((match) => (
                <div key={match.id} className="glass rounded-2xl p-5 border border-amber-500/15 bg-football-gradient card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-amber-400">{match.leagueLogo} {match.league}</span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-green-400">{match.minute}&apos;</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <div className="text-left">
                      <p className="text-base font-bold text-white">{match.homeTeam}</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/10 border border-white/10">
                        <span className="text-2xl font-black text-white">{match.homeScore}</span>
                        <span className="text-gray-500 font-bold">—</span>
                        <span className="text-2xl font-black text-white">{match.awayScore}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-white">{match.awayTeam}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-black text-white mb-5">📅 Upcoming Fixtures</h2>
            <div className="space-y-3">
              {upcoming.map((match) => (
                <div key={match.id} className="glass rounded-xl p-5 card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{match.homeTeam} vs {match.awayTeam}</p>
                      <p className="text-sm text-gray-400">{match.leagueLogo} {match.league}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-400">Today {match.kickoff}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ad slot */}
        <div className="ad-slot h-16 mb-10 rounded-xl">Advertisement</div>

        {/* Completed */}
        {completed.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-white mb-5">✅ Full Time Results</h2>
            <div className="space-y-3">
              {completed.map((match) => (
                <div key={match.id} className="glass rounded-xl p-5 opacity-75 card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{match.homeTeam} vs {match.awayTeam}</p>
                      <p className="text-sm text-gray-400">{match.leagueLogo} {match.league}</p>
                    </div>
                    <p className="text-lg font-black text-gray-300">{match.homeScore} — {match.awayScore}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
