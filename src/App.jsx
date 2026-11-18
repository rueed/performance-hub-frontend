import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/home/HomePage';
import AppLayout from './components/AppLayout';
import UsersPage from './pages/admin/UsersPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';

// Performance module (Ruaa)
import PerformanceLayout from './pages/performance/PerformanceLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import TeamDashboardPage from './pages/dashboard/TeamDashboardPage';
import ObjectivesPage from './pages/objectives/ObjectivesPage';
import ApprovalsPage from './pages/approvals/ApprovalsPage';
import MyEvaluationsPage from './pages/evaluations/MyEvaluationsPage';
import TeamEvaluationsPage from './pages/evaluations/TeamEvaluationsPage';

export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/performance" element={<PerformanceLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="objectives" element={<ObjectivesPage />} />
          <Route path="evaluations" element={<MyEvaluationsPage />} />
          <Route element={<ProtectedRoute canAccess={(user) => user.isManager} />}>
            <Route path="team" element={<TeamDashboardPage />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="team-evaluations" element={<TeamEvaluationsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/departments" element={<DepartmentsPage />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
