import { NextResponse } from "next/server";

const BASE_URL = "https://api.collegefootballdata.com";
const BEARER_TOKEN =
  "8474sJ42lQEtgWGBYsru+i6Ltl9k05P+Ohf/ZccNOMc7xow9G409Cm2QxLbJxyaw";
const RANKINGS = "/rankings";

export async function GET(request: any) {
  const yearQS = request.nextUrl.searchParams.get(["year"]);
  const queryParams = new URLSearchParams();
  if (yearQS) queryParams.append("year", yearQS);

  const ENDPOINT = `${BASE_URL}${RANKINGS}?${queryParams.toString()}`;

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
    const latestWeek = json.pop();
    const latestPolls = latestWeek.polls;

    const CFP = latestPolls.find(
      (poll: any) => poll.poll === "Playoff Committee Rankings"
    );
    const AP = latestPolls.find((poll: any) => poll.poll === "AP Top 25");

    const rankingsRes = CFP || AP;

    return NextResponse.json(rankingsRes, { status: 200 });
  } catch (err) {
    console.log(err);
  }
}
