import Container from "./container";

const BASE_URL = "https://api.collegefootballdata.com";
const BEARER_TOKEN =
    "8474sJ42lQEtgWGBYsru+i6Ltl9k05P+Ohf/ZccNOMc7xow9G409Cm2QxLbJxyaw";
const TEAMS = "/teams/fbs";
const ROSTER = "/roster";

async function getData() {
    const res = await fetch(`${BASE_URL}${TEAMS}`, {
        headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

async function getRoster(team: string, year: number) {
    const res = await fetch(
        `${BASE_URL}${ROSTER}?${team && `team=${team}`}${
            year && `year=${year}`
        }`,
        {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export default async function Home() {
    const data = await getData();

    const roster = await getRoster("Alabama", 2022);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-200">
            {/* <div className="flex flex-col gap-2">
                <label>Select a Team</label>
                <select>
                    {data.map((team: any) => {
                        return <Container key={team.id} data={team} />;
                    })}
                </select>
            </div> */}
            <Container data={data} />
            {/* {data.length > 0 && (
                <>
                    {console.log(data[0])}
                    {console.log(data[0].name)}
                    <p key={data[0].id}>{data[0].name}</p>
                </>
            )} */}
        </main>
    );
}
