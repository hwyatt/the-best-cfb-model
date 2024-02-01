import { PiChartLineUpBold } from "react-icons/pi";
import { TbTournament } from "react-icons/tb";
import { PiCircleDashedFill } from "react-icons/pi";
import { GiAmericanFootballHelmet } from "react-icons/gi";

const Card = ({ title, copy, icon, href }: any) => {
  return (
    <a
      href={href}
      className="hover-card hover:transform hover:scale-110 transition-transform duration-300"
    >
      <div className="flex items-center justify-between gap-2 bg-white border-2 border-gray-400 rounded p-4 w-full shadow-lg hover:shadow-xl">
        <div className="w-full flex gap-2 items-center">
          <div className={`bg-gray-200 rounded-full p-2`}>
            <div className="flex items-center justify-center w-8 h-8 font-semibold">
              {icon}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <p className="text-gray-800 font-semibold mr-1">{title}</p>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">{copy}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

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
          <span className="text-gray-800 font-semibold">Saturday Stats</span>{" "}
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
        <div className="flex gap-2 self-center">
          <p className="text-lg text-center text-gray-800 font-semibold">
            #hailstats
          </p>
          <p className="text-lg text-center text-gray-800 font-semibold">
            #doitforstats
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-gray-600">Things to Do</h2>
        <div className="grid md:grid-cols-4 gap-4 md:gap-8">
          <Card
            title={"Stats"}
            copy={"See the Stats"}
            icon={<PiChartLineUpBold className="text-4xl" />}
            href={"/teams"}
          />
          <Card
            title={"Model"}
            copy={"Make a Matchup"}
            icon={<GiAmericanFootballHelmet className="text-4xl" />}
            href={"/compare"}
          />
          <Card
            title={"Bracket"}
            copy={"Build a CFP Bracket"}
            icon={<TbTournament className="text-4xl" />}
            href={"/bracket"}
          />
          <Card
            title={"Portal"}
            copy={"Traverse the Transfer Portal"}
            icon={<PiCircleDashedFill className="text-4xl" />}
            href={"/portal"}
          />
        </div>
      </div>
    </div>
  );
}
