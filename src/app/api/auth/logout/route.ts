import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCookieOptions } from "@/lib/cookieOptions";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST() {
  const cookieStore = await cookies();
  const refresh = cookieStore.get("refresh_token")?.value;

  // Attempt backend logout if we have a refresh token
  if (refresh) {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });
    } catch {
      // Ignore network/backend errors — we still clear cookies locally
    }
  }

  // Preserve the same options as when cookies were set, but expire them.
  const cleared = getCookieOptions(0) as Record<string, unknown>;
  cookieStore.set("access_token", "", cleared);
  cookieStore.set("refresh_token", "", cleared);
  return NextResponse.json({ success: true });
}
