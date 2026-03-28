/**
 * Lightweight in-memory rate limiter per IP.
 * Use for API routes only. Resets when the process restarts.
 */

const LIMIT = 20;
const WINDOW_MS = 60 * 1000; // 1 minute

const store = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0]?.trim() : null;
  return ip ?? "unknown";
}

/**
 * Check if the request is within rate limit. Returns true if allowed, false if rate limited.
 */
export function checkRateLimit(request: Request): { allowed: boolean; remaining: number } {
  const key = getClientKey(request);
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: LIMIT - 1 };
  }

  if (now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: LIMIT - 1 };
  }

  if (entry.count >= LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: LIMIT - entry.count };
}
