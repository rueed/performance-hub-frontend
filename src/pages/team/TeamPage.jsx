import { useEffect, useState } from 'react';
import { getTeamMembers } from '../../api/evaluationsApi'; // <- see the note below
import {
  getTeamObjectives,
  approveTeamMember,
  rejectTeamMember,
} from '../../api/objectivesApi';
import EmployeesTable from '../people/EmployeesTable';

// Manager page: "My team". Hover an employee to see objectives and approve / reject.
function TeamPage() {
  const [members, setMembers] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      const [teamMembers, teamObjectives] = await Promise.all([
        getTeamMembers(),
        getTeamObjectives(),
      ]);
      setMembers(teamMembers);
      // the manager does not see drafts of his employees
      setObjectives(teamObjectives.filter((o) => o.status !== 'Draft'));
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load the team.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function handleApprove(userId) {
    await approveTeamMember(userId);
    await load();
  }

  async function handleReject(userId, reason) {
    await rejectTeamMember(userId, reason);
    await load();
  }
  return (
    <div>
      <h1>My team</h1>
      {loading && <p className="muted">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && (
        <EmployeesTable
          employees={members}
          objectives={objectives}
          canReview
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export default TeamPage;