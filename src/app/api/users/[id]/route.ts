import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCookieOptions } from "@/lib/cookieOptions";
import type { User, UpdateUserDto } from "@/shared/types/user";

const BACKEND_URL = process.env.BACKEND_URL;

async function patchUser(id: string, body: UpdateUserDto, accessToken: string) {
  return fetch(`${BACKEND_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
}

export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url);
    const match = url.pathname.match(/\/api\/users\/([^/]+)(?:$|\/)/);
    const id = match?.[1];
    if (!id) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }
    const payload: UpdateUserDto = await req.json();
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
      const res = await patchUser(id, payload, access);
      if (res.ok) {
        const user = (await res.json()) as User;
        return NextResponse.json(user);
      }
      if (res.status !== 401 && res.status !== 403) {
        const errBody: unknown = await res.json().catch(() => undefined);
        const message =
          (typeof errBody === "object" &&
            errBody &&
            "message" in errBody &&
            (errBody as { message?: string }).message) ||
          "Update failed";
        return NextResponse.json({ message }, { status: res.status });
      }
    }

    if (refresh) {
      // refresh and retry
      const rf = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (!rf.ok) {
        return NextResponse.json(
          { message: "Not authenticated" },
          { status: 401 }
        );
      }
      const refreshPayload = (await rf.json()) as {
        accessToken: string;
        refreshToken?: string;
      };
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

      const retry = await patchUser(id, payload, refreshPayload.accessToken);
      if (retry.ok) {
        const user = (await retry.json()) as User;
        return NextResponse.json(user);
      }
      const errBody: unknown = await retry.json().catch(() => undefined);
      const message =
        (typeof errBody === "object" &&
          errBody &&
          "message" in errBody &&
          (errBody as { message?: string }).message) ||
        "Update failed";
      return NextResponse.json({ message }, { status: retry.status });
    }

    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } catch {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
