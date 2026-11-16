// The only place in the frontend that talks to the backend.
// Every other file calls apiRequest() instead of using fetch() directly,
// so the token and the error handling are written once.

const BASE_URL = import.meta.env.VITE_API_URL;

function getToken() {
  try {
    return localStorage.getItem('token');
  } catch {
    // storage can be blocked by the browser, in that case there is no token
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  // TODO: the login page (Jana) must save the JWT in localStorage under the key "token".
  // Until login is ready there is no token, and the backend uses its temporary user id.
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
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