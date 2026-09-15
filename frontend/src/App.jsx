import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyUrls from './pages/MyUrls';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import { createShortUrl } from './services/api';
import { CheckCircle2 } from 'lucide-react';

/**
 * ProtectedRoute guard wrapper:
 * Redirects unauthenticated visitors to /login.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * PublicRoute guard wrapper:
 * Allows visitors and users to access auth routes smoothly.
 */
function PublicRoute({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return children;
}

/**
 * Main application content with top-level modal orchestration
 */
function AppContent() {
  const [globalCreateModalOpen, setGlobalCreateModalOpen] = useState(false);
  const [destUrl, setDestUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [tag, setTag] = useState('#general');
  const [toastMsg, setToastMsg] = useState('');
  const navigate = useNavigate();

  const handleCreateNew = async (e) => {
    e.preventDefault();
    if (!destUrl) return;

    let final = destUrl.trim();
    if (!/^https?:\/\//i.test(final)) {
      final = 'https://' + final;
    }

    try {
      const created = await createShortUrl({
        originalUrl: final,
        slug: slug.trim() || undefined,
        tag: tag,
        visibility: 'public',
      });
      setGlobalCreateModalOpen(false);
      setDestUrl('');
      setSlug('');
      setToastMsg(`Created route: ${created.shortUrl}`);
      setTimeout(() => setToastMsg(''), 3000);
      // Navigate to /urls or refresh view
      navigate('/urls');
    } catch {
      setToastMsg('Failed to create route');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Global Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Global Navbar */}
      <Navbar onOpenCreateModal={() => setGlobalCreateModalOpen(true)} />

      {/* Main View Router */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/urls"
            element={
              <ProtectedRoute>
                <MyUrls />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Create URL Modal */}
      <Modal
        isOpen={globalCreateModalOpen}
        onClose={() => setGlobalCreateModalOpen(false)}
        title="Deploy New Route"
      >
        <form onSubmit={handleCreateNew} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Destination URL
            </label>
            <input
              type="text"
              value={destUrl}
              onChange={(e) => setDestUrl(e.target.value)}
              placeholder="https://acme.corp/launch/2025"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Custom Slug (Optional)
            </label>
            <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
              <span className="font-mono text-xs text-slate-400 mr-1 select-none">tinyroute.app/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="launch-2025"
                className="w-full bg-transparent text-xs font-mono text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category Tag</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none"
            >
              <option value="#marketing">#marketing</option>
              <option value="#dev">#dev</option>
              <option value="#docs">#docs</option>
              <option value="#general">#general</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setGlobalCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              Shorten & Deploy
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
