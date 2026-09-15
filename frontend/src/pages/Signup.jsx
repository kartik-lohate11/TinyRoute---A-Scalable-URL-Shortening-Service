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
  ShieldCheck,
  Globe,
  Activity,
  CheckCircle2,
  Check,
  Terminal,
  Sparkles
} from 'lucide-react';

export default function Signup() {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Client-side form validation
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'Please accept the terms of service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle account registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup(email.trim(), password);
      triggerToast('Account provisioned! Redirecting to console...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth simulation
  const handleGoogleSignup = async () => {
    setServerError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      triggerToast('Account created with Google! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch {
      setServerError('Unable to sign up with Google. Please try again.');
    } finally {
      setLoading(false);
    }
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

      {/* Main Container: Split Layout on Desktop */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* LEFT COLUMN: SIGNUP FORM (7 cols) */}
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

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-[#3525cd] font-mono text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Free 1,000 Links
              </span>
            </div>

            {/* Header */}
            <div className="space-y-1.5 mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
                Create your account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Deploy ultra-fast edge redirects on our global Anycast network in seconds
              </p>
            </div>

            {/* Server error notification */}
            {serverError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Google One-Click Action */}
            <button
              type="button"
              onClick={handleGoogleSignup}
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
                or register with email
              </span>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work or Personal Email
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
                    placeholder="developer@acme.org"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    placeholder="At least 6 characters"
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
                    className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                    }}
                    placeholder="Re-enter password"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-xs bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-slate-200 focus:border-[#3525cd] focus:ring-indigo-100'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    title={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="text-xs pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="rounded accent-[#3525cd] w-4 h-4 mt-0.5 cursor-pointer"
                  />
                  <span>
                    I agree to the TinyRoute Edge Terms of Service and Privacy Policy.
                  </span>
                </label>
                {errors.terms && <p className="text-[11px] text-red-600 mt-1">{errors.terms}</p>}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom link */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Already have an account?{' '}
              <Link to="/login" className="text-[#3525cd] font-semibold hover:underline">
                Sign in
              </Link>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free tier includes full API access</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BENEFITS & ANYCAST HIGHLIGHT (5 cols) */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#0b1c30] text-white p-8 flex-col justify-between relative overflow-hidden border-l border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <span className="text-xs font-mono text-indigo-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Developer Tier
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                $0 / month
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-white tracking-tight">
                What's included in your developer account:
              </h3>

              <div className="space-y-3">
                {[
                  {
                    title: '1,000 Active Shortlinks',
                    desc: 'Shorten, customize slugs, and generate vector QR codes.',
                  },
                  {
                    title: 'Global Edge Redirection (<1ms)',
                    desc: 'Instant HTTP 301/302 redirects dispatched via 310+ Anycast PoPs.',
                  },
                  {
                    title: 'Granular Telemetry Analytics',
                    desc: 'Track geographic origin, client devices, browsers, and referrers.',
                  },
                  {
                    title: 'Spring Boot REST API Token',
                    desc: 'Plug into your Spring Boot, Node, Python, or Go microservices.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-white block text-xs">{item.title}</strong>
                      <span className="text-slate-400 text-[11px] leading-relaxed">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "TinyRoute replaced our internal redirect service. Reduced latency by 80% with zero maintenance."
              </p>
              <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                  E
                </div>
                <div>
                  <span className="text-white font-semibold">Engineering Lead</span>
                  <span className="text-slate-500 block text-[10px]">CloudScale Infra</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>No credit card required</span>
            <span className="text-emerald-400 font-semibold font-mono">Instant Setup</span>
          </div>
        </div>
      </div>
    </div>
  );
}
