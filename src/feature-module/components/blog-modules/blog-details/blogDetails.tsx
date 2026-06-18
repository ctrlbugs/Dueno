import { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router";
import Slider from "react-slick";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import { all_routes } from "../../../routes/all_routes";
import { NewsArticleCard } from "../../../../core/common/news/NewsArticleCard";
import { NewsImage } from "../../../../core/common/news/NewsImage";
import { usePropertyNews } from "../../../../hooks/usePropertyNews";
import {
  formatNewsDate,
  getArticleById,
  getGalleryImages,
  getRelatedArticles,
  isExternalNewsUrl,
} from "../../../../services/propertyNewsService";
import { getBlogDetailsPath } from "../../../../utils/newsRoutes";

const PrevArrow = ({
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) => (
  <div className="blog-carousel-prev" onClick={onClick}>
    <i className="fa fa-chevron-left" />
  </div>
);

const NextArrow = ({
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) => (
  <div className="blog-carousel-next" onClick={onClick}>
    <i className="fa fa-chevron-right" />
  </div>
);

const BlogDetails = () => {
  const { articleId: pathArticleId } = useParams<{ articleId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { articles } = usePropertyNews();
  const legacyArticleId = searchParams.get("id");
  const articleId = pathArticleId ?? legacyArticleId;
  const article = getArticleById(articles, articleId);

  useEffect(() => {
    if (!pathArticleId && legacyArticleId) {
      navigate(getBlogDetailsPath(legacyArticleId), { replace: true });
    }
  }, [legacyArticleId, navigate, pathArticleId]);

  useEffect(() => {
    if (articleId) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [articleId]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    draggable: false,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1, infinite: true, dots: false },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  if (!articleId || !article) {
    return <Navigate to={all_routes.blogGrid} replace />;
  }

  const galleryImages = getGalleryImages(article, articles, 4);
  const relatedArticles = getRelatedArticles(articles, article.id);
  const relatedImageUrls = relatedArticles.map((item) => item.imageUrl);
  const authorLabel = article.sourceName ?? "Dueno Property";

  return (
    <>
      <div className="page-wrapper" key={article.id}>
        <Breadcrumb
          title="Blog Details"
          paths={[{ label: "Blog Details", active: true }]}
        />

        <div className="content">
          <div className="container">
            <div className="row blog-details-cover">
              <div className="col-lg-10 mx-auto">
                <Link
                  to={all_routes.blogGrid}
                  className="d-flex align-items-center mb-4"
                >
                  <i className="material-icons-outlined me-1">arrow_back</i>
                  Back to Blog
                </Link>
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="blog-details-item-01">
                      <div className="blog-details-img-01">
                        <NewsImage
                          src={article.imageUrl}
                          alt={article.title}
                          className="img-fluid"
                          slot={0}
                          category={article.category}
                          description={article.description}
                        />
                      </div>
                      <div className="blog-details-content-01">
                        <span className="badge badge-sm bg-secondary fw-semibold">
                          {article.category}
                        </span>
                        <h5>{article.title}</h5>
                        <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 author-details">
                          <div className="d-flex align-items-center me-3">
                            <span>{authorLabel}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className="d-inline-flex align-items-center">
                              <i className="material-icons-outlined me-1">
                                event
                              </i>
                              {formatNewsDate(article.publishedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p>{article.description}</p>
                      <p>
                        Stay informed on property sales, rentals, mortgages, and
                        market trends across Nigeria and Africa. Dueno curates
                        verified real estate news so you can make confident
                        decisions whether you are buying, renting, or investing.
                      </p>
                    </div>

                    <div>
                      <h5 className="mb-4">Related coverage</h5>
                      <div className="row row-gap-3 mb-3">
                        {galleryImages.map((imageUrl, index) => (
                          <div className="col-md-6 col-lg-3" key={`${imageUrl}-${index}`}>
                            <NewsImage
                              src={imageUrl}
                              alt={`${article.title} gallery ${index + 1}`}
                              className="img-fluid w-100 rounded"
                              slot={index + 1}
                              category={article.category}
                              description={article.description}
                              excludeUrls={[article.imageUrl]}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="p-2">
                        <p>
                          {article.description} This update highlights how
                          African property markets continue to evolve with new
                          opportunities in Lagos, Abuja, Port Harcourt, and
                          other major cities.
                        </p>
                        {isExternalNewsUrl(article.sourceUrl) && (
                          <p className="mb-0">
                            <a
                              href={article.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary fw-medium"
                            >
                              Read the full story at {authorLabel}
                              <i className="material-icons-outlined ms-1 align-middle fs-16">
                                open_in_new
                              </i>
                            </a>
                          </p>
                        )}
                      </div>

                      <div className="card border-0 border-start border-3 border-primary bg-light mb-4">
                        <div className="card-body">
                          <div className="row align-items-center row-gap-2">
                            <div className="col-lg-12">
                              <p className="fw-medium mb-1 text-primary">
                                Source
                              </p>
                              <h5>{authorLabel}</h5>
                              <p className="mb-0">
                                Curated by Dueno Property from live African and
                                global real estate news feeds.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {relatedArticles.length > 0 && (
              <div className="blog-details-item-02">
                <h5>Related Post</h5>
                <div className="blog-carousel-wrapper">
                  <Slider
                    {...settings}
                    className="blog-carousel"
                    key={article.id}
                  >
                    {relatedArticles.map((related, index) => (
                      <div key={related.id}>
                        <NewsArticleCard
                          article={related}
                          variant="carousel"
                          imageSlot={index + 2}
                          excludeImageUrls={[
                            article.imageUrl,
                            ...relatedImageUrls.filter(
                              (url) => url !== related.imageUrl,
                            ),
                          ]}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
