import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import NewsGrid from "./components/NewsGrid";
import NewsHeader from "./components/NewsHeader";
import Footer from "./components/Footer";

import NewsDetails from "./pages/NewsDetails";
import useNews from "./hooks/useNews";

const categories = new Set([
  "All",
  "Models",
  "Features",
  "Developer",
  "Research",
  "Creative",
]);

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);
  const [searchParams] = useSearchParams();

  const { news, loading, error } = useNews();

  useEffect(() => {
    const category = searchParams.get("category");

    setSelectedCategory(
      category && categories.has(category) ? category : "All",
    );
  }, [searchParams]);

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [news, searchTerm, selectedCategory]);

  useEffect(() => {
    setVisibleCount(9);
  }, [searchTerm, selectedCategory]);

  const visibleNews = filteredNews.slice(0, visibleCount);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex min-h-screen flex-col bg-base-200">
            <Navbar />

            <Hero />

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
              {/* Filters */}
              <div className="mb-12 flex flex-col gap-5">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />

                <CategoryFilter
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>

              {/* News */}
              <section id="news" className="scroll-mt-24">
                <NewsHeader count={filteredNews.length} />

                {loading && (
                  <div className="flex min-h-64 items-center justify-center">
                    <div className="text-center">
                      <span className="loading loading-spinner loading-lg text-primary" />

                      <p className="mt-4 text-sm text-base-content/50">
                        Loading AI news...
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="alert alert-error mb-6">
                    <span>{error}</span>
                  </div>
                )}

                {!loading && !error && (
                  <>
                    <NewsGrid news={visibleNews} />

                    {visibleCount < filteredNews.length && (
                      <div className="mt-10 flex justify-center">
                        <button
                          type="button"
                          className="btn btn-primary px-6"
                          onClick={() =>
                            setVisibleCount((current) => current + 9)
                          }
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </>
                )}
              </section>
            </main>

            <Footer />
          </div>
        }
      />

      <Route path="/news/:id" element={<NewsDetails />} />
    </Routes>
  );
}

export default App;
