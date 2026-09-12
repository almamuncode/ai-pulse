import { useEffect, useState } from "react";
import type { News } from "../types/news";
import { newsData } from "../data/news";

interface UseNewsResult {
  news: News[];
  loading: boolean;
  error: string | null;
}

function useNews(): UseNewsResult {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        if (import.meta.env.DEV) {
          setNews(newsData);
          return;
        }

        const response = await fetch("/api/news");

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid news response");
        }

        setNews(data as News[]);
      } catch (error) {
        console.warn("News API unavailable; using bundled news data.", error);
        setNews(newsData);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return {
    news,
    loading,
    error,
  };
}

export default useNews;