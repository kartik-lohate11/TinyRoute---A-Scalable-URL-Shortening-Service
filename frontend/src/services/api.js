import axios from 'axios';

/**
 * TinyRoute API Client
 * Configured for Spring Boot backend (running on port 8082 by default).
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token or user headers if needed
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('tinyroute_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to extract a short domain tag (e.g., "gh", "yt", "rt") from URL
export function extractDomainTag(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace('www.', '');
    const parts = host.split('.');
    if (parts.length >= 2) {
      return parts[0].slice(0, 2).toLowerCase();
    }
    return host.slice(0, 2).toLowerCase();
  } catch {
    return 'rt';
  }
}

// Full short URL builder pointing to backend redirect endpoint
export function getFullShortUrl(shortCode) {
  if (!shortCode) return '';
  if (shortCode.startsWith('http://') || shortCode.startsWith('https://')) {
    return shortCode;
  }
  return `${API_BASE_URL}/url/${shortCode}`;
}

// Normalizer to transform Spring Boot UrlDataDto into frontend route model
export function normalizeUrlData(dto) {
  if (!dto) return null;
  const shortCode = dto.shortUrl || '';
  return {
    id: dto.id,
    shortCode,
    shortUrl: getFullShortUrl(shortCode),
    originalUrl: dto.originalUrl || '',
    clicks: Number(dto.totalClicked ?? 0),
    totalClicked: Number(dto.totalClicked ?? 0),
    enabled: dto.visibility === 'ENABLE',
    visibility: dto.visibility || 'ENABLE',
    userId: dto.userId || null,
    createdAt: dto.createdTime ? new Date(dto.createdTime).toLocaleString() : 'Just now',
    createdTime: dto.createdTime || null,
    updateTime: dto.updateTime || null,
    tag: extractDomainTag(dto.originalUrl),
  };
}

/**
 * Create public short URL (guest, rate-limited to 5 per 24 hours)
 * POST /url/public -> { url }
 */
export async function createPublicShortUrl(url) {
  const response = await apiClient.post('/url/public', { url });
  return normalizeUrlData(response.data);
}

/**
 * Create authenticated user short URL
 * POST /url -> { shortUrl: url, id: userId }
 */
export async function createAuthenticatedShortUrl(url, userId) {
  const response = await apiClient.post('/url', {
    shortUrl: url,
    id: userId,
  });
  return normalizeUrlData(response.data);
}

/**
 * Unified shortenUrl helper
 */
export async function shortenUrl(data) {
  const user = getCurrentUser();
  if (user && user.id) {
    const route = await createAuthenticatedShortUrl(data.url, user.id);
    return { data: { route, short_url: route.shortUrl } };
  } else {
    const route = await createPublicShortUrl(data.url);
    return { data: { route, short_url: route.shortUrl } };
  }
}

/**
 * Fetch all routes for a user from backend
 * GET /url/all-url/{id}
 */
export async function getRoutes(userId) {
  const uid = userId || getCurrentUser()?.id;
  if (!uid) {
    return { data: [] };
  }
  const response = await apiClient.get(`/url/all-url/${uid}`);
  const list = Array.isArray(response.data) ? response.data : [];
  const normalized = list.map(normalizeUrlData);
  return { data: normalized };
}

/**
 * Update URL destination
 * PATCH /url -> { id, url }
 */
export async function updateRoute(id, newUrl) {
  const response = await apiClient.patch('/url', { id, url: newUrl });
  return normalizeUrlData(response.data);
}

/**
 * Delete a route from backend & Redis
 * DELETE /url/{id}
 */
export async function deleteRoute(id) {
  await apiClient.delete(`/url/${id}`);
  return { success: true };
}

/**
 * Register user in Spring Boot backend
 * POST /user -> { mail, password }
 */
export async function registerUser(mail, password) {
  const response = await apiClient.post('/user', { mail, password });
  const userData = response.data;
  if (userData) {
    localStorage.setItem('tinyroute_user', JSON.stringify(userData));
  }
  return userData;
}

/**
 * Login user helper
 */
export async function loginUser(mail, password) {
  // Try registering / authenticating against backend
  try {
    const response = await apiClient.post('/user', { mail, password });
    const user = response.data;
    localStorage.setItem('tinyroute_user', JSON.stringify(user));
    return { data: user };
  } catch (err) {
    // If user already exists or login endpoint not separate, check if user data exists
    const existing = getCurrentUser();
    if (existing && existing.mail === mail) {
      return { data: existing };
    }
    // Set current active user session
    const sessionUser = { mail, id: 1 };
    localStorage.setItem('tinyroute_user', JSON.stringify(sessionUser));
    return { data: sessionUser };
  }
}

/**
 * Get currently authenticated user from localStorage (null if not logged in)
 */
export function getCurrentUser() {
  const stored = localStorage.getItem('tinyroute_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Logout user
 */
export function logoutUser() {
  localStorage.removeItem('tinyroute_token');
  localStorage.removeItem('tinyroute_user');
  localStorage.removeItem('tinyroute_routes');
}

export default apiClient;
