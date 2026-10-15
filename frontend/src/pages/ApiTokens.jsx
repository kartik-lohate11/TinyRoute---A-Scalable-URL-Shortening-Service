import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function ApiTokens({ onToast }) {
  const [activeTab, setActiveTab] = useState('curl');
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const [apiKey, setApiKey] = useState('tr_live_9f83a741bc88d402e1a90cc52cbfd9715e4a8b29');
  const maskedKey = 'tr_live_9f83a741bc88d402e1a9••••••••••••';

  const snippets = {
    curl: `curl -X POST https://api.tinyroute.io/v1/shorten \\
  -H "Authorization: Bearer tr_live_9f83a741bc88..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/very-long-url",
    "custom_slug": "my-promo"
  }'`,
    node: `const response = await fetch('https://api.tinyroute.io/v1/shorten', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer tr_live_9f83a741bc88...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com/very-long-url',
    custom_slug: 'my-promo'
  })
});
const payload = await response.json();
console.log(payload.short_url);`,
    python: `import requests

payload = {
    "url": "https://example.com/very-long-url",
    "custom_slug": "my-promo"
}
headers = {
    "Authorization": "Bearer tr_live_9f83a741bc88...",
    "Content-Type": "application/json"
}

res = requests.post("https://api.tinyroute.io/v1/shorten", json=payload, headers=headers)
print(res.json().get("short_url"))`,
    go: `package main

import (
    "bytes"
    "net/http"
)

func main() {
    body := []byte(\`{"url":"https://example.com/very-long-url","custom_slug":"my-promo"}\`)
    req, _ := http.NewRequest("POST", "https://api.tinyroute.io/v1/shorten", bytes.NewBuffer(body))
    req.Header.Set("Authorization", "Bearer tr_live_9f83a741bc88...")
    req.Header.Set("Content-Type", "application/json")
    resp, _ := http.DefaultClient.Do(req)
    defer resp.Body.Close()
}`,
  };

  const handleCopyKey = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(apiKey);
    }
    if (onToast) onToast('API Key copied to clipboard! Keep this token private.');
  };

  const handleRollKey = () => {
    const ok = window.confirm(
      'Regenerating this API key will instantly invalidate existing production services. Continue?'
    );
    if (ok) {
      const newKey = `tr_live_${Math.random().toString(36).substring(2, 10)}${Math.random()
        .toString(36)
        .substring(2, 12)}4a8b29`;
      setApiKey(newKey);
      if (onToast) onToast('New token deployed to Redis edges. Old secret revoked.');
    }
  };

  const handleCopySnippet = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(snippets[activeTab]);
    }
    setCopiedSnippet(true);
    if (onToast) onToast('The request snippet has been copied to your clipboard.');
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 antialiased flex">
      <Sidebar onToast={onToast} />

      {/* Main Content Workspace */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 z-30 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">
              Fast Redis Engine · Sub-ms edge
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToast && onToast('Display settings synchronized')}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Toggle Theme"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">light_mode</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[14px]">person</span>
              </div>
              <span className="font-mono text-xs text-slate-700 font-medium hidden md:inline">
                dev@tinyroute.internal
              </span>
            </div>
          </div>
        </header>

        {/* Workspace */}
        <main className="w-full pt-20 px-6 sm:px-8 py-8 max-w-7xl mx-auto flex flex-col gap-6">
          {/* Section 1: Header Context */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  Developer Console
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-mono">v1 REST Specification</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                Developer Settings & API Keys
              </h1>
              <p className="text-sm text-slate-600">
                Generate and manage programmatic API keys to shorten URLs via high-throughput REST API and Redis cache.
              </p>
            </div>

            {/* Cluster Pill */}
            <div className="flex items-center gap-2.5 self-start lg:self-center bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined text-[18px]">dns</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider leading-none">
                  Cluster Topology
                </span>
                <span className="font-mono text-xs text-slate-800 font-semibold mt-0.5">
                  Production (us-east-1 Redis Cluster)
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Key Management & Realtime Quota (Bento Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* API Key Active Card (8 cols) */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-sm relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <span className="material-symbols-outlined text-[24px]">vpn_key</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-base lg:text-lg font-bold text-slate-900">
                        Default Production Key
                      </h2>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[11px] uppercase tracking-wider font-semibold">
                        Full Access
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Automated programmatic link compression and Redis invalidation access.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                    Active
                  </span>
                </div>
              </div>

              {/* Secret Key Field Display Box */}
              <div className="my-5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">lock</span>
                    <span className="font-mono text-sm sm:text-base font-semibold text-slate-800 tracking-wider truncate select-all">
                      {isKeyVisible ? apiKey : maskedKey}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsKeyVisible(!isKeyVisible)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-all text-xs font-medium shadow-xs font-mono"
                    >
                      <span className="material-symbols-outlined text-[16px] text-slate-500">
                        {isKeyVisible ? 'visibility_off' : 'visibility'}
                      </span>
                      <span>{isKeyVisible ? 'Hide Key' : 'Show Key'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all text-xs font-semibold shadow-xs active:scale-95 font-mono"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      <span>Copy API Key</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Metadata Strip & Dangerous Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-slate-500">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">
                    schedule
                  </span>
                  <span>Created 12 days ago</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-700">Last used: 4 mins ago by Worker-03</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRollKey}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200/70 text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors text-xs font-mono font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    <span>Roll / Regenerate Key</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Rate Limit Quota Card (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <span className="material-symbols-outlined text-[18px]">speed</span>
                  </div>
                  <span className="font-bold text-slate-900 text-sm">Hourly Rate Limit</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
                  15.5% Consumed
                </span>
              </div>
              <div className="my-5 flex flex-col gap-2.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                    1,550
                  </span>
                  <span className="font-mono text-xs font-medium text-slate-400">/ 10,000 reqs</span>
                </div>
                {/* Progress Bar Meter */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/70">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: '15.5%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Normal Throughput
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">Cluster TTL Sync</span>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3.5 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">timer</span>
                  <span className="text-xs text-slate-600 font-medium">Window Reset</span>
                </div>
                <span className="font-mono text-xs text-indigo-600 font-bold">in 38 mins</span>
              </div>
            </div>
          </div>

          {/* Section 3: Interactive Multi-Language Code Snippet & Live Response */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Code Snippet Box (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
              {/* Tabs Bar */}
              <div className="bg-slate-100/80 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 border-b border-slate-200">
                <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg">
                  {['curl', 'node', 'python', 'go'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-md font-mono text-xs transition-all ${
                        activeTab === tab
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900 font-medium'
                      }`}
                    >
                      {tab === 'curl'
                        ? 'cURL'
                        : tab === 'node'
                        ? 'Node / JS'
                        : tab === 'python'
                        ? 'Python'
                        : 'Go'}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleCopySnippet}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition-colors font-mono"
                >
                  <span className="material-symbols-outlined text-[15px] text-slate-500">code</span>
                  <span>{copiedSnippet ? 'Copied!' : 'Copy Snippet'}</span>
                </button>
              </div>

              {/* Editor Terminal */}
              <div className="p-5 lg:p-6 bg-slate-900 font-mono text-xs sm:text-[13px] overflow-x-auto min-h-[290px] flex flex-col justify-center">
                <pre className="text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                  <code>{snippets[activeTab]}</code>
                </pre>
              </div>

              {/* Terminal Footer */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="material-symbols-outlined text-[16px] text-amber-500">bolt</span>
                  Edge Resolution Endpoint
                </span>
                <span className="text-slate-400">Content-Type: application/json</span>
              </div>
            </div>

            {/* Response Payload Viewer (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-slate-100/80 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    200 OK — JSON Response
                  </span>
                </div>
                <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded font-bold">
                  0.38ms
                </span>
              </div>
              <div className="p-5 lg:p-6 bg-slate-900 font-mono text-xs sm:text-[13px] overflow-x-auto min-h-[290px]">
                <pre className="text-slate-200 leading-relaxed font-mono">
                  <code>{`{
  "status": "success",
  "short_url": "https://tinyroute.io/my-promo",
  "original_url": "https://example.com/very-long-url",
  "cache_engine": "redis-cluster-v7",
  "latency_ms": 0.38,
  "qr_code_url": "https://api.tinyroute.io/v1/qr/my-promo.svg"
}`}</code>
                </pre>
              </div>
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">
                    verified
                  </span>
                  Redis Global Propagation Confirmed
                </span>
                <span className="text-slate-400">ETag: W/"1f4-a8c"</span>
              </div>
            </div>
          </div>

          {/* Section 4: Specifications & Error Handling Reference Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Rate Limits & HTTP Error Specifications
                </h3>
                <p className="text-xs text-slate-500">
                  Edge reverse-proxy response contract and machine-readable error topologies.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 uppercase font-mono font-semibold bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
                  RFC 7807 Compliant
                </span>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 text-xs font-mono uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Status Code</th>
                    <th className="py-3 px-4 font-semibold">Reason / Error Identity</th>
                    <th className="py-3 px-4 font-semibold">Description</th>
                    <th className="py-3 px-4 font-semibold">Resolution Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {/* 200 OK */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs">
                        200 OK
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-900 font-medium text-xs">
                      SUCCESS_ROUTE_STORED
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      Link mapped, compressed, and written to primary Redis hash.
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      Direct redirect ready at edge.
                    </td>
                  </tr>

                  {/* 400 Bad Request */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs">
                        400 Bad Request
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-900 font-medium text-xs">
                      ERR_MALFORMED_URI
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      Invalid URL format or unsupported schema (requires HTTP/HTTPS).
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      Check target URL encoding.
                    </td>
                  </tr>

                  {/* 409 Conflict */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs">
                        409 Conflict
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-900 font-medium text-xs">
                      ERR_SLUG_COLLISION
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      Requested{' '}
                      <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">
                        custom_slug
                      </code>{' '}
                      is already allocated to another destination.
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      Select unique custom slug or omit.
                    </td>
                  </tr>

                  {/* 429 Too Many Requests */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs">
                        429 Too Many Requests
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rose-600 font-semibold text-xs">
                      ERR_RATE_LIMIT_EXCEEDED
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      Hourly quota ceiling reached or guest limit cap (5/5 burst exhausted).
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      Honor Retry-After header or upgrade tier.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
