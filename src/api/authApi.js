// Authentication stays isolated until the team's shared client is integrated.
export class AuthApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
  }
}

function validateUser(user) {
  if (!user || !['Admin', 'Employee'].includes(user.role) ||
      typeof user.fullName !== 'string' || !user.fullName.trim() ||
      typeof user.email !== 'string' || user.id == null ||
      typeof user.isManager !== 'boolean' || typeof user.isActive !== 'boolean') {
    throw new AuthApiError('The server returned unexpected user details. Please contact support.');
  }
  if (!user.isActive) throw new AuthApiError('Your account is inactive. Contact your administrator.', 403);
  return user;
}

async function request(path, { token, body, signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
  if (!baseUrl) throw new AuthApiError('The API address is not configured. Contact your administrator.');
  let response;
  try {
    response = await fetch(`${baseUrl}/api/auth/${path}`, {
      method: body ? 'POST' : 'GET',
      headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: signal ?? AbortSignal.timeout(15000),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new AuthApiError('Unable to reach the server. Check your connection and try again.');
  }
  if (response.status === 401) throw new AuthApiError(path === 'login' ? 'The email or password is incorrect.' : 'Your session has expired. Please log in again.', 401);
  if (response.status === 403) throw new AuthApiError('Access denied. Contact your administrator.', 403);
  if (!response.ok) throw new AuthApiError(response.status >= 500 ? 'The server is temporarily unavailable. Please try again.' : 'The request could not be completed. Please try again.', response.status);
  try { return await response.json(); }
  catch { throw new AuthApiError('The server returned an unexpected response. Please try again.'); }
}

export async function loginRequest(email, password) {
  const data = await request('login', { body: { email, password } });
  if (typeof data?.token !== 'string' || !data.token.trim()) throw new AuthApiError('The server did not return a valid session. Please try again.');
  return { token: data.token, user: validateUser(data.user) };
}

export async function getCurrentUser(token, signal) {
  const data = await request('me', { token, signal });
  return validateUser(data?.user ?? data);
}
