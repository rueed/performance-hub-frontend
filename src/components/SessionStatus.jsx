import { useAuth } from '../context/AuthContext';
export default function SessionStatus() {
  const { loading, sessionError, retrySession, logout } = useAuth();
  return <main className="page"><section className="card" aria-busy={loading}>
    {loading ? <p role="status">Checking your session…</p> : <>
      <h1>Unable to restore your session</h1>
      <p className="error-text" role="alert">{sessionError}</p>
      <button className="btn" onClick={retrySession}>Try again</button>{' '}
      <button className="btn btn-secondary" onClick={logout}>Return to login</button>
    </>}
  </section></main>;
}
