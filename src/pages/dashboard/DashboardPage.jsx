import StatCard from './StatCard';
import './dashboard.css';

function DashboardPage() {
  return (
    <div className="page">
      <h1>My Dashboard</h1>

      <div className="stat-grid">
        <StatCard label="Total objectives" value={5} />
        <StatCard label="Completed" value={2} />
        <StatCard label="Pending" value={1} />
      </div>
    </div>
  );
}

export default DashboardPage;