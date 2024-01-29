import { NextResponse } from "next/server";

export async function POST(request: any) {
  try {
    const { playoffTeams } = await request.json();

    const teamsWithBase64Logos = await Promise.all(
      playoffTeams.map(async (team: any) => {
        const logoUrl = team.logos[0]; // Assuming logos is an array with at least one element

        try {
          const { base64Logo } = await convertImageToBase64(logoUrl);

          return {
            ...team,
            base64Logo,
          };
        } catch (error) {
          console.error(
            `Error fetching or converting logo for team ${team.id}:`,
            error
          );
          return team; // Return the original team data in case of an error
        }
      })
    );

    return NextResponse.json(teamsWithBase64Logos, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
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
    // Explicitly type the error as `Error`
    throw new Error(
      `Error converting image to base64: ${(error as Error).message}`
    );
  }
};
