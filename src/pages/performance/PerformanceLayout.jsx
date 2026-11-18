import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './performance.css';

// Wraps every Performance page with a small menu.
// The manager links only show for users who have direct reports (user.isManager).
export default function PerformanceLayout() {
  const { user } = useAuth();

  return (
    <div className="perf">
      <nav className="perf-nav" aria-label="Performance">
        <NavLink end to="/performance">Dashboard</NavLink>
        <NavLink to="/performance/objectives">Objectives</NavLink>
        <NavLink to="/performance/evaluations">My Evaluations</NavLink>

        {user.isManager && (
          <>
            <span className="perf-nav-divider" aria-hidden="true" />
            <NavLink to="/performance/team">Team Dashboard</NavLink>
            <NavLink to="/performance/approvals">Approvals</NavLink>
            <NavLink to="/performance/team-evaluations">Team Evaluations</NavLink>
          </>
        )}
      </nav>

      <Outlet />
    </div>
  );
}
