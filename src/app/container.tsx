"use client";

import { useState, useId, useEffect } from "react";
import Select, { components } from "react-select";
import { GiAmericanFootballHelmet } from "react-icons/gi";
import { teamStadiumImages } from "./teams";

interface YearOption {
  label: string;
  value: string;
}

const Option = (props: any) => (
  <components.Option {...props}>
    <div className="flex gap-2">
      <img src={props.data.icon} alt="logo" className="w-6 h-auto" />
      {props.data.label}
    </div>
  </components.Option>
);

const SingleValue = (props: any) => (
  <components.SingleValue {...props}>
    <div className="flex gap-2">
      <img src={props.data.icon} alt="logo" className="w-6 h-auto" />
      {props.data.label}
    </div>
  </components.SingleValue>
);

const TeamImg = (props: any) => {
  const { fallback = null, ...imgProps } = props;
  const [isBroken, setIsBroken] = useState(false);

  function handleError() {
    setIsBroken(true);
  }

  return (
    <>
      {imgProps.src && !isBroken ? (
        <img onError={handleError} {...imgProps} />
      ) : (
        fallback
      )}
    </>
  );
};

export default function Container(data: any) {
  const teams = data.data.map((team: any) => ({
    ...team,
    stadiumImg:
      teamStadiumImages.find(
        (teamStadium) =>
          teamStadium.id === team.id && teamStadium.school === team.school
      )?.stadiumImg || null,
  }));

  const options = teams.map((team: any) => ({
    value: team.school,
    label: team.school,
    icon: team?.logos?.[0] || null,
  }));

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
  const [games, setGames] = useState<any[]>();
  const [stats, setStats] = useState();
  const [gamesLoading, setGamesLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [year, setYear] = useState("");
  const [yearOpts, setYearOpts] = useState<YearOption[]>([]);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // January is 0, December is 11

    // If we are not yet in August of the current year, set the current football year to the previous year
    const currentYear =
      currentMonth >= 7
        ? currentDate.getFullYear()
        : currentDate.getFullYear() - 1;

    setYear(currentYear.toString());

    // Generate options for the last 100 years
    const years = Array.from(
      { length: 100 },
      (_, index) => currentYear - index
    );
    const formattedYears = years.map((year) => ({
      value: year.toString(),
      label: year.toString(),
    }));

    // Set the options in the state
    setYearOpts(formattedYears);
  }, []);

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
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-600">
          Select or Search a Team
        </label>
        <Select
          value={options.find(
            (option: any) =>
              option.value === (selectedTeam && selectedTeam.school)
          )}
          onChange={handleSelect}
          options={options}
          instanceId={useId()}
          className="z-30"
          components={{
            Option: Option,
            SingleValue: SingleValue,
          }}
        />
      </div>
      {selectedTeam && selectedTeam.id && (
        <div className="flex flex-col gap-2 justify-center">
          <div className="relative w-full h-96 mb-4">
            <div className="team-hero flex justify-center items-center w-full h-full p-12 md:p-24 relative">
              {/* <img
                                src={selectedTeam.logos[0]}
                                className="w-auto h-full object-contain z-20 p-4"
                                style={{
                                    backgroundColor: selectedTeam.alt_color,
                                }}
                                alt="Team Logo"
                            /> */}
              <TeamImg
                src={selectedTeam.logos[0]}
                className="w-auto h-full object-contain z-20 p-4"
                style={{
                  backgroundColor: selectedTeam.alt_color,
                }}
                alt="Team Logo"
              />
            </div>
            <div
              className={`absolute top-0 left-0 w-full h-full`}
              style={{
                backgroundColor: selectedTeam.color
                  ? selectedTeam.color
                  : "bg-gray-400",
              }}
            >
              <div
                className="bg-cover w-full h-full absolute top-0 left-0 z-10"
                style={{
                  backgroundImage: selectedTeam.stadiumImg
                    ? `url(${selectedTeam.stadiumImg})`
                    : "none",
                  backgroundPosition: "center",
                  opacity: 0.2,
                }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between pb-4 border-b-2 border-gray-400 gap-4 mb-4">
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
                <Select
                  value={yearOpts.find(
                    (option) => String(option.value) === String(year)
                  )}
                  options={yearOpts}
                  onChange={handleYearChange}
                  className="z-30"
                />
              </div>
            </div>
            <div
              className="flex flex-col justify-center gap-4"
              // style={{ overflowX: "auto", whiteSpace: "nowrap" }}
            >
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
                              {isHomeTeam ? "VS" : "AT"}
                            </p>
                            <p className="font-semibold text-gray-600 mb-2">
                              {opponentName}
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
                                    <p className="text-lg font-semibold text-gray-600">
                                        Stats
                                    </p>
                                </div>
                                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                                    {stats.map((stat: any) => {
                                        console.log(stat);
                                        return (
                                            <div
                                                className="flex flex-col items-center"
                                                key={stat.statName}>
                                                <p className="text-4xl font-bold">
                                                    {stat.statValue}
                                                </p>
                                                <p className="capitalize font-semibold text-gray-600">
                                                    {stat.statName.split(
                                                        /(?=[A-Z])/
                                                    )}
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
