import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import { NewsArticleCard } from "../../../../core/common/news/NewsArticleCard";
import { usePropertyNews } from "../../../../hooks/usePropertyNews";

const BlogGrid = () => {
  const { articles } = usePropertyNews();
  const articleImageUrls = articles.map((item) => item.imageUrl);

  return (
    <>
      <div className="page-wrapper">
        <Breadcrumb
          title="Blog Grid"
          paths={[{ label: "Blog Grid", active: true }]}
        />

        <div className="content">
          <div className="container">
            <div className="row row-gap-4 justify-content-center blog-grid-row">
              {articles.map((article, index) => (
                <div className="col-md-6 col-lg-4 d-flex" key={article.id}>
                  <NewsArticleCard
                    article={article}
                    imageSlot={index}
                    excludeImageUrls={articleImageUrls.filter(
                      (url) => url !== article.imageUrl,
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogGrid;
