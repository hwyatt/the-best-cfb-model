import { useState, useEffect } from "react";

const useWindowDimensions = () => {
  const isClient = typeof window === "object";

  const [windowDimensions, setWindowDimensions] = useState({
    width: isClient ? window.innerWidth : 0,
    height: isClient ? window.innerHeight : 0,
  });

  const handleResize = () => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    if (isClient) {
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isClient]);

  return windowDimensions;
};

export default useWindowDimensions;
