import { useState, useEffect } from "react";
import standingsData from "./data/standings.json";
import resultsData from "./data/results.json";

const FIELDS = {
  "sw_clt_stem": {
    name: "SW CLT STEM Academy",
    field: "SCS 01",
    address: "5203 Shopton Rd, Charlotte, NC 28278",
    lat: 35.1266,
    lng: -80.9713,
  },
  "chestnut_square": {
    name: "Chestnut Square Park",
    field: "Chestnut Park 1",
    address: "320 Chestnut Pkwy, Indian Trail, NC 28079",
    lat: 35.0823,
    lng: -80.6671,
  },
  "mountain_island": {
    name: "Mountain Island Charter",
    field: "MIC Multisport",
    address: "13440 Lucia Riverbend Hwy, Mt Holly, NC 28120",
    lat: 35.3548,
    lng: -81.0032,
  },
  "eastway": {
    name: "Eastway Regional Rec Center",
    field: "ERRC 1",
    address: "3150 Eastway Park Dr, Charlotte, NC 28213",
    lat: 35.2123,
    lng: -80.7817,
  },
  "phillip_o_berry": {
    name: "Phillip O. Berry Academy",
    field: "Phillip O. Berry Stadium",
    address: "1430 Alleghany St, Charlotte, NC 28208",
    lat: 35.2153,
    lng: -80.8897,
  },
};

const SCHEDULE = [
  {
    date: "2025-02-22",
    time: "10:30 AM",
    fieldKey: "sw_clt_stem",
    opponent: "Charlotte Eclipse",
    homeAway: "away",
    type: "Regular Season",
    link: "https://app.teampass.com/Metrolina_Adult_Soccer_League/Event/263472_A5ED14F6374F67C6C949D89FBE599AFC",
  },
  {
    date: "2025-03-08",
    time: "12:30 PM",
    fieldKey: "chestnut_square",
    opponent: "TBD Soccer Club",
    homeAway: "away",
    type: "Regular Season",
    link: "https://app.teampass.com/Metrolina_Adult_Soccer_League/Event/263495_D5F57F583AA726D287860BC10939101B",
  },
  {
    date: "2025-03-15",
    time: "2:30 PM",
    fieldKey: "mountain_island",
    opponent: "Charlotte Celtic Legends",
    homeAway: "away",
    type: "Regular Season",
    link: "https://app.teampass.com/Metrolina_Adult_Soccer_League/Event/263520_73884752586B53BBFA3715046598C85A",
  },
  {
    date: "2025-03-22",
    time: "10:30 AM",
    fieldKey: "mountain_island",
    opponent: "QCU Sauce",
    homeAway: "home",
    type: "Regular Season",
    link: "https://app.teampass.com/Metrolina_Adult_Soccer_League/Event/263543_5CD8C1FD110BD77A0601AF56E40FC505",
  },
  {
    date: "2025-03-29",
    time: "4:30 PM",
    fieldKey: "eastway",
    opponent: "Day Ones FC",
    homeAway: "home",
    type: "Regular Season",
    link: "https://app.teampass.com/Metrolina_Adult_Soccer_League/Event/263568_0D3A24881F60457B3591C2EA65DB1DC6",
  },
  {
    date: "2025-04-12",
    time: "4:30 PM",
    fieldKey: "sw_clt_stem",
    opponent: "Charlotte Eclipse",
    homeAway: "home",
    type: "Regular Season",
    link: "https://app.teampass.com/Metrolina_Adult_Soccer_League/Event/263592_33EC8D4D17C7E4819BBFC7FB52008C8A",
  },
  {
    date: "2025-04-19",
    time: "12:30 PM",
    fieldKey: "mountain_island",
    opponent: "TBD Soccer Club",
    homeAway: "home",
    type: "Regular Season",
    link: "https://app.teampass.com/Metrolina_Adult_Soccer_League/Event/263615_84D1D590D209658A9BAFF97860B1F64B",
  },
  {
    date: "2025-04-26",
    time: "10:30 AM",
    fieldKey: "mountain_island",
    opponent: "Charlotte Celtic Legends",
    homeAway: "home",
    type: "Regular Season",
    link: "https://app.teampass.com/Metrolina_Adult_Soccer_League/Event/263640_FD8264020035AA423F983343A637CB76",
  },
  {
    date: "2025-05-03",
    time: "12:30 PM",
    fieldKey: "sw_clt_stem",
    opponent: "QCU Sauce",
    homeAway: "away",
    type: "Regular Season",
    link: "https://app.teampass.com/Metrolina_Adult_Soccer_League/Event/263663_F5F521F7AF38438B16B2A44FD1ADC87E",
  },
  {
    date: "2025-05-17",
    time: "2:30 PM",
    fieldKey: "phillip_o_berry",
    opponent: "Day Ones FC",
    homeAway: "away",
    type: "Regular Season",
    link: "https://app.teampass.com/Metrolina_Adult_Soccer_League/Event/263688_899CD3A9693403024FC6D1EB49CB31DB",
  },
];

function getStandingsRecord(teamName) {
  return standingsData.teams.find((s) => s.team === teamName);
}

function getSortedStandings() {
  return [...standingsData.teams].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
}

// Get all match results involving a specific team
function getTeamResults(teamName) {
  return resultsData.matches.filter(
    (m) => m.home === teamName || m.away === teamName
  );
}

function getGoogleMapsUrl(field) {
  return `https://www.google.com/maps/search/?api=1&query=${field.lat},${field.lng}`;
}

function getGoogleMapsDirectionsUrl(field) {
  return `https://www.google.com/maps/dir/?api=1&destination=${field.lat},${field.lng}`;
}

function formatDate(dateStr) {
  // Split and construct manually to avoid timezone parsing issues
  const [y, m, day] = dateStr.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return {
    dayName: days[d.getDay()],
    month: months[d.getMonth()],
    day: d.getDate(),
    full: `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`,
  };
}

function isUpcoming(dateStr) {
  const [y, m, day] = dateStr.split("-").map(Number);
  const gameDate = new Date(y, m - 1, day, 23, 59, 59);
  return gameDate >= new Date();
}

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const NavigationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const FieldsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <circle cx="12" cy="12" r="3" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </svg>
);

export default function LeoUnitedApp() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [expandedGame, setExpandedGame] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const nextGame = SCHEDULE.find((g) => isUpcoming(g.date));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d1526",
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#e8eaf0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient background */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 20% 0%, rgba(37, 99, 235, 0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(234, 179, 8, 0.06) 0%, transparent 50%)",
      }} />

      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, rgba(37,99,235,0.15) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(37,99,235,0.2)",
        padding: "24px 20px 16px",
        position: "relative",
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "#fff",
              boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
              letterSpacing: -1,
            }}>
              LU
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: "#fff" }}>
                Leo United
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>
                Coed Fifth Division · Spring 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Game Banner */}
      {nextGame && activeTab === "schedule" && (
        <div style={{
          maxWidth: 600, margin: "16px auto 0", padding: "0 16px",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.6s 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(37,99,235,0.25), rgba(234,179,8,0.12))",
            border: "1px solid rgba(37,99,235,0.4)",
            borderRadius: 16, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#eab308",
              boxShadow: "0 0 8px rgba(234,179,8,0.6)",
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#eab308", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
                Next Match
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                {nextGame.homeAway === "home" ? "vs" : "@"} {nextGame.opponent}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>
                {formatDate(nextGame.date).full} · {nextGame.time}
              </div>
            </div>
            <a
              href={getGoogleMapsDirectionsUrl(FIELDS[nextGame.fieldKey])}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#2563eb", color: "#fff",
                padding: "8px 14px", borderRadius: 10,
                fontSize: 12, fontWeight: 600,
                textDecoration: "none",
                flexShrink: 0,
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.04)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <NavigationIcon /> Directions
            </a>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{
        maxWidth: 600, margin: "16px auto 0", padding: "0 16px",
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.6s 0.2s",
      }}>
        <div style={{
          display: "flex", gap: 4,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 12, padding: 4,
        }}>
          {[
            { key: "schedule", label: "Schedule", icon: <CalendarIcon /> },
            { key: "standings", label: "Standings", icon: <TrophyIcon /> },
            { key: "fields", label: "Fields", icon: <FieldsIcon /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "10px 0",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 13, fontWeight: 600,
                color: activeTab === tab.key ? "#fff" : "rgba(255,255,255,0.4)",
                background: activeTab === tab.key ? "rgba(37,99,235,0.25)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "12px 16px 100px" }}>
        {activeTab === "schedule" && (
          <div>
            {SCHEDULE.map((game, i) => {
              const field = FIELDS[game.fieldKey];
              const dateInfo = formatDate(game.date);
              const upcoming = isUpcoming(game.date);
              const isExpanded = expandedGame === i;

              return (
                <div
                  key={i}
                  onClick={() => setExpandedGame(isExpanded ? null : i)}
                  style={{
                    background: upcoming ? "#ffffff" : "#e8eaf0",
                    border: `1px solid ${upcoming ? "#e0e4eb" : "#d0d4db"}`,
                    borderRadius: 14,
                    marginTop: 8,
                    overflow: "hidden",
                    cursor: "pointer",
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateY(0)" : "translateY(15px)",
                    transition: `all 0.5s ${0.05 * i + 0.3}s cubic-bezier(0.16, 1, 0.3, 1)`,
                  }}
                >
                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Date block */}
                    <div style={{
                      width: 48, height: 52, borderRadius: 10,
                      background: upcoming ? "#2563eb" : "#94a3b8",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                        color: "#fff",
                        letterSpacing: 0.5,
                      }}>{dateInfo.month}</span>
                      <span style={{
                        fontSize: 20, fontWeight: 800,
                        color: "#fff",
                        lineHeight: 1.1,
                      }}>{dateInfo.day}</span>
                    </div>

                    {/* Match info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700,
                          padding: "2px 6px", borderRadius: 4,
                          background: game.homeAway === "home" ? "#eab308" : "#2563eb",
                          color: "#fff",
                          textTransform: "uppercase", letterSpacing: 0.5,
                        }}>
                          {game.homeAway === "home" ? "HOME" : "AWAY"}
                        </span>
                        <span style={{ fontSize: 12, color: upcoming ? "#64748b" : "#94a3b8" }}>
                          {dateInfo.dayName} · {game.time}
                        </span>
                      </div>
                      <div style={{
                        fontSize: 15, fontWeight: 600, color: upcoming ? "#1e293b" : "#64748b",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {game.homeAway === "home" ? "vs" : "@"} {game.opponent}
                      </div>
                      <div style={{
                        fontSize: 12, color: upcoming ? "#64748b" : "#94a3b8",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        marginTop: 2,
                      }}>
                        {field.name} — {field.field}
                      </div>
                      {(() => {
                        const rec = getStandingsRecord(game.opponent);
                        return rec ? (
                          <div style={{
                            fontSize: 11, color: upcoming ? "#94a3b8" : "#b0b8c4",
                            marginTop: 3,
                          }}>
                            Record: {rec.w}W - {rec.d}D - {rec.l}L ({rec.pts} pts)
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Expand arrow */}
                    <div style={{
                      fontSize: 18, color: "#94a3b8",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      flexShrink: 0,
                    }}>▾</div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div style={{
                      padding: "0 16px 14px",
                      borderTop: "1px solid #e0e4eb",
                      paddingTop: 12,
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10, color: "#475569" }}>
                        <MapPinIcon />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{field.name}</div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>{field.address}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <a
                          href={getGoogleMapsDirectionsUrl(field)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            background: "#2563eb", color: "#fff",
                            padding: "8px 14px", borderRadius: 8,
                            fontSize: 12, fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          <NavigationIcon /> Get Directions
                        </a>
<a
                          href={game.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            background: "#eab308", color: "#fff",
                            padding: "8px 14px", borderRadius: 8,
                            fontSize: 12, fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          <ExternalLinkIcon /> Match Details
                        </a>
                      </div>

                      {/* Opponent Season Results */}
                      {(() => {
                        const opponentResults = getTeamResults(game.opponent);
                        return (
                          <div style={{
                            marginTop: 12,
                            paddingTop: 10,
                            borderTop: "1px solid #e0e4eb",
                          }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                              {game.opponent} — Season Results
                            </div>
                            {opponentResults.length === 0 ? (
                              <div style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>
                                No results yet
                              </div>
                            ) : (
                              opponentResults.map((m, mi) => {
                                const isHome = m.home === game.opponent;
                                const teamScore = isHome ? m.homeScore : m.awayScore;
                                const oppScore = isHome ? m.awayScore : m.homeScore;
                                const otherTeam = isHome ? m.away : m.home;
                                const result = teamScore > oppScore ? "W" : teamScore < oppScore ? "L" : "D";
                                const resultColor = result === "W" ? "#16a34a" : result === "L" ? "#dc2626" : "#94a3b8";
                                const dateInfo = formatDate(m.date);
                                return (
                                  <div key={mi} style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "4px 0",
                                    borderTop: mi > 0 ? "1px solid #f1f5f9" : "none",
                                    fontSize: 12,
                                  }}>
                                    <span style={{
                                      fontWeight: 700, color: resultColor,
                                      width: 16, textAlign: "center", flexShrink: 0,
                                    }}>{result}</span>
                                    <span style={{ color: "#1e293b", fontWeight: 600 }}>
                                      {teamScore} - {oppScore}
                                    </span>
                                    <span style={{ color: "#64748b" }}>
                                      {isHome ? "vs" : "@"} {otherTeam}
                                    </span>
                                    <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: 11 }}>
                                      {dateInfo.month} {dateInfo.day}
                                    </span>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "standings" && (
          <div>
            <div style={{
              background: "#ffffff",
              border: "1px solid #e0e4eb",
              borderRadius: 14,
              marginTop: 8,
              overflow: "hidden",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(15px)",
              transition: "all 0.5s 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
              <div style={{
                padding: "14px 16px 10px",
                borderBottom: "1px solid #e0e4eb",
              }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
                  Spring 2026 — Coed Fifth Division
                </h3>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e0e4eb" }}>
                      {["#", "Team", "MP", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((col) => (
                        <th key={col} style={{
                          padding: "8px 6px",
                          textAlign: col === "Team" ? "left" : "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          whiteSpace: "nowrap",
                        }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedStandings().map((row, i) => {
                      const isLeo = row.team === "Leo United";
                      return (
                        <tr key={row.team} style={{
                          background: isLeo ? "#eff6ff" : (i % 2 === 0 ? "#fff" : "#f8fafc"),
                          borderBottom: "1px solid #f1f5f9",
                          fontWeight: isLeo ? 700 : 400,
                        }}>
                          <td style={{ padding: "10px 6px", textAlign: "center", color: "#64748b", fontSize: 12 }}>{i + 1}</td>
                          <td style={{
                            padding: "10px 6px", textAlign: "left", color: "#1e293b",
                            whiteSpace: "nowrap",
                            borderLeft: isLeo ? "3px solid #2563eb" : "3px solid transparent",
                          }}>
                            {row.team}
                          </td>
                          <td style={{ padding: "10px 6px", textAlign: "center", color: "#475569" }}>{row.mp}</td>
                          <td style={{ padding: "10px 6px", textAlign: "center", color: "#16a34a", fontWeight: 600 }}>{row.w}</td>
                          <td style={{ padding: "10px 6px", textAlign: "center", color: "#94a3b8" }}>{row.d}</td>
                          <td style={{ padding: "10px 6px", textAlign: "center", color: "#dc2626", fontWeight: 600 }}>{row.l}</td>
                          <td style={{ padding: "10px 6px", textAlign: "center", color: "#475569" }}>{row.gf}</td>
                          <td style={{ padding: "10px 6px", textAlign: "center", color: "#475569" }}>{row.ga}</td>
                          <td style={{ padding: "10px 6px", textAlign: "center", color: row.gd > 0 ? "#16a34a" : row.gd < 0 ? "#dc2626" : "#94a3b8", fontWeight: 600 }}>
                            {row.gd > 0 ? `+${row.gd}` : row.gd}
                          </td>
                          <td style={{ padding: "10px 6px", textAlign: "center", color: "#1e293b", fontWeight: 700, fontSize: 14 }}>{row.pts}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{
              textAlign: "center", marginTop: 12,
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.5s 0.5s",
            }}>
              <a
                href="https://app.teampass.com/Metrolina_Adult_Soccer_League/Standings/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
              >
                View official standings on TeamPass
              </a>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                Last updated: {new Date(standingsData.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "fields" && (
          <div>
            {Object.entries(FIELDS).map(([key, field], i) => {
              const gamesHere = SCHEDULE.filter((g) => g.fieldKey === key);
              return (
                <div
                  key={key}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: "16px",
                    marginTop: 8,
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateY(0)" : "translateY(15px)",
                    transition: `all 0.5s ${0.08 * i + 0.3}s cubic-bezier(0.16, 1, 0.3, 1)`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>
                        {field.name}
                      </h3>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                        {field.field} · {field.address}
                      </p>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 8px",
                      borderRadius: 6, background: "rgba(234,179,8,0.15)",
                      color: "#facc15", whiteSpace: "nowrap",
                    }}>
                      {gamesHere.length} {gamesHere.length === 1 ? "game" : "games"}
                    </span>
                  </div>

                  {/* Games at this field */}
                  <div style={{ marginBottom: 12 }}>
                    {gamesHere.map((g, gi) => (
                      <div key={gi} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "6px 0",
                        borderTop: gi > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        fontSize: 12, color: "rgba(255,255,255,0.5)",
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: g.homeAway === "home" ? "#facc15" : "#60a5fa",
                          flexShrink: 0,
                        }} />
                        <span style={{ color: "rgba(255,255,255,0.35)", width: 65, flexShrink: 0 }}>
                          {formatDate(g.date).full.split(", ")[1]}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.6)" }}>
                          {g.homeAway === "home" ? "vs" : "@"} {g.opponent}
                        </span>
                        <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.25)" }}>
                          {g.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <a
                      href={getGoogleMapsDirectionsUrl(field)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "#2563eb", color: "#fff",
                        padding: "8px 14px", borderRadius: 8,
                        fontSize: 12, fontWeight: 600,
                        textDecoration: "none",
                        transition: "transform 0.15s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <NavigationIcon /> Directions
                    </a>
                    <a
                      href={getGoogleMapsUrl(field)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "rgba(37,99,235,0.15)", color: "#93c5fd",
                        padding: "8px 14px", borderRadius: 8,
                        fontSize: 12, fontWeight: 600,
                        textDecoration: "none",
                        transition: "transform 0.15s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <MapPinIcon /> View on Map
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer link */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(transparent, #0d1526 40%)",
        padding: "40px 16px 16px",
        textAlign: "center",
      }}>
        <a
          href="https://app.teampass.com/Metrolina_Adult_Soccer_League/Team/133675"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 11, color: "rgba(255,255,255,0.3)",
            textDecoration: "none",
          }}
        >
          Metrolina Adult Soccer League · TeamPass
        </a>
      </div>
    </div>
  );
}