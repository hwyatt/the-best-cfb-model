"use client";
import { useEffect, useId, useState } from "react";
import DataTable from "react-data-table-component";
import SeasonSelect from "../components/SeasonSelect";
import Select from "react-select";
import { GiAmericanFootballHelmet } from "react-icons/gi";
import { FaStar } from "react-icons/fa";

interface YearOption {
  label: string;
  value: string;
}

interface PositionOption {
  label: string;
  value: string;
}

const StarsColumn = ({ row }: any) => {
  const renderStars = () => {
    const stars = row.stars;
    const totalStars = 5;

    if (stars !== null) {
      return (
        <div className="flex">
          {Array.from({ length: totalStars }).map((_, index) => (
            <FaStar
              key={index}
              className={index < stars ? "text-yellow-600" : "text-gray-200"}
            />
          ))}
        </div>
      );
    }
  };

  return <div>{renderStars()}</div>;
};

function findMostFrequent(data: any, key: any) {
  const countMap = new Map();
  const starMap = new Map();

  data.forEach((item: any) => {
    const value = item[key];
    const stars = item.stars;

    // Skip null values
    if (value !== null) {
      countMap.set(value, (countMap.get(value) || 0) + 1);

      if (stars !== null) {
        starMap.set(value, (starMap.get(value) || 0) + stars);
      }
    }
  });

  let mostFrequentValue: any = null;
  let maxCount = 0;

  countMap.forEach((count, value) => {
    const averageStars = starMap.has(value) ? starMap.get(value) / count : null;

    if (
      count > maxCount ||
      (count === maxCount &&
        averageStars !== null &&
        averageStars > mostFrequentValue.averageStars)
    ) {
      mostFrequentValue = { team: value, count, averageStars };
      maxCount = count;
    }
  });

  return mostFrequentValue;
}

const StatCard = ({ team, winner, transfers, avgStars, logo }: any) => {
  // Function to generate stars based on the avgStars value
  const renderStars = () => {
    const stars = [];
    const roundedStars = Math.round(avgStars);

    // Render colored stars up to the rounded value
    for (let i = 0; i < roundedStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-600" />);
    }

    // Render remaining empty stars
    for (let i = roundedStars; i < 5; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-200" />);
    }

    return stars;
  };

  return (
    <div className="flex items-center justify-between gap-2 bg-white border-2 border-gray-400 rounded p-4 w-full shadow-lg">
      <div className="w-full flex gap-2 items-center flex-row-reverse justify-between">
        <div
          className={`${
            winner
              ? `bg-green-200 border-2 border-green-600 text-green-600`
              : `bg-red-200 border-2 border-red-600 text-red-600`
          } rounded-full p-2`}
        >
          <div className="flex items-center justify-center w-8 h-8 font-semibold">
            {winner ? "W" : "L"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {logo && (
            <div className="rounded-full p-2 bg-gray-200">
              <img src={logo} alt={team + " " + logo} className="w-10 h-10" />
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-gray-800 font-semibold mr-1">{team}</p>
            <p className="text-sm text-gray-600">
              {winner
                ? `${transfers} Incoming Transfers`
                : `${transfers} Outgoing Transfers`}
            </p>
            {avgStars && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">
                  Avg Star {winner ? `Coming` : `Leaving`}
                </span>
                {renderStars()}
                <span className="text-xs ml-2">{`(${avgStars.toFixed(
                  2
                )})`}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getDate = (stringDate: string) => {
  const originalDate = new Date(stringDate);
  return originalDate.toLocaleDateString();
};

export default function Portal() {
  const [data, setData] = useState([]);
  const [teamsData, setTeamsData] = useState([
    {
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
    },
  ]);
  const [year, setYear] = useState("");
  const [yearOpts, setYearOpts] = useState<YearOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [position, setPosition] = useState("");

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleGetTeams = async () => {
    const getTeams = await fetch(`/api/teams`);
    const teams = await getTeams.json();
    setTeamsData(teams);
  };

  const filteredData = data.filter((row: any) => {
    const fullName = `${row.firstName} ${row.lastName}`.toLowerCase();

    return (
      (fullName.includes(searchTerm.toLowerCase()) ||
        row.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.destination !== null &&
          row.destination.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (position === "" || row.position === position)
    );
  });

  const paginationComponentOptions = {
    rowsPerPageText: "Players per Page",
    selectAllRowsItem: false,
  };

  const columns = [
    {
      name: "Player",
      cell: (row: any) => (
        <div className="flex flex-col gap-2 py-2">
          <div className="text-gray-600">
            {row.firstName}{" "}
            <p className="uppercase font-semibold text-gray-800">
              {row.lastName}
            </p>
          </div>

          <div className="flex gap-2">
            <StarsColumn row={row} />
            {row.rating !== null && (
              <span className="text-xs font-semibold text-gray-600">
                {row.rating}
              </span>
            )}
          </div>
        </div>
      ),
      maxWidth: "15%",
    },
    {
      name: "Pos",
      selector: (row: any) => row.position,
      maxWidth: "5%",
    },
    {
      name: "Transfer Date",
      selector: (row: any) => getDate(row.transferDate),
      maxWidth: "15%",
    },
    {
      name: "Origin",
      cell: (row: any) => {
        const matchingTeam = teamsData.find(
          (team) => team?.school === row.origin
        );
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
                <GiAmericanFootballHelmet
                  style={{ width: "40px", height: "40px", minWidth: "40px" }}
                />
              )}
            </div>
            <span className="font-semibold text-gray-800">{row.origin}</span>
          </div>
        );
      },
    },
    {
      name: "Destination",
      cell: (row: any) => {
        const matchingTeam = teamsData.find(
          (team) => team?.school === row.destination
        );
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
              ) : null}
            </div>
            {row.destination !== null ? (
              <span className="font-semibold text-gray-800">
                {row.destination}
              </span>
            ) : (
              <div className="bg-gray-200 rounded-full p-2">
                <div className="flex items-center justify-center w-6 h-6 font-semibold">
                  ?
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    // {
    //   name: "Eligibility",
    //   selector: (row: any) => row.eligibility,
    // },
  ];

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    handleGetTeams();

    const currentYear = new Date().getFullYear();

    setYear(currentYear.toString());

    const years = Array.from({ length: 4 }, (_, index) => currentYear - index);
    const formattedYears = years.map((year) => ({
      value: year.toString(),
      label: year.toString(),
    }));

    setYearOpts(formattedYears);
  }, []);

  useEffect(() => {
    const handleGetData = async () => {
      if (year) {
        const getPortal = await fetch(`/api/portal?year=${year}`);
        const portalData = await getPortal.json();

        // Sort the data by transferDate in descending order
        const sortedData = portalData.sort((a: any, b: any) => {
          const dateA = new Date(a.transferDate).getTime();
          const dateB = new Date(b.transferDate).getTime();
          return dateB - dateA;
        });

        setData(sortedData);
      }
    };

    handleGetData();
  }, [year]);

  const handleYearChange = async (year: any) => {
    setYear(year.value);
  };

  const handlePositionChange = (selectedOption: any) => {
    setSearchTerm("");
    setPosition(selectedOption ? selectedOption.value : "");
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setPosition("");
    // Add any other filter state variables you might have
  };

  const isFiltered = position !== "" || searchTerm !== "";

  const mostFrequentOrigin: any = findMostFrequent(data, "origin");
  const mostFrequentDestination: any = findMostFrequent(
    data.filter((item: any) => item.destination !== null),
    "destination"
  );

  const originMatch: any = teamsData.find(
    (team) => team?.school === mostFrequentOrigin.team
  );
  const originLogo = originMatch?.logos?.[0];

  const destinationMatch: any = teamsData.find(
    (team) => team?.school === mostFrequentDestination.team
  );
  const destinationLogo = destinationMatch?.logos?.[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Transfer Portal</h1>
        <p className="text-gray-800">
          Search the Transfer Portal for players and teams. Sort/filter based on
          all kinds of data.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-600">
          Portal Winners and Losers
        </label>

        <div className="grid md:grid-cols-2 gap-8">
          <StatCard
            team={mostFrequentDestination?.team}
            winner
            transfers={mostFrequentDestination?.count}
            avgStars={mostFrequentDestination?.averageStars}
            logo={destinationLogo}
          />
          <StatCard
            team={mostFrequentOrigin?.team}
            transfers={mostFrequentOrigin?.count}
            avgStars={mostFrequentOrigin?.averageStars}
            logo={originLogo}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-between">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-600">Search</label>
            <input
              type="text"
              placeholder="Search Player or Team..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="playerTeamSearch rounded transition-all duration-100 py-1.5 px-3"
              style={{
                borderColor: `${
                  isHovered ? "hsl(0, 0%, 70%)" : "hsl(0, 0%, 80%)"
                }`,
                borderWidth: "1px",
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-600">Position</label>
            <Select
              value={
                position !== "" ? { value: position, label: position } : null
              }
              options={Array.from(
                new Set(filteredData.map((row: any) => row.position))
              ).map((position) => ({
                value: position,
                label: position,
              }))}
              onChange={(selectedOption) =>
                handlePositionChange(selectedOption)
              }
              className="z-30"
              instanceId={useId()}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-600">Year</label>
            <SeasonSelect
              yearOpts={yearOpts}
              year={year}
              handleYearChange={handleYearChange}
            />
          </div>
        </div>
        <div className="flex gap-8">
          {isFiltered && (
            <button
              className="w-full md:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded self-end transition-all duration-100"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
      {filteredData.length > 0 && (
        <div>
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            fixedHeader
            paginationComponentOptions={paginationComponentOptions}
          />
        </div>
      )}
    </div>
  );
}
