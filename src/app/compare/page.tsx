"use client";
import { useEffect, useState } from "react";
import SeasonSelect from "../components/SeasonSelect";
import TeamHero from "../components/TeamHero";
import TeamSelect from "../components/TeamSelect";
import { teamStadiumImages } from "../teamStadiumImages";

interface YearOption {
  label: string;
  value: string;
}

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
        <div className="hidden md:block">
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
  const [data, setData] = useState([]);

  useEffect(() => {
    handleGetTeams();
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

  const [teamA, setTeamA] = useState({ team: null, year: null });
  const [teamB, setTeamB] = useState({ team: null, year: null });

  const handleSelectTeamA = ({ team, year }: any) => {
    // const foundTeam = teams.find((team: any) => team === team);
    setTeamA({ team, year });
  };

  const handleSelectTeamB = ({ team, year }: any) => {
    // const foundTeam = teams.find((team: any) => team === team);
    setTeamB({ team, year });
  };

  const handleSimulateGame = async () => {
    console.log(
      "Simulating game between",
      teamA.year,
      teamA.team,
      "and",
      teamB.year,
      teamB.team
    );
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
            {teamA.team !== null && teamB.team !== null && (
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
          {teamA.team !== null && teamB.team !== null && (
            <button
              className="w-full md:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 self-center rounded transition-all duration-100"
              onClick={handleSimulateGame}
            >
              Simulate Game
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Compare;
