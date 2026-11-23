import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './performance.css';

// Wraps every Performance page with a small menu.
// Manager links show for users with direct reports (user.isManager).
// HR links show for the Admin role.
export default function PerformanceLayout() {
  const { user } = useAuth();

  return (
    <div className="perf">
      <nav className="perf-nav" aria-label="Performance">
        <NavLink end to="/performance">Home</NavLink>
        <NavLink to="/performance/dashboard">Dashboard</NavLink>
        <NavLink to="/performance/objectives">Objectives</NavLink>
        <NavLink to="/performance/evaluations">My Evaluations</NavLink>

        {user.isManager && (
          <>
            <span className="perf-nav-divider" aria-hidden="true" />
            <NavLink to="/performance/my-team">My team</NavLink>
            <NavLink to="/performance/team-evaluations">Team Evaluations</NavLink>
          </>
        )}

        {user.role === 'Admin' && (
          <>
            <span className="perf-nav-divider" aria-hidden="true" />
            <NavLink to="/performance/employees">All employees</NavLink>
          </>
        )}
      </nav>

      <Outlet />
    </div>
  );
}