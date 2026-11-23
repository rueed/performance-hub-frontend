import { useEffect, useState } from 'react';
import { getMyObjectives } from '../../api/objectivesApi';
import StatCard from './StatCard';
import './dashboard.css';

// The status values come from the backend as text (see ObjectiveStatus).
const STATUSES = [
  { value: 'Draft', label: 'Draft' },
  { value: 'PendingApproval', label: 'Pending approval' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

// Employee dashboard: numbers about MY objectives.
function DashboardPage() {
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // runs once, after the first render
  useEffect(() => {
    async function load() {
      try {
        const data = await getMyObjectives();
        setObjectives(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="page">
      <h1>My Dashboard</h1>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted-text">Loading...</p>}

      {!loading && (
        <div className="stat-grid">
          <StatCard label="Total objectives" value={objectives.length} />
          {STATUSES.map((status) => (
            <StatCard
              key={status.value}
              label={status.label}
              value={objectives.filter((o) => o.status === status.value).length}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;