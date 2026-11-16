import { useEffect, useState } from 'react';
import {
  getMyObjectives,
  createObjective,
  submitObjective,
  updateProgress,
} from '../../api/objectivesApi';
import ObjectiveForm from './ObjectiveForm';
import ObjectivesList from './ObjectivesList';
import './objectives.css';

// The page owns the data (state). The form and the list only receive
// what they need as props, and tell the page when the user does something.
function ObjectivesPage() {
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Runs once, after the first render: load the objectives from the API.
  useEffect(() => {
    loadObjectives();       
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The form shows its own errors, so this one lets errors travel back to it.
  async function handleCreate(data) {
    await createObjective(data);
    await loadObjectives();
  }

  // Runs an action, then reloads the list so the screen matches the database.
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

      <ObjectiveForm onCreate={handleCreate} />

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