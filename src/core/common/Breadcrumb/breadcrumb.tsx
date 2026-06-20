import React from "react";
import ImageWithBasePath from "../../imageWithBasePath";

interface BreadcrumbPath {
  label: string;
  link?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  title: string;
  paths?: BreadcrumbPath[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title }) => {
  return (
    <div className="breadcrumb-bar">
      <ImageWithBasePath
        src="assets/img/bg/breadcrumb-bg-01.png"
        alt="image"
        className="breadcrumb-bg-01 d-none d-lg-block"
      />
      <ImageWithBasePath
        src="assets/img/bg/breadcrumb-bg-02.png"
        alt="image"
        className="breadcrumb-bg-02 d-none d-lg-block"
      />
      <ImageWithBasePath
        src="assets/img/bg/breadcrumb-bg-03.png"
        alt="image"
        className="breadcrumb-bg-03"
      />
      <div className="row align-items-center text-center position-relative z-1">
        <div className="col-md-12 col-12 breadcrumb-arrow">
          <h1 className="breadcrumb-title">{title}</h1>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
