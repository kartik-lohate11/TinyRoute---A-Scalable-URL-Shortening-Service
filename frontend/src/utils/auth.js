// Authentication utility helpers for token and user persistence
// Prepares the frontend for Spring Boot JWT authentication

const TOKEN_KEY = 'tinyroute_jwt_token';
const USER_KEY = 'tinyroute_user_data';

// Get stored JWT token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Save JWT token received from backend / mock auth
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

// Remove stored JWT token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Get stored user information
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Save user information
export const setUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

// Remove user information
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

// Check if user has an active session token
export const isAuthenticated = () => {
  const token = getToken();
  return Boolean(token);
};

// Complete logout / clear auth state
export const clearAuth = () => {
  removeToken();
  removeUser();
};
