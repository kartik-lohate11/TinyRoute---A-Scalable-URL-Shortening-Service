import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getToken,
  setToken as saveToken,
  removeToken,
  getUser,
  setUser as saveUser,
  removeUser,
  clearAuth
} from '../utils/auth';
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(true);

  // Initialize auth state on initial app load
  useEffect(() => {
    const existingToken = getToken();
    const existingUser = getUser();

    // Default demo session if none exists so users can explore immediately
    if (!existingToken) {
      const defaultUser = {
        id: 'usr_demo_1',
        name: 'Alex Vance',
        email: 'alex@tinyroute.dev',
        role: 'PRO',
        createdAt: '2024-01-15',
        totalLinks: 128,
        monthlyLimit: 1000,
      };
      const defaultToken = 'tr_jwt_demo_alex_vance_2025';
      saveToken(defaultToken);
      saveUser(defaultUser);
      setToken(defaultToken);
      setUser(defaultUser);
    } else {
      setToken(existingToken);
      setUser(existingUser);
    }
    setLoading(false);
  }, []);

  // Handle user login with credentials
  const login = async (email, password) => {
    const data = await apiLogin({ email, password });
    if (data && data.token) {
      saveToken(data.token);
      saveUser(data.user);
      setToken(data.token);
      setUser(data.user);
      return data;
    }
    throw new Error('Invalid credentials or response from server');
  };

  // Handle user registration
  const signup = async (email, password) => {
    const data = await apiSignup({ email, password });
    if (data && data.token) {
      saveToken(data.token);
      saveUser(data.user);
      setToken(data.token);
      setUser(data.user);
      return data;
    }
    throw new Error('Registration failed');
  };

  // Google OAuth simulation
  const loginWithGoogle = async () => {
    const googleUser = {
      id: 'usr_google_' + Date.now(),
      name: 'Google Developer',
      email: 'developer@google.com',
      role: 'PRO',
      createdAt: new Date().toISOString().split('T')[0],
      totalLinks: 128,
      monthlyLimit: 1000,
    };
    const googleToken = 'tr_jwt_google_' + Date.now();
    saveToken(googleToken);
    saveUser(googleUser);
    setToken(googleToken);
    setUser(googleUser);
    return { token: googleToken, user: googleUser };
  };

  // Logout and clear all auth data
  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore API logout error
    } finally {
      clearAuth();
      setToken(null);
      setUser(null);
    }
  };

  // Update user profile metadata
  const updateProfile = (updatedData) => {
    const updated = { ...user, ...updatedData };
    saveUser(updated);
    setUser(updated);
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
