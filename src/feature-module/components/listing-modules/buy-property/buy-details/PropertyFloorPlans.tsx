import type { EstateProperty } from "../../../../../data/estateProperties";

type PropertyFloorPlansProps = {
  floorPlans?: EstateProperty["floorPlans"];
};

const PropertyFloorPlans = ({ floorPlans }: PropertyFloorPlansProps) => {
  const plans =
    floorPlans && floorPlans.length > 0
      ? floorPlans
      : [
          { label: "Balcony Plan", type: "balcony", imageUrl: "" },
          { label: "Front Hall", type: "front_hall", imageUrl: "" },
          { label: "Kitchen", type: "kitchen", imageUrl: "" },
        ];

  return (
    <div className="accordion-item">
      <div className="accordion-header">
        <button
          className="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#accordion-5"
          aria-expanded="true"
        >
          Floor Plan
        </button>
      </div>
      <div id="accordion-5" className="accordion-collapse collapse show">
        <div className="accordion-body">
          {plans.map((plan, index) => (
            <div
              className={`card border-0 shadow-none bg-light rounded ${
                index === plans.length - 1 ? "mb-0" : "mb-3"
              }`}
              key={`${plan.type}-${plan.label}`}
            >
              <div className="card-body d-flex align-center justify-content-between gap-2 flex-wrap">
                <h6 className="fs-16 fw-semibold mb-0">{plan.label}</h6>
                <div className="d-flex align-items-center floor-items gap-2">
                  {plan.imageUrl ? (
                    <>
                      <a
                        href={plan.imageUrl}
                        download
                        className="fs-16 text-dark"
                        aria-label={`Download ${plan.label}`}
                      >
                        <i className="material-icons-outlined">file_download</i>
                      </a>
                      <a
                        href={plan.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="fs-16 text-dark"
                        aria-label={`View ${plan.label}`}
                      >
                        <i className="material-icons-outlined">remove_red_eye</i>
                      </a>
                    </>
                  ) : (
                    <span className="text-muted fs-14">Not uploaded</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyFloorPlans;
