/**
 * Scrapes the TeamPass website for Metrolina Adult Soccer League
 * Coed Fifth Division standings and match results.
 *
 * Run manually:  node scripts/update-data.mjs
 * Or via npm:    npm run update-data
 *
 * This script:
 * 1. Fetches the standings page and parses the Fifth Division table
 * 2. Fetches each team's schedule page to find completed match results
 * 3. Writes updated JSON files that the frontend imports
 */

import { load } from "cheerio";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, "..", "src", "data");

const BASE_URL = "https://app.teampass.com/Metrolina_Adult_Soccer_League";

// All teams in Coed Fifth Division with their TeamPass IDs
const DIVISION_TEAMS = {
  "Charlotte Celtic Legends": 133662,
  "Charlotte Eclipse": 133663,
  "Day Ones FC": 136988,
  "Leo United": 133675,
  "QCU Sauce": 133687,
  "TBD Soccer Club": 135212,
};

const TEAM_NAMES = new Set(Object.keys(DIVISION_TEAMS));

/**
 * Fetch a page and return a cheerio instance for parsing.
 */
async function fetchPage(url) {
  console.log(`  Fetching: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const html = await res.text();
  return load(html);
}

/**
 * Scrape the standings page for Coed Fifth Division data.
 * Looks for a table under a heading containing "Fifth Division".
 */
async function scrapeStandings() {
  console.log("Scraping standings...");
  const $ = await fetchPage(`${BASE_URL}/Standings/`);

  const teams = [];

  // Find the section containing "Fifth Division" and its table
  // TeamPass renders each division as a heading + table pair
  $("h3, h4, .accordion-toggle, [class*='back_']").each(function () {
    const heading = $(this).text().trim();
    if (!heading.toLowerCase().includes("fifth division")) return;

    // The standings table is the next .Table element after this heading
    // Walk siblings until we find a table
    let tableEl = $(this).next();
    while (tableEl.length && !tableEl.is("table") && !tableEl.find("table").length) {
      tableEl = tableEl.next();
    }

    const table = tableEl.is("table") ? tableEl : tableEl.find("table").first();
    if (!table.length) return;

    table.find("tbody tr").each(function () {
      const cells = $(this).find("td");
      if (cells.length < 8) return;

      const teamName = cells.eq(1).text().trim();
      if (!TEAM_NAMES.has(teamName)) return;

      teams.push({
        team: teamName,
        mp: parseInt(cells.eq(2).text().trim()) || 0,
        w: parseInt(cells.eq(3).text().trim()) || 0,
        d: parseInt(cells.eq(4).text().trim()) || 0,
        l: parseInt(cells.eq(5).text().trim()) || 0,
        gf: parseInt(cells.eq(6).text().trim()) || 0,
        ga: parseInt(cells.eq(7).text().trim()) || 0,
        gd: parseInt(cells.eq(8).text().trim()) || 0,
        pts: parseInt(cells.eq(9).text().trim()) || 0,
      });
    });
  });

  // If we couldn't parse the table, fall back to known teams with zeros
  if (teams.length === 0) {
    console.log("  Warning: Could not parse standings table, using fallback data");
    for (const teamName of TEAM_NAMES) {
      teams.push({ team: teamName, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 });
    }
  }

  console.log(`  Found ${teams.length} teams`);
  return teams;
}

/**
 * Scrape a team's schedule page for completed match results.
 *
 * Strategy: parse each table row cell-by-cell. We look for a cell
 * that contains ONLY a score (like "2 - 1") — a short string with
 * just two numbers separated by a dash. This avoids false positives
 * from dates/times which contain other text.
 *
 * When the season hasn't started, no rows will have scores and this
 * returns an empty array — which is correct.
 */
async function scrapeTeamResults(teamName, teamId) {
  const $ = await fetchPage(`${BASE_URL}/Team/${teamId}`);
  const results = [];

  $("tr").each(function () {
    const cells = $(this).find("td");
    if (cells.length < 3) return;

    // Look for a cell that contains just a score pattern: "N - N"
    // The cell text (trimmed) should be ONLY the score, not mixed with other content.
    // This prevents matching "Feb 22 - 10:30 AM" which has extra text.
    let scoreCell = null;
    let homeScore = null;
    let awayScore = null;

    cells.each(function () {
      const cellText = $(this).text().trim();
      // Match a cell whose entire content is a score: just two numbers with a dash
      const match = cellText.match(/^(\d{1,2})\s*[-–]\s*(\d{1,2})$/);
      if (match) {
        scoreCell = $(this);
        homeScore = parseInt(match[1]);
        awayScore = parseInt(match[2]);
      }
    });

    // No score cell found — this is a scheduled (not completed) game
    if (!scoreCell) return;

    // Extract date from the row
    const rowText = $(this).text();
    const dateMatch = rowText.match(
      /(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)\w*,?\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})/i
    );
    if (!dateMatch) return;

    const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    const monthNum = months[dateMatch[1].toLowerCase()];
    const day = parseInt(dateMatch[2]);
    const year = 2026;
    const dateStr = `${year}-${String(monthNum + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // Find opponent — look for links to team pages
    let opponent = null;
    $(this).find("a[href*='/Team/']").each(function () {
      const linkText = $(this).text().trim();
      if (linkText && linkText !== teamName && TEAM_NAMES.has(linkText)) {
        opponent = linkText;
      }
    });
    if (!opponent) return;

    // Determine home/away by looking for "@" before the opponent link
    // On away games, the opponent cell contains "@ Opponent"
    // On home games, it contains "vs Opponent"
    let isAway = false;
    cells.each(function () {
      const cellText = $(this).text().trim();
      if (cellText.startsWith("@") && cellText.includes(opponent)) {
        isAway = true;
      }
    });

    results.push({
      date: dateStr,
      home: isAway ? opponent : teamName,
      away: isAway ? teamName : opponent,
      homeScore,
      awayScore,
    });
  });

  return results;
}

/**
 * Scrape all team pages for match results, then deduplicate.
 * Each match appears on two team pages (both participants),
 * so we deduplicate by date + teams involved.
 */
async function scrapeAllResults() {
  console.log("Scraping match results...");
  const allResults = [];

  for (const [teamName, teamId] of Object.entries(DIVISION_TEAMS)) {
    const results = await scrapeTeamResults(teamName, teamId);
    console.log(`  ${teamName}: ${results.length} results`);
    allResults.push(...results);
  }

  // Deduplicate — same date + same two teams = same match
  const seen = new Set();
  const unique = allResults.filter((m) => {
    const teams = [m.home, m.away].sort().join(" vs ");
    const key = `${m.date}|${teams}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by date
  unique.sort((a, b) => a.date.localeCompare(b.date));

  console.log(`  ${unique.length} unique matches after deduplication`);
  return unique;
}

async function main() {
  console.log("=== Leo United Data Updater ===\n");

  const now = new Date().toISOString();

  // Scrape standings
  const teams = await scrapeStandings();
  const standingsData = {
    lastUpdated: now,
    division: "Spring 2026 - Coed Fifth Division",
    teams,
  };

  // Scrape results
  const matches = await scrapeAllResults();
  const resultsData = {
    lastUpdated: now,
    matches,
  };

  // Write JSON files
  const standingsPath = join(DATA_DIR, "standings.json");
  const resultsPath = join(DATA_DIR, "results.json");

  writeFileSync(standingsPath, JSON.stringify(standingsData, null, 2) + "\n");
  writeFileSync(resultsPath, JSON.stringify(resultsData, null, 2) + "\n");

  console.log(`\nWrote ${standingsPath}`);
  console.log(`Wrote ${resultsPath}`);
  console.log(`\nDone! Last updated: ${now}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
