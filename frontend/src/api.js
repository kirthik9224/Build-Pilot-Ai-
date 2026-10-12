// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Frontend API client communicating with Spring Boot REST backend

const KEY = 'bp_session';
export const session = {
  get: () => { try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; } },
  set: (u) => sessionStorage.setItem(KEY, JSON.stringify(u)),
  clear: () => sessionStorage.removeItem(KEY),
};

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const user = session.get();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
    },
  });
  if (res.status === 401 && path !== '/auth/login' && path !== '/auth/register') {
    session.clear();
    window.dispatchEvent(new Event('bp-logout'));
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

const send = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  // Auth & Account
  login: (email, password) => request('/auth/login', send('POST', { email, password })),
  register: (body) => request('/auth/register', send('POST', body)),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
  settings: () => request('/settings'),
  saveSettings: (body) => request('/settings', send('PUT', body)),
  help: () => request('/help'),

  // Projects
  projects: () => request('/projects'),
  createProject: (body) => request('/projects', send('POST', body)),

  // Dashboard & Issues
  dashboard: (projectId) => request(`/dashboard${projectId ? `?projectId=${projectId}` : ''}`),
  issues: (projectId) => request(`/issues${projectId ? `?projectId=${projectId}` : ''}`),
  repair: (id) => request(`/issues/${id}/repair`, { method: 'POST' }),
  repairAll: (projectId) =>
    request(`/issues/repair-all${projectId ? `?projectId=${projectId}` : ''}`, { method: 'POST' }),
  roadmap: (body) => request('/roadmap', send('POST', body)),

  // AI Code Review
  submitReview: (body) => request('/reviews', send('POST', body)),
  listReviews: (projectId) => request(`/reviews?projectId=${projectId || 1}`),
  getReview: (id) => request(`/reviews/${id}`),
  updateFinding: (findingId, body) =>
    request(`/reviews/findings/${findingId}`, send('PATCH', body)),

  // AI Debugging & Verification
  diagnoseError: (body) => request('/debugging/diagnose', send('POST', body)),
  listDebuggingSessions: (projectId) => request(`/debugging?projectId=${projectId || 1}`),
  getDebuggingSession: (id) => request(`/debugging/${id}`),
  verifyFix: (fixId, body) => request(`/debugging/fixes/${fixId}/verify`, send('POST', body)),

  // Design-to-Code
  generateUi: (body) => request('/design/generate', send('POST', body)),
  designHistory: (projectId) => request(`/design/history?projectId=${projectId || 1}`),

  // Project Planner
  tasks: (projectId) => request(`/planner/tasks?projectId=${projectId || 1}`),
  createTask: (body) => request('/planner/tasks', send('POST', body)),
  updateTask: (id, body) => request(`/planner/tasks/${id}`, send('PATCH', body)),
  milestones: (projectId) => request(`/planner/milestones?projectId=${projectId || 1}`),
  createMilestone: (body) => request('/planner/milestones', send('POST', body)),
  toggleMilestone: (id) => request(`/planner/milestones/${id}/toggle`, { method: 'PATCH' }),
  forecast: (projectId, days, teamSize) =>
    request(`/planner/forecast?projectId=${projectId || 1}&days=${days}&teamSize=${teamSize}`),

  // Health Monitoring
  monitoredServices: (projectId) =>
    request(`/monitoring/services?projectId=${projectId || 1}`),
  addService: (body) => request('/monitoring/services', send('POST', body)),
  pingService: (id) => request(`/monitoring/services/${id}/ping`, { method: 'POST' }),
  serviceRecords: (id) => request(`/monitoring/services/${id}/records`),
  alerts: (projectId) => request(`/monitoring/alerts?projectId=${projectId || 1}`),
  resolveAlert: (id) => request(`/monitoring/alerts/${id}/resolve`, { method: 'PATCH' }),

  // AI Developer Chat
  chatHistory: (projectId) => request(`/chat/history?projectId=${projectId || 1}`),
  sendChatMessage: (body) => request('/chat/send', send('POST', body)),
  clearChatHistory: (projectId) =>
    request(`/chat/history?projectId=${projectId || 1}`, { method: 'DELETE' }),
};
