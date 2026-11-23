import { apiRequest } from './client';

// GET /api/hr/employees  (Admin only)
export function getHrEmployees() {
  return apiRequest('/api/hr/employees');
}

// GET /api/hr/objectives  (Admin only, read only)
export function getHrObjectives() {
  return apiRequest('/api/hr/objectives');
}