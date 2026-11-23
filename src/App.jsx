import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/home/HomePage';
import AppLayout from './components/AppLayout';
import UsersPage from './pages/admin/UsersPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';

// Performance module (Ruaa)
import PerformanceLayout from './pages/performance/PerformanceLayout';
import PerformanceHome from './pages/performance/PerformanceHome';
import DashboardPage from './pages/dashboard/DashboardPage';
import ObjectivesPage from './pages/objectives/ObjectivesPage';
import MyEvaluationsPage from './pages/evaluations/MyEvaluationsPage';
import TeamEvaluationsPage from './pages/evaluations/TeamEvaluationsPage';
import TeamPage from './pages/team/TeamPage';
import EmployeesPage from './pages/hr/EmployeesPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/performance" element={<PerformanceLayout />}>
            <Route index element={<PerformanceHome />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="objectives" element={<ObjectivesPage />} />
            <Route path="evaluations" element={<MyEvaluationsPage />} />

            {/* managers only */}
            <Route element={<ProtectedRoute canAccess={(user) => user.isManager} />}>
              <Route path="my-team" element={<TeamPage />} />
              <Route path="team-evaluations" element={<TeamEvaluationsPage />} />
            </Route>

            {/* HR (Admin) only */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="employees" element={<EmployeesPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/departments" element={<DepartmentsPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}