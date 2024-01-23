"use client";

import { useState, useId, useEffect } from "react";
import { GiAmericanFootballHelmet } from "react-icons/gi";
import { teamStadiumImages } from "../teamStadiumImages";
import TeamSelect from "../components/TeamSelect";
import TeamHero from "../components/TeamHero";
import TeamImg from "../components/TeamImg";
import SeasonSelect from "../components/SeasonSelect";
import { useSearchParams } from "next/navigation";

interface YearOption {
  label: string;
  value: string;
}

export default function Team() {
  const searchParams = useSearchParams();
  const teamParam = searchParams.get("team");

  const [data, setData] = useState([]);
  const [games, setGames] = useState<any[]>();
  const [stats, setStats] = useState();
  const [gamesLoading, setGamesLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [year, setYear] = useState("");
  const [yearOpts, setYearOpts] = useState<YearOption[]>([]);

  useEffect(() => {
    handleGetTeams();

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    // If we are not yet in August of the current year, set the current football year to the previous year
    const currentYear =
      currentMonth >= 7
        ? currentDate.getFullYear()
        : currentDate.getFullYear() - 1;

    setYear(currentYear.toString());

    const years = Array.from(
      { length: 100 },
      (_, index) => currentYear - index
    );
    const formattedYears = years.map((year) => ({
      value: year.toString(),
      label: year.toString(),
    }));

    setYearOpts(formattedYears);
  }, []);

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

  useEffect(() => {
    if (data.length > 0) {
      const teamFromParam =
        teamParam !== null && teams.find((team) => team.school === teamParam);
      if (teamFromParam) {
        setSelectedTeam(teamFromParam);
        handleSelect({
          option: teamFromParam.school,
          value: teamFromParam.school,
        });
      }
    }
  }, [data]);

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

  const handleSelect = async (selectedOption: any) => {
    setGamesLoading(true);
    const selectedTeamName = selectedOption.value;
    const foundTeam = teams.find(
      (team: any) => team.school === selectedTeamName
    );
    setSelectedTeam(foundTeam);
    const getRoster = await fetch(
      `/api/roster?${
        foundTeam.school && `team=${foundTeam.school}&`
      }year=${year}`
    );
    const roster = await getRoster.json();

    const getGames = await fetch(
      `/api/games?year=${year}&${
        foundTeam.school && `team=${foundTeam.school}`
      }`
    );

    const games = await getGames.json();

    setGames(games);
    setGamesLoading(false);

    setStatsLoading(true);
    const getStats = await fetch(
      `/api/stats?year=${year}&${
        foundTeam.school && `team=${foundTeam.school}`
      }`
    );

    const stats = await getStats.json();

    setStats(stats);
    setStatsLoading(false);
  };

  const handleYearChange = async (year: any) => {
    setYear(year.value);
    setGamesLoading(true);
    const getGames = await fetch(
      `/api/games?year=${year.value}&${
        selectedTeam.school && `team=${selectedTeam.school}`
      }`
    );
    const games = await getGames.json();

    setGames(games);
    setGamesLoading(false);

    setStatsLoading(true);
    const getStats = await fetch(
      `/api/stats?year=${year.value}&${
        selectedTeam.school && `team=${selectedTeam.school}`
      }`
    );

    const stats = await getStats.json();

    setStats(stats);
    setStatsLoading(false);
  };

  const getOpponentImage = (name: string) => {
    const oppponent = teams.find((team: any) => team.school === name);
    return oppponent?.logos[0];
  };

  const getOpponentColor = (name: string) => {
    const oppponent = teams.find((team: any) => team.school === name);
    return oppponent?.color;
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Team Stats</h1>
        <p className="text-gray-800">
          See stats, schedule, and more for a team any given season.
        </p>
      </div>
      <div className="flex flex-col gap-2 md:max-w-md">
        <label className="font-semibold text-gray-600">
          Select or Search a Team
        </label>
        <TeamSelect
          teams={teams}
          selectedTeam={selectedTeam}
          handleSelect={handleSelect}
        />
      </div>
      {selectedTeam && selectedTeam.id && (
        <div className="flex flex-col gap-2 justify-center">
          <TeamHero selectedTeam={selectedTeam} />
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b-2 border-gray-400 gap-4 mb-4">
              <div>
                <h2 className="text-4xl font-bold text-gray-800">
                  {selectedTeam.school} {selectedTeam.mascot}
                </h2>
                <p className="uppercase text-gray-600">
                  {selectedTeam.conference}{" "}
                  {selectedTeam.division && selectedTeam.division}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-48">
                <label className="font-semibold text-gray-600">Season</label>
                <SeasonSelect
                  yearOpts={yearOpts}
                  year={year}
                  handleYearChange={handleYearChange}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4">
              {games && !gamesLoading && (
                <>
                  <div className="flex gap-2">
                    <p className="text-lg font-semibold text-gray-600">
                      Schedule
                    </p>
                  </div>
                  <ol
                    className="flex justify-between gap-6 pb-8 overflow-x-auto"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "lightgray transparent",
                    }}
                  >
                    {games?.map((game: any) => {
                      const opponentName =
                        game.away_team !== selectedTeam.school
                          ? game.away_team
                          : game.home_team;

                      const opponentImg = getOpponentImage(opponentName);

                      const opponentColor = getOpponentColor(opponentName);

                      const isHomeTeam = game.home_team === selectedTeam.school;

                      const score = `${game.home_points} - ${game.away_points}`;

                      const wonGame =
                        (isHomeTeam && game.home_points > game.away_points) ||
                        (!isHomeTeam && game.away_points > game.home_points);

                      const startDate = new Date(game.start_date);

                      const month = startDate.getMonth() + 1;
                      const day = startDate.getDate();
                      const year = startDate.getFullYear();
                      const formattedDate = `${month}/${day}/${year}`;

                      return (
                        <li
                          key={game.id}
                          className="text-sm font-semibold text-gray-600 w-32 max-w-32 max-h-52"
                          style={{
                            flex: "0 0 auto",
                          }}
                        >
                          <div className="flex flex-col items-center text-center h-full">
                            <TeamImg
                              src={opponentImg}
                              className="w-24 h-auto mb-2"
                              fallback={
                                <div className="w-24 h-auto mb-2">
                                  <GiAmericanFootballHelmet
                                    className="w-full h-auto"
                                    style={{
                                      fill: opponentColor,
                                    }}
                                  />
                                </div>
                              }
                            />
                            <p className="text-xs font-semibold text-gray-400">
                              {isHomeTeam || game.neutral_site ? "VS" : "AT"}
                            </p>
                            <p className="font-semibold text-gray-600">
                              {opponentName}
                            </p>
                            <p className="text-xs font-semibold text-gray-400 mb-2">
                              {formattedDate}
                            </p>
                            <p
                              className={`mt-auto font-bold text-xl ${
                                wonGame ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {score}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </>
              )}
            </div>
            {/* {stats && !statsLoading && (
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <p className="text-lg font-semibold text-gray-600">Stats</p>
                </div>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                  {stats.map((stat: any) => {
                    console.log(stat);
                    return (
                      <div
                        className="flex flex-col items-center p-4 bg-white rounded-md shadow-md"
                        key={stat.statName}
                      >
                        <p className="text-4xl font-bold mb-4">
                          {stat.statValue}
                        </p>
                        <p className="capitalize font-semibold text-gray-600">
                          {stat.statName.split(/(?=[A-Z])/)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
}
