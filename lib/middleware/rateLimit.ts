import { LRUCache } from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

// In-memory store for rate limiting
const tokenCache = new LRUCache<string, number[]>({
  max: 500, // Max 500 unique IPs per process
  ttl: 1000 * 60 * 5, // 5 minutes
});

export const rateLimiter = async (
  identifier: string,
  max: number,
  windowMs: number
): Promise<{ success: boolean; retryAfter: number }> => {
  // Get the current timestamp
  const now = Date.now();
  
  // Get or create the token's request timestamps
  const tokenState = tokenCache.get(identifier) || [];
  
  // Filter out old requests outside the current window
  const requestsInWindow = tokenState.filter(timestamp => {
    return timestamp > now - windowMs;
  });
  
  // Update the cache with the filtered requests
  tokenCache.set(identifier, [...requestsInWindow, now]);
  
  // Check if the number of requests exceeds the limit
  if (requestsInWindow.length >= max) {
    // Calculate retry after time in seconds
    const retryAfter = Math.ceil((windowMs - (now - requestsInWindow[0])) / 1000);
    return { success: false, retryAfter };
  }
  
  return { success: true, retryAfter: 0 };
};

// Rate limiting middleware
export const rateLimit = (options?: Options) => {
  const config = {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    ...options,
  };

  return async (req: Request) => {
    const identifier = req.headers.get('x-forwarded-for') || 'anonymous';
    
    const result = await rateLimiter(
      identifier,
      config.max,
      config.windowMs
    );

    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests',
          retryAfter: result.retryAfter
        }), 
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': result.retryAfter.toString()
          }
        }
      );
    }
  };
};
