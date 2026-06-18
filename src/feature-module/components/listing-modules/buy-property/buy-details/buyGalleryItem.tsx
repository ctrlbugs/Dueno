import { Link } from "react-router";
import Slider from "react-slick";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { img_path } from "../../../../../environment";

type BuyGalleryItemProps = {
  images?: string[];
  alt?: string;
};

const BuyGalleryItem = ({ images = [], alt = "Property" }: BuyGalleryItemProps) => {
  const gallery = {
    dots: false,
    infinite: images.length > 5,
    speed: 2000,
    slidesToShow: Math.min(5, images.length),
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: Math.min(4, images.length),
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: Math.min(3, images.length),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, images.length),
        },
      },
    ],
  };

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const lightboxSlides = images.map((image) => ({
    src: `${img_path}${image}`.replace(/\/{2,}/g, "/"),
  }));

  if (!images.length) {
    return null;
  }

  return (
    <div className="accordion-item">
      <div className="accordion-header">
        <button
          className="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#accordion-6"
          aria-expanded="true"
        >
          Gallery
        </button>
      </div>
      <div id="accordion-6" className="accordion-collapse collapse show">
        <div className="accordion-body gallery-body">
          <Slider {...gallery} className="gallery-slider">
            {images.map((image, index) => (
              <div className="gallery-card" key={`${image}-${index}`}>
                <Link
                  to="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setActiveIndex(index);
                    setOpen(true);
                  }}
                  className="gallery-item rounded"
                >
                  <ImageWithBasePath
                    src={image}
                    alt={`${alt} gallery ${index + 1}`}
                    className="rounded img-fluid"
                  />
                </Link>
              </div>
            ))}
          </Slider>
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            index={activeIndex}
            slides={lightboxSlides}
          />
        </div>
      </div>
    </div>
  );
};

export default BuyGalleryItem;
