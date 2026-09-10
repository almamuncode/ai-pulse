import { useEffect, useState } from "react";
import type { News } from "../types/news";

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

        const response = await fetch("/api/news");

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data: News[] = await response.json();

        setNews(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load AI news. Please try again.");
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