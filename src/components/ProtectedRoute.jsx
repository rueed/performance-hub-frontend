import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SessionStatus from './SessionStatus';
export default function ProtectedRoute({ allowedRoles, canAccess }) {
  const { user, loading, sessionError } = useAuth();
  if (loading || sessionError) return <SessionStatus />;
  if (!user) return <Navigate to="/login" replace />;
  if ((allowedRoles && !allowedRoles.includes(user.role)) || (canAccess && !canAccess(user))) {
    return <main className="page"><h1>Access denied</h1><p>You do not have permission to view this page.</p></main>;
  }
  return <Outlet />;
}
