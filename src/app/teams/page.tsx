"use client";

import { useState, useId, useEffect } from "react";
import { teamStadiumImages } from "../teamStadiumImages";
import TeamSelect from "../components/TeamSelect";
import TeamHero from "../components/TeamHero";
import TeamImg from "../components/TeamImg";
import SeasonSelect from "../components/SeasonSelect";
import { useSearchParams } from "next/navigation";
import DataTable from "react-data-table-component";
import { ThreeDots } from "react-loader-spinner";

interface YearOption {
  label: string;
  value: string;
}

type StatDataMap = Record<string, Record<string, number | string>>;

const processStatData = <
  T extends { team: string; statName: string; statValue: number }
>(
  data: T[],
  targetStatNames: string[],
  sortCol: string
): Record<string, number | string>[] => {
  const statDataMap: StatDataMap = {};

  data.forEach((item) => {
    const { team, statName, statValue } = item;

    if (targetStatNames.includes(statName)) {
      if (!statDataMap[team]) {
        statDataMap[team] = { team };
      }

      statDataMap[team][statName] = statValue;
    }
  });

  const statDataArray = Object.values(statDataMap);

  // Sort by the specified column (or 'rank' by default)
  const sortedStatData = statDataArray.sort((a, b) => {
    return (Number(b[sortCol]) || 0) - (Number(a[sortCol]) || 0);
  });

  // Add rank property for each stat
  targetStatNames.forEach((statName) => {
    const rankProp = `rank${statName}`;

    // Sort the data again for the current statName
    const sortedStatDataForStat = statDataArray.slice().sort((a, b) => {
      return (Number(b[statName]) || 0) - (Number(a[statName]) || 0);
    });

    // Find the team in the index (+1) of the sorted array based on the current stat
    sortedStatDataForStat.forEach((item, index) => {
      const team = item.team;
      const rank = index + 1;
      sortedStatData.find((dataItem) => {
        if (dataItem.team === team) {
          dataItem[rankProp] = rank;
          return true; // Stop searching once the team is found
        }
        return false;
      });
    });
  });

  return sortedStatData;
};

const StatCard = ({ statName, statValue, statRank }: any) => (
  <div className="flex items-center justify-between gap-2 bg-white border-2 border-gray-400 rounded p-4 w-full shadow-lg">
    <div className="w-full flex gap-2 items-center flex-row-reverse justify-between">
      <div
        className={`${
          statRank <= 25
            ? `bg-green-200 border-2 border-green-600 text-green-600`
            : statRank >= 26 && statRank < 75
            ? `bg-blue-200 border-2 border-blue-600 text-blue-600`
            : statRank >= 75
            ? `bg-red-200 border-2 border-red-600 text-red-600`
            : `bg-gray-200`
        } rounded-full p-2`}
      >
        <div className="flex items-center justify-center w-8 h-8 font-semibold">
          {statRank}
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-800 font-semibold mr-1">{statValue}</p>
        <p className="text-gray-800">{statName}</p>
      </div>
    </div>
  </div>
);

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
  const [records, setRecords] = useState([]);

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
    handleGetStats();
    // handleGetRecords();
  }, []);

  const handleGetRecords = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    // If we are not yet in August of the current year, set the current football year to the previous year
    const currentYear =
      currentMonth >= 7
        ? currentDate.getFullYear()
        : currentDate.getFullYear() - 1;

    const getRecords = await fetch(
      `/api/records?year=${year !== null ? year : currentYear}`
    );
    const records = await getRecords.json();
    const conferenceRecords: any = [];

    records.forEach((team: any) => {
      const conference = team.conference;
      const totalWins = team.total.wins;
      const totalLosses = team.total.losses;
      const conferenceWins = team.conferenceGames.wins;
      const conferenceLosses = team.conferenceGames.losses;

      // Subtract conference wins/losses from total wins/losses to get non-conference wins/losses
      const nonConferenceWins = totalWins - conferenceWins;
      const nonConferenceLosses = totalLosses - conferenceLosses;

      // Aggregate the records for each conference
      if (!conferenceRecords[conference]) {
        conferenceRecords[conference] = {
          wins: nonConferenceWins,
          losses: nonConferenceLosses,
        };
      } else {
        conferenceRecords[conference].wins += nonConferenceWins;
        conferenceRecords[conference].losses += nonConferenceLosses;
      }
    });

    setRecords(conferenceRecords);
    console.log(conferenceRecords);
  };

  const handleGetStats = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    // If we are not yet in August of the current year, set the current football year to the previous year
    const currentYear =
      currentMonth >= 7
        ? currentDate.getFullYear()
        : currentDate.getFullYear() - 1;

    setStatsLoading(true);
    const getStats = await fetch(
      `/api/stats?year=${year !== null ? year : currentYear}`
    );
    const stats = await getStats.json();
    setStats(stats);
    setStatsLoading(false);
  };

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

    // const getRoster = await fetch(
    //   `/api/roster?${
    //     foundTeam.school && `team=${foundTeam.school}&`
    //   }year=${year}`
    // );
    // const roster = await getRoster.json();

    const getGames = await fetch(
      `/api/games?year=${year}&${
        foundTeam.school && `team=${foundTeam.school}`
      }`
    );
    const games = await getGames.json();
    setGames(games);
    setGamesLoading(false);

    if (stats.length === 0) {
      setStatsLoading(true);
      const getStats = await fetch(`/api/stats?year=${year}`);
      const statsRes = await getStats.json();
      setStats(statsRes);
      setStatsLoading(false);
    }
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
    const getStats = await fetch(`/api/stats?year=${year.value}`);
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

  const teamCol = (row: any, rankName: any) => {
    const matchingTeam = teams.find((team) => team?.school === row.team);
    const teamLogo = matchingTeam?.logos?.[0];

    return (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800">{row[rankName]}</span>
        <button
          onClick={() => handleSelect({ option: row.team, value: row.team })}
          className="flex items-center gap-2"
        >
          <div>
            {teamLogo ? (
              <img
                src={teamLogo}
                alt="Team Logo"
                className="w-10 h-10 min-w-10"
              />
            ) : (
              <img src={"icon.png"} className="w-10 h-10 min-w-10" />
            )}
          </div>
          <span className="font-semibold text-gray-800">{row.team}</span>
        </button>
      </div>
    );
  };

  const passingStatNames = [
    "netPassingYards",
    "passesIntercepted",
    "passingTDs",
    "passAttempts",
    "passCompletions",
  ];
  const passingData = processStatData(
    stats,
    passingStatNames,
    "netPassingYards"
  );

  const columnsPassing = [
    {
      name: "Team",
      cell: (row: any) => teamCol(row, "ranknetPassingYards"),
      minWidth: "25%",
    },
    {
      name: "Yards",
      selector: (row: any) => row.netPassingYards,
      sortable: true,
    },
    {
      name: "TDs",
      selector: (row: any) => row.passingTDs,
      sortable: true,
    },
    {
      name: "Attempts",
      selector: (row: any) => row.passAttempts,
      sortable: true,
    },
    {
      name: "Completions",
      selector: (row: any) => row.passCompletions,
      sortable: true,
    },
    {
      name: "Completion %",
      cell: (row: any) => {
        const attempts = row.passAttempts || 0;
        const completions = row.passCompletions || 0;

        if (attempts === 0) {
          return "-";
        }

        const completionPercentage =
          ((completions / attempts) * 100).toFixed(2) + "%";
        return completionPercentage;
      },
    },
    {
      name: "Interceptions",
      selector: (row: any) => row.passesIntercepted,
      sortable: true,
    },
  ];

  const rushingStatNames = ["rushingYards", "rushingTDs", "rushingAttempts"];
  const rushingData = processStatData(stats, rushingStatNames, "rushingYards");

  const columnsRushing = [
    {
      name: "Team",
      cell: (row: any) => teamCol(row, "rankrushingYards"),
      minWidth: "25%",
    },
    {
      name: "Yards",
      selector: (row: any) => row.rushingYards,
      sortable: true,
    },
    {
      name: "TDs",
      selector: (row: any) => row.rushingTDs,
      sortable: true,
    },
    {
      name: "Attempts",
      selector: (row: any) => row.rushingAttempts,
      sortable: true,
    },
    {
      name: "Yards per Attempt",
      cell: (row: any) => {
        const rushingYards = row.rushingYards || 0;
        const rushingAttempts = row.rushingAttempts || 0;

        if (rushingAttempts === 0) {
          return "-";
        }

        const yardsPerAttempt = (rushingYards / rushingAttempts).toFixed(2);
        return yardsPerAttempt;
      },
      sortable: true,
    },
  ];

  const defenseStatNames = [
    "interceptions",
    "interceptionTDs",
    "interceptionYards",
    "sacks",
    "tacklesForLoss",
  ];
  const defenseData = processStatData(stats, defenseStatNames, "interceptions");

  const columnsDefense = [
    {
      name: "Team",
      cell: (row: any) => teamCol(row, "rankinterceptions"),
      minWidth: "25%",
    },
    {
      name: "Interceptions",
      selector: (row: any) => row.interceptions,
    },
    {
      name: "Interception TDs",
      selector: (row: any) => row.interceptionTDs,
    },
    {
      name: "Interception Yards",
      selector: (row: any) => row.interceptionYards,
    },
    {
      name: "Sacks",
      selector: (row: any) => row.sacks,
    },
    {
      name: "Tackles For Loss",
      selector: (row: any) => row.tacklesForLoss,
    },
  ];

  const stStatNames = [
    "kickReturnYards",
    "kickReturnTDs",
    "kickReturns",
    "puntReturnYards",
    "puntReturnTDs",
    "puntReturns",
  ];
  const stData = processStatData(stats, stStatNames, "kickReturnYards");

  const columnsST = [
    {
      name: "Team",
      cell: (row: any) => teamCol(row, "rankkickReturnYards"),
      minWidth: "25%",
    },
    {
      name: "Kick Return Yards",
      selector: (row: any) => row.kickReturnYards,
    },
    {
      name: "Kick Return TDs",
      selector: (row: any) => row.kickReturnTDs,
    },
    {
      name: "Kick Returns",
      selector: (row: any) => row.kickReturns,
    },
    {
      name: "Punt Return Yards",
      selector: (row: any) => row.puntReturnYards,
    },
    {
      name: "Punt Return TDs",
      selector: (row: any) => row.puntReturnTDs,
    },
    {
      name: "Punt Returns",
      selector: (row: any) => row.puntReturns,
    },
  ];

  const downsStatNames = [
    "firstDowns",
    "thirdDowns",
    "thirdDownConversions",
    "fourthDowns",
    "fourthDownConversions",
  ];
  const downsData = processStatData(stats, downsStatNames, "firstDowns");

  const columnsDowns = [
    {
      name: "Team",
      cell: (row: any) => teamCol(row, "rankfirstDowns"),
      minWidth: "25%",
    },
    {
      name: "First Downs",
      selector: (row: any) => row.firstDowns,
    },
    {
      name: "Third Downs",
      selector: (row: any) => row.thirdDowns,
    },
    {
      name: "Third Down Conv",
      selector: (row: any) => row.thirdDownConversions,
    },
    {
      name: "Fourth Downs",
      selector: (row: any) => row.fourthDowns,
    },
    {
      name: "Fourth Down Conv",
      selector: (row: any) => row.fourthDownConversions,
    },
  ];

  const etcStatNames = [
    "possessionTime",
    "penalties",
    "penaltyYards",
    "fumblesLost",
    "fumblesRecovered",
    "turnovers",
  ];
  const etcData = processStatData(stats, etcStatNames, "possessionTime");

  const columnsETC = [
    {
      name: "Team",
      cell: (row: any) => teamCol(row, "rankpossessionTime"),
      minWidth: "25%",
    },
    {
      name: "Possession Time",
      selector: (row: any) => row.possessionTime,
    },
    {
      name: "Penalties",
      selector: (row: any) => row.penalties,
    },
    {
      name: "Penalty Yards",
      selector: (row: any) => row.penaltyYards,
    },
    {
      name: "Fumbles Lost",
      selector: (row: any) => row.fumblesLost,
    },
    {
      name: "Fumbles Recovered",
      selector: (row: any) => row.fumblesRecovered,
    },
    {
      name: "Turnovers",
      selector: (row: any) => row.turnovers,
    },
  ];

  const [activeTab, setActiveTab] = useState("Passing");

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Stats</h1>
        <p className="text-gray-800">
          See high level stats for every part of the game, or choose a team to
          see their stats any given season.
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
                                <div className="w-24 min-h-24 h-auto mb-2">
                                  <img
                                    src={"icon.png"}
                                    className="w-full h-auto"
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
        <div className="self-center flex flex-col gap-2 items-center justify-center">
          <ThreeDots height="80" width="80" color="#202838" />
          <span className="font-semibold">Loading Stats</span>
        </div>
      ) : selectedTeam && selectedTeam.id && !statsLoading ? (
        <div className="flex flex-col gap-4">
          <p className="text-lg font-semibold text-gray-600">Passing</p>
          <div className="">
            {passingData
              .filter((stat: any) => stat.team === selectedTeam.school)
              .map((teamPassingData: any, index: number) => {
                return (
                  <div key={index} className="grid md:grid-cols-4 gap-4 mb-4">
                    <StatCard
                      statName={"Total Yards"}
                      statValue={teamPassingData.netPassingYards}
                      statRank={teamPassingData.ranknetPassingYards}
                    />
                    <StatCard
                      statName={"Touchdowns"}
                      statValue={teamPassingData.passingTDs}
                      statRank={teamPassingData.rankpassingTDs}
                    />
                    <StatCard
                      statName={"Attempts"}
                      statValue={teamPassingData.passAttempts}
                      statRank={teamPassingData.rankpassAttempts}
                    />
                    <StatCard
                      statName={"Conversions"}
                      statValue={teamPassingData.passCompletions}
                      statRank={teamPassingData.rankpassCompletions}
                    />
                  </div>
                );
              })}
          </div>
          <p className="text-lg font-semibold text-gray-600">Rushing</p>
          <div className="">
            {rushingData
              .filter((stat: any) => stat.team === selectedTeam.school)
              .map((teamRushingData: any, index: number) => {
                return (
                  <div key={index} className="grid md:grid-cols-4 gap-4 mb-4">
                    <StatCard
                      statName={"Total Yards"}
                      statValue={teamRushingData.rushingYards}
                      statRank={teamRushingData.rankrushingYards}
                    />
                    <StatCard
                      statName={"Touchdowns"}
                      statValue={teamRushingData.rushingTDs}
                      statRank={teamRushingData.rankrushingTDs}
                    />
                    <StatCard
                      statName={"Attempts"}
                      statValue={teamRushingData.rushingAttempts}
                      statRank={teamRushingData.rankrushingAttempts}
                    />
                  </div>
                );
              })}
          </div>
          <p className="text-lg font-semibold text-gray-600">Defense</p>
          <div className="">
            {defenseData
              .filter((stat: any) => stat.team === selectedTeam.school)
              .map((teamDefenseData: any, index: number) => {
                return (
                  <div key={index} className="grid md:grid-cols-4 gap-4 mb-4">
                    <StatCard
                      statName={"Interceptions"}
                      statValue={teamDefenseData.interceptions}
                      statRank={teamDefenseData.rankinterceptions}
                    />
                    <StatCard
                      statName={"Interception Touchdowns"}
                      statValue={teamDefenseData.interceptionTDs}
                      statRank={teamDefenseData.rankinterceptionTDs}
                    />
                    <StatCard
                      statName={"Sacks"}
                      statValue={teamDefenseData.sacks}
                      statRank={teamDefenseData.ranksacks}
                    />
                    <StatCard
                      statName={"Tackles for Loss"}
                      statValue={teamDefenseData.tacklesForLoss}
                      statRank={teamDefenseData.ranktacklesForLoss}
                    />
                  </div>
                );
              })}
          </div>
          <p className="text-lg font-semibold text-gray-600">Special Teams</p>
          <div className="">
            {stData
              .filter((stat: any) => stat.team === selectedTeam.school)
              .map((teamSTData: any, index: number) => {
                return (
                  <div key={index} className="grid md:grid-cols-4 gap-4 mb-4">
                    <StatCard
                      statName={"Kick Return Yards"}
                      statValue={teamSTData.kickReturnYards}
                      statRank={teamSTData.rankkickReturnYards}
                    />
                    <StatCard
                      statName={"Kick Return Touchdowns"}
                      statValue={teamSTData.kickReturnTDs}
                      statRank={teamSTData.rankkickReturnTDs}
                    />

                    <StatCard
                      statName={"Punt Return Yards"}
                      statValue={teamSTData.puntReturnYards}
                      statRank={teamSTData.rankpuntReturnYards}
                    />
                    <StatCard
                      statName={"Punt Return Touchdowns"}
                      statValue={teamSTData.puntReturnTDs}
                      statRank={teamSTData.rankpuntReturnTDs}
                    />
                  </div>
                );
              })}
          </div>
          <p className="text-lg font-semibold text-gray-600">Downs</p>
          <div className="">
            {downsData
              .filter((stat: any) => stat.team === selectedTeam.school)
              .map((teamDownsData: any, index: number) => {
                return (
                  <div key={index} className="grid md:grid-cols-4 gap-4 mb-4">
                    <StatCard
                      statName={"Third Downs"}
                      statValue={teamDownsData.thirdDowns}
                      statRank={teamDownsData.rankthirdDowns}
                    />
                    <StatCard
                      statName={"Third Down Conversions"}
                      statValue={teamDownsData.thirdDownConversions}
                      statRank={teamDownsData.rankthirdDownConversions}
                    />

                    <StatCard
                      statName={"Fourth Downs"}
                      statValue={teamDownsData.fourthDowns}
                      statRank={teamDownsData.rankfourthDowns}
                    />
                    <StatCard
                      statName={"Fourth Down Conversions"}
                      statValue={teamDownsData.fourthDownConversions}
                      statRank={teamDownsData.rankfourthDownConversions}
                    />
                  </div>
                );
              })}
          </div>
          <p className="text-lg font-semibold text-gray-600">Etc</p>
          <div className="">
            {etcData
              .filter((stat: any) => stat.team === selectedTeam.school)
              .map((teamETCData: any, index: number) => {
                return (
                  <div key={index} className="grid md:grid-cols-4 gap-4 mb-4">
                    <StatCard
                      statName={"Possession Time"}
                      statValue={teamETCData.possessionTime}
                      statRank={teamETCData.rankpossessionTime}
                    />
                    <StatCard
                      statName={"Penalties"}
                      statValue={teamETCData.penalties}
                      statRank={teamETCData.rankpenalties}
                    />

                    <StatCard
                      statName={"Penalty Yards"}
                      statValue={teamETCData.penaltyYards}
                      statRank={teamETCData.rankpenaltyYards}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-600">Select a Stat</label>
          <div className="flex flex-col md:flex-row gap-2">
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
                activeTab === "Special Teams"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-transparent hover:bg-gray-300 text-gray-600"
              } w-full md:w-auto font-semibold py-2 px-4 rounded self-end transition-all duration-100`}
              onClick={() => handleTabChange("Special Teams")}
            >
              Special Teams
            </button>
            <button
              className={`${
                activeTab === "Downs"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-transparent hover:bg-gray-300 text-gray-600"
              } w-full md:w-auto font-semibold py-2 px-4 rounded self-end transition-all duration-100`}
              onClick={() => handleTabChange("Downs")}
            >
              Downs
            </button>
            <button
              className={`${
                activeTab === "Etc"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-transparent hover:bg-gray-300 text-gray-600"
              } w-full md:w-auto font-semibold py-2 px-4 rounded self-end transition-all duration-100`}
              onClick={() => handleTabChange("Etc")}
            >
              Etc
            </button>
            {/* <button
              className={`${
                activeTab === "FieldPos"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-transparent hover:bg-gray-300 text-gray-600"
              } w-full md:w-auto font-semibold py-2 px-4 rounded self-end transition-all duration-100`}
              onClick={() => handleTabChange("FieldPos")}
            >
              Field Position
            </button> */}
          </div>
          <div>
            {stats && activeTab === "Passing" && (
              <DataTable
                data={passingData}
                columns={columnsPassing}
                pagination
              />
            )}
            {stats && activeTab === "Rushing" && (
              <DataTable
                data={rushingData}
                columns={columnsRushing}
                pagination
              />
            )}
            {stats && activeTab === "Defense" && (
              <DataTable
                data={defenseData}
                columns={columnsDefense}
                pagination
              />
            )}
            {stats && activeTab === "Special Teams" && (
              <DataTable data={stData} columns={columnsST} pagination />
            )}
            {stats && activeTab === "Downs" && (
              <DataTable data={downsData} columns={columnsDowns} pagination />
            )}
            {stats && activeTab === "Etc" && (
              <DataTable data={etcData} columns={columnsETC} pagination />
            )}
          </div>
        </div>
      )}
      {/* {records && <div>Conf Records</div>} */}
    </div>
  );
}
