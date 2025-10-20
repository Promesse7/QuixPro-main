export function getBaseUrl(): string {
  // prefer an explicit public base URL first
  if (process?.env?.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  // Vercel exposes VERCEL_URL during build/runtime
  if (process?.env?.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // fallback to local dev
  return 'http://localhost:3000';
}