// The only place in the Performance module that talks to the backend.
// Every other file calls apiRequest() instead of using fetch() directly,
// so the token and the error handling are written once.
//
// The token is the one saved by AuthProvider after login (same key, same storage).

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
const TOKEN_KEY = 'performance-hub.access-token';

function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    // storage can be blocked by the browser, in that case there is no token
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  if (!BASE_URL) {
    throw new Error('The API address is not configured. Check VITE_API_URL.');
  }

  const headers = { 'Content-Type': 'application/json', ...options.headers };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error('Unable to reach the server. Check your connection and try again.');
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Your session has expired. Please log in again.');
    }
    if (response.status === 403) {
      throw new Error('You do not have permission to do this.');
    }

    let message = `Request failed (${response.status})`;
    try {
      // ASP.NET sends errors as JSON with a "title" field
      const problem = await response.json();
      if (problem.title) {
        message = problem.title;
      }
    } catch {
      // the body was not JSON, keep the default message
    }
    throw new Error(message);
  }

  // Some endpoints return an empty body, so read it as text first.
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
