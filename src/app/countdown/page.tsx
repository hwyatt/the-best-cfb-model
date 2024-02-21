"use client";
import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";

const scrollingTextContent =
  "Thanks for tuning in to the Saturday Stats college football countdown presented by SaturdayStats.com. While you wait on College Football to kickoff again visit SaturdayStats.com to build a CFP bracket, model two teams against one another, and browse stats for every area of the game.";

const CountdownToAugust24 = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date("2024-08-24") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const addLeadingZero = (value: any) => {
    return value < 10 ? `0${value}` : value;
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <img src={"Saturday Stats.png"} className="max-h-10 w-auto" />
        <h2 className="font-semibold uppercase text-gray-600">
          Countdown to College Football
        </h2>
      </div>
      <div className="flex justify-center items-center gap-2 text-8xl h-96 text-gray-800 font-bold absolute inset-0	m-auto">
        {timeLeft.days > 0 && (
          <div>
            <span>{timeLeft.days}</span>
            <span className="font-light text-gray-600">d</span>
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex">
            <span>{addLeadingZero(timeLeft.hours)}</span>
            <span className="font-light text-gray-600">h</span>
          </div>
          <div className="flex">
            <span>{addLeadingZero(timeLeft.minutes)}</span>
            <span className="font-light text-gray-600">m</span>
          </div>
          <div className="flex">
            <span>{addLeadingZero(timeLeft.seconds)}</span>
            <span className="font-light text-gray-600">s</span>
          </div>
        </div>
      </div>
      <Marquee
        className="bg-gray-800 text-white py-2 bottom-0 left-0 right-0 text-lg"
        style={{ position: "fixed" }}
      >
        {scrollingTextContent}
      </Marquee>
    </div>
  );
};

export default CountdownToAugust24;
