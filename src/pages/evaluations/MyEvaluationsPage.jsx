import { useEffect, useState } from 'react';
import { getMyEvaluations } from '../../api/evaluationsApi';
import EvaluationsList from './EvaluationsList';
import './evaluations.css';

// Employee view: read only list of my evaluations.
function MyEvaluationsPage() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // runs once, after the first render
  useEffect(() => {
    async function load() {
      try {
        const data = await getMyEvaluations();
        setEvaluations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const average =
    evaluations.length === 0
      ? 0
      : evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length;

  return (
    <div className="page">
      <h1>My Evaluations</h1>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted-text">Loading...</p>}

      {!loading && evaluations.length > 0 && (
        <p className="muted-text">Average score: {average.toFixed(1)} / 100</p>
      )}

      {!loading && <EvaluationsList evaluations={evaluations} />}
    </div>
  );
}

export default MyEvaluationsPage;
