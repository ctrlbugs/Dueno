import { Link } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import { usePropertyNews } from "../../../../../hooks/usePropertyNews";
import {
  formatNewsDate,
  getArticleImageExclusions,
  getHomepageArticles,
} from "../../../../../services/propertyNewsService";
import { NewsArticleLink } from "../../../../../core/common/news/NewsArticleCard";
import { NewsImage } from "../../../../../core/common/news/NewsImage";

const BlogSection = () => {
  const { articles } = usePropertyNews();
  const homepageArticles = getHomepageArticles(articles);
  const [featured, ...sideArticles] = homepageArticles;

  if (!featured) {
    return null;
  }

  return (
    <>
      {/* Blog Section Start */}
      <section className="latest-blog-section">
        <div className="container">
          <div className="section-heading-three">
            <div className="sec-line-three">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <h2>Latest Blogs</h2>
            <p>
              Live property and real estate news across Africa and the globe,
              focused on homes, rentals, investments, and the property market.
            </p>
          </div>
          <div className="row align-items-stretch g-4">
            <div className="col-xl-6 d-flex">
              <div className="blog-item mb-0 flex-fill h-100">
                <div className="blog-img">
                  <NewsArticleLink article={featured}>
                    <NewsImage
                      src={featured.imageUrl}
                      alt={featured.title}
                      slot={0}
                      category={featured.category}
                      description={featured.description}
                      excludeUrls={getArticleImageExclusions(homepageArticles, 0)}
                    />
                  </NewsArticleLink>
                  <span className="badge bg-secondary badge-top">
                    {featured.category}
                  </span>
                </div>
                <div className="blog-content">
                  <h5 className="mb-2">
                    <NewsArticleLink article={featured}>
                      {featured.title}
                    </NewsArticleLink>
                  </h5>
                  <p className="mb-2">{featured.description}</p>
                  <span className="d-inline-flex align-items-center">
                    <i className="material-icons-outlined me-2">event</i>
                    {formatNewsDate(featured.publishedAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xl-6 d-flex">
              <div className="side-blog-stack flex-fill w-100">
                {sideArticles.map((article, index) => (
                  <div
                    className="blog-item blog-item-2 h-100"
                    key={article.id}
                  >
                    <div className="row g-0 h-100 align-items-stretch">
                      <div className="col-md-6 d-flex">
                        <div className="blog-img flex-fill">
                          <NewsArticleLink article={article}>
                            <NewsImage
                              src={article.imageUrl}
                              alt={article.title}
                              slot={index + 1}
                              category={article.category}
                              description={article.description}
                              excludeUrls={getArticleImageExclusions(
                                homepageArticles,
                                index + 1,
                              )}
                            />
                          </NewsArticleLink>
                          <span className="badge bg-secondary badge-top">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex">
                        <div className="blog-content flex-fill">
                          <h5 className="mb-2">
                            <NewsArticleLink article={article}>
                              {article.title}
                            </NewsArticleLink>
                          </h5>
                          <p className="mb-2">{article.description}</p>
                          <span className="d-inline-flex align-items-center">
                            <i className="material-icons-outlined me-2">
                              event
                            </i>
                            {formatNewsDate(article.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <Link
              to={all_routes.blogGrid}
              className="btn btn-dark d-inline-flex align-items-center"
            >
              View More
              <i className="material-icons-outlined ms-1">north_east</i>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogSection;
