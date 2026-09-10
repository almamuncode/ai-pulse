import type { News } from "../types/news";

interface NewsCardProps {
  news: News;
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
    <article className="card h-full overflow-hidden border border-base-300 bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      {news.image ? (
        <figure className="h-48 bg-base-300">
          <img
            src={news.image}
            alt={news.title}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </figure>
      ) : (
        <div className="flex h-24 items-center justify-center bg-base-200">
          <span className="text-3xl">🤖</span>
        </div>
      )}

      {/* Content */}
      <div className="card-body">
        {/* Meta */}
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-primary badge-sm">
            {news.category}
          </span>

          <time className="text-xs text-base-content/50">
            {formattedDate}
          </time>
        </div>

        {/* Title */}
        <h2 className="card-title mt-2 line-clamp-2 text-lg leading-snug">
          {news.title}
        </h2>

        {/* Summary */}
        <p className="line-clamp-4 text-sm leading-6 text-base-content/70">
          {news.summary}
        </p>

        {/* Footer */}
        <div className="card-actions mt-auto flex items-center justify-between pt-4">
          <span className="text-xs font-medium text-base-content/50">
            {news.source}
          </span>

          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            Read
          </a>
        </div>
      </div>
    </article>
  );
}

export default NewsCard;
