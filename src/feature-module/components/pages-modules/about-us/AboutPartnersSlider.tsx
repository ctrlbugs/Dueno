import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard } from "swiper/modules";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { PARTNER_LOGOS } from "../../../../data/partnerLogos";
import "../../../../../node_modules/swiper/swiper.css";

const AboutPartnersSlider = () => {
  const sliderLogos = [...PARTNER_LOGOS, ...PARTNER_LOGOS];
  const enableLoop = sliderLogos.length > 1;

  return (
    <div className="about-partners-slider-wrap">
      <Swiper
        modules={[Autoplay, Keyboard]}
        className="about-partners-slider"
        slidesPerView={2}
        spaceBetween={16}
        loop={enableLoop}
        speed={4500}
        autoplay={
          enableLoop
            ? {
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        freeMode={false}
        keyboard={{ enabled: true }}
        breakpoints={{
          576: { slidesPerView: 3, spaceBetween: 16 },
          768: { slidesPerView: 4, spaceBetween: 18 },
          992: { slidesPerView: 5, spaceBetween: 20 },
          1200: { slidesPerView: 6, spaceBetween: 20 },
        }}
      >
        {sliderLogos.map((logo, index) => (
          <SwiperSlide key={`${logo}-${index}`}>
            <div className="about-partner-card">
              <ImageWithBasePath
                src={logo}
                alt={`Partner logo ${(index % PARTNER_LOGOS.length) + 1}`}
                className="about-partner-logo"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AboutPartnersSlider;
