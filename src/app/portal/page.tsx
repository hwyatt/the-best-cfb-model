"use client";
import { useEffect, useState } from "react";

interface YearOption {
  label: string;
  value: string;
}

export default function Portal() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState("");
  const [yearOpts, setYearOpts] = useState<YearOption[]>([]);

  const handleGetData = async () => {
    if (year) {
      const getPortal = await fetch(`/api/portal?year=${year}`);
      const portalData = await getPortal.json();
      setData(portalData);
    }
  };

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

  useEffect(() => {
    // Use another useEffect to call handleGetData when the year changes
    handleGetData();
  }, [year]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Transfer Portal</h1>
        <p>
          Search through the Transfer Portal and sort/filter based on all kinds
          of data.
        </p>
      </div>
    </div>
  );
}
