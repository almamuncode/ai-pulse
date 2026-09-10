import type { News } from "../types/news";
import NewsCard from "./NewsCard";

interface NewsGridProps {
  news: News[];
}

function NewsGrid({ news }: NewsGridProps) {
  if (news.length === 0) {
    return (
      <div className="rounded-2xl border border-base-300 bg-base-100 px-6 py-16 text-center shadow-sm sm:py-20">
        <div className="text-5xl">🔎</div>

        <h2 className="mt-4 text-2xl font-black tracking-tight">
          No news found
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60 sm:text-base">
          Try another search term or choose a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}

export default NewsGrid;