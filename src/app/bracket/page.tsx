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

function TeamSelectMulti({
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

  const BlankTeam = ({ index, seed }: any) => (
    <div className="flex items-center justify-between max-h-16 gap-2 bg-gray-400 border-2 border-gray-600 rounded p-4 w-full shadow-md">
      <div className="flex gap-2 items-center">
        <div className="bg-gray-200 rounded-full p-2">
          <div className="flex items-center justify-center w-8 h-8 font-semibold">
            ?
          </div>
        </div>
        <p className="text-white font-semibold">
          {playoffTeams[index - 1]?.school}
        </p>
      </div>
      <p className="text-white font-semibold">{seed}</p>
    </div>
  );

  const TeamByIndex = ({ index, seed }: any) => {
    const team = playoffTeams[index - 1];

    if (!team || team.id === null) {
      // Index doesn't exist, you can return a placeholder or handle it as needed
      return <BlankTeam index={index} seed={seed} />;
    }

    return (
      <div
        className="flex items-center justify-between max-h-16 gap-2 bg-white border-2 border-gray-400 rounded p-4 w-full shadow-md"
        style={{
          backgroundColor: `${
            playoffTeams[index - 1]?.color !== "#ffffff"
              ? playoffTeams[index - 1]?.color
              : playoffTeams[index - 1]?.alt_color
          }`,
        }}
      >
        <div className="flex gap-2 items-center">
          <div className="bg-gray-200 rounded-full p-2">
            <img
              src={playoffTeams[index - 1]?.logos[0]}
              alt={`${playoffTeams[index - 1]?.school} Logo`}
              className="w-8 h-auto object-contain"
            />
          </div>

          <p className="text-white font-semibold">
            {playoffTeams[index - 1]?.school}
          </p>
        </div>
        <p className="text-white font-semibold">{seed}</p>
      </div>
    );
  };

  interface GameWinner {
    index: number | null;
    seed: number | null;
  }

  const [game1Winner, setGame1Winner] = useState<GameWinner>({
    index: null,
    seed: null,
  });
  const [game2Winner, setGame2Winner] = useState<GameWinner>({
    index: null,
    seed: null,
  });
  const [game3Winner, setGame3Winner] = useState<GameWinner>({
    index: null,
    seed: null,
  });
  const [game4Winner, setGame4Winner] = useState<GameWinner>({
    index: null,
    seed: null,
  });
  const [game5Winner, setGame5Winner] = useState<GameWinner>({
    index: null,
    seed: null,
  });
  const [game6Winner, setGame6Winner] = useState<GameWinner>({
    index: null,
    seed: null,
  });
  const [game7Winner, setGame7Winner] = useState<GameWinner>({
    index: null,
    seed: null,
  });
  const [game8Winner, setGame8Winner] = useState<GameWinner>({
    index: null,
    seed: null,
  });
  const [game9Winner, setGame9Winner] = useState<GameWinner>({
    index: null,
    seed: null,
  });
  const [game10Winner, setGame10Winner] = useState<GameWinner>({
    index: null,
    seed: null,
  });
  const [game11Winner, setGame11Winner] = useState<GameWinner>({
    index: null,
    seed: null,
  });

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

      <div className="hidden md:grid md:grid-cols-4 w-full gap-8">
        <span className="font-semibold text-gray-600">ROUND ONE</span>
        <span className="font-semibold text-gray-600">ROUND TWO</span>
        <span className="font-semibold text-gray-600">ROUND THREE</span>
        <span className="font-semibold text-gray-600">ROUND FOUR</span>
      </div>
      <div className="grid md:grid-cols-4 w-full gap-8">
        <div className="flex flex-col gap-8 mt-12">
          <div className="flex flex-col gap-4 relative">
            {/* GAME 1 */}
            <button onClick={() => setGame1Winner({ index: 8, seed: 8 })}>
              <TeamByIndex index={8} seed={8} />
            </button>
            <button onClick={() => setGame1Winner({ index: 9, seed: 9 })}>
              <TeamByIndex index={9} seed={9} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {/* GAME 2 */}
            <button onClick={() => setGame2Winner({ index: 5, seed: 5 })}>
              <TeamByIndex index={5} seed={5} />
            </button>
            <button onClick={() => setGame2Winner({ index: 12, seed: 12 })}>
              <TeamByIndex index={12} seed={12} />{" "}
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {/* GAME 3 */}
            <button onClick={() => setGame3Winner({ index: 6, seed: 6 })}>
              <TeamByIndex index={6} seed={6} />
            </button>
            <button onClick={() => setGame3Winner({ index: 11, seed: 11 })}>
              <TeamByIndex index={11} seed={11} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {/* GAME 4 */}
            <button onClick={() => setGame4Winner({ index: 7, seed: 7 })}>
              <TeamByIndex index={7} seed={7} />
            </button>
            <button onClick={() => setGame4Winner({ index: 10, seed: 10 })}>
              <TeamByIndex index={10} seed={10} />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {/* GAME 5 */}
            <button onClick={() => setGame5Winner({ index: 1, seed: 1 })}>
              <TeamByIndex index={1} seed={1} />
            </button>
            {game1Winner.index !== null ? (
              <button
                onClick={() =>
                  setGame5Winner({
                    index: game1Winner.index,
                    seed: game1Winner.seed,
                  })
                }
              >
                <TeamByIndex
                  index={game1Winner.index}
                  seed={game1Winner.seed}
                />
              </button>
            ) : (
              <BlankTeam />
            )}
          </div>
          <div className="flex flex-col gap-4">
            {/* GAME 6 */}
            <button onClick={() => setGame6Winner({ index: 4, seed: 4 })}>
              <TeamByIndex index={4} seed={4} />
            </button>
            {game2Winner.index !== null ? (
              <button
                onClick={() =>
                  setGame6Winner({
                    index: game2Winner.index,
                    seed: game2Winner.seed,
                  })
                }
              >
                <TeamByIndex
                  index={game2Winner.index}
                  seed={game2Winner.seed}
                />
              </button>
            ) : (
              <BlankTeam />
            )}
          </div>
          <div className="flex flex-col gap-4">
            {/* GAME 7 */}
            <button onClick={() => setGame7Winner({ index: 3, seed: 3 })}>
              <TeamByIndex index={3} seed={3} />
            </button>
            {game3Winner.index !== null ? (
              <button
                onClick={() =>
                  setGame7Winner({
                    index: game3Winner.index,
                    seed: game3Winner.seed,
                  })
                }
              >
                <TeamByIndex
                  index={game3Winner.index}
                  seed={game3Winner.seed}
                />
              </button>
            ) : (
              <BlankTeam />
            )}
          </div>
          <div className="flex flex-col gap-4">
            {/* GAME 8 */}
            <button onClick={() => setGame8Winner({ index: 2, seed: 2 })}>
              <TeamByIndex index={2} seed={2} />
            </button>
            {game4Winner.index !== null ? (
              <button
                onClick={() =>
                  setGame8Winner({
                    index: game4Winner.index,
                    seed: game4Winner.seed,
                  })
                }
              >
                <TeamByIndex
                  index={game4Winner.index}
                  seed={game4Winner.seed}
                />
              </button>
            ) : (
              <BlankTeam />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-24 mt-8">
          <div className="flex flex-col gap-32">
            {/* GAME 9 */}
            {game5Winner.index !== null ? (
              <button
                onClick={() =>
                  setGame9Winner({
                    index: game5Winner.index,
                    seed: game5Winner.seed,
                  })
                }
              >
                <TeamByIndex
                  index={game5Winner.index}
                  seed={game5Winner.seed}
                />
              </button>
            ) : (
              <BlankTeam />
            )}
            {game6Winner.index !== null ? (
              <button
                onClick={() =>
                  setGame9Winner({
                    index: game6Winner.index,
                    seed: game6Winner.seed,
                  })
                }
              >
                <TeamByIndex
                  index={game6Winner.index}
                  seed={game6Winner.seed}
                />
              </button>
            ) : (
              <BlankTeam />
            )}
          </div>
          <div className="flex flex-col gap-32">
            {/* GAME 10 */}
            {game7Winner.index !== null ? (
              <button
                onClick={() =>
                  setGame10Winner({
                    index: game7Winner.index,
                    seed: game7Winner.seed,
                  })
                }
              >
                <TeamByIndex
                  index={game7Winner.index}
                  seed={game7Winner.seed}
                />
              </button>
            ) : (
              <BlankTeam />
            )}
            {game8Winner.index !== null ? (
              <button
                onClick={() =>
                  setGame10Winner({
                    index: game8Winner.index,
                    seed: game8Winner.seed,
                  })
                }
              >
                <TeamByIndex
                  index={game8Winner.index}
                  seed={game8Winner.seed}
                />
              </button>
            ) : (
              <BlankTeam />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-8 mt-32">
          <div className="flex flex-col gap-72">
            {/* GAME 11 */}
            {game9Winner.index !== null ? (
              <button
                onClick={() =>
                  setGame11Winner({
                    index: game9Winner.index,
                    seed: game9Winner.seed,
                  })
                }
              >
                <TeamByIndex
                  index={game9Winner.index}
                  seed={game9Winner.seed}
                />
              </button>
            ) : (
              <BlankTeam />
            )}
            {game10Winner.index !== null ? (
              <button
                onClick={() =>
                  setGame11Winner({
                    index: game10Winner.index,
                    seed: game10Winner.seed,
                  })
                }
              >
                <TeamByIndex
                  index={game10Winner.index}
                  seed={game10Winner.seed}
                />
              </button>
            ) : (
              <BlankTeam />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
