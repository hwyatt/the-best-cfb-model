"use client";
import { useState } from "react";

export default function Portal() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState();

  const handleGetData = async () => {
    const getPortal = await fetch(`/api/portal${year && `?year=${year}`}`);
    const portalData = await getPortal.json();
    setData(portalData);
  };

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
