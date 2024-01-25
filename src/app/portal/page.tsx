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
      sortable: true,
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
            <span className="font-semibold uppercase text-gray-800">
              {row.origin}
            </span>
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
              <span className="font-semibold uppercase text-gray-800">
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Transfer Portal</h1>
        <p className="text-gray-800">
          Search the Transfer Portal for players and teams. Sort/filter based on
          all kinds of data.
        </p>
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
