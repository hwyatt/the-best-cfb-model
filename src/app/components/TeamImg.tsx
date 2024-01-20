import { useState } from "react";

const TeamImg = (props: any) => {
  const { fallback = null, ...imgProps } = props;
  const [isBroken, setIsBroken] = useState(false);

  function handleError() {
    setIsBroken(true);
  }

  return (
    <>
      {imgProps.src && !isBroken ? (
        <img onError={handleError} {...imgProps} />
      ) : (
        fallback
      )}
    </>
  );
};

export default TeamImg;
