import type { News } from "../types/news";
import NewsCard from "./NewsCard";

interface NewsGridProps {
  news: News[];
}

function NewsGrid({ news }: NewsGridProps) {
  if (news.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="text-5xl">🔎</div>

        <h2 className="mt-4 text-2xl font-bold">
          No news found
        </h2>

        <p className="mt-2 text-base-content/60">
          Try another search or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}

export default NewsGrid;