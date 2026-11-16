// One function per Evaluations endpoint. Components never build URLs themselves.

import { apiRequest } from './client';

// GET /api/evaluations/mine  (an employee sees his own evaluations)
export function getMyEvaluations() {
  return apiRequest('/api/evaluations/mine');
}

// GET /api/evaluations/team  (Manager only: evaluations I wrote)
export function getTeamEvaluations() {
  return apiRequest('/api/evaluations/team');
}

// GET /api/evaluations/team-members  (Manager only: people I can evaluate)
// returns [{ id, fullName }]
export function getTeamMembers() {
  return apiRequest('/api/evaluations/team-members');
}

// POST /api/evaluations  (Manager only)
// data = { userId, period, score, comment }
export function createEvaluation(data) {
  return apiRequest('/api/evaluations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
