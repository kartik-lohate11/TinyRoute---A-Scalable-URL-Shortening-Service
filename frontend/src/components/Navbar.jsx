import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Link as LinkIcon,
  Home,
  BarChart2,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Zap,
  Globe,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

/**
 * Reusable Navbar component for TinyRoute.
 * Adapts automatically between public visitor mode and authenticated dashboard mode.
 */
export default function Navbar({ onOpenCreateModal }) {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isPublicPage = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#3525cd] text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-bold text-xl text-[#0b1c30] tracking-tight">TinyRoute</span>
              {isAuthenticated && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#e2dfff] text-[#3323cc] rounded uppercase tracking-wider">
                  PRO
                </span>
              )}
            </Link>

            {/* Edge network operational indicator */}
            <div className="hidden xl:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-600 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>284 Edge PoPs Online</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#eff4ff] text-[#3525cd] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/urls"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#eff4ff] text-[#3525cd] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <LinkIcon className="w-4 h-4" />
                <span>My URLs</span>
              </NavLink>

              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#eff4ff] text-[#3525cd] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <BarChart2 className="w-4 h-4" />
                <span>Analytics</span>
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#eff4ff] text-[#3525cd] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </NavLink>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
              <a href="#code" className="hover:text-indigo-600 transition-colors">REST API Docs</a>
              <a href="#cta" className="hover:text-indigo-600 transition-colors">Pricing</a>
            </nav>
          )}

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {onOpenCreateModal && (
                  <button
                    type="button"
                    onClick={onOpenCreateModal}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4f46e5] text-white text-xs font-semibold hover:bg-[#3525cd] shadow-sm active:scale-95 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ New URL</span>
                  </button>
                )}

                {/* User quick pill & Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Account Settings"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {user?.name ? user.name[0].toUpperCase() : 'A'}
                    </div>
                    <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
                      {user?.email || 'alex@tinyroute.dev'}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#3525cd] hover:bg-[#4f46e5] rounded-lg shadow-sm transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && onOpenCreateModal && (
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="p-1.5 rounded-lg bg-[#4f46e5] text-white text-xs font-semibold shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-xl">
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
                Signed in as <span className="text-slate-900 font-semibold">{user?.email}</span>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Home className="w-4 h-4" /> Dashboard
              </Link>
              <Link
                to="/urls"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <LinkIcon className="w-4 h-4" /> My URLs
              </Link>
              <Link
                to="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <BarChart2 className="w-4 h-4" /> Analytics
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <User className="w-4 h-4" /> Profile & Settings
              </Link>
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Features
              </a>
              <a
                href="#code"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                REST API Docs
              </a>
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg text-sm font-medium text-slate-800 bg-slate-100"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg text-sm font-semibold text-white bg-[#3525cd]"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
