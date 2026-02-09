export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BACKEND = process.env.BACKEND_BASE_URL ?? 'http://127.0.0.1:3001';
const API_KEY = process.env.ADMIN_API_KEY;

async function handler(req: Request) {
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'ADMIN_API_KEY not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Build upstream URL
  const urlObj = new URL(req.url);
  const search = urlObj.search ?? '';
  const base = `${BACKEND}/api/parts`;

  // Support admin actions by id or by inventory number:
  // - PUT/DELETE ?id=123        -> /api/parts/123
  // - DELETE   ?inv=939139      -> /api/parts/by-inv/939139
  // - Otherwise falls back to /api/parts?...
  const id = urlObj.searchParams.get('id');
  const inv = urlObj.searchParams.get('inv');

  let upstreamUrl = base + (search || '');
  if (req.method === 'PUT' || req.method === 'DELETE') {
    if (inv) {
      upstreamUrl = `${base}/by-inv/${encodeURIComponent(inv)}`;
    } else if (id) {
      upstreamUrl = `${base}/${encodeURIComponent(id)}`;
    }
  }

  const body =
    req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.text();

  const upstream = await fetch(upstreamUrl, {
    method: req.method,
    headers: {
      // Send the server-only key, never expose it to the browser
      'X-API-Token': API_KEY,
      'Authorization': `ApiKey ${API_KEY}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body,
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      'Content-Type':
        upstream.headers.get('content-type') ?? 'application/json',
    },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
