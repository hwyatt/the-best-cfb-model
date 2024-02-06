"use client";
import React, { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

interface ContainerProps {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  const pathname = usePathname();
  console.log(pathname);

  if (pathname === "/scoreboard") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between pb-16 md:pb-8 p-8 bg-gray-200">
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar />

      <main className="flex min-h-screen flex-col items-center justify-between pb-16 md:pb-8 p-8 bg-gray-200">
        <div className="w-full mx-auto" style={{ maxWidth: "1312px" }}>
          {children}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Container;
