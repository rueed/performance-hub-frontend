import { useState } from 'react';

// The backend sends the status as text (see the JSON enum setting in Program.cs).
const STATUS_LABELS = {
  Draft: 'Draft',
  PendingApproval: 'Pending approval',
  Approved: 'Approved',
  Rejected: 'Rejected',
  InProgress: 'In progress',
  Completed: 'Completed',
};

// "2026-11-15T00:00:00" -> "2026-11-15"
function formatDate(value) {
  return value.slice(0, 10);
}

function ObjectiveCard({ objective, onSubmit, onProgress }) {
  const [progress, setProgress] = useState(objective.progress);

  // Business rules from docs/contract.md, section 6
  const canSubmit =
    objective.status === 'Draft' || objective.status === 'Rejected';
  const canUpdateProgress =
    objective.status === 'Approved' || objective.status === 'InProgress';

  function handleProgressClick() {
    // keep the value between 0 and 100
    const value = Math.min(100, Math.max(0, Number(progress) || 0));
    setProgress(value);
    onProgress(objective.id, value);
  }

  return (
    <li className="objective-card">
      <div className="card-header">
        <h3>{objective.title}</h3>
        <span className={`badge badge-${objective.status}`}>
          {STATUS_LABELS[objective.status] ?? objective.status}
        </span>
      </div>

      {objective.description && <p>{objective.description}</p>}

      <p className="dates">
        {formatDate(objective.startDate)} to {formatDate(objective.endDate)}
      </p>

      {objective.status === 'Rejected' && objective.rejectionReason && (
        <p className="error">Rejected: {objective.rejectionReason}</p>
      )}

      <div className="progress-bar" aria-label="Progress">
        <div
          className="progress-fill"
          style={{ width: `${objective.progress}%` }}
        />
      </div>
      <p className="dates">{objective.progress}% done</p>

      <div className="card-actions">
        {canSubmit && (
          <button onClick={() => onSubmit(objective.id)}>
            Submit for approval
          </button>
        )}

        {canUpdateProgress && (
          <>
            <input
              type="number"
              min={0}
              max={100}
              value={progress}
              onChange={(event) => setProgress(event.target.value)}
            />
            <button onClick={handleProgressClick}>Update progress</button>
          </>
        )}
      </div>
    </li>
  );
}

function ObjectivesList({ objectives, onSubmit, onProgress }) {
  if (objectives.length === 0) {
    return <p>No objectives yet. Create your first one above.</p>;
  }

  return (
    <ul className="objectives-list">
      {objectives.map((objective) => (
        <ObjectiveCard
          key={objective.id}
          objective={objective}
          onSubmit={onSubmit}
          onProgress={onProgress}
        />
      ))}
    </ul>
  );
}

export default ObjectivesList;
