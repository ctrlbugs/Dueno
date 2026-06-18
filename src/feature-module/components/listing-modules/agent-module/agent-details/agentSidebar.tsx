import { Link } from "react-router";
import StickyBox from "react-sticky-box";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";
import { Apartment } from "../../../../../core/common/selectOption";

const AgentSidebar = () => {
  return (
    <StickyBox offsetTop={80} offsetBottom={20}>
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Enquiry</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Your Email"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Your Phone Number"
            />
          </div>
          <div className="mb-3">
            <CommonSelect
              options={Apartment}
              className="select"
              defaultValue={Apartment[0]}
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows={3}
              placeholder="Yes, I’m Interested"
              defaultValue={""}
            />
          </div>
          <div>
            <Link to="#" className="btn btn-dark w-100">
              Send Email
            </Link>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Contact</h5>
        </div>
        <div className="card-body">
          <ul className="contacts-list">
            <li>
              <span>
                <i className="material-icons-outlined">phone</i>
              </span>
              Call Us : +1 12545 45548
            </li>
            <li>
              <span>
                <i className="material-icons-outlined">phone_android</i>
              </span>
              Mobile : +1 52874 15879
            </li>
            <li>
              <span>
                <i className="material-icons-outlined">phone</i>
              </span>
              Fax : 4587921057
            </li>
            <li>
              <span>
                <i className="material-icons-outlined">language</i>
              </span>
              Website : example.com
            </li>
            <li>
              <span>
                <i className="material-icons-outlined">alternate_email</i>
              </span>
              Address : 7698 Creekwood Blvd
            </li>
            <li>
              <span>
                <i className="material-icons-outlined">email</i>
              </span>
              Email : info@example.com
            </li>
          </ul>
        </div>
      </div>
      <div className="card mb-0">
        <div className="card-header">
          <h5 className="mb-0">Share Property</h5>
        </div>
        <div className="card-body">
          <div className="social-icons">
            <Link to="#">
              <i className="fa-brands fa-x-twitter" />
            </Link>
            <Link to="#">
              <i className="fa-brands fa-facebook" />
            </Link>
            <Link to="#">
              <i className="fa-brands fa-instagram" />
            </Link>
            <Link to="#">
              <i className="fa-brands fa-linkedin" />
            </Link>
            <Link to="#">
              <i className="fa-brands fa-pinterest" />
            </Link>
          </div>
        </div>
      </div>
    </StickyBox>
  );
};

export default AgentSidebar;
