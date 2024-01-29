// import { NextResponse } from "next/server";

// const BASE_URL = "https://api.collegefootballdata.com";
// const BEARER_TOKEN =
//   "8474sJ42lQEtgWGBYsru+i6Ltl9k05P+Ohf/ZccNOMc7xow9G409Cm2QxLbJxyaw";
// const TEAMS = "/teams/fbs";

// export async function GET(request: any) {
//   // const teamQS = request.nextUrl.searchParams.get(["team"]);
//   const ENDPOINT = `${BASE_URL}${TEAMS}`;
//   try {
//     const res = await fetch(ENDPOINT, {
//       headers: {
//         Authorization: `Bearer ${BEARER_TOKEN}`,
//       },
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch data");
//     }

//     const json = await res.json();

//     return NextResponse.json(json, { status: 200 });
//   } catch (err) {
//     console.log(err);
//   }
// }

import { NextResponse } from "next/server";

const BASE_URL = "https://api.collegefootballdata.com";
const BEARER_TOKEN =
  "8474sJ42lQEtgWGBYsru+i6Ltl9k05P+Ohf/ZccNOMc7xow9G409Cm2QxLbJxyaw";
const TEAMS = "/teams/fbs";

export async function GET(request: any) {
  const ENDPOINT = `${BASE_URL}${TEAMS}`;
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

    const teamsWithBase64Logos = await Promise.all(
      json.map(async (team: any) => {
        const logoUrl = team.logos[0]; // Assuming logos is an array with at least one element

        try {
          const { base64Logo } = await convertImageToBase64(logoUrl);

          return {
            ...team,
            base64Logo,
          };
        } catch (error: any) {
          console.error(
            `Error fetching or converting logo for team ${team.id}:`,
            error
          );
          return team; // Return the original team data in case of an error
        }
      })
    );

    return NextResponse.json(teamsWithBase64Logos, { status: 200 });
  } catch (err: any) {
    console.log(err);
  }
}

const convertImageToBase64 = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from ${imageUrl}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const base64Logo = `data:image/png;base64,${base64}`;

    return { base64Logo };
  } catch (error: any) {
    throw new Error(`Error converting image to base64: ${error.message}`);
  }
};
