import { Metadata } from "next";
import Stats from "../components/Stats";

export const metadata: Metadata = {
  title: "Stats",
  description: `See all your favorite CFB stats on SaturdayStats.com.`,
};

export default async function StatsPage() {
  return <Stats />;
}
