"use client";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white py-4 px-8">
      <div
        className="container mx-auto flex justify-between items-center w-full"
        style={{ maxWidth: "1312px" }}
      >
        <div className="text-gray-800 font-bold text-xl">
          <a href="/">Saturday Stats</a>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            <FaBars className="font-semibold text-gray-800 text-2xl" />
          </button>
        </div>
        <div className={`md:flex md:gap-8 ${isOpen ? "block" : "hidden"}`}>
          <a href="/teams" className="font-semibold text-gray-800">
            Teams
          </a>
          <a href="/compare" className="font-semibold text-gray-800">
            Model
          </a>
          <a href="/bracket" className="font-semibold text-gray-800">
            Bracket
          </a>
          <a href="/portal" className="font-semibold text-gray-800">
            Portal
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
