import Parser from "rss-parser";

const parser = new Parser();

function encodeBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

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
      Accept: "application/rss+xml, application/xml, text/xml, */*",
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

  const isUsableImage = (url?: string): url is string =>
    Boolean(url && !url.includes("arxiv-logo"));

  if (isUsableImage(item.enclosure?.url)) {
    return item.enclosure.url;
  }

  const mediaContent = extendedItem["media:content"]?.$?.url;

  if (isUsableImage(mediaContent)) {
    return mediaContent;
  }

  const mediaThumbnail = extendedItem["media:thumbnail"]?.$?.url;

  if (isUsableImage(mediaThumbnail)) {
    return mediaThumbnail;
  }

  const encodedContent = extendedItem["content:encoded"];

  if (encodedContent) {
    const imageMatch = encodedContent.match(/<img[^>]+src=["']([^"']+)["']/i);

    if (imageMatch?.[1]) {
      if (isUsableImage(imageMatch[1])) {
        return imageMatch[1];
      }
    }
  }

  const html = item.content || item.summary || "";

  const imageMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);

  if (imageMatch?.[1]) {
    if (isUsableImage(imageMatch[1])) {
      return imageMatch[1];
    }
  }

  return null;
}

/**
 * Fetch article page and find OG image.
 */
async function fetchArticleImage(articleUrl: string): Promise<string | null> {
  try {
    const response = await fetch(articleUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
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
          return new URL(match[1], articleUrl).href;
        } catch {
          return null;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Article image failed: ${articleUrl}`, error);

    return null;
  }
}

function getFallbackImage(source: string): string {
  const fallbackImages: Record<string, string> = {
    OpenAI:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
    "Google DeepMind":
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=85",
    "Google AI":
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
    "Hugging Face":
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85",
    "arXiv AI":
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=85",
  };

  return (
    fallbackImages[source] || "https://placehold.co/1200x630/png?text=AI+Pulse"
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

function isValidArticleUrl(url?: string): boolean {
  if (!url) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);

    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

function createSlug(title: string): string {
  return cleanText(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function getValidDate(isoDate?: string, pubDate?: string): string {
  const candidates = [isoDate, pubDate];

  for (const date of candidates) {
    if (!date) {
      continue;
    }

    const timestamp = Date.parse(date);

    if (!Number.isNaN(timestamp)) {
      return new Date(timestamp).toISOString();
    }
  }

  return "";
}

export async function GET() {
  try {
    /*
     * Fetch every RSS feed independently.
     */
    const results = await Promise.allSettled(
      feeds.map(async (feed) => {
        try {
          console.log(`[AI Pulse] Fetching ${feed.name}`);

          const xml = await fetchFeed(feed.url);

          const rss = await parser.parseString(xml);

          console.log(`[AI Pulse] ${feed.name}: ${rss.items.length} items`);

          return rss.items
            .filter((item) => isValidArticleUrl(item.link))
            .map((item): NewsItem => {
              const title = cleanText(item.title || "Untitled");

              const description =
                item.contentSnippet || item.content || item.summary || "";

              return {
                id: `${createSlug(title)}-${encodeBase64Url(
                  normalizeUrl(item.link || `${feed.name}-${title}`),
                ).slice(-8)}`,

                title,

                summary: createSummary(title, description, feed.name),

                source: feed.name,

                date: getValidDate(item.isoDate, item.pubDate),

                category: feed.category,

                url: item.link!,

                image: getRssImage(item) || "",
              };
            });
        } catch (error) {
          console.error(`[AI Pulse] ${feed.name} FAILED:`, error);

          return [];
        }
      }),
    );

    /*
     * Combine successful feeds.
     */
    const news = results
      .filter(
        (result): result is PromiseFulfilledResult<NewsItem[]> =>
          result.status === "fulfilled",
      )
      .flatMap((result) => result.value);

    if (news.length === 0) {
      throw new Error("All RSS feeds failed.");
    }

    /*
     * Remove duplicates.
     */
    const seenUrls = new Set<string>();
    const seenTitles = new Set<string>();

    const uniqueNews = news.filter((item) => {
      const normalizedUrl = normalizeUrl(item.url);

      const normalizedTitle = normalizeTitle(item.title);

      if (normalizedUrl && seenUrls.has(normalizedUrl)) {
        return false;
      }

      if (normalizedTitle && seenTitles.has(normalizedTitle)) {
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
    uniqueNews.sort((a, b) => {
  const dateA = a.date ? new Date(a.date).getTime() : 0;
  const dateB = b.date ? new Date(b.date).getTime() : 0;

  return dateB - dateA;
});

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
        if (item.image) {
          return item;
        }

        const articleImage = await fetchArticleImage(item.url);

        return {
          ...item,
          image:
            articleImage && !articleImage.includes("arxiv-logo")
              ? articleImage
              : getFallbackImage(item.source),
        };
      }),
    );

    return Response.json(finalNews, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[AI Pulse] API failed:", error);

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
