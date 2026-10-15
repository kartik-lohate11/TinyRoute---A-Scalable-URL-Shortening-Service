import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';

export default function Sidebar({ onToast }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    if (onToast) onToast('Signed out of Architect console');
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-50 flex flex-col shadow-sm">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-200">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[20px]">alt_route</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">TinyRoute</span>
        </Link>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-mono text-[11px] font-semibold">
          v2.4
        </span>
      </div>

      {/* Cluster Status Quick Pill */}
      <div className="px-4 py-3">
        <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            Redis Cluster
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            0.42ms
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              isActive
                ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isActive ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                terminal
              </span>
              <span>Routing Console</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/api-keys"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              isActive
                ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isActive ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                key
              </span>
              <span>API Tokens</span>
            </>
          )}
        </NavLink>

        <button
          onClick={() => {
            if (onToast) onToast('Telemetry streaming at 0.38ms average edge latency');
          }}
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium text-sm text-left"
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400">query_stats</span>
          <span>Telemetry & Caching</span>
        </button>

        <button
          onClick={() => {
            if (onToast) onToast('28 Edge PoPs active with Anycast DNS routing');
          }}
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium text-sm text-left"
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400">dns</span>
          <span>Edge Domains</span>
        </button>

        <button
          onClick={() => {
            if (onToast) onToast('Redis Engine v7.2-active-replica in sync');
          }}
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium text-sm text-left"
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400">tune</span>
          <span>Config & Engine</span>
        </button>
      </nav>

      {/* User / Status Footer */}
      <div className="p-3 border-t border-slate-200">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm text-white">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-900 leading-tight">Architect</span>
              <span className="text-[10px] font-mono text-emerald-600 font-medium leading-tight mt-0.5">
                Online · 0.8ms
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded transition-colors"
            title="Sign out"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
