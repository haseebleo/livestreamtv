"use client";

import Link from "next/link";
import { getMockCricketMatches, getMockFootballMatches } from "@/lib/api/sports";
import { Clock, MapPin } from "lucide-react";

export default function LiveMatches() {
  const cricket = getMockCricketMatches().filter((m) => m.status === "live");
  const football = getMockFootballMatches().filter((m) => m.status === "live");

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30">
            <span className="w-2 h-2 bg-red-400 rounded-full live-dot" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Live Now</span>
          </div>
          <h2 className="text-2xl font-black text-white">Ongoing Matches</h2>
        </div>
        <Link href="/cricket" className="text-sm text-purple-400 hover:text-purple-300 font-medium">
          View all →
        </Link>
      </div>

      {/* Ad slot */}
      <div className="ad-slot h-16 mb-8 rounded-xl">
        Advertisement — Google AdSense
      </div>

      {/* Cricket Live */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🏏</span>
          <h3 className="text-lg font-bold gradient-text-green">Cricket</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cricket.map((match) => (
            <Link key={match.id} href="/cricket">
              <div className="glass rounded-2xl p-5 card-hover cursor-pointer border border-transparent hover:border-green-500/30 bg-cricket-gradient">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-green-400 uppercase tracking-wider">{match.tournament}</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full live-dot" />
                    <span className="text-xs font-bold text-red-400">LIVE</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-lg">{match.teams.home.name}</span>
                    <span className="font-black text-green-400 text-xl">{match.teams.home.score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-lg">{match.teams.away.name}</span>
                    <span className="font-black text-gray-300 text-xl">{match.teams.away.score}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />
                    {match.venue}
                  </div>
                  <span className="text-xs font-medium text-purple-400 ml-auto">{match.format}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Football Live */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⚽</span>
          <h3 className="text-lg font-bold gradient-text-amber">Football</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {football.map((match) => (
            <Link key={match.id} href="/football">
              <div className="glass rounded-2xl p-5 card-hover cursor-pointer border border-transparent hover:border-amber-500/30 bg-football-gradient">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-amber-400">{match.leagueLogo} {match.league}</span>
                  <span className="text-xs font-bold text-green-400">{match.minute}&apos;</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white text-sm flex-1">{match.homeTeam}</span>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/10 font-black text-white text-lg">
                    {match.homeScore} <span className="text-gray-500 mx-1">-</span> {match.awayScore}
                  </div>
                  <span className="font-bold text-white text-sm flex-1 text-right">{match.awayTeam}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
