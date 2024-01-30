"use client";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { MdOutlineArrowForwardIos } from "react-icons/md";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`bg-white py-4 px-8 ${isOpen && `fixed inset-0`}`}
      style={{ zIndex: 1000 }}
    >
      <div
        className={`container mx-auto flex justify-between items-center w-full ${
          isOpen && `mb-16 md:mb-0`
        }`}
        style={{ maxWidth: "1312px" }}
      >
        <div className="text-gray-800 font-bold text-xl">
          <a href="/">
            <img src="Saturday Stats.png" className="max-h-10" />
          </a>
        </div>
        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu}>
            <FaBars className="font-semibold text-gray-800 text-2xl" />
          </button>
        </div>
        <div className={`md:flex md:gap-8 hidden`}>
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
      {isOpen && (
        <div className={`flex flex-col w-full md:hidden`}>
          <a
            href="/teams"
            className="flex items-center justify-between text-2xl font-semibold text-gray-800 border-y-2 py-4"
          >
            <div>Teams</div>
            <MdOutlineArrowForwardIos />
          </a>
          <a
            href="/compare"
            className="flex items-center justify-between text-2xl font-semibold text-gray-800 border-b-2 py-4"
          >
            <div>Model</div>
            <MdOutlineArrowForwardIos />
          </a>
          <a
            href="/bracket"
            className="flex items-center justify-between text-2xl font-semibold text-gray-800 border-b-2 py-4"
          >
            <div>Bracket</div>
            <MdOutlineArrowForwardIos />
          </a>
          <a
            href="/portal"
            className="flex items-center justify-between text-2xl font-semibold text-gray-800 border-b-2 py-4"
          >
            <div>Portal</div>
            <MdOutlineArrowForwardIos />
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
