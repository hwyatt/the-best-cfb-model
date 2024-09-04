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

const LiveScoreboardPage = () => {
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [rankings, setRankings] = useState<any>([]);
  const searchParams = useSearchParams();
  const teamParam = searchParams.get("team");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseTeams = await fetch(`/api/teams`);
        const responseRankings = await fetch(
          `/api/rankings?year=${currentYear}`
        );

        const teamsData = await responseTeams.json();
        const rankingsData = await responseRankings.json();

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
        const scoreboardData = await response.json();
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

  const matchingHomeTeam: any = (game: any) =>
    teams.find(
      (team: any) =>
        game.homeTeam.name.includes(team.school) &&
        game.homeTeam.name.includes(team.mascot)
    );

  const matchingAwayTeam: any = (game: any) =>
    teams.find(
      (team: any) =>
        game.awayTeam.name.includes(team.school) &&
        game.awayTeam.name.includes(team.mascot)
    );

  const matchingHomeRank: any = (game: any) =>
    rankings?.ranks?.find((rank: any) => rank.school === game.homeTeam.name);
  const matchingAwayRank: any = (game: any) =>
    rankings?.ranks?.find((rank: any) => rank.school === game.awayTeam.name);

  const matchingParamTeam = (game: any, teamParam: any) => {
    return game.homeTeam.name === teamParam || game.awayTeam.name === teamParam;
  };

  const game: any = {
    id: 401635525,
    startDate: "2024-08-24T16:00:00.000Z",
    startTimeTBD: false,
    tv: "ACC NETWORK",
    neutralSite: true,
    conferenceGame: true,
    status: "completed",
    period: 4,
    clock: "11:07",
    situation: "4th & 5 at FSU 26",
    possession: "home",
    venue: {
      name: "Aviva Stadium",
      city: "Dublin",
      state: "",
    },
    homeTeam: {
      id: 59,
      name: "Georgia Tech Yellow Jackets",
      conference: "ACC",
      classification: "fbs",
      points: 24,
    },
    awayTeam: {
      id: 52,
      name: "Florida State Seminoles",
      conference: "ACC",
      classification: "fbs",
      points: 21,
    },
    weather: {
      temperature: "60.8",
      description: "Cloudy",
      windSpeed: "19.9",
      windDirection: "270.0",
    },
    betting: {
      spread: "10.0",
      overUnder: "54.5",
      homeMoneyline: 345,
      awayMoneyline: -470,
    },
  };

  const periodText = (period: number) => {
    if (period === 1) {
      return "st";
    } else if (period === 2) {
      return "nd";
    } else if (period === 3) {
      return "rd";
    } else if (period === 4) {
      return "th";
    } else {
      return "";
    }
  };

  const formatGameData = (game: any) => {
    const { homeTeam, awayTeam, venue, situation } = game;
    return `${homeTeam.name} ${homeTeam.points} - ${awayTeam.name} ${awayTeam.points}`;
  };

  const formattedGamesData = games.map(formatGameData).join(" | ");

  return (
    <div className="h-screen w-screen relative -my-8">
      <div
        className="absolute top-0 left-0 h-full w-1/2 flex flex-col gap-4 items-center justify-center"
        style={{
          backgroundColor: matchingHomeTeam(game)?.color,
        }}
      >
        <img src={matchingHomeTeam(game)?.logos[0]} alt={game.homeTeam.name} />
        <span
          className="text-white text-4xl font-bold rounded-lg border-2 p-4"
          style={{
            backgroundColor: tinycolor(matchingHomeTeam(game)?.color)
              .darken(10)
              .toString(),
            borderColor: tinycolor(matchingHomeTeam(game)?.color)
              .darken(15)
              .toString(),
          }}
        >
          {game.homeTeam.points}
        </span>
      </div>
      <div
        className="absolute top-0 right-0 h-full w-1/2 flex flex-col gap-4 items-center justify-center"
        style={{
          backgroundColor: matchingAwayTeam(game)?.color,
        }}
      >
        <img src={matchingAwayTeam(game)?.logos[0]} alt={game.homeTeam.name} />
        <span
          className="text-white text-4xl font-bold rounded-lg border-2 p-4"
          style={{
            backgroundColor: tinycolor(matchingAwayTeam(game)?.color)
              .darken(10)
              .toString(),
            borderColor: tinycolor(matchingAwayTeam(game)?.color)
              .darken(15)
              .toString(),
          }}
        >
          {game.awayTeam.points}
        </span>
      </div>
      <div
        key={game.id}
        className={`flex bg-gray-800 rounded absolute border-2 border-gray-900`}
        style={{ bottom: 72, left: 256, right: 256 }}
      >
        <div className="text-white items-center w-full rounded-lg">
          {/* CLOCK */}
          <div className="flex items-center justify-evenly py-4">
            <span className="font-semibold uppercase text-3xl">
              {game.period}
              <span className="text-xl">{periodText(game.period)}</span>
            </span>
            <span className="text-gray-400">|</span>
            <span className="min-w-14 text-3xl font-semibold uppercase text-center">
              {game.clock}
            </span>
            {game.situation && game.situation.includes("at") ? (
              <>
                <span className="text-gray-400">|</span>
                <span className="min-w-20 font-semibold uppercase text-3xl">
                  {game.situation.split("at")[0]}
                </span>
              </>
            ) : (
              <>
                <span className="text-gray-400">|</span>
                <span className="min-w-20 font-semibold uppercase text-lg"></span>
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
