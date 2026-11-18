import { useCallback, useEffect, useRef, useState } from 'react';
import { getCurrentUser, loginRequest } from '../api/authApi';
import { AuthContext } from './AuthContext';

const TOKEN_KEY = 'performance-hub.access-token';
function readToken() {
  try { return sessionStorage.getItem(TOKEN_KEY); }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readToken);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const generation = useRef(0);

  const logout = useCallback(() => {
    generation.current += 1;
    try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* Clear memory even if storage is unavailable. */ }
    setToken(null);
    setUser(null);
    setSessionError('');
    setLoading(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const version = generation.current;
    const storedToken = readToken();
    async function restore() {
      if (!storedToken) { setLoading(false); return; }
      try {
        const restored = await getCurrentUser(storedToken, AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]));
        if (!controller.signal.aborted && version === generation.current) {
          setUser(restored);
          setToken(storedToken);
          setSessionError('');
        }
      } catch (error) {
        if (controller.signal.aborted || version !== generation.current) return;
        if (error.status === 401) logout();
        else setSessionError(error.message);
      } finally {
        if (!controller.signal.aborted && version === generation.current) setLoading(false);
      }
    }
    restore();
    return () => controller.abort();
  }, [attempt, logout]);

  async function login(email, password) {
    const version = ++generation.current;
    const result = await loginRequest(email, password);
    if (version !== generation.current) return;
    try { sessionStorage.setItem(TOKEN_KEY, result.token); }
    catch { throw new Error('Session storage is unavailable. Allow browser storage and try again.'); }
    setToken(result.token);
    setUser(result.user);
    setSessionError('');
    setLoading(false);
  }

  function retrySession() {
    setSessionError('');
    setLoading(true);
    setAttempt(value => value + 1);
  }
  return <AuthContext.Provider value={{ user, token, loading, sessionError, login, logout, retrySession }}>{children}</AuthContext.Provider>;
}
