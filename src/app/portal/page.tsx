"use client";
import { useEffect, useId, useState } from "react";
import DataTable from "react-data-table-component";
import SeasonSelect from "../components/SeasonSelect";
import Select from "react-select";

interface YearOption {
  label: string;
  value: string;
}

interface PositionOption {
  label: string;
  value: string;
}

const getDate = (stringDate: string) => {
  const originalDate = new Date(stringDate);
  return originalDate.toLocaleDateString();
};

export default function Portal() {
  const [data, setData] = useState([]);
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

  const columns = [
    {
      name: "Name",
      cell: (row: any) => (
        <div>
          {row.firstName} {row.lastName}
        </div>
      ),
    },
    {
      name: "Position",
      selector: (row: any) => row.position,
      sortable: true,
    },
    {
      name: "Stars",
      selector: (row: any) => (row.stars !== null ? row.stars : "-"),
      sortable: true,
    },
    {
      name: "Rating",
      cell: (row: any) => (row.rating !== null ? row.rating : "-"),
      sortable: true,
    },
    {
      name: "Transfer Date",
      cell: (row: any) => getDate(row.transferDate),
      sortable: true,
    },
    {
      name: "Origin",
      selector: (row: any) => row.origin,
    },
    {
      name: "Destination",
      selector: (row: any) =>
        row.destination !== null ? row.destination : "?",
    },
    {
      name: "Eligibility",
      selector: (row: any) => row.eligibility,
    },
  ];

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
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
          Search through the Transfer Portal and sort/filter based on all kinds
          of data.
        </p>
      </div>
      <div className="flex gap-8 justify-between">
        <div className="flex gap-8">
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
              options={[
                ...new Set(filteredData.map((row: any) => row.position)),
              ].map((position) => ({ value: position, label: position }))}
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
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded self-end transition-all duration-100"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
      {filteredData.length > 0 && (
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          fixedHeader
        />
      )}
    </div>
  );
}
