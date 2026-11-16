import { useState } from 'react';

function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

function ApprovalCard({ objective, onApprove, onReject }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  function handleConfirmReject() {
    if (!reason.trim()) {
      setReasonError('Please write the reason for rejecting.');
      return;
    }
    onReject(objective.id, reason.trim());
  }

  return (
    <div className="card approval-card">
      <div className="approval-header">
        <h3 className="approval-title">{objective.title}</h3>
        <span className="muted-text">Employee #{objective.userId}</span>
      </div>

      <p>{objective.description}</p>
      <p className="muted-text">
        {formatDate(objective.startDate)} to {formatDate(objective.endDate)}
      </p>

      {!rejecting && (
        <div className="approval-actions">
          <button className="btn" onClick={() => onApprove(objective.id)}>
            Approve
          </button>
          <button className="btn btn-danger" onClick={() => setRejecting(true)}>
            Reject
          </button>
        </div>
      )}

      {rejecting && (
        <div className="field">
          <label htmlFor={`reason-${objective.id}`}>Reason for rejecting</label>
          <textarea
            id={`reason-${objective.id}`}
            className="input"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {reasonError && <p className="error-text">{reasonError}</p>}
          <div className="approval-actions">
            <button className="btn btn-danger" onClick={handleConfirmReject}>
              Confirm reject
            </button>
            <button className="btn btn-secondary" onClick={() => setRejecting(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApprovalCard;