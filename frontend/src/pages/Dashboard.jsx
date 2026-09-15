import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getUserUrls,
  createShortUrl,
  deleteShortUrl,
  getOverallAnalytics
} from '../services/api';
import {
  Zap,
  Link as LinkIcon,
  TrendingUp,
  Clock,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Trash2,
  Lock,
  Globe,
  Sliders,
  CheckCircle2,
  Calendar,
  Download,
  PlusCircle,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  BarChart2
} from 'lucide-react';
import Modal from '../components/Modal';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State variables
  const [urls, setUrls] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick shorten console form state
  const [destinationUrl, setDestinationUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [accessMode, setAccessMode] = useState('public'); // 'public' | 'protected'
  const [preserveUtm, setPreserveUtm] = useState(true);
  const [instantQr, setInstantQr] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUrlResult, setCreatedUrlResult] = useState(null);

  // Timeframe filter state
  const [timeframe, setTimeframe] = useState('30d');

  // Modal & Toast states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeQrUrl, setActiveQrUrl] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Trigger temporary toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Fetch URLs and Analytics on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [urlsData, analyticsData] = await Promise.all([
          getUserUrls(),
          getOverallAnalytics(),
        ]);
        setUrls(urlsData || []);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle URL shortener submission
  const handleShortenSubmit = async (e) => {
    e.preventDefault();
    if (!destinationUrl) return;

    setIsSubmitting(true);
    try {
      let finalUrl = destinationUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }

      const newUrl = await createShortUrl({
        originalUrl: finalUrl,
        slug: customSlug.trim() || undefined,
        visibility: accessMode,
        tag: customSlug ? '#custom' : '#quick',
      });

      setUrls([newUrl, ...urls]);
      setCreatedUrlResult(newUrl);
      setDestinationUrl('');
      setCustomSlug('');
      triggerToast(`Short URL created: ${newUrl.shortUrl}`);
    } catch (err) {
      triggerToast('Failed to create short URL. Please check your input.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Copy to clipboard
  const handleCopy = (shortUrl, id) => {
    navigator.clipboard.writeText(`https://${shortUrl}`);
    setCopiedId(id);
    triggerToast('Copied short URL to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open QR modal
  const handleOpenQr = (urlObj) => {
    setActiveQrUrl(urlObj);
    setQrModalOpen(true);
  };

  // Prompt delete URL confirmation
  const handlePromptDelete = (urlObj) => {
    setUrlToDelete(urlObj);
    setDeleteModalOpen(true);
  };

  // Confirm delete URL
  const handleConfirmDelete = async () => {
    if (!urlToDelete) return;
    try {
      await deleteShortUrl(urlToDelete.id);
      setUrls(urls.filter((u) => u.id !== urlToDelete.id));
      triggerToast(`Deleted ${urlToDelete.shortUrl}`);
    } catch (err) {
      triggerToast('Error deleting URL');
    } finally {
      setDeleteModalOpen(false);
      setUrlToDelete(null);
    }
  };

  // Export CSV mock
  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Short URL,Original Destination,Clicks,Status,Created'].join(',') +
      '\n' +
      urls
        .map((u) => `"${u.shortUrl}","${u.originalUrl}",${u.clicks},"${u.statusType}","${u.createdDate}"`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tinyroute_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Exported CSV file successfully!');
  };

  // Chart data simulation depending on timeframe
  const chartPoints = {
    '24h': [
      { label: '00:00', value: 120 },
      { label: '04:00', value: 85 },
      { label: '08:00', value: 340 },
      { label: '12:00', value: 580 },
      { label: '16:00', value: 690 },
      { label: '20:00', value: 410 },
      { label: 'Now', value: 520 },
    ],
    '7d': [
      { label: 'Mon', value: 1420 },
      { label: 'Tue', value: 1890 },
      { label: 'Wed', value: 2450 },
      { label: 'Thu', value: 2180 },
      { label: 'Fri', value: 2980 },
      { label: 'Sat', value: 1720 },
      { label: 'Sun', value: 2202 },
    ],
    '30d': [
      { label: 'Oct 1', value: 210 },
      { label: 'Oct 6', value: 380 },
      { label: 'Oct 12', value: 510 },
      { label: 'Oct 18', value: 640 },
      { label: 'Oct 24', value: 890 },
      { label: 'Oct 30', value: 1240 },
      { label: 'Today', value: 1680 },
    ],
    'all': [
      { label: 'Q1', value: 6500 },
      { label: 'Q2', value: 11200 },
      { label: 'Q3', value: 19800 },
      { label: 'Q4', value: 32400 },
    ],
  }[timeframe] || [
    { label: '1', value: 20 },
    { label: '2', value: 40 },
    { label: '3', value: 60 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. WELCOME & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">
              Routing Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Live v2.4 Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global edge redirects, click analytics, and route orchestration for{' '}
            <span className="font-semibold text-slate-800">{user?.email || 'alex@tinyroute.dev'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/urls"
            className="px-3.5 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>View All URLs</span>
          </Link>
        </div>
      </div>

      {/* 2. SHORTEN NEW ROUTE CONSOLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#3525cd] text-white flex items-center justify-center">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <h2 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
              Quick Shorten Route
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">Edge Latency: ~0.8ms</span>
        </div>

        <form onSubmit={handleShortenSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Long URL Input */}
            <div className="md:col-span-8 flex items-center bg-[#eff4ff] rounded-xl px-3.5 py-2.5 border border-slate-200/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <span className="font-mono text-xs text-slate-400 mr-2 select-none">https://</span>
              <input
                type="text"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="Paste long destination URL (e.g. store.company.com/product/launch?ref=twitter)"
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                required
              />
            </div>

            {/* Custom Slug Input */}
            <div className="md:col-span-4 flex items-center bg-[#eff4ff] rounded-xl px-3 py-2.5 border border-slate-200/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <span className="font-mono text-xs text-slate-400 mr-1 select-none">tinyroute.app/</span>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="custom-slug"
                className="w-full bg-transparent text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Options & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {/* Access Mode Radios */}
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60">
                <label className="flex items-center gap-1.5 cursor-pointer px-2 py-0.5 rounded-lg text-slate-700">
                  <input
                    type="radio"
                    name="accessMode"
                    value="public"
                    checked={accessMode === 'public'}
                    onChange={() => setAccessMode('public')}
                    className="accent-indigo-600 cursor-pointer"
                  />
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-medium">Public (301)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer px-2 py-0.5 rounded-lg text-slate-700">
                  <input
                    type="radio"
                    name="accessMode"
                    value="protected"
                    checked={accessMode === 'protected'}
                    onChange={() => setAccessMode('protected')}
                    className="accent-indigo-600 cursor-pointer"
                  />
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-medium">Passcode Gate</span>
                </label>
              </div>

              {/* Toggles */}
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preserveUtm}
                  onChange={(e) => setPreserveUtm(e.target.checked)}
                  className="rounded accent-indigo-600 cursor-pointer"
                />
                <span>Preserve UTM params</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={instantQr}
                  onChange={(e) => setInstantQr(e.target.checked)}
                  className="rounded accent-indigo-600 cursor-pointer"
                />
                <span>Instant Vector QR</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>{isSubmitting ? 'Routing...' : 'Shorten Route'}</span>
            </button>
          </div>
        </form>

        {/* Immediate Result Preview Banner */}
        {createdUrlResult && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-emerald-900">
                    {createdUrlResult.shortUrl}
                  </span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                    Ready to route
                  </span>
                </div>
                <span className="text-xs text-emerald-700 truncate max-w-md block">
                  {createdUrlResult.originalUrl}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(createdUrlResult.shortUrl, 'new-created')}
                className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1 shadow-xs"
              >
                {copiedId === 'new-created' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === 'new-created' ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenQr(createdUrlResult)}
                className="p-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs shadow-xs"
                title="View QR"
              >
                <QrCode className="w-4 h-4" />
              </button>
              <a
                href={createdUrlResult.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs shadow-xs"
                title="Open Link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 3. FOUR KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total URLs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total URLs</span>
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#3525cd] flex items-center justify-center">
              <LinkIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-[#0b1c30]">{urls.length || 128}</span>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8 links this week</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Clicks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-[#0b1c30]">
              {(urls.reduce((acc, curr) => acc + (curr.clicks || 0), 0) || 12842).toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs last period</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Active Links */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Links</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-[#0b1c30]">112</span>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-mono mt-1">
              <span>98.2% health uptime</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Avg Redirect Time */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Redirect Time</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-[#0b1c30]">1.2 ms</span>
            <div className="flex items-center gap-1 text-xs text-indigo-600 font-mono mt-1">
              <span>Sub-millisecond P99</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CHARTS & TELEMETRY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Clicks Over Time SVG Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
                Clicks Over Time
              </h3>
              <p className="text-xs text-slate-500">Real-time edge telemetry aggregated across global nodes</p>
            </div>

            {/* Timeframe pill selector */}
            <div className="flex items-center bg-[#eff4ff] p-1 rounded-xl border border-slate-200/60 text-xs font-semibold">
              {['24h', '7d', '30d', 'all'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    timeframe === t
                      ? 'bg-white text-[#3525cd] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t === 'all' ? 'All Time' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="relative h-56 w-full flex flex-col justify-end pt-4">
            {/* SVG Plot */}
            <svg className="w-full h-44 overflow-visible" viewBox="0 0 600 160">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" />

              {/* Filled Area */}
              <path
                d="M 20 120 Q 120 70, 220 90 T 420 40 T 580 20 L 580 150 L 20 150 Z"
                fill="url(#chartGradient)"
              />

              {/* Smooth Spline Curve */}
              <path
                d="M 20 120 Q 120 70, 220 90 T 420 40 T 580 20"
                fill="none"
                stroke="#3525cd"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="20" cy="120" r="4.5" fill="#3525cd" stroke="white" strokeWidth="2" />
              <circle cx="220" cy="90" r="4.5" fill="#3525cd" stroke="white" strokeWidth="2" />
              <circle cx="420" cy="40" r="4.5" fill="#3525cd" stroke="white" strokeWidth="2" />
              <circle cx="580" cy="20" r="5.5" fill="#3525cd" stroke="white" strokeWidth="2" />
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
              {chartPoints.map((p, idx) => (
                <span key={idx}>{p.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Top Referrers & Top Regions */}
        <div className="space-y-6">
          {/* Top Referrers */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h3 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider mb-3">
              Top Referrers
            </h3>
            <div className="space-y-3">
              {[
                { name: 'GitHub', clicks: '5,393', pct: 42, color: 'bg-indigo-600' },
                { name: 'Twitter / X', clicks: '3,595', pct: 28, color: 'bg-blue-500' },
                { name: 'Direct / App', clicks: '2,440', pct: 19, color: 'bg-emerald-500' },
                { name: 'LinkedIn', clicks: '1,414', pct: 11, color: 'bg-amber-500' },
              ].map((ref) => (
                <div key={ref.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">{ref.name}</span>
                    <span className="font-mono text-slate-500 font-semibold">
                      {ref.clicks} ({ref.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${ref.color}`}
                      style={{ width: `${ref.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Regions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h3 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider mb-3">
              Top Regions
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-[#eff4ff] border border-indigo-100/60">
                <span className="text-slate-500 text-[11px] block">United States (US)</span>
                <span className="font-mono text-sm font-bold text-[#3525cd]">54.8%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#eff4ff] border border-indigo-100/60">
                <span className="text-slate-500 text-[11px] block">Germany (DE)</span>
                <span className="font-mono text-sm font-bold text-[#3525cd]">16.2%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#eff4ff] border border-indigo-100/60">
                <span className="text-slate-500 text-[11px] block">Japan (JP)</span>
                <span className="font-mono text-sm font-bold text-[#3525cd]">12.1%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#eff4ff] border border-indigo-100/60">
                <span className="text-slate-500 text-[11px] block">United Kingdom (UK)</span>
                <span className="font-mono text-sm font-bold text-[#3525cd]">9.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. RECENT ACTIVE ROUTED URLS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
              Recent Active Routes
            </h3>
            <p className="text-xs text-slate-500">Live operational status and click metrics</p>
          </div>
          <Link
            to="/urls"
            className="text-xs font-semibold text-[#3525cd] hover:underline flex items-center gap-1"
          >
            <span>View All ({urls.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#eff4ff] text-slate-600 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Shortlink</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4 text-center">Clicks</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {urls.slice(0, 5).map((url) => (
                <tr key={url.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleOpenQr(url)}
                        className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#3525cd] flex items-center justify-center hover:bg-indigo-100 transition-colors shrink-0"
                        title="Show QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            onClick={() => handleCopy(url.shortUrl, url.id)}
                            className="font-mono text-xs font-bold text-[#3525cd] hover:underline cursor-pointer"
                          >
                            {url.shortUrl}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(url.shortUrl, url.id)}
                            className="text-slate-400 hover:text-indigo-600"
                            title="Copy link"
                          >
                            {copiedId === url.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{url.statusType || '301 Permanent'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs truncate text-xs text-slate-600">
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#3525cd] hover:underline"
                    >
                      {url.originalUrl}
                    </a>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-semibold text-slate-900 text-xs">
                      {url.clicks?.toLocaleString() || 0}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-mono">
                      {url.weeklyGrowth || '+8%'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {url.visibility === 'private' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                        <Lock className="w-3 h-3" /> Private
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-[#3525cd] text-xs font-medium">
                        <Globe className="w-3 h-3" /> Public
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    <span>{url.createdDate}</span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
                        title="Open Destination"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handlePromptDelete(url)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                        title="Delete URL"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Short Route"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to delete{' '}
            <strong className="font-mono text-slate-900">{urlToDelete?.shortUrl}</strong>?
            This will permanently decommission this edge redirect. Any traffic hitting this link will return HTTP 404 Not Found.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm"
            >
              Delete Route
            </button>
          </div>
        </div>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Dynamic Vector QR Code"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-[#eff4ff] rounded-2xl border border-indigo-100">
            <svg className="w-44 h-44 text-[#0b1c30]" fill="currentColor" viewBox="0 0 100 100">
              <rect height="28" rx="4" width="28" x="0" y="0"></rect>
              <rect fill="white" height="20" rx="2" width="20" x="4" y="4"></rect>
              <rect height="12" rx="1" width="12" x="8" y="8"></rect>
              <rect height="28" rx="4" width="28" x="72" y="0"></rect>
              <rect fill="white" height="20" rx="2" width="20" x="76" y="4"></rect>
              <rect height="12" rx="1" width="12" x="80" y="8"></rect>
              <rect height="28" rx="4" width="28" x="0" y="72"></rect>
              <rect fill="white" height="20" rx="2" width="20" x="4" y="76"></rect>
              <rect height="12" rx="1" width="12" x="8" y="80"></rect>
              <circle cx="50" cy="50" fill="#3525cd" r="11"></circle>
            </svg>
          </div>
          <p className="font-mono text-xs font-bold text-[#3525cd]">{activeQrUrl?.shortUrl}</p>
          <p className="text-xs text-slate-500">Scan from any smartphone to test edge routing.</p>
          <button
            type="button"
            onClick={() => {
              triggerToast('Downloaded Vector SVG format');
              setQrModalOpen(false);
            }}
            className="w-full py-2.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md transition-colors"
          >
            Download SVG / PNG
          </button>
        </div>
      </Modal>
    </div>
  );
}
