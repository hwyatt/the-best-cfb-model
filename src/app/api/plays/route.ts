import { NextResponse } from "next/server";

const BASE_URL = "https://api.collegefootballdata.com";
const BEARER_TOKEN =
  "8474sJ42lQEtgWGBYsru+i6Ltl9k05P+Ohf/ZccNOMc7xow9G409Cm2QxLbJxyaw";

export async function GET(request: any) {
  // const WEEK = 2; // Change this to the appropriate week
  // const YEAR = 2024; // Change this to the appropriate year
  // const ENDPOINT = `${BASE_URL}/plays?week=${WEEK}&year=${YEAR}`;
  // try {
  //   const res = await fetch(ENDPOINT, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${BEARER_TOKEN}`,
  //       "Cache-Control": "no-cache",
  //     },
  //   });
  //   if (!res.ok) {
  //     throw new Error("Failed to fetch data");
  //   }
  //   const data = await res.json();
  //   // Filter by play_type "Passing Touchdown", "Rushing Touchdown", "Interception Return Touchdown", "Fumble Return Touchdown", "Kickoff Return Touchdown", "Punt Return Touchdown"
  //   const passingTouchdowns = data.filter(
  //     (play: any) => play.play_type === "Interception Return Touchdown"
  //   );
  //   // Sort the results by "yards_gained" in descending order
  //   const sortedData = passingTouchdowns.sort(
  //     (a: any, b: any) => b.yards_gained - a.yards_gained
  //   );
  //   // Limit the output to the top 15 results
  //   const top15 = sortedData.slice(0, 11);
  //   return NextResponse.json(top15, { status: 200 });
  // } catch (err) {
  //   console.error("Error fetching data:", err);
  //   return NextResponse.json(
  //     { error: "Failed to fetch data" },
  //     { status: 500 }
  //   );
  // }
}
