import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCookieOptions } from "@/lib/cookieOptions";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { username, password }

    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err: unknown = await res.json().catch(() => undefined);
      const message =
        (typeof err === "object" &&
          err &&
          "message" in err &&
          (err as { message?: string }).message) ||
        "Login failed";
      return NextResponse.json({ message }, { status: res.status });
    }

    const { user, accessToken, refreshToken } = (await res.json()) as {
      user: {
        ID: string;
        user_login: string;
        display_name: string;
        user_email: string;
      };
      accessToken: string;
      refreshToken: string;
    };

    const cookieStore = await cookies();
    // Short-lived access token (15m)
    cookieStore.set("access_token", accessToken, getCookieOptions(60 * 15));

    // Longer-lived refresh token (7d)
    cookieStore.set(
      "refresh_token",
      refreshToken,
      getCookieOptions(60 * 60 * 24 * 7)
    );

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
