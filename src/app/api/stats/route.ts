import { NextResponse } from "next/server";

const BASE_URL = "https://api.collegefootballdata.com";
const BEARER_TOKEN =
    "8474sJ42lQEtgWGBYsru+i6Ltl9k05P+Ohf/ZccNOMc7xow9G409Cm2QxLbJxyaw";
const STATS = "/stats/season";

export async function GET(request: any) {
    const teamQS = request.nextUrl.searchParams.get(["team"]);
    const yearQS = request.nextUrl.searchParams.get(["year"]);
    const ENDPOINT = `${BASE_URL}${STATS}?${teamQS && `team=${teamQS}&`}${
        yearQS && `year=${yearQS}`
    }`;
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

        return NextResponse.json(json, { status: 200 });
    } catch (err) {
        console.log(err);
    }
}
