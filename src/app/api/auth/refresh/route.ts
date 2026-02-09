import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCookieOptions } from "@/lib/cookieOptions";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST() {
  try {
    const cookieStore = await cookies();
    const rt = cookieStore.get("refresh_token")?.value;
    if (!rt)
      return NextResponse.json(
        { message: "No refresh token" },
        { status: 401 }
      );

    const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: rt }),
    });

    if (!res.ok) {
      return NextResponse.json({ message: "Refresh failed" }, { status: 401 });
    }

    const payload = (await res.json()) as {
      accessToken: string;
      refreshToken?: string;
      user?: unknown;
    };

    cookieStore.set(
      "access_token",
      payload.accessToken,
      getCookieOptions(60 * 15)
    );

    if (payload.refreshToken) {
      cookieStore.set(
        "refresh_token",
        payload.refreshToken,
        getCookieOptions(60 * 60 * 24 * 7)
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Refresh failed" }, { status: 500 });
  }
}
