import { useState } from 'react';

const STATUS_LABELS = {
  Draft: 'Draft',
  PendingApproval: 'Pending approval',
  Approved: 'Approved',
  Rejected: 'Rejected',
  InProgress: 'In progress',
  Completed: 'Completed',
};

// Popup with the objectives of one employee.
// Managers (canReview) also get Approve / Reject buttons on pending objectives.
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
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  async function handleApprove(id) {
    setError('');
    try {
      await onApprove(id);
    } catch (err) {
      setError(err.message || 'Could not approve.');
    }
  }

  async function handleReject(id) {
    if (!reason.trim()) {
      setError('Please write the reason for rejecting.');
      return;
    }
    setError('');
    try {
      await onReject(id, reason.trim());
      setRejectingId(null);
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
      <h3>{employee.fullName}</h3>

      {objectives.length === 0 && <p className="muted">No objectives yet.</p>}

      {objectives.map((o) => (
        <div className="popup-objective" key={o.id}>
          <div className="popup-objective-head">
            <strong>{o.title}</strong>
            <span className={`status-chip status-${o.status}`}>
              {STATUS_LABELS[o.status] || o.status}
            </span>
          </div>

          {o.description && <p className="muted">{o.description}</p>}

          <div className="mini-bar">
            <div className="mini-bar-fill" style={{ width: `${o.progress ?? 0}%` }} />
          </div>

          {o.status === 'Rejected' && o.rejectionReason && (
            <p className="error">Rejected: {o.rejectionReason}</p>
          )}

          {canReview && o.status === 'PendingApproval' && (
            <div className="popup-actions">
              {rejectingId === o.id ? (
                <>
                  <input
                    placeholder="Reason for rejecting"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleReject(o.id)}
                  >
                    Confirm reject
                  </button>
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => setRejectingId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-approve"
                    onClick={() => handleApprove(o.id)}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => {
                      setRejectingId(o.id);
                      setReason('');
                      setError('');
                    }}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default EmployeePopup;