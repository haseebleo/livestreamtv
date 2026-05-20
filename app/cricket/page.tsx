import { getMockCricketMatches } from "@/lib/api/sports";
import { MapPin, Trophy, Clock } from "lucide-react";

export const metadata = {
  title: "Live Cricket Scores & Schedules | LiveStreamTV.pk",
  description: "Live cricket scores, ball-by-ball commentary, and match schedules for Asia Cup, World Cup, Test Series and T20 leagues.",
};

const statusColors = {
  live: "bg-red-500/20 border-red-500/30 text-red-400",
  upcoming: "bg-blue-500/20 border-blue-500/30 text-blue-400",
  completed: "bg-gray-500/20 border-gray-500/30 text-gray-400",
};

const formatColors: Record<string, string> = {
  ODI: "text-green-400 bg-green-500/10 border-green-500/20",
  T20: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Test: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

export default function CricketPage() {
  const matches = getMockCricketMatches();
  const live = matches.filter((m) => m.status === "live");
  const upcoming = matches.filter((m) => m.status === "upcoming");
  const completed = matches.filter((m) => m.status === "completed");

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.15) 0%, transparent 70%)" }} />
        <div className="relative">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-5xl">🏏</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Live <span className="gradient-text-green">Cricket</span> Scores
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Ball-by-ball updates from every major cricket match worldwide
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* Ad slot */}
        <div className="ad-slot h-16 mb-8 rounded-xl">Advertisement</div>

        {/* Live Matches */}
        {live.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2.5 h-2.5 bg-red-400 rounded-full live-dot" />
              <h2 className="text-xl font-black text-white">Live Matches</h2>
            </div>
            <div className="space-y-4">
              {live.map((match) => (
                <div key={match.id} className="glass rounded-2xl p-6 border border-green-500/15 bg-cricket-gradient card-hover">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${statusColors.live}`}>
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full live-dot" />
                      LIVE
                    </div>
                    <div className={`px-2.5 py-1 rounded-full border text-xs font-bold ${formatColors[match.format] || "text-gray-400"}`}>
                      {match.format}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400 ml-auto">
                      <Trophy className="w-3.5 h-3.5" />
                      {match.tournament}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4 mb-4">
                    <div>
                      <p className="text-xl font-black text-white mb-1">{match.teams.home.name}</p>
                      <p className="text-2xl font-black text-green-400">{match.teams.home.score}</p>
                      <p className="text-xs text-gray-500">{match.teams.home.overs} overs</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-1">
                        <span className="text-sm font-black text-gray-400">VS</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-white mb-1">{match.teams.away.name}</p>
                      <p className="text-2xl font-black text-gray-300">{match.teams.away.score}</p>
                      <p className="text-xs text-gray-500">{match.teams.away.overs} overs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 pt-3 border-t border-white/5">
                    <MapPin className="w-3 h-3" />
                    {match.venue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-black text-white mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Upcoming Matches
            </h2>
            <div className="space-y-3">
              {upcoming.map((match) => (
                <div key={match.id} className="glass rounded-xl p-5 border border-blue-500/15 card-hover">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-bold text-white">{match.teams.home.name} <span className="text-gray-500">vs</span> {match.teams.away.name}</p>
                        <p className="text-sm text-gray-400">{match.tournament} · {match.format}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-400">{match.startTime}</p>
                      <p className="text-xs text-gray-500">{match.venue}</p>
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
            <h2 className="text-xl font-black text-white mb-5">Recent Results</h2>
            <div className="space-y-3">
              {completed.map((match) => (
                <div key={match.id} className="glass rounded-xl p-5 opacity-80 card-hover">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">{match.teams.home.name} vs {match.teams.away.name}</p>
                      <p className="text-sm text-gray-400">{match.tournament} · {match.format}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-300">{match.teams.home.score} / {match.teams.away.score}</p>
                      <p className="text-xs text-green-400">{match.result}</p>
                    </div>
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
