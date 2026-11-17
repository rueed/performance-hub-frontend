import { useState } from 'react';
import { createEmployee, updateEmployee, deactivateEmployee } from '../../api/usersApi';
import Modal from '../../components/Modal';
import useAdminData from './useAdminData';
import './admin.css';

const initial = { fullName: '', email: '', password: '', departmentId: '', managerId: '', isActive: true };

export default function UsersPage() {
  const { users, departments, loading, error, handleError, reload, token } = useAdminData(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initial);
  const [deactivating, setDeactivating] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const employees = users.filter(user => user.role === 'Employee');
  const query = search.trim().toLowerCase();
  const filtered = employees.filter(user => `${user.fullName} ${user.email}`.toLowerCase().includes(query));
  function open(user) {
    if (user.id != null && user.role !== 'Employee') return;
    setEditing(user); setForm(user.id == null ? initial : { ...initial, ...user, managerId: user.managerId ?? '' }); setFormError('');
  }
  function change(event) { const { name, value, type, checked } = event.target; setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value })); }
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    if (!form.fullName.trim() || !form.email.trim() || !form.departmentId) { setFormError('Enter a name, email, and department.'); return; }
    if (users.some(user => user.id !== editing.id && user.email.toLowerCase() === form.email.trim().toLowerCase())) { setFormError('This email address is already in use.'); return; }
    setBusy(true); setFormError('');
    try {
      if (editing.id == null) await createEmployee(token, form);
      else await updateEmployee(token, editing.id, form);
      setSuccess(editing.id == null ? 'Employee created.' : 'Employee updated.'); setEditing(null); setForm(initial); reload();
    } catch (failure) { setFormError(failure.message); if (failure.status === 401) handleError(failure); }
    finally { setBusy(false); }
  }
  async function deactivate() {
    if (busy || deactivating?.role !== 'Employee') return;
    setBusy(true); setFormError('');
    try { await deactivateEmployee(token, deactivating.id); setSuccess('Employee deactivated.'); setDeactivating(null); reload(); }
    catch (failure) { setFormError(failure.message); if (failure.status === 401) handleError(failure); }
    finally { setBusy(false); }
  }
  const departmentName = id => departments.find(item => item.id === id)?.name || 'Not assigned';
  const managerName = id => users.find(item => item.id === id)?.fullName || (id == null ? 'Not assigned' : 'Unavailable');
  return <>
    <div className="admin-heading"><div><p className="hub-eyebrow">ADMINISTRATION</p><h1>User Management</h1><p className="muted-text">Support your people, manage access, and keep teams connected.</p></div><button className="btn" onClick={() => open({})} disabled={loading || !!error}>+ Add Employee</button></div>
    {success && <p className="admin-success" role="status">{success}</p>}
    {error && <div className="admin-error" role="alert">{error} <button className="btn btn-secondary" onClick={reload}>Try again</button></div>}
    <section className="card admin-panel" aria-busy={loading}>
      <div className="admin-panel-heading"><h2>Employees <span className="admin-count">{employees.length}</span></h2><label className="admin-search"><span className="admin-sr">Search employees by name or email</span><input className="input" type="search" placeholder="Search name or email…" value={search} onChange={event => setSearch(event.target.value)} /></label></div>
      {loading ? <p role="status">Loading employees…</p> : !error && (filtered.length ? <div className="admin-table-wrap"><table><thead><tr>{['Full Name', 'Email', 'Department', 'Manager', 'Status', 'Actions'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{filtered.map(user => <tr key={user.id}><td><strong>{user.fullName}</strong></td><td>{user.email}</td><td>{departmentName(user.departmentId)}</td><td>{managerName(user.managerId)}</td><td><span className={`admin-status ${user.isActive ? 'is-active' : ''}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td><td><div className="admin-row-actions"><button className="btn btn-secondary" onClick={() => open(user)}>Edit<span className="admin-sr"> {user.fullName}</span></button><button className="admin-deactivate" disabled={!user.isActive} onClick={() => { setDeactivating(user); setFormError(''); }}>Deactivate<span className="admin-sr"> {user.fullName}</span></button></div></td></tr>)}</tbody></table></div> : <div className="admin-empty"><h3>{query ? 'No matching employees' : 'No employees yet'}</h3><p className="muted-text">{query ? 'Try a different name or email.' : 'Add your first Employee account to get started.'}</p></div>)}
      <p className="admin-note muted-text">Admin accounts are managed directly in the database.</p>
    </section>
    {editing && <Modal title={editing.id == null ? 'Add Employee' : 'Edit Employee'} onClose={() => { setEditing(null); setForm(initial); }} busy={busy}><form className="admin-form" onSubmit={submit} aria-busy={busy}>
      <p className="muted-text">Account role: Employee</p>
      <div className="field"><label htmlFor="fullName">Full name</label><input autoFocus className="input" id="fullName" name="fullName" required maxLength={150} value={form.fullName} onChange={change} disabled={busy} /></div>
      <div className="field"><label htmlFor="employee-email">Email address</label><input className="input" id="employee-email" name="email" type="email" required maxLength={200} value={form.email} onChange={change} disabled={busy} /></div>
      {editing.id == null && <div className="field"><label htmlFor="initial-password">Initial password</label><input className="input" id="initial-password" name="password" type="password" autoComplete="new-password" required minLength={6} value={form.password} onChange={change} disabled={busy} aria-describedby="password-help" /><small id="password-help" className="muted-text">At least 6 characters. Share securely with the employee.</small></div>}
      <div className="field"><label htmlFor="departmentId">Department</label><select className="input" id="departmentId" name="departmentId" required value={form.departmentId} onChange={change} disabled={busy}><option value="">Select department</option>{departments.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select>{!departments.length && <small className="muted-text">Add a department before creating employees.</small>}</div>
      <div className="field"><label htmlFor="managerId">Reports to <span className="muted-text">(optional)</span></label><select className="input" id="managerId" name="managerId" value={form.managerId} onChange={change} disabled={busy}><option value="">No manager</option>{employees.filter(item => item.isActive && item.id !== editing.id).map(item => <option value={item.id} key={item.id}>{item.fullName}</option>)}</select></div>
      {editing.id != null && <label className="admin-checkbox"><input type="checkbox" name="isActive" checked={form.isActive} onChange={change} disabled={busy} /> Active account</label>}
      {formError && <p role="alert" className="error-text">{formError}</p>}
      <div className="admin-form-actions"><button type="button" className="btn btn-secondary" disabled={busy} onClick={() => { setEditing(null); setForm(initial); }}>Cancel</button><button className="btn" disabled={busy || !departments.length}>{busy ? 'Saving…' : editing.id == null ? 'Create Employee' : 'Save Changes'}</button></div>
    </form></Modal>}
    {deactivating && <Modal title="Deactivate Employee" onClose={() => setDeactivating(null)} busy={busy}><p>Deactivate <strong>{deactivating.fullName}</strong>? They will no longer be able to log in. Their records will be retained.</p>{formError && <p className="error-text" role="alert">{formError}</p>}<div className="admin-form-actions"><button className="btn btn-secondary" disabled={busy} onClick={() => setDeactivating(null)}>Cancel</button><button className="btn btn-danger" disabled={busy} onClick={deactivate}>{busy ? 'Deactivating…' : 'Deactivate Employee'}</button></div></Modal>}
  </>;
}
