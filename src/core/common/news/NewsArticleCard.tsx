import { Link } from "react-router";
import type { ReactNode } from "react";
import type { PropertyNewsArticle } from "../../../types/propertyNews";
import { formatNewsDate } from "../../../services/propertyNewsService";
import { getBlogDetailsPath } from "../../../utils/newsRoutes";
import { NewsImage } from "./NewsImage";

type NewsArticleCardProps = {
  article: PropertyNewsArticle;
  imageSlot?: number;
  excludeImageUrls?: string[];
  variant?: "grid" | "carousel";
};

export const NewsArticleCard = ({
  article,
  imageSlot = 0,
  excludeImageUrls = [],
  variant = "grid",
}: NewsArticleCardProps) => {
  const detailsPath = getBlogDetailsPath(article.id);
  const authorLabel = article.sourceName ?? "Dueno Property";

  if (variant === "carousel") {
    return (
      <Link
        to={detailsPath}
        className="blog-item-01 h-100 news-article-card text-decoration-none text-reset d-flex flex-column"
      >
        <div className="blog-img">
          <NewsImage
            src={article.imageUrl}
            alt={article.title}
            className="img-fluid"
            slot={imageSlot}
            category={article.category}
            description={article.description}
            excludeUrls={excludeImageUrls}
          />
        </div>
        <div className="blog-content">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
            <span className="badge badge-sm bg-secondary fw-semibold">
              {article.category}
            </span>
            <div className="d-flex align-items-center flex-wrap gap-3 author-details">
              <span className="me-3">{authorLabel}</span>
              <span className="d-inline-flex align-items-center">
                <i className="material-icons-outlined me-1">event</i>
                {formatNewsDate(article.publishedAt)}
              </span>
            </div>
          </div>
          <div>
            <h5 className="mb-1">{article.title}</h5>
            <p className="mb-0">{article.description}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="blog-item-01 h-100 news-article-card">
      <div className="blog-img">
        <Link to={detailsPath}>
          <NewsImage
            src={article.imageUrl}
            alt={article.title}
            className="img-fluid"
            slot={imageSlot}
            category={article.category}
            description={article.description}
            excludeUrls={excludeImageUrls}
          />
        </Link>
      </div>
      <div className="blog-content">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <span className="badge badge-sm bg-secondary fw-semibold">
            {article.category}
          </span>
          <div className="d-flex align-items-center author-details">
            <span className="me-3">{authorLabel}</span>
            <span className="d-inline-flex align-items-center">
              <i className="material-icons-outlined me-1">event</i>
              {formatNewsDate(article.publishedAt)}
            </span>
          </div>
        </div>
        <div>
          <h5 className="mb-1">
            <Link to={detailsPath}>{article.title}</Link>
          </h5>
          <p className="mb-0">{article.description}</p>
        </div>
      </div>
    </div>
  );
};

export const NewsArticleLink = ({
  article,
  children,
  className,
}: {
  article: PropertyNewsArticle;
  children: ReactNode;
  className?: string;
}) => (
  <Link to={getBlogDetailsPath(article.id)} className={className}>
    {children}
  </Link>
);
