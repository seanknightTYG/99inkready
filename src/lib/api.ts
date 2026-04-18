const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.REZIFY.99agents.agency';

export async function fetchWithAuth(endpoint: string, token: string | null, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  
  // Return null for 204 No Content
  if (res.status === 204) return null;
  
  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      errorMessage = await res.text() || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  return res.json();
}
