import { adminRequest, requireList } from './adminRequest';
export async function listDepartments(token, signal) { return requireList(await adminRequest('departments', token, { signal })); }
export function saveDepartment(token, id, name) {
  return adminRequest(id == null ? 'departments' : `departments/${id}`, token, { method: id == null ? 'POST' : 'PUT', body: { name: name.trim() } });
}
