import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Activity,
  Terminal,
  Server,
  Key,
  ExternalLink,
  ChevronRight,
  Check,
  Copy
} from 'lucide-react';
import Modal from '../components/Modal';

export default function Login() {
  const { user, isAuthenticated, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('alex@tinyroute.dev');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Notification toast
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Demo accounts for quick one-click testing
  const demoAccounts = [
    {
      role: 'Alex Vance (Lead Architect)',
      tier: 'PRO',
      email: 'alex@tinyroute.dev',
      pass: 'password123',
    },
    {
      role: 'Enterprise Dev (DevOps)',
      tier: 'ENTERPRISE',
      email: 'enterprise@acme-cloud.io',
      pass: 'edge2025pass',
    },
  ];

  const handleQuickFill = (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setErrors({});
    setServerError('');
    triggerToast(`Filled credentials for ${acc.role}`);
  };

  // Client-side form validation
  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle standard email/password authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
      triggerToast('Signed in successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Handle one-click Google OAuth simulation
  const handleGoogleLogin = async () => {
    setServerError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      triggerToast('Signed in with Google! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch {
      setServerError('Unable to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password submit handler
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      triggerToast('Please enter a valid email address');
      return;
    }
    setForgotSent(true);
    triggerToast(`Password reset link dispatched to ${forgotEmail}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8f9ff] text-[#0b1c30] relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Ambient Gradient Background Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[360px] bg-gradient-to-tr from-[#e2dfff] via-indigo-200/40 to-transparent blur-3xl pointer-events-none -z-10 opacity-70"></div>
      <div className="absolute top-96 -left-20 w-80 h-80 bg-blue-100/60 blur-2xl pointer-events-none -z-10 rounded-full"></div>
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-purple-100/40 blur-3xl pointer-events-none -z-10 rounded-full"></div>

      {/* Main Container: Split Two-Column on Desktop */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* =========================================================================
            LEFT COLUMN: THE AUTHENTICATION TERMINAL & FORM (7 cols)
           ========================================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div>
            {/* Top Brand Pill & Logo */}
            <div className="flex items-center justify-between gap-2 mb-6">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-[#3525cd] text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <span className="text-xl font-bold text-[#0b1c30] tracking-tight">TinyRoute</span>
              </Link>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-semibold border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>310+ Anycast PoPs</span>
              </div>
            </div>

            {/* Header copy */}
            <div className="space-y-1.5 mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
                Sign in to Console
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Access your global edge routing rules, telemetry dashboards, and API keys
              </p>
            </div>

            {/* Already Authenticated Active Banner (Allows one-click dash or account switch) */}
            {isAuthenticated && (
              <div className="mb-6 p-3.5 rounded-2xl bg-[#eff4ff] border border-indigo-200/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#3525cd] text-white flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'A'}
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Currently active session:</span>
                    <strong className="text-[#0b1c30] font-mono">{user?.email || 'alex@tinyroute.dev'}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-3 py-1.5 rounded-xl bg-[#3525cd] text-white font-semibold text-xs hover:bg-[#4f46e5] shadow-xs transition-colors flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* QUICK ONE-CLICK DEMO ACCOUNTS SELECTOR */}
            <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono uppercase font-semibold text-slate-500 tracking-wider">
                  ⚡ Quick Demo Accounts (1-Click Fill)
                </span>
                <span className="text-slate-400">Click to autofill</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleQuickFill(acc)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-left hover:border-indigo-400 hover:shadow-xs transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-[#3525cd]">
                        {acc.role}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {acc.tier}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 truncate block mt-0.5">
                      {acc.email}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 shadow-xs transition-colors mb-5 cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                or email credentials
              </span>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    placeholder="alex@tinyroute.dev"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-slate-200 focus:border-[#3525cd] focus:ring-indigo-100'
                    }`}
                    required
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotModalOpen(true);
                    }}
                    className="text-[11px] text-[#3525cd] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    placeholder="••••••••••••"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-xs bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-slate-200 focus:border-[#3525cd] focus:ring-indigo-100'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
              </div>

              {/* Remember me option */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-[#3525cd] w-4 h-4 cursor-pointer"
                  />
                  <span>Remember this device for 30 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating with Edge...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom links and security badge */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#3525cd] font-semibold hover:underline">
                Create account free
              </Link>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SOC2 Type II • 256-bit TLS</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: THE TINYROUTE EDGE SHOWCASE & TELEMETRY PANEL (5 cols)
           ========================================================================= */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#0b1c30] text-white p-8 flex-col justify-between relative overflow-hidden border-l border-slate-800">
          {/* Subtle Ambient Light Orb */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Edge Status Ticker */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <span className="text-xs font-mono text-indigo-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Anycast Global Mesh
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                99.999% SLA
              </span>
            </div>

            {/* Live Interactive Shortlink Preview Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Edge Proxy
                </span>
                <span className="text-emerald-400 font-bold">0.38ms TTFB</span>
              </div>

              <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 font-mono text-xs">
                <div className="text-indigo-300 font-semibold truncate">
                  tinyroute.app/spring-cloud
                </div>
                <div className="text-slate-500 text-[10px] truncate flex items-center gap-1">
                  <span>↳</span>
                  <span>https://github.com/spring-projects/spring-cloud</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
                <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/40">
                  <span className="text-slate-400 block">Status</span>
                  <span className="text-emerald-400 font-bold">301 Moved</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/40">
                  <span className="text-slate-400 block">Telemetry Clicks</span>
                  <span className="text-white font-bold">49,820</span>
                </div>
              </div>
            </div>

            {/* Edge PoP latency breakdown */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider block">
                Edge Node Telemetry
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {[
                  { region: 'US-East (Virginia)', lat: '0.4ms', status: 'Healthy' },
                  { region: 'EU-Central (Frankfurt)', lat: '0.6ms', status: 'Healthy' },
                  { region: 'AP-Northeast (Tokyo)', lat: '0.8ms', status: 'Healthy' },
                  { region: 'UK-London (Slough)', lat: '0.5ms', status: 'Healthy' },
                ].map((node) => (
                  <div
                    key={node.region}
                    className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800/50 text-[11px]"
                  >
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {node.region}
                    </span>
                    <span className="text-indigo-300 font-semibold">{node.lat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spring Boot REST API Auth Code Snippet */}
            <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 font-mono text-[11px] space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span className="flex items-center gap-1 text-indigo-300">
                  <Terminal className="w-3 h-3" /> REST Client cURL
                </span>
                <span>JWT Auth</span>
              </div>
              <pre className="text-slate-300 overflow-x-auto leading-relaxed">
                curl -X POST /api/auth/login \{'\n'}
                {'  '}-d '&#123;"email":"alex@tinyroute.dev"&#125;'
              </pre>
            </div>
          </div>

          {/* Bottom Guarantee */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Spring Boot Ready</span>
            <span className="text-indigo-400 font-semibold font-mono">v3.2 Edge Engine</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FORGOT PASSWORD MODAL
         ========================================================================= */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => {
          setForgotModalOpen(false);
          setForgotSent(false);
        }}
        title="Reset Account Password"
      >
        {forgotSent ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#0b1c30]">Check Your Inbox</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              We have dispatched a secure password reset token to{' '}
              <strong className="text-slate-800 font-mono">{forgotEmail}</strong>. Follow the link to choose a new password.
            </p>
            <button
              type="button"
              onClick={() => {
                setForgotModalOpen(false);
                setForgotSent(false);
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-[#3525cd] text-white text-xs font-semibold hover:bg-[#4f46e5]"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your verified email address and our Anycast auth worker will transmit a secure password recovery link.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="alex@tinyroute.dev"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md"
              >
                Send Recovery Link
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
