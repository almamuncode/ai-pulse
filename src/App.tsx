import { useMemo, useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import NewsGrid from "./components/NewsGrid";

import useNews from "./hooks/useNews";
import NewsHeader from "./components/NewsHeader";
import Footer from "./components/Footer";


function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { news, loading, error } = useNews();


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

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <Navbar />

      <Hero />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
        <div className="mb-10 flex flex-col gap-6">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        <section id="news" className="scroll-mt-24">

          <NewsHeader count={filteredNews.length} />
          {loading && (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          )}

          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <NewsGrid news={filteredNews} />
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;