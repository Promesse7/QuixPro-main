import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rateLimiter } from './rateLimit';
import { refreshAccessToken } from './token';

type Handler = (
  req: NextRequest,
  context: { params: any },
  user: any
) => Promise<NextResponse> | NextResponse | Promise<Response> | Response;

export function withAuth(handler: Handler, options: {
  roles?: string[];
  rateLimit?: {
    max: number;
    windowMs: number;
  };
} = {}) {
  return async (req: NextRequest, context: { params: any }) => {
    try {
      // Apply rate limiting if configured
      if (options.rateLimit) {
        const identifier = req.headers.get('x-forwarded-for') || 'anonymous';
        const result = await rateLimiter(
          identifier, 
          options.rateLimit.max, 
          options.rateLimit.windowMs
        );
        
        if (!result.success) {
          return new NextResponse(
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
      }

      // Check for valid session
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.email) {
        return new NextResponse(
          JSON.stringify({ error: 'Not authenticated' }), 
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check roles if specified
      if (options.roles && options.roles.length > 0) {
        const userRole = session.user.role;
        if (!options.roles.includes(userRole)) {
          return new NextResponse(
            JSON.stringify({ error: 'Insufficient permissions' }), 
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

      // Check for token expiration and refresh if needed
      const tokenExp = session.user.exp;
      if (tokenExp && tokenExp < Math.floor(Date.now() / 1000)) {
        const refreshResult = await refreshAccessToken(session.user.refreshToken);
        
        if (!refreshResult.success) {
          return new NextResponse(
            JSON.stringify({ error: 'Session expired. Please log in again.' }), 
            { 
              status: 401, 
              headers: { 
                'Content-Type': 'application/json',
                'Clear-Site-Data': '"cookies", "storage"' // Clear client-side auth state
              }
            }
          );
        }

        // Update the session with new tokens
        session.user.accessToken = refreshResult.accessToken;
        if (refreshResult.refreshToken) {
          session.user.refreshToken = refreshResult.refreshToken;
        }
        
        // You might want to update the session in your auth system here
      }

      // Call the handler with the authenticated user
      return handler(req, context, session.user);
      
    } catch (error) {
      console.error('Authentication error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}
