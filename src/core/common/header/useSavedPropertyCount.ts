import { useEffect, useState } from "react";
import {
  getSavedPropertyCountForUser,
  getVisitorId,
  subscribePropertyReviews,
} from "../../../services/propertyReviewStore";

export const useSavedPropertyCount = () => {
  const [count, setCount] = useState(() =>
    getSavedPropertyCountForUser(getVisitorId()),
  );

  useEffect(() => {
    const refresh = () =>
      setCount(getSavedPropertyCountForUser(getVisitorId()));
    refresh();
    return subscribePropertyReviews(refresh);
  }, []);

  return count;
};
