import { useState } from 'react';
import { saveDepartment } from '../../api/departmentsApi';
import Modal from '../../components/Modal';
import useAdminData from './useAdminData';
import './admin.css';

export default function DepartmentsPage() {
  const { departments, loading, error, handleError, reload, token } = useAdminData();
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  function open(department) { setEditing(department); setName(department.name || ''); setFormError(''); }
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const trimmed = name.trim();
    if (!trimmed) { setFormError('Enter a department name.'); return; }
    if (departments.some(item => item.id !== editing.id && item.name.trim().toLowerCase() === trimmed.toLowerCase())) { setFormError('A department with this name already exists.'); return; }
    setBusy(true); setFormError('');
    try {
      await saveDepartment(token, editing.id, trimmed);
      setEditing(null); setSuccess(editing.id == null ? 'Department created.' : 'Department updated.'); reload();
    } catch (failure) { setFormError(failure.message); if (failure.status === 401) handleError(failure); }
    finally { setBusy(false); }
  }
  return <>
    <div className="admin-heading"><div><p className="hub-eyebrow">ADMINISTRATION</p><h1>Department Management</h1><p className="muted-text">Organize the teams that move your business forward.</p></div><button className="btn" onClick={() => open({})} disabled={loading || !!error}>+ Add Department</button></div>
    {success && <p className="admin-success" role="status">{success}</p>}
    {error && <div className="admin-error" role="alert">{error} <button className="btn btn-secondary" onClick={reload}>Try again</button></div>}
    <section className="card admin-panel" aria-busy={loading}><div className="admin-panel-heading"><h2>Departments</h2><span className="muted-text">{departments.length} total</span></div>
      {loading ? <p role="status">Loading departments…</p> : !error && (departments.length ? <div className="admin-table-wrap"><table><thead><tr><th scope="col">Department</th><th scope="col">Actions</th></tr></thead><tbody>{departments.map(department => <tr key={department.id}><td><strong>{department.name}</strong></td><td><button className="btn btn-secondary" onClick={() => open(department)}>Edit<span className="admin-sr"> {department.name}</span></button></td></tr>)}</tbody></table></div> : <div className="admin-empty"><h3>No departments yet</h3><p className="muted-text">Add a department to start organizing employees.</p></div>)}
    </section>
    {editing && <Modal title={editing.id == null ? 'Add Department' : 'Edit Department'} onClose={() => setEditing(null)} busy={busy}><form className="admin-form" onSubmit={submit} aria-busy={busy}><div className="field"><label htmlFor="department-name">Department name</label><input autoFocus id="department-name" className="input" required value={name} onChange={event => setName(event.target.value)} disabled={busy} /></div>{formError && <p role="alert" className="error-text">{formError}</p>}<div className="admin-form-actions"><button type="button" className="btn btn-secondary" onClick={() => setEditing(null)} disabled={busy}>Cancel</button><button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save Department'}</button></div></form></Modal>}
  </>;
}
