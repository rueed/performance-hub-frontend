// One objective card. It has the look of the old "Create objective" card
// (the classes "card objective-form" come from objectives.css).
// It has no buttons: Save Draft / Submit are in the bar under all the cards.
function ObjectiveSlot({
  heading,
  badge,
  badgeClass,
  value,
  error,
  disabled,
  onChange,
  onRemove,
  children,
}) {
  function handleChange(event) {
    const { name, value: fieldValue } = event.target;
    onChange({ ...value, [name]: fieldValue });
  }

  return (
    <div className="card objective-form">
      <div className="slot-head">
        <div className="card-title">
          <h2>{heading}</h2>
        </div>

        <div className="slot-head-right">
          {badge && (
            <span className={`badge ${badgeClass || 'badge-Draft'}`}>{badge}</span>
          )}
          {onRemove && (
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
    </div>
  );
}

export default ObjectiveSlot;