import { useState } from 'react';
import ObjectiveSlot from './ObjectiveSlot';
import { toDateInput, validateSlot, toPayload } from './objectiveRules';

const STATUS_LABELS = {
  Draft: 'Draft',
  PendingApproval: 'Pending approval',
  Approved: 'Approved',
  Rejected: 'Rejected',
  InProgress: 'In progress',
  Completed: 'Completed',
};

// One submitted objective. It uses the same card as the "Submit objectives" page,
// but the fields are read-only. Progress and edit buttons depend on the status.
function ObjectiveCard({ objective, busy, onProgress, onResubmit }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(objective.progress ?? 0);

  const canUpdateProgress =
    objective.status === 'Approved' || objective.status === 'InProgress';
  const isRejected = objective.status === 'Rejected';

  const shownValue = editing
    ? form
    : {
        id: objective.id,
        title: objective.title,
        description: objective.description || '',
        startDate: toDateInput(objective.startDate),
        endDate: toDateInput(objective.endDate),
        added: false,
      };

  function startEdit() {
    setForm({ ...shownValue });
    setError('');
    setEditing(true);
  }

  async function saveAndResubmit() {
    const message = validateSlot(form);
    if (message) {
      setError(message);
      return;
    }
    const ok = await onResubmit(objective.id, toPayload(form));
    if (ok) setEditing(false);
  }

  return (
    <ObjectiveSlot
      heading="Objective"
      badge={STATUS_LABELS[objective.status] || objective.status}
      badgeClass={`badge-${objective.status}`}
      value={shownValue}
      error={error}
      disabled={!editing || busy}
      onChange={editing ? setForm : () => {}}
    >
      {isRejected && objective.rejectionReason && (
        <p className="error">Rejected: {objective.rejectionReason}</p>
      )}

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${objective.progress ?? 0}%` }}
        />
      </div>
      <p className="muted">{objective.progress ?? 0}% done</p>

      {canUpdateProgress && (
        <div className="form-actions">
          <input
            type="number"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            disabled={busy}
          />
          <button
            type="button"
            className="btn-primary"
            disabled={busy}
            onClick={() => onProgress(objective.id, progress)}
          >
            Update progress
          </button>
        </div>
      )}

      {isRejected && !editing && (
        <div className="form-actions">
          <button type="button" className="btn-primary" onClick={startEdit}>
            Edit and resubmit
          </button>
        </div>
      )}

      {editing && (
        <div className="form-actions">
          <button
            type="button"
            className="btn-primary"
            disabled={busy}
            onClick={saveAndResubmit}
          >
            Save and resubmit
          </button>
          <button
            type="button"
            className="btn-link"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </ObjectiveSlot>
  );
}

function ObjectivesList({ objectives, busy, onProgress, onResubmit }) {
  const sorted = [...objectives].sort((a, b) => a.id - b.id);

  return (
    <div className="slots-grid">
      {sorted.map((objective) => (
        <ObjectiveCard
          key={objective.id}
          objective={objective}
          busy={busy}
          onProgress={onProgress}
          onResubmit={onResubmit}
        />
      ))}
    </div>
  );
}

export default ObjectivesList;