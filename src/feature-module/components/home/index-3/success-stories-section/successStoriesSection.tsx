import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectFade,
  Keyboard,
  Pagination,
} from "swiper/modules";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import {
  chunkSuccessStoryTestimonials,
  SUCCESS_STORY_CARDS_PER_SLIDE,
  SUCCESS_STORY_TESTIMONIALS,
  type Testimonial,
} from "../../../../../data/siteAvatars";
import "../../../../../../node_modules/swiper/swiper.css";
import "../../../../../../node_modules/swiper/modules/effect-fade.css";
import "../../../../../../node_modules/swiper/modules/pagination.css";

const TestimonialCard = ({
  quote,
  name,
  location,
  avatar,
  rating,
}: Testimonial) => (
  <div className="review-item mb-4">
    <span className="d-block mb-3 review-quote">
      <ImageWithBasePath
        src="assets/img/icons/quote-down-02.svg"
        className="review-quote-icon"
        alt=""
        width={30}
        height={30}
      />
    </span>
    <div className="d-flex align-items-center mb-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <i
          key={index}
          className={`material-icons-outlined ${
            index < rating ? "text-warning" : "text-muted opacity-50"
          }`}
        >
          star
        </i>
      ))}
    </div>
    <p>{quote}</p>
    <div className="review-customer">
      <span className="avatar avatar-md rounded-circle flex-shrink-0 me-2 overflow-hidden">
        <ImageWithBasePath
          src={avatar}
          className="img-fluid border border-white rounded-circle customer-avatar-img"
          alt={name}
        />
      </span>
      <h6 className="me-2 mb-0">
        <Link to="#">{name}</Link>
      </h6>
      <span className="d-inline-flex align-items-center">
        <i className="fa-solid fa-circle me-2" />
        {location}
      </span>
    </div>
  </div>
);

const SuccessStorySlide = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const leftColumn = testimonials.slice(0, 2);
  const rightColumn = testimonials.slice(2, SUCCESS_STORY_CARDS_PER_SLIDE);

  return (
    <div className="row success-stories-slide">
      <div className="col-md-6">
        {leftColumn.map((testimonial) => (
          <TestimonialCard key={testimonial.id} {...testimonial} />
        ))}
      </div>
      <div className="col-md-6 mt-4 mt-md-4">
        {rightColumn.map((testimonial) => (
          <TestimonialCard key={testimonial.id} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

const SuccessStoriesSection = () => {
  const slides = chunkSuccessStoryTestimonials(SUCCESS_STORY_TESTIMONIALS);
  const enableCarousel = slides.length > 1;

  return (
    <>
      <section className="success-stories-section" id="client-stories">
        <div className="section-bg">
          <ImageWithBasePath
            src="assets/img/home-3/bg/sec-bg-07.png"
            className="bg-1"
            alt=""
          />
          <ImageWithBasePath
            src="assets/img/home-3/bg/sec-bg-10.png"
            className="bg-2"
            alt=""
          />
        </div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4">
              <div className="section-left-content">
                <div className="section-headings mb-4">
                  <div className="sec-line-three justify-content-start mb-3">
                    <span className="sec-line1" />
                    <span className="sec-line2" />
                  </div>
                  <h2 className="mb-2">Success stories in their own words</h2>
                  <p className="mb-4">
                    Read what our satisfied clients have to say about their
                    experiences with our platform.
                  </p>
                  <Link
                    to="#"
                    className="btn btn-dark d-inline-flex align-items-center"
                  >
                    View More
                    <i className="material-icons-outlined ms-1">north_east</i>
                  </Link>
                </div>
                <div className="success-customer mb-4">
                  <h6>Trusted by 2K customers</h6>
                  <div className="d-flex align-items-center rating mb-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <i
                        key={index}
                        className="material-icons-outlined text-warning"
                      >
                        star
                      </i>
                    ))}
                    4.3/5.0
                    <span className="border-start ps-2 ms-2">857 Reviews</span>
                  </div>
                </div>
                <div className="arrow-bottom">
                  <ImageWithBasePath
                    src="assets/img/home-3/bg/arrow.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <Swiper
                modules={[Autoplay, EffectFade, Keyboard, Pagination]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={650}
                slidesPerView={1}
                loop={enableCarousel}
                autoplay={
                  enableCarousel
                    ? {
                        delay: 5500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }
                    : false
                }
                pagination={
                  enableCarousel
                    ? {
                        clickable: true,
                        dynamicBullets: true,
                      }
                    : false
                }
                keyboard={{ enabled: true }}
                className={`success-stories-carousel${
                  enableCarousel ? " success-stories-carousel--active" : ""
                }`}
              >
                {slides.map((testimonials, slideIndex) => (
                  <SwiperSlide key={`success-story-slide-${slideIndex}`}>
                    <SuccessStorySlide testimonials={testimonials} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SuccessStoriesSection;
