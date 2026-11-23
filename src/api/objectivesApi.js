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






// GET /api/objectives/team  (Manager only: all objectives of my team, any status)
export function getTeamObjectives() {
  return apiRequest('/api/objectives/team');
}

// PUT /api/objectives/{id}  (Draft or Rejected only)
export function updateObjective(id, data) {
  return apiRequest(`/api/objectives/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
// POST /api/objectives/submit-drafts  (sends all my drafts together, at least 3)
// POST /api/objectives/submit-drafts  body: { ids }  (at least 3, sent together)
export function submitDrafts(ids) {
  return apiRequest('/api/objectives/submit-drafts', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}
  export function approveTeamMember(userId) {
  return apiRequest(`/api/objectives/team/${userId}/approve`, {
    method: 'POST',
  });}
  export function rejectTeamMember(userId, reason) {
  return apiRequest(`/api/objectives/team/${userId}/reject`, {
    method: 'POST',
    reason: JSON.stringify({ reason }),
  });
}
export function resubmitRejected() {
  return apiRequest(`/api/objectives/resubmit-rejected`, {
    method: 'POST',
  });}