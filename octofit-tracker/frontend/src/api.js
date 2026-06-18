/**
 * API Configuration and Utilities
 * 
 * Builds API base URL with support for GitHub Codespaces and localhost.
 * Uses VITE_CODESPACE_NAME environment variable when available.
 */

// Get the Codespace name from environment variable
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

// Build the API base URL with safe fallback
// - In Codespaces: https://{CODESPACE_NAME}-8000.app.github.dev/api
// - On localhost: http://localhost:8000/api
export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';

/**
 * Fetch wrapper with error handling
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * API Endpoints
 */
export const api = {
  // Health check
  health: () => apiFetch('/health'),

  // Users
  users: {
    getAll: () => apiFetch('/users'),
    getById: (id) => apiFetch(`/users/${id}`),
    create: (data) => apiFetch('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiFetch(`/users/${id}`, { method: 'DELETE' }),
  },

  // Teams
  teams: {
    getAll: () => apiFetch('/teams'),
    getById: (id) => apiFetch(`/teams/${id}`),
    create: (data) => apiFetch('/teams', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiFetch(`/teams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiFetch(`/teams/${id}`, { method: 'DELETE' }),
    addMember: (teamId, userId) => apiFetch(`/teams/${teamId}/members`, { 
      method: 'POST', 
      body: JSON.stringify({ userId }) 
    }),
    removeMember: (teamId, userId) => apiFetch(`/teams/${teamId}/members/${userId}`, { 
      method: 'DELETE' 
    }),
  },

  // Activities
  activities: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiFetch(`/activities${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id) => apiFetch(`/activities/${id}`),
    getStats: (userId) => apiFetch(`/activities/stats/${userId}`),
    create: (data) => apiFetch('/activities', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiFetch(`/activities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiFetch(`/activities/${id}`, { method: 'DELETE' }),
  },

  // Leaderboard
  leaderboard: {
    get: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiFetch(`/leaderboard${queryString ? `?${queryString}` : ''}`);
    },
    getTeams: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiFetch(`/leaderboard/teams${queryString ? `?${queryString}` : ''}`);
    },
    getRank: (userId, period = 'alltime') => apiFetch(`/leaderboard/rank/${userId}?period=${period}`),
  },

  // Workouts
  workouts: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiFetch(`/workouts${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id) => apiFetch(`/workouts/${id}`),
    getSuggestions: (userId, limit = 5) => apiFetch(`/workouts/suggestions/${userId}?limit=${limit}`),
    create: (data) => apiFetch('/workouts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiFetch(`/workouts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiFetch(`/workouts/${id}`, { method: 'DELETE' }),
  },
};

export default api;
