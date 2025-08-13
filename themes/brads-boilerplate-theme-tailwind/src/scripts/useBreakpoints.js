

import { useEffect, useState } from "react";

const BP = {
  sm: "(min-width: 0px)",
  md: "(min-width: 767px)",
  lg: "(min-width: 1024px)",
};

export function useBreakpoints() {
  const get = () => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return { sm: false, md: false, lg: false };
    }
    return Object.fromEntries(
      Object.entries(BP).map(([k, q]) => [k, window.matchMedia(q).matches])
    );
  };

  const [state, setState] = useState(get);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mqls = Object.fromEntries(
      Object.entries(BP).map(([k, q]) => [k, window.matchMedia(q)])
    );
    const onChange = () => setState(get());

    Object.values(mqls).forEach((mql) => {
      if (mql.addEventListener) mql.addEventListener("change", onChange);
    });

    // sync once on mount
    setState(get());

    return () => {
      Object.values(mqls).forEach((mql) => {
        if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      });
    };
  }, []);

  return state;
}
