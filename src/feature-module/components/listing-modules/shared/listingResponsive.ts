/** Bootstrap md — iPad / tablet portrait and up */
export const LISTING_TABLET_BREAKPOINT = 768;

/** Bootstrap xl — desktop three-column grid */
export const LISTING_DESKTOP_BREAKPOINT = 1200;

export const listingCarouselBreakpoints = {
  [LISTING_TABLET_BREAKPOINT]: {
    slidesPerView: 2,
    slidesPerGroup: 1,
    spaceBetween: 20,
  },
  [LISTING_DESKTOP_BREAKPOINT]: {
    slidesPerView: 3,
    slidesPerGroup: 1,
    spaceBetween: 24,
  },
} as const;
