import { useEffect, useState } from 'react';
import {
  getMyObjectives,
  createObjective,
  submitObjective,
  updateProgress,
} from '../../api/objectivesApi';
import ObjectiveForm from './ObjectiveForm';
import ObjectivesBatch from './ObjectivesBatch';
import ObjectivesList from './ObjectivesList';
import './objectives.css';

function ObjectivesPage() {
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // objectives added with "Add": waiting for "Submit for approval"
  const [batch, setBatch] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  async function loadObjectives() {
    try {
      const data = await getMyObjectives();
      setObjectives(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadObjectives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "Add": only puts the objective in the batch list (no API call)
  function handleAdd(data) {
    const tempId = `${Date.now()}-${Math.random()}`;
    setBatch((current) => [...current, { ...data, tempId }]);
    setNotice('');
  }

  function handleRemove(tempId) {
    setBatch((current) => current.filter((item) => item.tempId !== tempId));
  }

  // "Save Draft": creates the objective in the database, status Draft.
  // The form shows its own errors, so errors travel back to it.
  async function handleSaveDraft(data) {
    await createObjective(data);
    setNotice('Draft saved.');
    await loadObjectives();
  }

  // "Submit for approval": for every objective in the batch,
  // create it, then submit it. Drafts are not touched.
  async function handleSubmitAll() {
    setSubmitting(true);
    setError('');
    setNotice('');

    const failed = [];
    let sent = 0;

    for (const item of batch) {
      try {
        const { tempId, ...data } = item; // tempId is only for the UI
        const created = await createObjective(data);
        await submitObjective(created.id);
        sent += 1;
      } catch (err) {
        failed.push(item);
        setError(err.message);
      }
    }

    setBatch(failed); // keep only the ones that failed, so she can retry
    if (sent > 0) {
      setNotice(`${sent} objective(s) sent for approval.`);
    }
    await loadObjectives();
    setSubmitting(false);
  }

  async function runAction(action) {
    try {
      setError('');
      await action();
      await loadObjectives();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSubmit(id) {
    return runAction(() => submitObjective(id));
  }

  function handleProgress(id, progress) {
    return runAction(() => updateProgress(id, progress));
  }

  return (
    <div className="objectives-page">
      <h1>My Objectives</h1>

      {error && <p className="error">{error}</p>}
      {notice && <p className="notice">{notice}</p>}

      <ObjectiveForm onAdd={handleAdd} onSaveDraft={handleSaveDraft} />

      <ObjectivesBatch
        items={batch}
        submitting={submitting}
        onRemove={handleRemove}
        onSubmitAll={handleSubmitAll}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ObjectivesList
          objectives={objectives}
          onSubmit={handleSubmit}
          onProgress={handleProgress}
        />
      )}
    </div>
  );
}

export default ObjectivesPage;