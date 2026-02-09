export function getCookieOptions(maxAge?: number) {
  const isProd = process.env.NODE_ENV === "production";
  // If BACKEND_URL is set and starts with https, prefer secure cookies.
  const backendIsHttps =
    !!process.env.BACKEND_URL && process.env.BACKEND_URL.startsWith("https");
  // Allow explicit override via COOKIE_SECURE env var ("true"/"false").
  const envOverride =
    typeof process.env.COOKIE_SECURE === "string"
      ? process.env.COOKIE_SECURE === "true"
      : undefined;

  const secure =
    typeof envOverride === "boolean"
      ? envOverride
      : isProd
      ? backendIsHttps
      : false;

  const base: Record<string, unknown> = {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
  };
  if (typeof maxAge === "number") base.maxAge = maxAge;
  return base;
}
