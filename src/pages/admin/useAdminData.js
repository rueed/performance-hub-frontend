import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listDepartments } from '../../api/departmentsApi';
import { listUsers } from '../../api/usersApi';

export default function useAdminData(withUsers = false) {
  const { token, logout } = useAuth();
  const [data, setData] = useState({ users: [], departments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const handleError = useCallback(failure => {
    if (failure.status === 401) logout();
    else setError(failure.message);
  }, [logout]);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]);
        const [departments, users] = await Promise.all([listDepartments(token, signal), withUsers ? listUsers(token, signal) : Promise.resolve([])]);
        if (!controller.signal.aborted) setData({ departments, users });
      } catch (failure) { if (!controller.signal.aborted) handleError(failure); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    load();
    return () => controller.abort();
  }, [token, withUsers, revision, handleError]);
  return { ...data, loading, error, handleError, reload: () => setRevision(value => value + 1), token };
}
