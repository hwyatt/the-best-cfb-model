// const BASE_URL = "https://api.collegefootballdata.com";
// const BEARER_TOKEN =
//   "8474sJ42lQEtgWGBYsru+i6Ltl9k05P+Ohf/ZccNOMc7xow9G409Cm2QxLbJxyaw";
// const TEAMS = "/teams/fbs";
// const ROSTER = "/roster";

// export async function getData() {
//   const res = await fetch(`${BASE_URL}${TEAMS}`, {
//     headers: {
//       Authorization: `Bearer ${BEARER_TOKEN}`,
//     },
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch data");
//   }

//   return res.json();
// }

export default async function Home() {
  return (
    <div className="flex flex-col gap-8 w-full md:mt-8">
      <div className="flex flex-col gap-4 px-4 self-center max-w-64">
        <div className="object-fit-contain">
          <img src="icon.png" className="w-full h-auto" />
        </div>
        <div className="object-fit-contain">
          <img src="HAILSTATS.png" className="w-full h-auto" />
          <h1 className="hidden">Hail Stats</h1>
        </div>
      </div>
      <div className="self-center md:mb-8 flex flex-col gap-4">
        <p className="text-gray-600 text-center max-w-3xl">
          <span className="text-gray-800 font-semibold">Saturday Stats</span>
          {`is
          the home of America's Next Top CFB Model`}{" "}
          and all your favorite CFB stats. <br className="hidden md:block" />
          Explore stats for every area of the game and see how your favorite
          team ranks for each stat. Model two teams from any two seasons to
          settle the debate with your weird uncle. Build a bracket for the 12
          team CFP Playoff using your top 12 teams or the latest AP/CFP Committe
          top 12 each week. <br className="hidden md:block" /> Browse the
          transfer portal for players, teams, positions and other related data.
        </p>
        <p className="text-lg text-center text-gray-800 font-semibold">
          #doitforstats
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-gray-600">Things to Do</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <a href="/teams">
            <div className="md:flex md:flex-col rounded border-2 border-gray-400">
              <div className="object-fit-contain p-4 bg-white aspect-square">
                <img src="icon.png" className="w-full h-auto" />
              </div>
              <div className="bg-gray-800 text-white p-4 flex flex-col gap-1">
                <span className="font-semibold">Stats</span>
                <span className="">
                  See high level stats for every part of the game, or choose a
                  team to see their stats any given season.
                </span>
              </div>
            </div>
          </a>
          <a href="/compare">
            <div className="md:flex md:flex-col rounded border-2 border-gray-400">
              <div className="object-fit-contain p-4 bg-white">
                <img src="H2H.png" className="w-full h-auto aspect-square" />
              </div>
              <div className="bg-gray-800 text-white p-4 flex flex-col gap-1">
                <span className="font-semibold">Head to Head Model</span>
                <span className="">
                  See high level stats for every part of the game, or choose a
                  team to see their stats any given season.
                </span>
              </div>
            </div>
          </a>
          <a href="/bracket">
            <div className="md:flex md:flex-col rounded border-2 border-gray-400">
              <div className="object-fit-contain p-4 bg-white aspect-square">
                <img src="Bracket.png" className="w-full h-auto" />
              </div>
              <div className="bg-gray-800 text-white p-4 flex flex-col gap-1">
                <span className="font-semibold">Build a CFP Bracket</span>
                <span className="">
                  See high level stats for every part of the game, or choose a
                  team to see their stats any given season.
                </span>
              </div>
            </div>
          </a>
          <a href="/portal">
            <div className="md:flex md:flex-col rounded border-2 border-gray-400">
              <div className="object-fit-contain p-4 bg-white aspect-square">
                <img src="Portal.png" className="w-full h-auto" />
              </div>
              <div className="bg-gray-800 text-white p-4 flex flex-col gap-1">
                <span className="font-semibold">
                  Traverse the Transfer Portal
                </span>
                <span className="">
                  See high level stats for every part of the game, or choose a
                  team to see their stats any given season.
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
