import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ApiTokens from './pages/ApiTokens';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

export default function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, title = 'TinyRoute Edge Sync') => {
    setToast({ message, title });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  return (
    <>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Home onToast={showToast} />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login onToast={showToast} />} />
        <Route path="/register" element={<Register onToast={showToast} />} />

        {/* Protected Dashboard & Routing Console */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard onToast={showToast} />
            </ProtectedRoute>
          }
        />

        {/* Protected Developer API Tokens & Settings */}
        <Route
          path="/api-keys"
          element={
            <ProtectedRoute>
              <ApiTokens onToast={showToast} />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound onToast={showToast} />} />
      </Routes>

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
