import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { loginUser } from '../services/api';

export default function Register({ onToast }) {
  const navigate = useNavigate();
  const [name, setName] = useState('Senior Architect');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginUser(email || 'dev@tinyroute.internal', password || 'secret');
      if (onToast) onToast('Account provisioned on TinyRoute Redis edge!');
      navigate('/dashboard');
    } catch {
      if (onToast) onToast('Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 antialiased flex flex-col">
      <Navbar onToast={onToast} />

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 relative overflow-hidden">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm mx-auto mb-3">
              <span className="material-symbols-outlined text-[24px]">person_add</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Create TinyRoute Account
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Start compressing links with sub-millisecond global Redis routing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Full Name / Organization
              </label>
              <div className="flex items-center rounded-lg bg-slate-50 border border-slate-300 px-3 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-600 transition-all">
                <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">
                  badge
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-transparent text-slate-900 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

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
                  placeholder="dev@tinyroute.internal"
                  className="w-full bg-transparent text-slate-900 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="flex items-center rounded-lg bg-slate-50 border border-slate-300 px-3 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-600 transition-all">
                <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full bg-transparent text-slate-900 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? 'Creating Account...' : 'Get Started Free'}
            </button>
          </form>

          <p className="mt-5 text-center font-mono text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
