export async function apiFetch(path: string, opts: RequestInit = {}) {
  // Get the session token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Set up headers
  const headers = new Headers(opts.headers || {});
  
  // Add auth token if it exists
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Add content type if not set
  if (!headers.has('Content-Type') && opts.body && typeof opts.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }
  
  // Make the request with the updated headers
  const res = await fetch(path, {
    ...opts,
    headers,
    credentials: 'include', // Important for including cookies in cross-origin requests
  });
  
  // Handle 401 Unauthorized
  if (res.status === 401) {
    // Clear any existing auth data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    throw new Error('Session expired. Please log in again.');
  }
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${res.status}`);
  }
  
  // Handle empty responses
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
