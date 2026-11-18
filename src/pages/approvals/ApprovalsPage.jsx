import { useEffect, useState } from 'react';
import {
  getPendingObjectives,
  approveObjective,
  rejectObjective,
} from '../../api/objectivesApi';
import ApprovalCard from './ApprovalCard';
import './approvals.css';

function ApprovalsPage() {
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadPending() {
    try {
      const data = await getPendingObjectives();
      setObjectives(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // runs once, after the first render
  useEffect(() => {
    loadPending();
  }, []);

  // runs an action (approve / reject), then reloads the list
  async function runAction(action) {
    try {
      setError('');
      await action();
      await loadPending();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleApprove(id) {
    return runAction(() => approveObjective(id));
  }

  function handleReject(id, reason) {
    return runAction(() => rejectObjective(id, reason));
  }

  return (
    <div className="page">
      <h1>Team Approvals</h1>
      <p className="muted-text">Objectives your team members submitted and are waiting for you.</p>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted-text">Loading...</p>}

      {!loading && objectives.length === 0 && (
        <div className="card">
          <p className="muted-text">No objectives are waiting for approval.</p>
        </div>
      )}

      <div className="approvals-list">
        {objectives.map((objective) => (
          <ApprovalCard
            key={objective.id}
            objective={objective}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>
    </div>
  );
}

export default ApprovalsPage;