import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Link as LinkIcon,
  ArrowRight,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Code2,
  Terminal,
  Activity,
  Layers,
  ArrowDown,
  ShieldCheck,
  Download,
  Sun,
  Moon,
  Sliders
} from 'lucide-react';
import Modal from '../components/Modal';

export default function Landing() {
  const navigate = useNavigate();

  // Interactive URL shortener console state
  const [longUrl, setLongUrl] = useState('https://github.com/engineering/deploy-v3/changelog-autumn-release');
  const [customAlias, setCustomAlias] = useState('v3-deploy');
  const [previewUrl, setPreviewUrl] = useState('tinyroute.app/v3-deploy');
  const [previewOriginal, setPreviewOriginal] = useState('https://github.com/engineering/deploy-v3/changelog-autumn-release');
  const [charsSaved, setCharsSaved] = useState(68);
  const [shortenBtnText, setShortenBtnText] = useState('Shorten URL');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Show temporary toast message
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  // Handle live interactive shortening demo
  const handleShortenDemo = (e) => {
    if (e) e.preventDefault();
    const url = longUrl.trim() || 'https://github.com/engineering/deploy-v3/changelog';
    const alias = customAlias.trim() || Math.random().toString(36).substring(2, 8);
    const short = `tinyroute.app/${alias}`;

    setPreviewOriginal(url);
    setPreviewUrl(short);
    setCharsSaved(Math.max(12, url.length - short.length));

    setShortenBtnText('Generated!');
    setTimeout(() => setShortenBtnText('Shorten URL'), 1800);
    triggerToast(`Created ${short}`);
  };

  // Copy short link from preview
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${previewUrl}`);
    setCopiedLink(true);
    triggerToast('Copied shortlink to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Copy curl snippet
  const handleCopyCurl = () => {
    const snippet = `curl -X POST https://api.tinyroute.app/v1/urls \\\n  -H "Authorization: Bearer tr_sec_live_99a8x" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "destination": "https://company.org/report-2025",\n    "slug": "q3-results",\n    "trackGeo": true\n  }'`;
    navigator.clipboard.writeText(snippet);
    setCopiedCurl(true);
    triggerToast('Copied cURL command!');
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Decorative Ambient Backdrop Blurs */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-gradient-to-tr from-[#e2dfff] via-indigo-200/40 to-transparent blur-3xl pointer-events-none -z-10 opacity-70"></div>
        <div className="absolute top-96 -left-24 w-80 h-80 bg-blue-100/60 blur-2xl pointer-events-none -z-10 rounded-full"></div>
        <div className="absolute top-[480px] -right-20 w-96 h-96 bg-purple-100/40 blur-3xl pointer-events-none -z-10 rounded-full"></div>

        {/* 1. HERO SECTION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col items-center text-center">
          {/* Pill Badge */}
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-[#e5eeff] px-4 py-1.5 rounded-full shadow-sm mb-8 hover:bg-[#dce9ff] transition cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-[#3525cd] animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-[#3525cd] -ml-3"></span>
            <span className="text-xs font-semibold text-[#3525cd]">TinyRoute 2.0 is Live</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-600">Sub-millisecond global edge redirects</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#3525cd] group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Main Heading */}
          <h1 className="font-semibold text-4xl sm:text-5xl lg:text-6xl text-[#0b1c30] max-w-4xl tracking-tight leading-[1.15] mb-6">
            Turn long URLs into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3525cd] via-[#4f46e5] to-indigo-500">
              simple, powerful links
            </span>
            .
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
            Create short, branded, shareable URLs in seconds and track real-time click telemetry across devices,
            platforms, and global edge points.
          </p>

          {/* Interactive URL Shortener Console */}
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-5 flex flex-col gap-3 mb-10 text-left">
            <form onSubmit={handleShortenDemo} className="flex flex-col sm:flex-row gap-3">
              {/* Long URL input */}
              <div className="flex-1 flex items-center bg-[#eff4ff] rounded-xl px-3.5 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-600/20 focus-within:shadow-sm transition-all border border-slate-200/60">
                <LinkIcon className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="Paste your long URL here (e.g., https://github.com/engineering/...)"
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  required
                />
              </div>

              {/* Alias input */}
              <div className="sm:w-52 flex items-center bg-[#eff4ff] rounded-xl px-3 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-600/20 focus-within:shadow-sm transition-all border border-slate-200/60">
                <span className="font-mono text-xs text-slate-400 mr-1 select-none">/</span>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="Custom alias"
                  className="w-full bg-transparent text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </form>

            {/* Action Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-[#eff4ff] text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                  <Zap className="w-3.5 h-3.5 text-[#3525cd]" />
                  <span>Cloudflare Workers Core</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero tracking latency</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShortenDemo}
                  className="bg-[#3525cd] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-[#4f46e5] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{shortenBtnText}</span>
                  <Zap className="w-3.5 h-3.5 fill-white" />
                </button>
                <Link
                  to="/signup"
                  className="bg-[#e5eeff] text-[#0b1c30] text-xs font-medium px-3.5 py-2 rounded-lg hover:bg-[#dce9ff] transition-colors"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>

          {/* Transformation Demo Visual Card */}
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-slate-200 p-5 sm:p-6 flex flex-col text-left">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Live Pipeline Preview
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#eff4ff] text-slate-800 font-mono text-xs px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Redirect 301 Active
              </span>
            </div>

            {/* Before: Long URL */}
            <div className="bg-[#eff4ff] rounded-xl p-3.5 flex items-center justify-between gap-4 overflow-hidden">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-500 shrink-0 shadow-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-[11px] text-slate-400 font-medium">Original Destination</span>
                  <span className="font-mono text-xs text-slate-700 truncate">{previewOriginal}</span>
                </div>
              </div>
              <span className="hidden sm:inline font-mono text-xs text-slate-500 whitespace-nowrap bg-white px-2 py-0.5 rounded border border-slate-200/60">
                {previewOriginal.length} chars
              </span>
            </div>

            {/* Animated Bridge Arrow */}
            <div className="flex items-center justify-center my-3 relative">
              <div className="h-6 w-0.5 bg-indigo-100"></div>
              <div className="absolute bg-[#eff4ff] text-[#3525cd] px-3 py-0.5 rounded-full shadow-xs border border-indigo-100 flex items-center gap-1 font-mono text-xs">
                <ArrowDown className="w-3 h-3 animate-bounce" />
                <span className="font-semibold">{charsSaved} chars saved · 0.4ms TTFB</span>
              </div>
            </div>

            {/* After: Transformed Short URL */}
            <div className="bg-[#e2dfff]/30 rounded-xl p-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 border border-indigo-100/60 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#3525cd] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-[11px] text-[#3525cd] font-semibold">Edge Short Link</span>
                  <span className="font-mono text-sm sm:text-base text-[#3525cd] font-bold tracking-tight">
                    {previewUrl}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="bg-white hover:bg-slate-50 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs border border-slate-200 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#3525cd]" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg shadow-xs border border-slate-200 transition-colors"
                  title="Show QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <a
                  href={`https://${previewUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg shadow-xs border border-slate-200 transition-colors"
                  title="Test Redirect"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Social Proof Strip */}
          <div className="mt-14 flex flex-col items-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-6 font-medium">
              Trusted by 14,000+ developers, marketers, and engineering teams
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="font-bold text-lg text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-indigo-600"></span> Stripe
              </div>
              <div className="font-bold text-lg text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-slate-900"></span> Vercel
              </div>
              <div className="font-bold text-lg text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-emerald-500"></span> Supabase
              </div>
              <div className="font-bold text-lg text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-indigo-500"></span> Linear
              </div>
              <div className="font-bold text-lg text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-amber-500"></span> Cloudflare
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 2. FEATURE BENTO GRID */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="mb-10 text-left">
          <span className="text-xs text-[#3525cd] font-semibold uppercase tracking-wider">Engineered For Scale</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] mt-1 tracking-tight">
            Everything you need to govern, automate, and inspect links
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-2">
            Built from the ground up for sub-millisecond edge resolution, robust observability, and frictionless developer automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Global Edge Redirection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#3525cd] mb-4">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <h3 className="text-lg font-semibold text-[#0b1c30] mb-2">Global Edge Redirection</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Powered by 310+ Anycast edge nodes. Traffic hits compute clusters located directly beside the user for unnoticeable sub-1ms routing worldwide.
              </p>
            </div>
            <div className="bg-[#eff4ff] rounded-xl p-4 flex items-end justify-between h-24 border border-indigo-50">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-slate-500">Global Avg Latency</span>
                <span className="text-xl font-bold text-emerald-700">0.38 ms</span>
              </div>
              {/* Mini Sparkline SVG */}
              <svg className="w-40 h-10 text-emerald-600" fill="none" viewBox="0 0 100 30">
                <path d="M0 25 L15 22 L30 26 L45 10 L60 14 L75 8 L90 12 L100 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                <circle cx="100" cy="6" fill="currentColor" r="3"></circle>
              </svg>
            </div>
          </div>

          {/* Card 2: Real-time Click Telemetry */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#0b1c30] mb-2">Real-time Click Telemetry</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Stream click metrics instantly. Breakdown referrers, device distributions, operating systems, bots, and granular country-level geolocations with precision.
              </p>
            </div>
            <div className="bg-[#eff4ff] rounded-xl p-4 flex flex-col gap-2 border border-indigo-50">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-800 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3525cd]"></span> Direct / Slack / App
                </span>
                <span className="font-mono font-semibold text-slate-900">64.2%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                <div className="bg-[#3525cd] h-full" style={{ width: '64%' }}></div>
                <div className="bg-[#4f46e5] h-full" style={{ width: '22%' }}></div>
                <div className="bg-slate-400 h-full" style={{ width: '14%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-mono pt-1">
                <span>Twitter / X: 22%</span>
                <span>LinkedIn: 14%</span>
              </div>
            </div>
          </div>

          {/* Card 3: Enterprise Link Management */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#0b1c30] mb-2">Enterprise Link Management</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Zero-configuration custom domain SSL, deep link mobile fallback routing, dynamic UTM parameters, expiration timestamps, and password gates.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="bg-[#eff4ff] text-slate-800 font-mono text-xs px-3 py-1 rounded-md flex items-center gap-1 border border-indigo-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Custom Domains
              </span>
              <span className="bg-[#eff4ff] text-slate-800 font-mono text-xs px-3 py-1 rounded-md flex items-center gap-1 border border-indigo-100">
                <QrCode className="w-3.5 h-3.5 text-[#3525cd]" /> Auto Dynamic QR
              </span>
              <span className="bg-[#eff4ff] text-slate-800 font-mono text-xs px-3 py-1 rounded-md flex items-center gap-1 border border-indigo-100">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> TTL Expiration
              </span>
            </div>
          </div>

          {/* Card 4: Developer-First REST API */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#0b1c30] mb-2">Developer-First REST API & JWT</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Spring Boot compatible architecture. Full OpenAPI 3.0 specification, webhooks, rate limiting, and official client SDKs in TypeScript, Python, and Go.
              </p>
            </div>
            <div className="bg-[#eff4ff] rounded-xl p-3 font-mono text-xs text-slate-800 flex items-center justify-between border border-indigo-100">
              <code className="text-[#3525cd] font-semibold">POST /api/v1/urls</code>
              <span className="text-emerald-700 bg-white px-2 py-0.5 rounded text-xs font-semibold border border-emerald-200">
                201 CREATED
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CODE PREVIEW & LIVE QR SHOWCASE */}
      <section id="code" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 flex flex-col lg:flex-row gap-10 items-center">
          {/* Left code terminal */}
          <div className="flex-1 w-full flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-4 h-4 text-[#3525cd]" />
              <span className="text-xs font-semibold text-[#3525cd] uppercase tracking-wider">RESTful Integration</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] mb-3 tracking-tight">
              Shorten links in two lines of code
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Authenticate with your Spring Boot JWT bearer token and pipe URLs straight through the TinyRoute API. Automate marketing links, transaction emails, and SMS alerts.
            </p>

            {/* Terminal Window */}
            <div className="bg-[#0b1c30] rounded-xl p-4 text-slate-100 font-mono text-xs shadow-lg overflow-x-auto border border-slate-800">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="ml-2 text-slate-400 text-[11px]">curl -X POST https://api.tinyroute.app/v1/urls</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCurl}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-xs cursor-pointer"
                >
                  {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCurl ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="leading-relaxed text-slate-300">
                <span className="text-emerald-400">curl</span> -X POST https://api.tinyroute.app/v1/urls \
  -H <span className="text-indigo-300">"Authorization: Bearer tr_sec_live_99a8x"</span> \
  -H <span className="text-indigo-300">"Content-Type: application/json"</span> \
  -d <span className="text-amber-200">'{`{
    "destination": "https://company.org/report-2025",
    "slug": "q3-results",
    "trackGeo": true
  }`}'</span>
              </pre>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-slate-500 font-medium">SDK Support:</span>
              <span className="font-mono bg-[#eff4ff] px-2.5 py-1 rounded text-slate-700 border border-slate-200">
                npm i @tinyroute/sdk
              </span>
              <span className="font-mono bg-[#eff4ff] px-2.5 py-1 rounded text-slate-700 border border-slate-200">
                pip install tinyroute
              </span>
            </div>
          </div>

          {/* Right dynamic QR code card */}
          <div className="w-full lg:w-96 bg-[#eff4ff] rounded-2xl p-6 sm:p-7 flex flex-col items-center text-center border border-indigo-100 shadow-sm">
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Dynamic QR Code</span>
              <span className="bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">High Res</span>
            </div>

            {/* Stylized QR Code Graphic */}
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 border border-slate-200/80">
              <svg className="w-40 h-40 text-[#0b1c30]" fill="currentColor" viewBox="0 0 100 100">
                <rect fill="currentColor" height="28" rx="4" width="28" x="0" y="0"></rect>
                <rect fill="white" height="20" rx="2" width="20" x="4" y="4"></rect>
                <rect fill="currentColor" height="12" rx="1" width="12" x="8" y="8"></rect>
                <rect fill="currentColor" height="28" rx="4" width="28" x="72" y="0"></rect>
                <rect fill="white" height="20" rx="2" width="20" x="76" y="4"></rect>
                <rect fill="currentColor" height="12" rx="1" width="12" x="80" y="8"></rect>
                <rect fill="currentColor" height="28" rx="4" width="28" x="0" y="72"></rect>
                <rect fill="white" height="20" rx="2" width="20" x="4" y="76"></rect>
                <rect fill="currentColor" height="12" rx="1" width="12" x="8" y="80"></rect>

                <rect height="6" rx="1" width="6" x="34" y="6"></rect>
                <rect height="6" rx="1" width="6" x="44" y="6"></rect>
                <rect height="6" rx="1" width="6" x="54" y="6"></rect>
                <rect height="6" rx="1" width="6" x="34" y="16"></rect>
                <rect height="6" rx="1" width="6" x="54" y="16"></rect>
                <rect height="6" rx="1" width="6" x="44" y="24"></rect>
                <rect height="6" rx="1" width="6" x="6" y="34"></rect>
                <rect height="6" rx="1" width="6" x="16" y="34"></rect>
                <circle cx="50" cy="50" fill="#3525cd" r="12"></circle>
                <path d="M48 42 L56 50 L48 58" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                <rect height="6" rx="1" width="6" x="72" y="36"></rect>
                <rect height="6" rx="1" width="6" x="84" y="36"></rect>
                <rect height="6" rx="1" width="6" x="36" y="72"></rect>
                <rect height="6" rx="1" width="6" x="48" y="72"></rect>
                <rect height="6" rx="1" width="6" x="60" y="72"></rect>
                <rect height="6" rx="1" width="6" x="76" y="76"></rect>
                <rect height="6" rx="1" width="6" x="88" y="88"></rect>
              </svg>
            </div>

            <span className="font-mono text-xs font-semibold text-[#3525cd]">{previewUrl}.qr</span>
            <p className="text-xs text-slate-500 mt-1">Scan from any camera to test instantaneous redirection</p>

            <div className="w-full mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => triggerToast('Downloaded High-Res SVG & PNG package!')}
                className="flex-1 bg-white text-slate-800 hover:bg-slate-50 py-2 rounded-xl text-xs font-semibold shadow-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> SVG / PNG
              </button>
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="bg-white text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-xl text-xs font-semibold shadow-xs border border-slate-200 transition-colors"
                title="Options"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION SECTION */}
      <section id="cta" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="relative bg-gradient-to-r from-[#3525cd] via-[#4f46e5] to-indigo-700 rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Ready to scale your edge link routing?
            </h2>
            <p className="text-sm sm:text-base text-indigo-100">
              Join 14,000+ developers shortening millions of daily links without latency or cold starts. Free forever for up to 1,000 links/mo.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="bg-white text-[#3525cd] text-sm font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-50 active:scale-95 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/dashboard"
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all"
            >
              Open Live Console
            </Link>
          </div>
          {/* Subtle Decorative glow */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        </div>
      </section>

      {/* 5. CLEAN SAAS FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-left">
            {/* Brand identity */}
            <div className="col-span-2 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#3525cd] text-white flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <span className="text-xl font-bold text-[#0b1c30] tracking-tight">TinyRoute</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mb-4 leading-relaxed">
                Next-generation URL shortening platform engineered with sub-millisecond edge resolution and comprehensive click telemetry.
              </p>
              {/* Operational status badge */}
              <div className="flex items-center gap-2 bg-[#eff4ff] px-3 py-1.5 rounded-full w-fit border border-indigo-100/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-xs text-slate-700">All edge regions operational (99.99%)</span>
              </div>
            </div>

            {/* Product */}
            <div className="flex flex-col gap-2 text-xs">
              <span className="font-semibold text-slate-900 uppercase tracking-wider mb-1">Product</span>
              <a href="#features" className="text-slate-600 hover:text-[#3525cd] transition-colors">Features</a>
              <a href="#features" className="text-slate-600 hover:text-[#3525cd] transition-colors">Edge Routing</a>
              <a href="#code" className="text-slate-600 hover:text-[#3525cd] transition-colors">Dynamic QR Codes</a>
              <Link to="/urls" className="text-slate-600 hover:text-[#3525cd] transition-colors">Custom Domains</Link>
              <Link to="/signup" className="text-slate-600 hover:text-[#3525cd] transition-colors">Pricing Plans</Link>
            </div>

            {/* Developers */}
            <div className="flex flex-col gap-2 text-xs">
              <span className="font-semibold text-slate-900 uppercase tracking-wider mb-1">Developers</span>
              <a href="#code" className="text-slate-600 hover:text-[#3525cd] transition-colors">REST API Docs</a>
              <a href="#code" className="text-slate-600 hover:text-[#3525cd] transition-colors">SDK Libraries</a>
              <a href="#code" className="text-slate-600 hover:text-[#3525cd] transition-colors">Postman Collection</a>
              <Link to="/analytics" className="text-slate-600 hover:text-[#3525cd] transition-colors">Uptime Telemetry</Link>
            </div>

            {/* Compliance */}
            <div className="flex flex-col gap-2 text-xs">
              <span className="font-semibold text-slate-900 uppercase tracking-wider mb-1">Compliance</span>
              <a href="#" className="text-slate-600 hover:text-[#3525cd] transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-600 hover:text-[#3525cd] transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-600 hover:text-[#3525cd] transition-colors">Security & Trust</a>
              <a href="#" className="text-slate-600 hover:text-[#3525cd] transition-colors">Abuse Report</a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 text-xs text-slate-500">
            <span>© 2025 TinyRoute, Inc. Designed for ultra-low latency link orchestration.</span>
            <div className="flex items-center gap-3">
              <span>Switch Appearance:</span>
              <div className="flex items-center bg-[#eff4ff] p-1 rounded-full border border-indigo-100">
                <button
                  type="button"
                  onClick={() => triggerToast('Light theme active')}
                  className="bg-white text-[#3525cd] p-1 rounded-full shadow-xs"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast('Dark theme can be enabled in settings')}
                  className="text-slate-400 p-1 rounded-full hover:text-slate-700"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* QR Code Preview Modal */}
      <Modal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} title="Scannable Vector QR Code">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-[#eff4ff] rounded-2xl border border-indigo-100">
            <svg className="w-48 h-48 text-[#0b1c30]" fill="currentColor" viewBox="0 0 100 100">
              <rect height="28" rx="4" width="28" x="0" y="0"></rect>
              <rect fill="white" height="20" rx="2" width="20" x="4" y="4"></rect>
              <rect height="12" rx="1" width="12" x="8" y="8"></rect>
              <rect height="28" rx="4" width="28" x="72" y="0"></rect>
              <rect fill="white" height="20" rx="2" width="20" x="76" y="4"></rect>
              <rect height="12" rx="1" width="12" x="80" y="8"></rect>
              <rect height="28" rx="4" width="28" x="0" y="72"></rect>
              <rect fill="white" height="20" rx="2" width="20" x="4" y="76"></rect>
              <rect height="12" rx="1" width="12" x="8" y="80"></rect>
              <circle cx="50" cy="50" fill="#3525cd" r="10"></circle>
            </svg>
          </div>
          <p className="font-mono text-xs font-semibold text-[#3525cd]">{previewUrl}</p>
          <p className="text-xs text-slate-500">Scan using any iOS or Android camera for instant 301 redirection.</p>
          <div className="w-full flex gap-2">
            <button
              type="button"
              onClick={() => {
                triggerToast('Downloaded SVG format');
                setQrModalOpen(false);
              }}
              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              Download SVG
            </button>
            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              className="flex-1 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
