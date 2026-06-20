import Slider from "react-slick";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { PARTNER_LOGOS } from "../../../../../data/partnerLogos";

const PartnersSection = () => {
  const Partner_Slider = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {/* start partners section */}
      <section className="partners-section section-padding ">
        <div className="container">
          {/* start title */}
          <div
            className="section-heading aos"
            data-aos="fade-down"
            data-aos-duration={1000}
          >
            <h2 className="mb-2 text-center">Trusted Partners Across Nigeria</h2>
            <div className="sec-line">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <p className="mb-0 text-center">
              Dueno Property works with leading brands and service providers
              across Nigeria to deliver verified listings, secure transactions,
              and a seamless property experience.
            </p>
          </div>
          {/* end title */}
          <Slider
            {...Partner_Slider}
            className="partners-slide-item partners-slider"
          >
            {PARTNER_LOGOS.map((logo, index) => (
              <div
                key={logo}
                className="partners-slide aos"
                data-aos="fade-right"
                data-aos-duration={1000 + (index % 3) * 500}
              >
                <div className="partners-items">
                  <ImageWithBasePath
                    src={logo}
                    alt={`Partner logo ${index + 1}`}
                    className="img-fluid partners-icon"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
      {/* end partners section */}
    </>
  );
};

export default PartnersSection;
