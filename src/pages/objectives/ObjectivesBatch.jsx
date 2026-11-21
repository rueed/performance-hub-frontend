// The "ready to submit" list. Nothing here is in the database yet.
// One button sends every objective in the list to the manager.
function ObjectivesBatch({ items, submitting, onRemove, onSubmitAll }) {
  if (items.length === 0) return null;

  return (
    <section className="card batch-card">
      <div className="card-title">
        <h2>Ready to submit ({items.length})</h2>
        <p className="muted">
          These objectives will be sent to your manager for approval.
        </p>
      </div>

      <ul className="batch-list">
        {items.map((item) => (
          <li key={item.tempId} className="batch-item">
            <div>
              <strong>{item.title}</strong>
              <span className="muted">
                {item.startDate.slice(0, 10)} to {item.endDate.slice(0, 10)}
              </span>
            </div>
            <button
              type="button"
              className="btn-link"
              disabled={submitting}
              onClick={() => onRemove(item.tempId)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn-primary"
        disabled={submitting}
        onClick={onSubmitAll}
      >
        {submitting
          ? 'Submitting...'
          : `Submit for approval (${items.length})`}
      </button>
    </section>
  );
}

export default ObjectivesBatch;