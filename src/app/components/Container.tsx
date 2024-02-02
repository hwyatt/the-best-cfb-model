"use client";
import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => (
  <main className="flex min-h-screen flex-col items-center justify-between pb-16 md:pb-8 p-8 bg-gray-200">
    {children}
  </main>
);

export default Container;
