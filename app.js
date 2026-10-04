/**
 * Golden Voice Frontend Application
 * Main application logic and UI controllers
 */

class GoldenVoiceApp {
  constructor() {
    this.isAuthenticated = !!api.getStoredToken();
    this.currentUser = this.loadUser();
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
    // Auth buttons
    document.getElementById('loginBtn').addEventListener('click', () =>
      this.showSection('loginSection')
    );
    document.getElementById('registerBtn').addEventListener('click', () =>
      this.showSection('registerSection')
    );

    // Forms
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
      this.renderUI();
      this.showMessage('Login successful!', 'success');
    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  /**
   * Handle register form submission
   */
  async handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
      await api.register(name, email, password);
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
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    this.renderUI();
  }

  /**
   * Load and display dashboard
   */
  async loadDashboard() {
    try {
      // Display user name
      if (this.currentUser) {
        document.getElementById('userName').textContent = this.currentUser.name || 'User';
      }

      // Load and display works
      const response = await api.getWorks();
      this.displayWorks(response.items || response);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      this.showMessage('Failed to load works', 'error');
    }
  }

  /**
   * Display works in grid
   */
  displayWorks(works) {
    const worksList = document.getElementById('worksList');

    if (!works || works.length === 0) {
      worksList.innerHTML =
        '<p style="grid-column: 1/-1; color: var(--muted);">No works available yet.</p>';
      return;
    }

    worksList.innerHTML = works
      .map(
        (work) => `
      <div class="work-card" onclick="app.showWorkDetails('${work.id}')">
        <div class="work-type">${work.type || 'Anime'}</div>
        <div class="work-title">${work.title}</div>
        <div class="work-description">${work.description || 'No description'}</div>
      </div>
    `
      )
      .join('');
  }

  /**
   * Show work details in modal
   */
  async showWorkDetails(workId) {
    try {
      const work = await api.getWork(workId);
      const html = `
        <h2>${work.title}</h2>
        <p><strong>Type:</strong> ${work.type}</p>
        <p><strong>Description:</strong> ${work.description}</p>
        <p><strong>Status:</strong> ${work.status || 'Unknown'}</p>
        <div style="margin-top: 20px;">
          <h3>Dubbed Versions</h3>
          <p id="dubbedList">Loading...</p>
        </div>
        <div style="margin-top: 20px;">
          <h3>Translated Versions</h3>
          <p id="translatedList">Loading...</p>
        </div>
      `;
      document.getElementById('modalBody').innerHTML = html;
      this.openModal();

      // Load dubbed and translated versions
      try {
        const dubbed = await api.getDubbed(workId);
        document.getElementById('dubbedList').innerHTML =
          dubbed.length > 0
            ? dubbed.map((d) => `<div>• ${d.language}</div>`).join('')
            : 'No dubbed versions';
      } catch (e) {
        document.getElementById('dubbedList').textContent = 'N/A';
      }

      try {
        const translated = await api.getTranslated(workId);
        document.getElementById('translatedList').innerHTML =
          translated.length > 0
            ? translated.map((t) => `<div>• ${t.language}</div>`).join('')
            : 'No translated versions';
      } catch (e) {
        document.getElementById('translatedList').textContent = 'N/A';
      }
    } catch (error) {
      this.showMessage('Failed to load work details', 'error');
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