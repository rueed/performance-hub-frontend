// One function per backend endpoint (see docs/contract.md, section 8).
// The components call these functions and never build URLs themselves.

import { apiRequest } from './client';

// GET /api/objectives/mine
export function getMyObjectives() {
  return apiRequest('/api/objectives/mine');
}

// POST /api/objectives
// data = { title, description, startDate, endDate }
export function createObjective(data) {
  return apiRequest('/api/objectives', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// POST /api/objectives/{id}/submit  (Draft or Rejected -> PendingApproval)
export function submitObjective(id) {
  return apiRequest(`/api/objectives/${id}/submit`, { method: 'POST' });
}

// PATCH /api/objectives/{id}/progress  body: { progress: 0-100 }
export function updateProgress(id, progress) {
  return apiRequest(`/api/objectives/${id}/progress`, {
    method: 'PATCH',
    body: JSON.stringify({ progress }),
  });
}

// GET /api/objectives/pending  (Manager only: objectives of my team waiting for approval)
export function getPendingObjectives() {
  return apiRequest('/api/objectives/pending');
}

// POST /api/objectives/{id}/approve  (Manager only)
export function approveObjective(id) {
  return apiRequest(`/api/objectives/${id}/approve`, { method: 'POST' });
}

// POST /api/objectives/{id}/reject  body: { reason }  (Manager only)
export function rejectObjective(id, reason) {
  return apiRequest(`/api/objectives/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

// GET /api/objectives/team  (Manager only: all objectives of my team, any status)
export function getTeamObjectives() {
  return apiRequest('/api/objectives/team');
}
