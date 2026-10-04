/**
 * API Client for Golden Voice Backend
 * Handles all HTTP requests to the backend
 */

class APIClient {
  constructor() {
    this.baseURL = CONFIG.API_BASE_URL;
    this.token = this.getStoredToken();
  }

  /**
   * Get stored JWT token from localStorage
   */
  getStoredToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
  }

  /**
   * Set JWT token in localStorage
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
  }

  /**
   * Clear stored token
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
  }

  /**
   * Make HTTP request with error handling
   */
  async request(method, endpoint, body = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add JWT token if available
    if (this.token) {
      options.headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Add request body for POST/PATCH
    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, options);

      // Handle unauthorized (token expired)
      if (response.status === 401) {
        this.clearToken();
        throw new Error('Session expired. Please login again.');
      }

      // Parse response
      const data = response.ok ? await response.json() : null;

      if (!response.ok) {
        throw new Error(
          data?.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return data;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  // ==================== AUTH ====================

  /**
   * Register a new user
   */
  async register(name, email, password) {
    const response = await this.request('POST', CONFIG.ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password,
    });
    return response;
  }

  /**
   * Login user
   */
  async login(email, password) {
    const response = await this.request('POST', CONFIG.ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    if (response.token) {
      this.setToken(response.token);
      if (response.user) {
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(response.user));
      }
    }

    return response;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    const response = await this.request('GET', CONFIG.ENDPOINTS.USERS.ME);
    return response;
  }

  /**
   * Update user profile
   */
  async updateUser(data) {
    const response = await this.request('PATCH', CONFIG.ENDPOINTS.USERS.UPDATE, data);
    return response;
  }

  // ==================== WORKS ====================

  /**
   * Get list of works with pagination
   */
  async getWorks(type = null, limit = 10, cursor = null) {
    let endpoint = `${CONFIG.ENDPOINTS.WORKS.LIST}?limit=${limit}`;
    if (type) endpoint += `&type=${type}`;
    if (cursor) endpoint += `&cursor=${cursor}`;
    return this.request('GET', endpoint);
  }

  /**
   * Get work details
   */
  async getWork(workId) {
    return this.request('GET', `${CONFIG.ENDPOINTS.WORKS.DETAIL}/${workId}`);
  }

  /**
   * Create new work (requires auth)
   */
  async createWork(data) {
    return this.request('POST', CONFIG.ENDPOINTS.WORKS.LIST, data);
  }

  /**
   * Update work (requires auth)
   */
  async updateWork(workId, data) {
    return this.request('PATCH', `${CONFIG.ENDPOINTS.WORKS.DETAIL}/${workId}`, data);
  }

  /**
   * Delete work (requires auth)
   */
  async deleteWork(workId) {
    return this.request('DELETE', `${CONFIG.ENDPOINTS.WORKS.DETAIL}/${workId}`);
  }

  // ==================== DUBBED ====================

  /**
   * Get dubbed versions for a work
   */
  async getDubbed(workId) {
    return this.request('GET', `${CONFIG.ENDPOINTS.DUBBED.LIST}/${workId}`);
  }

  /**
   * Create dubbed version (requires auth)
   */
  async createDubbed(data) {
    return this.request('POST', '/api/v1/dubbed', data);
  }

  // ==================== TRANSLATED ====================

  /**
   * Get translated versions for a work
   */
  async getTranslated(workId) {
    return this.request('GET', `${CONFIG.ENDPOINTS.TRANSLATED.LIST}/${workId}`);
  }

  /**
   * Create translated version (requires auth)
   */
  async createTranslated(data) {
    return this.request('POST', '/api/v1/translated', data);
  }

  // ==================== SCRIPTS ====================

  /**
   * Get scripts for a work
   */
  async getScripts(workId) {
    return this.request('GET', `${CONFIG.ENDPOINTS.SCRIPTS.LIST}/${workId}`);
  }

  /**
   * Create script (requires auth)
   */
  async createScript(data) {
    return this.request('POST', '/api/v1/scripts', data);
  }
}

// Create global API client instance
const api = new APIClient();