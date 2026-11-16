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
// NOTE: this endpoint is not written in the backend yet.
export function submitObjective(id) {
  return apiRequest(`/api/objectives/${id}/submit`, { method: 'POST' });
}

// PATCH /api/objectives/{id}/progress  body: { progress: 0-100 }
// NOTE: this endpoint is not written in the backend yet.
export function updateProgress(id, progress) {
  return apiRequest(`/api/objectives/${id}/progress`, {
    method: 'PATCH',
    body: JSON.stringify({ progress }),
  });
}