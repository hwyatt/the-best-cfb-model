"use client";
import { useEffect, useState, useRef } from "react";
import SeasonSelect from "../components/SeasonSelect";
import TeamHero from "../components/TeamHero";
import TeamSelect from "../components/TeamSelect";
import { teamStadiumImages } from "../teamStadiumImages";

interface YearOption {
  label: string;
  value: string;
}

const TeamCard = ({ team, score, reverse }: any) => {
  let winner = true;
  return (
    <div className="relative">
      <div
        className={`flex ${
          reverse && `flex-row-reverse`
        } items-center justify-between max-h-16 gap-2 bg-white border-2 border-gray-400 rounded p-4 w-full shadow-md hover:shadow-xl transition-all transition-100`}
        style={{
          backgroundColor: `${
            team?.color !== "#ffffff" ? team?.color : team?.alt_color
          }`,
        }}
      >
        <div
          className={`flex ${reverse && `flex-row-reverse`} gap-2 items-center`}
        >
          <div className="bg-gray-200 rounded-full p-2">
            <img
              src={team?.logos[0]}
              alt={`${team?.school} Logo`}
              className="w-8 h-auto object-contain"
              crossOrigin="anonymous"
            />
          </div>

          <p className="hidden md:block text-white font-semibold">
            {team?.school}
          </p>
        </div>
        <p className="text-white font-semibold">{score}</p>
      </div>
    </div>
  );
};

const fetchTeamRatings = async (year: string, team: string) => {
  try {
    const response = await fetch(`/api/ratings?year=${year}&team=${team}`);
    const ratings = await response.json();
    return ratings;
  } catch (error) {
    console.error(`Error fetching stats for ${team} in ${year}:`, error);
    return null;
  }
};

const compareTeams = (
  teamAData: any,
  teamBData: any,
  averageScoreForTeamA: any,
  averageScoreForTeamB: any,
  averageScoreAllowedForTeamA: any,
  averageScoreAllowedForTeamB: any
) => {
  const { rating: ratingA } = teamAData;
  const { rating: ratingB } = teamBData;

  // Use each team's average baseline score instead of a fixed value like 24
  const baselineScoreForTeamA = averageScoreForTeamA;
  const baselineScoreForTeamB = averageScoreForTeamB;

  const pointSpread = ratingA - ratingB;

  // Applying weights for point spread and average scores
  const pointSpreadWeight = 0.5; // Adjust this weight according to your preference
  const averageScoreWeight = 0.3; // Adjust this weight according to your preference
  const averageScoreAllowedWeight = 0.2; // Adjust this weight according to your preference

  // Calculating weighted scores
  const weightedScoreA =
    baselineScoreForTeamA +
    (pointSpread * pointSpreadWeight) / 2 +
    (averageScoreForTeamA - baselineScoreForTeamA) * averageScoreWeight +
    (baselineScoreForTeamA - averageScoreAllowedForTeamA) *
      averageScoreAllowedWeight;

  const weightedScoreB =
    baselineScoreForTeamB -
    (pointSpread * pointSpreadWeight) / 2 +
    (averageScoreForTeamB - baselineScoreForTeamB) * averageScoreWeight +
    (baselineScoreForTeamB - averageScoreAllowedForTeamB) *
      averageScoreAllowedWeight;

  return {
    teamAScore: weightedScoreA.toFixed(2),
    teamBScore: weightedScoreB.toFixed(2),
  };
};

const TeamForCompare = ({ teams, onSelectTeam }: any) => {
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    // If we are not yet in August of the current year, set the current football year to the previous year
    const currentYear =
      currentMonth >= 7
        ? currentDate.getFullYear()
        : currentDate.getFullYear() - 1;

    setYear(currentYear.toString());

    const years = Array.from({ length: 24 }, (_, index) => currentYear - index);
    const formattedYears = years.map((year) => ({
      value: year.toString(),
      label: year.toString(),
    }));

    setYearOpts(formattedYears);
  }, []);

  const [selectedTeam, setSelectedTeam] = useState({
    id: null,
    school: null,
    mascot: null,
    abbreviation: null,
    alt_name_1: null,
    alt_name_2: null,
    alt_name_3: null,
    classification: null,
    conference: null,
    division: null,
    color: null,
    alt_color: null,
    logos: [null],
    stadiumImg: null,
    twitter: null,
    location: {
      venue_id: 0,
      name: null,
      city: null,
      state: null,
      zip: null,
      country_code: null,
      timezone: "string",
      latitude: 0,
      longitude: 0,
      elevation: 0,
      capacity: 0,
      year_constructed: 0,
      grass: true,
      dome: true,
    },
  });

  const [year, setYear] = useState("");
  const [yearOpts, setYearOpts] = useState<YearOption[]>([]);

  const handleYearChange = async (year: any) => {
    setYear(year.value);
    onSelectTeam({ team: selectedTeam.school, year: year.value });
  };

  const handleSelect = async (selectedOption: any) => {
    const selectedTeamName = selectedOption.value;
    const foundTeam = teams.find(
      (team: any) => team.school === selectedTeamName
    );
    setSelectedTeam(foundTeam);
    onSelectTeam({ team: foundTeam.school, year: year });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-600">
          Select or Search a Team
        </label>
        <TeamSelect
          teams={teams}
          selectedTeam={selectedTeam}
          handleSelect={handleSelect}
        />
        {selectedTeam && selectedTeam.id !== null && (
          <>
            <label className="font-semibold text-gray-600">
              Select a Season
            </label>
            <SeasonSelect
              yearOpts={yearOpts}
              year={year}
              handleYearChange={handleYearChange}
            />
          </>
        )}
      </div>
      {selectedTeam && selectedTeam.id !== null && (
        <div className="">
          <TeamHero selectedTeam={selectedTeam} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedTeam.school} {selectedTeam.mascot}
            </h2>
            <p className="uppercase text-gray-600">
              {selectedTeam.conference}{" "}
              {selectedTeam.division && selectedTeam.division}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const Compare = () => {
  const gameResultsRef = useRef<any>(null);
  const [data, setData] = useState([]);
  const [gameResults, setGameResults] = useState<any>([]);

  useEffect(() => {
    handleGetTeams();
  }, []);

  useEffect(() => {
    // Scroll to the #gameResults div when game results are ready
    if (gameResultsRef.current) {
      gameResultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [gameResults]);

  const handleGetTeams = async () => {
    const getTeams = await fetch(`/api/teams`);

    const teams = await getTeams.json();

    setData(teams);
  };

  const teams = data?.map((team: any) => ({
    ...team,
    stadiumImg:
      teamStadiumImages.find(
        (teamStadium) =>
          teamStadium.id === team.id && teamStadium.school === team.school
      )?.stadiumImg || null,
  }));

  const calculateAverageScores = (data: any, team: any) => {
    const teamData = data.filter(
      (game: any) => game.away_team === team || game.home_team === team
    );

    // Calculate average points scored by the team
    const totalPointsScored = teamData.reduce((accumulator: any, game: any) => {
      if (game.away_team === team) {
        return accumulator + game.away_points;
      } else if (game.home_team === team) {
        return accumulator + game.home_points;
      }
      return accumulator;
    }, 0);
    const averagePointsScored = totalPointsScored / teamData.length;

    // Calculate average points allowed (points scored against the team)
    const totalPointsAllowed = teamData.reduce(
      (accumulator: any, game: any) => {
        if (game.away_team === team) {
          return accumulator + game.home_points;
        } else if (game.home_team === team) {
          return accumulator + game.away_points;
        }
        return accumulator;
      },
      0
    );
    const averagePointsAllowed = totalPointsAllowed / teamData.length;

    return { averagePointsScored, averagePointsAllowed };
  };

  const [teamA, setTeamA] = useState({ team: "", year: "" });
  const [teamB, setTeamB] = useState({ team: "", year: "" });

  const handleSelectTeamA = ({ team, year }: any) => {
    setTeamA({ team, year });
    if (gameResults.teamAScore && gameResults.teamBScore) {
      setGameResults({ teamAScore: null, teamBScore: null });
    }
  };

  const handleSelectTeamB = ({ team, year }: any) => {
    setTeamB({ team, year });
    if (gameResults.teamAScore && gameResults.teamBScore) {
      setGameResults({ teamAScore: null, teamBScore: null });
    }
  };

  const handleSimulateGame = async () => {
    if (teamA.team && teamA.year && teamB.team && teamB.year) {
      const statsTeamA = await fetchTeamRatings(teamA.year, teamA.team);
      const statsTeamB = await fetchTeamRatings(teamB.year, teamB.team);
      const gamesA = await fetch(
        `/api/games?year=${teamA.year}&team=${teamA.team}`
      );
      const gameDataA = await gamesA.json();
      const gamesB = await fetch(
        `/api/games?year=${teamB.year}&team=${teamB.team}`
      );
      const gameDataB = await gamesB.json();
      const avgScoresA = calculateAverageScores(gameDataA, teamA.team);
      const avgScoresB = calculateAverageScores(gameDataB, teamB.team);

      if (statsTeamA && statsTeamB && avgScoresA && avgScoresB) {
        const comparisonResult = compareTeams(
          statsTeamA[0],
          statsTeamB[0],
          avgScoresA.averagePointsScored,
          avgScoresB.averagePointsScored,
          avgScoresA.averagePointsAllowed,
          avgScoresB.averagePointsAllowed
        );
        setGameResults(comparisonResult);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Game Simulation Model
        </h1>
        <p className="text-gray-800">
          Simulate a game between any two teams from any two seasons.
        </p>
      </div>
      {teams.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="grid md:grid-cols-2 w-full gap-4 md:gap-8 relative">
            {teamA.team !== "" && teamB.team !== "" && (
              <div
                className="hidden md:flex text-lg md:text-4xl text-gray-600 font-semibold items-center justify-center rounded-full border-gray-600 border-4 bg-white text-dark-800 absolute inset-x-0	inset-y-0	z-50 m-auto w-16 h-16 md:w-32 md:h-32"
                style={{ bottom: "-15%" }}
              >
                VS
              </div>
            )}
            <div className="z-40">
              <TeamForCompare teams={teams} onSelectTeam={handleSelectTeamA} />
            </div>
            <div
              className="justify-self-center flex md:hidden text-lg md:text-4xl text-gray-600 font-semibold items-center justify-center rounded-full border-gray-600 border-4 bg-white text-dark-800 w-16 h-16"
              style={{ bottom: "-15%" }}
            >
              VS
            </div>
            <div className="z-30">
              <TeamForCompare teams={teams} onSelectTeam={handleSelectTeamB} />
            </div>
          </div>
          {teamA.team !== "" && teamB.team !== "" && (
            <button
              className="w-full md:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 self-center rounded transition-all duration-100"
              onClick={handleSimulateGame}
            >
              Simulate Game
            </button>
          )}
        </div>
      )}
      {gameResults.teamAScore && gameResults.teamBScore && (
        <div
          id="gameResults"
          ref={gameResultsRef}
          className="flex flex-col gap-2 w-full pt-8"
        >
          <label className="font-semibold text-gray-600">Game Results</label>
          <div className="grid grid-cols-2 w-full gap-4 md:gap-8">
            <TeamCard
              team={teams.find((team) => team.school === teamA.team)}
              score={gameResults.teamAScore}
            />
            <TeamCard
              team={teams.find((team) => team.school === teamB.team)}
              score={gameResults.teamBScore}
              reverse
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
