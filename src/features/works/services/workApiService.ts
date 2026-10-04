import { API_BASE_URL, DEFAULT_PAGE_SIZE } from "../../../shared/constants/apiConstants";
import type {
  Work,
  WorkListResponse,
  WorkType,
  DubbedVersion,
  TranslatedVersion,
  Script,
  User,
  AuthResponse,
} from "../types/workTypes";

/**
 * Utility to make authenticated JSON requests to the backend
 * Mirrors the backend's request pattern from controllelrs
 */
async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("auth_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `Golden Voice API request failed: ${path} returned ${response.status}.`
    );
  }

  return response.json() as Promise<T>;
}

// ==================== WORKS MODULE ====================
// GET /api/v1/works - List published works with cursor pagination
// GET /api/v1/works/:workId - Get published work details

/**
 * Get list of published works
 * Backend: handleListWorks() in workController.ts
 * Only returns PUBLISHED works
 */
export function fetchPublishedWorks(
  workType?: WorkType,
  limit = DEFAULT_PAGE_SIZE,
  cursor?: string
): Promise<WorkListResponse> {
  let path = `/works?limit=${limit}`;
  if (workType) path += `&type=${workType}`;
  if (cursor) path += `&cursor=${cursor}`;
  return requestJson<WorkListResponse>(path);
}

/**
 * Get published work details by ID
 * Backend: handleGetWorkById() in workController.ts
 * Only returns PUBLISHED works
 */
export function fetchPublishedWorkById(workId: string): Promise<Work> {
  return requestJson<Work>(`/works/${workId}`);
}

// ==================== DUBBED MODULE ====================
// GET /api/v1/dubbed/work/:workId - Get dubbed versions for a work

/**
 * Get dubbed versions for a specific work
 * Backend: dubbedRoutes.ts GET /work/:workId
 */
export function fetchDubbedVersions(
  workId: string
): Promise<DubbedVersion[]> {
  return requestJson<DubbedVersion[]>(`/dubbed/work/${workId}`);
}

// ==================== TRANSLATED MODULE ====================
// GET /api/v1/translated/work/:workId - Get translated versions for a work

/**
 * Get translated versions for a specific work
 * Backend: translatedRoutes.ts GET /work/:workId
 */
export function fetchTranslatedVersions(
  workId: string
): Promise<TranslatedVersion[]> {
  return requestJson<TranslatedVersion[]>(`/translated/work/${workId}`);
}

// ==================== WRITING (SCRIPTS) MODULE ====================
// GET /api/v1/scripts/work/:workId - Get scripts for a work

/**
 * Get scripts for a specific work
 * Backend: scriptRoutes.ts GET /work/:workId
 */
export function fetchScripts(workId: string): Promise<Script[]> {
  return requestJson<Script[]>(`/scripts/work/${workId}`);
}

// ==================== AUTH MODULE ====================
// POST /api/v1/auth/login - Login user
// POST /api/v1/auth/register - Register new user

/**
 * Login with email and password
 * Backend: handleLogin() in authController.ts
 * Returns JWT token and user info
 */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await requestJson<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (response.token) {
    localStorage.setItem("auth_token", response.token);
    localStorage.setItem("auth_user", JSON.stringify(response.user));
  }
  return response;
}

/**
 * Register new user
 * Backend: handleRegister() in authController.ts
 */
export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  return requestJson<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName }),
  });
}

// ==================== USERS MODULE ====================
// GET /api/v1/users/me - Get current user profile
// PATCH /api/v1/users/me - Update current user profile

/**
 * Get current authenticated user profile
 * Backend: handleGetCurrentUser() in userController.ts
 * Requires JWT token
 */
export function fetchCurrentUser(): Promise<User> {
  return requestJson<User>("/users/me");
}

/**
 * Update current user profile
 * Backend: handleUpdateCurrentUser() in userController.ts
 * Requires JWT token
 */
export function updateCurrentUser(data: {
  displayName?: string;
  email?: string;
}): Promise<User> {
  return requestJson<User>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Logout (client-side)
 * Clears stored authentication token
 */
export function logoutUser(): void {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("auth_token");
}

/**
 * Get stored user from localStorage
 */
export function getStoredUser(): User | null {
  const stored = localStorage.getItem("auth_user");
  return stored ? JSON.parse(stored) : null;
}
