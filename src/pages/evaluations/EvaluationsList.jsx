// Shows a list of evaluation cards. Used by both evaluation pages.
// employeeNames is optional: { [userId]: "Full Name" }. The manager page passes it.

function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

function EvaluationsList({ evaluations, employeeNames }) {
  if (evaluations.length === 0) {
    return (
      <div className="card">
        <p className="muted-text">No evaluations yet.</p>
      </div>
    );
  }

  return (
    <div className="evaluations-list">
      {evaluations.map((evaluation) => (
        <div key={evaluation.id} className="card">
          <div className="evaluation-header">
            <h3 className="evaluation-period">{evaluation.period}</h3>
            <span className="badge badge-info">{evaluation.score} / 100</span>
          </div>

          {employeeNames && (
            <p className="muted-text">
              Employee: {employeeNames[evaluation.userId] ?? `#${evaluation.userId}`}
            </p>
          )}

          <p>{evaluation.comment || 'No comment'}</p>
          <p className="muted-text">{formatDate(evaluation.createdAt)}</p>
        </div>
      ))}
    </div>
  );
}

export default EvaluationsList;
