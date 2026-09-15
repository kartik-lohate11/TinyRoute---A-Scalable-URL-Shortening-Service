import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Shield,
  Key,
  Copy,
  Check,
  Zap,
  Server,
  Code2,
  Lock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function Profile() {
  const { user, token, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState(user?.name || 'Alex Vance');
  const [email, setEmail] = useState(user?.email || 'alex@tinyroute.dev');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // API Token state
  const [apiKey, setApiKey] = useState(token || 'tr_live_sec_89d3a7e2b109c4');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Status feedback
  const [toastMessage, setToastMessage] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Handle Profile Update
  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({ name, email });
    setProfileSuccess(true);
    triggerToast('Profile information updated');
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  // Handle Password Change
  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      triggerToast('New password must be at least 6 characters');
      return;
    }
    setPasswordSuccess(true);
    setOldPassword('');
    setNewPassword('');
    triggerToast('Password changed successfully');
    setTimeout(() => setPasswordSuccess(false), 2500);
  };

  // Copy API Token
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    triggerToast('Copied API Secret Token to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Regenerate API Token
  const handleRegenerateKey = () => {
    const newKey = 'tr_live_sec_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 8);
    setApiKey(newKey);
    triggerToast('Regenerated new API access token');
  };

  // Logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-xs font-mono font-semibold text-[#3525cd] uppercase tracking-wider">
          Account Settings & Developer API
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight mt-1">
          Profile & Workspaces
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your credentials, subscription quotas, and Spring Boot REST API integration
        </p>
      </div>

      {/* 1. PROFILE & QUOTA OVERVIEW */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#3525cd] text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {name ? name[0].toUpperCase() : 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#0b1c30]">{name}</h2>
              <span className="px-2 py-0.5 rounded bg-[#e2dfff] text-[#3525cd] font-mono font-bold text-[10px] uppercase">
                {user?.role || 'PRO PLAN'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{email}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Member since Jan 2024</p>
          </div>
        </div>

        {/* Quota Progress */}
        <div className="w-full md:w-64 bg-[#eff4ff] p-4 rounded-xl border border-indigo-100/60 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-medium">Monthly Link Quota</span>
            <span className="font-mono font-bold text-[#3525cd]">128 / 1,000</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-[#3525cd] h-full rounded-full" style={{ width: '12.8%' }}></div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">872 links remaining this cycle</span>
        </div>
      </div>

      {/* 2. PROFILE EDIT FORM */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider pb-2 border-b border-slate-100">
          Personal Information
        </h3>

        <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all"
            >
              Update Information
            </button>
          </div>
        </form>
      </div>

      {/* 3. API ACCESS TOKEN (SPRING BOOT COMPATIBLE) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
              Developer API & JWT Token
            </h3>
            <p className="text-xs text-slate-500">
              Use this bearer token to authenticate requests from your Spring Boot or client applications
            </p>
          </div>
          <button
            type="button"
            onClick={handleRegenerateKey}
            className="text-xs text-slate-600 hover:text-[#3525cd] flex items-center gap-1 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Roll Token</span>
          </button>
        </div>

        {/* Token Key Box */}
        <div className="bg-[#eff4ff] p-3 rounded-xl border border-indigo-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Key className="w-4 h-4 text-[#3525cd] shrink-0" />
            <span className="font-mono text-xs text-slate-800 truncate">
              {showApiKey ? apiKey : '••••••••••••••••••••••••••••••••••••••••'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="px-2.5 py-1 rounded bg-white text-slate-700 hover:bg-slate-100 text-xs font-medium border border-slate-200"
            >
              {showApiKey ? 'Hide' : 'Reveal'}
            </button>
            <button
              type="button"
              onClick={handleCopyApiKey}
              className="px-2.5 py-1 rounded bg-[#3525cd] text-white hover:bg-[#4f46e5] text-xs font-medium flex items-center gap-1"
            >
              {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Spring Boot Developer Documentation callout */}
        <div className="bg-slate-900 rounded-xl p-4 text-slate-100 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Server className="w-3.5 h-3.5" /> Spring Boot Configuration
            </span>
            <span className="text-[11px]">application.properties</span>
          </div>
          <pre className="text-slate-300 leading-relaxed overflow-x-auto">
            # Connect frontend with Spring Boot backend via environment{'\n'}
            tinyroute.api.base-url=http://localhost:8080{'\n'}
            tinyroute.api.jwt-secret=tr_live_sec_your_spring_secret{'\n'}
            {'\n'}
            # Example HTTP Request Header:{'\n'}
            Authorization: Bearer {apiKey.substring(0, 18)}...
          </pre>
        </div>
      </div>

      {/* 4. SECURITY & AUTHENTICATION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider pb-2 border-b border-slate-100">
          Security & Password
        </h3>

        <form onSubmit={handlePasswordSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* 2FA Toggle */}
          <div className="sm:col-span-2 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">Two-Factor Authentication (2FA)</span>
              <span className="text-[11px] text-slate-500">Require an authenticator code when logging in</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                triggerToast(twoFactorEnabled ? '2FA disabled' : '2FA enabled');
              }}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                twoFactorEnabled ? 'bg-[#3525cd]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="sm:col-span-2 flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
