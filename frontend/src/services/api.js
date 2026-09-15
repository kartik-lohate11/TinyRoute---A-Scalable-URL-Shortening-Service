import axios from 'axios';
import { getToken, removeToken, removeUser } from '../utils/auth';

// Configure Axios with backend base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000, // Quick timeout for mock fallback
});

// Request interceptor: attach Spring Boot JWT Bearer token if available
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user when unauthorized or expired
      removeToken();
      removeUser();
      // Redirect to login if in a protected window location
      if (window.location.pathname !== '/login' && window.location.pathname !== '/' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/* ==========================================================================
   INITIAL MOCK DATA (Fallback when Spring Boot backend is not running)
   ========================================================================== */

const INITIAL_MOCK_URLS = [
  {
    id: 'url-1',
    shortUrl: 'tinyroute.app/Ab12Xyz',
    slug: 'Ab12Xyz',
    originalUrl: 'https://github.com/organization/production-repo/releases/v3.0',
    clicks: 1248,
    weeklyGrowth: '+18% this week',
    visibility: 'public', // 'public' | 'private'
    statusType: '301 Permanent',
    latency: '0.8ms',
    tag: '#dev',
    createdDate: 'Oct 24, 2024',
    timeAgo: '2 hours ago',
    sparkline: [12, 18, 14, 25, 32, 45, 60],
  },
  {
    id: 'url-2',
    shortUrl: 'tinyroute.app/fall-launch',
    slug: 'fall-launch',
    originalUrl: 'https://acme.org/campaigns/2024/keynote-livestream-q4',
    clicks: 8941,
    weeklyGrowth: '+44% peak surge',
    visibility: 'public',
    statusType: '307 Temporary',
    latency: '1.1ms',
    tag: '#marketing',
    createdDate: 'Oct 23, 2024',
    timeAgo: '1 day ago',
    sparkline: [20, 35, 42, 68, 85, 95, 120],
  },
  {
    id: 'url-3',
    shortUrl: 'tinyroute.app/internal-hiring',
    slug: 'internal-hiring',
    originalUrl: 'https://notion.so/acme-corp/staff-eng-leveling-rubric-2025',
    clicks: 312,
    weeklyGrowth: 'Controlled Access',
    visibility: 'private',
    statusType: 'Passcode Protected',
    latency: '1.6ms',
    tag: '#hiring',
    createdDate: 'Oct 21, 2024',
    timeAgo: '3 days ago',
    sparkline: [5, 8, 12, 10, 15, 14, 18],
  },
  {
    id: 'url-4',
    shortUrl: 'tinyroute.app/api-v2-spec',
    slug: 'api-v2-spec',
    originalUrl: 'https://docs.tinyroute.dev/rest-api/specifications/v2.yaml',
    clicks: 5430,
    weeklyGrowth: '+32% developer traffic',
    visibility: 'public',
    statusType: '301 Permanent',
    latency: '0.9ms',
    tag: '#docs',
    createdDate: 'Oct 18, 2024',
    timeAgo: '6 days ago',
    sparkline: [30, 45, 55, 70, 80, 92, 110],
  },
  {
    id: 'url-5',
    shortUrl: 'tinyroute.app/flash-promo-50',
    slug: 'flash-promo-50',
    originalUrl: 'https://store.tinyroute.dev/flash-discount?code=QUICK50&utm_src=twitter',
    clicks: 3892,
    weeklyGrowth: 'High velocity',
    visibility: 'public',
    statusType: 'Expires in 18 hrs',
    latency: '1.0ms',
    tag: '#marketing',
    createdDate: 'Oct 16, 2024',
    timeAgo: '8 days ago',
    sparkline: [10, 25, 45, 80, 115, 140, 160],
  },
];

// Helper to get local storage mock URLs
const getLocalUrls = () => {
  const stored = localStorage.getItem('tinyroute_mock_urls');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_MOCK_URLS;
    }
  }
  localStorage.setItem('tinyroute_mock_urls', JSON.stringify(INITIAL_MOCK_URLS));
  return INITIAL_MOCK_URLS;
};

// Helper to save local storage mock URLs
const saveLocalUrls = (urls) => {
  localStorage.setItem('tinyroute_mock_urls', JSON.stringify(urls));
};

/* ==========================================================================
   AUTHENTICATION API SERVICES
   ========================================================================== */

// Login user: attempts POST /api/auth/login, falls back to local auth simulation
export const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    // If backend is not running, provide seamless developer fallback
    if (!error.response || error.code === 'ERR_NETWORK') {
      const mockToken = 'mock_jwt_token_' + btoa(credentials.email) + '.' + Date.now();
      const mockUser = {
        id: 'usr_mock_1',
        email: credentials.email,
        name: credentials.email.split('@')[0] || 'Alex Vance',
        role: 'PRO',
        createdAt: '2024-01-15',
        totalLinks: 128,
      };
      return { token: mockToken, user: mockUser };
    }
    throw error;
  }
};

// Signup user: attempts POST /api/auth/signup, falls back to local auth simulation
export const signup = async (userData) => {
  try {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  } catch (error) {
    if (!error.response || error.code === 'ERR_NETWORK') {
      const mockToken = 'mock_jwt_token_' + btoa(userData.email) + '.' + Date.now();
      const mockUser = {
        id: 'usr_mock_' + Date.now(),
        email: userData.email,
        name: userData.email.split('@')[0] || 'Developer',
        role: 'PRO',
        createdAt: new Date().toISOString().split('T')[0],
        totalLinks: 0,
      };
      return { token: mockToken, user: mockUser };
    }
    throw error;
  }
};

// Logout user: calls POST /api/auth/logout if connected
export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
  } catch {
    // Silent fail if network unreachable
  }
};

// Fetch current user details: GET /api/users/me
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/users/me');
    return response.data;
  } catch (error) {
    // Return fallback user from localStorage if offline
    const local = localStorage.getItem('tinyroute_user_data');
    return local ? JSON.parse(local) : null;
  }
};

/* ==========================================================================
   URL MANAGEMENT API SERVICES
   ========================================================================== */

// Fetch all URLs for current user: GET /api/urls
export const getUserUrls = async () => {
  try {
    const response = await api.get('/api/urls');
    return response.data;
  } catch {
    // Return mock URLs from local storage
    return getLocalUrls();
  }
};

// Fetch single URL details: GET /api/urls/{id}
export const getUrlById = async (id) => {
  try {
    const response = await api.get(`/api/urls/${id}`);
    return response.data;
  } catch {
    const urls = getLocalUrls();
    return urls.find((u) => u.id === id || u.slug === id);
  }
};

// Create a new short URL: POST /api/urls
export const createShortUrl = async (urlData) => {
  try {
    const response = await api.post('/api/urls', urlData);
    return response.data;
  } catch {
    // Generate mock short URL
    const urls = getLocalUrls();
    const slug = urlData.slug ? urlData.slug.trim() : Math.random().toString(36).substring(2, 8);
    const newUrl = {
      id: 'url-' + Date.now(),
      shortUrl: `tinyroute.app/${slug}`,
      slug: slug,
      originalUrl: urlData.originalUrl,
      clicks: 0,
      weeklyGrowth: 'Just created',
      visibility: urlData.visibility || 'public',
      statusType: '301 Permanent',
      latency: '0.9ms',
      tag: urlData.tag || '#custom',
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeAgo: 'Just now',
      sparkline: [0, 0, 0, 0, 0, 0, 1],
    };
    const updated = [newUrl, ...urls];
    saveLocalUrls(updated);
    return newUrl;
  }
};

// Update an existing short URL: PUT /api/urls/{id}
export const updateShortUrl = async (id, updateData) => {
  try {
    const response = await api.put(`/api/urls/${id}`, updateData);
    return response.data;
  } catch {
    const urls = getLocalUrls();
    const updated = urls.map((u) => (u.id === id ? { ...u, ...updateData } : u));
    saveLocalUrls(updated);
    return updated.find((u) => u.id === id);
  }
};

// Delete a short URL: DELETE /api/urls/{id}
export const deleteShortUrl = async (id) => {
  try {
    const response = await api.delete(`/api/urls/${id}`);
    return response.data;
  } catch {
    const urls = getLocalUrls();
    const updated = urls.filter((u) => u.id !== id && u.shortUrl !== id && u.slug !== id);
    saveLocalUrls(updated);
    return { success: true, message: 'URL successfully deleted' };
  }
};

/* ==========================================================================
   ANALYTICS API SERVICES
   ========================================================================== */

// Fetch overall analytics: GET /api/analytics/overview
export const getOverallAnalytics = async () => {
  try {
    const response = await api.get('/api/analytics/overview');
    return response.data;
  } catch {
    return {
      totalShortlinks: 128,
      cumulativeClicks: 49820,
      avgGlobalLatency: '18ms',
      activeQrScans: 6104,
      weeklyGrowth: '+14.2%',
      uniqueVisitorsPercent: '99.4%',
      topReferrers: [
        { name: 'GitHub', clicks: 5393, percentage: 42 },
        { name: 'Twitter / X', clicks: 3595, percentage: 28 },
        { name: 'Direct / Bio Links', clicks: 2440, percentage: 19 },
        { name: 'LinkedIn', clicks: 1414, percentage: 11 },
      ],
      topRegions: [
        { country: 'United States', code: 'US', percentage: 54.8, clicks: 7038 },
        { country: 'Germany', code: 'DE', percentage: 16.2, clicks: 2080 },
        { country: 'Japan', code: 'JP', percentage: 12.1, clicks: 1553 },
        { country: 'United Kingdom', code: 'UK', percentage: 9.4, clicks: 1207 },
      ],
    };
  }
};

export default api;
