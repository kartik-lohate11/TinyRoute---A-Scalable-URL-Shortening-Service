import axios from 'axios';

/**
 * TinyRoute API Client
 * 
 * Configured for Spring Boot backend.
 * Base URL can be configured via VITE_API_BASE_URL in your .env file.
 * Defaults to 'http://localhost:8080/api'
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach bearer token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('tinyroute_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Seed data matching the Google Stitch design
const INITIAL_ROUTES = [
  {
    id: '1',
    shortCode: 'launch',
    shortUrl: 'https://tinyroute.io/launch',
    originalUrl: 'https://github.com/facebook/react/releases/tag/v19.0.0',
    tag: 'gh',
    clicks: 34120,
    trend: '+12%',
    telemetry: 'HIT 99.4% · 0.38ms',
    enabled: true,
    createdAt: 'May 18, 2025 · 14:32 UTC',
    expiresAt: null,
    isProtected: false,
  },
  {
    id: '2',
    shortCode: 'react-v19',
    shortUrl: 'https://tinyroute.io/react-v19',
    originalUrl: 'https://react.dev/blog/2024/12/05/react-19',
    tag: 'io',
    clicks: 14890,
    trend: '+8%',
    telemetry: 'HIT 98.9% · 0.44ms',
    enabled: true,
    createdAt: 'May 16, 2025 · 09:12 UTC',
    expiresAt: null,
    isProtected: false,
  },
  {
    id: '3',
    shortCode: 'kube-docs',
    shortUrl: 'https://tinyroute.io/kube-docs',
    originalUrl: 'https://kubernetes.io/docs/concepts/overview/',
    tag: 'k8',
    clicks: 8210,
    trend: '--',
    telemetry: 'HIT 99.1% · 0.41ms',
    enabled: true,
    createdAt: 'May 12, 2025 · 18:04 UTC',
    expiresAt: null,
    isProtected: false,
  },
  {
    id: '4',
    shortCode: 'summit25',
    shortUrl: 'https://tinyroute.io/summit25',
    originalUrl: 'https://conf.tinyroute.internal/keynote-agenda-apac',
    tag: 'cf',
    clicks: 4312,
    trend: '+24%',
    telemetry: 'HIT 99.8% · 0.32ms',
    enabled: true,
    createdAt: 'May 04, 2025 · 11:15 UTC',
    expiresAt: null,
    isProtected: false,
  },
  {
    id: '5',
    shortCode: 'dev-spec',
    shortUrl: 'https://tinyroute.io/dev-spec',
    originalUrl: 'https://internal.rfc.tinyroute.io/draft-04',
    tag: 'rf',
    clicks: 1120,
    trend: 'inactive',
    telemetry: 'PURGED',
    enabled: false,
    createdAt: 'Apr 28, 2025 · 08:21 UTC',
    expiresAt: null,
    isProtected: true,
  },
];

// Helper to get local fallback storage
function getLocalRoutes() {
  const stored = localStorage.getItem('tinyroute_routes');
  if (!stored) {
    localStorage.setItem('tinyroute_routes', JSON.stringify(INITIAL_ROUTES));
    return INITIAL_ROUTES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_ROUTES;
  }
}

function saveLocalRoutes(routes) {
  localStorage.setItem('tinyroute_routes', JSON.stringify(routes));
}

// Generate random short slug
function generateSlug() {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * URL Shortening API
 * Calls Spring Boot POST /v1/shorten or POST /shorten
 * Automatically falls back to local simulation if Spring Boot server is offline.
 */
export async function shortenUrl(data) {
  try {
    const response = await apiClient.post('/v1/shorten', data);
    return { data: response.data, isMock: false };
  } catch (err) {
    // If backend is not reached, provide fallback so beginner can test immediately
    const routes = getLocalRoutes();
    const slug = data.customSlug?.trim() || generateSlug();

    // Check collision
    const existing = routes.find(r => r.shortCode.toLowerCase() === slug.toLowerCase());
    if (existing && data.customSlug) {
      const error = new Error('ERR_SLUG_COLLISION: Requested custom slug is already allocated.');
      error.status = 409;
      throw error;
    }

    const hostPrefix = 'https://tinyroute.io/';
    const newRoute = {
      id: Date.now().toString(),
      shortCode: slug,
      shortUrl: `${hostPrefix}${slug}`,
      originalUrl: data.url,
      tag: data.url.includes('github') ? 'gh' : (data.url.includes('react') ? 'io' : 'rt'),
      clicks: 0,
      trend: 'new',
      telemetry: 'HIT 99.9% · 0.35ms',
      enabled: true,
      createdAt: 'Just now',
      expiresAt: data.expiresAt || null,
      isProtected: !!data.passcode,
    };

    routes.unshift(newRoute);
    saveLocalRoutes(routes);

    return {
      data: {
        status: 'success',
        short_url: newRoute.shortUrl,
        original_url: newRoute.originalUrl,
        short_code: newRoute.shortCode,
        cache_engine: 'redis-cluster-v7',
        latency_ms: 0.38,
        qr_code_url: `https://api.tinyroute.io/v1/qr/${slug}.svg`,
        route: newRoute,
      },
      isMock: true,
    };
  }
}

/**
 * Fetch all routes for dashboard
 */
export async function getRoutes() {
  try {
    const response = await apiClient.get('/v1/urls');
    return { data: response.data, isMock: false };
  } catch (err) {
    return { data: getLocalRoutes(), isMock: true };
  }
}

/**
 * Toggle route enabled/disabled
 */
export async function toggleRouteStatus(id, enabled) {
  try {
    const response = await apiClient.patch(`/v1/urls/${id}/status`, { enabled });
    return { data: response.data, isMock: false };
  } catch {
    const routes = getLocalRoutes().map(r => r.id === id ? { ...r, enabled } : r);
    saveLocalRoutes(routes);
    return { data: { success: true }, isMock: true };
  }
}

/**
 * Delete a route
 */
export async function deleteRoute(id) {
  try {
    const response = await apiClient.delete(`/v1/urls/${id}`);
    return { data: response.data, isMock: false };
  } catch {
    const routes = getLocalRoutes().filter(r => r.id !== id);
    saveLocalRoutes(routes);
    return { data: { success: true }, isMock: true };
  }
}

/**
 * Authentication helper (simulated & Spring Boot ready)
 */
export async function loginUser(email, password) {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data?.token) {
      localStorage.setItem('tinyroute_token', response.data.token);
    }
    return { data: response.data, isMock: false };
  } catch {
    // Local session simulation
    const mockUser = {
      email: email || 'dev@tinyroute.internal',
      role: 'Architect',
      token: 'tr_live_9f83a741bc88d402e1a90cc52cbfd9715e4a8b29',
    };
    localStorage.setItem('tinyroute_token', mockUser.token);
    localStorage.setItem('tinyroute_user', JSON.stringify(mockUser));
    return { data: mockUser, isMock: true };
  }
}

export function getCurrentUser() {
  const user = localStorage.getItem('tinyroute_user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
  // Default logged in user to match the design screenshot
  return {
    email: 'dev@tinyroute.internal',
    role: 'Architect',
    token: 'tr_live_9f83a741bc88d402e1a90cc52cbfd9715e4a8b29',
  };
}

export function logoutUser() {
  localStorage.removeItem('tinyroute_token');
  localStorage.removeItem('tinyroute_user');
}

export default apiClient;
