import { Link, useParams } from "react-router-dom";
import useNews from "../hooks/useNews";
import Navbar from "../components/Navbar";

function NewsDetails() {
  const { id } = useParams();
  const { news, loading, error } = useNews();

  const article = news.find((item) => item.id === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary" />

            <p className="mt-4 text-sm text-base-content/50">
              Loading article...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <div className="max-w-xl text-center">
            <div className="text-5xl">⚠️</div>

            <h1 className="mt-4 text-2xl font-black tracking-tight">
              Something went wrong
            </h1>

            <p className="mt-2 text-base-content/60">
              {error}
            </p>

            <Link to="/" className="btn btn-primary mt-6">
              ← Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center p-6">
          <div className="max-w-xl text-center">
            <div className="text-5xl">🔎</div>

            <h1 className="mt-4 text-3xl font-black tracking-tight">
              News not found
            </h1>

            <p className="mt-3 text-base-content/60">
              The article you are looking for could not be found.
            </p>

            <Link to="/" className="btn btn-primary mt-6">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 md:py-12">
        {/* Back */}
        <Link
          to="/#news"
          className="btn btn-ghost mb-6 px-0 text-base-content/70 hover:bg-transparent hover:text-base-content sm:mb-8"
        >
          ← Back to News
        </Link>

        {/* Article */}
        <article className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          {/* Image */}
          {article.image && (
            <figure className="bg-base-300">
              <img
                src={article.image}
                alt={article.title}
                className="h-56 w-full object-cover sm:h-72 md:h-[420px]"
              />
            </figure>
          )}

          {/* Content */}
          <div className="p-5 sm:p-7 md:p-10">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="badge badge-primary">
                {article.category}
              </span>

              <time
                dateTime={article.date}
                className="text-sm text-base-content/50"
              >
                {formattedDate}
              </time>

              <span
                className="text-sm text-base-content/30"
                aria-hidden="true"
              >
                •
              </span>

              <span className="text-sm font-medium text-base-content/60">
                {article.source}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-5 max-w-4xl text-2xl font-black leading-tight tracking-tight sm:text-3xl md:mt-6 md:text-5xl">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="mt-5 max-w-3xl text-base leading-7 text-base-content/70 sm:text-lg sm:leading-8 md:mt-6">
              {article.summary}
            </p>

            {/* Divider */}
            <div className="my-8 border-t border-base-300 md:my-10" />

            {/* Footer */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-base-content/40">
                  Source
                </p>

                <p className="mt-1 font-semibold">
                  {article.source}
                </p>
              </div>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full sm:w-auto"
              >
                Read Original Article ↗
              </a>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

export default NewsDetails;
