import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCookieOptions } from "@/lib/cookieOptions";

const BACKEND_URL = process.env.BACKEND_URL;

type User = {
  ID: string;
  user_login: string;
  user_nicename: string;
  user_email: string;
  user_url: string;
  user_registered: unknown;
  user_activation_key: string;
  user_status: number;
  display_name: string;
};

async function fetchMe(accessToken: string): Promise<Response> {
  return fetch(`${BACKEND_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const access = cookieStore.get("access_token")?.value;
    const refresh = cookieStore.get("refresh_token")?.value;

    if (!access && !refresh) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    if (access) {
      const res = await fetchMe(access);
      if (res.ok) {
        const user = (await res.json()) as User;
        return NextResponse.json(user);
      }
      // if unauthorized, try refresh
      if (res.status !== 401 && res.status !== 403) {
        const errBody: unknown = await res.json().catch(() => undefined);
        const message =
          (typeof errBody === "object" &&
            errBody &&
            "message" in errBody &&
            (errBody as { message?: string }).message) ||
          "Failed to fetch user";
        return NextResponse.json({ message }, { status: res.status });
      }
    }

    // Try using refresh token to get a new access token and retry
    if (refresh) {
      const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });

      if (!refreshRes.ok) {
        return NextResponse.json(
          { message: "Not authenticated" },
          { status: 401 }
        );
      }

      const refreshPayload = (await refreshRes.json()) as {
        accessToken: string;
        refreshToken?: string;
        user?: unknown;
      };

      // Set the new access token cookie
      cookieStore.set(
        "access_token",
        refreshPayload.accessToken,
        getCookieOptions(60 * 15)
      );
      if (refreshPayload.refreshToken) {
        cookieStore.set(
          "refresh_token",
          refreshPayload.refreshToken,
          getCookieOptions(60 * 60 * 24 * 7)
        );
      }

      const meRes = await fetchMe(refreshPayload.accessToken);
      if (meRes.ok) {
        const user = (await meRes.json()) as User;
        return NextResponse.json(user);
      }
      return NextResponse.json(
        { message: "Failed to fetch user" },
        { status: meRes.status }
      );
    }

    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
