import { Metadata } from "next";
import Bracket from "../components/Bracket";

export const metadata: Metadata = {
  title: "Bracket",
  description: `Build a CFP Bracket on SaturdayStats.com.`,
};

export default async function BracketPage() {
  return <Bracket />;
}
