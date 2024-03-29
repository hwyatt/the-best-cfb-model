"use client";
import { useEffect, useId, useRef, useState } from "react";
import Select, { components } from "react-select";
import { domToPng } from "modern-screenshot";
import { useCallback } from "react";
var tinycolor = require("tinycolor2");
import { saveAs } from "file-saver";

const BracketLines1 = () => (
  <div className="h-[4.5rem] w-16 border-y-2 border-r-2 border-l-0 border-gray-400 flex items-center relative">
    <div
      className="h-[2px] w-16 bg-gray-400 absolute"
      style={{ right: "-4rem" }}
    ></div>
  </div>
);

const BracketLines2 = () => (
  <div className="h-48 w-16 border-y-2 border-r-2 border-l-0 border-gray-400 flex items-center relative">
    <div
      className="h-[2px] w-16 bg-gray-400 absolute"
      style={{ right: "-4rem" }}
    ></div>
  </div>
);

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
  isDisabled,
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
      isDisabled={isDisabled}
    />
  );
}

export default function Bracket() {
  const [year, setYear] = useState<null | string>(null);
  const ref = useRef<HTMLDivElement>(null);

  // const onButtonClick = useCallback(() => {
  //   if (ref.current === null) {
  //     return;
  //   }

  //   toPng(ref.current, {
  //     cacheBust: true,
  //     backgroundColor: "#e5e7eb",
  //     width: 1312 + 32,
  //     height: 776 + 32,
  //   })
  //     .then((dataUrl) => {
  //       const link = document.createElement("a");
  //       link.download = "CFP-Bracket.jpg";
  //       link.href = dataUrl;
  //       link.click();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [ref]);

  // const handlePng = useCallback(() => {
  //   if (ref.current === null) {
  //     return;
  //   }

  //   toPng(ref.current, {
  //     cacheBust: true,
  //     backgroundColor: "#e5e7eb",
  //     width: 1312 + 32,
  //     height: 776 + 32,
  //   })
  //     .then((dataUrl) => {
  //       setPng({ url: dataUrl, name: "CFP-Bracket.jpg" });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [ref]);

  // const onButtonClick = () => {
  //   if (png.url !== null && png.name !== null) {
  //     saveAs(png.url, png.name);
  //   } else {
  //     console.log("err downloading image");
  //   }
  // };

  // const onButtonClick = () => {
  //   const bracketElement = document.querySelector("#bracket");

  //   if (bracketElement) {
  //     domToPng(bracketElement, {
  //       backgroundColor: "#e5e7eb",
  //       width: 1312 + 32,
  //       height: 776 + 32,
  //     }).then((dataUrl) => {
  //       const link = document.createElement("a");
  //       link.download = "CFP-Bracket.png";
  //       link.href = dataUrl;
  //       link.click();
  //     });
  //   } else {
  //     console.error("Bracket element not found");
  //   }
  // };

  // const onButtonClick = useCallback(() => {
  //   if (ref.current === null) {
  //     return;
  //   }
  //   setIsDownloading(true);

  //   domToPng(ref.current, {
  //     backgroundColor: "#e5e7eb",
  //     width: 1312,
  //     height: 776,
  //   }).then((dataUrl) => {
  //     const link = document.createElement("a");
  //     link.download = "CFP-Bracket.png";
  //     link.href = dataUrl;
  //     link.click();
  //   });
  // }, [ref]);

  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (isDownloading && ref.current !== null) {
      domToPng(ref.current, {
        backgroundColor: "#e5e7eb",
        width: 1332,
        height: 938.688,
      }).then((dataUrl) => {
        // const link = document.createElement("a");
        // link.download = "CFP-Bracket.png";
        // link.href = dataUrl;
        // link.click();
        saveAs(dataUrl, "CFP-Bracket.png");
        setIsDownloading(false); // Reset isDownloading after the download is complete
      });
    }
  }, [isDownloading, ref]);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }
    setIsDownloading(true);
  }, [ref]);

  const [data, setData] = useState<any>([
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
      base64Logo: "",
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
      base64Logo: "",
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

  const [isSelectDisabled, setIsSelectDisabled] = useState(false);
  const [isUseTop12Disabled, setIsUseTop12Disabled] = useState(false);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(true);

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
  }, []);

  const setCurrentTop12 = () => {
    handleGetRankings();
  };

  const handleGetTeams = async () => {
    const getTeams = await fetch(`/api/teams`);
    const teams = await getTeams.json();
    setData(teams);
  };

  const handleGetRankings = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    // If we are not yet in August of the current year, set the current football year to the previous year
    const currentYear =
      currentMonth >= 7
        ? currentDate.getFullYear()
        : currentDate.getFullYear() - 1;

    const getRankings = await fetch(
      `/api/rankings?year=${year ? year : currentYear}`
    );

    const rankingsData = await getRankings.json();

    const rankedTeams = rankingsData.ranks.map((rank: any) => {
      const foundTeam = teams.find((team: any) => team.school === rank.school);

      if (foundTeam) {
        return {
          ...foundTeam,
        };
      }

      return null;
    });

    const filteredRankedTeams = rankedTeams.filter(
      (team: any) => team !== null
    );

    const playoffTeams = filteredRankedTeams.slice(0, 12);
    const base64Res = await fetch(`/api/playoffTeams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playoffTeams }),
    });
    const base64Teams = await base64Res.json();
    console.log(base64Teams);
    setPlayoffTeams(base64Teams);

    setIsSelectDisabled(true);
    setIsUseTop12Disabled(true);
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
    const playoffTeams = selectedOption.map((opt: any) => {
      return teams.find((team: any) => team?.school === opt.value);
    });

    const base64Res = await fetch(`/api/playoffTeams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playoffTeams }),
    });
    const base64Teams = await base64Res.json();
    setPlayoffTeams(base64Teams);
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

  const TeamByIndex = ({ index, seed, lastGame }: any) => {
    const [isHovered, setIsHovered] = useState(false);
    const team = playoffTeams[index - 1];

    if (!team || team.id === null) {
      // Index doesn't exist, you can return a placeholder or handle it as needed
      return <BlankTeam index={index} seed={seed} />;
    }

    const isChampion = index === game11Winner.index && lastGame;

    const darkenColor = (color: any, percentage: any) => {
      // Implement your logic to darken the color here
      // For simplicity, you can use a library like tinycolor2 for color manipulation
      return tinycolor(color).darken(percentage).toString();
    };

    return (
      <div className="relative">
        <div
          className={`flex items-center justify-between max-h-16 gap-2 bg-white border-2 border-gray-400 rounded p-4 w-full shadow-md ${
            isChampion && `rounded-b-none`
          } hover:shadow-xl transition-all transition-100`}
          style={{
            backgroundColor: `${
              playoffTeams[index - 1]?.color !== "#ffffff"
                ? isHovered
                  ? darkenColor(playoffTeams[index - 1]?.color, 5)
                  : playoffTeams[index - 1]?.color
                : playoffTeams[index - 1]?.alt_color
            }`,
            transition: "background-color 100ms ease",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex gap-2 items-center">
            <div className="bg-gray-200 rounded-full p-2">
              <img
                // src={playoffTeams[index - 1]?.logos[0]}
                // src={
                //   playoffTeams[index - 1]?.base64Logo ||
                //   playoffTeams[index - 1]?.logos[0]
                // }
                src={
                  isDownloading
                    ? playoffTeams[index - 1]?.base64Logo
                    : playoffTeams[index - 1]?.logos[0]
                }
                alt={`${playoffTeams[index - 1]?.school} Logo`}
                className="w-8 h-auto object-contain"
                crossOrigin="anonymous"
              />
            </div>

            <p className="text-white font-semibold">
              {playoffTeams[index - 1]?.school}
            </p>
          </div>
          <p className="text-white font-semibold">{seed}</p>
        </div>
        {isChampion && (
          <div className="absolute left-0 right-0 font-bold bg-yellow-600	p-2 border-2 border-t-0 border-gray-400">
            NATIONAL CHAMPION
          </div>
        )}
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
          Choose your top 12 teams, or use the latest top 12. Click to advance a
          team.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="flex flex-col gap-2 md:max-w-4xl">
          <label className="font-semibold text-gray-600">Select 12 Teams</label>
          <TeamSelectMulti
            teams={teams}
            selectedTeam={selectedTeam}
            handleSelect={handleSelect}
            playoffTeams={playoffTeams} // Pass playoffTeams prop
            isDisabled={isSelectDisabled}
          />
        </div>
        <button
          onClick={setCurrentTop12}
          disabled={isUseTop12Disabled}
          className={`w-full md:max-w-48 ${
            isUseTop12Disabled ? "bg-gray-400" : "bg-gray-600 hover:bg-gray-700"
          } text-white font-semibold py-2 px-4 rounded self-end transition-all duration-100`}
        >
          Use Current Top 12
        </button>
      </div>
      <div ref={ref} className="overflow-x-auto" id="bracket">
        <div
          className={`flex flex-col ${isDownloading && `p-8`}`}
          style={{ width: "1312px" }}
        >
          <div className="grid grid-cols-4 w-full gap-8 mb-8">
            <span className="font-semibold text-gray-600">ROUND ONE</span>
            <span className="font-semibold text-gray-600">QUARTERFINALS</span>
            <span className="font-semibold text-gray-600">SEMIFINALS</span>
            <span className="font-semibold text-gray-600">
              NATIONAL CHAMPIONSHIP
            </span>
          </div>
          <div className="grid grid-cols-4 w-full gap-8">
            <div className="flex flex-col gap-8 mt-12 z-10">
              <span className="hidden font-semibold text-gray-600">
                ROUND ONE
              </span>
              <div className="flex flex-col gap-4 relative">
                {/* GAME 1 */}
                <button
                  className="relative"
                  disabled={
                    (game1Winner.index !== null && game1Winner.index !== 8) ||
                    playoffTeams.length < 12
                  }
                  onClick={() => setGame1Winner({ index: 8, seed: 8 })}
                >
                  {game1Winner.index !== null && game1Winner.index !== 8 && (
                    <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                  )}
                  <TeamByIndex index={8} seed={8} />
                </button>
                <button
                  className="relative"
                  disabled={
                    (game1Winner.index !== null && game1Winner.index !== 9) ||
                    playoffTeams.length < 12
                  }
                  onClick={() => setGame1Winner({ index: 9, seed: 9 })}
                >
                  {game1Winner.index !== null && game1Winner.index !== 9 && (
                    <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                  )}
                  <TeamByIndex index={9} seed={9} />
                </button>
                <div className="absolute top-[2.25rem] right-[-1rem] -z-10">
                  <BracketLines1 />
                </div>
              </div>
              <div className="flex flex-col gap-4 relative">
                {/* GAME 2 */}
                <button
                  className="relative"
                  disabled={
                    (game2Winner.index !== null && game2Winner.index !== 5) ||
                    playoffTeams.length < 12
                  }
                  onClick={() => setGame2Winner({ index: 5, seed: 5 })}
                >
                  {game2Winner.index !== null && game2Winner.index !== 5 && (
                    <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                  )}
                  <TeamByIndex index={5} seed={5} />
                </button>
                <button
                  className="relative"
                  disabled={
                    (game2Winner.index !== null && game2Winner.index !== 12) ||
                    playoffTeams.length < 12
                  }
                  onClick={() => setGame2Winner({ index: 12, seed: 12 })}
                >
                  {game2Winner.index !== null && game2Winner.index !== 12 && (
                    <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                  )}
                  <TeamByIndex index={12} seed={12} />
                </button>
                <div className="absolute top-[2.25rem] right-[-1rem] -z-10">
                  <BracketLines1 />
                </div>
              </div>
              <div className="flex flex-col gap-4 relative">
                {/* GAME 3 */}
                <button
                  className="relative"
                  disabled={
                    (game3Winner.index !== null && game3Winner.index !== 6) ||
                    playoffTeams.length < 12
                  }
                  onClick={() => setGame3Winner({ index: 6, seed: 6 })}
                >
                  {game3Winner.index !== null && game3Winner.index !== 6 && (
                    <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                  )}
                  <TeamByIndex index={6} seed={6} />
                </button>
                <button
                  className="relative"
                  disabled={
                    (game3Winner.index !== null && game3Winner.index !== 11) ||
                    playoffTeams.length < 12
                  }
                  onClick={() => setGame3Winner({ index: 11, seed: 11 })}
                >
                  {game3Winner.index !== null && game3Winner.index !== 11 && (
                    <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                  )}
                  <TeamByIndex index={11} seed={11} />
                </button>
                <div className="absolute top-[2.25rem] right-[-1rem] -z-10">
                  <BracketLines1 />
                </div>
              </div>
              <div className="flex flex-col gap-4 relative">
                {/* GAME 4 */}
                <button
                  className="relative"
                  disabled={
                    (game4Winner.index !== null && game4Winner.index !== 7) ||
                    playoffTeams.length < 12
                  }
                  onClick={() => setGame4Winner({ index: 7, seed: 7 })}
                >
                  {game4Winner.index !== null && game4Winner.index !== 7 && (
                    <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                  )}
                  <TeamByIndex index={7} seed={7} />
                </button>
                <button
                  className="relative"
                  disabled={
                    (game4Winner.index !== null && game4Winner.index !== 10) ||
                    playoffTeams.length < 12
                  }
                  onClick={() => setGame4Winner({ index: 10, seed: 10 })}
                >
                  {game4Winner.index !== null && game4Winner.index !== 10 && (
                    <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                  )}
                  <TeamByIndex index={10} seed={10} />
                </button>
                <div className="absolute top-[2.25rem] right-[-1rem] -z-10">
                  <BracketLines1 />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8 z-10">
              <span className="hidden font-semibold text-gray-600">
                QUARTERFINALS
              </span>
              <div className="flex flex-col gap-4 relative">
                {/* GAME 5 */}
                <button
                  className="relative"
                  disabled={
                    (game5Winner.index !== null && game5Winner.index !== 1) ||
                    playoffTeams.length < 12
                  }
                  onClick={() => setGame5Winner({ index: 1, seed: 1 })}
                >
                  {game5Winner.index !== null && game5Winner.index !== 1 && (
                    <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                  )}
                  <TeamByIndex index={1} seed={1} />
                </button>
                {game1Winner.index !== null ? (
                  <button
                    className="relative"
                    disabled={
                      (game5Winner.index !== null &&
                        game5Winner.index !== game1Winner.index) ||
                      playoffTeams.length < 12
                    }
                    onClick={() =>
                      setGame5Winner({
                        index: game1Winner.index,
                        seed: game1Winner.seed,
                      })
                    }
                  >
                    {game5Winner.index !== null &&
                      game5Winner.index !== game1Winner.index && (
                        <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                      )}
                    <TeamByIndex
                      index={game1Winner.index}
                      seed={game1Winner.seed}
                    />
                  </button>
                ) : (
                  <BlankTeam />
                )}
                <div className="absolute top-[2.25rem] right-[-1rem] -z-10">
                  <BracketLines1 />
                </div>
              </div>
              <div className="flex flex-col gap-4 relative">
                {/* GAME 6 */}
                <button
                  className="relative"
                  disabled={
                    (game6Winner.index !== null && game6Winner.index !== 4) ||
                    playoffTeams.length < 12
                  }
                  onClick={() => setGame6Winner({ index: 4, seed: 4 })}
                >
                  {game6Winner.index !== null && game6Winner.index !== 4 && (
                    <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                  )}
                  <TeamByIndex index={4} seed={4} />
                </button>
                {game2Winner.index !== null ? (
                  <button
                    className="relative"
                    disabled={
                      (game6Winner.index !== null &&
                        game6Winner.index !== game2Winner.index) ||
                      playoffTeams.length < 12
                    }
                    onClick={() =>
                      setGame6Winner({
                        index: game2Winner.index,
                        seed: game2Winner.seed,
                      })
                    }
                  >
                    {game6Winner.index !== null &&
                      game6Winner.index !== game2Winner.index && (
                        <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                      )}
                    <TeamByIndex
                      index={game2Winner.index}
                      seed={game2Winner.seed}
                    />
                  </button>
                ) : (
                  <BlankTeam />
                )}
                <div className="absolute top-[2.25rem] right-[-1rem] -z-10">
                  <BracketLines1 />
                </div>
              </div>
              <div className="flex flex-col gap-4 relative">
                {/* GAME 7 */}
                <button
                  className="relative"
                  disabled={
                    (game7Winner.index !== null && game7Winner.index !== 3) ||
                    playoffTeams.length < 12
                  }
                  onClick={() => setGame7Winner({ index: 3, seed: 3 })}
                >
                  {game7Winner.index !== null && game7Winner.index !== 3 && (
                    <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                  )}
                  <TeamByIndex index={3} seed={3} />
                </button>
                {game3Winner.index !== null ? (
                  <button
                    className="relative"
                    disabled={
                      (game7Winner.index !== null &&
                        game7Winner.index !== game3Winner.index) ||
                      playoffTeams.length < 12
                    }
                    onClick={() =>
                      setGame7Winner({
                        index: game3Winner.index,
                        seed: game3Winner.seed,
                      })
                    }
                  >
                    {game7Winner.index !== null &&
                      game7Winner.index !== game3Winner.index && (
                        <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                      )}
                    <TeamByIndex
                      index={game3Winner.index}
                      seed={game3Winner.seed}
                    />
                  </button>
                ) : (
                  <BlankTeam />
                )}
                <div className="absolute top-[2.25rem] right-[-1rem] -z-10">
                  <BracketLines1 />
                </div>
              </div>
              <div className="flex flex-col gap-4 relative">
                {/* GAME 8 */}
                <button
                  className="relative"
                  disabled={
                    (game8Winner.index !== null && game8Winner.index !== 2) ||
                    playoffTeams.length < 12
                  }
                  onClick={() => setGame8Winner({ index: 2, seed: 2 })}
                >
                  {game8Winner.index !== null && game8Winner.index !== 2 && (
                    <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                  )}
                  <TeamByIndex index={2} seed={2} />
                </button>
                {game4Winner.index !== null ? (
                  <button
                    className="relative"
                    disabled={
                      (game8Winner.index !== null &&
                        game8Winner.index !== game4Winner.index) ||
                      playoffTeams.length < 12
                    }
                    onClick={() =>
                      setGame8Winner({
                        index: game4Winner.index,
                        seed: game4Winner.seed,
                      })
                    }
                  >
                    {game8Winner.index !== null &&
                      game8Winner.index !== game4Winner.index && (
                        <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                      )}
                    <TeamByIndex
                      index={game4Winner.index}
                      seed={game4Winner.seed}
                    />
                  </button>
                ) : (
                  <BlankTeam />
                )}
                <div className="absolute top-[2.25rem] right-[-1rem] -z-10">
                  <BracketLines1 />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-24 mt-8 z-10">
              <span className="hidden font-semibold text-gray-600">
                SEMIFINALS
              </span>
              <div className="flex flex-col gap-32 relative">
                {/* GAME 9 */}
                {game5Winner.index !== null ? (
                  <button
                    className="relative"
                    disabled={
                      game9Winner.index !== null &&
                      game9Winner.index !== game5Winner.index
                    }
                    onClick={() =>
                      setGame9Winner({
                        index: game5Winner.index,
                        seed: game5Winner.seed,
                      })
                    }
                  >
                    {game9Winner.index !== null &&
                      game9Winner.index !== game5Winner.index && (
                        <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                      )}
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
                    className="relative"
                    disabled={
                      game9Winner.index !== null &&
                      game9Winner.index !== game6Winner.index
                    }
                    onClick={() =>
                      setGame9Winner({
                        index: game6Winner.index,
                        seed: game6Winner.seed,
                      })
                    }
                  >
                    {game9Winner.index !== null &&
                      game9Winner.index !== game6Winner.index && (
                        <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                      )}
                    <TeamByIndex
                      index={game6Winner.index}
                      seed={game6Winner.seed}
                    />
                  </button>
                ) : (
                  <BlankTeam />
                )}
                <div className="absolute top-[2.25rem] right-[-1rem] -z-10">
                  <BracketLines2 />
                </div>
              </div>
              <div className="flex flex-col gap-32 relative">
                {/* GAME 10 */}
                {game7Winner.index !== null ? (
                  <button
                    className="relative"
                    disabled={
                      game10Winner.index !== null &&
                      game10Winner.index !== game7Winner.index
                    }
                    onClick={() =>
                      setGame10Winner({
                        index: game7Winner.index,
                        seed: game7Winner.seed,
                      })
                    }
                  >
                    {game10Winner.index !== null &&
                      game10Winner.index !== game7Winner.index && (
                        <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                      )}
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
                    className="relative"
                    disabled={
                      game10Winner.index !== null &&
                      game10Winner.index !== game8Winner.index
                    }
                    onClick={() =>
                      setGame10Winner({
                        index: game8Winner.index,
                        seed: game8Winner.seed,
                      })
                    }
                  >
                    {game10Winner.index !== null &&
                      game10Winner.index !== game8Winner.index && (
                        <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                      )}
                    <TeamByIndex
                      index={game8Winner.index}
                      seed={game8Winner.seed}
                    />
                  </button>
                ) : (
                  <BlankTeam />
                )}
                <div className="absolute top-[2.25rem] right-[-1rem] -z-10">
                  <BracketLines2 />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8 mt-32 z-10">
              <span className="hidden font-semibold text-gray-600">
                NATIONAL CHAMPIONSHIP
              </span>
              <div className="flex flex-col gap-72">
                {/* GAME 11 */}
                {game9Winner.index !== null ? (
                  <button
                    className="relative"
                    disabled={
                      game11Winner.index !== null &&
                      game11Winner.index !== game9Winner.index
                    }
                    onClick={() => {
                      setGame11Winner({
                        index: game9Winner.index,
                        seed: game9Winner.seed,
                      });
                      setIsDownloadDisabled(false);
                    }}
                  >
                    {game11Winner.index !== null &&
                      game11Winner.index !== game9Winner.index && (
                        <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                      )}
                    <TeamByIndex
                      index={game9Winner.index}
                      seed={game9Winner.seed}
                      lastGame={true}
                    />
                  </button>
                ) : (
                  <BlankTeam />
                )}
                {game10Winner.index !== null ? (
                  <button
                    className="relative"
                    disabled={
                      game11Winner.index !== null &&
                      game11Winner.index !== game10Winner.index
                    }
                    onClick={() => {
                      setGame11Winner({
                        index: game10Winner.index,
                        seed: game10Winner.seed,
                      });
                      setIsDownloadDisabled(false);
                    }}
                  >
                    {game11Winner.index !== null &&
                      game11Winner.index !== game10Winner.index && (
                        <div className="absolute inset-0 bg-black z-10 opacity-50"></div>
                      )}
                    <TeamByIndex
                      index={game10Winner.index}
                      seed={game10Winner.seed}
                      lastGame={true}
                    />
                  </button>
                ) : (
                  <BlankTeam />
                )}
              </div>
            </div>
          </div>
          <div
            className={`${
              isDownloading ? "flex" : "hidden"
            } w-full justify-between items-center mt-8`}
          >
            <img src="Saturday Stats.png" className="max-w-72" />
            <span className="">saturdaystats.com</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 self-center w-full justify-center">
        <button
          onClick={onButtonClick}
          onTouchStart={onButtonClick}
          disabled={isDownloadDisabled}
          className={`w-full md:w-auto ${
            isDownloadDisabled ? "bg-gray-400" : "bg-gray-600 hover:bg-gray-700"
          } text-white font-semibold py-2 px-4 rounded self-center transition-all duration-100`}
        >
          Download Bracket
        </button>
        {game11Winner.index !== null && (
          <a
            className="text-center bg-transparent hover:bg-gray-300 text-gray-600 w-full md:w-auto font-semibold py-2 px-4 rounded self-center transition-all duration-100"
            href="https://twitter.com/intent/tweet?text=Check%20out%20this%20CFP%20bracket%20I%20made%20on%20saturdaystats.com!"
            target="_blank"
          >
            Share to X
          </a>
        )}
      </div>
      {game11Winner.index !== null && (
        <span className="text-center self-center text-xs text-gray-600">
          If sharing your bracket to X, you will still need to download the
          bracket and upload it to the tweet/post.
        </span>
      )}
    </div>
  );
}
