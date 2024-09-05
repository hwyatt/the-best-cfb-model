export default async function PlaysPage() {
  //   const getPlays = await fetch(`/api/plays`);
  //   const plays = await getPlays.json();
  //   const numberEmojis = [
  //     "1️⃣",
  //     "2️⃣",
  //     "3️⃣",
  //     "4️⃣",
  //     "5️⃣",
  //     "6️⃣",
  //     "7️⃣",
  //     "8️⃣",
  //     "9️⃣",
  //     "🔟",
  //   ];
  //   return (
  //     <div>
  //       {plays
  //         .filter((play: any) => !play.play_text.includes("Adam Jones")) // Filter out the plays
  //         .map((play: any, index: number) => (
  //           <div key={index}>
  //             {/* Add the number emoji */}
  //             {numberEmojis[index]}{" "}
  //             {play.play_text
  //               .replace(/\(.*?\)/g, "")
  //               .replace("pass complete to", "➡️")
  //               .replace("pass from", "⬅️")
  //               .replace(" for a TD", "")
  //               .replace("Yd Run", "Yards")
  //               .replace("run for", "")
  //               .trim()}
  //             {/* <div>{play.home}</div> */}
  //           </div>
  //         ))}
  //     </div>
  //  );
}
