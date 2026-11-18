import { useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SessionStatus from '../../components/SessionStatus';
import './login.css';

export default function LoginPage() {
  const { user, loading, sessionError, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const errorRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending.current) return;
    setError('');
    if (!email.trim() || !password) { setError('Enter your email and password.'); return; }
    pending.current = true;
    setSubmitting(true);
    try { await login(email.trim(), password); }
    catch (failure) {
      setError(failure.message);
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }

  if (loading || sessionError) return <SessionStatus />;
  if (user) return <Navigate to="/" replace />;
  return <main className="login-page"><div className="login-layout">
    <section className="login-intro" aria-label="Performance Hub">
      <div className="login-brand"><span className="login-mark" aria-hidden="true">P</span> Performance Hub</div>
      <p className="login-eyebrow">EMPLOYEE PERFORMANCE MANAGEMENT</p>
      <h1>A clear path to<br />your best work.</h1>
      <p className="muted-text">Your workspace for progress, performance, and everything ahead.</p>
      <div className="login-visual" aria-hidden="true"><div className="login-visual-top"><span>PROGRESS STARTS HERE</span><span className="login-visual-dot" /></div><div className="login-decoration"><span /><span /><span /><span /><span /><span /></div><div className="login-visual-bottom"><span>Clarity in every step.</span><span>↗</span></div></div>
    </section>
    <section className="card login-card" aria-labelledby="login-title">
      <div className="login-form-brand"><span className="login-mark" aria-hidden="true">P</span> Performance Hub</div>
      <h2 id="login-title">Welcome back</h2>
      <p className="muted-text">Log in with your work account to continue.</p>
      <form onSubmit={handleSubmit} aria-busy={submitting}>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input className="input" id="email" name="email" type="email" autoComplete="username" placeholder="you@company.com" required value={email} onChange={event => setEmail(event.target.value)} disabled={submitting} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="login-password">
            <input className="input" id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={event => setPassword(event.target.value)} disabled={submitting} />
            <button type="button" className="login-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} aria-controls="password" onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </div>
        {error && <p className="error-text" role="alert" tabIndex={-1} ref={errorRef}>{error}</p>}
        <button className="btn login-submit" type="submit" disabled={submitting}>{submitting ? <span role="status">Logging in…</span> : 'Log in'}</button>
      </form>
      <p className="muted-text login-help">Need access? Contact your administrator.</p>
    </section>
  </div></main>;
}
