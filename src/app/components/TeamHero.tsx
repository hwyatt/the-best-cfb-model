import TeamImg from "./TeamImg";

export default function TeamHero({ selectedTeam }: any) {
  return (
    <div className="relative w-full h-48 md:h-96 mb-4">
      <div className="team-hero flex justify-center items-center w-full h-full p-12 md:p-24 relative">
        {TeamImg && (
          <TeamImg
            src={selectedTeam.logos[0]}
            className="w-auto h-full object-contain z-10 p-4"
            style={{
              backgroundColor: selectedTeam.alt_color,
            }}
            alt="Team Logo"
          />
        )}
      </div>
      <div
        className={`absolute top-0 left-0 w-full h-full`}
        style={{
          backgroundColor: selectedTeam.color
            ? selectedTeam.color
            : "bg-gray-400",
        }}
      >
        <div
          className="bg-cover w-full h-full absolute top-0 left-0"
          style={{
            backgroundImage: selectedTeam.stadiumImg
              ? `url(${selectedTeam.stadiumImg})`
              : "none",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
        ></div>
      </div>
    </div>
  );
}
