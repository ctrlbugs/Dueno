import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import type { EstateProperty } from "../../../../data/estateProperties";
import BuyGridPropertyCard from "./BuyGridPropertyCard";
import { listingCarouselBreakpoints } from "./listingResponsive";
import "../../../../../node_modules/swiper/swiper.css";
import "../../../../../node_modules/swiper/modules/navigation.css";

type EstatePropertyCarouselProps = {
  properties: EstateProperty[];
  title?: string;
  className?: string;
};

const bindCarouselNavigation = (
  swiper: SwiperInstance,
  prevEl: HTMLButtonElement | null,
  nextEl: HTMLButtonElement | null,
) => {
  if (!prevEl || !nextEl) {
    return;
  }

  const navigation = swiper.params.navigation;
  if (!navigation || typeof navigation !== "object") {
    return;
  }

  navigation.prevEl = prevEl;
  navigation.nextEl = nextEl;
  swiper.navigation.destroy();
  swiper.navigation.init();
  swiper.navigation.update();
};

const EstatePropertyCarousel = ({
  properties,
  title,
  className = "",
}: EstatePropertyCarouselProps) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const showNav = properties.length > 1;

  if (properties.length === 0) {
    return null;
  }

  return (
    <div
      className={`featured-properties-swiper-wrap custom-properties-items ${className}`.trim()}
    >
      {title ? (
        <div className="featured-properties-swiper-header mb-4">
          <h4 className="mb-0">{title}</h4>
        </div>
      ) : null}
      {showNav ? (
        <div className="featured-properties-swiper-toolbar">
          <button
            type="button"
            ref={prevRef}
            className="featured-swiper-btn featured-swiper-prev"
            aria-label="Previous property"
          >
            <i className="material-icons-outlined">chevron_left</i>
          </button>
          <button
            type="button"
            ref={nextRef}
            className="featured-swiper-btn featured-swiper-next"
            aria-label="Next property"
          >
            <i className="material-icons-outlined">chevron_right</i>
          </button>
        </div>
      ) : null}
      <Swiper
        className="featured-properties-swiper"
        modules={[Keyboard, Navigation]}
        onBeforeInit={(swiper) => {
          if (!showNav) {
            return;
          }

          const navigation = swiper.params.navigation;
          if (!navigation || typeof navigation !== "object") {
            return;
          }

          navigation.prevEl = prevRef.current;
          navigation.nextEl = nextRef.current;
        }}
        onSwiper={(swiper) => {
          if (showNav) {
            bindCarouselNavigation(swiper, prevRef.current, nextRef.current);
          }
        }}
        slidesPerView={1}
        slidesPerGroup={1}
        spaceBetween={24}
        speed={400}
        keyboard={{ enabled: true }}
        navigation={
          showNav
            ? {
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }
            : false
        }
        watchOverflow={true}
        breakpoints={listingCarouselBreakpoints}
      >
        {properties.map((property) => (
          <SwiperSlide key={property.id}>
            <BuyGridPropertyCard property={property} layout="carousel" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default EstatePropertyCarousel;
