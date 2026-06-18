import { useEffect, useState } from "react";
import {
  getVisitorId,
  isPropertyBookmarked,
  isPropertySaved,
  subscribePropertyReviews,
  togglePropertyBookmark,
  togglePropertySaved,
} from "../../services/propertyReviewStore";

type Props = {
  propertyId: string;
};

const PropertyHeaderEngagement = ({ propertyId }: Props) => {
  const userId = getVisitorId();
  const [saved, setSaved] = useState(() => isPropertySaved(propertyId, userId));
  const [bookmarked, setBookmarked] = useState(() =>
    isPropertyBookmarked(propertyId, userId),
  );

  useEffect(() => {
    const refresh = () => {
      setSaved(isPropertySaved(propertyId, userId));
      setBookmarked(isPropertyBookmarked(propertyId, userId));
    };
    refresh();
    return subscribePropertyReviews(refresh);
  }, [propertyId, userId]);

  return (
    <div className="breadcrumb-icons d-flex align-items-center justify-content-xl-end justify-content-start gap-2 mb-xl-4">
      <button
        type="button"
        className="btn btn-link p-0 border-0"
        onClick={() => setSaved(togglePropertySaved(propertyId, userId))}
        aria-label={saved ? "Remove from favorites" : "Save to favorites"}
        title={saved ? "Saved" : "Save property"}
      >
        <i
          className={`material-icons-outlined rounded ${saved ? "text-danger" : ""}`}
        >
          {saved ? "favorite" : "favorite_border"}
        </i>
      </button>
      <button
        type="button"
        className="btn btn-link p-0 border-0"
        onClick={() => setBookmarked(togglePropertyBookmark(propertyId, userId))}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark property"}
        title={bookmarked ? "Bookmarked" : "Bookmark property"}
      >
        <i
          className={`material-icons-outlined rounded ${bookmarked ? "text-primary" : ""}`}
        >
          {bookmarked ? "bookmark" : "bookmark_add"}
        </i>
      </button>
      <button
        type="button"
        className="btn btn-link p-0 border-0"
        aria-label="Compare property"
        title="Compare (coming soon)"
        disabled
      >
        <i className="material-icons-outlined rounded opacity-50">compare_arrows</i>
      </button>
    </div>
  );
};

export default PropertyHeaderEngagement;
