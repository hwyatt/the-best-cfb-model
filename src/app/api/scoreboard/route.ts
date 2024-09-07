import { NextResponse } from "next/server";

const BASE_URL = "https://api.collegefootballdata.com";
const BEARER_TOKEN =
  "8474sJ42lQEtgWGBYsru+i6Ltl9k05P+Ohf/ZccNOMc7xow9G409Cm2QxLbJxyaw";
const SCOREBOARD = "/scoreboard";

export async function GET(request: any) {
  const ENDPOINT = `${BASE_URL}${SCOREBOARD}?_=${Date.now()}`;
  try {
    const res = await fetch(ENDPOINT, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Cache-Control": "no-store", // Ensure the request is not cached
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const json = await res.json();

    // Add no-cache headers to the response
    const headers = new Headers();
    headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    return NextResponse.json(json, { headers, status: 200 });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
