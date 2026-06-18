import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import Slider from "react-slick";

const PropertySection = () => {
  const property_slider = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 3,
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
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {/* start property section */}
      <section className="home-property-section section-padding bg-dark position-relative overflow-hidden">
        <div className="container">
          {/* start row */}
          <div className="row position-relative">
            <div
              className="col-lg-4 aos"
              data-aos="fade-down"
              data-aos-duration={1000}
            >
              {/* start title */}
              <div className="section-heading">
                <h2 className="mb-2 text-lg-start text-center text-white">
                  Explore by
                  <span className="d-lg-block "> Property Type </span>
                </h2>
                <div className="sec-line justify-content-lg-start">
                  <span className="sec-line1" />
                  <span className="sec-line2" />
                </div>
                <p className="mb-0 text-lg-start text-center text-light">
                  Whether you're looking for a cozy apartment, a luxurious
                  villa, or a commercial investment, we’ve got you covered.
                </p>
              </div>
              {/* end title */}
            </div>
            <div className="col-lg-8">
              <Slider {...property_slider} className="property-slider">
                <div
                  className="property-item aos"
                  data-aos="fade-up"
                  data-aos-duration={1000}
                >
                  <div className="property-card-item">
                    <div className="mb-3 text-center">
                      <ImageWithBasePath
                        src="assets/img/home/icons/property-icon-1.svg"
                        alt="property-icon-1"
                        className="m-auto"
                      />
                    </div>
                    <h5 className="mb-1"> Houses </h5>
                    <p className="mb-0"> 30 Properties</p>
                  </div>
                </div>
                <div className="property-item">
                  <div
                    className="property-card-item aos"
                    data-aos="fade-down"
                    data-aos-duration={1000}
                  >
                    <div className="mb-3 text-center">
                      <ImageWithBasePath
                        src="assets/img/home/icons/property-icon-2.svg"
                        alt="property-icon-1"
                        className="m-auto"
                      />
                    </div>
                    <h5 className="mb-1"> Offices </h5>
                    <p className="mb-0"> 45 Properties</p>
                  </div>
                </div>
                <div
                  className="property-item aos"
                  data-aos="fade-up"
                  data-aos-duration={1000}
                >
                  <div className="property-card-item">
                    <div className="mb-3 text-center">
                      <ImageWithBasePath
                        src="assets/img/home/icons/property-icon-3.svg"
                        alt="property-icon-1"
                        className="m-auto"
                      />
                    </div>
                    <h5 className="mb-1"> Villas </h5>
                    <p className="mb-0"> 28 Properties</p>
                  </div>
                </div>
                <div
                  className="property-item aos"
                  data-aos="fade-down"
                  data-aos-duration={1000}
                >
                  <div className="property-card-item">
                    <div className="mb-3 text-center">
                      <ImageWithBasePath
                        src="assets/img/home/icons/property-icon-4.svg"
                        alt="property-icon-1"
                        className="m-auto"
                      />
                    </div>
                    <h5 className="mb-1"> Apartment </h5>
                    <p className="mb-0"> 35 Properties</p>
                  </div>
                </div>
                <div
                  className="property-item aos"
                  data-aos="fade-up"
                  data-aos-duration={1000}
                >
                  <div className="property-card-item">
                    <div className="mb-3 text-center">
                      <ImageWithBasePath
                        src="assets/img/home/icons/property-icon-4.svg"
                        alt="property-icon-1"
                        className="m-auto"
                      />
                    </div>
                    <h5 className="mb-1"> Apartment </h5>
                    <p className="mb-0"> 30 Properties</p>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
          {/* end row */}
        </div>
        {/* element img */}
        <ImageWithBasePath
          src="assets/img/home/icons/property-element-1.svg"
          alt="property-element-0"
          className="img-fluid custom-element-img-1 d-lg-block d-none"
        />
        <ImageWithBasePath
          src="assets/img/home/icons/property-element-2.svg"
          alt="property-element-0"
          className="img-fluid custom-element-img-2 d-lg-block d-none"
        />
      </section>
      {/* end property section */}
    </>
  );
};

export default PropertySection;
