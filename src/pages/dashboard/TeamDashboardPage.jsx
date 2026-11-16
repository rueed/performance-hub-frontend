import { useEffect, useState } from 'react';
import { getTeamObjectives } from '../../api/objectivesApi';
import { getTeamMembers } from '../../api/evaluationsApi';
import StatCard from './StatCard';
import './dashboard.css';
import './team-dashboard.css';

const STATUSES = [
  { value: 'PendingApproval', label: 'Waiting for me' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'InProgress', label: 'In progress' },
  { value: 'Completed', label: 'Completed' },
];

// Manager dashboard: numbers about my whole team.
function TeamDashboardPage() {
  const [objectives, setObjectives] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // runs once, after the first render
  useEffect(() => {
    async function load() {
      try {
        const [objectivesData, membersData] = await Promise.all([
          getTeamObjectives(),
          getTeamMembers(),
        ]);
        setObjectives(objectivesData);
        setMembers(membersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // one row per team member: how many objectives and the average progress
  const rows = members.map((member) => {
    const mine = objectives.filter((o) => o.userId === member.id);
    const sum = mine.reduce((total, o) => total + o.progress, 0);
    return {
      id: member.id,
      name: member.fullName,
      count: mine.length,
      average: mine.length === 0 ? 0 : Math.round(sum / mine.length),
    };
  });

  return (
    <div className="page">
      <h1>Team Dashboard</h1>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted-text">Loading...</p>}

      {!loading && (
        <>
          <div className="stat-grid">
            <StatCard label="Team members" value={members.length} />
            <StatCard label="Team objectives" value={objectives.length} />
            {STATUSES.map((status) => (
              <StatCard
                key={status.value}
                label={status.label}
                value={objectives.filter((o) => o.status === status.value).length}
              />
            ))}
          </div>

          <div className="card team-table-wrap">
            <table className="team-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Objectives</th>
                  <th>Average progress</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.count}</td>
                    <td>{row.average}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default TeamDashboardPage;
