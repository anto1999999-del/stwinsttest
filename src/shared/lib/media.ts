import { useEffect, useState } from "react";

export const useTabletAndBelowMediaQuery = (
  mediaQuery: string = "(max-width: 1025px)"
) => {
  const getMatches = (query: string) =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false;

  const [matches, setMatches] = useState<boolean>(() => getMatches(mediaQuery));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const matchMedia = window.matchMedia(mediaQuery);

    const handleChange = () => {
      setMatches(getMatches(mediaQuery));
    };

    matchMedia.addEventListener("change", handleChange);

    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [mediaQuery]);

  return matches;
};
