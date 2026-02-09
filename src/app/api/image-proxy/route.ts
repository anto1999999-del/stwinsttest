import type { NextRequest } from "next/server";

export const runtime = "edge"; // fast & cheap for simple streaming

function isHttpUrl(u: string) {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) return new Response("Missing url", { status: 400 });
  if (!isHttpUrl(raw)) return new Response("Invalid url", { status: 400 });

  const url = new URL(raw);
  // Safety: never forward creds
  url.username = "";
  url.password = "";

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);

  try {
    const upstream = await fetch(url.toString(), {
      // Follow redirects, don’t cache at the edge fetch layer
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        // some hosts require a UA
        "User-Agent": "stwins-image-proxy/1.0 (+https://stwins.com.au)",
      },
    });

    clearTimeout(t);

    if (!upstream.ok || !upstream.body) {
      return new Response("Upstream error", { status: 502 });
    }

    const contentType =
      upstream.headers.get("content-type") ?? "application/octet-stream";

    // Stream the image back to the browser
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // cache at CDN/proxy; refresh nightly
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
        // optional: allow embedding elsewhere if you want
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    clearTimeout(t);
    return new Response("Fetch failed", { status: 504 });
  }
}
