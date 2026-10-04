// Configuration for frontend-backend connection
const CONFIG = {
  // Backend API URL
  API_BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.goldenvoice.com'
    : 'http://localhost:4000',

  API_VERSION: 'v1',

  // Storage keys
  TOKEN_KEY: 'gv_token',
  USER_KEY: 'gv_user',

  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      REGISTER: '/api/v1/auth/register',
    },
    USERS: {
      ME: '/api/v1/users/me',
      UPDATE: '/api/v1/users/me',
    },
    WORKS: {
      LIST: '/api/v1/works',
      DETAIL: '/api/v1/works',
    },
    DUBBED: {
      LIST: '/api/v1/dubbed/work',
    },
    TRANSLATED: {
      LIST: '/api/v1/translated/work',
    },
    SCRIPTS: {
      LIST: '/api/v1/scripts/work',
    },
  },
};

// Determine actual API base URL
if (typeof window !== 'undefined') {
  const isDev = window.location.hostname === 'localhost';
  if (isDev) {
    CONFIG.API_BASE_URL = 'http://localhost:4000';
  }
}