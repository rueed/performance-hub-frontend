import StatCard from './StatCard';
import './dashboard.css';

const objectives = [
  { id: 1, title: 'Learn React', status: 'Completed', progress: 100 },
  { id: 2, title: 'Build login page', status: 'InProgress', progress: 60 },
  { id: 3, title: 'Write API docs', status: 'PendingApproval', progress: 0 },
  { id: 4, title: 'Finish dashboard', status: 'Approved', progress: 20 },
  { id: 5, title: 'Fix bugs', status: 'Completed', progress: 100 },
];
const STATUSES = [
  { key: 'Draft', label: 'Draft' },
  { key: 'PendingApproval', label: 'Pending approval' },
  { key: 'Approved', label: 'Approved' },
  { key: 'InProgress', label: 'In progress' },
  { key: 'Completed', label: 'Completed' },
  { key: 'Rejected', label: 'Rejected' },
];

function DashboardPage() {
    const total = objectives.length;
    const totalProgress = objectives.reduce((sum, o) => sum + o.progress, 0);
    const averageProgress = total === 0 ? 0 : Math.round(totalProgress / total);
  return (
    <div className="page">
      <h1>My Dashboard</h1>

      <div className="stat-grid">
        <StatCard label="Total objectives" value={total} />
        {STATUSES.map((s) => (
            <StatCard
            key={s.key}
            label={s.label}
            value={objectives.filter((o) => o.status === s.key).length}/>
))}
      </div>
      <h2>Overall progress</h2>
      <div className="overall-bar">
        <div className="overall-fill" style={{ width: `${averageProgress}%` }} />
      </div>
      <p className="muted-text">{averageProgress}% average progress</p>
    </div>
  );
}

export default DashboardPage;