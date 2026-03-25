import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/** In-memory sliding window rate limiter — used when Redis is not configured. */
class InMemoryRateLimiter {
  private windows = new Map<string, number[]>();

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number
  ) {}

  async limit(identifier: string): Promise<{ success: boolean }> {
    const now = Date.now();
    const key = identifier;
    const windowStart = now - this.windowMs;

    const timestamps = (this.windows.get(key) ?? []).filter(t => t > windowStart);
    if (timestamps.length >= this.maxRequests) {
      return { success: false };
    }
    timestamps.push(now);
    this.windows.set(key, timestamps);
    return { success: true };
  }
}

function createRateLimiter(
  limiter: Ratelimit["limiter"],
  prefix: string,
  fallbackRequests: number,
  fallbackWindowMs: number
): { limit: (id: string) => Promise<{ success: boolean }> } {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    const level = process.env.NODE_ENV === "production" ? "error" : "warn";
    console[level](
      `[rate-limit] Redis not configured for "${prefix}". Falling back to in-memory limiter.`
    );
    return new InMemoryRateLimiter(fallbackRequests, fallbackWindowMs);
  }

  return new Ratelimit({ redis: Redis.fromEnv(), limiter, prefix });
}

/** AI chat: 5 messages per user per hour */
export const aiRateLimit = createRateLimiter(
  Ratelimit.slidingWindow(5, "1 h"),
  "shesync:ai",
  5,
  60 * 60 * 1000
);

/** Plan generation: 2 per user per 24h */
export const planRateLimit = createRateLimiter(
  Ratelimit.fixedWindow(2, "24 h"),
  "shesync:plan",
  2,
  24 * 60 * 60 * 1000
);

/** Onboarding submission: 10 per user per hour */
export const onboardingRateLimit = createRateLimiter(
  Ratelimit.slidingWindow(10, "1 h"),
  "shesync:onboarding",
  10,
  60 * 60 * 1000
);

/** Auth endpoints: 10 attempts per IP per hour */
export const authRateLimit = createRateLimiter(
  Ratelimit.slidingWindow(10, "1 h"),
  "shesync:auth",
  10,
  60 * 60 * 1000
);
