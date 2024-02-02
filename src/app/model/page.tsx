import { Metadata } from "next";
import Model from "../components/Model";

export const metadata: Metadata = {
  title: "Model",
  description: `Model two CFB teams from any two seasons on SaturdayStats.com.`,
};

export default async function ModelPage() {
  return <Model />;
}
