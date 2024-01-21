// import Compare from "./compare/page";
import Team from "./team";

const BASE_URL = "https://api.collegefootballdata.com";
const BEARER_TOKEN =
  "8474sJ42lQEtgWGBYsru+i6Ltl9k05P+Ohf/ZccNOMc7xow9G409Cm2QxLbJxyaw";
const TEAMS = "/teams/fbs";
const ROSTER = "/roster";

export async function getData() {
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

export default async function Home() {
  const data = await getData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-200">
      <div className="w-full mx-auto" style={{ maxWidth: "1312px" }}>
        <Team data={data} />
        {/* <Compare data={data} /> */}
      </div>
    </main>
  );
}
