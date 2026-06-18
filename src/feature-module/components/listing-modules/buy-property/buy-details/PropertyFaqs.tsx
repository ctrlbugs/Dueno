import { Link } from "react-router";
import type { EstateProperty } from "../../../../../data/estateProperties";
import { FAQ_TEMPLATES } from "../../../../../types/listing";

type PropertyFaqsProps = {
  faqs?: EstateProperty["faqs"];
};

const PropertyFaqs = ({ faqs }: PropertyFaqsProps) => {
  const items =
    faqs && faqs.length > 0
      ? faqs
      : FAQ_TEMPLATES.slice(0, 4).map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        }));

  return (
    <div className="accordion-item">
      <div className="accordion-header">
        <button
          className="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#accordion-8"
          aria-expanded="true"
        >
          Frequently Asked Questions
        </button>
      </div>
      <div id="accordion-8" className="accordion-collapse collapse show">
        <div className="accordion-body">
          <div className="faq-items">
            {items.map((faq, index) => (
              <div className="faq-card mb" key={`${faq.question}-${index}`}>
                <h4 className="faq-title">
                  <Link
                    className="collapsed"
                    data-bs-toggle="collapse"
                    to={`#faq-${index}`}
                    aria-expanded="false"
                  >
                    {faq.question}
                  </Link>
                </h4>
                <div id={`faq-${index}`} className="card-collapse collapse">
                  <div className="faq-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFaqs;
