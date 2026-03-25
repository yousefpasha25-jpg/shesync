import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/** No-op rate limiter used when Redis env vars are not configured. Always allows requests. */
const noopLimiter = {
  limit: async (_identifier: string) => ({ success: true }),
};

function createRateLimiter(limiter: Ratelimit["limiter"], prefix: string): { limit: (id: string) => Promise<{ success: boolean }> } {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[rate-limit] Upstash Redis not configured — rate limiting disabled for prefix "${prefix}".`);
    } else {
      console.error(`[rate-limit] CRITICAL: Upstash Redis not configured in production for prefix "${prefix}". Rate limiting is DISABLED.`);
    }
    return noopLimiter;
  }

  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter,
    prefix,
  });
}

export const aiRateLimit = createRateLimiter(
  Ratelimit.slidingWindow(5, "1 h"),
  "shesync:ai"
);

export const planRateLimit = createRateLimiter(
  Ratelimit.fixedWindow(2, "24 h"),
  "shesync:plan"
);
