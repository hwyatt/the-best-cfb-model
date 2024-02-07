import { Metadata } from "next";
import ContactForm from "../components/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact SaturdayStats.com.`,
};

export default async function StatsPage() {
  return (
    <div className="grid md:grid-cols-2 gap-8 w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
        <p className="text-gray-800">
          Have a question? See a data error? Want a custom scoreboard for your
          YouTube channel? Want to advertise with us? Fill out the form to email
          us.
        </p>
      </div>
      <div>
        <ContactForm />
      </div>
    </div>
  );
}
