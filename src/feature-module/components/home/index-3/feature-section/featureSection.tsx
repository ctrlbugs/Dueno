import { useRef } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import {
  DUENO_SERVICES,
  getDuenoServicePath,
} from "../../../../../data/duenoServices";
import "../../../../../../node_modules/swiper/swiper.css";
import "../../../../../../node_modules/swiper/modules/navigation.css";

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

const FeatureSection = () => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const showNav = DUENO_SERVICES.length > 1;

  return (
    <>
      {/* Services Section Start */}
      <section className="feature-property-section services-carousel-section">
        <div className="container">
          {/* Section Title Start */}
          <div className="section-heading-three">
            <div className="sec-line-three">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <h2>Our Services</h2>
            <p>
              Everything you need for a seamless property experience across
              Nigeria
            </p>
          </div>
          {/* Section Title End */}
          <div className="services-carousel-wrap">
            {showNav ? (
              <div className="services-carousel-toolbar">
                <button
                  type="button"
                  ref={prevRef}
                  className="services-swiper-btn services-swiper-prev"
                  aria-label="Previous service"
                >
                  <i className="material-icons-outlined">chevron_left</i>
                </button>
                <button
                  type="button"
                  ref={nextRef}
                  className="services-swiper-btn services-swiper-next"
                  aria-label="Next service"
                >
                  <i className="material-icons-outlined">chevron_right</i>
                </button>
              </div>
            ) : null}
            <Swiper
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
              breakpoints={{
                576: {
                  slidesPerView: 2,
                  slidesPerGroup: 1,
                },
                992: {
                  slidesPerView: 3,
                  slidesPerGroup: 1,
                },
                1200: {
                  slidesPerView: 5,
                  slidesPerGroup: 1,
                },
              }}
              modules={[Keyboard, Navigation]}
              className="services-carousel swiper"
            >
              {DUENO_SERVICES.map((service) => {
                const servicePath = getDuenoServicePath(service.slug);
                return (
                  <SwiperSlide key={service.slug}>
                    <div className="property-item service-card">
                      <div className="property-img">
                        <Link to={servicePath}>
                          <ImageWithBasePath
                            src={service.cardImage}
                            alt={service.title}
                          />
                        </Link>
                      </div>
                      <div className="d-flex align-items-center justify-content-between property-content">
                        <div className="propery-name">
                          <h5>
                            <Link to={servicePath}>{service.title}</Link>
                          </h5>
                          {service.count != null && (
                            <p>{service.count} Property</p>
                          )}
                        </div>
                        <div className="arrow-overlay">
                          <Link to={servicePath}>
                            <i className="material-icons-outlined">north_east</i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </section>
      {/* Services Section End */}
    </>
  );
};

export default FeatureSection;
