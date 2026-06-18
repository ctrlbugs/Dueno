import { Link, useLocation } from "react-router";
import { all_routes } from "../../../feature-module/routes/all_routes";
import ImageWithBasePath from "../../imageWithBasePath";
import { useEffect, useState } from "react";
import { SITE_CONTACT } from "../../../data/siteContact";

const Footer = () => {
  const location = useLocation();

  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const checkYear = () => {
      const currentYear = new Date().getFullYear();
      setYear(currentYear);
    };

    // Check once per hour
    const interval = setInterval(checkYear, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {location.pathname === "/index" ? (
        <div>
          {/* Start Footer */}
          <footer className="footer footer-dark">
            <div className="footer-bg">
              <ImageWithBasePath
                src="assets/img/bg/footer-bg-01.png"
                className="bg-1"
                alt="image"
              />
              <ImageWithBasePath
                src="assets/img/bg/footer-bg-02.png"
                className="bg-2"
                alt="image"
              />
            </div>
            {/* Footer Top */}
            <div className="footer-top">
              <div className="container">
                <div className="row row-gap-4">
                  <div className="col-lg-4 col-md-6 col-sm-8">
                    <div className="footer-widget footer-about">
                      <h5>Get Our App </h5>
                      <p>Download the app and book your property</p>
                      <div className="download-app">
                        <Link to="#">
                          <ImageWithBasePath
                            src="assets/img/icons/goolge-play.svg"
                            alt="google play"
                          />
                        </Link>
                        <Link to="#">
                          <ImageWithBasePath
                            src="assets/img/icons/app-store.svg"
                            alt="app store"
                          />
                        </Link>
                      </div>
                      <div className="social-links">
                        <h5>Connect with us</h5>
                        <div className="social-icon">
                          <Link
                            to="https://facebook.com/duenoproperty"
                            target="_blank"
                          >
                            <i className="fa-brands fa-facebook" />
                          </Link>
                          <Link
                            to="https://instagram.com/duenoproperty"
                            target="_blank"
                          >
                            <i className="fa-brands fa-instagram" />
                          </Link>
                          <Link
                            to="https://wa.me/234903008952"
                            target="_blank"
                          >
                            <i className="fa-brands fa-whatsapp" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-6 col-sm-4">
                    <div className="footer-widget">
                      <h5 className="footer-title">Pages</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to={all_routes.aboutUs}>About Us</Link>
                        </li>
                        <li>
                          <Link to={all_routes.faq}>FAQ</Link>
                        </li>
                        <li>
                          <Link to={all_routes.services}>Services</Link>
                        </li>
                        <li>
                          <Link to={all_routes.contactUs}>Contact</Link>
                        </li>
                        <li>
                          <Link to={all_routes.signin}>Sign In</Link>
                        </li>
                        <li>
                          <Link to={all_routes.buyProperty}>Listings</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-4">
                    <div className="footer-widget">
                      <h5 className="footer-title">Company</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to={all_routes.aboutUs}>About Us</Link>
                        </li>
                        <li>
                          <Link to="#">Careers</Link>
                        </li>
                        <li>
                          <Link to={all_routes.blogGrid}>Blog</Link>
                        </li>
                        <li>
                          <Link to="#">Affiliate Program</Link>
                        </li>
                        <li>
                          <Link to={all_routes.addpropertybuy}>
                            Add Your Listing
                          </Link>
                        </li>
                        <li>
                          <Link to="#">Our Partners</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-4">
                    <div className="footer-widget">
                      <h5 className="footer-title">Destinations</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to="#">Lagos</Link>
                        </li>
                        <li>
                          <Link to="#">Abuja</Link>
                        </li>
                        <li>
                          <Link to="#">Port Harcourt</Link>
                        </li>
                        <li>
                          <Link to="#">Ibadan</Link>
                        </li>
                        <li>
                          <Link to="#">Lekki</Link>
                        </li>
                        <li>
                          <Link to="#">Ikeja</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-4">
                    <div className="footer-widget">
                      <h5 className="footer-title">Useful Links</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to="#">Legal Notice</Link>
                        </li>
                        <li>
                          <Link to={all_routes.privacyPolicy}>
                            Privacy Policy
                          </Link>
                        </li>
                        <li>
                          <Link to={all_routes.termsCondition}>
                            Terms &amp; Conditions
                          </Link>
                        </li>
                        <li>
                          <Link to="#">Support</Link>
                        </li>
                        <li>
                          <Link to="#">Refund Policy</Link>
                        </li>
                        <li>
                          <Link to={all_routes.contactUs}>Contact Us</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Footer Top */}
            {/* Footer Bottom */}
            <div className="footer-bottom">
              <div className="container">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="copyright">
                    <p className="copy-right">
                      Copyright &copy; {year}. All Rights Reserved, Dreams
                      Estate
                    </p>
                  </div>
                  <div className="company-logo">
                    <p>
                      Product of{" "}
                      <Link
                        to="https://dreamstechnologies.com/"
                        className="link-primary"
                        target="_blank"
                      >
                        Dreams Technologies
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* /Footer Bottom */}
          </footer>
          {/* End Footer */}
        </div>
      ) : location.pathname == "/index-2" ? (
        <>
          {/* Start Footer */}
          <footer className="footer-two">
            <div className="container">
              <div className="join-sec">
                <div>
                  <h2>Join now and redefine your work experience!</h2>
                  <p>
                    Connect with us, streamline collaboration, and unlock
                    success.
                  </p>
                </div>
                <Link
                  to={all_routes.addpropertybuy}
                  className="btn btn-primary btn-lg"
                >
                  Start Post Your Property
                </Link>
              </div>
              {/* Footer Top */}
              <div className="footer-top">
                <div className="row gx-5 gy-5">
                  <div className="col-lg-2 col-md-6 col-sm-6">
                    <div className="footer-widget">
                      <h5 className="footer-title">Company</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to={all_routes.aboutUs}>About Us</Link>
                        </li>
                        <li>
                          <Link to="#">Careers</Link>
                        </li>
                        <li>
                          <Link to={all_routes.blogGrid}>Blog</Link>
                        </li>
                        <li>
                          <Link to="#">Affiliate Program</Link>
                        </li>
                        <li>
                          <Link to={all_routes.addpropertybuy}>
                            Add Your Listing
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-6 col-sm-6">
                    <div className="footer-widget">
                      <h5 className="footer-title">Destinations</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to="#">Lagos</Link>
                        </li>
                        <li>
                          <Link to="#">Abuja</Link>
                        </li>
                        <li>
                          <Link to="#">Port Harcourt</Link>
                        </li>
                        <li>
                          <Link to="#">Ibadan</Link>
                        </li>
                        <li>
                          <Link to="#">Lekki</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="footer-widget footer-contacts">
                      <h5 className="footer-title">Reach Us</h5>
                      <div className="contact-info">
                        <h6>Location</h6>
                        <p>
                          123 East 26th Street,Fifth Floor,New York, NY 10011
                        </p>
                      </div>
                      <div className="contact-info">
                        <h6>Phone</h6>
                        <p>+1 34245 67678</p>
                      </div>
                      <div className="contact-info">
                        <h6>Email</h6>
                        <p>info@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="footer-widget footer-subscribe">
                      <h5 className="footer-title">Newsletter</h5>
                      <div className="email-info">
                        <h6>Subscribe to Our Newsletter</h6>
                        <p>
                          Just sign up and we'll send you a notification by
                          email.
                        </p>
                      </div>
                      <div className="d-flex align-items-center subscribe-wrap">
                        <div className="input-group input-group-flat">
                          <span className="input-group-text">
                            <i className="material-icons-outlined">email</i>
                          </span>
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="Enter Email Address"
                          />
                        </div>
                        <button type="submit" className="btn btn-primary">
                          <i className="material-icons-outlined">send</i>
                        </button>
                      </div>
                      <div className="social-icon">
                        <Link
                          to="https://facebook.com/duenoproperty"
                          target="_blank"
                        >
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link
                          to="https://instagram.com/duenoproperty"
                          target="_blank"
                        >
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link to="https://wa.me/234903008952" target="_blank">
                          <i className="fa-brands fa-whatsapp" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Footer Top */}
            </div>
            {/* Footer Bottom */}
            <div className="footer-bottom">
              <div className="container">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <p className="copy-right">
                    Copyright © . All Rights Reserved, Dreams Estate
                  </p>
                  <div className="policy-link">
                    <Link to={all_routes.privacyPolicy}>Privacy Policy</Link>
                    <Link to="#">Legal Notice</Link>
                    <Link to="#">Refund Policy</Link>
                    <Link to={all_routes.termsCondition}>
                      Terms and Conditions
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* /Footer Bottom */}
          </footer>
          {/* End Footer */}
        </>
      ) : (
        <>
          {/* Start Footer */}
          <footer className="footer-three footer-dark">
            <div className="footer-bg">
              <ImageWithBasePath
                src="assets/img/bg/footer-bg-01.png"
                className="bg-1"
                alt="image"
              />
              <ImageWithBasePath
                src="assets/img/bg/footer-bg-02.png"
                className="bg-2"
                alt="image"
              />
              <ImageWithBasePath
                src="assets/img/bg/footer-bg-03.png"
                className="bg-3"
                alt="image"
              />
            </div>
            <div className="container">
              {/* Footer Top */}
              <div className="footer-top">
                {/* start row */}
                <div className="row gy-4">
                  <div className="col-lg-3 col-md-6">
                    <div className="footer-widget footer-about">
                      <h5>Get Our App </h5>
                      <p>Download the app and book your property</p>
                      <div className="download-app">
                        <Link to="#">
                          <ImageWithBasePath
                            src="assets/img/icons/goolge-play.svg"
                            alt="google play"
                          />
                        </Link>
                        <Link to="#">
                          <ImageWithBasePath
                            src="assets/img/icons/app-store.svg"
                            alt="app store"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-lg-3 col-md-6">
                    <div className="footer-widget">
                      <h5 className="footer-title">Company</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to={all_routes.aboutUs}>About Us</Link>
                        </li>
                        <li>
                          <Link to="#">Careers</Link>
                        </li>
                        <li>
                          <Link to={all_routes.blogGrid}>Blog</Link>
                        </li>
                        <li>
                          <Link to="#">Affiliate Program</Link>
                        </li>
                        <li>
                          <Link to={all_routes.addpropertybuy}>
                            Add Your Listing
                          </Link>
                        </li>
                        <li>
                          <Link to="#">Our Partners</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-lg-3 col-md-6">
                    <div className="footer-widget">
                      <h5 className="footer-title">Destinations</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to="#">Lagos</Link>
                        </li>
                        <li>
                          <Link to="#">Abuja</Link>
                        </li>
                        <li>
                          <Link to="#">Port Harcourt</Link>
                        </li>
                        <li>
                          <Link to="#">Ibadan</Link>
                        </li>
                        <li>
                          <Link to="#">Lekki</Link>
                        </li>
                        <li>
                          <Link to="#">Ikeja</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-lg-3 col-md-6">
                    <div className="footer-widget">
                      <h5 className="footer-title">Useful Links</h5>
                      <ul className="footer-menu">
                        <li>
                          <Link to="#">Legal Notice</Link>
                        </li>
                        <li>
                          <Link to={all_routes.privacyPolicy}>
                            Privacy Policy
                          </Link>
                        </li>
                        <li>
                          <Link to={all_routes.termsCondition}>
                            Terms &amp; Conditions
                          </Link>
                        </li>
                        <li>
                          <Link to="#">Support</Link>
                        </li>
                        <li>
                          <Link to="#">Refund Policy</Link>
                        </li>
                        <li>
                          <Link to={all_routes.contactUs}>Contact Us</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* end col */}
                </div>
                {/* end row */}
              </div>
              {/* /Footer Top */}
              <div className="footer-middle">
                {/* start row */}
                <div className="row justify-content-xxl-between align-items-center gy-4">
                  <div className="col-12 col-xxl-4">
                    <div className="social-icon justify-content-center justify-content-xxl-start">
                      <Link
                        to="https://facebook.com/duenoproperty"
                        target="_blank"
                      >
                        <i className="fa-brands fa-facebook" />
                      </Link>
                      <Link
                        to="https://instagram.com/duenoproperty"
                        target="_blank"
                      >
                        <i className="fa-brands fa-instagram" />
                      </Link>
                      <Link to="https://wa.me/234903008952" target="_blank">
                        <i className="fa-brands fa-whatsapp" />
                      </Link>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-12 col-xxl-7">
                    {/* start row */}
                    <div className="row justify-content-center justify-content-xxl-end align-items-start gy-3 gx-xxl-3">
                      <div className="col-lg-4 col-md-6">
                        <div className="contact-info">
                          <span className="bg-primary">
                            <i className="material-icons-outlined">
                              location_on
                            </i>
                          </span>
                          <div>
                            <p>{SITE_CONTACT.location.label}</p>
                            <h6 className="fs-14 mb-0">
                              {SITE_CONTACT.location.lines[0]}
                              <br />
                              {SITE_CONTACT.location.lines[1]}
                            </h6>
                          </div>
                        </div>
                      </div>
                      {/* end col */}
                      <div className="col-lg-4 col-md-6">
                        <div className="contact-info">
                          <span className="bg-secondary">
                            <i className="material-icons-outlined">message</i>
                          </span>
                          <div>
                            <p>Email Address</p>
                            <h6 className="fs-14 mb-0">{SITE_CONTACT.email}</h6>
                          </div>
                        </div>
                      </div>
                      {/* end col */}
                      <div className="col-lg-4 col-md-6">
                        <div className="contact-info">
                          <span className="bg-danger">
                            <i className="material-icons-outlined">phone</i>
                          </span>
                          <div>
                            <p>Phone Number</p>
                            <h6 className="fs-14 mb-0">{SITE_CONTACT.phone}</h6>
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
            {/* Footer Bottom */}
            <div className="footer-bottom">
              <div className="text-center">
                <p className="copy-right">
                  Copyright &copy; {year}. All Rights Reserved, Dueno Property
                </p>
              </div>
            </div>
            {/* /Footer Bottom */}
          </footer>
          {/* End Footer */}
        </>
      )}
    </>
  );
};

export default Footer;
