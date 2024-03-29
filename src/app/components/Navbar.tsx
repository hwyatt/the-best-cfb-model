"use client";
import { useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";
import Footer from "./Footer";

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
            <MdOutlineMenu
              className={`${
                isOpen ? "hidden" : "block"
              } font-semibold text-gray-800 text-3xl`}
            />
            <MdOutlineClose
              className={`${
                isOpen ? "block" : "hidden"
              } font-semibold text-gray-800 text-3xl`}
            />
          </button>
        </div>
        <div className={`md:flex md:gap-8 hidden text-lg`}>
          <a href="/stats" className="font-bold text-gray-800">
            Stats
          </a>
          <a href="/model" className="font-bold text-gray-800">
            Model
          </a>
          <a href="/bracket" className="font-bold text-gray-800">
            Bracket
          </a>
          <a href="/portal" className="font-bold text-gray-800">
            Portal
          </a>
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-4">
          <div className={`flex flex-col w-full md:hidden`}>
            <a
              href="/stats"
              className="flex items-center justify-between text-2xl font-bold text-gray-800 border-y-2 py-4"
            >
              <div>Teams</div>
              <MdOutlineArrowForwardIos />
            </a>
            <a
              href="/model"
              className="flex items-center justify-between text-2xl font-bold text-gray-800 border-b-2 py-4"
            >
              <div>Model</div>
              <MdOutlineArrowForwardIos />
            </a>
            <a
              href="/bracket"
              className="flex items-center justify-between text-2xl font-bold text-gray-800 border-b-2 py-4"
            >
              <div>Bracket</div>
              <MdOutlineArrowForwardIos />
            </a>
            <a
              href="/portal"
              className="flex items-center justify-between text-2xl font-bold text-gray-800 border-b-2 py-4"
            >
              <div>Portal</div>
              <MdOutlineArrowForwardIos />
            </a>
          </div>
          <div>
            <Footer />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
