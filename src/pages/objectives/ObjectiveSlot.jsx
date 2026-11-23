// One objective card. It has exactly the look of the old "Create objective" card
// (the classes "card objective-form" come from objectives.css).
// The buttons show only when onAdd / onSaveDraft are given
// (a rejected objective that is being edited has its own buttons).
function ObjectiveSlot({
  heading,
  hint,
  badge,
  badgeClass,
  value,
  error,
  disabled,
  onChange,
  onAdd,
  onSaveDraft,
  onRemove,
  children,
}) {
  // any change makes the card "not added" again, so Add must be pressed again
  function handleChange(event) {
    const { name, value: fieldValue } = event.target;
    onChange({ ...value, [name]: fieldValue, added: false });
  }

  return (
    <div className="card objective-form">
      <div className="slot-head">
        <div className="card-title">
          <h2>{heading}</h2>
          {hint && <p className="muted">{hint}</p>}
        </div>

        <div className="slot-head-right">
        {badge && <span className={`badge ${badgeClass || 'badge-Draft'}`}>{badge}</span>}          {onRemove && (
            <button
              type="button"
              className="btn-link"
              disabled={disabled}
              onClick={onRemove}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <label>
        Title
        <input
          name="title"
          value={value.title}
          onChange={handleChange}
          disabled={disabled}
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          rows={3}
          value={value.description}
          onChange={handleChange}
          disabled={disabled}
        />
      </label>

      <div className="form-row">
        <label>
          Start date
          <input
            type="date"
            name="startDate"
            value={value.startDate}
            onChange={handleChange}
            disabled={disabled}
          />
        </label>

        <label>
          End date
          <input
            type="date"
            name="endDate"
            value={value.endDate}
            onChange={handleChange}
            disabled={disabled}
          />
        </label>
      </div>

      {error && <p className="error">{error}</p>}
      {children}

      {(onAdd || onSaveDraft) && (
        <div className="form-actions">
          {onAdd && (
            <button
              type="button"
              className={value.added ? 'btn-added' : 'btn-primary'}
              disabled={disabled}
              onClick={onAdd}
            >
              {value.added ? 'Added ✓' : 'Add'}
            </button>
          )}
          {onSaveDraft && (
            <button
              type="button"
              className="btn-primary"
              disabled={disabled}
              onClick={onSaveDraft}
            >
              {value.id ? 'Update Draft' : 'Save Draft'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ObjectiveSlot;