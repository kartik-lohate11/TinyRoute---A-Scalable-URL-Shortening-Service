import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { loginUser } from '../services/api';

export default function Login({ onToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('dev@tinyroute.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginUser(email, password);
      if (onToast) onToast('Authenticated as Architect (dev@tinyroute.internal)');
      navigate(from, { replace: true });
    } catch {
      if (onToast) onToast('Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginUser('architect.google@tinyroute.internal', 'google_sso_token');
      if (onToast) onToast('Signed in with Google SSO');
      navigate(from, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 antialiased flex flex-col">
      <Navbar onToast={onToast} />

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 relative overflow-hidden">
          {/* Accent Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl pointer-events-none" />

          {/* Brand header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm mx-auto mb-3">
              <span className="material-symbols-outlined text-[24px]">alt_route</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sign In to TinyRoute
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Access edge routing console, telemetry, and API key management.
            </p>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-11 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-mono text-xs flex items-center justify-center gap-2.5 transition-colors shadow-xs mb-5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.8 5 12 5z" fill="#EA4335" />
              <path d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z" fill="#4285F4" />
              <path d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" fill="#FBBC05" />
              <path d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.1-6.7-5.1L1.6 16.1C3.5 20 7.4 23 12 23z" fill="#34A853" />
            </svg>
            <span className="font-semibold">Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 font-mono text-[11px] text-slate-400 uppercase tracking-wider relative">
              or email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Developer Email
              </label>
              <div className="flex items-center rounded-lg bg-slate-50 border border-slate-300 px-3 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-600 transition-all">
                <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-transparent text-slate-900 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono font-medium text-slate-700">
                  Password / Token
                </label>
                <span className="text-[11px] font-mono text-indigo-600 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="flex items-center rounded-lg bg-slate-50 border border-slate-300 px-3 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-600 transition-all">
                <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-slate-900 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? 'Verifying...' : 'Sign In to Console'}
            </button>
          </form>

          <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 font-mono text-[11px]">
            <span className="text-emerald-700 font-semibold block mb-0.5">
              ● Demo Mode Active
            </span>
            Click "Sign In to Console" or "Continue with Google" for instant access.
          </div>

          <p className="mt-4 text-center font-mono text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
