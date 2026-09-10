// functions/api/contributions.ts
//
// GET /api/contributions — Cloudflare Pages Function.
//
// Proxies GitHub's public, unauthenticated, undocumented HTML endpoint
// (https://github.com/users/<login>/contributions) and returns parsed JSON,
// so the browser never has to hit github.com directly (CORS, and GitHub
// blocks non-browser User-Agents on this endpoint anyway).
//
// No secrets, no env vars, no token — this is the same HTML anyone gets
// visiting a profile page's contribution graph in a browser.
//
// Caching: Cloudflare's edge Cache API (`caches.default`), keyed on the
// request URL, 6h TTL server-side; the response also carries a
// Cache-Control header so any downstream/browser cache agrees.
//
// Failure mode: GitHub is unreachable, rate-limits us, or has changed the
// calendar markup (parseContributions throws) -> 503 with a short-lived
// cache, so the client falls back to the committed snapshot
// (src/data/contributions.json) and a real outage doesn't get cached for 6h.

import { parseContributions } from '../_lib/parse-contributions.mjs';

const GITHUB_LOGIN = 'zoeb-nomi';
const SOURCE_URL = `https://github.com/users/${GITHUB_LOGIN}/contributions`;

const LIVE_CACHE_CONTROL = 'public, max-age=3600, s-maxage=21600'; // 1h browser / 6h edge
const UNAVAILABLE_CACHE_CONTROL = 'public, max-age=60, s-maxage=60'; // don't wedge a 503 in for 6h

export const onRequestGet: PagesFunction = async (context) => {
  const cache = caches.default;
  const cacheKey = new Request(context.request.url, context.request);

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const response = await buildResponse();

  // Cache successful (200) and unavailable (503) responses separately —
  // each carries its own Cache-Control, so cache.put respects the TTL
  // baked into the response headers.
  context.waitUntil(cache.put(cacheKey, response.clone()));

  return response;
};

async function buildResponse(): Promise<Response> {
  try {
    const upstream = await fetch(SOURCE_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        Accept: 'text/html',
      },
      // GitHub's HTML endpoint is uncached by us upstream — we do our own
      // caching at the edge above.
      cf: { cacheTtl: 0, cacheEverything: false },
    });

    if (!upstream.ok) {
      throw new Error(`upstream ${SOURCE_URL} returned ${upstream.status}`);
    }

    const html = await upstream.text();
    const parsed = parseContributions(html);

    const body = {
      source: 'live' as const,
      fetched_at: new Date().toISOString(),
      total_last_year: parsed.total_last_year,
      days: parsed.days,
    };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': LIVE_CACHE_CONTROL,
      },
    });
  } catch (err) {
    const body = { source: 'unavailable' as const };
    return new Response(JSON.stringify(body), {
      status: 503,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': UNAVAILABLE_CACHE_CONTROL,
      },
    });
  }
}
