// /src/shared/api/admin/cars/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Prefer server-only BACKEND_BASE_URL; fall back to BACKEND_URL; strip trailing /api if present
const RAW_BACKEND =
  process.env.BACKEND_BASE_URL ||
  process.env.BACKEND_URL ||
  "http://127.0.0.1:3001";
const BACKEND = RAW_BACKEND.replace(/\/api\/?$/, "");

// 🔒 Server-only admin key (no NEXT_PUBLIC fallbacks)
const API_KEY = process.env.ADMIN_API_KEY;

async function handler(req: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "ADMIN_API_KEY not set" },
        { status: 500 }
      );
    }

    const { search } = new URL(req.url);
    const url = `${BACKEND}/api/cars${search}`;

    const method = req.method.toUpperCase();
    const hasBody = method !== "GET" && method !== "HEAD";
    const body = hasBody ? await req.text() : undefined;

    const upstream = await fetch(url, {
      method,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        // Send both formats to satisfy EitherAuthGuard / ApiKey checks
        "X-API-Token": API_KEY,
        Authorization: `ApiKey ${API_KEY}`,
      },
      body,
      cache: "no-store",
    });

    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "application/json",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err) {
    console.error("Admin cars API error:", err);
    return NextResponse.json({ error: "Failed to proxy cars request" }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
