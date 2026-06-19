import { useEffect, useMemo, useState } from "react";
import {
  getContextualArticleImage,
  isRemoteImageUrl,
} from "../../../services/propertyNewsService";

type NewsImageProps = {
  src: string;
  alt: string;
  className?: string;
  slot?: number;
  category?: string;
  description?: string;
  excludeUrls?: string[];
};

export const NewsImage = ({
  src,
  alt,
  className,
  slot = 0,
  category = "Market News",
  description = "",
  excludeUrls = [],
}: NewsImageProps) => {
  const articleContext = useMemo(
    () => ({
      title: alt,
      description: description || alt,
      category,
      imageUrl: src,
    }),
    [alt, category, description, src],
  );

  const resolvedSrc = useMemo(() => {
    if (isRemoteImageUrl(src)) {
      return src;
    }

    return getContextualArticleImage(articleContext, new Set(excludeUrls), slot);
  }, [articleContext, excludeUrls, slot, src]);

  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setCurrentSrc(resolvedSrc);
    setAttempt(0);
  }, [resolvedSrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        const exclude = new Set([...excludeUrls, currentSrc]);
        const nextSrc = getContextualArticleImage(
          { ...articleContext, imageUrl: "" },
          exclude,
          slot + attempt + 1,
        );
        if (nextSrc !== currentSrc) {
          setCurrentSrc(nextSrc);
          setAttempt((value) => value + 1);
        }
      }}
    />
  );
};
