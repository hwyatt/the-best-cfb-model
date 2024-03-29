import { NextResponse } from "next/server";

const BASE_URL = "https://api.collegefootballdata.com";
const BEARER_TOKEN =
  "8474sJ42lQEtgWGBYsru+i6Ltl9k05P+Ohf/ZccNOMc7xow9G409Cm2QxLbJxyaw";
const SCOREBOARD = "/scoreboard";

export async function GET(request: any) {
  const ENDPOINT = `${BASE_URL}${SCOREBOARD}`;
  try {
    const randomNumber = () => Math.floor(Math.random() * (69 - 2 + 1)) + 2;

    // const res = await fetch(ENDPOINT, {
    //     headers: {
    //         Authorization: `Bearer ${BEARER_TOKEN}`,
    //     },
    // });

    // if (!res.ok) {
    //     throw new Error("Failed to fetch data");
    // }

    // const json = await res.json();

    const mock = [
      {
        id: 0,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 2,
        clock: "3:49",
        situation: "string",
        possession: "home",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Georgia",
          conference: "string",
          classification: "string",
          points: randomNumber(),
        },
        awayTeam: {
          id: 0,
          name: "Missouri",
          conference: "string",
          classification: "string",
          points: randomNumber(),
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 1,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "2:20",
        situation: "1st & 10 at ALA 18",
        possession: "away",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Alabama",
          conference: "string",
          classification: "string",
          points: randomNumber(),
        },
        awayTeam: {
          id: 0,
          name: "Ole Miss",
          conference: "string",
          classification: "string",
          points: randomNumber(),
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 2,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "2:20",
        situation: "string",
        possession: "home",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Duke",
          conference: "string",
          classification: "string",
          points: 7,
        },
        awayTeam: {
          id: 0,
          name: "Texas A&M",
          conference: "string",
          classification: "string",
          points: 32,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 3,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "2:20",
        situation: "string",
        possession: "home",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Oregon",
          conference: "string",
          classification: "string",
          points: 79,
        },
        awayTeam: {
          id: 0,
          name: "Mississippi State",
          conference: "string",
          classification: "string",
          points: 14,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 4,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "15:00",
        situation: "1st & 10 at NEB 18",
        possession: "away",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Washington",
          conference: "string",
          classification: "string",
          points: 79,
        },
        awayTeam: {
          id: 0,
          name: "Southern Mississippi",
          conference: "string",
          classification: "string",
          points: 14,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 5,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "2:20",
        situation: "MICH - Rushing Touchdown",
        possession: "away",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Texas",
          conference: "string",
          classification: "string",
          points: 7,
        },
        awayTeam: {
          id: 0,
          name: "LSU",
          conference: "string",
          classification: "string",
          points: 14,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 6,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 2,
        clock: "3:49",
        situation: "string",
        possession: "home",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Georgia",
          conference: "string",
          classification: "string",
          points: 21,
        },
        awayTeam: {
          id: 0,
          name: "Missouri",
          conference: "string",
          classification: "string",
          points: 14,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 7,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "2:20",
        situation: "string",
        possession: "away",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Tennessee",
          conference: "string",
          classification: "string",
          points: 48,
        },
        awayTeam: {
          id: 0,
          name: "Ole Miss",
          conference: "string",
          classification: "string",
          points: 14,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 8,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "2:20",
        situation: "string",
        possession: "home",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Duke",
          conference: "string",
          classification: "string",
          points: 7,
        },
        awayTeam: {
          id: 0,
          name: "Texas A&M",
          conference: "string",
          classification: "string",
          points: 32,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 9,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "2:20",
        situation: "string",
        possession: "home",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Oregon",
          conference: "string",
          classification: "string",
          points: 79,
        },
        awayTeam: {
          id: 0,
          name: "Mississippi State",
          conference: "string",
          classification: "string",
          points: 14,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 10,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "15:00",
        situation: "1st & 10 at NEB 18",
        possession: "away",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Washington",
          conference: "string",
          classification: "string",
          points: 79,
        },
        awayTeam: {
          id: 0,
          name: "Southern Mississippi",
          conference: "string",
          classification: "string",
          points: 14,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 11,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "2:20",
        situation: "MICH - Rushing Touchdown",
        possession: "away",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Texas",
          conference: "string",
          classification: "string",
          points: 7,
        },
        awayTeam: {
          id: 0,
          name: "LSU",
          conference: "string",
          classification: "string",
          points: 14,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 12,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 2,
        clock: "3:49",
        situation: "string",
        possession: "home",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Georgia",
          conference: "string",
          classification: "string",
          points: 21,
        },
        awayTeam: {
          id: 0,
          name: "Missouri",
          conference: "string",
          classification: "string",
          points: 14,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 13,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "2:20",
        situation: "string",
        possession: "away",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Oklahoma",
          conference: "string",
          classification: "string",
          points: 48,
        },
        awayTeam: {
          id: 0,
          name: "Ole Miss",
          conference: "string",
          classification: "string",
          points: 14,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 14,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "2:20",
        situation: "string",
        possession: "home",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Duke",
          conference: "string",
          classification: "string",
          points: 7,
        },
        awayTeam: {
          id: 0,
          name: "Texas A&M",
          conference: "string",
          classification: "string",
          points: 32,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 15,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "2:20",
        situation: "string",
        possession: "home",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Oregon",
          conference: "string",
          classification: "string",
          points: 79,
        },
        awayTeam: {
          id: 0,
          name: "Mississippi State",
          conference: "string",
          classification: "string",
          points: 14,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 16,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "15:00",
        situation: "1st & 10 at NEB 18",
        possession: "away",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Washington",
          conference: "string",
          classification: "string",
          points: 79,
        },
        awayTeam: {
          id: 0,
          name: "Southern Mississippi",
          conference: "string",
          classification: "string",
          points: 14,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
      {
        id: 17,
        startDate: "string",
        startTimeTBD: true,
        tv: "string",
        neutralSite: true,
        conferenceGame: true,
        status: "string",
        period: 4,
        clock: "2:20",
        situation: "MICH - Rushing Touchdown",
        possession: "away",
        venue: {
          name: "string",
          city: "string",
          state: "string",
        },
        homeTeam: {
          id: 0,
          name: "Texas",
          conference: "string",
          classification: "string",
          points: 7,
        },
        awayTeam: {
          id: 0,
          name: "LSU",
          conference: "string",
          classification: "string",
          points: 14,
        },
        weather: {
          temperature: 0,
          description: "string",
          windSpeed: 0,
          windDirection: 0,
        },
        betting: {
          spread: 0,
          overUnder: 0,
          homeMoneyline: 0,
          awayMoneyline: 0,
        },
      },
    ];

    return NextResponse.json(mock, { status: 200 });
  } catch (err) {
    console.log(err);
  }
}
