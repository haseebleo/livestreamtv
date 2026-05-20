interface CricketMatch {
  id: string;
  teams: {
    home: { name: string; score: string; overs: string };
    away: { name: string; score: string; overs: string };
  };
  status: "live" | "upcoming" | "completed";
  tournament: string;
  format: string;
  result?: string;
  startTime?: string;
}

interface FootballMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: "live" | "upcoming" | "completed";
  minute?: string;
  league: string;
  leagueLogo?: string;
  kickoff?: string;
}

const countryFlags: Record<string, string> = {
  Pakistan: "🇵🇰",
  India: "🇮🇳",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  Australia: "🇦🇺",
  "South Africa": "🇿🇦",
  "New Zealand": "🇳🇿",
  "West Indies": "🏝️",
  "Sri Lanka": "🇱🇰",
};

export function CricketScoreCard({ match }: { match: CricketMatch }) {
  const isLive = match.status === "live";
  const isUpcoming = match.status === "upcoming";

  return (
    <div
      style={{
        background: "#1c1c1c",
        border: "1px solid #2a2a2a",
        borderRadius: 12,
        padding: 16,
        transition: "border-color 0.2s",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: "#b3b3b3", fontWeight: 600 }}>
          🏆 {match.tournament}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {isLive && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(229,9,20,0.15)",
                border: "1px solid rgba(229,9,20,0.3)",
                color: "#f87171",
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              <span className="live-dot" style={{ width: 6, height: 6, background: "#e50914", borderRadius: "50%", display: "inline-block" }} />
              LIVE
            </span>
          )}
          <span
            style={{
              background: "rgba(0,112,243,0.12)",
              border: "1px solid rgba(0,112,243,0.25)",
              color: "#60a5fa",
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            {match.format}
          </span>
        </div>
      </div>

      {/* Scoreline */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {/* Home */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", marginBottom: 2 }}>
            {countryFlags[match.teams.home.name] ?? ""} {match.teams.home.name}
          </p>
          {!isUpcoming && (
            <>
              <p style={{ fontSize: 20, fontWeight: 900, color: "#00b341" }}>{match.teams.home.score}</p>
              <p style={{ fontSize: 11, color: "#6b7280" }}>{match.teams.home.overs} ov</p>
            </>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: "#6b7280" }}>VS</span>
        </div>

        {/* Away */}
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", marginBottom: 2 }}>
            {match.teams.away.name} {countryFlags[match.teams.away.name] ?? ""}
          </p>
          {!isUpcoming && (
            <>
              <p style={{ fontSize: 20, fontWeight: 900, color: "#b3b3b3" }}>{match.teams.away.score}</p>
              <p style={{ fontSize: 11, color: "#6b7280" }}>{match.teams.away.overs} ov</p>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      {match.result && (
        <p style={{ fontSize: 11, color: "#00b341", fontWeight: 600, borderTop: "1px solid #2a2a2a", paddingTop: 8 }}>
          ✓ {match.result}
        </p>
      )}
      {isUpcoming && match.startTime && (
        <p style={{ fontSize: 11, color: "#f5c518", borderTop: "1px solid #2a2a2a", paddingTop: 8 }}>
          🕐 {match.startTime}
        </p>
      )}
    </div>
  );
}

export function FootballScoreCard({ match }: { match: FootballMatch }) {
  const isLive = match.status === "live";
  const isUpcoming = match.status === "upcoming";

  return (
    <div
      style={{
        background: "#1c1c1c",
        border: "1px solid #2a2a2a",
        borderRadius: 12,
        padding: 16,
      }}
    >
      {/* League + status */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#f5c518" }}>
          {match.leagueLogo ?? ""} {match.league}
        </span>
        {isLive && match.minute && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(0,179,65,0.12)",
              border: "1px solid rgba(0,179,65,0.3)",
              color: "#34d399",
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            <span className="live-dot" style={{ width: 6, height: 6, background: "#00b341", borderRadius: "50%", display: "inline-block" }} />
            {match.minute}&apos;
          </span>
        )}
        {isUpcoming && match.kickoff && (
          <span style={{ fontSize: 11, color: "#f5c518" }}>🕐 {match.kickoff}</span>
        )}
        {match.status === "completed" && (
          <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>FT</span>
        )}
      </div>

      {/* Score */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>{match.homeTeam}</p>

        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: 8,
            padding: "6px 12px",
            textAlign: "center",
            minWidth: 72,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 900, color: "#ffffff" }}>
            {isUpcoming ? "–" : `${match.homeScore} – ${match.awayScore}`}
          </span>
        </div>

        <p style={{ fontSize: 14, fontWeight: 700, color: "#ffffff", textAlign: "right" }}>{match.awayTeam}</p>
      </div>
    </div>
  );
}
