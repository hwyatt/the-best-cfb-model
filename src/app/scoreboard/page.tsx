"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { FaCircle } from "react-icons/fa";

const scrollingTextContent =
  "Thanks for tuning in to the Saturday Stats scoreboard presented by SaturdayStats.com. Live game results are updated every minute. Like and subscribe for more scoreboards and other content.";

const currentDate = new Date();
const currentMonth = currentDate.getMonth();

// If we are not yet in August of the current year, set the current football year to the previous year
const currentYear =
  currentMonth >= 7 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;

const ScoreboardPage = () => {
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [rankings, setRankings] = useState<any>([]);
  const searchParams = useSearchParams();
  const teamParam = searchParams.get("team");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const responseGames = await fetch(`/api/scoreboard`);
        const responseTeams = await fetch(`/api/teams`);
        const responseRankings = await fetch(
          `/api/rankings?year=${currentYear}`
        );

        // const gamesData = await responseGames.json();
        const teamsData = await responseTeams.json();
        const rankingsData = await responseRankings.json();

        // setGames(gamesData);
        setTeams(teamsData);
        setRankings(rankingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Run only once on mount

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

    fetchScoreboardData();

    // 5 seconds FOR TESTING
    // const interval = setInterval(fetchScoreboardData, 5000);

    // 60 seconds
    // const interval = setInterval(fetchScoreboardData, 60000);

    // return () => clearInterval(interval);
  }, []);

  const matchingHomeTeam: any = (game: any) =>
    teams.find((team: any) => team.school === game.homeTeam.name);
  const matchingAwayTeam: any = (game: any) =>
    teams.find((team: any) => team.school === game.awayTeam.name);

  const matchingHomeRank: any = (game: any) =>
    rankings?.ranks?.find((rank: any) => rank.school === game.homeTeam.name);
  const matchingAwayRank: any = (game: any) =>
    rankings?.ranks?.find((rank: any) => rank.school === game.awayTeam.name);

  const matchingParamTeam = (game: any, teamParam: any) => {
    return game.homeTeam.name === teamParam || game.awayTeam.name === teamParam;
  };

  const gamesForTeam = games.filter((game) =>
    matchingParamTeam(game, teamParam)
  );

  const displayGames = gamesForTeam.length > 0 ? gamesForTeam : games;

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

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <img src={"Saturday Stats.png"} className="max-h-10 w-auto" />
        <h2 className="font-semibold uppercase text-gray-600">
          Live College Football Scoreboard
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {displayGames.map((game: any) => (
          <div
            key={game.id}
            className={`flex bg-gray-800 rounded shadow-lg ${
              displayGames.length === 1 && "absolute"
            }`}
            style={
              displayGames.length === 1
                ? { bottom: 64, left: 256, right: 256 }
                : {}
            }
          >
            <div className="grid grid-cols-3 text-white items-center w-full">
              {/* HOME TEAM */}
              <div
                className="flex items-center justify-between pl-2 gap-2 rounded"
                style={{
                  backgroundColor: matchingHomeTeam(game)?.color,
                }}
              >
                <div className="flex items-center w-full gap-2">
                  <div className="w-1/4 max-w-12 bg-gray-200 rounded-full p-2">
                    {matchingHomeTeam(game) && (
                      <img
                        src={matchingHomeTeam(game)?.logos[0]}
                        alt={game.homeTeam.name}
                      />
                    )}
                  </div>
                  <span className="w-3/4 text-sm font-semibold uppercase leading-none	">
                    <span className="font-normal">
                      {matchingHomeRank(game)?.rank}
                    </span>{" "}
                    {game.homeTeam.name}
                  </span>
                </div>
                <div className="flex items-center bg-gray-700 p-2 relative">
                  <span className="text-3xl font-bold min-w-9 flex justify-center">
                    {game.homeTeam.points}
                  </span>
                  {game.possession === "home" && (
                    <FaCircle
                      className="absolute"
                      style={{ top: "4px", right: "2px", fontSize: "8px" }}
                    />
                  )}
                </div>
              </div>
              {/* AWAY TEAM */}
              <div
                className="flex items-center justify-between pl-2 gap-2"
                style={{
                  backgroundColor: matchingAwayTeam(game)?.color,
                }}
              >
                <div className="flex items-center w-full gap-2">
                  <div className="w-1/4 max-w-12 bg-gray-200 rounded-full p-1">
                    {matchingAwayTeam(game) && (
                      <img
                        src={matchingAwayTeam(game)?.logos[0]}
                        alt={game.awayTeam.name}
                      />
                    )}
                  </div>
                  <span className="w-3/4 text-sm font-semibold uppercase leading-none	">
                    <span className="font-normal">
                      {matchingAwayRank(game)?.rank}
                    </span>{" "}
                    {game.awayTeam.name}
                  </span>
                </div>
                <div className="flex items-center bg-gray-700 p-2 relative">
                  <span className="text-3xl font-bold min-w-9 flex justify-center">
                    {game.awayTeam.points}
                  </span>
                  {game.possession === "away" && (
                    <FaCircle
                      className="absolute"
                      style={{ top: "4px", right: "2px", fontSize: "8px" }}
                    />
                  )}
                </div>
              </div>
              {/* CLOCK */}
              <div className="flex items-center justify-evenly">
                <span className="font-semibold uppercase">
                  {game.period}
                  <span className="text-xs">{periodText(game.period)}</span>
                </span>
                <span className="text-gray-400">|</span>
                <span className="min-w-14 text-xl font-semibold uppercase text-center">
                  {game.clock}
                </span>
                {game.situation.includes("at") ? (
                  <>
                    <span className="text-gray-400">|</span>
                    <span className="min-w-20 font-semibold uppercase">
                      {game.situation.split("at")[0]}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400">|</span>
                    <span className="min-w-20 font-semibold uppercase"></span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Marquee
        className="bg-gray-800 text-white py-2 bottom-0 left-0 right-0 text-lg"
        style={{ position: "fixed" }}
      >
        {scrollingTextContent}
      </Marquee>
    </div>
  );
};

export default ScoreboardPage;
