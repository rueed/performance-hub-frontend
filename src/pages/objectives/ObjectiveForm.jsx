import { useState } from 'react';

const emptyForm = { title: '', description: '', startDate: '', endDate: '' };

// A controlled form with two actions:
//  - Add:        puts the objective in the "ready to submit" list (page state)
//  - Save Draft: saves it in the database as a Draft (it is NOT submitted)
function ObjectiveForm({ onAdd, onSaveDraft }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  // Checks the form. Returns the data for the backend, or null if invalid.
  function validate() {
    if (!form.title.trim()) {
      setError('Title is required');
      return null;
    }
    if (!form.startDate || !form.endDate) {
      setError('Start date and end date are required');
      return null;
    }
    // "YYYY-MM-DD" strings compare correctly as plain text
    if (form.endDate <= form.startDate) {
      setError('End date must be after the start date');
      return null;
    }
    setError('');
    return {
      title: form.title.trim(),
      description: form.description.trim(),
      // the backend expects a full UTC date-time
      startDate: `${form.startDate}T00:00:00Z`,
      endDate: `${form.endDate}T00:00:00Z`,
    };
  }

  // Add button (also runs when the user presses Enter)
  function handleAdd(event) {
    event.preventDefault();
    const data = validate();
    if (!data) return;
    onAdd(data);
    setForm(emptyForm);
  }

  // Save Draft button
  async function handleSaveDraft() {
    const data = validate();
    if (!data) return;

    setSaving(true);
    try {
      await onSaveDraft(data);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card objective-form" onSubmit={handleAdd}>
      <div className="card-title">
        <h2>Create objective</h2>
        <p className="muted">
          Add it to the list below, or save it as a draft for later.
        </p>
      </div>

      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} />
      </label>

      <label>
        Description
        <textarea
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
        />
      </label>

      <div className="form-row">
        <label>
          Start date
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </label>

        <label>
          End date
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          Add
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={saving}
          onClick={handleSaveDraft}
        >
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
      </div>
    </form>
  );
}

export default ObjectiveForm;