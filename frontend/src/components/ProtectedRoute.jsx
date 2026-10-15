import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../services/api';

/**
 * ProtectedRoute component
 * Simple route protection: if user info exists in localStorage or session, allows access.
 * Otherwise redirects to /login while preserving desired destination.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const user = getCurrentUser();

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
