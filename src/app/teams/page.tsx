"use client";

import { useState, useId, useEffect } from "react";
import { GiAmericanFootballHelmet } from "react-icons/gi";
import { teamStadiumImages } from "../teamStadiumImages";
import TeamSelect from "../components/TeamSelect";
import TeamHero from "../components/TeamHero";
import TeamImg from "../components/TeamImg";
import SeasonSelect from "../components/SeasonSelect";
import { useSearchParams } from "next/navigation";
import { stat } from "fs";
import DataTable from "react-data-table-component";

interface YearOption {
  label: string;
  value: string;
}
export default function Team() {
  const searchParams = useSearchParams();
  const teamParam = searchParams.get("team");

  const [data, setData] = useState([]);
  const [games, setGames] = useState<any[]>();
  const [stats, setStats] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [year, setYear] = useState<null | string>(null);
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
    handleGetStats(currentYear);
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
    // Build the new URL with the team query parameter
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    url.searchParams.set("team", selectedTeamName);

    // Update the URL
    window.history.replaceState({}, "", url.toString());

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
    handleGetStats(year);
  };

  const handleGetStats = async (currentYear: any) => {
    setStatsLoading(true);

    let url = `/api/stats`;

    if (year !== null) {
      url += `?year=${year}`;
    } else {
      url += `?year=${currentYear}`;
    }

    if (selectedTeam.school) {
      url += `${year !== null ? "&" : "?"}team=${selectedTeam.school}`;
    }

    const getStats = await fetch(url);
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

    handleGetStats(year);
  };

  const getOpponentImage = (name: string) => {
    const oppponent = teams.find((team: any) => team.school === name);
    return oppponent?.logos[0];
  };

  const getOpponentColor = (name: string) => {
    const oppponent = teams.find((team: any) => team.school === name);
    return oppponent?.color;
  };

  const teamCol = (row: any) => {
    const matchingTeam = teams.find((team) => team?.school === row.team);
    const teamLogo = matchingTeam?.logos?.[0];

    return (
      <div className="flex items-center gap-2">
        <div>
          {teamLogo ? (
            <img
              src={teamLogo}
              alt="Team Logo"
              style={{ width: "40px", height: "40px", minWidth: "40px" }}
            />
          ) : (
            <GiAmericanFootballHelmet />
          )}
        </div>
        <span className="font-semibold uppercase text-gray-800">
          {row.team}
        </span>
      </div>
    );
  };

  const sortByPPO = (data: any) => {
    return data.sort((a: any, b: any) => {
      return b.offense.pointsPerOpportunity - a.offense.pointsPerOpportunity;
    });
  };

  const columnsOffensePPO = [
    // {
    //   name: "",
    //   selector: (row: any, index: any) => index + 1,
    // },
    {
      name: "Team",
      minWidth: "20%",
      cell: (row: any) => teamCol(row),
    },
    {
      name: "PPO",
      selector: (row: any) => row.offense.pointsPerOpportunity.toFixed(3),
    },
    {
      name: "PPA",
      selector: (row: any) => row.offense.ppa.toFixed(3),
    },
    {
      name: "Success Rate",
      selector: (row: any) => row.offense.successRate.toFixed(3),
    },
    {
      name: "Explosiveness",
      selector: (row: any) => row.offense.explosiveness.toFixed(3),
    },
    {
      name: "Plays",
      selector: (row: any) => row.offense.plays,
    },
    {
      name: "Drives",
      selector: (row: any) => row.offense.drives,
    },
  ];

  const sortByRushing = (data: any) => {
    return data.sort((a: any, b: any) => {
      return b.offense.rushingPlays.ppa - a.offense.rushingPlays.ppa;
    });
  };

  const columnsRushing = [
    {
      name: "Team",
      cell: (row: any) => teamCol(row),
      minWidth: "20%",
    },
    {
      name: "PPA",
      selector: (row: any) => row.offense.rushingPlays.ppa.toFixed(3),
    },
    {
      name: "Success Rate",
      selector: (row: any) => row.offense.rushingPlays.successRate.toFixed(3),
    },
    {
      name: "Explosiveness",
      selector: (row: any) => row.offense.rushingPlays.explosiveness.toFixed(3),
    },
    // {
    //   name: "Power Success",
    //   selector: (row: any) => row.offense.powerSuccess,
    // },
    // {
    //   name: "Stuff Rate",
    //   selector: (row: any) => row.offense.stuffRate,
    // },
    // {
    //   name: "Line Yards per Rush",
    //   selector: (row: any) => row.offense.lineYards.toFixed(3),
    // },
    // {
    //   name: "Second Level Yards per Rush",
    //   selector: (row: any) => row.offense.secondLevelYards.toFixed(3),
    // },
    // {
    //   name: "Open Field Yards per Rush",
    //   selector: (row: any) => row.offense.openFieldYards.toFixed(3),
    // },
  ];

  const sortByPassing = (data: any) => {
    return data.sort((a: any, b: any) => {
      return b.offense.passingPlays.ppa - a.offense.passingPlays.ppa;
    });
  };

  const columnsPassing = [
    {
      name: "Team",
      cell: (row: any) => teamCol(row),
      minWidth: "20%",
    },
    {
      name: "PPA",
      selector: (row: any) => row.offense.passingPlays.ppa.toFixed(3),
    },
    {
      name: "Success Rate",
      selector: (row: any) => row.offense.passingPlays.successRate.toFixed(3),
    },
    {
      name: "Explosiveness",
      selector: (row: any) => row.offense.passingPlays.explosiveness.toFixed(3),
    },
  ];

  const sortByDefense = (data: any) => {
    return data.sort((a: any, b: any) => {
      return b.defense.havoc.total - a.defense.havoc.total;
    });
  };

  const columnsDefense = [
    {
      name: "Team",
      cell: (row: any) => teamCol(row),
      minWidth: "20%",
    },
    {
      name: "PPO",
      selector: (row: any) => row.defense.pointsPerOpportunity.toFixed(3),
    },
    {
      name: "PPA",
      selector: (row: any) => row.defense.ppa.toFixed(3),
    },
    {
      name: "Success Rate",
      selector: (row: any) => row.defense.successRate.toFixed(3),
    },
    {
      name: "Explosiveness",
      selector: (row: any) => row.defense.explosiveness.toFixed(3),
    },
    {
      name: "Plays",
      selector: (row: any) => row.defense.plays,
    },
    {
      name: "Drives",
      selector: (row: any) => row.defense.drives,
    },
  ];

  const sortByFieldPos = (data: any) => {
    return data.sort((a: any, b: any) => {
      return (
        a.offense.fieldPosition.averageStart -
        b.offense.fieldPosition.averageStart
      );
    });
  };

  const columnsFieldPos = [
    {
      name: "Team",
      cell: (row: any) => teamCol(row),
      minWidth: "20%",
    },
    {
      name: "Offense Avg Start",
      selector: (row: any) => row.offense.fieldPosition.averageStart.toFixed(1),
    },
    {
      name: "Offense Avg Predicted Points",
      selector: (row: any) =>
        row.offense.fieldPosition.averagePredictedPoints.toFixed(3),
    },
    {
      name: "Defense Avg Start",
      selector: (row: any) => row.defense.fieldPosition.averageStart.toFixed(3),
    },
    {
      name: "Defense Avg Predicted Points",
      selector: (row: any) =>
        row.defense.fieldPosition.averagePredictedPoints.toFixed(3),
    },
  ];

  const [activeTab, setActiveTab] = useState("offensePPO");

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
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
        <label className="font-semibold text-gray-600">Select a Team</label>
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
          </div>
        </div>
      )}
      {stats.length === 0 || statsLoading ? (
        <div>Loading Stats...</div>
      ) : (
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-600">Select a Stat</label>
          <div className="flex flex-col md:flex-row gap-2">
            <button
              className={`${
                activeTab === "offensePPO"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-transparent hover:bg-gray-300 text-gray-600"
              } w-full md:w-auto font-semibold py-2 px-4 rounded self-end transition-all duration-100`}
              onClick={() => handleTabChange("offensePPO")}
            >
              Offense
            </button>
            <button
              className={`${
                activeTab === "Passing"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-transparent hover:bg-gray-300 text-gray-600"
              } w-full md:w-auto font-semibold py-2 px-4 rounded self-end transition-all duration-100`}
              onClick={() => handleTabChange("Passing")}
            >
              Passing
            </button>
            <button
              className={`${
                activeTab === "Rushing"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-transparent hover:bg-gray-300 text-gray-600"
              } w-full md:w-auto font-semibold py-2 px-4 rounded self-end transition-all duration-100`}
              onClick={() => handleTabChange("Rushing")}
            >
              Rushing
            </button>
            <button
              className={`${
                activeTab === "Defense"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-transparent hover:bg-gray-300 text-gray-600"
              } w-full md:w-auto font-semibold py-2 px-4 rounded self-end transition-all duration-100`}
              onClick={() => handleTabChange("Defense")}
            >
              Defense
            </button>
            <button
              className={`${
                activeTab === "FieldPos"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-transparent hover:bg-gray-300 text-gray-600"
              } w-full md:w-auto font-semibold py-2 px-4 rounded self-end transition-all duration-100`}
              onClick={() => handleTabChange("FieldPos")}
            >
              Field Position
            </button>
          </div>
          <div>
            {stats && activeTab === "offensePPO" && (
              <DataTable
                data={sortByPPO(stats)}
                columns={columnsOffensePPO}
                pagination
              />
            )}
            {stats && activeTab === "Passing" && (
              <DataTable
                data={sortByPassing(stats)}
                columns={columnsPassing}
                pagination
              />
            )}
            {stats && activeTab === "Rushing" && (
              <DataTable
                data={sortByRushing(stats)}
                columns={columnsRushing}
                pagination
              />
            )}
            {stats && activeTab === "Defense" && (
              <DataTable
                data={sortByDefense(stats)}
                columns={columnsDefense}
                pagination
              />
            )}
            {stats && activeTab === "FieldPos" && (
              <DataTable
                data={sortByFieldPos(stats)}
                columns={columnsFieldPos}
                pagination
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
