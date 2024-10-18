"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import tinycolor from "tinycolor2";
import { FaCircle } from "react-icons/fa";
// import Marquee from "react-fast-marquee";

type Game = {
  awayClassification: string; // Assuming 'division' is a specific string literal type
  awayConference: string;
  awayConferenceAbbreviation: string;
  awayId: number; // Int
  awayLineScores: number[]; // smallint is typically represented as number in TypeScript
  awayPoints: number; // smallint
  awayTeam: string;
  city: string;
  conferenceGame: boolean; // Boolean
  currentClock: string;
  currentPeriod: number; // smallint
  currentPossession: string;
  currentSituation: string;
  homeClassification: string; // Assuming 'division' is a specific string literal type
  homeConference: string;
  homeConferenceAbbreviation: string;
  homeId: number; // Int
  homeLineScores: number[]; // smallint is typically represented as number in TypeScript
  homePoints: number; // smallint
  homeTeam: string;
  id: number; // Int
  lastPlay: string;
  moneylineAway: number; // Int
  moneylineHome: number; // Int
  neutralSite: boolean; // Boolean
  overUnder: number; // numeric
  spread: number; // numeric
  startDate: string; // Use string for timestamp; consider using Date object if needed
  startTimeTbd: boolean; // Boolean
  state: string;
  status: string; // Assuming 'game_status' is a specific string literal type
  temperature: number; // numeric
  tv: string;
  venue: string;
  weatherDescription: string;
  windDirection: number; // numeric
  windSpeed: number; // numeric
};

type Team = {
  id: number;
  name: string;
  school: string;
  mascot: string;
  color: string;
  logos: string[];
};

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

const ScoreboardV2 = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const searchParams = useSearchParams();
  const gameIdParam = searchParams.get("game");
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    const ws = new WebSocket(
      `wss://saturday-stats-ws.onrender.com?gameId=${gameIdParam}`
    );

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        console.log("Received response:", response.data.scoreboard[0]);
        setGame(response.data.scoreboard[0]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseTeams = await fetch(`/api/teams`);
        const teamsData: Team[] = await responseTeams.json();
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const matchingHomeTeam = (game: Game) =>
    teams.find(
      (team) =>
        game.homeTeam.includes(team.school) &&
        game.homeTeam.includes(team.mascot)
    );

  const matchingAwayTeam = (game: Game) =>
    teams.find(
      (team) =>
        game.awayTeam.includes(team.school) &&
        game.awayTeam.includes(team.mascot)
    );

  if (game && height == 100) {
    return (
      <div className="h-screen w-screen absolute inset-0 text-white items-center w-full flex flex-col">
        <div className="grid grid-cols-2 w-full h-full">
          <div
            className="flex items-center justify-between pl-2 gap-2 h-full"
            style={{
              backgroundColor: matchingHomeTeam(game)?.color,
            }}
          >
            <div className="flex items-center w-full gap-2">
              <div className="max-w-12 bg-gray-200 rounded-full p-2">
                {matchingHomeTeam(game) && (
                  <img
                    src={matchingHomeTeam(game)?.logos[0]}
                    alt={game.awayTeam}
                  />
                )}
              </div>
              <span className="w-3/4 text-lg font-semibold uppercase leading-none	">
                {game.homeTeam}
              </span>
            </div>
            <div
              className="flex items-center p-2 relative h-full"
              style={{
                backgroundColor: tinycolor(matchingHomeTeam(game)?.color)
                  .darken(10)
                  .toString(),
              }}
            >
              <span className="text-3xl font-bold min-w-9 flex justify-center">
                {game.homePoints || 0}
              </span>
              {game.currentPossession === "home" && (
                <FaCircle
                  className="absolute"
                  style={{ top: "4px", right: "2px", fontSize: "8px" }}
                />
              )}
            </div>
          </div>
          <div
            className="flex items-center justify-between pl-2 gap-2 h-full"
            style={{
              backgroundColor: matchingAwayTeam(game)?.color,
            }}
          >
            <div className="flex items-center w-full gap-2">
              <div className="max-w-12 bg-gray-200 rounded-full p-2">
                {matchingAwayTeam(game) && (
                  <img
                    src={matchingAwayTeam(game)?.logos[0]}
                    alt={game.awayTeam}
                  />
                )}
              </div>
              <span className="w-3/4 text-lg font-semibold uppercase leading-none	">
                {game.awayTeam}
              </span>
            </div>
            <div
              className="flex items-center p-2 relative h-full"
              style={{
                backgroundColor: tinycolor(matchingAwayTeam(game)?.color)
                  .darken(10)
                  .toString(),
              }}
            >
              <span className="text-3xl font-bold min-w-9 flex justify-center">
                {game.awayPoints || 0}
              </span>
              {game.currentPossession === "away" && (
                <FaCircle
                  className="absolute"
                  style={{ top: "4px", right: "2px", fontSize: "8px" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    game && (
      <div className="h-screen w-screen relative -my-8">
        <div
          className="absolute top-0 left-0 h-full w-1/2 flex flex-col gap-4 items-center justify-center"
          style={{
            backgroundColor: matchingHomeTeam(game)?.color,
          }}
        >
          <img
            src={
              game.homeTeam.includes("Crimson Tide") ||
              game.homeTeam.includes("Oregon Ducks")
                ? matchingHomeTeam(game)?.logos[1]
                : matchingHomeTeam(game)?.logos[0]
            }
            alt={game.homeTeam}
          />
          <span
            className="text-white text-4xl font-bold rounded-lg border-2 p-4 relative"
            style={{
              backgroundColor: tinycolor(matchingHomeTeam(game)?.color)
                .darken(10)
                .toString(),
              borderColor: tinycolor(matchingHomeTeam(game)?.color)
                .darken(15)
                .toString(),
            }}
          >
            {game.homePoints || 0}
            {game.currentPossession === "home" && (
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
            backgroundColor: game.homeTeam.includes("Texas A&M Aggies")
              ? "white"
              : matchingAwayTeam(game)?.color,
          }}
        >
          <img
            src={
              game.awayTeam.includes("Crimson Tide")
                ? matchingAwayTeam(game)?.logos[1]
                : matchingAwayTeam(game)?.logos[0]
            }
            alt={game.awayTeam}
          />
          <span
            className="text-white text-4xl font-bold rounded-lg border-2 p-4 relative"
            style={{
              backgroundColor: tinycolor(matchingAwayTeam(game)?.color)
                .darken(10)
                .toString(),
              borderColor: tinycolor(matchingAwayTeam(game)?.color)
                .darken(15)
                .toString(),
            }}
          >
            {game.awayPoints || 0}
            {game.currentPossession === "away" && (
              <div
                className="bg-white rounded-full w-3 h-3 absolute"
                style={{ top: 4, right: 4 }}
              ></div>
            )}
          </span>
        </div>
        <div
          key={game.id}
          className="flex bg-gray-800 rounded absolute border-2 border-gray-900"
          style={{ bottom: 72, left: 256, right: 256 }}
        >
          <div className="text-white items-center w-full rounded-lg">
            {game.currentPeriod === 2 && game.currentClock === "00:00:00" ? (
              <div className="flex items-center justify-evenly py-4 w-full">
                <span className="font-semibold uppercase text-3xl">
                  Halftime
                </span>
              </div>
            ) : game.status === "completed" ? (
              <div className="flex items-center justify-evenly py-4">
                <span className="font-semibold uppercase text-3xl">Final</span>
              </div>
            ) : (
              <div className="flex items-center justify-evenly py-4">
                <span className="font-semibold uppercase text-3xl">
                  {game.currentPeriod || 1}
                  <span className="text-xl">
                    {game.currentPeriod
                      ? periodText(game.currentPeriod)
                      : periodText(1)}
                  </span>
                </span>
                <span className="text-gray-400">|</span>
                <span className="min-w-14 text-3xl font-semibold uppercase text-center">
                  {game.currentClock || `15:00`}
                </span>
                {game.currentSituation &&
                game.currentSituation.includes("at") ? (
                  <>
                    <span className="text-gray-400">|</span>
                    <span className="min-w-20 font-semibold uppercase text-3xl">
                      {game.currentSituation.split("at")[0]}
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
            )}
          </div>
        </div>
        <div className="bottom-0 left-0 right-0 fixed flex py-2 gap-2 pl-2 bg-gray-200">
          <img src={"Saturday Stats.png"} className="max-h-10 w-auto" />

          {/* <Marquee className="text-gray-800 text-xl border-l-gray-400 border-2">
          {formattedGamesData + scrollingTextContent}
        </Marquee> */}
        </div>
      </div>
    )
  );
};

export default ScoreboardV2;
