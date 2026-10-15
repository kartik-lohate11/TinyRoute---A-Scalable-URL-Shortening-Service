import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import QrModal from '../components/QrModal';
import { getRoutes, shortenUrl, toggleRouteStatus, deleteRoute } from '../services/api';

export default function Dashboard({ onToast }) {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // all, enabled, disabled

  // Drawer state for "+ Create New Short Link"
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formUrl, setFormUrl] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formTtl, setFormTtl] = useState('');
  const [isPasscodeEnabled, setIsPasscodeEnabled] = useState(false);
  const [formPasscode, setFormPasscode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // QR Modal state
  const [selectedRouteForQr, setSelectedRouteForQr] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load routes
  const loadRoutes = async () => {
    setIsLoading(true);
    try {
      const res = await getRoutes();
      setRoutes(res.data || []);
    } catch (err) {
      if (onToast) onToast('Failed to retrieve routes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  // Filter routes based on search and status
  const filteredRoutes = routes.filter((item) => {
    const matchesSearch =
      item.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterMode === 'enabled') return item.enabled;
    if (filterMode === 'disabled') return !item.enabled;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRoutes.length / itemsPerPage));
  const displayedRoutes = filteredRoutes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toggle route active state
  const handleToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    // Optimistic UI update
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: newStatus } : r))
    );

    try {
      await toggleRouteStatus(id, newStatus);
      if (onToast) {
        onToast(`Route status updated to ${newStatus ? 'Active' : 'Disabled'}`);
      }
    } catch {
      if (onToast) onToast('Failed to update route status');
      loadRoutes();
    }
  };

  // Delete route
  const handleDelete = async (id, shortCode) => {
    if (!window.confirm(`Are you sure you want to delete tinyroute.io/${shortCode}?`)) {
      return;
    }
    // Optimistic remove
    setRoutes((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteRoute(id);
      if (onToast) onToast(`Purged route /${shortCode} from Redis cluster`);
    } catch {
      if (onToast) onToast('Failed to delete route');
      loadRoutes();
    }
  };

  // Copy handler
  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    if (onToast) onToast(`Copied ${text} to clipboard`);
  };

  // Submit new short link in drawer
  const handleCreateRoute = async (e) => {
    e.preventDefault();
    if (!formUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await shortenUrl({
        url: formUrl.trim(),
        customSlug: formSlug.trim() || undefined,
        expiresAt: formTtl || undefined,
        passcode: isPasscodeEnabled ? formPasscode : undefined,
      });

      if (onToast) {
        onToast(
          res.isMock
            ? 'New route cached & deployed to local edge cluster!'
            : 'New route successfully deployed to Spring Boot Redis engine!'
        );
      }

      // Reset form and reload
      setFormUrl('');
      setFormSlug('');
      setFormTtl('');
      setIsPasscodeEnabled(false);
      setFormPasscode('');
      setIsDrawerOpen(false);
      await loadRoutes();
    } catch (err) {
      if (onToast) onToast(err.message || 'Error creating link');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export CSV helper
  const handleExportCsv = () => {
    const header = 'ID,ShortCode,ShortUrl,OriginalUrl,Clicks,Status,CreatedAt\n';
    const rows = routes
      .map(
        (r) =>
          `"${r.id}","${r.shortCode}","${r.shortUrl}","${r.originalUrl}","${r.clicks}","${
            r.enabled ? 'ACTIVE' : 'DISABLED'
          }","${r.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tinyroute-links-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(a);
    if (onToast) onToast('Exported links to CSV');
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 antialiased flex">
      <Sidebar onToast={onToast} />

      {/* Main Content Area (offset by 64 Tailwind units = 256px for sidebar) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200 z-30 px-6 sm:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fast Redis Engine · Sub-ms edge
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToast && onToast('Display mode synchronized')}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              type="button"
              title="Toggle theme"
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

        {/* Dashboard Workspace */}
        <main className="w-full pt-20 px-6 sm:px-8 py-8 max-w-7xl mx-auto flex flex-col gap-6">
          {/* Sub-navigation & Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                  Links Dashboard
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 shadow-xs text-emerald-700 font-mono text-[11px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Sync (WebSocket connected)
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Manage, monitor, and optimize your sub-millisecond edge routes across Redis nodes.
              </p>
            </div>

            {/* Actions & Creator CTA */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">add_link</span>
                <span>+ Create New Short Link</span>
              </button>
            </div>
          </div>

          {/* Telemetry Metrics Grid (4 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Metric 1: Total Active Links */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  Total Active Links
                </span>
                <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {routes.length || 42}
                </span>
                <span className="font-mono text-xs text-emerald-600 font-semibold flex items-center">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  +4 this week
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 text-slate-500 border-t border-slate-100 text-xs">
                <span>Global routing enabled</span>
                <span className="font-mono text-emerald-600 font-semibold">100% UP</span>
              </div>
            </div>

            {/* Metric 2: Total Click Hits */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  Total Click Hits
                </span>
                <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
                  <span className="material-symbols-outlined text-[18px]">ads_click</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  128,490
                </span>
                <span className="font-mono text-xs text-emerald-600 font-semibold flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +18.2%
                </span>
              </div>
              <div className="w-full flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <svg className="w-24 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 100 20">
                  <path
                    d="M0 18 L15 14 L30 16 L45 8 L60 11 L75 4 L90 7 L100 2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span className="truncate">vs last 30d baseline</span>
              </div>
            </div>

            {/* Metric 3: Top Performing Link */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  Top Performing Route
                </span>
                <div className="p-1.5 rounded-md bg-purple-50 text-purple-600">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </div>
              </div>
              <div className="mb-2">
                <span className="font-mono text-sm text-indigo-600 truncate block font-bold">
                  tinyroute.io/launch
                </span>
                <span className="text-xs text-slate-500">34,120 clicks · 26.5% traffic</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '26.5%' }} />
              </div>
            </div>

            {/* Metric 4: API Quota & Limits */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  API Quota & Limits
                </span>
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-600">
                  <span className="material-symbols-outlined text-[18px]">speed</span>
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-slate-900 font-mono">8,450</span>
                <span className="font-mono text-xs text-slate-500">/ 10,000 req/hr</span>
              </div>
              <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between items-center font-mono text-[11px]">
                  <span className="text-slate-500">84.5% Cap</span>
                  <span className="text-emerald-600 font-semibold">Healthy Redis Engine</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '84.5%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Control Bar */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search short links, slugs, tags, or target URLs..."
                className="w-full bg-transparent text-slate-900 text-sm placeholder-slate-400 focus:outline-none"
              />
              <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 font-mono text-[11px] hidden sm:inline">
                ⌘K
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <select
                  value={filterMode}
                  onChange={(e) => {
                    setFilterMode(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs px-3 py-2 pr-8 rounded-lg cursor-pointer focus:outline-none hover:bg-slate-100 transition-colors"
                >
                  <option value="all">All Links ({routes.length})</option>
                  <option value="enabled">
                    Enabled Only ({routes.filter((r) => r.enabled).length})
                  </option>
                  <option value="disabled">
                    Disabled ({routes.filter((r) => !r.enabled).length})
                  </option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2.5 text-[16px] text-slate-400">
                  expand_more
                </span>
              </div>

              <button
                type="button"
                onClick={handleExportCsv}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                title="Export CSV"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>

              <button
                type="button"
                onClick={loadRoutes}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                title="Reload metrics"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>

          {/* Link Management Data Table */}
          <div className="w-full overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Short URL</th>
                    <th className="py-3 px-4">Original Destination</th>
                    <th className="py-3 px-4 text-right">Clicks / Hits</th>
                    <th className="py-3 px-4">Edge Telemetry</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Created At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-900 text-sm">
                  {displayedRoutes.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-500 text-sm">
                        {isLoading ? 'Loading routing table from Redis...' : 'No routes found.'}
                      </td>
                    </tr>
                  ) : (
                    displayedRoutes.map((row) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50/80 transition-colors group ${
                          !row.enabled ? 'opacity-60' : ''
                        }`}
                      >
                        {/* Short URL */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="flex items-center gap-2">
                            <a
                              href={row.shortUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                            >
                              tinyroute.io/{row.shortCode}
                              <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">
                                open_in_new
                              </span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopy(row.shortUrl)}
                              className="p-1 rounded bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-500 transition-colors"
                              title="Copy Link"
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                content_copy
                              </span>
                            </button>
                            {row.isProtected && (
                              <span
                                className="material-symbols-outlined text-[14px] text-amber-600"
                                title="Passcode Gate Active"
                              >
                                lock
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Original Destination */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-center gap-2 truncate text-slate-600 font-mono text-xs">
                            <span className="w-5 h-5 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-indigo-600 font-bold shrink-0">
                              {row.tag || 'rt'}
                            </span>
                            <span className="truncate text-slate-600" title={row.originalUrl}>
                              {row.originalUrl}
                            </span>
                          </div>
                        </td>

                        {/* Clicks */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
                            {row.clicks?.toLocaleString() || 0}
                            {row.trend && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                  row.trend === 'inactive'
                                    ? 'bg-slate-100 text-slate-400 border-slate-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {row.trend}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Telemetry */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium border ${
                              row.enabled
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-slate-100 border-slate-200 text-slate-500'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                row.enabled ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                            />
                            {row.telemetry || 'HIT 99.4% · 0.38ms'}
                          </span>
                        </td>

                        {/* Status Switch Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={row.enabled}
                              onChange={() => handleToggle(row.id, row.enabled)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                          </label>
                        </td>

                        {/* Created At */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                          {row.createdAt}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const newDest = prompt('Update destination URL:', row.originalUrl);
                                if (newDest && newDest !== row.originalUrl) {
                                  setRoutes((prev) =>
                                    prev.map((r) =>
                                      r.id === row.id ? { ...r, originalUrl: newDest } : r
                                    )
                                  );
                                  if (onToast) onToast('Route destination updated');
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                              title="Edit Route"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedRouteForQr(row)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                              title="View QR Code"
                            >
                              <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (onToast)
                                  onToast(
                                    `Telemetry for /${row.shortCode}: ${row.clicks} hits, 99.4% cache hit rate`
                                  );
                              }}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                              title="Analytics"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                bar_chart
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(row.id, row.shortCode)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Strip */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs font-mono">
              <span className="text-slate-500">
                Showing {Math.min(filteredRoutes.length, (currentPage - 1) * itemsPerPage + 1)} to{' '}
                {Math.min(filteredRoutes.length, currentPage * itemsPerPage)} of{' '}
                {filteredRoutes.length} routes
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCurrentPage(num)}
                    className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                      currentPage === num
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Slide-out Creation Drawer ("New Short Route") */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-[22px]">add_circle</span>
            <h2 className="text-lg font-bold text-slate-900">New Short Route</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleCreateRoute} className="flex-1 overflow-y-auto p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Destination URL */}
            <div>
              <label className="block font-mono text-xs text-slate-800 font-semibold mb-1.5">
                Destination URL *
              </label>
              <div className="flex items-center rounded-lg bg-slate-50 border border-slate-300 px-3 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-600 transition-all">
                <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">
                  link
                </span>
                <input
                  type="url"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://your-super-long-domain.com/path/slug?ref=dashboard"
                  className="w-full bg-transparent text-slate-900 text-xs focus:outline-none font-mono"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Protocols: HTTP, HTTPS, Git, IPFS
              </span>
            </div>

            {/* Custom Slug */}
            <div>
              <label className="block font-mono text-xs text-slate-800 font-semibold mb-1.5">
                Custom Slug (Optional)
              </label>
              <div className="flex items-center rounded-lg bg-slate-50 border border-slate-300 px-3 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-600 transition-all">
                <span className="font-mono text-xs text-slate-500 mr-1">tinyroute.io/</span>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  pattern="[a-zA-Z0-9-_]+"
                  placeholder="custom-slug"
                  className="w-full bg-transparent text-slate-900 font-mono text-xs placeholder-slate-400 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-emerald-600 font-mono font-medium mt-1 block">
                ✓ Available at sub-ms edge
              </span>
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block font-mono text-xs text-slate-800 font-semibold mb-1.5">
                Route Expiration (TTL)
              </label>
              <div className="flex items-center rounded-lg bg-slate-50 border border-slate-300 px-3 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-600 transition-all">
                <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">
                  calendar_month
                </span>
                <input
                  type="datetime-local"
                  value={formTtl}
                  onChange={(e) => setFormTtl(e.target.value)}
                  className="w-full bg-transparent text-slate-800 text-xs font-mono focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Leave empty for non-expiring permanent route
              </span>
            </div>

            {/* Security / Passcode Gate */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-500 text-[18px]">
                    enhanced_encryption
                  </span>
                  <span className="font-mono text-xs text-slate-800 font-medium">Passcode Gate</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPasscodeEnabled}
                    onChange={(e) => setIsPasscodeEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {isPasscodeEnabled && (
                <div className="pt-2 animate-in fade-in duration-150">
                  <input
                    type="password"
                    value={formPasscode}
                    onChange={(e) => setFormPasscode(e.target.value)}
                    placeholder="Enter secret gate key..."
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit buttons */}
          <div className="pt-4 flex items-center gap-3 border-t border-slate-200 mt-6 font-mono text-xs">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="flex-1 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-70"
            >
              {isSubmitting ? 'Deploying...' : 'Deploy to Edge'}
            </button>
          </div>
        </form>
      </div>

      {/* QR Modal */}
      {selectedRouteForQr && (
        <QrModal
          isOpen={true}
          onClose={() => setSelectedRouteForQr(null)}
          shortUrl={selectedRouteForQr.shortUrl}
          originalUrl={selectedRouteForQr.originalUrl}
          onToast={onToast}
        />
      )}
    </div>
  );
}
