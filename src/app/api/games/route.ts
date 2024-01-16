import { NextResponse } from "next/server";

const BASE_URL = "https://api.collegefootballdata.com";
const BEARER_TOKEN =
    "8474sJ42lQEtgWGBYsru+i6Ltl9k05P+Ohf/ZccNOMc7xow9G409Cm2QxLbJxyaw";
const GAMES = "/games";

export async function GET(request: any) {
    const yearQS = request.nextUrl.searchParams.get(["year"]);
    const teamQS = request.nextUrl.searchParams.get(["team"]);
    const ENDPOINT = `${BASE_URL}${GAMES}?year=${yearQS}&team=${teamQS}`;
    try {
        const res = await fetch(ENDPOINT, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch data");
        }

        const json = await res.json();

        const resPostseason = await fetch(`${ENDPOINT}&seasonType=postseason`, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        });

        if (!resPostseason.ok) {
            throw new Error("Failed to fetch data");
        }

        const jsonPostseason = await resPostseason.json();

        const combinedData = json.concat(jsonPostseason);

        return NextResponse.json(combinedData, { status: 200 });
    } catch (err) {
        console.log(err);
    }
}
