import type { EstateProperty } from "../data/estateProperties";
import type { PendingListing } from "../types/user";

/** Raw image source from a queued or published listing (path, data URL, or absolute URL). */
export const getListingThumbnailRaw = (
  listing: PendingListing,
  published?: EstateProperty | null,
): string | undefined => {
  const queuedCover =
    listing.images.find((image) => image.dataUrl?.trim())?.dataUrl ??
    listing.images[0]?.dataUrl;

  if (queuedCover?.trim()) return queuedCover.trim();

  const publishedCover = published?.cardImage?.trim();
  if (publishedCover) return publishedCover;

  const publishedImage = published?.images.find((image) => image?.trim());
  return publishedImage?.trim();
};

export const hasListingThumbnail = (
  listing: PendingListing,
  published?: EstateProperty | null,
) => Boolean(getListingThumbnailRaw(listing, published));
