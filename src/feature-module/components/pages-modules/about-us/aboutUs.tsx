import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import AboutPartnersSlider from "./AboutPartnersSlider";

const AboutUs = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="About Us"
          paths={[{ label: "About Us", active: true }]}
        />
        {/* End Breadscrumb */}
        <div className="about-us-item-06">
          <div className="container">
            {/* start row */}
            <div className="row">
              <div className="col-lg-12 mx-auto">
                <div className="about-us-item-01">
                  <h2>Connecting Nigerians With Verified Property</h2>
                  <p className="mb-0">
                    Dueno Property is a modern Nigerian real estate platform
                    built to connect buyers, renters, and agents with verified
                    listings and trusted services. We believe property is more
                    than a transaction — it is about finding the right space,
                    in the right city, with confidence at every step. From
                    Abuja to Lagos and beyond, we combine transparent listings,
                    vetted agents, and practical support to help you move from
                    search to keys with clarity and trust.
                  </p>
                </div>
                {/* start row */}
                <div className="row row-gap-4 about-us-img-wrap">
                  <div className="col-md-4 col-lg-4">
                    <ImageWithBasePath
                      src="assets/img/about-us/about-us-01.jpg"
                      alt="img"
                      className="img-fluid rounded"
                    />
                  </div>
                  {/* end col */}
                  <div className="col-md-4 col-lg-4">
                    <ImageWithBasePath
                      src="assets/img/about-us/about-us-02.jpg"
                      alt="img"
                      className="img-fluid rounded"
                    />
                  </div>
                  {/* end col */}
                  <div className="col-md-4 col-lg-4">
                    <ImageWithBasePath
                      src="assets/img/about-us/about-us-03.jpg"
                      alt="img"
                      className="img-fluid rounded"
                    />
                  </div>
                  {/* end col */}
                </div>
                {/* end row */}
                {/* start row */}
                <div className="row row-gap-4">
                  <div className="col-md-6 col-lg-3">
                    <div className="about-us-item-02">
                      <div className="d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/about-us/listing.svg"
                          alt="image"
                          className="img-fluid me-3"
                        />
                        <div>
                          <h4 className="mb-1">50K</h4>
                          <p className="mb-0">Listings Added</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-6 col-lg-3">
                    <div className="about-us-item-02">
                      <div className="d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/about-us/agents.svg"
                          alt="image"
                          className="img-fluid me-3"
                        />
                        <div>
                          <h4 className="mb-1">3000+</h4>
                          <p className="mb-0">Agents Listed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-6 col-lg-3">
                    <div className="about-us-item-02">
                      <div className="d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/about-us/sales.svg"
                          alt="image"
                          className="img-fluid me-3"
                        />
                        <div>
                          <h4 className="mb-1">2000+</h4>
                          <p className="mb-0">Sales Completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-6 col-lg-3">
                    <div className="about-us-item-02">
                      <div className="d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/about-us/users.svg"
                          alt="image"
                          className="img-fluid me-3"
                        />
                        <div>
                          <h4 className="mb-1">5000+</h4>
                          <p className="mb-0">Users Joined</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                </div>
                {/* end row */}
              </div>
              {/* end col */}
            </div>
            {/* end row */}
          </div>
        </div>
        <div className="about-us-item-03">
          <ImageWithBasePath
            src="assets/img/bg/about-us-bg-01.png"
            alt="image"
            className="img-fluid about-us-bg-01 d-none d-lg-flex"
          />
          <ImageWithBasePath
            src="assets/img/bg/about-us-bg-02.png"
            alt="image"
            className="img-fluid about-us-bg-02 d-none d-lg-flex"
          />
          <div className="container">
            {/* start row */}
            <div className="row align-items-center row-gap-4 position-relative z-2">
              <div className="col-xl-5">
                <div className="me-3">
                  <h2 className="mb-4">Ready to Book a Place?</h2>
                  <ImageWithBasePath
                    src="assets/img/about-us/about-us-04.jpg"
                    alt="image"
                    className="img-fluid rounded w-100"
                  />
                </div>
              </div>
              {/* end col */}
              <div className="col-xl-7">
                <h5 className="mb-4">
                  Discover your dream property and secure your ideal space
                  effortlessly with our seamless, fast, and hassle-free booking
                  process today.
                </h5>
                <p>
                  Explore a wide range of verified property listings tailored to
                  match your lifestyle and budget across Nigeria. Whether you're
                  seeking an apartment in Abuja, a family home in Lagos, or
                  commercial space for your business, Dueno Property provides a
                  seamless and reliable experience. Benefit from secure
                  enquiries, trusted agents, and listings you can review with
                  confidence. With user-friendly search and transparent
                  details, Dueno Property makes it easier to find and secure
                  your perfect space.
                </p>
                <p className="mb-0">
                  With Dueno Property, you gain access to verified listings and
                  a platform designed for convenience. Filter by location,
                  price, and property type to narrow your search quickly. Stay
                  informed with real-time updates and direct agent contact.
                  Whether renting or buying, experience confidence and clarity
                  throughout your property journey with us.
                </p>
              </div>
              {/* end col */}
            </div>
            {/* end row */}
          </div>
        </div>
        <div className="about-us-item-04">
          <div className="container">
            {/* start row */}
            <div className="row">
              <div className="col-lg-11 mx-auto">
                <div className="text-center about-us-item-05">
                  <h2 className="mb-3">Trusted Partners Across Nigeria</h2>
                  <p className="mb-0">
                    Dueno Property works with leading brands and service
                    providers across Nigeria to deliver verified listings,
                    secure transactions, and a seamless property experience.
                  </p>
                </div>
                <AboutPartnersSlider />
              </div>
              {/* end col */}
            </div>
            {/* end row */}
          </div>
        </div>
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default AboutUs;
