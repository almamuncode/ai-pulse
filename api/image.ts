export async function GET(request: Request) {
  const imageUrl = new URL(request.url).searchParams.get("url");

  if (!imageUrl) {
    return new Response("Missing image URL", { status: 400 });
  }

  let targetUrl: URL;

  try {
    targetUrl = new URL(imageUrl);
  } catch {
    return new Response("Invalid image URL", { status: 400 });
  }

  if (!['http:', 'https:'].includes(targetUrl.protocol)) {
    return new Response("Unsupported image URL", { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "User-Agent": "AI Pulse image proxy",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok || !response.body) {
      return new Response("Image unavailable", { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "Content-Type": response.headers.get("content-type") || "application/octet-stream",
      },
    });
  } catch {
    return new Response("Image unavailable", { status: 502 });
  }
}
