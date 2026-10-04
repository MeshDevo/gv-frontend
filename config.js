/**
 * Golden Voice Frontend Configuration
 * Backend API endpoints and configuration
 */

const CONFIG = {
  // Backend API base URL
  API_BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.goldenvoice.com'
    : 'http://localhost:4000',

  API_VERSION: 'v1',

  // Storage keys
  TOKEN_KEY: 'gv_token',
  USER_KEY: 'gv_user',

  // Based on backend README structure
  // Route → Controller → Service → Repository → Database
  ENDPOINTS: {
    // Auth Module (/modules/auth)
    AUTH: {
      REGISTER: '/api/v1/auth/register',  // POST - public
      LOGIN: '/api/v1/auth/login',        // POST - public
    },

    // Users Module (/modules/users)
    USERS: {
      ME: '/api/v1/users/me',             // GET - authenticated
      UPDATE: '/api/v1/users/me',         // PATCH - authenticated
    },

    // Works Module (/modules/works) - Core entity
    WORKS: {
      LIST: '/api/v1/works',              // GET - public (cursor pagination: limit + cursor)
      DETAIL: '/api/v1/works',            // GET /:workId - public
      CREATE: '/api/v1/works',            // POST - EDITOR/ADMIN
      UPDATE: '/api/v1/works',            // PATCH /:workId - EDITOR/ADMIN
      DELETE: '/api/v1/works',            // DELETE /:workId - ADMIN
    },

    // Dubbed Module (/modules/dubbed) - Dub versions + episodes
    DUBBED: {
      LIST: '/api/v1/dubbed/work',        // GET /:workId - public
      CREATE: '/api/v1/dubbed',           // POST - EDITOR/ADMIN
      ADD_EPISODE: '/api/v1/dubbed/episodes', // POST - EDITOR/ADMIN
    },

    // Translated Module (/modules/translated)
    TRANSLATED: {
      LIST: '/api/v1/translated/work',    // GET /:workId - public
      CREATE: '/api/v1/translated',       // POST - EDITOR/ADMIN
    },

    // Writing Module (/modules/writing) - Scripts
    WRITING: {
      LIST: '/api/v1/scripts/work',       // GET /:workId - public
      CREATE: '/api/v1/scripts',          // POST - EDITOR/ADMIN
    },

    // Assets Module (file metadata)
    ASSETS: {
      CREATE: '/api/v1/assets',           // POST - EDITOR/ADMIN
      GET: '/api/v1/assets',              // GET /:assetId - EDITOR/ADMIN
      UPDATE: '/api/v1/assets',           // PATCH /:assetId - EDITOR/ADMIN
      DELETE: '/api/v1/assets',           // DELETE /:assetId - ADMIN
    },
  },
};

// Set correct API base URL for development
if (typeof window !== 'undefined') {
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isDev) {
    CONFIG.API_BASE_URL = 'http://localhost:4000';
  }
}