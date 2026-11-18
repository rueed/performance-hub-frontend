// Isolated adapter for Jana's management features; does not replace the team's client.
export async function adminRequest(path, token, { method = 'GET', body, signal } = {}) {
  const base = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
  if (!base) throw new Error('The API address is not configured.');
  let response;
  try {
    response = await fetch(`${base}/api/${path}`, {
      method, signal: signal ?? AbortSignal.timeout(15000),
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Unable to reach the server. Check your connection and try again.', { cause: error });
  }
  if (!response.ok) {
    let message = 'The request could not be completed.';
    if (response.status === 401) message = 'Your session has expired. Please log in again.';
    else if (response.status === 403) message = 'You do not have permission to perform this action.';
    else if (response.status >= 500) message = 'The server is temporarily unavailable. Please try again.';
    else {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        message = typeof data === 'string' ? data : data.errors ? Object.values(data.errors).flat().join(' ') : data.title || message;
      } catch { if (text && text.length < 500 && !text.includes('<')) message = text; }
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return null;
  try { return await response.json(); }
  catch { throw new Error('The server returned an unexpected response. Please try again.'); }
}

export function requireList(data) {
  if (!Array.isArray(data)) throw new Error('The server returned an unexpected list.');
  return data;
}
