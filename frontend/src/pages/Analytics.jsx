import React, { useState, useEffect } from 'react';
import { getOverallAnalytics, getUserUrls } from '../services/api';
import {
  BarChart2,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  Zap,
  Activity,
  ArrowUpRight,
  Shield,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [urls, setUrls] = useState([]);
  const [timeRange, setTimeRange] = useState('30d');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [anData, urlsData] = await Promise.all([
          getOverallAnalytics(),
          getUserUrls(),
        ]);
        setAnalytics(anData);
        setUrls(urlsData || []);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-[#3525cd] uppercase tracking-wider">
            Global Telemetry & Telemetry Logs
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight mt-1">
            Analytics Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time edge metrics, geographic resolution, and platform device distribution
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center bg-[#eff4ff] p-1 rounded-xl border border-slate-200/60 text-xs font-semibold">
          {[
            { key: '24h', label: 'Last 24 Hours' },
            { key: '7d', label: 'Last 7 Days' },
            { key: '30d', label: 'Last 30 Days' },
            { key: '1y', label: '1 Year' },
          ].map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setTimeRange(r.key)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === r.key
                  ? 'bg-white text-[#3525cd] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TOP METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cumulative Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#3525cd] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-[#0b1c30]">49,820</span>
            <span className="block text-[11px] font-mono text-emerald-600 font-semibold mt-0.5">
              +14.2% vs previous period
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unique Visitors</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-[#0b1c30]">38,410</span>
            <span className="block text-[11px] font-mono text-slate-500 font-semibold mt-0.5">
              77.1% unique client IPs
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Global Latency</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-[#0b1c30]">0.38 ms</span>
            <span className="block text-[11px] font-mono text-indigo-600 font-semibold mt-0.5">
              Sub-millisecond Edge TTFB
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">QR Code Scans</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-[#0b1c30]">6,104</span>
            <span className="block text-[11px] font-mono text-emerald-600 font-semibold mt-0.5">
              12.2% of total traffic
            </span>
          </div>
        </div>
      </div>

      {/* 3. CLICK ACTIVITY INTERACTIVE TIMELINE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
              Click Volume & Traffic Ingress
            </h3>
            <p className="text-xs text-slate-500">Hourly aggregation across all live edge redirect rules</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3525cd]"></span>
              <span className="text-slate-700">Direct Clicks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700">QR Code Scans</span>
            </div>
          </div>
        </div>

        {/* SVG Detailed Chart */}
        <div className="relative h-64 w-full flex flex-col justify-end pt-4">
          <svg className="w-full h-52 overflow-visible" viewBox="0 0 700 180">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid */}
            <line x1="0" y1="30" x2="700" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" />
            <line x1="0" y1="75" x2="700" y2="75" stroke="#f1f5f9" strokeDasharray="4 4" />
            <line x1="0" y1="120" x2="700" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" />

            {/* Area */}
            <path
              d="M 20 140 Q 120 70, 220 100 T 420 50 T 560 30 T 680 15 L 680 170 L 20 170 Z"
              fill="url(#areaGrad)"
            />

            {/* Primary line */}
            <path
              d="M 20 140 Q 120 70, 220 100 T 420 50 T 560 30 T 680 15"
              fill="none"
              stroke="#3525cd"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* QR line */}
            <path
              d="M 20 160 Q 120 145, 220 150 T 420 130 T 560 115 T 680 95"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />

            {/* Interactive Data Points */}
            <circle cx="20" cy="140" r="4" fill="#3525cd" stroke="white" strokeWidth="2" />
            <circle cx="220" cy="100" r="4" fill="#3525cd" stroke="white" strokeWidth="2" />
            <circle cx="420" cy="50" r="4" fill="#3525cd" stroke="white" strokeWidth="2" />
            <circle cx="680" cy="15" r="5" fill="#3525cd" stroke="white" strokeWidth="2" />
          </svg>

          <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
            <span>Day 1</span>
            <span>Day 7</span>
            <span>Day 14</span>
            <span>Day 21</span>
            <span>Day 28</span>
            <span>Today (Peak 1,840 clicks)</span>
          </div>
        </div>
      </div>

      {/* 4. PLATFORM, DEVICE & GEOLOCATION BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Device Types */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
            Device Distribution
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Desktop / Workstation', pct: 58, icon: Monitor, color: 'bg-indigo-600' },
              { label: 'Mobile Smartphone', pct: 36, icon: Smartphone, color: 'bg-blue-500' },
              { label: 'Tablet / Embedded', pct: 6, icon: Tablet, color: 'bg-amber-500' },
            ].map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      {d.label}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{d.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Browsers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
            Browser Engines
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Google Chrome', pct: 62.4, color: 'bg-emerald-600' },
              { name: 'Apple Safari', pct: 24.1, color: 'bg-blue-500' },
              { name: 'Mozilla Firefox', pct: 8.8, color: 'bg-amber-500' },
              { name: 'Microsoft Edge', pct: 4.7, color: 'bg-indigo-600' },
            ].map((b) => (
              <div key={b.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">{b.name}</span>
                  <span className="font-mono font-bold text-slate-900">{b.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
            Top Global Regions
          </h3>
          <div className="space-y-2.5">
            {[
              { country: 'United States', flag: '🇺🇸', code: 'US', clicks: '27,301', pct: 54.8 },
              { country: 'Germany', flag: '🇩🇪', code: 'DE', clicks: '8,070', pct: 16.2 },
              { country: 'Japan', flag: '🇯🇵', code: 'JP', clicks: '6,028', pct: 12.1 },
              { country: 'United Kingdom', flag: '🇬🇧', code: 'UK', clicks: '4,683', pct: 9.4 },
            ].map((c) => (
              <div key={c.code} className="flex items-center justify-between p-2 rounded-xl bg-[#eff4ff] text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">{c.flag}</span>
                  <span className="font-medium text-slate-800">{c.country}</span>
                </div>
                <div className="font-mono text-right">
                  <span className="font-bold text-[#3525cd]">{c.pct}%</span>
                  <span className="text-slate-400 text-[11px] block">{c.clicks} clicks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. LIVE CLICK LOGS STREAM */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
              Real-time Ingress Stream
            </h3>
            <p className="text-xs text-slate-500">Live events passing through Anycast edge worker proxies</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Streaming live (0.4s poll)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#eff4ff] text-slate-600 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Client Hash</th>
                <th className="py-3 px-4">Origin Region</th>
                <th className="py-3 px-4">Referrer</th>
                <th className="py-3 px-4 text-right">Edge Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {[
                { time: 'Just now', route: 'tinyroute.app/Ab12Xyz', ip: '172.56.**.**', geo: '🇺🇸 US-East (IAD)', ref: 'github.com', lat: '0.8ms' },
                { time: '3s ago', route: 'tinyroute.app/fall-launch', ip: '82.165.**.**', geo: '🇩🇪 EU-Central (FRA)', ref: 'twitter.com/x', lat: '1.1ms' },
                { time: '11s ago', route: 'tinyroute.app/api-v2-spec', ip: '133.242.**.**', geo: '🇯🇵 AP-Northeast (NRT)', ref: 'Direct / cURL', lat: '0.9ms' },
                { time: '24s ago', route: 'tinyroute.app/Ab12Xyz', ip: '194.28.**.**', geo: '🇬🇧 UK-London (LHR)', ref: 'linkedin.com', lat: '1.2ms' },
                { time: '41s ago', route: 'tinyroute.app/internal-hiring', ip: '24.114.**.**', geo: '🇨🇦 CA-Central (YYZ)', ref: 'slack.com', lat: '0.7ms' },
              ].map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-500">{log.time}</td>
                  <td className="py-3 px-4 text-[#3525cd] font-semibold">{log.route}</td>
                  <td className="py-3 px-4 text-slate-600">{log.ip}</td>
                  <td className="py-3 px-4 text-slate-700">{log.geo}</td>
                  <td className="py-3 px-4 text-slate-500">{log.ref}</td>
                  <td className="py-3 px-4 text-right text-emerald-600 font-semibold">{log.lat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
