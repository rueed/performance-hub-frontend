import { useEffect, useState } from 'react';
import {
  getTeamMembers,
  getTeamEvaluations,
  createEvaluation,
} from '../../api/evaluationsApi';
import EvaluationsList from './EvaluationsList';
import './evaluations.css';

// Manager view: a form to evaluate a team member, and the list of evaluations I wrote.
function TeamEvaluationsPage() {
  const [members, setMembers] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // form fields (controlled inputs)
  const [userId, setUserId] = useState('');
  const [period, setPeriod] = useState('');
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');

  async function loadAll() {
    try {
      const [membersData, evaluationsData] = await Promise.all([
        getTeamMembers(),
        getTeamEvaluations(),
      ]);
      setMembers(membersData);
      setEvaluations(evaluationsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // runs once, after the first render
   useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser from reloading the page
    setError('');

    if (!userId || !period.trim() || score === '') {
      setError('Please choose an employee and fill the period and the score.');
      return;
    }

    const numericScore = Number(score);
    if (numericScore < 0 || numericScore > 100) {
      setError('Score must be between 0 and 100.');
      return;
    }

    try {
      await createEvaluation({
        userId: Number(userId),
        period: period.trim(),
        score: numericScore,
        comment: comment.trim(),
      });
      setScore('');
      setComment('');
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  // { 3: "Employee Name" } so the list can show names instead of ids
  const employeeNames = members.reduce((map, m) => {
    map[m.id] = m.fullName;
    return map;
  }, {});

  return (
    <div className="page">
      <h1>Team Evaluations</h1>

      <form className="card evaluation-form" onSubmit={handleSubmit}>
        <h3>New evaluation</h3>

        <div className="field">
          <label htmlFor="eval-user">Employee</label>
          <select
            id="eval-user"
            className="input"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Choose an employee</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="eval-period">Period</label>
          <input
            id="eval-period"
            className="input"
            placeholder="2026 Q4"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="eval-score">Score (0 to 100)</label>
          <input
            id="eval-score"
            className="input"
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="eval-comment">Comment</label>
          <textarea
            id="eval-comment"
            className="input"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn" type="submit">
          Save evaluation
        </button>
      </form>

      <h2>Evaluations I wrote</h2>
      {loading && <p className="muted-text">Loading...</p>}
      {!loading && <EvaluationsList evaluations={evaluations} employeeNames={employeeNames} />}
    </div>
  );
}

export default TeamEvaluationsPage;
