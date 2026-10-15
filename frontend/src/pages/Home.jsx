import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import QrModal from '../components/QrModal';
import { shortenUrl } from '../services/api';

export default function Home({ onToast }) {
  const navigate = useNavigate();

  // Form states
  const [longUrl, setLongUrl] = useState(
    'https://github.com/torvalds/linux/commit/884612d7c07b46bb3e34ae76dfb'
  );
  const [customSlug, setCustomSlug] = useState('');
  const [showAliasPanel, setShowAliasPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [guestUsage, setGuestUsage] = useState({ used: 2, max: 5 });

  // Current shortened result
  const [currentResult, setCurrentResult] = useState({
    shortUrl: 'https://tinyroute.io/Ab3x9K',
    originalUrl: 'https://github.com/torvalds/linux/commit/884612d7c07b46bb3e34ae76dfb',
    tag: 'linux-kernel-repo',
    clicks: 0,
    created: '10s ago',
  });

  // QR Modal state
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Form submission handler
  const handleShorten = async (e) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    setIsLoading(true);
    try {
      const response = await shortenUrl({
        url: longUrl,
        customSlug: customSlug.trim() || undefined,
      });

      const routeData = response.data?.route || {
        shortUrl: response.data.short_url,
        originalUrl: longUrl,
        tag: longUrl.includes('github') ? 'github-repo' : 'web-destination',
        clicks: 0,
        created: 'Just now',
      };

      setCurrentResult({
        shortUrl: routeData.shortUrl,
        originalUrl: routeData.originalUrl,
        tag: routeData.tag || 'web-destination',
        clicks: 0,
        created: 'Just now',
      });

      setGuestUsage((prev) => ({
        ...prev,
        used: Math.min(prev.used + 1, prev.max),
      }));

      if (onToast) {
        onToast(
          response.isMock
            ? 'Short link cached to local edge! (Connected to mock engine)'
            : 'Link successfully compressed & written to Spring Boot Redis hash!'
        );
      }
    } catch (err) {
      if (onToast) {
        onToast(err.message || 'Failed to shorten URL. Check format.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    if (onToast) {
      onToast(`Copied ${text} to clipboard!`);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 antialiased min-h-screen flex flex-col">
      <Navbar onToast={onToast} />

      <main className="flex-1 w-full pt-16 bg-slate-50/60">
        <div className="flex flex-col w-full selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
          {/* Ambient Subtle Soft Light Gradient Accents */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-indigo-100/50 via-sky-50/30 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
          <div className="absolute top-[380px] -left-48 w-[500px] h-[500px] bg-emerald-100/30 blur-[130px] pointer-events-none -z-10 rounded-full" />
          <div className="absolute top-[640px] -right-48 w-[450px] h-[450px] bg-indigo-100/40 blur-[130px] pointer-events-none -z-10 rounded-full" />

          {/* Hero & Primary Workspace Container */}
          <section className="w-full max-w-[1440px] mx-auto px-6 md:px-8 pt-12 pb-14 relative z-10 flex flex-col items-center">
            {/* Real-time Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-slate-600 font-semibold">
                Redis In-Memory Cache <span className="text-slate-300 mx-1">/</span> Global Edge Routing (&lt;1ms)
              </span>
              <span className="material-symbols-outlined text-[14px] text-emerald-600 ml-0.5 font-bold">
                bolt
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center max-w-4xl tracking-tight text-slate-900 mb-4">
              Shorten Links with{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Sub-Millisecond Speed
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 text-center max-w-2xl mb-10 leading-relaxed font-normal">
              Powered by high-throughput Redis caching and distributed telemetry. Built for engineers, infrastructure teams, and scale-first platforms.
            </p>

            {/* Quick Shortener Hero Console Box */}
            <div className="w-full max-w-3xl bg-white rounded-xl p-6 sm:p-8 shadow-xl border border-slate-200/80 relative">
              <div className="absolute -top-10 right-10 w-32 h-32 bg-indigo-100/40 blur-2xl pointer-events-none rounded-full" />

              <form onSubmit={handleShorten} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <div className="relative flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-lg focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                    <div className="pl-4 pr-2 text-slate-400 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[20px]">link</span>
                    </div>
                    <input
                      type="url"
                      required
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      placeholder="Paste your long URL here (e.g. https://github.com/...)"
                      className="w-full bg-transparent py-3.5 pr-4 text-slate-900 text-sm focus:outline-none placeholder:text-slate-400 font-mono tracking-tight"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 px-6 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-mono text-xs font-semibold tracking-wide shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                        <span>Routing...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px] text-emerald-300">flash_on</span>
                        <span>Shorten URL</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Optional Customized Alias Accordion / Toggle Row */}
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowAliasPanel(!showAliasPanel)}
                      className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-mono text-xs font-medium transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-slate-500">tune</span>
                      <span>Custom Alias (Optional)</span>
                      <span
                        className={`material-symbols-outlined text-[16px] transition-transform duration-200 text-slate-400 ${
                          showAliasPanel ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {/* TTL Engine Badge */}
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-[11px] text-emerald-700 font-medium">
                      <span className="material-symbols-outlined text-[12px] text-emerald-600">memory</span>
                      <span>TTL: In-Memory (Redis v7.2)</span>
                    </div>
                  </div>

                  {showAliasPanel && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in duration-150">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <span className="font-mono text-xs text-slate-500 px-2 sm:px-0">
                          https://tinyroute.io/
                        </span>
                        <input
                          type="text"
                          value={customSlug}
                          onChange={(e) => setCustomSlug(e.target.value)}
                          placeholder="custom-slug"
                          pattern="[a-zA-Z0-9-_]+"
                          className="flex-1 bg-white border border-slate-200 px-3 py-1.5 rounded text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 placeholder:text-slate-400"
                        />
                        <span className="font-mono text-[11px] text-slate-500 px-2">
                          Alphanumeric + hyphens
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Guest Quota Tracker Bar */}
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 mt-2">
                  <div className="flex items-center gap-2.5 flex-1 max-w-md">
                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-indigo-600 h-full rounded-full shadow-sm transition-all duration-300"
                        style={{ width: `${(guestUsage.used / guestUsage.max) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-slate-600 shrink-0 font-medium">
                      <strong className="text-slate-900 font-semibold">{guestUsage.used}/{guestUsage.max}</strong> URLs used today
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span>24h Guest window resets in <span className="text-slate-800 font-semibold">14h 22m</span></span>
                  </div>
                </div>
              </form>

              {/* Live Shortened Result Card */}
              {currentResult && (
                <div className="mt-6 pt-5 bg-slate-50/80 rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          ACTIVE LINK
                        </span>
                        <span className="font-mono text-[11px] text-slate-500 font-medium">
                          {currentResult.clicks} clicks · Created {currentResult.created}
                        </span>
                      </div>

                      {/* Result URL */}
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={currentResult.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-base font-bold text-indigo-600 hover:text-indigo-800 hover:underline tracking-tight flex items-center gap-1"
                        >
                          <span>{currentResult.shortUrl}</span>
                          <span className="material-symbols-outlined text-[16px] opacity-70">open_in_new</span>
                        </a>
                      </div>

                      {/* Destination preview truncated */}
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono truncate max-w-lg">
                        <span className="material-symbols-outlined text-[14px] shrink-0 text-slate-400">
                          subdirectory_arrow_right
                        </span>
                        <span className="truncate text-slate-700 font-medium">
                          {currentResult.originalUrl}
                        </span>
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-slate-200/70 text-[10px] text-slate-600 font-semibold">
                          [{currentResult.tag}]
                        </span>
                      </div>
                    </div>

                    {/* Result Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(currentResult.shortUrl)}
                        className="h-9 px-3.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono text-xs font-semibold transition-all border border-indigo-200 flex items-center gap-1.5 active:scale-95 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px] text-indigo-600">content_copy</span>
                        <span>Copy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsQrOpen(true)}
                        className="h-9 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-mono text-xs transition-all border border-slate-200 flex items-center gap-1.5 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px] text-indigo-600">qr_code_2</span>
                        <span>QR Code</span>
                      </button>
                    </div>
                  </div>

                  {/* Conversion Teaser Banner */}
                  <div className="pt-3.5 mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px] text-indigo-600">lock_open</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        <strong className="text-slate-900 font-semibold">Sign in with Google</strong> to unlock unlimited links, custom vanity slugs, and microsecond telemetry.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="h-8 px-3 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-mono text-xs flex items-center gap-2 shrink-0 transition-colors shadow-xs"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.8 5 12 5z" fill="#EA4335" />
                        <path d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z" fill="#4285F4" />
                        <path d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" fill="#FBBC05" />
                        <path d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.1-6.7-5.1L1.6 16.1C3.5 20 7.4 23 12 23z" fill="#34A853" />
                      </svg>
                      <span className="font-medium">Continue with Google</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Performance Visualizer & Architecture Metrics Strip */}
          <section className="w-full max-w-[1440px] mx-auto px-6 md:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl flex flex-col justify-between shadow-sm border border-slate-200">
                <span className="font-mono text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                  P99 Edge Latency
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-emerald-600 font-mono">0.42</span>
                  <span className="font-mono text-sm text-slate-400">ms</span>
                </div>
                <span className="text-xs text-slate-500 mt-1">Direct from RAM routing</span>
              </div>

              <div className="bg-white p-5 rounded-xl flex flex-col justify-between shadow-sm border border-slate-200">
                <span className="font-mono text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                  Cache Hit Rate
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-indigo-600 font-mono">99.98</span>
                  <span className="font-mono text-sm text-slate-400">%</span>
                </div>
                <span className="text-xs text-slate-500 mt-1">Multi-region active replica</span>
              </div>

              <div className="bg-white p-5 rounded-xl flex flex-col justify-between shadow-sm border border-slate-200">
                <span className="font-mono text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                  Global Nodes
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-teal-600 font-mono">28</span>
                  <span className="font-mono text-sm text-slate-400">Edge PoPs</span>
                </div>
                <span className="text-xs text-slate-500 mt-1">Anycast DNS propagated</span>
              </div>

              <div className="bg-white p-5 rounded-xl flex flex-col justify-between shadow-sm border border-slate-200">
                <span className="font-mono text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                  System Throughput
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-slate-900 font-mono">1.2M</span>
                  <span className="font-mono text-sm text-slate-400">req/s</span>
                </div>
                <span className="text-xs text-slate-500 mt-1">Zero-allocation runtime</span>
              </div>
            </div>
          </section>

          {/* Engine Specifications (3 Feature Cards) */}
          <section id="features" className="w-full max-w-[1440px] mx-auto px-6 md:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-mono text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span className="material-symbols-outlined text-[16px]">developer_board</span>
                  <span>Engine Specifications</span>
                </div>
                <h2 className="text-2xl lg:text-3xl text-slate-900 font-bold tracking-tight">
                  Engineered for Microsecond Precision
                </h2>
              </div>
              <p className="text-sm text-slate-600 max-w-md">
                Traditional URL shorteners rely on relational database lookups. TinyRoute routes traffic entirely via high-speed in-memory data structures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature Card 1 */}
              <div className="bg-white hover:border-indigo-300 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-md border border-slate-200">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px] text-emerald-600">memory</span>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Core Architecture
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-3">
                    Redis In-Memory Cache
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    0.42ms average redirect resolution time across 28 global edge nodes. Key-value indices stored in RAM ensure zero disk I/O bottlenecks during flash traffic spikes.
                  </p>
                </div>
                <div className="mt-6 pt-4 bg-slate-50 border border-slate-200/70 rounded-lg p-3">
                  <div className="flex justify-between items-center font-mono text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Redis GET O(1)</span>
                    <span className="text-emerald-700 font-semibold">421 µs</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[94%] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-white hover:border-indigo-300 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-md border border-slate-200">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px] text-indigo-600">insights</span>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Analytics Pipeline
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-3">
                    Real-Time Telemetry
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Granular click logging, referrer tracking, geographic heatmaps, and user-agent classifications streamed asynchronously through partitioned HyperLogLog buffers.
                  </p>
                </div>
                <div className="mt-6 pt-4 bg-slate-50 border border-slate-200/70 rounded-lg p-3">
                  <div className="flex justify-between items-center font-mono text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Live Telemetry Stream</span>
                    <span className="text-indigo-600 font-semibold">100% Async Non-blocking</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full w-[88%] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="bg-white hover:border-indigo-300 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-md border border-slate-200">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px] text-teal-600">terminal</span>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Integration
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-3">
                    RESTful Developer API
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Bearer token auth, granular rate limiting, outgoing webhooks, and modern SDK wrappers for Go, TypeScript, Python, and Rust with zero overhead.
                  </p>
                </div>
                <div className="mt-6 pt-4 bg-slate-50 border border-slate-200/70 rounded-lg p-3 flex items-center justify-between">
                  <code className="font-mono text-xs text-teal-700 font-semibold">
                    curl -X POST api.tinyroute.io
                  </code>
                  <Link
                    to="/api-keys"
                    className="material-symbols-outlined text-[16px] text-slate-400 hover:text-indigo-600"
                    title="View API Docs"
                  >
                    code
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Live Edge Node Map & Global Telemetry Strip */}
          <section className="w-full max-w-[1440px] mx-auto px-6 md:px-8 py-8 mb-12">
            <div className="bg-white rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 border border-slate-200 shadow-sm">
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Global Latency Map</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Resolved at the Edge Closest to Your User
                </h3>
                <p className="text-sm text-slate-600">
                  Requests are served from edge instances in North America, Europe, Asia Pacific, and Latin America. No cold starts, no centralized bottlenecks.
                </p>
                <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>US-East: <strong className="text-emerald-700 font-semibold">0.31ms</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                    <span>EU-Central: <strong className="text-indigo-600 font-semibold">0.44ms</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                    <span>AP-East: <strong className="text-teal-700 font-semibold">0.52ms</strong></span>
                  </div>
                </div>
              </div>

              {/* Recent Routing Telemetry */}
              <div className="w-full lg:w-96 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-slate-800">
                    Recent Routing Telemetry
                  </span>
                  <span className="font-mono text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Streaming
                  </span>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between p-2.5 rounded bg-white border border-slate-200/80 shadow-xs">
                    <span className="text-slate-600 truncate max-w-[140px] font-semibold">/gh-kernel-patch</span>
                    <span className="text-slate-500">FRA · DE</span>
                    <span className="text-emerald-600 font-semibold">0.38ms</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-white border border-slate-200/80 shadow-xs">
                    <span className="text-slate-600 truncate max-w-[140px] font-semibold">/figma-design-spec</span>
                    <span className="text-slate-500">SFO · US</span>
                    <span className="text-emerald-600 font-semibold">0.29ms</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-white border border-slate-200/80 shadow-xs">
                    <span className="text-slate-600 truncate max-w-[140px] font-semibold">/docs-v2-migration</span>
                    <span className="text-slate-500">TYO · JP</span>
                    <span className="text-emerald-600 font-semibold">0.48ms</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-4">
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-600">
              Redis Cluster: <span className="text-emerald-700 font-semibold">99.99% Uptime</span> · <span className="text-indigo-600 font-semibold">0.42ms Latency</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="text-slate-400">© 2025 TinyRoute Architecture</span>
            <Link to="/api-keys" className="hover:text-slate-900 transition-colors">
              Developer API
            </Link>
            <a href="#status" onClick={(e) => { e.preventDefault(); onToast && onToast('All 28 global edge nodes operational.'); }} className="hover:text-slate-900 transition-colors">
              System Status
            </a>
          </div>
        </div>
      </footer>

      {/* QR Modal */}
      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        shortUrl={currentResult?.shortUrl}
        originalUrl={currentResult?.originalUrl}
        onToast={onToast}
      />
    </div>
  );
}
