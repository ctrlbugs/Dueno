import { useState } from "react";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";

type PropertyVideoPlayerProps = {
  embedUrl: string;
  poster: string;
  title: string;
};

const PropertyVideoPlayer = ({
  embedUrl,
  poster,
  title,
}: PropertyVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <div className="property-video-embed">
        <iframe
          src={`${embedUrl}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="video-items position-relative">
      <ImageWithBasePath
        src={poster}
        alt={`${title} video`}
        className="img-fluid video-bg"
      />
      <button
        type="button"
        className="video-icon"
        onClick={() => setIsPlaying(true)}
        aria-label="Play property video"
      >
        <i className="material-icons-outlined">play_circle_filled</i>
      </button>
    </div>
  );
};

export default PropertyVideoPlayer;
