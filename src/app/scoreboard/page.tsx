"use client";
import React, { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";

const ScoreboardPage = () => {
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseGames = await fetch(`/api/scoreboard`);
        const responseTeams = await fetch(`/api/teams`);

        const gamesData = await responseGames.json();
        const teamsData = await responseTeams.json();

        setGames(gamesData);
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Run only once on mount

  const matchingHomeTeam: any = (game: any) =>
    teams.find((team: any) => team.school === game.homeTeam.name);
  const matchingAwayTeam: any = (game: any) =>
    teams.find((team: any) => team.school === game.awayTeam.name);

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
    <div className="grid grid-cols-2 gap-4">
      {games.map((game: any) => (
        <div key={game.id} className="flex bg-gray-800 rounded shadow-lg">
          <div className="grid grid-cols-3 text-white items-center w-full">
            {/* HOME TEAM */}
            <div
              className="flex items-center justify-between pl-2 gap-2"
              style={{
                backgroundColor: matchingHomeTeam(game)?.color,
              }}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold uppercase leading-none	">
                  {game.homeTeam.name}
                </span>
                <div className="max-w-12">
                  {matchingHomeTeam(game) && (
                    <img
                      src={matchingHomeTeam(game)?.logos[0]}
                      alt={game.homeTeam.name}
                    />
                  )}
                </div>
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
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold uppercase leading-none	">
                  {game.awayTeam.name}
                </span>
                <div className="max-w-12">
                  {matchingAwayTeam(game) && (
                    <img
                      src={matchingAwayTeam(game)?.logos[0]}
                      alt={game.awayTeam.name}
                    />
                  )}
                </div>
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
            <div className="flex items-center pl-2 gap-2">
              <span className="font-semibold uppercase">
                {game.period}
                <span className="text-xs">{periodText(game.period)}</span>
              </span>
              <span className="text-xl font-semibold uppercase">
                {game.clock}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreboardPage;
