import { useState } from 'react';

const STATUS_LABELS = {
  Draft: 'Draft',
  PendingApproval: 'Pending approval',
  Approved: 'Approved',
  Rejected: 'Rejected',
  InProgress: 'In progress',
  Completed: 'Completed',
};

// One status for the whole set (the objectives are decided together)
function overallStatus(objectives) {
  if (objectives.length === 0) return null;
  for (const status of ['Rejected', 'PendingApproval', 'Approved']) {
    if (objectives.some((o) => o.status === status)) return status;
  }
  return objectives[0].status;
}

// Popup with the objectives of one employee.
// The status is shown once, next to the name.
// For a manager (canReview) it has Approve all / Reject all:
// the objectives of an employee are decided together, with one reason.
function EmployeePopup({
  employee,
  objectives,
  canReview,
  onApprove,
  onReject,
  style,
  onEnter,
  onLeave,
}) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const status = overallStatus(objectives);
  const pendingCount = objectives.filter((o) => o.status === 'PendingApproval').length;
  const rejectedWithReason = objectives.find(
    (o) => o.status === 'Rejected' && o.rejectionReason
  );

  async function handleApprove() {
    setError('');
    try {
      await onApprove(employee.id);
    } catch (err) {
      setError(err.message || 'Could not approve.');
    }
  }

  async function handleReject() {
    if (!reason.trim()) {
      setError('Please write the reason for rejecting.');
      return;
    }
    setError('');
    try {
      await onReject(employee.id, reason.trim());
      setRejecting(false);
      setReason('');
    } catch (err) {
      setError(err.message || 'Could not reject.');
    }
  }

  return (
    <div
      className="people-popup"
      style={style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="popup-head">
        <h3>{employee.fullName}</h3>
        {status && (
          <span className={`status-chip status-${status}`}>
            {STATUS_LABELS[status] || status}
          </span>
        )}
      </div>

            {rejectedWithReason && (
        <p className="error">Rejected: {rejectedWithReason.rejectionReason}</p>
      )}

      {objectives.length === 0 && <p className="muted">No objectives yet.</p>}

      {objectives.map((o) => (
        <div className="popup-objective" key={o.id}>
          <strong>{o.title}</strong>
          {o.description && <p className="muted">{o.description}</p>}
        </div>
      ))}

      {canReview && pendingCount > 0 && (
        <div className="popup-review">
          <div className="popup-actions">
            {rejecting ? (
              <>
                <input
                  placeholder="Reason for rejecting all"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <button type="button" className="btn-danger" onClick={handleReject}>
                  Confirm reject
                </button>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setRejecting(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn-approve" onClick={handleApprove}>
                  Approve all ({pendingCount})
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => {
                    setRejecting(true);
                    setReason('');
                    setError('');
                  }}
                >
                  Reject all
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}


export default EmployeePopup;