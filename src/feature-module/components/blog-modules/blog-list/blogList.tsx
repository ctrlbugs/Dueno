import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import { NewsArticleCard } from "../../../../core/common/news/NewsArticleCard";
import { usePropertyNews } from "../../../../hooks/usePropertyNews";
import { getArticleImageExclusions } from "../../../../services/propertyNewsService";

const BlogList = () => {
  const { articles } = usePropertyNews();

  return (
    <>
      <div className="page-wrapper">
        <Breadcrumb
          title="Blog List"
          paths={[{ label: "Blog List", active: true }]}
        />

        <div className="content">
          <div className="container">
            <div className="row row-gap-4">
              <div className="col-md-12 col-lg-8">
                {articles.map((article, index) => (
                  <div className="mb-4" key={article.id}>
                    <NewsArticleCard
                      article={article}
                      imageSlot={index}
                      excludeImageUrls={getArticleImageExclusions(articles, index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogList;
