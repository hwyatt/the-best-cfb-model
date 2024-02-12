import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import Container from "./components/Container";
// import Footer from "./components/Footer";
// import Navbar from "./components/Navbar";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saturday Stats",
  description: `America's Next Top CFB Model, and home for CFB stats.`,
  openGraph: {
    images: "https://i.ibb.co/F7HtK7j/SS-PP.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-200`}>
        {/* <Navbar /> */}
        <Container>{children}</Container>
        {/* <Footer /> */}
        <GoogleAnalytics gaId="G-R026BHKTYS" />
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8680983997986739"
        />
      </body>
    </html>
  );
}
