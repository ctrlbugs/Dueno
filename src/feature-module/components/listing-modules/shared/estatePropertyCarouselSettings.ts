export const estateCarouselInteractionRef = { dragging: false };

export const getEstatePropertyCarouselSettings = (propertyCount: number) => ({
  dots: false,
  infinite: propertyCount > 1,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  arrows: propertyCount > 1,
  swipeToSlide: true,
  touchThreshold: 8,
  centerMode: false,
  centerPadding: "0",
  variableWidth: false,
  mobileFirst: true,
  beforeChange: () => {
    estateCarouselInteractionRef.dragging = true;
  },
  afterChange: () => {
    window.setTimeout(() => {
      estateCarouselInteractionRef.dragging = false;
    }, 0);
  },
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: Math.min(2, propertyCount),
        slidesToScroll: 1,
        arrows: propertyCount > 2,
        infinite: propertyCount > 2,
        swipeToSlide: true,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: Math.min(3, propertyCount),
        slidesToScroll: 1,
        arrows: propertyCount > 3,
        infinite: propertyCount > 3,
        swipeToSlide: true,
      },
    },
  ],
});
