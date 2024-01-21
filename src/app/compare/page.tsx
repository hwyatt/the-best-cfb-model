"use client";
import { useEffect, useState } from "react";
import SeasonSelect from "../components/SeasonSelect";
import TeamHero from "../components/TeamHero";
import TeamSelect from "../components/TeamSelect";
import { teamStadiumImages } from "../teams";

interface YearOption {
  label: string;
  value: string;
}

const Compare = (data: any) => {
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

  const teams = data?.data.map((team: any) => ({
    ...team,
    stadiumImg:
      teamStadiumImages.find(
        (teamStadium) =>
          teamStadium.id === team.id && teamStadium.school === team.school
      )?.stadiumImg || null,
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

  const handleSelect = async (selectedOption: any) => {
    const selectedTeamName = selectedOption.value;
    const foundTeam = teams.find(
      (team: any) => team.school === selectedTeamName
    );
    setSelectedTeam(foundTeam);
  };

  const [year, setYear] = useState("");
  const [yearOpts, setYearOpts] = useState<YearOption[]>([]);

  const handleYearChange = async (year: any) => {
    setYear(year.value);
  };

  return (
    <div className="grid md:grid-cols-2 m-8 w-full gap-8">
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
          <label className="font-semibold text-gray-600">Select a Season</label>
          <SeasonSelect
            yearOpts={yearOpts}
            year={year}
            handleYearChange={handleYearChange}
          />
        </div>
        {selectedTeam && <TeamHero selectedTeam={selectedTeam} />}
      </div>
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
          <label className="font-semibold text-gray-600">Select a Season</label>
          <SeasonSelect
            yearOpts={yearOpts}
            year={year}
            handleYearChange={handleYearChange}
          />
        </div>
        {selectedTeam && <TeamHero selectedTeam={selectedTeam} />}
      </div>
    </div>
  );
};

export default Compare;
