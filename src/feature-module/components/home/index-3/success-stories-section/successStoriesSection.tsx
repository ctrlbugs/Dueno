import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { SUCCESS_STORY_TESTIMONIALS } from "../../../../../data/siteAvatars";

const TestimonialCard = ({
  quote,
  name,
  location,
  avatar,
}: (typeof SUCCESS_STORY_TESTIMONIALS)[number]) => (
  <div className="review-item mb-4">
    <span className="d-block mb-3">
      <ImageWithBasePath
        src="assets/img/icons/quote-down-02.svg"
        alt=""
      />
    </span>
    <div className="d-flex align-items-center mb-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <i key={index} className="material-icons-outlined text-warning">
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

const SuccessStoriesSection = () => {
  const [leftColumn, rightColumn] = [
    SUCCESS_STORY_TESTIMONIALS.slice(0, 2),
    SUCCESS_STORY_TESTIMONIALS.slice(2, 4),
  ];

  return (
    <>
      <section className="success-stories-section">
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
                  <h6>Trusted by 50K+ customers</h6>
                  <div className="d-flex align-items-center rating mb-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <i
                        key={index}
                        className="material-icons-outlined text-warning"
                      >
                        star
                      </i>
                    ))}
                    4.4/5.0
                    <span className="border-start ps-2 ms-2">
                      3,857 Reviews
                    </span>
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
              <div className="row">
                <div className="col-md-6">
                  {leftColumn.map((testimonial) => (
                    <TestimonialCard key={testimonial.id} {...testimonial} />
                  ))}
                </div>
                <div className="col-md-6 mt-4">
                  {rightColumn.map((testimonial) => (
                    <TestimonialCard key={testimonial.id} {...testimonial} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SuccessStoriesSection;
