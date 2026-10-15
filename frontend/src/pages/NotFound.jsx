import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function NotFound({ onToast }) {
  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 antialiased flex flex-col">
      <Navbar onToast={onToast} />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
          <span className="material-symbols-outlined text-[32px]">wrong_location</span>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          404 Route Not Found
        </span>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Sub-ms Resolution Miss
        </h1>

        <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
          The requested edge route or page does not exist in the primary Redis cluster.
        </p>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            Return Home
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-mono text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            Routing Console
          </Link>
        </div>
      </main>
    </div>
  );
}
