import type { News } from "../types/news";

interface NewsCardProps {
  news: News;
}

function NewsCard({ news }: NewsCardProps) {
  return (
    <article className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <figure>
        <img
          src={news.image}
          alt={news.title}
          className="h-52 w-full object-cover"
        />
      </figure>

      <div className="card-body">
        <div className="flex items-center justify-between gap-3">
          <span className="badge badge-primary badge-outline">
            {news.category}
          </span>

          <span className="text-xs text-base-content/50">
            {news.date}
          </span>
        </div>

        <h2 className="card-title mt-2 text-xl">
          {news.title}
        </h2>

        <p className="text-sm leading-6 text-base-content/70">
          {news.summary}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold">
            {news.source}
          </span>

          <a
            href={news.url}
            className="btn btn-primary btn-sm"
          >
            Read →
          </a>
        </div>
      </div>
    </article>
  );
}

export default NewsCard;