// /src/shared/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BACKEND = (process.env.BACKEND_BASE_URL ?? 'http://127.0.0.1:3001').replace(/\/$/, '');
const API_KEY = process.env.ADMIN_API_KEY;
const ADMIN_COOKIE = 'adminToken';

// ---------- utils ----------
const unauthorized = () =>
  NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

const getSlugFromPath = (pathname: string): string[] => {
  // e.g. /api/admin/orders/status/paid -> ['status','paid']
  const base = '/api/admin/orders';
  if (!pathname.startsWith(base)) return [];
  const rest = pathname.slice(base.length).replace(/^\/+/, '');
  return rest ? rest.split('/').filter(Boolean) : [];
};

const buildUpstreamUrl = (req: NextRequest, slug: string[]) => {
  const path = slug.length ? `/${slug.join('/')}` : '';
  const { search } = req.nextUrl;
  return `${BACKEND}/api/orders${path}${search}`;
};

// Verify admin session using either a cookie or the incoming Authorization header
async function requireAdminSession(req: NextRequest): Promise<boolean> {
  const jar = await cookies();

  // 1) Try cookie
  const cookieToken = jar.get(ADMIN_COOKIE)?.value;

  // 2) Try Authorization header: "Bearer <token>"
  const authHeader = req.headers.get("authorization") || "";
  const headerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : undefined;

  const token = cookieToken || headerToken;
  if (!token) return false;

  // Try common “me” endpoints; treat any 2xx as OK
  const endpoints = ["/api/auth/me", "/api/admin/me", "/api/auth/admin-me"];
  for (const ep of endpoints) {
    try {
      const r = await fetch(`${BACKEND}${ep}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (r.ok) return true;
    } catch {
      // ignore and try next
    }
  }
  return false;
}

// ---------- proxy core ----------
const proxyRequest = async (req: NextRequest, method: string, hasBody = false) => {
  // Require an authenticated admin session to use this proxy
  const ok = await requireAdminSession(req);
  if (!ok) return unauthorized();

  if (!API_KEY) {
    return NextResponse.json({ error: 'ADMIN_API_KEY not set' }, { status: 500 });
  }

  const slug = getSlugFromPath(req.nextUrl.pathname);
  const url = buildUpstreamUrl(req, slug);
  const body = hasBody ? await req.text() : undefined;

  const upstream = await fetch(url, {
    method,
    headers: {
      // forward API key in both formats (matches EitherAuthGuard)
      'X-API-Token': API_KEY,
      Authorization: `ApiKey ${API_KEY}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body,
    cache: 'no-store',
  });

  const text = await upstream.text();
  const contentType = upstream.headers.get('content-type') ?? 'application/json';

  return new Response(text, {
    status: upstream.status,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      // pass through useful headers except unsafe ones
      ...Object.fromEntries(
        Array.from(upstream.headers.entries()).filter(
          ([k]) => !['set-cookie', 'content-encoding', 'transfer-encoding'].includes(k.toLowerCase()),
        ),
      ),
    },
  });
};

// ---------- Next route handlers ----------
export async function GET(req: NextRequest)    { return proxyRequest(req, 'GET'); }
export async function POST(req: NextRequest)   { return proxyRequest(req, 'POST', true); }
export async function PUT(req: NextRequest)    { return proxyRequest(req, 'PUT', true); }
export async function PATCH(req: NextRequest)  { return proxyRequest(req, 'PATCH', true); }
export async function DELETE(req: NextRequest) { return proxyRequest(req, 'DELETE'); }
