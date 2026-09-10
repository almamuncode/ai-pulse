import Parser from "rss-parser";

const parser = new Parser();

const feeds = [
  {
    name: "OpenAI",
    url: "https://openai.com/news/rss.xml",
    category: "Models",
  },
  {
    name: "Google DeepMind",
    url: "https://deepmind.google/blog/rss.xml",
    category: "Research",
  },
  {
    name: "Google AI",
    url: "https://blog.google/technology/ai/rss/",
    category: "Features",
  },
  {
    name: "Hugging Face",
    url: "https://huggingface.co/blog/feed.xml",
    category: "Developer",
  },
  {
    name: "arXiv AI",
    url: "https://rss.arxiv.org/rss/cs.AI",
    category: "Research",
  },
] as const;

type FeedCategory =
  | "Models"
  | "Features"
  | "Developer"
  | "Research"
  | "Creative";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  category: FeedCategory;
  url: string;
  image: string;
}

type ExtendedItem = Parser.Item & {
  "media:content"?: {
    $?: {
      url?: string;
    };
  };

  "media:thumbnail"?: {
    $?: {
      url?: string;
    };
  };

  "content:encoded"?: string;
};

function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\\textbf\{([^}]*)\}/g, "$1")
    .replace(/\\textit\{([^}]*)\}/g, "$1")
    .replace(/\\emph\{([^}]*)\}/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function createSummary(
  title: string,
  description: string,
  source: string,
): string {
  let summary = cleanText(description);
  const cleanTitle = cleanText(title);

  if (summary.toLowerCase().startsWith(cleanTitle.toLowerCase())) {
    summary = summary.slice(cleanTitle.length).trim();
  }

  if (source === "arXiv AI") {
    const abstractMatch = summary.match(/abstract:\s*(.*)$/i);

    if (abstractMatch?.[1]) {
      summary = abstractMatch[1].trim();
    }

    summary = summary
      .replace(/^announce type:\s*\w+\s*/i, "")
      .replace(/^arXiv:\S+\s*/i, "")
      .trim();
  }

  summary = summary
    .replace(/^#{1,6}\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!summary) {
    return "No summary available.";
  }

  if (summary.length > 220) {
    return `${summary.slice(0, 217).trimEnd()}...`;
  }

  return summary;
}

/**
 * Fetch RSS XML manually.
 */
async function fetchFeed(feedUrl: string): Promise<string> {
  const response = await fetch(feedUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
      Accept:
        "application/rss+xml, application/xml, text/xml, */*",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(
      `RSS request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

/**
 * Extract an image directly from RSS.
 */
function getRssImage(item: Parser.Item): string | null {
  const extendedItem = item as ExtendedItem;

  if (item.enclosure?.url) {
    return item.enclosure.url;
  }

  const mediaContent =
    extendedItem["media:content"]?.$?.url;

  if (mediaContent) {
    return mediaContent;
  }

  const mediaThumbnail =
    extendedItem["media:thumbnail"]?.$?.url;

  if (mediaThumbnail) {
    return mediaThumbnail;
  }

  const encodedContent =
    extendedItem["content:encoded"];

  if (encodedContent) {
    const imageMatch = encodedContent.match(
      /<img[^>]+src=["']([^"']+)["']/i,
    );

    if (imageMatch?.[1]) {
      return imageMatch[1];
    }
  }

  const html =
    item.content ||
    item.summary ||
    "";

  const imageMatch = html.match(
    /<img[^>]+src=["']([^"']+)["']/i,
  );

  if (imageMatch?.[1]) {
    return imageMatch[1];
  }

  return null;
}

/**
 * Fetch article page and find OG image.
 */
async function fetchArticleImage(
  articleUrl: string,
): Promise<string | null> {
  try {
    const response = await fetch(articleUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,

      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,

      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,

      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);

      if (match?.[1]) {
        try {
          return new URL(
            match[1],
            articleUrl,
          ).href;
        } catch {
          return null;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(
      `Article image failed: ${articleUrl}`,
      error,
    );

    return null;
  }
}

function getFallbackImage(source: string): string {
  const fallbackImages: Record<string, string> = {
    OpenAI:
      "https://placehold.co/1200x630/png?text=OpenAI",

    "Google DeepMind":
      "https://placehold.co/1200x630/png?text=Google+DeepMind",

    "Google AI":
      "https://placehold.co/1200x630/png?text=Google+AI",

    "Hugging Face":
      "https://placehold.co/1200x630/png?text=Hugging+Face",

    "arXiv AI":
      "https://placehold.co/1200x630/png?text=AI+Research",
  };

  return (
    fallbackImages[source] ||
    "https://placehold.co/1200x630/png?text=AI+Pulse"
  );
}

function normalizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "ref",
      "source",
    ].forEach((parameter) => {
      parsedUrl.searchParams.delete(parameter);
    });

    return parsedUrl.toString().replace(/\/$/, "");
  } catch {
    return url.trim().toLowerCase().replace(/\/$/, "");
  }
}

function normalizeTitle(title: string): string {
  return cleanText(title)
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET() {
  try {
    /*
     * Fetch every RSS feed independently.
     */
    const results = await Promise.allSettled(
      feeds.map(async (feed) => {
        try {
          console.log(
            `[AI Pulse] Fetching ${feed.name}`,
          );

          const xml = await fetchFeed(feed.url);

          const rss = await parser.parseString(xml);

          console.log(
            `[AI Pulse] ${feed.name}: ${rss.items.length} items`,
          );

          return rss.items.map(
            (item, index): NewsItem => {
              const title = cleanText(
                item.title || "Untitled",
              );

              const description =
                item.contentSnippet ||
                item.content ||
                item.summary ||
                "";

              return {
                id:
                  item.guid ||
                  item.link ||
                  `${feed.name}-${index}`,

                title,

                summary: createSummary(
                  title,
                  description,
                  feed.name,
                ),

                source: feed.name,

                date:
                  item.isoDate ||
                  item.pubDate ||
                  new Date().toISOString(),

                category: feed.category,

                url: item.link || "#",

                image:
                  getRssImage(item) || "",
              };
            },
          );
        } catch (error) {
          console.error(
            `[AI Pulse] ${feed.name} FAILED:`,
            error,
          );

          return [];
        }
      }),
    );

    /*
     * Combine successful feeds.
     */
    const news = results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<NewsItem[]> =>
          result.status === "fulfilled",
      )
      .flatMap((result) => result.value);

    /*
     * Remove duplicates.
     */
    const seenUrls = new Set<string>();
    const seenTitles = new Set<string>();

    const uniqueNews = news.filter((item) => {
      const normalizedUrl =
        item.url !== "#"
          ? normalizeUrl(item.url)
          : "";

      const normalizedTitle =
        normalizeTitle(item.title);

      if (
        normalizedUrl &&
        seenUrls.has(normalizedUrl)
      ) {
        return false;
      }

      if (
        normalizedTitle &&
        seenTitles.has(normalizedTitle)
      ) {
        return false;
      }

      if (normalizedUrl) {
        seenUrls.add(normalizedUrl);
      }

      if (normalizedTitle) {
        seenTitles.add(normalizedTitle);
      }

      return true;
    });

    /*
     * Newest first.
     */
    uniqueNews.sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime(),
    );

    /*
     * Keep the feed mix balanced so one high-volume source cannot fill the
     * entire page.
     */
    const sourceCounts = new Map<string, number>();
    const latestNews = uniqueNews
      .filter((item) => {
        const count = sourceCounts.get(item.source) || 0;

        if (count >= 6) {
          return false;
        }

        sourceCounts.set(item.source, count + 1);
        return true;
      })
      .slice(0, 30);

    /*
     * Find article images.
     */
    const finalNews = await Promise.all(
      latestNews.map(async (item) => {
        if (item.image || item.url === "#") {
          return item;
        }

        const articleImage =
          await fetchArticleImage(item.url);

        return {
          ...item,
          image:
            articleImage ||
            getFallbackImage(item.source),
        };
      }),
    );

    return Response.json(finalNews, {
      headers: {
        "Cache-Control":
          "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error(
      "[AI Pulse] API failed:",
      error,
    );

    return Response.json(
      {
        message: "Failed to fetch AI news.",
      },
      {
        status: 500,
      },
    );
  }
}