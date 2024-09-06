"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { FaCircle } from "react-icons/fa";
import tinycolor from "tinycolor2";

const scrollingTextContent =
  "Thanks for tuning in to the Saturday Stats scoreboard presented by SaturdayStats.com. Live game results are updated every minute. Like and subscribe for more scoreboards and other content. Visit SaturdayStats.com to build a College Football Playoff bracket, model two teams against one another, and more!";

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear =
  currentMonth >= 7 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;

// Type definitions
interface Team {
  id: number;
  name: string;
  school: string;
  mascot: string;
  color: string;
  logos: string[];
}

interface Ranking {
  school: string;
  rank: number;
}

interface Game {
  id: number;
  startDate: string;
  startTimeTBD: boolean;
  tv: string;
  neutralSite: boolean;
  conferenceGame: boolean;
  status: string;
  period: number;
  clock: string;
  situation: string;
  possession: string;
  venue: {
    name: string;
    city: string;
    state: string;
  };
  homeTeam: {
    id: number;
    name: string;
    conference: string;
    classification: string;
    points: number;
  };
  awayTeam: {
    id: number;
    name: string;
    conference: string;
    classification: string;
    points: number;
  };
  weather?: {
    temperature: string;
    description: string;
    windSpeed: string;
    windDirection: string;
  };
  betting?: {
    spread: string;
    overUnder: string;
    homeMoneyline: number;
    awayMoneyline: number;
  };
}

interface ScoreboardData {
  games: Game[];
  teams: Team[];
  rankings: Ranking[];
}

const LiveScoreboardPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const searchParams = useSearchParams();
  const gameIdParam = searchParams.get("game");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseTeams = await fetch(`/api/teams`);
        const responseRankings = await fetch(
          `/api/rankings?year=${currentYear}`
        );

        const teamsData: Team[] = await responseTeams.json();
        const rankingsData: Ranking[] = await responseRankings.json();

        setTeams(teamsData);
        setRankings(rankingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchScoreboardData = async () => {
      try {
        const response = await fetch(`/api/scoreboard`);
        const scoreboardData: Game[] = await response.json();
        setGames(scoreboardData);
      } catch (error) {
        console.error("Error fetching scoreboard data:", error);
      }
    };

    // Initial fetch
    fetchScoreboardData();

    // Set up interval to fetch data every 60 seconds
    const intervalId = setInterval(fetchScoreboardData, 60000); // 60000ms = 60 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const matchingHomeTeam = (game: Game) =>
    teams.find(
      (team) =>
        game.homeTeam.name.includes(team.school) &&
        game.homeTeam.name.includes(team.mascot)
    );

  const matchingAwayTeam = (game: Game) =>
    teams.find(
      (team) =>
        game.awayTeam.name.includes(team.school) &&
        game.awayTeam.name.includes(team.mascot)
    );

  const matchingHomeRank = (game: Game) =>
    rankings.find((rank) => rank.school === game.homeTeam.name);

  const matchingAwayRank = (game: Game) =>
    rankings.find((rank) => rank.school === game.awayTeam.name);

  const periodText = (period: number) => {
    switch (period) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      case 4:
        return "th";
      default:
        return "";
    }
  };

  const formatGameData = (game: Game) => {
    const { homeTeam, awayTeam } = game;
    return `${homeTeam.name} ${homeTeam.points || 0} - ${awayTeam.name} ${
      awayTeam.points || 0
    }`;
  };

  const formattedGamesData = games.map(formatGameData).join(" | ");

  // Find the game that matches the gameId from search params
  const selectedGame = games.find((g) => g.id.toString() === gameIdParam);

  if (!selectedGame) {
    return <div>Game loading...</div>;
  }

  return (
    <div className="h-screen w-screen relative -my-8">
      <div
        className="absolute top-0 left-0 h-full w-1/2 flex flex-col gap-4 items-center justify-center"
        style={{
          backgroundColor: matchingHomeTeam(selectedGame)?.color,
        }}
      >
        <img
          src={
            selectedGame.homeTeam.name.includes("Crimson Tide")
              ? matchingHomeTeam(selectedGame)?.logos[1]
              : matchingHomeTeam(selectedGame)?.logos[0]
          }
          alt={selectedGame.homeTeam.name}
        />
        <span
          className="text-white text-4xl font-bold rounded-lg border-2 p-4 relative"
          style={{
            backgroundColor: tinycolor(matchingHomeTeam(selectedGame)?.color)
              .darken(10)
              .toString(),
            borderColor: tinycolor(matchingHomeTeam(selectedGame)?.color)
              .darken(15)
              .toString(),
          }}
        >
          {selectedGame.homeTeam.points || 0}
          {selectedGame.possession === "home" && (
            <div
              className="bg-white rounded-full w-3 h-3 absolute"
              style={{ top: 4, right: 4 }}
            ></div>
          )}
        </span>
      </div>
      <div
        className="absolute top-0 right-0 h-full w-1/2 flex flex-col gap-4 items-center justify-center"
        style={{
          backgroundColor: matchingAwayTeam(selectedGame)?.color,
        }}
      >
        <img
          src={
            selectedGame.awayTeam.name.includes("Crimson Tide")
              ? matchingAwayTeam(selectedGame)?.logos[1]
              : matchingAwayTeam(selectedGame)?.logos[0]
          }
          alt={selectedGame.awayTeam.name}
        />
        <span
          className="text-white text-4xl font-bold rounded-lg border-2 p-4 relative"
          style={{
            backgroundColor: tinycolor(matchingAwayTeam(selectedGame)?.color)
              .darken(10)
              .toString(),
            borderColor: tinycolor(matchingAwayTeam(selectedGame)?.color)
              .darken(15)
              .toString(),
          }}
        >
          {selectedGame.awayTeam.points || 0}
          {selectedGame.possession === "away" && (
            <div
              className="bg-white rounded-full w-3 h-3 absolute"
              style={{ top: 4, right: 4 }}
            ></div>
          )}
        </span>
      </div>
      <div
        key={selectedGame.id}
        className="flex bg-gray-800 rounded absolute border-2 border-gray-900"
        style={{ bottom: 72, left: 256, right: 256 }}
      >
        <div className="text-white items-center w-full rounded-lg">
          {/* CLOCK */}
          <div className="flex items-center justify-evenly py-4">
            <span className="font-semibold uppercase text-3xl">
              {selectedGame.period || 1}
              <span className="text-xl">
                {selectedGame.period
                  ? periodText(selectedGame.period)
                  : periodText(1)}
              </span>
            </span>
            <span className="text-gray-400">|</span>
            <span className="min-w-14 text-3xl font-semibold uppercase text-center">
              {selectedGame.clock || `15:00`}
            </span>
            {selectedGame.situation && selectedGame.situation.includes("at") ? (
              <>
                <span className="text-gray-400">|</span>
                <span className="min-w-20 font-semibold uppercase text-3xl">
                  {selectedGame.situation.split("at")[0]}
                </span>
              </>
            ) : (
              <>
                <span className="text-gray-400">|</span>
                <span className="min-w-20 font-semibold uppercase text-3xl">
                  {`1st & 10`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="bottom-0 left-0 right-0 fixed flex py-2 gap-2 pl-2 bg-gray-200">
        <img src={"Saturday Stats.png"} className="max-h-10 w-auto" />

        <Marquee className="text-gray-800 text-xl border-l-gray-400 border-2">
          {formattedGamesData + scrollingTextContent}
        </Marquee>
      </div>
    </div>
  );
};

export default LiveScoreboardPage;
