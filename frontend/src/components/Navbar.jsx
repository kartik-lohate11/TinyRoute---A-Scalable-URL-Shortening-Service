import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ onToast }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (onToast) {
      onToast(!isDarkMode ? 'Dark theme preview toggled' : 'Light theme active');
    }
  };

  const navLinks = [
    { label: 'Features', path: '/' },
    { label: 'API & Docs', path: '/api-keys' },
    { label: 'Pricing / Plans', path: '/#pricing' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="h-16 w-full max-w-[1440px] mx-auto px-6 md:px-8 flex items-center justify-between gap-4">
        {/* Brand Header */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            {/* SVG Logo matching TinyRoute theme */}
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">alt_route</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                  TinyRoute
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-emerald-600 font-mono text-[10px] font-semibold">
                  v2.4
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-500 font-medium leading-none mt-1">
                Fast Redis Engine
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 h-16 ml-4">
            {navLinks.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/' && !location.hash
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`h-full flex items-center px-1 text-sm transition-colors border-b-2 ${
                    isActive
                      ? 'text-indigo-600 border-indigo-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 border-transparent font-medium'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right CTA strip */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center border border-slate-200/60"
            type="button"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDarkMode ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {/* Sign In & Get Started */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/login"
              className="h-9 px-3.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-mono text-xs transition-colors flex items-center gap-1.5 border border-slate-200 shadow-sm font-medium"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600">key</span>
              <span>Sign In</span>
            </Link>

            <Link
              to="/dashboard"
              className="h-9 px-3.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-mono text-xs shadow-sm hover:shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center gap-1.5 font-semibold"
            >
              <span>Routing Console</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Live Node pill */}
          <div className="relative flex items-center gap-2 pl-3 border-l border-slate-200">
            <Link
              to="/dashboard"
              className="relative flex items-center cursor-pointer"
              title="dev@tinyroute.internal"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-semibold">
                <span className="material-symbols-outlined text-indigo-600 text-[18px]">person</span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </Link>
            <div className="hidden xl:flex flex-col text-left">
              <span className="font-mono text-[10px] text-slate-800 font-semibold leading-none">
                Live Node
              </span>
              <span className="font-mono text-[11px] text-emerald-600 font-semibold leading-tight">
                0.8ms ping
              </span>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            type="button"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 animate-in slide-in-from-top-2">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-indigo-600 font-medium text-sm"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 text-center rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 text-center rounded-lg bg-indigo-600 text-white text-xs font-mono font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
