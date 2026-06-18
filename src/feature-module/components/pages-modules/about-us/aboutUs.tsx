import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../../core/imageWithBasePath";

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
                  <h2>We Connect Building With People</h2>
                  <p className="mb-0">
                    We believe in more than just property transactions—we
                    believe in creating meaningful connections. "We Connect
                    Building With People" represents our mission to bridge the
                    gap between spaces and those who bring them to life. Whether
                    you're searching for a dream home, an office space, or a
                    real estate investment, our platform makes it easier to
                    discover the right fit. With trusted listings, expert
                    support, and seamless technology, we help you turn
                    structures into stories, and buildings into belonging.
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
                  match your lifestyle and budget. Whether you're seeking a
                  luxurious apartment in the city or a cozy family home in the
                  suburbs, our platform provides a seamless and reliable booking
                  experience. Benefit from secure transactions, instant booking
                  confirmations. With user-friendly features and trustworthy
                  listings, Dreams Estate makes it easy to find and secure your
                  perfect space.
                </p>
                <p className="mb-0">
                  With Dreams Estate, you gain access to premium properties and
                  a user-friendly platform designed for convenience. Filter
                  options help narrow your search by location, price, and
                  amenities. Stay informed with real-time updates and
                  notifications. Whether renting or buying, experience
                  confidence and ease throughout your property booking journey
                  with us.
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
                  <h2 className="mb-3">
                    Hundreds of Partners Around the World
                  </h2>
                  <p className="mb-0">
                    Every day, we build trust through communication,
                    transparency, and results.
                  </p>
                </div>
                {/* start row */}
                <div className="row align-items-center row-gap-4">
                  <div className="col-md-6 col-lg-2 d-flex">
                    <div className="card border-0 bg-light shadow-none flex-fill mb-0">
                      <div className="card-body text-center">
                        <ImageWithBasePath
                          src="assets/img/about-us/livechat.svg"
                          alt="image"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-6 col-lg-2 d-flex">
                    <div className="card border-0 bg-light shadow-none flex-fill mb-0">
                      <div className="card-body text-center">
                        <ImageWithBasePath
                          src="assets/img/about-us/headspace.svg"
                          alt="image"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-6 col-lg-2 d-flex">
                    <div className="card border-0 bg-light shadow-none flex-fill mb-0">
                      <div className="card-body text-center">
                        <ImageWithBasePath
                          src="assets/img/about-us/payehere.svg"
                          alt="image"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-6 col-lg-2 d-flex">
                    <div className="card border-0 bg-light shadow-none flex-fill mb-0">
                      <div className="card-body text-center">
                        <ImageWithBasePath
                          src="assets/img/about-us/scapic.svg"
                          alt="image"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-6 col-lg-2 d-flex">
                    <div className="card border-0 bg-light shadow-none flex-fill mb-0">
                      <div className="card-body text-center">
                        <ImageWithBasePath
                          src="assets/img/about-us/livechat.svg"
                          alt="image"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-6 col-lg-2 d-flex">
                    <div className="card border-0 bg-light shadow-none flex-fill mb-0">
                      <div className="card-body text-center">
                        <ImageWithBasePath
                          src="assets/img/about-us/memberstack.svg"
                          alt="image"
                          className="img-fluid"
                        />
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
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default AboutUs;
