import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface TokenResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  error?: string;
}

// This function would typically call your auth server to refresh the token
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  try {
    // Here you would typically make a request to your auth server
    // to refresh the access token using the refresh token
    // This is a simplified example
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to refresh token');
    }

    return {
      success: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || refreshToken, // Fallback to old refresh token if not provided
      expiresIn: data.expiresIn,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to refresh token',
    };
  }
}

// Helper to validate token expiration
export function isTokenExpired(exp: number): boolean {
  if (!exp) return true;
  return Date.now() >= exp * 1000; // Convert to milliseconds
}

// Middleware to check for valid session and refresh token if needed
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return { user: null, error: 'Not authenticated' };
  }

  // Check if token is expired
  if (session.user.exp && isTokenExpired(session.user.exp)) {
    if (!session.user.refreshToken) {
      return { user: null, error: 'Session expired' };
    }

    // Try to refresh the token
    const refreshResult = await refreshAccessToken(session.user.refreshToken);
    
    if (!refreshResult.success) {
      return { user: null, error: 'Session expired. Please log in again.' };
    }

    // Update session with new tokens
    // In a real app, you would update the session in your auth system
    return { 
      user: { 
        ...session.user,
        accessToken: refreshResult.accessToken,
        refreshToken: refreshResult.refreshToken,
        exp: refreshResult.expiresIn ? Math.floor(Date.now() / 1000) + refreshResult.expiresIn : undefined,
      },
      error: null 
    };
  }

  return { user: session.user, error: null };
}
