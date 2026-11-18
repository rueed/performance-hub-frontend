import { useState } from 'react';

const emptyForm = { title: '', description: '', startDate: '', endDate: '' };

// A controlled form: React state is the single source of truth for what is typed.
function ObjectiveForm({ onCreate }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // One handler for all inputs: the input's "name" attribute says which field changed.
  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page

    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!form.startDate || !form.endDate) {
      setError('Start date and end date are required');
      return;
    }
    // "YYYY-MM-DD" strings compare correctly as plain text
    if (form.endDate <= form.startDate) {
      setError('End date must be after the start date');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onCreate({
        title: form.title.trim(),
        description: form.description.trim(),
        // the backend expects a full UTC date-time
        startDate: `${form.startDate}T00:00:00Z`,
        endDate: `${form.endDate}T00:00:00Z`,
      });
      setForm(emptyForm); // clear the form after a successful save
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="objective-form" onSubmit={handleSubmit}>
      <h2>New objective</h2>

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

      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Create objective'}
      </button>
    </form>
  );
}

export default ObjectiveForm;
