import { adminRequest, requireList } from './adminRequest';
export async function listUsers(token, signal) { return requireList(await adminRequest('users', token, { signal })); }
function employeePayload(values, creating) {
  const payload = { fullName: values.fullName.trim(), email: values.email.trim(), role: 'Employee', departmentId: Number(values.departmentId), managerId: values.managerId ? Number(values.managerId) : null };
  return creating ? { ...payload, password: values.password } : { ...payload, isActive: values.isActive };
}
export function createEmployee(token, values) { return adminRequest('users', token, { method: 'POST', body: employeePayload(values, true) }); }
export function updateEmployee(token, id, values) { return adminRequest(`users/${id}`, token, { method: 'PUT', body: employeePayload(values, false) }); }
export function deactivateEmployee(token, id) { return adminRequest(`users/${id}`, token, { method: 'DELETE' }); }
