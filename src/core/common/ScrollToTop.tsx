import { useEffect } from "react";
import { useLocation } from "react-router";

/** Reset scroll position on route changes (SPA pages were opening mid-page). */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
