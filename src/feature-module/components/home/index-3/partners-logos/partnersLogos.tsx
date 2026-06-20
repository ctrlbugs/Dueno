import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard } from "swiper/modules";
import "../../../../../../node_modules/swiper/swiper.css";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { PARTNER_LOGOS } from "../../../../../data/partnerLogos";

const PartnersLogos = () => {
  const sliderLogos = [...PARTNER_LOGOS, ...PARTNER_LOGOS];
  const enableLoop = sliderLogos.length > 1;

  return (
    <>
      {/* Logos Section Start */}
      <div className="partners-logos">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Swiper
                modules={[Autoplay, Keyboard]}
                className="partner-slider swiper"
                slidesPerView={2}
                spaceBetween={32}
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
                keyboard={{ enabled: true }}
                breakpoints={{
                  576: { slidesPerView: 3, spaceBetween: 32 },
                  768: { slidesPerView: 4, spaceBetween: 36 },
                  992: { slidesPerView: 5, spaceBetween: 40 },
                  1200: { slidesPerView: 6, spaceBetween: 40 },
                }}
              >
                {sliderLogos.map((logo, index) => (
                  <SwiperSlide key={`${logo}-${index}`}>
                    <div className="partner-slide text-center">
                      <ImageWithBasePath
                        src={logo}
                        alt={`Partner logo ${(index % PARTNER_LOGOS.length) + 1}`}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      {/* Logos Section End */}
    </>
  );
};

export default PartnersLogos;
