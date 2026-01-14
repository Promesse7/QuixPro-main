export function getBaseUrl(): string {
  // CLIENT-SIDE: Use relative URLs or window.location
  if (typeof window !== 'undefined') {
    // In production, return empty string to use relative URLs
    // In development, could return window.location.origin if needed
    return ''; // This makes fetch('/api/...') work correctly
  }
  
  // SERVER-SIDE: Use environment variables
  // prefer an explicit public base URL first
  if (process?.env?.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  // Vercel exposes VERCEL_URL during build/runtime
  if (process?.env?.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // fallback to local dev
  return 'http://localhost:3000';
}
