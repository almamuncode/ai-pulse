import type { News } from "../types/news";
import { Link } from "react-router-dom";
import fallbackImage from "../assets/hero.png";

interface NewsCardProps {
  news: News;
}

function getImageUrl(imageUrl: string): string {
  return imageUrl;
}

function NewsCard({ news }: NewsCardProps) {
  const formattedDate = new Date(news.date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <article className="group card h-full overflow-hidden rounded-xl border border-base-300/80 border-t-4 border-t-primary/70 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:border-t-primary hover:shadow-xl hover:shadow-primary/10">
      {/* Image */}
      {news.image ? (
        <figure className="relative h-44 overflow-hidden bg-base-300 sm:h-48">
          <img
            src={getImageUrl(news.image)}
            alt={news.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackImage;
            }}
          />
        </figure>
      ) : (
        <div className="flex h-44 items-center justify-center bg-linear-to-br from-primary/15 via-base-200 to-accent/15 sm:h-48">
          <span className="text-4xl text-primary">✦</span>
        </div>
      )}

      {/* Content */}
      <div className="card-body flex flex-col gap-0 p-5 sm:p-6">
        {/* Meta */}
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-primary badge-sm font-bold uppercase tracking-wide">
            {news.category}
          </span>

          <time className="text-xs font-medium text-base-content/45">
            {formattedDate}
          </time>
        </div>

        {/* Title */}
          <h2 className="card-title mt-3 line-clamp-2 text-lg leading-snug tracking-tight sm:text-xl">
          {news.title}
        </h2>

        {/* Summary */}
        <p className="mt-3 line-clamp-4 text-sm leading-6 text-base-content/65">
          {news.summary}
        </p>

        {/* Footer */}
        <div className="card-actions mt-auto flex flex-col items-stretch gap-3 border-t border-base-300/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-base-content/45">
            {news.source}
          </span>

          <div className="flex w-full gap-2 sm:w-auto">
            <Link
              to={`/news/${news.id}`}
              className="inline-flex min-h-9 flex-1 items-center justify-center rounded-lg border border-primary bg-primary px-3 py-2 text-xs font-bold text-primary-content shadow-sm shadow-primary/20 hover:bg-primary/85 sm:flex-none"
            >
              View details
            </Link>

            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 flex-1 items-center justify-center rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-bold text-accent hover:border-accent hover:bg-accent/20 sm:flex-none"
            >
              Read
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default NewsCard;
