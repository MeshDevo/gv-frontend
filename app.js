/**
 * Golden Voice Frontend Application
 * Main application logic, UI controllers, and state management
 * Follows backend module structure
 */

class GoldenVoiceApp {
  constructor() {
    this.isAuthenticated = !!api.getStoredToken();
    this.currentUser = this.loadUser();
    this.works = [];
    this.currentPage = {
      cursor: null,
      hasMore: false,
    };
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    this.setupEventListeners();
    await this.renderUI();
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Navigation buttons
    document.getElementById('loginBtn').addEventListener('click', () =>
      this.showSection('loginSection')
    );
    document.getElementById('registerBtn').addEventListener('click', () =>
      this.showSection('registerSection')
    );

    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', (e) =>
      this.handleLogin(e)
    );
    document.getElementById('registerForm').addEventListener('submit', (e) =>
      this.handleRegister(e)
    );

    // Logout
    document.addEventListener('click', (e) => {
      if (e.target.id === 'logoutBtn') this.handleLogout();
    });

    // Modal close
    document.querySelector('.close').addEventListener('click', () =>
      this.closeModal()
    );
    document.getElementById('modal').addEventListener('click', (e) => {
      if (e.target.id === 'modal') this.closeModal();
    });
  }

  /**
   * Render UI based on authentication state
   */
  async renderUI() {
    if (this.isAuthenticated) {
      this.showSection('dashboardSection');
      await this.loadDashboard();
    } else {
      this.showSection('loginSection');
    }
  }

  /**
   * Show specific section and hide others
   */
  showSection(sectionId) {
    document.querySelectorAll('.form-section, .dashboard-section').forEach((el) => {
      el.classList.remove('active');
    });
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');
  }

  /**
   * Handle login form submission
   * Uses Auth module: POST /api/v1/auth/login
   */
  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await api.login(email, password);
      this.currentUser = response.user;
      this.isAuthenticated = true;
      this.saveUser(this.currentUser);
      
      // Clear form
      document.getElementById('loginForm').reset();
      
      // Load dashboard
      this.showMessage('Login successful!', 'success');
      await this.renderUI();
    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  /**
   * Handle register form submission
   * Uses Auth module: POST /api/v1/auth/register
   */
  async handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
      await api.register(email, password, name);
      this.showMessage('Registration successful! Please login.', 'success');
      document.getElementById('registerForm').reset();
      this.showSection('loginSection');
    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  /**
   * Handle logout
   */
  handleLogout() {
    api.clearToken();
    this.currentUser = null;
    this.isAuthenticated = false;
    this.works = [];
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    this.showMessage('Logged out', 'success');
    this.renderUI();
  }

  /**
   * Load and display dashboard
   * Fetches works list using Works module: GET /api/v1/works
   */
  async loadDashboard() {
    try {
      // Display user name from Users module
      if (this.currentUser) {
        document.getElementById('userName').textContent = this.currentUser.name || 'User';
      }

      // Load works using cursor pagination
      const response = await api.getWorks();
      this.works = response.items || response;
      this.currentPage.nextCursor = response.nextCursor;
      this.currentPage.hasMore = !!response.nextCursor;
      
      this.displayWorks(this.works);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      this.showMessage('Failed to load works', 'error');
    }
  }

  /**
   * Display works in grid
   * Works module provides: id, title, type, description, status, createdAt, updatedAt
   */
  displayWorks(works) {
    const worksList = document.getElementById('worksList');

    if (!works || works.length === 0) {
      worksList.innerHTML =
        '<p style="grid-column: 1/-1; color: var(--muted); text-align: center; padding: 40px 0;">No works available yet.</p>';
      return;
    }

    worksList.innerHTML = works
      .map(
        (work) => `
      <div class="work-card" onclick="app.showWorkDetails('${work.id}')">
        <div class="work-type">${work.type || 'Anime'}</div>
        <div class="work-title">${work.title}</div>
        <div class="work-description">${work.description || 'No description'}</div>
        <div class="work-status">Status: ${work.status || 'Unknown'}</div>
      </div>
    `
      )
      .join('');
  }

  /**
   * Show work details in modal
   * Fetches from Works, Dubbed, Translated, and Writing modules
   */
  async showWorkDetails(workId) {
    try {
      // Get work details from Works module
      const work = await api.getWork(workId);

      let html = `
        <h2>${work.title}</h2>
        <p><strong>Type:</strong> ${work.type}</p>
        <p><strong>Status:</strong> ${work.status || 'Unknown'}</p>
        <p><strong>Description:</strong> ${work.description || 'No description'}</p>
      `;

      // Dubbed versions section (Dubbed module: GET /api/v1/dubbed/work/:workId)
      html += `
        <div style="margin-top: 20px;">
          <h3>Dubbed Versions</h3>
          <div id="dubbedList" class="content-list">Loading...</div>
        </div>
      `;

      // Translated versions section (Translated module: GET /api/v1/translated/work/:workId)
      html += `
        <div style="margin-top: 20px;">
          <h3>Translated Versions</h3>
          <div id="translatedList" class="content-list">Loading...</div>
        </div>
      `;

      // Scripts section (Writing module: GET /api/v1/scripts/work/:workId)
      html += `
        <div style="margin-top: 20px;">
          <h3>Scripts</h3>
          <div id="scriptsList" class="content-list">Loading...</div>
        </div>
      `;

      document.getElementById('modalBody').innerHTML = html;
      this.openModal();

      // Load dubbed versions
      try {
        const dubbedData = await api.getDubbed(workId);
        const dubbedList = document.getElementById('dubbedList');
        if (dubbedData && dubbedData.length > 0) {
          dubbedList.innerHTML = dubbedData
            .map((d) => `
              <div class="content-item">
                <strong>${d.language}</strong> - ${d.status || 'Unknown'}
                ${d.episodes ? ` (${d.episodes.length} episodes)` : ''}
              </div>
            `)
            .join('');
        } else {
          dubbedList.innerHTML = '<p style="color: var(--muted);">No dubbed versions</p>';
        }
      } catch (e) {
        document.getElementById('dubbedList').innerHTML = '<p style="color: var(--error);">Failed to load</p>';
      }

      // Load translated versions
      try {
        const translatedData = await api.getTranslated(workId);
        const translatedList = document.getElementById('translatedList');
        if (translatedData && translatedData.length > 0) {
          translatedList.innerHTML = translatedData
            .map((t) => `
              <div class="content-item">
                <strong>${t.language}</strong> - ${t.status || 'Unknown'}
              </div>
            `)
            .join('');
        } else {
          translatedList.innerHTML = '<p style="color: var(--muted);">No translated versions</p>';
        }
      } catch (e) {
        document.getElementById('translatedList').innerHTML = '<p style="color: var(--error);">Failed to load</p>';
      }

      // Load scripts
      try {
        const scriptsData = await api.getScripts(workId);
        const scriptsList = document.getElementById('scriptsList');
        if (scriptsData && scriptsData.length > 0) {
          scriptsList.innerHTML = scriptsData
            .map((s) => `
              <div class="content-item">
                ${s.language ? `<strong>${s.language}</strong> - ` : ''}
                ${s.status || 'Unknown'}
              </div>
            `)
            .join('');
        } else {
          scriptsList.innerHTML = '<p style="color: var(--muted);">No scripts</p>';
        }
      } catch (e) {
        document.getElementById('scriptsList').innerHTML = '<p style="color: var(--error);">Failed to load</p>';
      }
    } catch (error) {
      this.showMessage('Failed to load work details', 'error');
      this.closeModal();
    }
  }

  /**
   * Open modal
   */
  openModal() {
    document.getElementById('modal').classList.add('active');
  }

  /**
   * Close modal
   */
  closeModal() {
    document.getElementById('modal').classList.remove('active');
  }

  /**
   * Show message notification
   */
  showMessage(text, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `status-message ${type}`;
    messageEl.textContent = text;

    const mainContent = document.getElementById('mainContent');
    mainContent.insertBefore(messageEl, mainContent.firstChild);

    setTimeout(() => messageEl.remove(), 3000);
  }

  /**
   * Save user to localStorage
   */
  saveUser(user) {
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
  }

  /**
   * Load user from localStorage
   */
  loadUser() {
    const stored = localStorage.getItem(CONFIG.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}

// Initialize app when DOM is ready
let app;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new GoldenVoiceApp();
  });
} else {
  app = new GoldenVoiceApp();
}