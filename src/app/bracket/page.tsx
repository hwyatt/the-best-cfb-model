"use client";
import { useEffect, useId, useState } from "react";
import Select, { components } from "react-select";

const Option = (props: any) => (
  <components.Option {...props}>
    <div className="flex gap-2">
      <img src={props.data.icon} alt="logo" className="w-6 h-auto" />
      {props.data.label}
    </div>
  </components.Option>
);

const MultiValue = (props: any) => (
  <components.MultiValue {...props}>
    <div className="flex gap-2 font-semibold">
      <img src={props.data.icon} alt="logo" className="w-6 h-auto" />
      {props.data.label}
    </div>
  </components.MultiValue>
);

export function TeamSelectMulti({
  teams,
  selectedTeam,
  handleSelect,
  playoffTeams,
}: any) {
  const options = teams?.map((team: any) => ({
    value: team.school,
    label: team.school,
    icon: team?.logos?.[0] || null,
  }));

  return (
    <Select
      value={options?.find(
        (option: any) => option.value === (selectedTeam && selectedTeam.school)
      )}
      isOptionDisabled={() => playoffTeams.length == 12}
      isMulti
      onChange={handleSelect}
      options={options}
      instanceId={useId()}
      className="z-30"
      components={{
        Option: Option,
        MultiValue: MultiValue,
      }}
    />
  );
}

export default function Bracket() {
  const [data, setData] = useState([
    {
      id: null,
      school: "",
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
    },
  ]);
  const [playoffTeams, setPlayoffTeams] = useState([
    {
      id: null,
      school: "",
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
      logos: [],
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
    },
  ]);

  useEffect(() => {
    handleGetTeams();
  }, []);

  const handleGetTeams = async () => {
    const getTeams = await fetch(`/api/teams`);
    const teams = await getTeams.json();
    setData(teams);
  };

  const teams = data;

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
    logos: [],
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
    const filteredTeams = selectedOption.map((opt: any) => {
      return teams.find((team) => team?.school === opt.value);
    });
    setPlayoffTeams(filteredTeams);
  };

  // return (
  //   <div className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-200">
  //     <div className="grid md:grid-cols-4 w-full gap-4">
  //       <div className="flex flex-col gap-4">
  //         <div className="bg-purple-300">8</div>
  //         <div className="bg-purple-300">9</div>
  //         <div className="bg-purple-300">5</div>
  //         <div className="bg-purple-300">12</div>
  //         <div className="bg-purple-300">6</div>
  //         <div className="bg-purple-300">11</div>
  //         <div className="bg-purple-300">7</div>
  //         <div className="bg-purple-300">10</div>
  //       </div>
  //       <div className="flex flex-col gap-4">
  //         <div className="bg-purple-300">1</div>
  //         <div className="bg-purple-300">-</div>
  //         <div className="bg-purple-300">4</div>
  //         <div className="bg-purple-300">-</div>
  //         <div className="bg-purple-300">3</div>
  //         <div className="bg-purple-300">-</div>
  //         <div className="bg-purple-300">2</div>
  //         <div className="bg-purple-300">-</div>
  //       </div>
  //       <div className="flex flex-col gap-4">
  //         <div className="bg-purple-300">-</div>
  //         <div className="bg-purple-300">-</div>
  //         <div className="bg-purple-300">-</div>
  //         <div className="bg-purple-300">-</div>
  //       </div>
  //       <div className="flex flex-col gap-4">
  //         <div className="bg-purple-300">-</div>
  //         <div className="bg-purple-300">-</div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-gray-800">
          CFP Bracket Builder
        </h1>
        <p className="text-gray-800">
          Choose top 12 teams, then move them along your bracket.
        </p>
      </div>
      <div className="flex flex-col gap-2 md:max-w-3xl">
        <label className="font-semibold text-gray-600">Select 12 Teams</label>
        <TeamSelectMulti
          teams={teams}
          selectedTeam={selectedTeam}
          handleSelect={handleSelect}
          playoffTeams={playoffTeams} // Pass playoffTeams prop
        />
      </div>
      {/* {playoffTeams.length > 0 &&
        playoffTeams.length <= 12 &&
        playoffTeams[0].id !== null && (
          <div className="flex flex-col gap-2 md:max-w-3xl">
            <label className="font-semibold text-gray-600">
              Reorder 12 Teams By Seed
            </label>

            <ul className="flex flex-col gap-2">
              {playoffTeams.map((team, index) => {
                if (team.id !== null) {
                  return (
                    <li key={team.id} className="flex gap-4 items-center">
                      <p className="text-4xl font-bold text-gray-800">
                        {index + 1}
                      </p>
                      <div
                        className="flex items-center max-h-16 gap-2 bg-white border-2 border-gray-600 rounded p-4 w-full"
                        style={{
                          backgroundColor: `${
                            team.color !== "#ffffff"
                              ? team.color
                              : team.alt_color
                          }`,
                        }}
                      >
                        <div className="bg-gray-200 rounded-full p-2">
                          <img
                            src={team.logos[0]}
                            alt={`${team.school} Logo`}
                            className="w-8 h-auto object-contain"
                          />
                        </div>
                        <p className="text-white font-semibold">
                          {team.school} {team.mascot}
                        </p>
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        )} */}
    </div>
  );
}
