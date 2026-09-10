import { useMemo, useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import NewsGrid from "./components/NewsGrid";

import { newsData } from "./data/news";
import NewsHeader from "./components/NewsHeader";
import Footer from "./components/Footer";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredNews = useMemo(() => {
    return newsData.filter((news) => {
      const matchesSearch =
        news.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        news.summary
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        news.source
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        news.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

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
          <NewsGrid news={filteredNews} />
        </section>

        <NewsGrid news={filteredNews} />
      </main>
      <Footer />
    </div>
  );
}

export default App;