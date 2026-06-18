import { Breadcrumb, Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

type AdminPageBreadcrumbProps = {
  title: string;
  subName?: string;
};

const AdminPageBreadcrumb = ({ title, subName }: AdminPageBreadcrumbProps) => (
  <>
    <Helmet>
      <title>{title} | Dueno Admin</title>
    </Helmet>
    <Row>
      <Col xs={12}>
        <div className="page-title-box">
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              <li className="breadcrumb-item">
                <Link to="/admin">Dueno</Link>
              </li>
              {subName && <Breadcrumb.Item>{subName}</Breadcrumb.Item>}
              <Breadcrumb.Item active>{title}</Breadcrumb.Item>
            </ol>
          </div>
          <h4 className="page-title">{title}</h4>
        </div>
      </Col>
    </Row>
  </>
);

export default AdminPageBreadcrumb;
