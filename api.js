/**
 * API Client for Golden Voice Backend
 * Follows backend structure: Route → Controller → Service → Repository → Database
 * Handles authentication, error handling, and all CRUD operations
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
   * Clear stored token and user data
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
  }

  /**
   * Make HTTP request with error handling
   * Returns parsed response or throws error
   */
  async request(method, endpoint, body = null, options = {}) {
    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    // Add JWT Bearer token to Authorization header if available
    if (this.token) {
      requestOptions.headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Add request body for POST/PATCH/PUT
    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log(`[API] ${method} ${endpoint}`);
      
      const response = await fetch(url, requestOptions);

      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        this.clearToken();
        throw new Error('Session expired. Please login again.');
      }

      // Handle 403 Forbidden - insufficient permissions
      if (response.status === 403) {
        throw new Error('Access denied. Insufficient permissions.');
      }

      // Try to parse response as JSON
      let data = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else if (response.ok) {
        data = await response.text();
      }

      // Handle error responses
      if (!response.ok) {
        const message = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(message);
      }

      console.log(`[API] ✓ ${method} ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error(`[API] ✗ ${method} ${endpoint}:`, error.message);
      throw error;
    }
  }

  // ==================== AUTH MODULE ====================
  // POST /api/v1/auth/register - Register new user (public)
  // POST /api/v1/auth/login - Login and get JWT token (public)

  /**
   * Register a new user
   * Request: { email, password, name? }
   * Response: { id, email, name, role, createdAt }
   */
  async register(email, password, name = '') {
    const response = await this.request('POST', CONFIG.ENDPOINTS.AUTH.REGISTER, {
      email,
      password,
      name,
    });
    return response;
  }

  /**
   * Login user and get JWT token
   * Request: { email, password }
   * Response: { token, user: { id, email, name, role, createdAt } }
   */
  async login(email, password) {
    const response = await this.request('POST', CONFIG.ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    // Store token if provided
    if (response.token) {
      this.setToken(response.token);
      if (response.user) {
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(response.user));
      }
    }

    return response;
  }

  // ==================== USERS MODULE ====================
  // GET /api/v1/users/me - Get current user profile (authenticated)
  // PATCH /api/v1/users/me - Update user profile (authenticated)

  /**
   * Get current authenticated user profile
   * Response: { id, email, name, role, createdAt, updatedAt }
   */
  async getCurrentUser() {
    const response = await this.request('GET', CONFIG.ENDPOINTS.USERS.ME);
    return response;
  }

  /**
   * Update current user profile
   * Request: { name?, email? }
   * Response: { id, email, name, role, createdAt, updatedAt }
   */
  async updateUser(data) {
    const response = await this.request('PATCH', CONFIG.ENDPOINTS.USERS.UPDATE, data);
    return response;
  }

  // ==================== WORKS MODULE ====================
  // GET /api/v1/works - List works with cursor pagination (public)
  // GET /api/v1/works/:workId - Get work details (public)
  // POST /api/v1/works - Create work (EDITOR/ADMIN)
  // PATCH /api/v1/works/:workId - Update work (EDITOR/ADMIN)
  // DELETE /api/v1/works/:workId - Delete work (ADMIN)

  /**
   * Get paginated list of works
   * Pagination: limit (default 10) + cursor
   * Filtering: type ("anime", "manga", etc.)
   * Response: { items: [...], nextCursor? }
   */
  async getWorks(limit = 10, cursor = null, type = null) {
    let endpoint = `${CONFIG.ENDPOINTS.WORKS.LIST}?limit=${limit}`;
    if (cursor) endpoint += `&cursor=${cursor}`;
    if (type) endpoint += `&type=${type}`;
    return this.request('GET', endpoint);
  }

  /**
   * Get work details by ID
   * Response: { id, title, type, description, status, createdAt, updatedAt }
   */
  async getWork(workId) {
    return this.request('GET', `${CONFIG.ENDPOINTS.WORKS.DETAIL}/${workId}`);
  }

  /**
   * Create new work (requires EDITOR or ADMIN role)
   * Request: { title, type, description, status? }
   * Response: { id, title, type, description, status, createdAt }
   */
  async createWork(data) {
    return this.request('POST', CONFIG.ENDPOINTS.WORKS.CREATE, data);
  }

  /**
   * Update work (requires EDITOR or ADMIN role)
   * Request: { title?, type?, description?, status? }
   * Response: { id, title, type, description, status, updatedAt }
   */
  async updateWork(workId, data) {
    return this.request('PATCH', `${CONFIG.ENDPOINTS.WORKS.UPDATE}/${workId}`, data);
  }

  /**
   * Delete work (requires ADMIN role)
   * Response: { success: true }
   */
  async deleteWork(workId) {
    return this.request('DELETE', `${CONFIG.ENDPOINTS.WORKS.DELETE}/${workId}`);
  }

  // ==================== DUBBED MODULE ====================
  // GET /api/v1/dubbed/work/:workId - Get dubbed versions for work (public)
  // POST /api/v1/dubbed - Create dubbed version (EDITOR/ADMIN)
  // POST /api/v1/dubbed/episodes - Add episode to dubbed version (EDITOR/ADMIN)

  /**
   * Get dubbed versions for a specific work
   * Response: [{ id, workId, language, status, episodes: [...] }]
   */
  async getDubbed(workId) {
    return this.request('GET', `${CONFIG.ENDPOINTS.DUBBED.LIST}/${workId}`);
  }

  /**
   * Create new dubbed version (requires EDITOR or ADMIN role)
   * Request: { workId, language, status? }
   * Response: { id, workId, language, status, createdAt }
   */
  async createDubbed(data) {
    return this.request('POST', CONFIG.ENDPOINTS.DUBBED.CREATE, data);
  }

  /**
   * Add episode to dubbed version (requires EDITOR or ADMIN role)
   * Request: { dubbedId, episodeNumber, audioUrl?, status? }
   * Response: { id, dubbedId, episodeNumber, audioUrl, status, createdAt }
   */
  async addDubbedEpisode(data) {
    return this.request('POST', CONFIG.ENDPOINTS.DUBBED.ADD_EPISODE, data);
  }

  // ==================== TRANSLATED MODULE ====================
  // GET /api/v1/translated/work/:workId - Get translated versions for work (public)
  // POST /api/v1/translated - Create translated version (EDITOR/ADMIN)

  /**
   * Get translated versions for a specific work
   * Response: [{ id, workId, language, status, content: [...] }]
   */
  async getTranslated(workId) {
    return this.request('GET', `${CONFIG.ENDPOINTS.TRANSLATED.LIST}/${workId}`);
  }

  /**
   * Create new translated version (requires EDITOR or ADMIN role)
   * Request: { workId, language, status? }
   * Response: { id, workId, language, status, createdAt }
   */
  async createTranslated(data) {
    return this.request('POST', CONFIG.ENDPOINTS.TRANSLATED.CREATE, data);
  }

  // ==================== WRITING MODULE (Scripts) ====================
  // GET /api/v1/scripts/work/:workId - Get scripts for work (public)
  // POST /api/v1/scripts - Create script (EDITOR/ADMIN)

  /**
   * Get scripts for a specific work
   * Response: [{ id, workId, language?, content, status, createdAt }]
   */
  async getScripts(workId) {
    return this.request('GET', `${CONFIG.ENDPOINTS.WRITING.LIST}/${workId}`);
  }

  /**
   * Create new script (requires EDITOR or ADMIN role)
   * Request: { workId, language?, content, status? }
   * Response: { id, workId, language, content, status, createdAt }
   */
  async createScript(data) {
    return this.request('POST', CONFIG.ENDPOINTS.WRITING.CREATE, data);
  }

  // ==================== ASSETS MODULE ====================
  // POST /api/v1/assets - Create asset metadata (EDITOR/ADMIN)
  // GET /api/v1/assets/:assetId - Get asset details (EDITOR/ADMIN)
  // PATCH /api/v1/assets/:assetId - Update asset status (EDITOR/ADMIN)
  // DELETE /api/v1/assets/:assetId - Delete asset (ADMIN)

  /**
   * Create asset metadata
   * Request: { contentId, storageKey, mimeType, size, checksum?, type?, status? }
   * Response: { id, contentId, storageKey, mimeType, size, status, version, createdAt }
   */
  async createAsset(data) {
    return this.request('POST', CONFIG.ENDPOINTS.ASSETS.CREATE, data);
  }

  /**
   * Get asset metadata
   * Response: { id, contentId, storageKey, mimeType, size, status, version, createdAt }
   */
  async getAsset(assetId) {
    return this.request('GET', `${CONFIG.ENDPOINTS.ASSETS.GET}/${assetId}`);
  }

  /**
   * Update asset status
   * Request: { status?, version? }
   * Response: { id, contentId, storageKey, mimeType, size, status, version, updatedAt }
   */
  async updateAsset(assetId, data) {
    return this.request('PATCH', `${CONFIG.ENDPOINTS.ASSETS.UPDATE}/${assetId}`, data);
  }

  /**
   * Delete asset
   * Response: { success: true }
   */
  async deleteAsset(assetId) {
    return this.request('DELETE', `${CONFIG.ENDPOINTS.ASSETS.DELETE}/${assetId}`);
  }
}

// Create global API client instance
const api = new APIClient();