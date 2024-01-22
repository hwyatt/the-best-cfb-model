import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Container from "./components/Container";
import Navbar from "./components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saturday Stats",
  description: `America's Next Top CFB Model`,
  openGraph: {
    images: "https://i.ibb.co/pR872L3/tbcfbm.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <Container>
          <div className="w-full mx-auto" style={{ maxWidth: "1312px" }}>
            {children}
          </div>
        </Container>
      </body>
    </html>
  );
}
