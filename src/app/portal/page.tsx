import { Metadata } from "next";
import Portal from "../components/Portal";

export const metadata: Metadata = {
  title: "Portal",
  description: `Traverse the Transfer Portal on SaturdayStats.com.`,
};

export default async function PortalPage() {
  return <Portal />;
}
